#!/usr/bin/env node
/**
 * validate-tools.js
 * 
 * Validates all tools in data/tools.json for:
 * - Required fields
 * - URL format
 * - Description quality
 * - Category validity
 * - Duplicate detection
 * 
 * Usage:
 *   node scripts/validate-tools.js
 *   node scripts/validate-tools.js --strict   (exit 1 on any warning)
 *   node scripts/validate-tools.js --fix       (auto-fix minor issues)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const TOOLS_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const CATEGORIES_FILE = path.join(__dirname, '..', 'data', 'categories.json');
const RESULTS_FILE = '/tmp/validation-results.md';

const IS_STRICT = process.argv.includes('--strict');
const AUTO_FIX = process.argv.includes('--fix');

const REQUIRED_FIELDS = ['name', 'url', 'category', 'description', 'free_tier'];
const URL_REGEX = /^https?:\/\/.+\..+/;

/**
 * Validate a single tool entry
 * @param {Object} tool - Tool to validate
 * @param {string[]} validCategories - Valid category IDs
 * @returns {{ errors: string[], warnings: string[] }}
 */
function validateTool(tool, validCategories) {
  const errors = [];
  const warnings = [];

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (tool[field] === undefined || tool[field] === null) {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  // Validate URL format
  if (tool.url && !URL_REGEX.test(tool.url)) {
    errors.push(`Invalid URL format: "${tool.url}"`);
  }

  // Validate category
  if (tool.category && !validCategories.includes(tool.category)) {
    errors.push(`Invalid category: "${tool.category}". Valid: ${validCategories.join(', ')}`);
  }

  // Description quality checks
  if (tool.description) {
    if (tool.description.length < 20) {
      warnings.push('Description is very short (< 20 chars)');
    }
    if (tool.description.length > 300) {
      warnings.push('Description is too long (> 300 chars)');
    }
    if (tool.description.includes('TODO') || tool.description.includes('FIXME')) {
      errors.push('Description contains placeholder text');
    }
  }

  // Validate free_tier is boolean
  if (tool.free_tier !== undefined && typeof tool.free_tier !== 'boolean') {
    errors.push(`"free_tier" must be a boolean, got: ${typeof tool.free_tier}`);
  }

  // Warn about missing optional but recommended fields
  if (!tool.best_for) warnings.push('Missing "best_for" field (recommended)');
  if (!tool.use_cases || tool.use_cases.length === 0) warnings.push('Missing "use_cases" array (recommended)');
  if (!tool.tags || tool.tags.length === 0) warnings.push('Missing "tags" array (recommended)');
  if (tool.free_tier && !tool.free_tier_details) warnings.push('Free tier exists but "free_tier_details" is missing');

  return { errors, warnings };
}

/**
 * Find duplicate tools by URL or name
 * @param {Object[]} tools
 * @returns {Array} Duplicate pairs
 */
function findDuplicates(tools) {
  const duplicates = [];
  const seenUrls = {};
  const seenNames = {};

  for (const tool of tools) {
    const normalizedUrl = tool.url ? tool.url.replace(/\/$/, '').toLowerCase() : null;
    const normalizedName = tool.name ? tool.name.toLowerCase() : null;

    if (normalizedUrl && seenUrls[normalizedUrl]) {
      duplicates.push({
        type: 'url',
        tool1: seenUrls[normalizedUrl],
        tool2: tool.name,
        value: tool.url
      });
    } else if (normalizedUrl) {
      seenUrls[normalizedUrl] = tool.name;
    }

    if (normalizedName && seenNames[normalizedName]) {
      duplicates.push({
        type: 'name',
        tool1: seenNames[normalizedName],
        tool2: tool.name,
        value: tool.name
      });
    } else if (normalizedName) {
      seenNames[normalizedName] = tool.name;
    }
  }

  return duplicates;
}

/**
 * Auto-fix minor issues
 * @param {Object} tool
 * @returns {Object} Fixed tool
 */
function autoFix(tool) {
  const fixed = { ...tool };

  // Trim whitespace from string fields
  for (const key of ['name', 'url', 'description', 'best_for', 'free_tier_details']) {
    if (typeof fixed[key] === 'string') {
      fixed[key] = fixed[key].trim();
    }
  }

  // Remove trailing slash from root URLs (e.g., https://example.com/ → https://example.com)
  if (fixed.url && fixed.url.match(/^https?:\/\/[^/]+\/$/)) {
    fixed.url = fixed.url.slice(0, -1);
  }

  // Initialize empty arrays if missing
  if (!fixed.tags) fixed.tags = [];
  if (!fixed.use_cases) fixed.use_cases = [];

  // Ensure last_updated is set
  if (!fixed.last_updated) {
    fixed.last_updated = new Date().toISOString().split('T')[0];
  }

  return fixed;
}

function main() {
  console.log('🔍 Tool Validator\n');

  if (!fs.existsSync(TOOLS_FILE)) {
    console.error('tools.json not found at:', TOOLS_FILE);
    process.exit(1);
  }

  const tools = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
  const categories = fs.existsSync(CATEGORIES_FILE)
    ? JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8')).map((c) => c.id)
    : [];

  let totalErrors = 0;
  let totalWarnings = 0;
  const validationResults = [];

  // Validate each tool
  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const { errors, warnings } = validateTool(tool, categories);

    if (errors.length > 0 || warnings.length > 0) {
      validationResults.push({ tool: tool.name || `Tool #${i}`, errors, warnings });
    }

    totalErrors += errors.length;
    totalWarnings += warnings.length;

    // Auto-fix if requested
    if (AUTO_FIX) {
      tools[i] = autoFix(tool);
    }
  }

  // Find duplicates
  const duplicates = findDuplicates(tools);
  if (duplicates.length > 0) {
    for (const dup of duplicates) {
      validationResults.push({
        tool: `DUPLICATE (${dup.type})`,
        errors: [`"${dup.tool1}" and "${dup.tool2}" have the same ${dup.type}: "${dup.value}"`],
        warnings: []
      });
      totalErrors++;
    }
  }

  // Print results
  if (validationResults.length === 0) {
    console.log(`✅ All ${tools.length} tools passed validation!\n`);
  } else {
    console.log(`Validation Results:\n`);
    for (const result of validationResults) {
      if (result.errors.length > 0) {
        console.log(`❌ ${result.tool}:`);
        result.errors.forEach((e) => console.log(`   ERROR: ${e}`));
      }
      if (result.warnings.length > 0) {
        console.log(`⚠️  ${result.tool}:`);
        result.warnings.forEach((w) => console.log(`   WARN: ${w}`));
      }
    }
  }

  console.log(`\nSummary: ${tools.length} tools | ${totalErrors} errors | ${totalWarnings} warnings`);

  // Write markdown report for PR comments
  const markdownReport = validationResults.length === 0
    ? `✅ All **${tools.length}** tools passed validation!`
    : `### Validation Results\n\n` +
      `| Tool | Issues |\n|------|--------|\n` +
      validationResults.map((r) => {
        const issues = [
          ...r.errors.map((e) => `❌ ${e}`),
          ...r.warnings.map((w) => `⚠️ ${w}`)
        ].join('<br>');
        return `| ${r.tool} | ${issues} |`;
      }).join('\n') +
      `\n\n**Summary:** ${totalErrors} errors, ${totalWarnings} warnings`;

  fs.writeFileSync(RESULTS_FILE, markdownReport);

  // Save fixed tools if auto-fix was applied
  if (AUTO_FIX) {
    fs.writeFileSync(TOOLS_FILE, JSON.stringify(tools, null, 2));
    console.log('\n🔧 Auto-fix applied and saved');
  }

  // Exit with error if there are validation errors
  if (totalErrors > 0 || (IS_STRICT && totalWarnings > 0)) {
    process.exit(1);
  }
}

main();
