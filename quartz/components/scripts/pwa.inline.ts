// Service Worker registration and PWA functionality
document.addEventListener("DOMContentLoaded", () => {
  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/static/sw.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  showUpdateNotification();
                }
              });
            }
          });
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }

  // PWA install prompt
  let deferredPrompt: any;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button
    showInstallButton();
  });

  function showInstallButton() {
    // Create install button if it doesn't exist
    let installBtn = document.getElementById('pwa-install-btn');
    if (!installBtn) {
      installBtn = document.createElement('button');
      installBtn.id = 'pwa-install-btn';
      installBtn.innerHTML = '📱 Install App';
      installBtn.className = 'pwa-install-btn';
      installBtn.title = 'Install A Little Less Dumb as an app';
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .pwa-install-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: var(--secondary);
          color: var(--light);
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 2rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          transition: all 0.2s ease;
        }
        
        .pwa-install-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        
        .pwa-install-btn.hidden {
          opacity: 0;
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .pwa-install-btn {
            bottom: 80px;
            right: 16px;
            font-size: 0.8rem;
            padding: 0.5rem 0.75rem;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Add click handler
      installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
              hideInstallButton();
            }
            deferredPrompt = null;
          });
        }
      });
      
      document.body.appendChild(installBtn);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        hideInstallButton();
      }, 10000);
    }
  }

  function hideInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.classList.add('hidden');
      setTimeout(() => {
        installBtn.remove();
      }, 300);
    }
  }

  function showUpdateNotification() {
    // Create update notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary);
        color: var(--light);
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        max-width: 300px;
        font-size: 0.9rem;
      ">
        <div style="margin-bottom: 0.5rem; font-weight: 600;">
          🔄 Update Available
        </div>
        <div style="margin-bottom: 1rem; opacity: 0.9;">
          New content is ready. Refresh to get the latest updates.
        </div>
        <button onclick="window.location.reload()" style="
          background: rgba(255,255,255,0.2);
          color: inherit;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          margin-right: 0.5rem;
        ">
          Refresh
        </button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: transparent;
          color: inherit;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          opacity: 0.7;
        ">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 15000);
  }

  // Track online/offline status
  window.addEventListener('online', () => {
    console.log('Back online');
    // Remove any offline indicators
    const offlineIndicator = document.getElementById('offline-indicator');
    if (offlineIndicator) {
      offlineIndicator.remove();
    }
  });

  window.addEventListener('offline', () => {
    console.log('Gone offline');
    // Show offline indicator
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #f39c12;
        color: white;
        text-align: center;
        padding: 0.5rem;
        font-size: 0.9rem;
        z-index: 1002;
      ">
        🏝️ You're offline - browsing cached content
      </div>
    `;
    document.body.appendChild(indicator);
  });
});