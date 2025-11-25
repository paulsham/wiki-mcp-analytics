/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * session_count property definition
 * Total number of sessions for this user.
 *
 * @type {Property}
 */
export const session_count = {
  name: 'session_count',
  type: 'number',
  constraints: null,
  description: 'Total number of sessions for this user.',
  usage: 'Track user engagement over time.'
};

export default session_count;
