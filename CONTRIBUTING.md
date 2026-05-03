# Contributing to Awesome AI Tools Database 🚀

Thank you for contributing! This project is **community-driven** and your contributions help developers worldwide discover the best tools.

---

## 🎯 Ways to Contribute

### 🚀 Option 1: GitHub Discussions (Easiest — No PR skills needed!)

1. Go to [Discussions](https://github.com/saurabh-vision/awesome-ai-tools-database/discussions)
2. Click **"New Discussion"** → Select **"Tool Suggestion"**
3. Fill in the template:
   ```
   Tool Name: Postman
   URL: https://postman.com
   Category: Developer Tools → API Testing
   Free Tier: Yes (free for individuals)
   Best For: API development and testing
   Why it's useful: Industry standard for API testing with collaboration features
   ```
4. Submit — our automation will auto-generate a full description and create a PR!

### 📝 Option 2: Submit a Pull Request

1. **Fork** this repository
2. **Edit** `README.md` to add your tool in the correct section
3. **Edit** `data/tools.json` to add the structured data entry
4. Use the proper format (see below)
5. **Open a PR** with title: `Add [Tool Name] to [Category]`

### 🐛 Option 3: Report Issues

- **Broken link:** Open issue titled `[Broken Link] Tool Name`
- **Outdated info:** Open issue titled `[Outdated] Tool Name`
- **Wrong category:** Open issue titled `[Wrong Category] Tool Name`

### 💡 Option 4: Suggest New Category

Open an issue titled `[New Category] Category Name` and explain why it's needed.

---

## 📋 Format for Adding Tools

### README.md Format

**For table entries:**
```markdown
| [Tool Name](https://tool.com) | ✅ Free tier description | Best use case | [Affiliate](https://affiliate-link.com) |
```

**For list entries:**
```markdown
- [Tool Name](https://tool.com) — One line description. Best for: use case.
```

### data/tools.json Format

```json
{
  "name": "Tool Name",
  "url": "https://tool.com",
  "category": "ai-llm",
  "subcategory": "coding-assistants",
  "description": "One to two sentence description of what this tool does.",
  "free_tier": true,
  "free_tier_details": "What's included in the free tier",
  "best_for": "Who benefits most from this tool",
  "use_cases": ["Use case 1", "Use case 2", "Use case 3"],
  "affiliate_link": "https://affiliate.link/or/null",
  "stars": null,
  "last_updated": "2024-01-01",
  "tags": ["tag1", "tag2"]
}
```

---

## ✅ Contribution Checklist

Before submitting your PR, confirm:

- [ ] Tool has a working URL (not a 404)
- [ ] Free tier genuinely exists (no credit card required for basic use)
- [ ] Description is accurate and under 20 words
- [ ] Correct category selected
- [ ] Tool not already listed (search first!)
- [ ] `data/tools.json` entry added (for PR contributions)
- [ ] PR title follows format: `Add [Tool Name] to [Category]`
- [ ] No self-promotional language in description

---

## 🚫 What We Don't Accept

| ❌ Not Allowed | Reason |
|---------------|--------|
| Tools with no free tier (not even limited) | This is a developer resource, not a paid directory |
| Duplicate tools | Check existing list first |
| Referral links in description | Affiliate links are managed separately |
| Self-promotion without disclosure | Transparency required |
| Tools that are abandonware | Must have recent activity |
| Purely regional tools | Must be accessible globally |

---

## 💰 Affiliate Link Policy

1. **Transparency first** — all affiliate links are labeled
2. **No misleading links** — affiliate links must go to the same tool
3. **Contributor revenue sharing** — contributors who add affiliate tools receive credit (see [MONETIZATION.md](MONETIZATION.md))
4. **Only established programs** — from Postman, Vercel, AWS, Stripe, Figma, Coursera, Udemy, etc.
5. **Optional** — you can submit a tool without an affiliate link; we may add one later

---

## 🤖 AI-Powered Automation

When you submit via GitHub Discussions, our automation will:

1. ✅ Validate the tool URL is working
2. ✅ Check if a free tier exists
3. ✅ Auto-generate a description using AI
4. ✅ Detect the best category
5. ✅ Look up affiliate program availability
6. ✅ Create a PR for maintainer review
7. ✅ Fetch metadata (if available)

---

## 🏷️ Categories

Use one of these categories when submitting:

| Category ID | Display Name |
|-------------|--------------|
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

## 🔍 How Free Tier Is Evaluated

| ✅ Qualifies as Free | ❌ Does NOT Qualify |
|---------------------|---------------------|
| Free tier with no expiry | 14-day trial only |
| Open source (self-hostable) | Free for students only |
| Free for personal use | Credit card required to start |
| Generous freemium limits | "Contact us" pricing |

---

## 🤝 Code of Conduct

Be respectful. This is a community resource maintained by volunteers.

- ✅ Constructive feedback welcome
- ✅ Questions via Discussions encouraged
- ❌ No spam or self-promotion without disclosure
- ❌ No harassment or toxic behavior

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for full details.

---

## 🏆 Recognition

All contributors are:
- Listed in our Contributors section
- Credited in release notes
- Eligible for revenue sharing (see [MONETIZATION.md](MONETIZATION.md))

---

Thanks for making this better for developers everywhere! 🌍

