/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * step_name property definition
 * Name of the onboarding step completed.
 *
 * @type {Property}
 */
export const step_name = {
  name: 'step_name',
  type: 'string',
  constraints: null,
  description: 'Name of the onboarding step completed.',
  usage: 'Track onboarding funnel progression.'
};

export default step_name;
