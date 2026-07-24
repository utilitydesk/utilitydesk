/**
 * UtilityDesk User Experience System
 * Manages favorites, recent tools, continue calculation, and history
 */

class UDUserExperience {
  constructor() {
    this.storageKey = 'ud_user_data';
    this.data = this.loadData();
    this.init();
  }

  // Load data from localStorage
  loadData() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {
      favorites: [],
      recentTools: [],
      recentBlogs: [],
      recentDocuments: [],
      lastCalculations: {},
      recentlyViewed: []
    };
  }

  // Save data to localStorage
  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  // Initialize the system
  init() {
    this.detectCurrentPage();
    this.trackPageView();
    this.renderWidgets();
  }

  // Detect what type of page we're on
  detectCurrentPage() {
    const path = window.location.pathname;
    
    if (path.includes('/calculators/')) {
      const calcId = path.match(/\/calculators\/([^\/]+)\//)?.[1];
      this.currentPage = { type: 'calculator', id: calcId, url: path };
    } else if (path.includes('/blog/')) {
      const blogSlug = path.match(/\/blog\/[^\/]+\/([^\/]+)\//)?.[1];
      this.currentPage = { type: 'blog', id: blogSlug, url: path };
    } else if (path.includes('/pdf-tools/')) {
      const toolId = path.match(/\/pdf-tools\/([^\/]+)\//)?.[1];
      this.currentPage = { type: 'pdf-tool', id: toolId, url: path };
    } else if (path.includes('/document-generators/')) {
      const genId = path.match(/\/document-generators\/([^\/]+)\//)?.[1];
      this.currentPage = { type: 'document', id: genId, url: path };
    } else {
      this.currentPage = { type: 'other', url: path };
    }
  }

  // Track page view
  trackPageView() {
    if (!this.currentPage) return;
    
    const { type, id, url } = this.currentPage;
    
    // Add to recently viewed
    const viewed = this.data.recentlyViewed.filter(item => item.url !== url);
    viewed.unshift({
      type,
      id,
      url,
      timestamp: Date.now(),
      title: document.title
    });
    
    // Keep only last 20
    this.data.recentlyViewed = viewed.slice(0, 20);
    
    // Add to type-specific recent lists
    if (type === 'calculator') {
      this.addToRecent(this.data.recentTools, id, url, document.title);
    } else if (type === 'blog') {
      this.addToRecent(this.data.recentBlogs, id, url, document.title);
    } else if (type === 'document') {
      this.addToRecent(this.data.recentDocuments, id, url, document.title);
    }
    
    this.saveData();
  }

  // Add to recent list (helper)
  addToRecent(list, id, url, title) {
    const filtered = list.filter(item => item.id !== id);
    filtered.unshift({ id, url, title, timestamp: Date.now() });
    return filtered.slice(0, 10);
  }

  // Toggle favorite
  toggleFavorite() {
    if (!this.currentPage || this.currentPage.type === 'other') return;
    
    const { type, id, url } = this.currentPage;
    const existingIndex = this.data.favorites.findIndex(f => f.url === url);
    
    if (existingIndex >= 0) {
      // Remove from favorites
      this.data.favorites.splice(existingIndex, 1);
      this.showNotification('Removed from favorites', 'info');
    } else {
      // Add to favorites
      this.data.favorites.unshift({
        type,
        id,
        url,
        title: document.title,
        timestamp: Date.now()
      });
      this.showNotification('Added to favorites', 'success');
    }
    
    this.saveData();
    this.updateFavoriteButton();
  }

  // Update favorite button state
  updateFavoriteButton() {
    const btn = document.getElementById('ud-favorite-btn');
    if (!btn) return;
    
    const isFavorited = this.data.favorites.some(f => f.url === window.location.pathname);
    btn.classList.toggle('favorited', isFavorited);
    btn.innerHTML = isFavorited ? '★ Favorited' : '☆ Favorite';
  }

  // Save last calculation
  saveCalculation(calcId, inputs) {
    this.data.lastCalculations[calcId] = {
      inputs,
      timestamp: Date.now(),
      url: window.location.pathname
    };
    this.saveData();
    this.showNotification('Calculation saved! You can continue later.', 'success');
  }

  // Get last calculation
  getLastCalculation(calcId) {
    return this.data.lastCalculations[calcId];
  }

  // Render UX widgets
  renderWidgets() {
    this.renderFavoriteButton();
    this.renderRecentTools();
    this.renderContinueCalculation();
    this.renderFavoritesSection();
  }

  // Render favorite button
  renderFavoriteButton() {
    if (!this.currentPage || this.currentPage.type === 'other') return;
    
    // Add button to page header area
    const header = document.querySelector('.page-header, .hero-section, header');
    if (!header) return;
    
    const btn = document.createElement('button');
    btn.id = 'ud-favorite-btn';
    btn.className = 'ud-favorite-btn';
    btn.setAttribute('aria-label', 'Toggle favorite');
    btn.innerHTML = '☆ Favorite';
    
    const isFavorited = this.data.favorites.some(f => f.url === window.location.pathname);
    btn.classList.toggle('favorited', isFavorited);
    if (isFavorited) btn.innerHTML = '★ Favorited';
    
    btn.addEventListener('click', () => this.toggleFavorite());
    
    header.style.position = 'relative';
    header.appendChild(btn);
  }

  // Render recent tools widget
  renderRecentTools() {
    if (this.data.recentTools.length === 0) return;
    
    const container = document.getElementById('ud-recent-tools');
    if (!container) return;
    
    const recent = this.data.recentTools.slice(0, 6);
    
    container.innerHTML = `
      <div class="ud-widget">
        <h3 class="ud-widget-title">Your Recent Tools</h3>
        <div class="ud-recent-grid">
          ${recent.map(tool => `
            <a href="${tool.url}" class="ud-recent-item">
              <span class="ud-recent-icon">🔧</span>
              <div class="ud-recent-info">
                <div class="ud-recent-title">${tool.title}</div>
                <div class="ud-recent-time">${this.timeAgo(tool.timestamp)}</div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Render continue calculation widget
  renderContinueCalculation() {
    if (this.currentPage?.type !== 'calculator') return;
    
    const calcId = this.currentPage.id;
    const lastCalc = this.getLastCalculation(calcId);
    
    if (!lastCalc) return;
    
    const container = document.getElementById('ud-continue-calc');
    if (!container) return;
    
    const timeAgo = this.timeAgo(lastCalc.timestamp);
    
    container.innerHTML = `
      <div class="ud-continue-card">
        <div class="ud-continue-header">
          <span class="ud-continue-icon">📊</span>
          <div>
            <h4>Continue Your Last Calculation</h4>
            <p>Last saved ${timeAgo}</p>
          </div>
        </div>
        <div class="ud-continue-actions">
          <button class="btn btn-primary" onclick="window.udUX.restoreCalculation('${calcId}')">
            Restore Calculation
          </button>
          <button class="btn btn-secondary" onclick="window.udUX.clearCalculation('${calcId}')">
            Clear
          </button>
        </div>
      </div>
    `;
  }

  // Restore last calculation
  restoreCalculation(calcId) {
    const lastCalc = this.getLastCalculation(calcId);
    if (!lastCalc) return;
    
    // Fill in form inputs
    Object.entries(lastCalc.inputs).forEach(([key, value]) => {
      const input = document.querySelector(`[name="${key}"], [id="${key}"]`);
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    
    // Trigger calculation if possible
    const calcBtn = document.querySelector('.btn-calculate, [type="submit"]');
    if (calcBtn) {
      calcBtn.click();
    }
    
    this.showNotification('Calculation restored!', 'success');
  }

  // Clear saved calculation
  clearCalculation(calcId) {
    delete this.data.lastCalculations[calcId];
    this.saveData();
    document.getElementById('ud-continue-calc').remove();
    this.showNotification('Calculation cleared', 'info');
  }

  // Render favorites section
  renderFavoritesSection() {
    if (this.data.favorites.length === 0) return;
    
    const container = document.getElementById('ud-favorites');
    if (!container) return;
    
    const favorites = this.data.favorites.slice(0, 8);
    
    container.innerHTML = `
      <div class="ud-widget">
        <h3 class="ud-widget-title">⭐ Your Favorites</h3>
        <div class="ud-favorites-grid">
          ${favorites.map(fav => `
            <a href="${fav.url}" class="ud-favorite-item">
              <span class="ud-favorite-icon">${this.getIconForType(fav.type)}</span>
              <div class="ud-favorite-info">
                <div class="ud-favorite-title">${fav.title}</div>
                <div class="ud-favorite-type">${fav.type.replace('-', ' ')}</div>
              </div>
            </a>
          `).join('')}
        </div>
        ${this.data.favorites.length > 8 ? '<a href="/favorites/" class="ud-view-all">View All Favorites →</a>' : ''}
      </div>
    `;
  }

  // Helper: Get icon for type
  getIconForType(type) {
    const icons = {
      'calculator': '🧮',
      'pdf-tool': '📄',
      'document': '📝',
      'blog': '📚'
    };
    return icons[type] || '🔧';
  }

  // Helper: Time ago
  timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
  }

  // Show notification
  showNotification(message, type = 'info') {
    if (window.showNotification) {
      window.showNotification(message, type);
    } else {
      // Fallback
      const notification = document.createElement('div');
      notification.className = `ud-notification ud-notification-${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => notification.remove(), 300);
        }, 3000);
      }, 100);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.udUX = new UDUserExperience();
  });
} else {
  window.udUX = new UDUserExperience();
}
