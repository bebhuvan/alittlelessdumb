# Cloudflare Pages Deployment Guide

## Setup

This project is configured for deployment on Cloudflare Pages with the following settings:

### Build Configuration
- **Framework preset**: None (custom)
- **Build command**: `pnpm quartz build`
- **Build output directory**: `public`
- **Node.js version**: `22`
- **Package manager**: `pnpm`

### Environment Variables
No additional environment variables required.

## Deployment Steps

### Option 1: Git Integration (Recommended)

1. **Push to GitHub/GitLab**:
   ```bash
   git add .
   git commit -m "Setup for Cloudflare Pages deployment"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Pages** → **Create a project**
   - Choose **Connect to Git**
   - Select your repository
   - Configure build settings:
     - **Framework preset**: None
     - **Build command**: `pnpm quartz build`
     - **Build output directory**: `public`
     - **Environment variables**: 
       - `NODE_VERSION` = `22`
       - `PNPM_VERSION` = `latest`

3. **Deploy**: Click "Save and Deploy"

### Option 2: Direct Upload

1. **Build locally**:
   ```bash
   pnpm quartz build
   ```

2. **Upload to Cloudflare Pages**:
   - Go to **Pages** → **Create a project** → **Upload assets**
   - Upload the `public` folder contents
   - Configure custom domain if needed

## Configuration Files

- `_headers`: HTTP headers for caching and security
- `_redirects`: URL redirects and SPA routing
- `wrangler.toml`: Cloudflare configuration (optional)

## Post-Deployment

1. **Custom Domain**: Add your custom domain in Cloudflare Pages settings
2. **SSL**: Automatic SSL is enabled by default
3. **Analytics**: Enable Cloudflare Web Analytics if desired

## Content Updates

With the Obsidian workflow:

1. Edit content in Obsidian (files in `content/` directory)
2. Commit and push changes to git
3. Cloudflare Pages will automatically rebuild and deploy

## Local Development

```bash
# Install dependencies
pnpm install

# Build and serve locally
pnpm quartz build --serve

# Access at http://localhost:8080
```

## Notes

- Decap CMS files have been moved to `decap-backup/` to avoid deployment conflicts
- The `/admin` routes are redirected to home to prevent 404s
- Git tracking warnings are normal for new content files
