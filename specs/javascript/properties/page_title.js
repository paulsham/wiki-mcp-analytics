/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * page_title property definition
 * Title of the current page.
 *
 * @type {Property}
 */
export const page_title = {
  name: 'page_title',
  type: 'string',
  constraints: null,
  description: 'Title of the current page.',
  usage: 'Human-readable page identification.'
};

export default page_title;
