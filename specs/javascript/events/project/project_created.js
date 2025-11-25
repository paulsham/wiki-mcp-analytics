/**
 * @typedef {Object} Event
 * @property {string} event_name
 * @property {string} description
 * @property {string} table
 * @property {string[]} property_groups - Names of property groups included
 * @property {string[]} additional_properties - Names of additional properties
 * @property {string} [notes]
 */

/**
 * project_created event
 * User created a new project
 *
 * Table: Project Events
 * Property groups: user_context, session_context
 *
 * @type {Event}
 */
export const project_created = {
  event_name: 'project_created',
  description: 'User created a new project',
  table: 'Project Events',
  property_groups: [
    'user_context',
    'session_context'
  ],
  additional_properties: [
    'project_id',
    'project_name',
    'project_template'
  ],
  notes: 'Fire after project is successfully created. Track template usage for product decisions.'
};

export default project_created;
