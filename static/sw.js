const CACHE_NAME = 'alittlelessdumb-v1';
const STATIC_CACHE = 'static-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.css',
  '/prescript.js',
  '/postscript.js',
  '/static/icon.png',
  '/favicon.ico'
];

// Files to cache on first visit
const DYNAMIC_CACHE_PATHS = [
  '/all-posts',
  '/about',
  '/static/contentIndex.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response before caching
            const responseToCache = response.clone();
            const url = new URL(event.request.url);

            // Cache HTML pages and important assets
            if (
              event.request.destination === 'document' ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.js') ||
              url.pathname.includes('/static/') ||
              DYNAMIC_CACHE_PATHS.some(path => url.pathname.startsWith(path))
            ) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  console.log('Caching new resource:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/offline') || new Response(
                `
                <html>
                  <head>
                    <title>Offline - A Little Less Dumb</title>
                    <style>
                      body { 
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background: #f8f9fa;
                        color: #333;
                        text-align: center;
                        padding: 2rem;
                      }
                      .emoji { font-size: 4rem; margin-bottom: 1rem; }
                      h1 { margin: 0 0 1rem 0; }
                      p { max-width: 500px; line-height: 1.5; }
                    </style>
                  </head>
                  <body>
                    <div class="emoji">🏝️</div>
                    <h1>You're offline</h1>
                    <p>
                      Looks like you've wandered into the digital wilderness without an internet connection. 
                      Check your connection and try again, or browse the cached posts you've already visited.
                    </p>
                    <button onclick="location.reload()" style="
                      background: #FF7A00; 
                      color: white; 
                      border: none; 
                      padding: 0.75rem 1.5rem; 
                      border-radius: 0.5rem; 
                      cursor: pointer;
                      margin-top: 1rem;
                    ">
                      Try Again
                    </button>
                  </body>
                </html>
                `,
                {
                  headers: {
                    'Content-Type': 'text/html'
                  }
                }
              );
            }

            // For other requests, just fail
            throw error;
          });
      })
  );
});

// Handle background sync (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
  }
});

// Handle push notifications (optional for future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/static/icon.png',
      badge: '/static/icon.png',
      tag: 'notification'
    };
    
    event.waitUntil(
      self.registration.showNotification('A Little Less Dumb', options)
    );
  }
});