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
 * onboarding_step_completed event
 * User completed an onboarding step
 *
 * Table: Onboarding Events
 * Property groups: user_context, session_context
 *
 * @type {Event}
 */
export const onboarding_step_completed = {
  event_name: 'onboarding_step_completed',
  description: 'User completed an onboarding step',
  table: 'Onboarding Events',
  property_groups: [
    'user_context',
    'session_context'
  ],
  additional_properties: [
    'step_name',
    'step_number',
    'completion_time',
    'skipped'
  ],
  notes: 'Fire after each step. Include skipped=true if user skipped the step.'
};

export default onboarding_step_completed;
