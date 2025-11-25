/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * total_steps property definition
 * Total number of steps in the onboarding flow.
 *
 * @type {Property}
 */
export const total_steps = {
  name: 'total_steps',
  type: 'number',
  constraints: null,
  description: 'Total number of steps in the onboarding flow.',
  usage: 'Calculate completion percentage.'
};

export default total_steps;
