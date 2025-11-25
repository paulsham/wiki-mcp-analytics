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
 * file_uploaded event
 * User uploaded a file to a project
 *
 * Table: Project Events
 * Property groups: user_context, session_context
 *
 * @type {Event}
 */
export const file_uploaded = {
  event_name: 'file_uploaded',
  description: 'User uploaded a file to a project',
  table: 'Project Events',
  property_groups: [
    'user_context',
    'session_context'
  ],
  additional_properties: [
    'project_id',
    'file_type',
    'file_size_bytes'
  ],
  notes: 'Fire after successful upload. Monitor file type distribution and storage usage.'
};

export default file_uploaded;
