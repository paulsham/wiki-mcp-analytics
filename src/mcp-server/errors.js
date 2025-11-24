/**
 * Custom error classes for MCP server
 */

export class NotFoundError extends Error {
  constructor(type, name) {
    super(`${type} '${name}' not found`);
    this.name = 'NotFoundError';
    this.type = type;
    this.resourceName = name;
  }
}

export class ValidationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}
