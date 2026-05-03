#!/usr/bin/env node
/**
 * generate-comparisons.js
 * 
 * Generates "Tool A vs Tool B vs Tool C" comparison tables.
 * Can use OpenAI to generate feature lists or work from existing data.
 * 
 * Usage:
 *   node scripts/generate-comparisons.js
 *   OPENAI_API_KEY=your_key node scripts/generate-comparisons.js
 *   node scripts/generate-comparisons.js --category api-testing
 */

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOOLS_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const README_FILE = path.join(__dirname, '..', 'README.md');

const TARGET_CATEGORY = process.argv.includes('--category')
  ? process.argv[process.argv.indexOf('--category') + 1]
  : process.env.TARGET_CATEGORY || 'all';

/**
 * Predefined comparison groups (subcategory → tools to compare)
 * These run without AI API access
 */
const COMPARISON_GROUPS = {
  'api-testing': {
    title: 'API Testing: Postman vs Hoppscotch vs Bruno vs Insomnia',
    tools: ['Postman', 'Hoppscotch', 'Bruno'],
    features: ['Price', 'Offline support', 'Open Source', 'Git-friendly', 'Collaboration', 'Best for']
  },
  'hosting-frontend': {
    title: 'Hosting: Vercel vs Netlify vs Cloudflare Pages',
    tools: ['Vercel', 'Netlify', 'Cloudflare Pages'],
    features: ['Free tier', 'Next.js support', 'Edge functions', 'Analytics', 'Best for']
  },
  'postgres-services': {
    title: 'PostgreSQL: Supabase vs Neon vs PlanetScale',
    tools: ['Supabase', 'Neon', 'PlanetScale'],
    features: ['Database type', 'Free tier', 'Open Source', 'Auth included', 'Branching', 'Best for']
  },
  'ai-assistants': {
    title: 'AI Assistants: ChatGPT vs Claude vs Gemini',
    tools: ['ChatGPT', 'Claude', 'Google Gemini'],
    features: ['Free tier', 'Context window', 'Coding ability', 'Vision', 'Image generation', 'Best for']
  },
  'coding-assistants': {
    title: 'AI Coding: GitHub Copilot vs Cursor vs Cline',
    tools: ['GitHub Copilot', 'Cursor', 'Cline'],
    features: ['Price', 'Editor integration', 'Codebase context', 'Autonomous actions', 'Open Source', 'Best for']
  }
};

/**
 * Generate a comparison table using OpenAI
 * @param {string} groupName - Comparison group name
 * @param {Object} group - Group configuration
 * @param {Object[]} tools - Tools data
 * @returns {Promise<string>} Markdown comparison table
 */
async function generateComparisonWithAI(groupName, group, tools) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return generateComparisonFromData(group, tools);
  }

  const toolsData = group.tools
    .map((name) => {
      const tool = tools.find((t) => t.name === name);
      return tool ? `${name}: ${tool.description || 'N/A'} | Free: ${tool.free_tier_details || 'N/A'}` : name;
    })
    .join('\n');

  const prompt = `Create a markdown comparison table for these developer tools:

${toolsData}

Features to compare: ${group.features.join(', ')}

Format as a GitHub-flavored markdown table with:
- First column: Feature
- One column per tool
- Concise values (1-5 words per cell)
- Use ✅ ❌ ⚠️ emojis where appropriate
- Last row: "Best for" with a short phrase

Return ONLY the markdown table, no extra text.`;

  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.3
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0]) {
            resolve(json.choices[0].message.content.trim());
          } else {
            resolve(generateComparisonFromData(group, tools));
          }
        } catch (parseErr) {
          console.error('Failed to parse comparison API response:', parseErr.message);
          resolve(generateComparisonFromData(group, tools));
        }
      });
    });

    req.on('error', () => resolve(generateComparisonFromData(group, tools)));
    req.write(body);
    req.end();
  });
}

/**
 * Generate a comparison table from existing tools.json data
 * @param {Object} group - Comparison group
 * @param {Object[]} tools - All tools
 * @returns {string} Markdown table
 */
function generateComparisonFromData(group, tools) {
  const toolObjects = group.tools.map((name) => tools.find((t) => t.name === name)).filter(Boolean);

  if (toolObjects.length === 0) return '';

  const header = `| Feature | ${toolObjects.map((t) => t.name).join(' | ')} |`;
  const separator = `|---------|${toolObjects.map(() => '------').join('|')}|`;

  const rows = [
    `| Price | ${toolObjects.map((t) => (t.free_tier ? '✅ Free tier' : '❌ Paid')).join(' | ')} |`,
    `| Free details | ${toolObjects.map((t) => t.free_tier_details || 'N/A').join(' | ')} |`,
    `| Open Source | ${toolObjects.map((t) => (t.tags && t.tags.includes('open-source') ? '✅' : '❓')).join(' | ')} |`,
    `| Best for | ${toolObjects.map((t) => t.best_for || 'General use').join(' | ')} |`
  ];

  return [header, separator, ...rows].join('\n');
}

/**
 * Update the README.md with new comparison tables
 * @param {string} section - Section title
 * @param {string} table - Markdown table
 */
function updateReadmeComparison(section, table) {
  if (!fs.existsSync(README_FILE)) {
    console.warn('README.md not found, skipping update');
    return;
  }

  const readme = fs.readFileSync(README_FILE, 'utf8');

  // Find the existing comparison section
  const sectionMarker = `### ${section}`;
  const sectionIndex = readme.indexOf(sectionMarker);

  if (sectionIndex === -1) {
    console.log(`Section "${section}" not found in README, skipping`);
    return;
  }

  // Find the end of the existing table
  const nextSectionIndex = readme.indexOf('\n### ', sectionIndex + 1);
  const sectionEnd = nextSectionIndex === -1 ? readme.indexOf('\n---', sectionIndex) : nextSectionIndex;

  if (sectionEnd === -1) {
    console.log(`Could not find end of section "${section}"`);
    return;
  }

  const newSection = `${sectionMarker}\n\n${table}\n`;
  const updatedReadme = readme.substring(0, sectionIndex) + newSection + readme.substring(sectionEnd);

  fs.writeFileSync(README_FILE, updatedReadme);
  console.log(`✅ Updated comparison: ${section}`);
}

async function main() {
  console.log('📊 Comparison Table Generator\n');

  if (!fs.existsSync(TOOLS_FILE)) {
    console.error('tools.json not found at:', TOOLS_FILE);
    process.exit(1);
  }

  const tools = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));

  const groupsToProcess = TARGET_CATEGORY === 'all'
    ? Object.keys(COMPARISON_GROUPS)
    : [TARGET_CATEGORY];

  for (const groupName of groupsToProcess) {
    const group = COMPARISON_GROUPS[groupName];
    if (!group) {
      console.warn(`Unknown comparison group: ${groupName}`);
      continue;
    }

    console.log(`Generating comparison: ${group.title}`);

    const table = await generateComparisonWithAI(groupName, group, tools);

    if (table) {
      console.log(`\nGenerated table for ${group.title}:`);
      console.log(table);
      console.log();
    }

    // Rate limit for API calls
    if (process.env.OPENAI_API_KEY) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log('\n✅ Comparison generation complete');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
