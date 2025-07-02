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
            
            // Send token immediately - based on GitHub issue #770 solution
            const authData = {
              token: '${tokenData.access_token}',
              provider: 'github'
            };
            
            console.log('Auth data:', authData);
            console.log('Window opener:', window.opener);
            console.log('Window origin:', window.location.origin);
            
            if (window.opener) {
              // Send the token in the format Decap CMS expects
              window.opener.postMessage(
                'authorization:github:success:' + authData.token,
                'https://alittlelessdumb.pages.dev'
              );
              
              console.log('Token sent to CMS');
              document.getElementById('status').textContent = 'Authorization complete! Closing...';
              
              // Close after a short delay
              setTimeout(() => {
                window.close();
              }, 1500);
            } else {
              document.getElementById('status').textContent = 'No opener window found!';
              console.error('No window.opener available');
            }
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
