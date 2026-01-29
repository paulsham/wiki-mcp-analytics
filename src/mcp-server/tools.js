/**
 * MCP tool definitions and handlers
 */

import {
  events,
  eventsMap,
  propertiesMap,
  propertyGroups,
  userProperties,
  userPropertiesMap,
  splitMultiLine,
  getExpandedProperties,
} from './data.js';

import { NotFoundError } from './errors.js';

export const tools = {
  get_event_implementation: {
    description: 'Get complete event specification with all properties expanded. Use when implementing tracking code.',
    inputSchema: {
      type: 'object',
      properties: {
        event_name: {
          type: 'string',
          description: 'Name of the event to retrieve'
        }
      },
      required: ['event_name']
    },
    handler: async (args) => {
      const event = eventsMap.get(args.event_name);
      if (!event) {
        throw new NotFoundError('Event', args.event_name);
      }

      const expanded = getExpandedProperties(event);
      return {
        event: event.event_name,
        description: event.event_description,
        table: event.event_table,
        notes: event.notes || null,
        property_groups: expanded.property_groups,
        additional_properties: expanded.additional_properties
      };
    }
  },

  validate_event_payload: {
    description: 'Validate a tracking implementation payload against the event spec. Returns errors, warnings, and valid fields.',
    inputSchema: {
      type: 'object',
      properties: {
        event_name: {
          type: 'string',
          description: 'Name of the event to validate against'
        },
        payload: {
          type: 'object',
          description: 'The payload object to validate'
        }
      },
      required: ['event_name', 'payload']
    },
    handler: async (args) => {
      const event = eventsMap.get(args.event_name);
      if (!event) {
        throw new NotFoundError('Event', args.event_name);
      }

      const expanded = getExpandedProperties(event);
      const errors = [];
      const warnings = [];
      const validFields = [];

      // Collect all expected properties
      const expectedProps = new Map();
      for (const group of expanded.property_groups) {
        for (const prop of group.properties) {
          expectedProps.set(prop.name, prop);
        }
      }
      for (const prop of expanded.additional_properties) {
        expectedProps.set(prop.name, prop);
      }

      // Check provided fields
      for (const [key, value] of Object.entries(args.payload)) {
        const prop = expectedProps.get(key);
        if (!prop) {
          warnings.push({ field: key, issue: 'Unknown property not in spec' });
          continue;
        }

        // Remove from expected (field was provided, even if invalid)
        expectedProps.delete(key);

        // Type validation
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        const expectedType = prop.type === 'timestamp' ? 'string' : prop.type;

        if (expectedType !== actualType && expectedType !== 'unknown') {
          errors.push({
            field: key,
            issue: 'Type mismatch',
            expected: prop.type,
            got: actualType
          });
          continue;
        }

        // Constraint validation
        if (prop.constraints && prop.constraints !== '-') {
          if (prop.constraints.startsWith('enum:')) {
            const allowedValues = prop.constraints.substring(5).split(',').map(s => s.trim());
            if (!allowedValues.includes(value)) {
              errors.push({
                field: key,
                issue: 'Invalid enum value',
                expected: allowedValues,
                got: value
              });
              continue;
            }
          } else if (prop.constraints.startsWith('regex:')) {
            const pattern = prop.constraints.substring(6).trim();
            try {
              const regex = new RegExp(pattern);
              if (!regex.test(value)) {
                errors.push({
                  field: key,
                  issue: 'Regex validation failed',
                  expected: pattern,
                  got: value
                });
                continue;
              }
            } catch (e) {
              // Invalid regex pattern in spec
            }
          }
        }

        validFields.push(key);
      }

      // Check for missing properties
      for (const [name] of expectedProps) {
        warnings.push({ field: name, issue: 'Missing property' });
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        valid_fields: validFields
      };
    }
  },

  search_events: {
    description: 'Search for events by name, description, table, or property usage.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term for event name or description'
        },
        table: {
          type: 'string',
          description: 'Filter by event table'
        },
        has_property: {
          type: 'string',
          description: 'Filter events that include this property'
        }
      }
    },
    handler: async (args) => {
      let results = [...events];

      // Filter by query
      if (args.query) {
        const query = args.query.toLowerCase();
        results = results.filter(e =>
          e.event_name.toLowerCase().includes(query) ||
          e.event_description.toLowerCase().includes(query)
        );
      }

      // Filter by table
      if (args.table) {
        const table = args.table.toLowerCase();
        results = results.filter(e =>
          e.event_table.toLowerCase().includes(table)
        );
      }

      // Filter by property
      if (args.has_property) {
        results = results.filter(e => {
          const expanded = getExpandedProperties(e);
          const allProps = [
            ...expanded.property_groups.flatMap(g => g.properties.map(p => p.name)),
            ...expanded.additional_properties.map(p => p.name)
          ];
          return allProps.includes(args.has_property);
        });
      }

      return results.map(e => {
        const expanded = getExpandedProperties(e);
        const propertyCount =
          expanded.property_groups.reduce((sum, g) => sum + g.properties.length, 0) +
          expanded.additional_properties.length;

        return {
          event_name: e.event_name,
          description: e.event_description,
          table: e.event_table,
          property_count: propertyCount
        };
      });
    }
  },

  get_property_details: {
    description: 'Get property definition and see where it is used across events and property groups.',
    inputSchema: {
      type: 'object',
      properties: {
        property_name: {
          type: 'string',
          description: 'Name of the property to retrieve'
        }
      },
      required: ['property_name']
    },
    handler: async (args) => {
      const prop = propertiesMap.get(args.property_name);
      if (!prop) {
        throw new NotFoundError('Property', args.property_name);
      }

      // Find usage in property groups
      const usedInGroups = propertyGroups
        .filter(g => splitMultiLine(g.properties).includes(args.property_name))
        .map(g => g.group_name);

      // Find usage in events (direct additional properties)
      const usedInEvents = events
        .filter(e => splitMultiLine(e.additional_properties).includes(args.property_name))
        .map(e => e.event_name);

      // Find events that use this property via groups
      const eventsViaGroups = events
        .filter(e => {
          const eventGroups = splitMultiLine(e.property_groups);
          return eventGroups.some(groupName => usedInGroups.includes(groupName));
        })
        .map(e => e.event_name);

      return {
        name: prop.property_name,
        type: prop.type,
        constraints: prop.constraints || null,
        description: prop.description,
        usage: prop.usage || null,
        used_in_groups: usedInGroups,
        used_in_events_directly: usedInEvents,
        used_in_events_via_groups: eventsViaGroups
      };
    }
  },

  get_related_events: {
    description: 'Find events in the same table/flow as a given event.',
    inputSchema: {
      type: 'object',
      properties: {
        event_name: {
          type: 'string',
          description: 'Name of the event to find related events for'
        }
      },
      required: ['event_name']
    },
    handler: async (args) => {
      const event = eventsMap.get(args.event_name);
      if (!event) {
        throw new NotFoundError('Event', args.event_name);
      }

      const relatedEvents = events
        .filter(e => e.event_table === event.event_table && e.event_name !== args.event_name)
        .map(e => ({
          event_name: e.event_name,
          description: e.event_description
        }));

      return {
        event: args.event_name,
        table: event.event_table,
        related_events: relatedEvents
      };
    }
  },

  get_user_property_details: {
    description: 'Get user property definition. User properties are custom properties set on user profiles via identify() or setUserProperties().',
    inputSchema: {
      type: 'object',
      properties: {
        property_name: {
          type: 'string',
          description: 'Name of the user property to retrieve'
        }
      },
      required: ['property_name']
    },
    handler: async (args) => {
      const prop = userPropertiesMap.get(args.property_name);
      if (!prop) {
        throw new NotFoundError('User property', args.property_name);
      }

      return {
        name: prop.property_name,
        type: prop.type,
        constraints: prop.constraints || null,
        set_once: prop.set_once?.toLowerCase() === 'yes',
        description: prop.description
      };
    }
  },

  search_user_properties: {
    description: 'Search for user properties by name, description, or filter by set_once behavior.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term for property name or description'
        },
        set_once: {
          type: 'boolean',
          description: 'Set to true to show only set_once properties. False or omit to show all.'
        }
      }
    },
    handler: async (args) => {
      let results = [...userProperties];

      // Filter by query
      if (args.query) {
        const query = args.query.toLowerCase();
        results = results.filter(p =>
          p.property_name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }

      // Filter by set_once (only when true)
      if (args.set_once === true) {
        results = results.filter(p => p.set_once?.toLowerCase() === 'yes');
      }

      return results.map(p => ({
        name: p.property_name,
        type: p.type,
        constraints: p.constraints || null,
        set_once: p.set_once?.toLowerCase() === 'yes',
        description: p.description
      }));
    }
  },

  validate_user_properties: {
    description: 'Validate user properties payload against the spec. Checks property names, types, constraints, and warns if set_once properties are used with the wrong operation.',
    inputSchema: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          enum: ['set', 'set_once'],
          description: 'The operation being used (set or set_once)'
        },
        payload: {
          type: 'object',
          description: 'The user properties payload to validate'
        }
      },
      required: ['operation', 'payload']
    },
    handler: async (args) => {
      const errors = [];
      const warnings = [];
      const validFields = [];

      for (const [key, value] of Object.entries(args.payload)) {
        const prop = userPropertiesMap.get(key);

        if (!prop) {
          warnings.push({ field: key, issue: 'Unknown user property not in spec' });
          continue;
        }

        // Check operation vs set_once mismatch
        const isSetOnce = prop.set_once?.toLowerCase() === 'yes';
        if (isSetOnce && args.operation === 'set') {
          warnings.push({
            field: key,
            issue: 'Property is set_once but using set operation',
            suggestion: 'Use set_once operation to ensure value is only set if not already set'
          });
        }
        if (!isSetOnce && args.operation === 'set_once') {
          warnings.push({
            field: key,
            issue: 'Property is not set_once but using set_once operation',
            suggestion: 'Use set operation for properties that can be updated'
          });
        }

        // Type validation
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        const expectedType = prop.type === 'timestamp' ? 'string' : prop.type;

        if (expectedType !== actualType && expectedType !== 'unknown') {
          errors.push({
            field: key,
            issue: 'Type mismatch',
            expected: prop.type,
            got: actualType
          });
          continue;
        }

        // Constraint validation
        if (prop.constraints && prop.constraints !== '-') {
          if (prop.constraints.startsWith('enum:')) {
            const allowedValues = prop.constraints.substring(5).split(',').map(s => s.trim());
            if (!allowedValues.includes(value)) {
              errors.push({
                field: key,
                issue: 'Invalid enum value',
                expected: allowedValues,
                got: value
              });
              continue;
            }
          } else if (prop.constraints.startsWith('regex:')) {
            const pattern = prop.constraints.substring(6).trim();
            try {
              const regex = new RegExp(pattern);
              if (!regex.test(value)) {
                errors.push({
                  field: key,
                  issue: 'Regex validation failed',
                  expected: pattern,
                  got: value
                });
                continue;
              }
            } catch (e) {
              // Invalid regex pattern in spec
            }
          }
        }

        validFields.push(key);
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        valid_fields: validFields
      };
    }
  }
};
