/**
 * Wiki to CSV Transformer
 * Parses Wiki markdown tables and outputs CSV files
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  PROPERTIES_MD,
  PROPERTY_GROUPS_MD,
  EVENTS_MD,
  PROPERTIES_CSV,
  PROPERTY_GROUPS_CSV,
  EVENTS_CSV,
  PROPERTIES_COLUMNS,
  PROPERTY_GROUPS_COLUMNS,
  EVENTS_COLUMNS
} from '../constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check for wiki/ (CI/CD) first, fall back to wiki-examples/ (local dev)
const PROJECT_ROOT = join(__dirname, '../..');
const WIKI_CLONE_DIR = join(PROJECT_ROOT, 'wiki');
const WIKI_EXAMPLES_DIR = join(PROJECT_ROOT, 'wiki-examples');
const WIKI_DIR = existsSync(WIKI_CLONE_DIR) ? WIKI_CLONE_DIR : WIKI_EXAMPLES_DIR;
const OUTPUT_DIR = join(PROJECT_ROOT, 'specs', 'csv');

/**
 * Parse a markdown table into an array of objects
 * @param {string} tableContent - The markdown table content
 * @returns {Object[]} Array of row objects with column headers as keys
 */
function parseMarkdownTable(tableContent) {
  const lines = tableContent.trim().split('\n');

  if (lines.length < 3) {
    return []; // Need at least header, separator, and one data row
  }

  // Parse header row
  const headers = lines[0]
    .split('|')
    .map(h => h.trim())
    .filter(h => h.length > 0)
    .map(h => h.toLowerCase().replace(/\s+/g, '_'));

  // Skip separator row (lines[1])

  // Parse data rows
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('|--') || line.match(/^\|[\s-|]+\|$/)) {
      continue; // Skip empty lines and separator lines
    }

    const values = line.split('|').slice(1, -1).map(c => c.trim());

    if (values.length === 0) continue;

    const row = {};
    headers.forEach((header, idx) => {
      let value = values[idx] || '';
      // Convert <br> tags to newlines
      value = value.replace(/<br\s*\/?>/gi, '\n');
      row[header] = value;
    });

    rows.push(row);
  }

  return rows;
}

/**
 * Extract all tables from a markdown file with ## sections
 * @param {string} content - The markdown file content
 * @param {string} [tableFieldName] - Optional field name to store section name
 * @returns {Object[]} Array of row objects from all tables
 */
function parseMultiTableFile(content, tableFieldName = null) {
  const allRows = [];
  const sections = content.split(/^## /m);

  for (const section of sections) {
    if (!section.trim()) continue;

    const lines = section.split('\n');
    const sectionName = lines[0].trim();

    // Find the table in this section
    const tableStart = lines.findIndex(line => line.trim().startsWith('|'));
    if (tableStart === -1) continue;

    // Find the end of the table
    let tableEnd = tableStart;
    for (let i = tableStart; i < lines.length; i++) {
      if (lines[i].trim().startsWith('|')) {
        tableEnd = i;
      } else if (lines[i].trim() && !lines[i].trim().startsWith('|')) {
        break;
      }
    }

    const tableContent = lines.slice(tableStart, tableEnd + 1).join('\n');
    const rows = parseMarkdownTable(tableContent);

    // Add section name to each row if field name provided
    rows.forEach(row => {
      if (tableFieldName) {
        row[tableFieldName] = sectionName;
      }
      allRows.push(row);
    });
  }

  return allRows;
}

/**
 * Parse Events.md file - extracts events with their table/category
 * @param {string} content - The markdown file content
 * @returns {Object[]} Array of event objects with table name included
 */
function parseEventsFile(content) {
  return parseMultiTableFile(content, 'event_table');
}

/**
 * Parse Properties.md file - extracts properties from all sections
 * @param {string} content - The markdown file content
 * @returns {Object[]} Array of property objects
 */
function parsePropertiesFile(content) {
  return parseMultiTableFile(content);
}

/**
 * Parse Property-Groups.md file - extracts groups from all sections
 * @param {string} content - The markdown file content
 * @returns {Object[]} Array of property group objects
 */
function parsePropertyGroupsFile(content) {
  return parseMultiTableFile(content);
}

/**
 * Escape a value for CSV output
 * @param {string} value - The value to escape
 * @returns {string} CSV-safe value
 */
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  // If the value contains quotes, newlines, or commas, wrap in quotes
  if (str.includes('"') || str.includes('\n') || str.includes(',')) {
    // Escape quotes by doubling them
    return '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
}

/**
 * Convert array of objects to CSV string
 * @param {Object[]} rows - Array of row objects
 * @param {string[]} columns - Column names in order
 * @returns {string} CSV content
 */
function toCSV(rows, columns) {
  const headerRow = columns.join(',');

  const dataRows = rows.map(row => {
    return columns.map(col => escapeCSV(row[col])).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Main transformation function
 * @param {string} wikiDir - Directory containing wiki markdown files
 * @param {string} outputDir - Directory for CSV output
 */
export function transformWikiToCSV(wikiDir = WIKI_DIR, outputDir = OUTPUT_DIR) {
  console.log(`Reading wiki from: ${wikiDir}`);

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Read and parse Properties.md
  const propertiesContent = readFileSync(join(wikiDir, PROPERTIES_MD), 'utf-8');
  const properties = parsePropertiesFile(propertiesContent);
  console.log(`Parsed ${properties.length} properties`);

  // Read and parse Property-Groups.md
  const groupsContent = readFileSync(join(wikiDir, PROPERTY_GROUPS_MD), 'utf-8');
  const propertyGroups = parsePropertyGroupsFile(groupsContent);
  console.log(`Parsed ${propertyGroups.length} property groups`);

  // Read and parse Events.md
  const eventsContent = readFileSync(join(wikiDir, EVENTS_MD), 'utf-8');
  const events = parseEventsFile(eventsContent);
  console.log(`Parsed ${events.length} events`);

  // Write properties.csv
  const propertiesCSV = toCSV(properties, PROPERTIES_COLUMNS);
  const propertiesOutPath = join(outputDir, PROPERTIES_CSV);
  writeFileSync(propertiesOutPath, propertiesCSV);
  console.log(`Written: ${propertiesOutPath}`);

  // Write property-groups.csv
  const groupsCSV = toCSV(propertyGroups, PROPERTY_GROUPS_COLUMNS);
  const groupsOutPath = join(outputDir, PROPERTY_GROUPS_CSV);
  writeFileSync(groupsOutPath, groupsCSV);
  console.log(`Written: ${groupsOutPath}`);

  // Write events.csv
  const eventsCSV = toCSV(events, EVENTS_COLUMNS);
  const eventsOutPath = join(outputDir, EVENTS_CSV);
  writeFileSync(eventsOutPath, eventsCSV);
  console.log(`Written: ${eventsOutPath}`);

  return {
    properties,
    propertyGroups,
    events
  };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  transformWikiToCSV();
}
