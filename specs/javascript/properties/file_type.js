/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * file_type property definition
 * MIME type or extension of the uploaded file.
 *
 * @type {Property}
 */
export const file_type = {
  name: 'file_type',
  type: 'string',
  constraints: null,
  description: 'MIME type or extension of the uploaded file.',
  usage: 'Track file type distribution for storage optimization.'
};

export default file_type;
