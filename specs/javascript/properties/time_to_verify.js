/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * time_to_verify property definition
 * Seconds between registration and email verification.
 *
 * @type {Property}
 */
export const time_to_verify = {
  name: 'time_to_verify',
  type: 'number',
  constraints: null,
  description: 'Seconds between registration and email verification.',
  usage: 'Measure verification funnel speed.'
};

export default time_to_verify;
