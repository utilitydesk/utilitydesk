/* UtilityDesk.in - Header Component JavaScript v2.0 */

class UDHeader {
  constructor() {
    this.header = null;
    this.mobileMenu = null;
    this.mobileToggle = null;
    this.dropdown = null;
    this.init();
  }

  init() {
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
    this.dropdown = document.querySelector('.ud-nav-dropdown');

    if (!this.header) return;

    // Scroll behavior
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Mobile menu toggle
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

    // Dropdown menu
    if (this.dropdown) {
      const trigger = this.dropdown.querySelector('.ud-nav-dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleDropdown();
        });
      }

      // Close dropdown on outside click
      document.addEventListener('click', (e) => {
        if (this.dropdown && this.dropdown.classList.contains('active')) {
          if (!this.dropdown.contains(e.target)) {
            this.closeDropdown();
          }
        }
      });

      // Close dropdown on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.dropdown.classList.contains('active')) {
          this.closeDropdown();
        }
      });
    }

    // Set active link
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
      
      const spans = this.mobileToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }

  toggleDropdown() {
    if (this.dropdown) {
      this.dropdown.classList.toggle('active');
    }
  }

  closeDropdown() {
    if (this.dropdown) {
      this.dropdown.classList.remove('active');
    }
  }

  setActiveLink() {
    const path = window.location.pathname.replace(/index\.html$/, '');
    const links = document.querySelectorAll('.ud-nav-link, .ud-mobile-menu-link');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('/')) return;
      const target = href.endsWith('/') ? href : `${href}/`;
      const active = path === target || (target !== '/' && path.startsWith(target));
      link.classList.toggle('active', active);
      if (active) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
}

// Initialize header
new UDHeader();
