/**
 * Data loading and utility functions for analytics specs
 */

import { parse } from 'csv-parse/sync';
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

import {
  PROPERTIES_CSV,
  PROPERTY_GROUPS_CSV,
  EVENTS_CSV,
} from '../constants.js';

// Data storage
export let properties = [];
export let propertyGroups = [];
export let events = [];
export let propertiesMap = new Map();
export let propertyGroupsMap = new Map();
export let eventsMap = new Map();

/**
 * Load and parse CSV files
 * @param {string} specsDir - Path to specs directory
 */
export function loadData(specsDir) {
  const propertiesPath = join(specsDir, PROPERTIES_CSV);
  const propertyGroupsPath = join(specsDir, PROPERTY_GROUPS_CSV);
  const eventsPath = join(specsDir, EVENTS_CSV);

  if (!existsSync(propertiesPath) || !existsSync(propertyGroupsPath) || !existsSync(eventsPath)) {
    throw new Error(`CSV files not found in ${specsDir}. Run 'npm run transform' first.`);
  }

  // Parse properties
  const propertiesContent = readFileSync(propertiesPath, 'utf-8');
  properties = parse(propertiesContent, { columns: true, skip_empty_lines: true });
  propertiesMap = new Map(properties.map(p => [p.property_name, p]));

  // Parse property groups
  const propertyGroupsContent = readFileSync(propertyGroupsPath, 'utf-8');
  propertyGroups = parse(propertyGroupsContent, { columns: true, skip_empty_lines: true });
  propertyGroupsMap = new Map(propertyGroups.map(g => [g.group_name, g]));

  // Parse events
  const eventsContent = readFileSync(eventsPath, 'utf-8');
  events = parse(eventsContent, { columns: true, skip_empty_lines: true });
  eventsMap = new Map(events.map(e => [e.event_name, e]));

  console.error(`Loaded: ${properties.length} properties, ${propertyGroups.length} property groups, ${events.length} events`);
}

/**
 * Check if git repo is behind remote and return warning message if outdated
 * @param {string} projectRoot - Path to project root
 * @returns {string|null} Warning message if outdated, null otherwise
 */
export function warnIfOutdated(projectRoot) {
  try {
    // Fetch latest from remote
    execSync('git fetch', { cwd: projectRoot, stdio: 'pipe' });

    // Check if behind
    const status = execSync('git status -uno', { cwd: projectRoot, encoding: 'utf-8' });

    if (status.includes('behind')) {
      const match = status.match(/behind .+ by (\d+) commit/);
      const commits = match ? match[1] : 'some';
      return `Local repo is ${commits} commit(s) behind remote. Run 'git pull' to update specs.`;
    }
  } catch (error) {
    // Silently ignore git errors (not a git repo, no remote, etc.)
  }
  return null;
}

/**
 * Split multi-line CSV cell into array
 * @param {string} value - CSV cell value
 * @returns {string[]}
 */
export function splitMultiLine(value) {
  if (!value || value === '-') return [];
  return value.split('\n').map(s => s.trim()).filter(Boolean);
}

/**
 * Get expanded properties for an event (resolves property groups)
 * @param {object} event - Event object
 * @returns {object} Expanded properties with property_groups and additional_properties
 */
export function getExpandedProperties(event) {
  const result = {
    property_groups: [],
    additional_properties: []
  };

  // Expand property groups
  const groupNames = splitMultiLine(event.property_groups);
  for (const groupName of groupNames) {
    const group = propertyGroupsMap.get(groupName);
    if (group) {
      const groupProps = splitMultiLine(group.properties).map(propName => {
        const prop = propertiesMap.get(propName);
        return prop ? {
          name: prop.property_name,
          type: prop.type,
          constraints: prop.constraints || null,
          description: prop.description
        } : { name: propName, type: 'unknown', constraints: null, description: 'Property not found' };
      });

      result.property_groups.push({
        name: groupName,
        description: group.description,
        properties: groupProps
      });
    }
  }

  // Expand additional properties
  const additionalNames = splitMultiLine(event.additional_properties);
  for (const propName of additionalNames) {
    const prop = propertiesMap.get(propName);
    result.additional_properties.push(prop ? {
      name: prop.property_name,
      type: prop.type,
      constraints: prop.constraints || null,
      description: prop.description
    } : { name: propName, type: 'unknown', constraints: null, description: 'Property not found' });
  }

  return result;
}
