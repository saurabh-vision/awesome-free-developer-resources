# Setup Guide

This guide explains how to set up the **Awesome AI Tools Database** for local development, contribution, and running automation scripts.

---

## Prerequisites

- Node.js 18+ (for running scripts)
- Git
- A GitHub account

---

## Local Setup

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/awesome-ai-tools-database.git
cd awesome-ai-tools-database
```

### 2. Install Dependencies (Optional — for scripts)

```bash
# No package.json yet — scripts use Node.js built-ins only
# Only needed if you want to run the AI generation scripts
node --version  # Should be 18+
```

### 3. Verify Data Files

```bash
# Check tools.json is valid
node -e "const t = require('./data/tools.json'); console.log('✅ tools.json valid:', t.length, 'tools')"

# Check categories.json is valid  
node -e "const c = require('./data/categories.json'); console.log('✅ categories.json valid:', c.length, 'categories')"
```

---

## Running Scripts

### Validate Tools

```bash
# Basic validation
node scripts/validate-tools.js

# Strict mode (errors on warnings too)
node scripts/validate-tools.js --strict

# Auto-fix minor issues
node scripts/validate-tools.js --fix
```

### Fetch GitHub Metadata

```bash
# Without GitHub token (limited rate)
node scripts/fetch-metadata.js

# With GitHub token (higher rate limits)
GITHUB_TOKEN=your_token node scripts/fetch-metadata.js

# For a specific tool
GITHUB_TOKEN=your_token node scripts/fetch-metadata.js --tool "Ollama"
```

### Generate AI Descriptions

```bash
# Requires OpenAI API key
OPENAI_API_KEY=your_key node scripts/generate-descriptions.js

# For a specific tool
OPENAI_API_KEY=your_key node scripts/generate-descriptions.js --tool "Postman"
```

### Generate Comparison Tables

```bash
# Generate all comparisons
node scripts/generate-comparisons.js

# Generate for specific category
node scripts/generate-comparisons.js --category api-testing

# With AI enhancement
OPENAI_API_KEY=your_key node scripts/generate-comparisons.js
```

---

## Adding a New Tool

### Method 1: Quick (data/tools.json only)

1. Open `data/tools.json`
2. Copy an existing entry
3. Fill in all fields
4. Run validation: `node scripts/validate-tools.js`
5. Commit and push

### Method 2: Full (README + JSON)

1. Add entry to `data/tools.json` (see format below)
2. Add row to the correct section in `README.md`
3. Run validation
4. Submit PR

### Tool Entry Format

```json
{
  "name": "Tool Name",
  "url": "https://tool.com",
  "category": "ai-llm",
  "subcategory": "coding-assistants",
  "description": "1-2 sentences describing the tool for developers.",
  "free_tier": true,
  "free_tier_details": "What's free and any limits",
  "best_for": "Who benefits most",
  "use_cases": ["Use case 1", "Use case 2", "Use case 3"],
  "affiliate_link": "https://affiliate.link or null",
  "stars": null,
  "last_updated": "2024-01-01",
  "tags": ["tag1", "tag2"]
}
```

---

## GitHub Actions

The repository includes 4 automated workflows:

| Workflow | Schedule | Trigger |
|----------|----------|---------|
| `trending-update.yml` | Every Monday | Automatic |
| `validate-links.yml` | Every day | Automatic |
| `ai-description-generator.yml` | On PR | When `data/tools.json` changes |
| `comparison-tables.yml` | Every Sunday | Automatic |

### Required Secrets

To enable AI features, add these secrets in your fork:

| Secret | Required For |
|--------|-------------|
| `OPENAI_API_KEY` | AI description generation |
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `GITHUB_TOKEN` | GitHub token for API calls |

---

## Project Structure

```
awesome-ai-tools-database/
├── README.md              # Main homepage with all tools
├── CONTRIBUTING.md        # How to contribute
├── CODE_OF_CONDUCT.md     # Community guidelines  
├── MONETIZATION.md        # Revenue sharing details
├── LICENSE                # MIT License
├── data/
│   ├── tools.json         # All tools structured data
│   ├── categories.json    # Category definitions
│   ├── affiliates.json    # Affiliate program details
│   └── stats.json         # Stats and analytics
├── .github/
│   ├── workflows/         # GitHub Actions automation
│   └── ISSUE_TEMPLATE/    # Issue templates
├── scripts/               # Automation scripts
├── docs/                  # Documentation
└── examples/              # Templates and examples
```

---

## Getting Help

- 💬 [GitHub Discussions](https://github.com/saurabh-vision/awesome-ai-tools-database/discussions)
- 🐛 [GitHub Issues](https://github.com/saurabh-vision/awesome-ai-tools-database/issues)
- 📖 [Contributing Guide](../CONTRIBUTING.md)
