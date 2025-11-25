/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * step_number property definition
 * Numeric position of the step in the flow.
 *
 * @type {Property}
 */
export const step_number = {
  name: 'step_number',
  type: 'number',
  constraints: null,
  description: 'Numeric position of the step in the flow.',
  usage: 'Order steps for funnel analysis.'
};

export default step_number;
