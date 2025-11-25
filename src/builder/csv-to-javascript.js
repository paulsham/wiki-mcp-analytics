/**
 * CSV to JavaScript Generator
 * Reads CSV files and generates JavaScript modules with JSDoc types
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

import {
  PROPERTIES_CSV,
  PROPERTY_GROUPS_CSV,
  EVENTS_CSV,
  PROPERTIES_DIR,
  PROPERTY_GROUPS_DIR,
  EVENTS_DIR
} from '../constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_DIR = join(__dirname, '../../specs/csv');
const OUTPUT_DIR = join(__dirname, '../../specs/javascript');

/**
 * Convert a name to a valid JavaScript identifier
 * @param {string} name - The name to convert
 * @returns {string} Valid JS identifier
 */
function toIdentifier(name) {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Convert a table name to a directory name
 * @param {string} tableName - The table name (e.g., "Registration Events")
 * @returns {string} Directory name (e.g., "registration")
 */
function toDirectoryName(tableName) {
  return tableName
    .toLowerCase()
    .replace(/\s+events?$/i, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Parse a CSV file
 * @param {string} filePath - Path to CSV file
 * @returns {Object[]} Array of row objects
 */
function parseCSV(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true
  });
}

/**
 * Split newline-separated values into array
 * @param {string} value - Newline-separated string
 * @returns {string[]} Array of values
 */
function splitNewlines(value) {
  if (!value || value.trim() === '' || value === '-') {
    return [];
  }
  return value.split('\n').map(v => v.trim()).filter(v => v.length > 0);
}

/**
 * Generate a property JavaScript file
 * @param {Object} property - Property object
 * @returns {string} JavaScript file content
 */
function generatePropertyFile(property) {
  const identifier = toIdentifier(property.property_name);

  return `/**
 * @typedef {Object} Property
 * @property {string} name
 * @property {string} type
 * @property {string} [constraints]
 * @property {string} description
 * @property {string} [usage]
 */

/**
 * ${property.property_name} property definition
 * ${property.description}
 *
 * @type {Property}
 */
export const ${identifier} = {
  name: '${property.property_name}',
  type: '${property.type}',
  constraints: ${property.constraints && property.constraints !== '-' ? `'${property.constraints.replace(/'/g, "\\'")}'` : 'null'},
  description: '${property.description.replace(/'/g, "\\'")}',
  usage: '${(property.usage || '').replace(/'/g, "\\'")}'
};

export default ${identifier};
`;
}

/**
 * Generate a property group JavaScript file
 * @param {Object} group - Property group object
 * @returns {string} JavaScript file content
 */
function generatePropertyGroupFile(group) {
  const identifier = toIdentifier(group.group_name);
  const properties = splitNewlines(group.properties);

  return `/**
 * @typedef {Object} PropertyGroup
 * @property {string} name
 * @property {string} description
 * @property {string[]} properties - Property names included in this group
 */

/**
 * ${group.group_name} property group
 * ${group.description}
 *
 * @type {PropertyGroup}
 */
export const ${identifier} = {
  name: '${group.group_name}',
  description: '${group.description.replace(/'/g, "\\'")}',
  properties: [
    ${properties.map(p => `'${p}'`).join(',\n    ')}
  ]
};

export default ${identifier};
`;
}

/**
 * Generate an event JavaScript file
 * @param {Object} event - Event object
 * @returns {string} JavaScript file content
 */
function generateEventFile(event) {
  const identifier = toIdentifier(event.event_name);
  const propertyGroups = splitNewlines(event.property_groups);
  const additionalProperties = splitNewlines(event.additional_properties);

  return `/**
 * @typedef {Object} Event
 * @property {string} event_name
 * @property {string} description
 * @property {string} table
 * @property {string[]} property_groups - Names of property groups included
 * @property {string[]} additional_properties - Names of additional properties
 * @property {string} [notes]
 */

/**
 * ${event.event_name} event
 * ${event.event_description}
 *
 * Table: ${event.event_table}
 * Property groups: ${propertyGroups.join(', ') || 'none'}
 *
 * @type {Event}
 */
export const ${identifier} = {
  event_name: '${event.event_name}',
  description: '${event.event_description.replace(/'/g, "\\'")}',
  table: '${event.event_table}',
  property_groups: [
    ${propertyGroups.map(g => `'${g}'`).join(',\n    ')}
  ],
  additional_properties: [
    ${additionalProperties.map(p => `'${p}'`).join(',\n    ')}
  ],
  notes: '${(event.notes || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}'
};

