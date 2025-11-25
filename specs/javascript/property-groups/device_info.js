/**
 * @typedef {Object} PropertyGroup
 * @property {string} name
 * @property {string} description
 * @property {string[]} properties - Property names included in this group
 */

/**
 * device_info property group
 * Information about the device and platform
 *
 * @type {PropertyGroup}
 */
export const device_info = {
  name: 'device_info',
  description: 'Information about the device and platform',
  properties: [
    'device_type',
    'platform',
    'os_version',
    'app_version'
  ]
};

export default device_info;
