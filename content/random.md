---
title: "Random Post"
date: 2025-07-27
enableToc: false
---

<script>
// Get all posts from the content index and redirect to a random one
fetch('/static/contentIndex.json')
  .then(response => response.json())
  .then(data => {
    // Filter posts (exclude index pages, folders, etc.)
    const posts = Object.entries(data).filter(([slug, content]) => {
      // Skip folders and index pages
      if (slug.endsWith('/index') || slug === 'index') return false;
      // Skip special pages
      if (slug === 'all-posts' || slug === 'about' || slug === 'random') return false;
      // Skip static files
      if (slug.startsWith('static/')) return false;
      return true;
    });
    
    if (posts.length > 0) {
      const randomIndex = Math.floor(Math.random() * posts.length);
      const randomSlug = posts[randomIndex][0];
      window.location.href = `/${randomSlug}`;
    } else {
      // Fallback to all-posts if no posts found
      window.location.href = '/all-posts';
    }
  })
  .catch(error => {
    console.error('Error fetching content index:', error);
    // Fallback to all-posts
    window.location.href = '/all-posts';
  });
</script>

🎲 Finding a random post for you...

If you're not redirected automatically, [browse all posts here](/all-posts).