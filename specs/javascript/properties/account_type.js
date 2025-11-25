/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * account_type property definition
 * Type of account created.
 *
 * @type {Property}
 */
export const account_type = {
  name: 'account_type',
  type: 'string',
  constraints: 'enum: personal, team, enterprise',
  description: 'Type of account created.',
  usage: 'Segment users by account type.'
};

export default account_type;
