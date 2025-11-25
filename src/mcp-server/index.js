/**
 * Wiki Analytics MCP Server
 * Provides tools for querying and validating analytics event specifications
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  loadData,
  warnIfOutdated,
  properties,
  propertyGroups,
  events,
  propertiesMap,
  propertyGroupsMap,
  eventsMap,
  splitMultiLine,
  getExpandedProperties,
} from './data.js';

import { tools } from './tools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..', '..');
const SPECS_DIR = join(PROJECT_ROOT, 'specs', 'csv');

const packageJson = JSON.parse(
  readFileSync(join(PROJECT_ROOT, 'package.json'), 'utf-8')
);

// Store outdated warning for appending to tool responses
let outdatedWarning = null;

/**
 * Create and configure the MCP server
 */
function createServer() {
  return new Server(
    {
      name: packageJson.name,
      version: packageJson.version,
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );
}

/**
 * Register tool handlers on the server
 */
function registerTools(server) {
  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: Object.entries(tools).map(([name, tool]) => ({
        name,
        description: tool.description,
        inputSchema: tool.inputSchema
      }))
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = tools[name];

    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const result = await tool.handler(args || {});

    // Prepend outdated warning if present
    let responseText = JSON.stringify(result, null, 2);
    if (outdatedWarning) {
      responseText = `⚠️  Warning: ${outdatedWarning}\n\n${responseText}`;
    }

    return {
      content: [
        {
          type: 'text',
          text: responseText
        }
      ]
    };
  });
}

/**
 * Register resource handlers on the server
 */
function registerResources(server) {
  // List available resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const resources = [
      {
        uri: 'analytics://specs',
        name: 'All Analytics Specs',
        description: 'Complete analytics specification with all events, properties, and property groups',
        mimeType: 'application/json'
      },
      ...events.map(e => ({
        uri: `analytics://events/${e.event_name}`,
        name: e.event_name,
        description: e.event_description,
        mimeType: 'application/json'
      })),
      ...propertyGroups.map(g => ({
        uri: `analytics://property-groups/${g.group_name}`,
        name: g.group_name,
        description: g.description,
        mimeType: 'application/json'
      })),
      ...properties.map(p => ({
        uri: `analytics://properties/${p.property_name}`,
        name: p.property_name,
        description: p.description,
        mimeType: 'application/json'
      }))
    ];

    return { resources };
  });

  // Read resource content
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    let content;

    if (uri === 'analytics://specs') {
      content = {
        properties: properties.map(p => ({
          name: p.property_name,
          type: p.type,
          constraints: p.constraints,
          description: p.description,
          usage: p.usage
        })),
        property_groups: propertyGroups.map(g => ({
          name: g.group_name,
          description: g.description,
          properties: splitMultiLine(g.properties)
        })),
        events: events.map(e => ({
          name: e.event_name,
          description: e.event_description,
          table: e.event_table,
          property_groups: splitMultiLine(e.property_groups),
          additional_properties: splitMultiLine(e.additional_properties),
          notes: e.notes
        }))
      };
    } else if (uri.startsWith('analytics://events/')) {
      const eventName = uri.replace('analytics://events/', '');
      const event = eventsMap.get(eventName);
      if (!event) throw new Error(`Event not found: ${eventName}`);

      const expanded = getExpandedProperties(event);
      content = {
        event: event.event_name,
        description: event.event_description,
        table: event.event_table,
        notes: event.notes,
        property_groups: expanded.property_groups,
        additional_properties: expanded.additional_properties
      };
    } else if (uri.startsWith('analytics://property-groups/')) {
      const groupName = uri.replace('analytics://property-groups/', '');
      const group = propertyGroupsMap.get(groupName);
      if (!group) throw new Error(`Property group not found: ${groupName}`);

      content = {
        name: group.group_name,
        description: group.description,
        properties: splitMultiLine(group.properties).map(propName => {
          const prop = propertiesMap.get(propName);
          return prop ? {
            name: prop.property_name,
            type: prop.type,
            constraints: prop.constraints,
            description: prop.description
          } : { name: propName };
        })
      };
    } else if (uri.startsWith('analytics://properties/')) {
      const propName = uri.replace('analytics://properties/', '');
      const prop = propertiesMap.get(propName);
      if (!prop) throw new Error(`Property not found: ${propName}`);

      content = {
        name: prop.property_name,
        type: prop.type,
        constraints: prop.constraints,
        description: prop.description,
        usage: prop.usage
      };
    } else {
      throw new Error(`Unknown resource URI: ${uri}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(content, null, 2)
        }
      ]
    };
  });
}

/**
 * Main entry point
 */
async function main() {
  // Load data
  loadData(SPECS_DIR);

  // Check if repo is outdated and store warning
  outdatedWarning = warnIfOutdated(PROJECT_ROOT);

  // Create and configure server
  const server = createServer();
  registerTools(server);
  registerResources(server);

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Wiki Analytics MCP Server running on stdio');

  // Log warning to both stderr and MCP if repo is outdated
  if (outdatedWarning) {
    console.error(`Warning: ${outdatedWarning}`);
    await server.sendLoggingMessage({
      level: 'warning',
      logger: 'git-sync',
      data: outdatedWarning
    });
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
