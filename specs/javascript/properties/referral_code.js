/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * referral_code property definition
 * Six-character alphanumeric referral code.
 *
 * @type {Property}
 */
export const referral_code = {
  name: 'referral_code',
  type: 'string',
  constraints: 'regex: ^[A-Z0-9]{6}$',
  description: 'Six-character alphanumeric referral code.',
  usage: 'Track referral program effectiveness.'
};

export default referral_code;
