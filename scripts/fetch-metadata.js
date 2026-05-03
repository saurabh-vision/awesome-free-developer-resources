#!/usr/bin/env node
/**
 * fetch-metadata.js
 * 
 * Auto-fetches tool metadata including GitHub stars, description, and logo.
 * Updates data/tools.json with fresh metadata.
 * 
 * Usage:
 *   GITHUB_TOKEN=your_token node scripts/fetch-metadata.js
 *   GITHUB_TOKEN=your_token node scripts/fetch-metadata.js --tool "Ollama"
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
 * Fetch metadata from GitHub API for a repo URL
 * @param {string} url - GitHub repo URL
 * @returns {Promise<Object|null>} GitHub metadata
 */
async function fetchGitHubMetadata(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s#?]+)/);
  if (!match) return null;

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/[#?].*$/, '');

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${cleanRepo}`,
      headers: {
        'User-Agent': 'awesome-ai-tools-database/1.0',
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        })
      }
    };

    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.message) {
            // API error (rate limit, not found, etc.)
            resolve(null);
            return;
          }
          resolve({
            stars: json.stargazers_count,
            forks: json.forks_count,
            description: json.description,
            topics: json.topics || [],
            language: json.language,
            open_issues: json.open_issues_count,
            last_push: json.pushed_at,
            homepage: json.homepage
          });
        } catch {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
  });
}

/**
 * Check if a URL is accessible (200 OK)
 * @param {string} url - URL to check
 * @returns {Promise<boolean>}
 */
async function isUrlAccessible(url) {
  return new Promise((resolve) => {
    try {
      const { URL } = require('url');
      const parsed = new URL(url);
      const client = parsed.protocol === 'https:' ? https : require('http');

      const options = {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'HEAD',
        headers: { 'User-Agent': 'awesome-ai-tools-bot/1.0' },
        timeout: 8000
      };

      const req = client.request(options, (res) => {
        resolve(res.statusCode < 400);
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function main() {
  console.log('📦 Metadata Fetcher\n');

  if (!fs.existsSync(TOOLS_FILE)) {
    console.error('tools.json not found at:', TOOLS_FILE);
    process.exit(1);
  }

  const tools = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
  let updatedCount = 0;

  for (const tool of tools) {
    if (TARGET_TOOL && tool.name !== TARGET_TOOL) continue;

    process.stdout.write(`Fetching metadata for: ${tool.name}...`);

    let updated = false;

    // Try to get GitHub stars
    const githubMeta = await fetchGitHubMetadata(tool.url);
    if (githubMeta) {
      tool.stars = githubMeta.stars;
      if (!tool.tags) tool.tags = [];

      // Add GitHub topics as tags
      for (const topic of githubMeta.topics) {
        if (!tool.tags.includes(topic)) {
          tool.tags.push(topic);
        }
      }

      // Auto-fill description from GitHub if missing
      if ((!tool.description || tool.description.length < 20) && githubMeta.description) {
        tool.description = githubMeta.description;
      }

      updated = true;
    }

    // Validate URL is accessible
    const accessible = await isUrlAccessible(tool.url);
    if (!accessible) {
      console.log(` ⚠️ URL may be down: ${tool.url}`);
    }

    if (updated) {
      tool.last_updated = new Date().toISOString().split('T')[0];
      updatedCount++;
      console.log(` ✅ ${githubMeta?.stars ? `⭐ ${githubMeta.stars}` : 'updated'}`);
    } else {
      console.log(' ℹ️ no changes');
    }

    // Rate limit: 1 request per second for GitHub API
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (updatedCount > 0) {
    fs.writeFileSync(TOOLS_FILE, JSON.stringify(tools, null, 2));
    console.log(`\n✅ Updated metadata for ${updatedCount} tool(s)`);
  } else {
    console.log('\n✅ All metadata up to date');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
