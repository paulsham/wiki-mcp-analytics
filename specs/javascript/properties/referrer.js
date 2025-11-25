/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * referrer property definition
 * URL of the referring page.
 *
 * @type {Property}
 */
export const referrer = {
  name: 'referrer',
  type: 'string',
  constraints: null,
  description: 'URL of the referring page.',
  usage: 'Track traffic sources and user journeys.'
};

export default referrer;
