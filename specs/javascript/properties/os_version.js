/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * os_version property definition
 * Operating system version string.
 *
 * @type {Property}
 */
export const os_version = {
  name: 'os_version',
  type: 'string',
  constraints: null,
  description: 'Operating system version string.',
  usage: 'Track OS-specific issues and feature adoption.'
};

export default os_version;
