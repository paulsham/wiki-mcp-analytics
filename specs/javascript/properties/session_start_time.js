/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * session_start_time property definition
 * Timestamp when the session began.
 *
 * @type {Property}
 */
export const session_start_time = {
  name: 'session_start_time',
  type: 'timestamp',
  constraints: null,
  description: 'Timestamp when the session began.',
  usage: 'Calculate session duration and time-based analysis.'
};

export default session_start_time;
