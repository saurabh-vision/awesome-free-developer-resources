#!/usr/bin/env node
/**
 * generate-descriptions.js
 * 
 * Automatically generates tool descriptions using OpenAI API.
 * Run when tools in data/tools.json are missing descriptions.
 * 
 * Usage:
 *   OPENAI_API_KEY=your_key node scripts/generate-descriptions.js
 *   OPENAI_API_KEY=your_key node scripts/generate-descriptions.js --tool "Postman"
 */

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOOLS_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const TARGET_TOOL = process.argv.includes('--tool') 
  ? process.argv[process.argv.indexOf('--tool') + 1] 
  : null;

/**
 * Call OpenAI API to generate a description for a tool
 * @param {Object} tool - Tool object with name, url, category, best_for
 * @returns {Promise<string>} Generated description
 */
async function generateDescription(tool) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY not set, skipping AI generation');
    return tool.description;
  }

  const prompt = `Generate a concise, accurate developer-focused description for "${tool.name}" (${tool.url}).
Category: ${tool.category}
Best for: ${tool.best_for || 'developers'}
Free tier: ${tool.free_tier ? 'Yes - ' + (tool.free_tier_details || 'available') : 'No'}

Requirements:
- 1-2 sentences max
- Focus on what makes it unique and useful
- Mention key features
- No marketing fluff
- Developer-friendly tone

Return ONLY the description, no quotes or extra text.`;

  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7
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
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0]) {
            resolve(json.choices[0].message.content.trim());
          } else {
            console.error('Unexpected API response:', json);
            resolve(tool.description);
          }
        } catch (e) {
          console.error('Failed to parse API response:', e.message);
          resolve(tool.description);
        }
      });
    });

    req.on('error', (e) => {
      console.error('API request error:', e.message);
      resolve(tool.description);
    });

    req.write(body);
    req.end();
  });
}

/**
 * Generate use cases for a tool using OpenAI
 * @param {Object} tool - Tool object
 * @returns {Promise<string[]>} Array of use cases
 */
async function generateUseCases(tool) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return tool.use_cases || [];

  const prompt = `List 3-4 specific use cases for "${tool.name}" for developers.
Format: Return as a JSON array of short strings (5 words max each).
Example: ["API testing", "Mock server creation", "Documentation generation"]
Return ONLY the JSON array.`;

  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.5
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
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0]) {
            const content = json.choices[0].message.content.trim();
            const useCases = JSON.parse(content);
            resolve(Array.isArray(useCases) ? useCases : tool.use_cases || []);
          } else {
            resolve(tool.use_cases || []);
          }
        } catch (parseErr) {
          console.error('Failed to parse use cases response:', parseErr.message);
          resolve(tool.use_cases || []);
        }
      });
    });

    req.on('error', () => resolve(tool.use_cases || []));
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🤖 AI Description Generator\n');

  if (!fs.existsSync(TOOLS_FILE)) {
    console.error('tools.json not found at:', TOOLS_FILE);
    process.exit(1);
  }

  const tools = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
  let updatedCount = 0;

  for (const tool of tools) {
    // Skip if targeting specific tool and this isn't it
    if (TARGET_TOOL && tool.name !== TARGET_TOOL) continue;

    const needsDescription = !tool.description || tool.description.length < 20;
    const needsUseCases = !tool.use_cases || tool.use_cases.length === 0;

    if (!needsDescription && !needsUseCases) continue;

    console.log(`Processing: ${tool.name}...`);

    if (needsDescription) {
      tool.description = await generateDescription(tool);
      console.log(`  ✅ Description: ${tool.description.substring(0, 60)}...`);
    }

    if (needsUseCases) {
      tool.use_cases = await generateUseCases(tool);
      console.log(`  ✅ Use cases: ${tool.use_cases.join(', ')}`);
    }

    tool.last_updated = new Date().toISOString().split('T')[0];
    updatedCount++;

    // Rate limit: 1 second between API calls
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (updatedCount > 0) {
    fs.writeFileSync(TOOLS_FILE, JSON.stringify(tools, null, 2));
    console.log(`\n✅ Updated ${updatedCount} tool(s) successfully`);
  } else {
    console.log('\n✅ No tools needed updating');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
