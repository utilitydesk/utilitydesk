/* UtilityDesk.in - Header Component JavaScript */

class UDHeader {
  constructor() {
    this.header = null;
    this.mobileMenu = null;
    this.mobileToggle = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.header = document.querySelector('.ud-header');
    this.mobileMenu = document.querySelector('.ud-mobile-menu');
    this.mobileToggle = document.querySelector('.ud-mobile-toggle');

    if (!this.header) return;

    // Add scroll behavior
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Add mobile menu toggle
    if (this.mobileToggle && this.mobileMenu) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu on link click
    const mobileLinks = document.querySelectorAll('.ud-mobile-menu-link, .ud-mobile-menu-cta');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (this.mobileMenu && this.mobileMenu.classList.contains('active')) {
        if (!this.mobileMenu.contains(e.target) && !this.mobileToggle.contains(e.target)) {
          this.closeMobileMenu();
        }
      }
    });

    // Set active link based on current page
    this.setActiveLink();
  }

  handleScroll() {
    if (window.scrollY > 20) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  toggleMobileMenu() {
    if (this.mobileMenu) {
      this.mobileMenu.classList.toggle('active');
      const isOpen = this.mobileMenu.classList.contains('active');
      this.mobileToggle.setAttribute('aria-expanded', isOpen);
      
      // Animate hamburger
      const spans = this.mobileToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    }
  }

  closeMobileMenu() {
    if (this.mobileMenu && this.mobileMenu.classList.contains('active')) {
      this.mobileMenu.classList.remove('active');
      this.mobileToggle.setAttribute('aria-expanded', 'false');
      
      // Reset hamburger
      const spans = this.mobileToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }

  setActiveLink() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.ud-nav-link');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path !== '/' && href !== '/' && path.startsWith(href))) {
        link.classList.add('active');
      }
    });
  }
}

// Initialize header
new UDHeader();
