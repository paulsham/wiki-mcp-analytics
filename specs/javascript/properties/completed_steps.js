/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * completed_steps property definition
 * Number of steps the user completed.
 *
 * @type {Property}
 */
export const completed_steps = {
  name: 'completed_steps',
  type: 'number',
  constraints: null,
  description: 'Number of steps the user completed.',
  usage: 'Track partial completions.'
};

export default completed_steps;
