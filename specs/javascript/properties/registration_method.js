/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * registration_method property definition
 * Method used to register an account.
 *
 * @type {Property}
 */
export const registration_method = {
  name: 'registration_method',
  type: 'string',
  constraints: 'enum: email, google, facebook, apple, github',
  description: 'Method used to register an account.',
  usage: 'Track registration source for conversion analysis.'
};

export default registration_method;
