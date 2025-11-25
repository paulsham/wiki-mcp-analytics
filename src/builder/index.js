/**
 * Transformation Pipeline Orchestration
 * Runs wiki-to-csv and/or csv-to-javascript transformations
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { transformWikiToCSV } from './wiki-to-csv.js';
import { transformCSVToJavaScript } from './csv-to-javascript.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');
const WIKI_DIR = join(PROJECT_ROOT, 'wiki');
const WIKI_EXAMPLES_DIR = join(PROJECT_ROOT, 'wiki-examples');

/**
 * Run the transformation pipeline
 * @param {Object} options - Pipeline options
 * @param {boolean} options.csvOnly - Only run wiki-to-csv transformation
 * @param {boolean} options.jsOnly - Only run csv-to-javascript transformation
 */
export function runPipeline(options = {}) {
  const { csvOnly = false, jsOnly = false } = options;

  console.log('=== Analytics Spec Transformation Pipeline ===\n');

  const results = {};

  // Run wiki-to-csv transformation
  if (!jsOnly) {
    // Check if wiki source exists
    const hasWikiSource = existsSync(WIKI_DIR) || existsSync(WIKI_EXAMPLES_DIR);

    if (!hasWikiSource) {
      console.error('❌ Error: Wiki source not found');
      console.error('');
      console.error('The transform script requires wiki markdown files to generate CSV/JS.');
      console.error('');
      console.error('If you forked this repo:');
      console.error('  Set up your GitHub wiki using the example files from wiki-examples/');
      console.error('  (GitHub wikis are not included when forking)');
      console.error('');
      console.error('If running in CI/CD:');
      console.error('  Check that the wiki clone step succeeded and has content');
      console.error('');
      process.exit(1);
    }

    console.log('Step 1: Wiki Markdown → CSV');
    console.log('-'.repeat(40));
    results.csv = transformWikiToCSV();
    console.log('');
  }

  // Run csv-to-javascript transformation
  if (!csvOnly) {
    console.log('Step 2: CSV → JavaScript');
    console.log('-'.repeat(40));
    results.js = transformCSVToJavaScript();
    console.log('');
  }

  console.log('=== Pipeline Complete ===');

  if (results.csv) {
    console.log(`  Properties: ${results.csv.properties.length}`);
    console.log(`  Property Groups: ${results.csv.propertyGroups.length}`);
    console.log(`  Events: ${results.csv.events.length}`);
  }

  if (results.js) {
    console.log(`  Generated JS files for ${results.js.properties} properties`);
    console.log(`  Generated JS files for ${results.js.groups} property groups`);
    console.log(`  Generated JS files for ${results.js.events} events in ${results.js.tables} tables`);
  }

  return results;
}

// Parse command line arguments and run
const args = process.argv.slice(2);
const csvOnly = args.includes('--csv-only');
const jsOnly = args.includes('--js-only');

if (csvOnly && jsOnly) {
  console.error('Error: Cannot specify both --csv-only and --js-only');
  process.exit(1);
}

runPipeline({ csvOnly, jsOnly });
