/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * app_version property definition
 * Application version in semver format.
 *
 * @type {Property}
 */
export const app_version = {
  name: 'app_version',
  type: 'string',
  constraints: 'regex: ^\d+\.\d+\.\d+$',
  description: 'Application version in semver format.',
  usage: 'Track feature rollout and bug reports by version.'
};

export default app_version;
