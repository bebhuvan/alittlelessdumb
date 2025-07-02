// OAuth handler for Decap CMS on Cloudflare Pages
// Based on official Decap CMS documentation: https://decapcms.org/docs/backends-overview/

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Get OAuth credentials with fallback
  const clientId = env.OAUTH_GITHUB_CLIENT_ID || 'Ov23liglk1k3Y2EU3fDC';
  const clientSecret = env.OAUTH_GITHUB_CLIENT_SECRET;
  
  // Debug: Check if env vars are available
  console.log('OAuth Config:', {
    client_id: clientId ? 'SET' : 'UNDEFINED',
    client_secret: clientSecret ? 'SET' : 'UNDEFINED'
  });
  
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
        client_id: clientId,
        client_secret: clientSecret,
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
          <h2>Authorization Successful!</h2>
          <p id="status">Sending token to CMS...</p>
          <script>
            console.log('Token received:', '${tokenData.access_token}');
            console.log('Window opener:', window.opener ? 'Available' : 'Not available');
            
            // Give some time before sending message
            setTimeout(() => {
              const message = {
                type: 'authorization_grant',
                provider: 'github',
                token: '${tokenData.access_token}'
              };
              
              console.log('Sending message:', message);
              
              if (window.opener) {
                // Send to specific origin for security
                window.opener.postMessage(message, 'https://alittlelessdumb.pages.dev');
                // Also try with wildcard as fallback
                setTimeout(() => {
                  window.opener.postMessage(message, '*');
                  console.log('Sent with wildcard origin');
                }, 500);
                
                document.getElementById('status').textContent = 'Token sent! Closing window...';
                setTimeout(() => window.close(), 3000);
              } else {
                window.parent.postMessage(message, '*');
                document.getElementById('status').textContent = 'Token sent via parent!';
              }
            }, 1000);
          </script>
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
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  return Response.redirect(githubAuthUrl);
}
