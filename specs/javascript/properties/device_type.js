/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * device_type property definition
 * Type of device being used.
 *
 * @type {Property}
 */
export const device_type = {
  name: 'device_type',
  type: 'string',
  constraints: 'enum: mobile, tablet, desktop, tv, watch',
  description: 'Type of device being used.',
  usage: 'Include in device_info group for platform-specific analysis.'
};

export default device_type;
