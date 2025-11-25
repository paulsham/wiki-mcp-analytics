/**
 * @typedef {Object} PropertyGroup
 * @property {string} name
 * @property {string} description
 * @property {string[]} properties - Property names included in this group
 */

/**
 * session_context property group
 * Session-level tracking information
 *
 * @type {PropertyGroup}
 */
export const session_context = {
  name: 'session_context',
  description: 'Session-level tracking information',
  properties: [
    'session_id',
    'session_start_time',
    'session_count'
  ]
};

export default session_context;
