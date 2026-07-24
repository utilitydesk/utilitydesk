/**
 * UtilityDesk Social Sharing System
 * Fixed version with proper page detection and floating widget
 */

class UDSocialSharing {
  constructor() {
    this.isExpanded = false;
    this.init();
  }

  init() {
    // Lazy load - wait for page to be interactive
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.renderWidget());
    } else {
      // Small delay to avoid CLS
      setTimeout(() => this.renderWidget(), 100);
    }
  }

  /**
   * Check if current page should show the share widget
   * Only show on individual content pages, not listing pages
   */
  shouldShowWidget() {
    const path = window.location.pathname;
    
    // Hide on homepage
    if (path === '/' || path === '/index.html') {
      return false;
    }
    
    // Hide on listing pages (exact match)
    const listingPages = [
      '/calculators/',
      '/blog/',
      '/pdf-tools/',
      '/document-generators/',
      '/about/',
      '/contact/',
      '/privacy-policy/',
      '/terms-and-conditions/',
      '/disclaimer/',
      '/sitemap.xml',
      '/404.html'
    ];
    
    if (listingPages.includes(path)) {
      return false;
    }
    
    // Show on individual content pages
    // Pattern: /category/slug/ (has content after category)
    const contentPatterns = [
      /^\/calculators\/[^/]+\/$/,  // /calculators/sip-calculator/
      /^\/blog\/[^/]+\/$/,          // /blog/article-slug/
      /^\/pdf-tools\/[^/]+\/$/,     // /pdf-tools/merge-pdf/
      /^\/document-generators\/[^/]+\/$/  // /document-generators/offer-letter/
    ];
    
    return contentPatterns.some(pattern => pattern.test(path));
  }

  renderWidget() {
    // Check if widget should be shown
    if (!this.shouldShowWidget()) {
      return;
    }
    
    // Check if already rendered
    if (document.getElementById('ud-social-share')) {
      return;
    }
    
    // Create widget container
    const widget = document.createElement('div');
    widget.id = 'ud-social-share';
    widget.className = 'ud-social-share-widget';
    widget.setAttribute('role', 'region');
    widget.setAttribute('aria-label', 'Share this page');
    
    widget.innerHTML = this.getWidgetHTML();
    
    // Add to body
    document.body.appendChild(widget);
    
    // Setup event listeners
    this.setupEventListeners(widget);
  }

  getWidgetHTML() {
    const url = window.location.href;
    const title = document.title;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(`Check out ${title} on UtilityDesk.in`);
    
    return `
      <button 
        class="ud-share-toggle" 
        aria-label="Share this page" 
        aria-expanded="false"
        aria-controls="ud-share-options"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span class="ud-share-toggle-text">Share</span>
      </button>
      
      <div 
        id="ud-share-options" 
        class="ud-share-options" 
        role="group" 
        aria-label="Share options"
        hidden
      >
        <button 
          class="ud-share-option ud-share-copy" 
          data-action="copy"
          aria-label="Copy link to clipboard"
          title="Copy link"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span>Copy Link</span>
        </button>
        
        <a 
          href="https://wa.me/?text=${encodedText}%20${encodedUrl}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="ud-share-option ud-share-whatsapp"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
          data-action="whatsapp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
        
        <a 
          href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="ud-share-option ud-share-facebook"
          aria-label="Share on Facebook"
          title="Share on Facebook"
          data-action="facebook"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook</span>
        </a>
        
        <a 
          href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="ud-share-option ud-share-linkedin"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
          data-action="linkedin"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span>LinkedIn</span>
        </a>
        
        <a 
          href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="ud-share-option ud-share-twitter"
          aria-label="Share on X (Twitter)"
          title="Share on X"
          data-action="twitter"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>X</span>
        </a>
        
        <a 
          href="mailto:?subject=${encodedTitle}&body=Check%20out%20this%20page%3A%20${encodedUrl}"
          class="ud-share-option ud-share-email"
          aria-label="Share via email"
          title="Share via email"
          data-action="email"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>Email</span>
        </a>
      </div>
    `;
  }

  setupEventListeners(widget) {
    const toggle = widget.querySelector('.ud-share-toggle');
    const options = widget.querySelector('.ud-share-options');
    const shareOptions = widget.querySelectorAll('.ud-share-option');
    
    // Toggle expand/collapse
    toggle.addEventListener('click', () => {
      this.isExpanded = !this.isExpanded;
      toggle.setAttribute('aria-expanded', this.isExpanded);
      
      if (this.isExpanded) {
        options.removeAttribute('hidden');
        widget.classList.add('ud-share-expanded');
      } else {
        options.setAttribute('hidden', '');
        widget.classList.remove('ud-share-expanded');
      }
    });
    
    // Handle share actions
    shareOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const action = option.dataset.action;
        
        if (action === 'copy') {
          e.preventDefault();
          this.copyToClipboard(window.location.href);
        } else {
          // Close after sharing (for links that open in new tab)
          setTimeout(() => {
            this.isExpanded = false;
            toggle.setAttribute('aria-expanded', 'false');
            options.setAttribute('hidden', '');
            widget.classList.remove('ud-share-expanded');
          }, 300);
        }
      });
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isExpanded) {
        this.isExpanded = false;
        toggle.setAttribute('aria-expanded', 'false');
        options.setAttribute('hidden', '');
        widget.classList.remove('ud-share-expanded');
        toggle.focus();
      }
    });
    
    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.isExpanded && !widget.contains(e.target)) {
        this.isExpanded = false;
        toggle.setAttribute('aria-expanded', 'false');
        options.setAttribute('hidden', '');
        widget.classList.remove('ud-share-expanded');
      }
    });
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      // Show success notification
      this.showNotification('Link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showNotification('Link copied to clipboard!');
    });
  }

  showNotification(message) {
    // Remove existing notification
    const existing = document.getElementById('ud-share-notification');
    if (existing) {
      existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.id = 'ud-share-notification';
    notification.className = 'ud-share-notification';
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('ud-share-notification-hide');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize
new UDSocialSharing();
