/**
 * @typedef {Object} PropertyGroup
 * @property {string} name
 * @property {string} description
 * @property {string[]} properties - Property names included in this group
 */

/**
 * user_context property group
 * Common user identification properties used across most events
 *
 * @type {PropertyGroup}
 */
export const user_context = {
  name: 'user_context',
  description: 'Common user identification properties used across most events',
  properties: [
    'user_id',
    'email',
    'account_created_at',
    'user_tier'
  ]
};

export default user_context;
