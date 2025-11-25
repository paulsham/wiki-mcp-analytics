/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * verification_method property definition
 * How the user verified their email.
 *
 * @type {Property}
 */
export const verification_method = {
  name: 'verification_method',
  type: 'string',
  constraints: 'enum: link, code',
  description: 'How the user verified their email.',
  usage: 'Analyze verification preferences.'
};

export default verification_method;
