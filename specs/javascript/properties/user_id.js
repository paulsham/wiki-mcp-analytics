/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * user_id property definition
 * Unique identifier for the user. Generated at registration and immutable.
 *
 * @type {Property}
 */
export const user_id = {
  name: 'user_id',
  type: 'string',
  constraints: 'regex: ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
  description: 'Unique identifier for the user. Generated at registration and immutable.',
  usage: 'Include in all events where user can be identified.'
};

export default user_id;
