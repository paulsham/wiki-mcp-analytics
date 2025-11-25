/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * project_id property definition
 * Unique identifier for the project.
 *
 * @type {Property}
 */
export const project_id = {
  name: 'project_id',
  type: 'string',
  constraints: 'regex: ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
  description: 'Unique identifier for the project.',
  usage: 'Track project-level analytics and cross-reference events.'
};

export default project_id;
