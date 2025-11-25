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
 * onboarding_completed event
 * User finished the entire onboarding flow
 *
 * Table: Onboarding Events
 * Property groups: user_context, session_context
 *
 * @type {Event}
 */
export const onboarding_completed = {
  event_name: 'onboarding_completed',
  description: 'User finished the entire onboarding flow',
  table: 'Onboarding Events',
  property_groups: [
    'user_context',
    'session_context'
  ],
  additional_properties: [
    'onboarding_version',
    'total_steps',
    'completed_steps'
  ],
  notes: 'Fire when user completes or exits onboarding. Calculate completion rate from completed_steps/total_steps.'
};

export default onboarding_completed;
