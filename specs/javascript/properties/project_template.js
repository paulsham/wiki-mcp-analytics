/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * project_template property definition
 * Template used to create the project.
 *
 * @type {Property}
 */
export const project_template = {
  name: 'project_template',
  type: 'string',
  constraints: 'enum: blank, starter, advanced, import',
  description: 'Template used to create the project.',
  usage: 'Analyze template popularity and user preferences.'
};

export default project_template;
