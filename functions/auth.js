// OAuth handler for Decap CMS on Cloudflare Pages
// Based on official Decap CMS documentation: https://decapcms.org/docs/backends-overview/

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Handle callback from GitHub OAuth
  if (url.searchParams.has('code')) {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    // Exchange authorization code for access token
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
      // Send token back to Decap CMS via postMessage
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authorization Complete</title>
        </head>
        <body>
          <script>
            // Send token to parent window (Decap CMS)
            if (window.opener) {
              window.opener.postMessage({
                type: 'authorization_grant',
                provider: 'github',
                token: '${tokenData.access_token}'
              }, '*');
              window.close();
            } else {
              // Fallback if no opener
              window.parent.postMessage({
                type: 'authorization_grant', 
                provider: 'github',
                token: '${tokenData.access_token}'
              }, '*');
            }
          </script>
          <p>Authorization successful! Redirecting...</p>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
      });
    } else {
      return new Response('Authorization failed', { status: 400 });
    }
  }
  
  // Initial auth request - redirect to GitHub
  const state = Math.random().toString(36).substring(7);
  const redirectUri = `${url.origin}/auth`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${env.OAUTH_GITHUB_CLIENT_ID}&scope=repo&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  return Response.redirect(githubAuthUrl);
}
