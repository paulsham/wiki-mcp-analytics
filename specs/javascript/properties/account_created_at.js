/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * account_created_at property definition
 * Timestamp when the user account was created.
 *
 * @type {Property}
 */
export const account_created_at = {
  name: 'account_created_at',
  type: 'timestamp',
  constraints: null,
  description: 'Timestamp when the user account was created.',
  usage: 'Track account age for cohort analysis.'
};

export default account_created_at;
