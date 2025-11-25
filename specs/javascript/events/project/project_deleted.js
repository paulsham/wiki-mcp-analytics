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
 * project_deleted event
 * User deleted an existing project
 *
 * Table: Project Events
 * Property groups: user_context, session_context
 *
 * @type {Event}
 */
export const project_deleted = {
  event_name: 'project_deleted',
  description: 'User deleted an existing project',
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
  notes: 'Fire after project deletion is complete.'
};

export default project_deleted;
