/**
 * UtilityDesk Recommendation Engine
 * Automatically displays related calculators, blogs, and popular tools
 */

class UDRecommendationEngine {
  constructor() {
    this.recommendations = null;
    this.currentPage = null;
    this.init();
  }

  async init() {
    // Load recommendations data
    await this.loadRecommendations();
    
    // Detect current page
    this.detectCurrentPage();
    
    // Render recommendations
    this.renderRecommendations();
  }

  async loadRecommendations() {
    try {
      const response = await fetch('/shared/recommendations.json');
      this.recommendations = await response.json();
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  }

  detectCurrentPage() {
    const path = window.location.pathname;
    
    // Check if it's a calculator page
    const calcMatch = path.match(/\/calculators\/([^/]+)\/?$/);
    if (calcMatch) {
      this.currentPage = {
        type: 'calculator',
        id: calcMatch[1]
      };
      return;
    }
    
    // Check if it's a blog page
    const blogMatch = path.match(/\/blog\/[^/]+\/([^/]+)\/?$/);
    if (blogMatch) {
      this.currentPage = {
        type: 'blog',
        id: blogMatch[1]
      };
      return;
    }
  }

  renderRecommendations() {
    if (!this.recommendations || !this.currentPage) return;
    
    const container = document.createElement('div');
    container.className = 'ud-recommendations';
    container.innerHTML = this.getRecommendationsHTML();
    
    // Insert before footer
    const footer = document.querySelector('footer');
    if (footer) {
      footer.parentNode.insertBefore(container, footer);
    }
  }

  getRecommendationsHTML() {
    if (this.currentPage.type === 'calculator') {
      return this.getCalculatorRecommendations();
    } else if (this.currentPage.type === 'blog') {
      return this.getBlogRecommendations();
    }
    return '';
  }

  getCalculatorRecommendations() {
    const calc = this.recommendations.calculators[this.currentPage.id];
    if (!calc) return '';

    const relatedCalcs = calc.related || [];
    const relatedBlogs = calc.blogs || [];
    const popular = this.recommendations.popular || [];
    const topFinancial = this.recommendations.topFinancial || [];

    return `
      <div class="ud-rec-container">
        <h2 class="ud-rec-title">Related Resources</h2>
        
        ${relatedCalcs.length > 0 ? `
          <div class="ud-rec-section">
            <h3 class="ud-rec-section-title">📊 Related Calculators</h3>
            <div class="ud-rec-grid">
              ${relatedCalcs.slice(0, 4).map(id => this.getCalculatorCard(id)).join('')}
            </div>
          </div>
        ` : ''}

        ${relatedBlogs.length > 0 ? `
          <div class="ud-rec-section">
            <h3 class="ud-rec-section-title">📚 Related Articles</h3>
            <div class="ud-rec-grid">
              ${relatedBlogs.slice(0, 3).map(url => this.getBlogCard(url)).join('')}
            </div>
          </div>
        ` : ''}

        ${popular.length > 0 ? `
          <div class="ud-rec-section">
            <h3 class="ud-rec-section-title">🔥 Popular Tools</h3>
            <div class="ud-rec-grid">
              ${popular.slice(0, 4).map(id => this.getCalculatorCard(id)).join('')}
            </div>
          </div>
        ` : ''}

        ${topFinancial.length > 0 ? `
          <div class="ud-rec-section">
            <h3 class="ud-rec-section-title">💰 Top Financial Tools</h3>
            <div class="ud-rec-grid">
              ${topFinancial.slice(0, 4).map(id => this.getCalculatorCard(id)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  getBlogRecommendations() {
    const blog = this.recommendations.blogs[this.currentPage.id];
    if (!blog) return '';

    const relatedCalcs = blog.relatedCalculators || [];
    const popular = this.recommendations.popular || [];

    return `
      <div class="ud-rec-container">
        <h2 class="ud-rec-title">Related Resources</h2>
        
        ${relatedCalcs.length > 0 ? `
          <div class="ud-rec-section">
            <h3 class="ud-rec-section-title">📊 Related Calculators</h3>
            <div class="ud-rec-grid">
              ${relatedCalcs.slice(0, 4).map(id => this.getCalculatorCard(id)).join('')}
            </div>
          </div>
        ` : ''}

        ${popular.length > 0 ? `
          <div class="ud-rec-section">
            <h3 class="ud-rec-section-title">🔥 Popular Tools</h3>
            <div class="ud-rec-grid">
              ${popular.slice(0, 4).map(id => this.getCalculatorCard(id)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  getCalculatorCard(id) {
    const calc = this.recommendations.calculators[id];
    if (!calc) return '';

    return `
      <a href="/calculators/${id}/" class="ud-rec-card">
        <div class="ud-rec-card-icon">${calc.icon || '📊'}</div>
        <div class="ud-rec-card-content">
          <h4 class="ud-rec-card-title">${calc.title}</h4>
          <p class="ud-rec-card-desc">${calc.description}</p>
        </div>
      </a>
    `;
  }

  getBlogCard(url) {
    // Extract blog ID from URL
    const blogId = url.split('/').filter(Boolean).pop();
    const blog = this.recommendations.blogs[blogId];
    
    if (!blog) {
      // Fallback for blogs not in recommendations
      return `
        <a href="${url}" class="ud-rec-card">
          <div class="ud-rec-card-icon">📚</div>
          <div class="ud-rec-card-content">
            <h4 class="ud-rec-card-title">Read Article</h4>
            <p class="ud-rec-card-desc">Learn more about this topic</p>
          </div>
        </a>
      `;
    }

    return `
      <a href="${url}" class="ud-rec-card">
        <div class="ud-rec-card-icon">📚</div>
        <div class="ud-rec-card-content">
          <h4 class="ud-rec-card-title">${blog.title}</h4>
          <p class="ud-rec-card-desc">${blog.description}</p>
        </div>
      </a>
    `;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new UDRecommendationEngine());
} else {
  new UDRecommendationEngine();
}
