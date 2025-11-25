/**
 * @typedef {Object} Event
 * @property {string} event_name
 * @property {string} description
 * @property {string} table
 * @property {string[]} property_groups - Names of property groups included
 * @property {string[]} additional_properties - Names of additional properties
 * @property {string} [notes]
 */

/**
 * user_registration_started event
 * User began the registration process
 *
 * Table: Registration Events
 * Property groups: device_info, page_context
 *
 * @type {Event}
 */
export const user_registration_started = {
  event_name: 'user_registration_started',
  description: 'User began the registration process',
  table: 'Registration Events',
  property_groups: [
    'device_info',
    'page_context'
  ],
  additional_properties: [
    'registration_method'
  ],
  notes: 'Fire when registration form is displayed. Track abandonment by comparing with completion.'
};

export default user_registration_started;
