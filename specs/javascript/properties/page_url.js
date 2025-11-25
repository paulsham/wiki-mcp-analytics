/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * page_url property definition
 * Full URL of the current page.
 *
 * @type {Property}
 */
export const page_url = {
  name: 'page_url',
  type: 'string',
  constraints: null,
  description: 'Full URL of the current page.',
  usage: 'Track page-level engagement and navigation paths.'
};

export default page_url;
