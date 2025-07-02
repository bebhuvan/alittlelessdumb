# A Little Less Dumb — Digital Garden

This repository contains **A Little Less Dumb**, a Quartz v4-based digital garden that will eventually be deployed to Cloudflare Pages.

It started from the Quartz v4 template and has been customised for a simple, opinionated reading experience and (eventually) a CMS-backed editing flow.


> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important.” — Richard Hamming

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.
Quartz v4 features a from-the-ground rewrite focusing on end-user extensibility and ease-of-use.

## Current state

| Area | Status |
|------|--------|
| Site theming | ✅ Orange light/dark palettes, **Inter** header font, favicon, cleaned footer links |
| Content | ✅ Home page, 3 content categories (`link-litter`, `mini-musings`, `tiny-sparks`) with placeholder index files |
| CMS | ⚠️ Decap CMS partially configured; local backend proxy works but the UI is still blank due to conflicts with Quartz’s SPA script. Not used in production yet |
| Editor flow | ✅ You can treat the `content/` folder as an Obsidian vault and write notes there; Quartz renders them |
| Deployment | 🔜 Cloudflare Pages once CMS or pure git workflow is finalised |




## Local development

Prerequisites: **Node 22** (use [`nvm`](https://github.com/nvm-sh/nvm)), pnpm/npm 10+, and optional Obsidian.

1. Install dependencies (only once)
   ```bash
   pnpm install # or npm install
   ```
2. Run Quartz in watch mode (rebuilds on save)
   ```bash
   nvm use 22
   pnpm quartz build --serve  # or npx quartz build --serve
   # Site available at http://localhost:8080
   ```
3. Open the `content/` folder as a vault in Obsidian and edit notes. Each save triggers a rebuild.

### Attempted Decap CMS workflow (optional)
We tried to embed [Decap CMS](https://decapcms.org) under `static/admin/` with a local backend:

* `static/admin/index.html` loads the Decap script.
* `static/admin/config.yml` defines a *test-repo* backend for local use.
* Run the proxy with `npx decap-server` (port 8081).

However, Quartz injects its global SPA JS into every page, wiping the Decap DOM. Shadow-DOM isolation and standalone `admin.html` attempts were made but still conflicted with Quartz’s pretty-URL redirects. The CMS remains non-functional; Obsidian editing is the recommended interim workflow.

## Deployment workflow (planned)

1. Push to GitHub main branch.
2. Cloudflare Pages builds with Node 22 and `pnpm quartz build`.
3. (Future) Enable Decap GitHub backend & OAuth for in-browser editing.

---

## Useful links
* Quartz docs  <https://quartz.jzhao.xyz>
* Decap CMS docs  <https://decapcms.org>
* Obsidian  <https://obsidian.md>

---
*Originally generated from the Quartz v4 template. The [original README](./README_template.md) is in the git history for reference.*
