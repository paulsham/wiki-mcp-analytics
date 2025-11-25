/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * session_id property definition
 * Unique identifier for the user session.
 *
 * @type {Property}
 */
export const session_id = {
  name: 'session_id',
  type: 'string',
  constraints: 'regex: ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
  description: 'Unique identifier for the user session.',
  usage: 'Group events within a single user session.'
};

export default session_id;
