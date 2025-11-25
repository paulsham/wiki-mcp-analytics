/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * skipped property definition
 * Whether the user skipped this step.
 *
 * @type {Property}
 */
export const skipped = {
  name: 'skipped',
  type: 'boolean',
  constraints: null,
  description: 'Whether the user skipped this step.',
  usage: 'Identify commonly skipped steps.'
};

export default skipped;
