#!/usr/bin/env node

/**
 * Post-build script to ensure admin routes work correctly with Quartz
 * This script runs after Quartz build to fix any routing conflicts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const adminDir = path.join(publicDir, 'admin');

// Ensure admin directory exists in public
if (!fs.existsSync(adminDir)) {
  fs.mkdirSync(adminDir, { recursive: true });
}

// Copy admin files if they don't exist or are different
const staticAdminDir = path.join(__dirname, '..', 'static', 'admin');
if (fs.existsSync(staticAdminDir)) {
  const files = fs.readdirSync(staticAdminDir);
  
  files.forEach(file => {
    const srcPath = path.join(staticAdminDir, file);
    const destPath = path.join(adminDir, file);
    
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copied ${file} to public/admin/`);
    }
  });
}

// Create a simple redirect for /admin to /admin/
const adminIndexPath = path.join(publicDir, 'admin.html');
const redirectContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting to CMS...</title>
  <meta http-equiv="refresh" content="0; url=/admin/">
</head>
<body>
  <script>window.location.href = '/admin/';</script>
  <p>If you are not redirected automatically, <a href="/admin/">click here</a>.</p>
</body>
</html>`;

fs.writeFileSync(adminIndexPath, redirectContent);
console.log('✓ Created admin redirect page');

console.log('✓ Admin routes setup complete');
