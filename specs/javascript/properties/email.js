/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * email property definition
 * User's email address.
 *
 * @type {Property}
 */
export const email = {
  name: 'email',
  type: 'string',
  constraints: 'regex: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  description: 'User\'s email address.',
  usage: 'Include when email context is relevant.'
};

export default email;
