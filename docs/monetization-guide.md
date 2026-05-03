# Monetization Guide

This guide explains how to participate in the revenue sharing program and maximize your earnings from contributions.

---

## Overview

The **Awesome AI Tools Database** generates revenue through affiliate links placed next to tool recommendations. When developers click these links and sign up for paid plans, we earn a commission.

**Revenue is shared 80/20:**
- 80% → Community contributors
- 20% → Infrastructure and maintenance

---

## How to Earn as a Contributor

### Step 1: Add Tools with Affiliate Programs

Focus on tools that have affiliate programs. The highest-value tools include:

| Tool | Est. Commission | How to Get Link |
|------|----------------|-----------------|
| Vercel | 20% recurring | [vercel.com/affiliates](https://vercel.com/affiliates) |
| Postman | $50-100/signup | [postman.com/partners](https://postman.com/partners) |
| DigitalOcean | $25-200/signup | [digitalocean.com/affiliates](https://digitalocean.com/affiliates) |
| Udemy | 30% per sale | [udemy.com/affiliate](https://udemy.com/affiliate) |
| Coursera | 20-45% recurring | [coursera.org/affiliates](https://coursera.org/affiliates) |
| Namecheap | $10-15/signup | [namecheap.com/affiliates](https://namecheap.com/affiliates) |

### Step 2: Submit Your Contribution

When submitting a tool via PR, include:
```json
{
  "name": "Tool Name",
  "affiliate_link": "your-affiliate-link-here",
  ...
}
```

### Step 3: Track Your Contributions

We track contributions via git blame and commit history. Each accepted tool is attributed to its first contributor.

### Step 4: Claim Revenue

At the end of each month, if your tools generated affiliate revenue:
1. Open a GitHub Discussion with tag `revenue-claim`
2. List your merged contributions
3. We verify and process within 30 days

---

## Revenue Calculation

### Per-Tool Revenue Share

```
Monthly revenue from a tool = Total affiliate clicks × Conversion rate × Average commission

Your share (if you added the tool) = 5% of that tool's monthly revenue
```

### Example Calculation

```
Postman affiliate link in your entry:
- 1,000 clicks/month
- 3% conversion rate = 30 signups
- $75 average commission = $2,250 total
- Your 5% share = $112.50/month
```

### Bonus Tiers

| Contributions | Monthly Bonus |
|---------------|---------------|
| 1-5 merged tools | Base (5%) |
| 6-15 merged tools | +2% bonus |
| 16+ merged tools | +5% bonus |
| Top contributor of month | Extra $50-200 |

---

## Getting Your Affiliate Links

### Signing Up for Programs

1. **Postman Partner Program**
   - URL: https://www.postman.com/partners/
   - Commission: $50-100 per paid signup
   - Notes: Apply required

2. **Vercel Affiliate**
   - URL: https://vercel.com/affiliates
   - Commission: 20% recurring
   - Notes: Easy approval

3. **DigitalOcean Affiliate**
   - URL: https://www.digitalocean.com/referral-program
   - Commission: $25-200 per referral
   - Notes: Instant approval with code

4. **Impact.com** (for Canva, Fiverr, and more)
   - URL: https://impact.com
   - Notes: One account, many programs

5. **ShareASale** (for hosting tools)
   - URL: https://shareasale.com
   - Notes: Good for hosting/domain tools

6. **Udemy Affiliate**
   - URL: https://www.udemy.com/affiliate/
   - Commission: 30% per sale
   - Notes: Easy approval via Impact.com

---

## Best Tools to Add for Maximum Revenue

### High Commission + High Traffic

1. **Cloud/Hosting Tools** (Vercel, Railway, DigitalOcean)
   - Recurring commissions
   - High developer adoption
   - Easy to promote

2. **API Tools** (Postman, RapidAPI)
   - High one-time commissions
   - Very relevant to developers

3. **Learning Platforms** (Udemy, Coursera)
   - Large audience
   - Frequent sales boost conversions

4. **Security/Auth Tools** (Auth0, Clerk)
   - High-value signups
   - Recurring revenue

### Medium Commission + High Traffic

- Database tools (Supabase, PlanetScale)
- Design tools (Figma, Canva)
- Productivity tools (Notion, Linear)

---

## Rules & Transparency

1. **Label all affiliate links** as `[Affiliate]` in the README table
2. **No misleading links** — affiliate URL must redirect to same tool
3. **Disclose affiliation** — if you work for a tool you're submitting
4. **No link stuffing** — one affiliate link per tool maximum
5. **Quality over quantity** — tools must be genuinely useful

---

## FAQs

**Q: When are payments processed?**
A: Monthly, on the last business day of each month.

**Q: What's the minimum payout?**
A: $50 minimum. Amounts below roll over to next month.

**Q: What payment methods are accepted?**
A: PayPal and bank transfer (details collected during claim).

**Q: Can I add my own affiliate links directly?**
A: Yes, through PR submissions. Include them in the `data/tools.json` entry.

**Q: What if I don't have affiliate links?**
A: You can still contribute tools without affiliate links. We may add affiliate links later and you'll still receive credit.

---

*Questions? Open a [Discussion](https://github.com/saurabh-vision/awesome-ai-tools-database/discussions) with the `monetization` tag.*
