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
 * onboarding_started event
 * User began the onboarding process
 *
 * Table: Onboarding Events
 * Property groups: user_context, session_context
 *
 * @type {Event}
 */
export const onboarding_started = {
  event_name: 'onboarding_started',
  description: 'User began the onboarding process',
  table: 'Onboarding Events',
  property_groups: [
    'user_context',
    'session_context'
  ],
  additional_properties: [
    'onboarding_version',
    'total_steps'
  ],
  notes: 'Fire when first onboarding screen is shown.'
};

export default onboarding_started;
