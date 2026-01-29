/**
 * Shared constants for transformation pipeline
 */

// Source markdown files
export const PROPERTIES_MD = 'Properties.md';
export const PROPERTY_GROUPS_MD = 'Property-Groups.md';
export const EVENTS_MD = 'Events.md';
export const USER_PROPERTIES_MD = 'User-Properties.md';

// CSV files (output from wiki-to-csv, input to csv-to-javascript)
export const PROPERTIES_CSV = 'properties.csv';
export const PROPERTY_GROUPS_CSV = 'property-groups.csv';
export const EVENTS_CSV = 'events.csv';
export const USER_PROPERTIES_CSV = 'user-properties.csv';

// Output directories for JavaScript
export const PROPERTIES_DIR = 'properties';
export const PROPERTY_GROUPS_DIR = 'property-groups';
export const EVENTS_DIR = 'events';
export const USER_PROPERTIES_DIR = 'user-properties';

// CSV column definitions
export const PROPERTIES_COLUMNS = [
  'property_name',
  'type',
  'constraints',
  'description',
  'usage'
];

export const PROPERTY_GROUPS_COLUMNS = [
  'group_name',
  'description',
  'properties'
];

export const EVENTS_COLUMNS = [
  'event_name',
  'event_description',
  'event_table',
  'property_groups',
  'additional_properties',
  'notes'
];

export const USER_PROPERTIES_COLUMNS = [
  'property_name',
  'type',
  'constraints',
  'set_once',
  'description'
];
