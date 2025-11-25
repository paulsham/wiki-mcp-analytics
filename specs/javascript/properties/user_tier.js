/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * user_tier property definition
 * Current subscription tier of the user.
 *
 * @type {Property}
 */
export const user_tier = {
  name: 'user_tier',
  type: 'string',
  constraints: 'enum: free, basic, premium, enterprise',
  description: 'Current subscription tier of the user.',
  usage: 'Segment analysis by subscription level.'
};

export default user_tier;
