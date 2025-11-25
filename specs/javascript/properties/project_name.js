/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * project_name property definition
 * Name of the project.
 *
 * @type {Property}
 */
export const project_name = {
  name: 'project_name',
  type: 'string',
  constraints: null,
  description: 'Name of the project.',
  usage: 'Human-readable project identification.'
};

export default project_name;
