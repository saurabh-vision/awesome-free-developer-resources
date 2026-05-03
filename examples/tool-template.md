# Tool Submission Template

Use this template when submitting a new tool via Pull Request.

---

## 1. README.md Entry

Copy the appropriate format for your tool's section:

### For table sections (hosting, databases, etc.):
```markdown
| [Tool Name](https://tool.com) | ✅ Free tier description | Best use case | [Affiliate](https://aff.link) |
```

**Example:**
```markdown
| [Fly.io](https://fly.io) | ✅ 3 shared VMs free | Dockerized apps | [Try Fly.io](https://fly.io) |
```

### For list sections (AI tools, references, etc.):
```markdown
- [Tool Name](https://tool.com) — One line description. Best for: specific use case.
```

**Example:**
```markdown
- [Aider](https://aider.chat) — AI pair programming in your terminal. Best for: developers who prefer CLI over GUI editors.
```

---

## 2. data/tools.json Entry

Copy this template and fill in all fields:

```json
{
  "name": "Tool Name",
  "url": "https://tool.com",
  "category": "ai-llm",
  "subcategory": "coding-assistants",
  "description": "1-2 sentences. What does it do? What makes it unique?",
  "free_tier": true,
  "free_tier_details": "What's free and any limits (e.g., '500MB storage, 1 project')",
  "best_for": "Specific developer persona or use case",
  "use_cases": [
    "Use case 1 (5 words max)",
    "Use case 2",
    "Use case 3"
  ],
  "affiliate_link": "https://your-affiliate-link.com",
  "stars": null,
  "last_updated": "2024-01-15",
  "tags": ["relevant", "tags", "here"]
}
```

---

## 3. Valid Categories

| category value | Display Name |
|----------------|--------------|
| `ai-llm` | 🤖 AI & LLM Tools |
| `code-snippets` | 💻 Code Snippets & Boilerplates |
| `design` | 🎨 Design Tools |
| `hosting` | 🚀 Hosting & Deployment |
| `databases` | 📊 Databases |
| `devops` | 🔧 DevOps Tools |
| `learning` | 📚 Learning Resources |
| `dev-tools` | 🛠️ Developer Tools |
| `apis` | 💬 APIs & Integration |
| `productivity` | 🎯 Productivity & Automation |
| `security` | 🔐 Security & Authentication |

---

## 4. PR Title Format

```
Add [Tool Name] to [Category Name]
```

**Examples:**
- `Add Bun to Developer Tools`
- `Add Turso to Databases`
- `Add Zed to Developer Tools → IDEs & Editors`

---

## 5. PR Description Template

```markdown
## Adding [Tool Name]

**URL:** https://tool.com  
**Category:** [Category]  
**Free Tier:** Yes/No — [details]

### Why this tool should be added:
[1-3 sentences explaining value to developers]

### Checklist:
- [ ] Tool has working free tier (or is open source)
- [ ] URL is accessible
- [ ] Not a duplicate
- [ ] Both README.md and data/tools.json updated
- [ ] I have no undisclosed affiliation with this tool
```

---

## 6. Good Description Examples

**✅ Good descriptions:**
- "Serverless PostgreSQL with database branching, autoscaling, and per-project billing. Zero cold starts, perfect for preview environments."
- "Open-source Firebase alternative with PostgreSQL, authentication, storage, and real-time subscriptions in one platform."
- "AI-first code editor built on VS Code. Chat with your entire codebase to generate, refactor, and debug code."

**❌ Bad descriptions:**
- "The best tool for developers!" (no specific info)
- "A great platform you should check out." (vague, no details)
- "Postman but better." (comparative without substance)
- "TODO: add description" (placeholder)
