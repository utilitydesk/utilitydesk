/**
 * UtilityDesk Newsletter Component
 */

class UDNewsletter {
  constructor() {
    this.storageKey = 'ud_newsletter_subscribed';
    this.init();
  }

  init() {
    // Only show once per session
    if (sessionStorage.getItem('ud_newsletter_shown')) return;
    
    // Check if already subscribed
    if (localStorage.getItem(this.storageKey)) return;
    
    // Show newsletter after 10 seconds or on scroll
    setTimeout(() => this.showNewsletter(), 10000);
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500 && !sessionStorage.getItem('ud_newsletter_shown')) {
        this.showNewsletter();
      }
    }, { once: true });
  }

  showNewsletter() {
    if (document.getElementById('ud-newsletter-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'ud-newsletter-modal';
    modal.className = 'ud-newsletter-modal';
    modal.innerHTML = this.getModalHTML();
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => modal.classList.add('show'), 100);
    
    sessionStorage.setItem('ud_newsletter_shown', 'true');
    
    // Close handlers
    modal.querySelector('.ud-newsletter-close').addEventListener('click', () => this.closeNewsletter());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeNewsletter();
    });
    
    // Form handler
    modal.querySelector('form').addEventListener('submit', (e) => this.handleSubmit(e));
  }

  getModalHTML() {
    return `
      <div class="ud-newsletter-overlay">
        <div class="ud-newsletter-content">
          <button class="ud-newsletter-close" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div class="ud-newsletter-header">
            <div class="ud-newsletter-icon">📬</div>
            <h2>Stay Updated with UtilityDesk</h2>
            <p>Get the latest calculators, tools, and financial tips delivered to your inbox. No spam, unsubscribe anytime.</p>
          </div>
          
          <form class="ud-newsletter-form">
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email address" 
              required
              class="ud-newsletter-input"
            />
            <button type="submit" class="ud-newsletter-submit">
              Subscribe Free
            </button>
          </form>
          
          <div class="ud-newsletter-features">
            <div class="ud-newsletter-feature">
              <span class="ud-newsletter-feature-icon">📊</span>
              <span>New Calculators</span>
            </div>
            <div class="ud-newsletter-feature">
              <span class="ud-newsletter-feature-icon">📝</span>
              <span>Tool Updates</span>
            </div>
            <div class="ud-newsletter-feature">
              <span class="ud-newsletter-feature-icon">💡</span>
              <span>Financial Tips</span>
            </div>
          </div>
          
          <p class="ud-newsletter-privacy">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    `;
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[name="email"]').value;
    
    // Simulate API call
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';
    
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify({
        email,
        timestamp: Date.now()
      }));
      
      // Show success
      this.showSuccess();
      
      // Track conversion
      if (window.gtag) {
        window.gtag('event', 'newsletter_signup', {
          event_category: 'engagement',
          event_label: 'newsletter_modal'
        });
      }
    }, 1000);
  }

  showSuccess() {
    const modal = document.getElementById('ud-newsletter-modal');
    if (!modal) return;
    
    const content = modal.querySelector('.ud-newsletter-content');
    content.innerHTML = `
      <div class="ud-newsletter-success">
        <div class="ud-newsletter-success-icon">✓</div>
        <h2>You're Subscribed!</h2>
        <p>Thanks for joining our newsletter. Check your inbox for a welcome email.</p>
        <button class="ud-newsletter-submit" onclick="document.getElementById('ud-newsletter-modal').remove()">
          Continue Browsing
        </button>
      </div>
    `;
  }

  closeNewsletter() {
    const modal = document.getElementById('ud-newsletter-modal');
    if (!modal) return;
    
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new UDNewsletter());
} else {
  new UDNewsletter();
}
