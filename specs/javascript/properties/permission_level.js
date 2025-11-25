/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * permission_level property definition
 * Permission level granted to the collaborator.
 *
 * @type {Property}
 */
export const permission_level = {
  name: 'permission_level',
  type: 'string',
  constraints: 'enum: viewer, editor, admin',
  description: 'Permission level granted to the collaborator.',
  usage: 'Analyze permission distribution and security patterns.'
};

export default permission_level;
