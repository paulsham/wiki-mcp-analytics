/**
 * @typedef {Object} PropertyGroup
 * @property {string} name
 * @property {string} description
 * @property {string[]} properties - Property names included in this group
 */

/**
 * page_context property group
 * Information about the current page
 *
 * @type {PropertyGroup}
 */
export const page_context = {
  name: 'page_context',
  description: 'Information about the current page',
  properties: [
    'page_url',
    'page_title',
    'referrer'
  ]
};

export default page_context;
