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
 * email_verified event
 * User verified their email address
 *
 * Table: Registration Events
 * Property groups: user_context
 *
 * @type {Event}
 */
export const email_verified = {
  event_name: 'email_verified',
  description: 'User verified their email address',
  table: 'Registration Events',
  property_groups: [
    'user_context'
  ],
  additional_properties: [
    'verification_method',
    'time_to_verify'
  ],
  notes: 'Track time between registration and verification for funnel analysis.'
};

export default email_verified;
