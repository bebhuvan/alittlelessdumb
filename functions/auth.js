// OAuth handler for Decap CMS on Cloudflare Pages
// Based on: https://github.com/SubhenduX/decap-cms-cloudflare-pages

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Handle OAuth callback
  if (url.searchParams.has('code')) {
    const code = url.searchParams.get('code');
    
    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: env.OAUTH_GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.access_token) {
      // Return success page with token for CMS
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authorization Complete</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'authorization_grant',
              provider: 'github',
              token: '${tokenData.access_token}'
            }, window.location.origin);
            window.close();
          </script>
          <p>Authorization successful! You can close this window.</p>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
  }
  
  // Initial OAuth redirect
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${env.OAUTH_GITHUB_CLIENT_ID}&scope=repo&redirect_uri=${encodeURIComponent(url.origin + '/auth')}`;
  
  return Response.redirect(githubAuthUrl);
}
