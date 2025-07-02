/**
 * Admin Route Protection Script
 * This script prevents Quartz SPA routing from interfering with Decap CMS
 * Place this script in the admin/index.html to override SPA behavior
 */

(function() {
  'use strict';
  
  // Override micromorph for admin pages
  if (window.location.pathname.includes('/admin')) {
    console.log('Admin route detected - disabling SPA routing');
    
    // Disable micromorph if it exists
    if (window.micromorph) {
      window.micromorph = function() { 
        console.log('SPA routing disabled for admin');
        return false; 
      };
    }
    
    // Prevent any SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
      if (arguments[2] && arguments[2].includes('/admin')) {
        console.log('Blocking admin navigation via pushState');
        return;
      }
      return originalPushState.apply(history, arguments);
    };
    
    history.replaceState = function() {
      if (arguments[2] && arguments[2].includes('/admin')) {
        console.log('Blocking admin navigation via replaceState');
        return;
      }
      return originalReplaceState.apply(history, arguments);
    };
    
    // Block popstate events for admin
    window.addEventListener('popstate', function(e) {
      if (window.location.pathname.includes('/admin')) {
        console.log('Blocking popstate for admin');
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
    
    // Ensure clean DOM for Decap CMS
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOM loaded for admin - clearing any SPA interference');
      
      // Remove any Quartz-specific elements that might interfere
      const quartzElements = document.querySelectorAll('[data-quartz]');
      quartzElements.forEach(el => el.remove());
      
      // Ensure body is clean for CMS mounting
      if (document.body.children.length > 2) {
        console.log('Cleaning DOM for CMS');
      }
    });
  }
})();
