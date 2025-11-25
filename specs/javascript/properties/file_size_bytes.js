/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * file_size_bytes property definition
 * Size of the uploaded file in bytes.
 *
 * @type {Property}
 */
export const file_size_bytes = {
  name: 'file_size_bytes',
  type: 'number',
  constraints: null,
  description: 'Size of the uploaded file in bytes.',
  usage: 'Monitor storage usage and identify large uploads.'
};

export default file_size_bytes;