export default ${identifier};
`;
}

/**
 * Generate an index.js file that exports all items
 * @param {string[]} items - Array of item names
 * @param {string} itemType - Type of items (for comments)
 * @returns {string} Index file content
 */
function generateIndexFile(items, itemType) {
  const imports = items.map(name => {
    const identifier = toIdentifier(name);
    return `import { ${identifier} } from './${name}.js';`;
  });

  const exports = items.map(name => toIdentifier(name));

  return `/**
 * ${itemType} index
 * Auto-generated - do not edit
 */

${imports.join('\n')}

export {
  ${exports.join(',\n  ')}
};

export const all = {
  ${exports.join(',\n  ')}
};

export default all;
`;
}

/**
 * Generate events index that includes table subdirectories
 * @param {Object} eventsByTable - Events grouped by table
 * @returns {string} Index file content
 */
function generateEventsRootIndex(eventsByTable) {
  const tables = Object.keys(eventsByTable);
  const imports = tables.map(table => {
    const dirName = toDirectoryName(table);
    return `import ${toIdentifier(dirName)} from './${dirName}/index.js';`;
  });

  const exports = tables.map(table => toIdentifier(toDirectoryName(table)));

  return `/**
 * Events index
 * Auto-generated - do not edit
 */

${imports.join('\n')}

export {
  ${exports.join(',\n  ')}
};

export const all = {
  ${exports.join(',\n  ')}
};

export default all;
`;
}

/**
 * Main transformation function
 * @param {string} inputDir - Directory containing CSV files
 * @param {string} outputDir - Directory for JavaScript output
 */
export function transformCSVToJavaScript(inputDir = INPUT_DIR, outputDir = OUTPUT_DIR) {
  // Clean and recreate output directories
  const propertiesOutDir = join(outputDir, PROPERTIES_DIR);
  const groupsOutDir = join(outputDir, PROPERTY_GROUPS_DIR);
  const eventsOutDir = join(outputDir, EVENTS_DIR);

  for (const dir of [propertiesOutDir, groupsOutDir, eventsOutDir]) {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true });
    }
    mkdirSync(dir, { recursive: true });
  }

  // Process properties
  const propertiesPath = join(inputDir, PROPERTIES_CSV);
  const properties = parseCSV(propertiesPath);
  const propertyNames = [];

  for (const property of properties) {
    const fileName = `${property.property_name}.js`;
    const content = generatePropertyFile(property);
    writeFileSync(join(propertiesOutDir, fileName), content);
    propertyNames.push(property.property_name);
  }

  // Write properties index
  writeFileSync(
    join(propertiesOutDir, 'index.js'),
    generateIndexFile(propertyNames, 'Properties')
  );
  console.log(`Generated ${properties.length} property files`);

  // Process property groups
  const groupsPath = join(inputDir, PROPERTY_GROUPS_CSV);
  const groups = parseCSV(groupsPath);
  const groupNames = [];

  for (const group of groups) {
    const fileName = `${group.group_name}.js`;
    const content = generatePropertyGroupFile(group);
    writeFileSync(join(groupsOutDir, fileName), content);
    groupNames.push(group.group_name);
  }

  // Write property groups index
  writeFileSync(
    join(groupsOutDir, 'index.js'),
    generateIndexFile(groupNames, 'Property Groups')
  );
  console.log(`Generated ${groups.length} property group files`);

  // Process events - group by table
  const eventsPath = join(inputDir, EVENTS_CSV);
  const events = parseCSV(eventsPath);
  const eventsByTable = {};

  for (const event of events) {
    const table = event.event_table || 'uncategorized';
    if (!eventsByTable[table]) {
      eventsByTable[table] = [];
    }
    eventsByTable[table].push(event);
  }

  // Generate event files organized by table
  for (const [table, tableEvents] of Object.entries(eventsByTable)) {
    const tableDirName = toDirectoryName(table);
    const tableDir = join(eventsOutDir, tableDirName);
    mkdirSync(tableDir, { recursive: true });

    const eventNames = [];
    for (const event of tableEvents) {
      const fileName = `${event.event_name}.js`;
      const content = generateEventFile(event);
      writeFileSync(join(tableDir, fileName), content);
      eventNames.push(event.event_name);
    }

    // Write table index
    writeFileSync(
      join(tableDir, 'index.js'),
      generateIndexFile(eventNames, `${table}`)
    );
  }

  // Write events root index
  writeFileSync(
    join(eventsOutDir, 'index.js'),
    generateEventsRootIndex(eventsByTable)
  );
  console.log(`Generated ${events.length} event files in ${Object.keys(eventsByTable).length} tables`);

  return {
    properties: properties.length,
    groups: groups.length,
    events: events.length,
    tables: Object.keys(eventsByTable).length
  };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  transformCSVToJavaScript();
}
