/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * onboarding_version property definition
 * Version identifier for the onboarding flow.
 *
 * @type {Property}
 */
export const onboarding_version = {
  name: 'onboarding_version',
  type: 'string',
  constraints: null,
  description: 'Version identifier for the onboarding flow.',
  usage: 'A/B test different onboarding experiences.'
};

export default onboarding_version;
