# 🧠 A Little Less Dumb — Digital Garden

> "[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important." — Richard Hamming

A **fully functional digital garden** built with Quartz v4 and integrated with Pages CMS for seamless browser-based content editing. Deployed on Cloudflare Pages with a custom lightbulb favicon and thoughtful content organization.

## 🎯 Current Status: Production Ready

| Component | Status | Details |
|-----------|--------|----------|
| **🎨 Design** | ✅ Complete | Orange theme, Inter fonts, custom lightbulb favicon |
| **📝 Content** | ✅ Organized | 5 content categories with playful names |
| **⚡ CMS** | ✅ Fully Functional | Pages CMS integrated with GitHub + Cloudflare |
| **🚀 Deployment** | ✅ Live** | Cloudflare Pages with automated builds |
| **📱 Editing** | ✅ Multiple Options | Browser CMS + local Obsidian + direct markdown |

---

## 🗂️ Content Categories

The site organizes content into five themed collections:

- **📎 Gaggle of Links** - Curated web links and bookmarks
- **💭 Brain Dumps** - Quick thoughts and random musings  
- **📚 Stolen Wisdom** - Insights captured from books, articles, videos
- **🕳️ Link Blackhole** - Where bookmarks and good intentions disappear forever
- **🤖 Machine-Taught** - Learning adventures with AI companions
- **✍️ Proper Posts** - Long-form essays and structured writing

---

## 🎛️ Pages CMS Configuration

### ✅ What Works
The site uses **Pages CMS** for browser-based editing with full functionality:
- All content categories editable through web interface
- Select fields with proper dropdown options
- Multi-select tags with creation capabilities  
- Rich text editing with markdown support
- Date fields and rating systems
- Direct GitHub integration (no OAuth needed)

### ⚙️ Configuration Details
**File**: `.pages.yml` (root directory)

**Key Configuration Patterns:**
```yaml
# Select fields with dropdown options
- name: status
  type: select
  options:
    values: [ "draft", "published", "archived" ]

# Multi-select tags (creatable)
- name: tags
  type: select
  options:
    multiple: true
    creatable: true
    values: [ "essay", "thoughts", "personal" ]

# Rich text content
- name: content
  type: rich-text
```

### ⚠️ Critical Pitfalls & Solutions

**🚨 PITFALL #1: "Z.options.values.map is not a function" Error**
- **Cause**: Using `list` field type (doesn't exist in Pages CMS)
- **Solution**: Use `select` with `multiple: true` for multi-value fields
```yaml
# ❌ WRONG - list field doesn't exist
- name: tags
  type: list
  item_type: string

# ✅ CORRECT - use select with multiple
- name: tags
  type: select
  options:
    multiple: true
    creatable: true
```

**🚨 PITFALL #2: Select Field Options Format**
- **Cause**: Complex object format instead of simple array
- **Solution**: Use simple `values: [...]` array
```yaml
# ❌ WRONG - complex object format
options:
  - label: "Draft"
    value: "draft"

# ✅ CORRECT - simple array format  
options:
  values: [ "draft", "published", "archived" ]
```

**🚨 PITFALL #3: Conflicting CMS Configurations**
- **Issue**: Multiple CMS config files cause conflicts
- **Solution**: Remove all other CMS configs, keep only `.pages.yml`
- **Removed**: `static/admin/config.yml` (old Decap CMS)

---

## 🛠️ Local Development

### Prerequisites
- **Node.js 22+** (use [`nvm`](https://github.com/nvm-sh/nvm))
- **pnpm** (preferred) or npm 10+
- **Obsidian** (optional, for local editing)

### Setup & Running
```bash
# Install dependencies (first time only)
pnpm install

# Start development server
nvm use 22
pnpm quartz build --serve
# → Site available at http://localhost:8080
```

### Content Editing Options
1. **Browser CMS**: Visit `/admin` on your deployed site
2. **Local Obsidian**: Open `content/` folder as vault
3. **Direct Markdown**: Edit `.md` files in `content/` directories

---

## 🚀 Deployment

### Cloudflare Pages Configuration
- **Framework**: None (custom build)
- **Build Command**: `pnpm quartz build`
- **Build Output**: `public/`
- **Node Version**: `22`
- **Environment Variables**: None required

### Deployment Workflow
1. Push to GitHub `main` branch
2. Cloudflare Pages auto-builds and deploys
3. Pages CMS automatically works (GitHub integration)
4. Content editable immediately via browser

---

## 🎨 Customizations

### Design Features
- **Theme**: Custom orange color palette with dark/light modes
- **Typography**: Inter font for headers, system fonts for body
- **Favicon**: Custom lightbulb emoji theme (SVG + PNG + ICO)
- **Navigation**: Clean footer, organized content categories

### Technical Stack
- **Static Site Generator**: [Quartz v4](https://quartz.jzhao.xyz)
- **CMS**: [Pages CMS](https://pagescms.org)
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com)
- **Source Control**: GitHub with automated deployments
- **Content Format**: Markdown with frontmatter

---

## 🔧 Troubleshooting

### CMS Issues
- **Can't edit content**: Check `.pages.yml` syntax with [YAML Validator](https://yamlchecker.com)
- **Field errors**: Ensure no `list` fields, use `select` with `multiple: true`
- **Missing options**: Verify `options.values` is simple array format

### Build Issues  
- **Build failures**: Check Node version (must be 22+)
- **Missing files**: Ensure `public/` is gitignored but content files aren't
- **Deployment errors**: Verify Cloudflare Pages build settings

### Content Issues
- **Broken links**: Use relative paths starting with `/`
- **Missing images**: Place in `content/static/` and reference as `/static/image.jpg`
- **Markdown rendering**: Test locally with `pnpm quartz build --serve`

---

## 📚 Resources

- **Quartz Documentation**: <https://quartz.jzhao.xyz>
- **Pages CMS Documentation**: <https://pagescms.org>
- **Cloudflare Pages Docs**: <https://developers.cloudflare.com/pages>
- **Digital Gardens**: <https://jzhao.xyz/posts/networked-thought>

---

## 🏗️ Project History

Started from the Quartz v4 template and evolved through:
1. **Theme customization** - Orange palette, Inter fonts, lightbulb branding
2. **Content organization** - Five themed content categories  
3. **CMS integration attempts** - Tried TinaCMS, Decap CMS (conflicts with Quartz)
4. **Pages CMS success** - Found perfect solution with proper configuration
5. **Production deployment** - Fully functional on Cloudflare Pages
6. **Project cleanup** - Removed conflicting configs, optimized structure

*Original Quartz template README available in git history for reference.*
