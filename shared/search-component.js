/* UtilityDesk.in - Search Component JavaScript */

class UDSearch {
  constructor() {
    this.searchInput = null;
    this.searchResults = null;
    this.searchClear = null;
    this.searchData = null;
    this.init();
  }

  async init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async setup() {
    this.searchInput = document.querySelector('.ud-search-input');
    this.searchResults = document.querySelector('.ud-search-results');
    this.searchClear = document.querySelector('.ud-search-clear');

    if (!this.searchInput || !this.searchResults) return;

    // Load search index
    try {
      const response = await fetch('/search-index.json');
      this.searchData = await response.json();
    } catch (error) {
      console.error('Failed to load search index:', error);
      this.searchData = { calculators: [], blogs: [], tools: [] };
    }

    // Add event listeners
    this.searchInput.addEventListener('input', () => this.handleSearch());
    this.searchInput.addEventListener('focus', () => this.handleFocus());
    
    if (this.searchClear) {
      this.searchClear.addEventListener('click', () => this.clearSearch());
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
        this.hideResults();
      }
    });

    // Close on escape
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideResults();
        this.searchInput.blur();
      }
    });
  }

  handleSearch() {
    const query = this.searchInput.value.trim().toLowerCase();
    
    // Show/hide clear button
    if (this.searchClear) {
      this.searchClear.classList.toggle('visible', query.length > 0);
    }

    if (query.length < 2) {
      this.hideResults();
      return;
    }

    const results = this.performSearch(query);
    this.displayResults(results);
  }

  handleFocus() {
    const query = this.searchInput.value.trim().toLowerCase();
    if (query.length >= 2) {
      const results = this.performSearch(query);
      this.displayResults(results);
    }
  }

  performSearch(query) {
    const results = {
      calculators: [],
      blogs: [],
      tools: []
    };

    if (!this.searchData) return results;

    // Search calculators
    if (this.searchData.calculators) {
      results.calculators = this.searchData.calculators
        .filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.keywords && item.keywords.some(k => k.toLowerCase().includes(query)))
        )
        .slice(0, 5);
    }

    // Search blogs
    if (this.searchData.blogs) {
      results.blogs = this.searchData.blogs
        .filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        )
        .slice(0, 3);
    }

    // Search tools
    if (this.searchData.tools) {
      results.tools = this.searchData.tools
        .filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        )
        .slice(0, 3);
    }

    return results;
  }

  displayResults(results) {
    const hasResults = results.calculators.length > 0 || 
                       results.blogs.length > 0 || 
                       results.tools.length > 0;

    if (!hasResults) {
      this.hideResults();
      return;
    }

    let html = '';

    if (results.calculators.length > 0) {
      html += '<div class="ud-search-result-group">';
      html += '<div class="ud-search-result-title">Calculators</div>';
      results.calculators.forEach(item => {
        html += `
          <a href="${item.url}" class="ud-search-result-item">
            <div class="ud-search-result-icon">📊</div>
            <div class="ud-search-result-content">
              <div class="ud-search-result-name">${this.highlightMatch(item.title, this.searchInput.value)}</div>
              <div class="ud-search-result-description">${item.description}</div>
            </div>
          </a>
        `;
      });
      html += '</div>';
    }

    if (results.blogs.length > 0) {
      html += '<div class="ud-search-result-group">';
      html += '<div class="ud-search-result-title">Blog Articles</div>';
      results.blogs.forEach(item => {
        html += `
          <a href="${item.url}" class="ud-search-result-item">
            <div class="ud-search-result-icon">📚</div>
            <div class="ud-search-result-content">
              <div class="ud-search-result-name">${this.highlightMatch(item.title, this.searchInput.value)}</div>
              <div class="ud-search-result-description">${item.description}</div>
            </div>
          </a>
        `;
      });
      html += '</div>';
    }

    if (results.tools.length > 0) {
      html += '<div class="ud-search-result-group">';
      html += '<div class="ud-search-result-title">Tools</div>';
      results.tools.forEach(item => {
        html += `
          <a href="${item.url}" class="ud-search-result-item">
            <div class="ud-search-result-icon">🛠️</div>
            <div class="ud-search-result-content">
              <div class="ud-search-result-name">${this.highlightMatch(item.title, this.searchInput.value)}</div>
              <div class="ud-search-result-description">${item.description}</div>
            </div>
          </a>
        `;
      });
      html += '</div>';
    }

    this.searchResults.innerHTML = html;
    this.searchResults.classList.add('active');
  }

  highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong style="color: var(--ud-accent);">$1</strong>');
  }

  hideResults() {
    if (this.searchResults) {
      this.searchResults.classList.remove('active');
    }
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
      this.hideResults();
      if (this.searchClear) {
        this.searchClear.classList.remove('visible');
      }
      this.searchInput.focus();
    }
  }
}

// Initialize search
new UDSearch();
