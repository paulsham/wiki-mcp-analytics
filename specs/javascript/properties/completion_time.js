/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * completion_time property definition
 * Seconds spent on this step.
 *
 * @type {Property}
 */
export const completion_time = {
  name: 'completion_time',
  type: 'number',
  constraints: null,
  description: 'Seconds spent on this step.',
  usage: 'Identify slow or confusing steps.'
};

export default completion_time;
