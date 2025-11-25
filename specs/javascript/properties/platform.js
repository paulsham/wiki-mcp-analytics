/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * platform property definition
 * Platform or operating system.
 *
 * @type {Property}
 */
export const platform = {
  name: 'platform',
  type: 'string',
  constraints: 'enum: web, ios, android, windows, macos, linux',
  description: 'Platform or operating system.',
  usage: 'Critical for cross-platform analysis.'
};

export default platform;
