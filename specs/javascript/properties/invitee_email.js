/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * invitee_email property definition
 * Email address of the invited collaborator.
 *
 * @type {Property}
 */
export const invitee_email = {
  name: 'invitee_email',
  type: 'string',
  constraints: 'regex: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  description: 'Email address of the invited collaborator.',
  usage: 'Track invitation patterns and collaboration growth.'
};

export default invitee_email;
