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
 * collaborator_invited event
 * User invited a collaborator to a project
 *
 * Table: Project Events
 * Property groups: user_context, session_context
 *
 * @type {Event}
 */
export const collaborator_invited = {
  event_name: 'collaborator_invited',
  description: 'User invited a collaborator to a project',
  table: 'Project Events',
  property_groups: [
    'user_context',
    'session_context'
  ],
  additional_properties: [
    'project_id',
    'invitee_email',
    'permission_level'
  ],
  notes: 'Fire when invitation is sent. Track collaboration adoption and permission patterns.'
};

export default collaborator_invited;
