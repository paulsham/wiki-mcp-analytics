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
 * user_registration_completed event
 * User completed the registration process
 *
 * Table: Registration Events
 * Property groups: user_context, device_info
 *
 * @type {Event}
 */
export const user_registration_completed = {
  event_name: 'user_registration_completed',
  description: 'User completed the registration process',
  table: 'Registration Events',
  property_groups: [
    'user_context',
    'device_info'
  ],
  additional_properties: [
    'registration_method',
    'referral_code',
    'account_type'
  ],
  notes: 'Fire immediately after successful registration. Ensure registration_method matches OAuth provider.'
};

export default user_registration_completed;
