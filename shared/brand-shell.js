/* UtilityDesk.in â€” Global Navigation Interactions v3.0
   Single responsibility: dropdown, mobile menu, active nav, scroll.
   Static pages should already contain canonical <header data-ud-header>
   and <footer data-ud-footer>. This script only adds interaction behavior.
   For files that could not be statically migrated (locked during build),
   it performs a safe one-time injection.
*/
(function () {
  'use strict';

  const BRAND = {
    favicon: '../assets/brand/utilitydesk-favicon.svg'
  };

  const CANONICAL_HEADER = [
    '<header class="ud-header" data-ud-header>',
    '  <div class="ud-header-inner">',
    '    <a href="/" class="ud-brand">',
    '      <img src="../assets/brand/utilitydesk-logo-horizontal.svg" alt="UtilityDesk.in â€” Productivity Tools for India" class="ud-brand-logo">',
    '    </a>',
    '    <nav class="ud-nav">',
    '      <ul class="ud-nav-links">',
    '        <li><a href="/" class="ud-nav-link">Home</a></li>',
    '        <li><a href="/calculators/" class="ud-nav-link">Calculators</a></li>',
    '        <li><a href="/pdf-tools/" class="ud-nav-link">PDF Tools</a></li>',
    '        <li><a href="/hr/" class="ud-nav-link">HR Suite</a></li>',
    '        <li><a href="/document-generators/" class="ud-nav-link">Documents</a></li>',
    '        <li><a href="/blog/" class="ud-nav-link">Blog</a></li>',
    '        <li><a href="/about/" class="ud-nav-link">About</a></li>',
    '        <li><a href="/contact/" class="ud-nav-link">Contact</a></li>',
    '      </ul>',
    '      <div class="ud-nav-dropdown">',
    '        <button class="ud-nav-dropdown-trigger" aria-expanded="false" aria-haspopup="true" type="button">',
    '          Browse Tools',
    '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    '        </button>',
    '        <div class="ud-nav-dropdown-menu" role="menu">',
    '          <div class="ud-nav-dropdown-group">',
    '            <div class="ud-nav-dropdown-group-title">Calculators</div>',
    '            <a href="/calculators/" class="ud-nav-dropdown-item" role="menuitem">All Calculators</a>',
    '            <a href="/calculators/salary-hike/" class="ud-nav-dropdown-item" role="menuitem">Salary &amp; HR</a>',
    '            <a href="/calculators/income-tax/" class="ud-nav-dropdown-item" role="menuitem">Tax</a>',
    '            <a href="/calculators/emi/" class="ud-nav-dropdown-item" role="menuitem">Loans &amp; EMI</a>',
    '            <a href="/calculators/sip-calculator/" class="ud-nav-dropdown-item" role="menuitem">Investments</a>',
    '            <a href="/calculators/business-loan-calculator/" class="ud-nav-dropdown-item" role="menuitem">Business</a>',
    '            <a href="/calculators/unit-converter/" class="ud-nav-dropdown-item" role="menuitem">Utilities</a>',
    '          </div>',
    '          <div class="ud-nav-dropdown-group">',
    '            <div class="ud-nav-dropdown-group-title">PDF Tools</div>',
    '            <a href="/pdf-tools/" class="ud-nav-dropdown-item" role="menuitem">All PDF Tools</a>',
    '            <a href="/pdf-tools/merge-pdf/" class="ud-nav-dropdown-item" role="menuitem">Browser-Based PDF Tools</a>',
    '            <a href="/pdf-tools/ocr-pdf/" class="ud-nav-dropdown-item" role="menuitem">Advanced PDF Tools</a>',
    '          </div>',
    '          <div class="ud-nav-dropdown-group">',
    '            <div class="ud-nav-dropdown-group-title">HR Suite</div>',
    '            <a href="/hr/" class="ud-nav-dropdown-item" role="menuitem">All HR Tools</a>',
    '            <a href="/hr/offer-letter/" class="ud-nav-dropdown-item" role="menuitem">HR Documents</a>',
    '            <a href="/hr/interview-questions/" class="ud-nav-dropdown-item" role="menuitem">Career Tools</a>',
    '            <a href="/hr/resume-rewrite/" class="ud-nav-dropdown-item" role="menuitem">AI Tools</a>',
    '          </div>',
    '          <div class="ud-nav-dropdown-group">',
    '            <div class="ud-nav-dropdown-group-title">Documents</div>',
    '            <a href="/document-generators/" class="ud-nav-dropdown-item" role="menuitem">All Document Generators</a>',
    '            <a href="/document-generators/offer-letter-generator/" class="ud-nav-dropdown-item" role="menuitem">HR Documents</a>',
    '            <a href="/document-generators/invoice/" class="ud-nav-dropdown-item" role="menuitem">Business Documents</a>',
    '          </div>',
    '          <div class="ud-nav-dropdown-group">',
    '            <div class="ud-nav-dropdown-group-title">Other</div>',
    '            <a href="/blog/" class="ud-nav-dropdown-item" role="menuitem">Blog</a>',
    '            <a href="/about/" class="ud-nav-dropdown-item" role="menuitem">About</a>',
    '            <a href="/contact/" class="ud-nav-dropdown-item" role="menuitem">Contact</a>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </nav>',
    '    <button class="ud-mobile-toggle" aria-label="Toggle menu" aria-expanded="false" aria-haspopup="true" type="button">',
    '      <span></span><span></span><span></span>',
    '    </button>',
    '  </div>',
    '  <div class="ud-mobile-menu">',
    '    <ul class="ud-mobile-menu-links">',
    '      <li><a href="/" class="ud-mobile-menu-link">Home</a></li>',
    '      <li><a href="/calculators/" class="ud-mobile-menu-link">Calculators</a></li>',
    '      <li><a href="/pdf-tools/" class="ud-mobile-menu-link">PDF Tools</a></li>',
    '      <li><a href="/hr/" class="ud-mobile-menu-link">HR Suite</a></li>',
    '      <li><a href="/document-generators/" class="ud-mobile-menu-link">Documents</a></li>',
    '      <li><a href="/blog/" class="ud-mobile-menu-link">Blog</a></li>',
    '      <li><a href="/about/" class="ud-mobile-menu-link">About</a></li>',
    '      <li><a href="/contact/" class="ud-mobile-menu-link">Contact</a></li>',
    '    </ul>',
    '    <div class="ud-mobile-dropdown">',
    '      <button class="ud-mobile-dropdown-trigger" aria-expanded="false" aria-haspopup="true" type="button">Browse Tools &#x25BE;</button>',
    '      <div class="ud-mobile-dropdown-menu">',
    '        <a href="/calculators/" class="ud-mobile-dropdown-item">All Calculators</a>',
    '        <a href="/calculators/salary-hike/" class="ud-mobile-dropdown-item">Salary &amp; HR</a>',
    '        <a href="/calculators/income-tax/" class="ud-mobile-dropdown-item">Tax</a>',
    '        <a href="/calculators/emi/" class="ud-mobile-dropdown-item">Loans &amp; EMI</a>',
    '        <a href="/calculators/sip-calculator/" class="ud-mobile-dropdown-item">Investments</a>',
    '        <a href="/pdf-tools/" class="ud-mobile-dropdown-item">All PDF Tools</a>',
    '        <a href="/pdf-tools/merge-pdf/" class="ud-mobile-dropdown-item">Browser-Based PDF Tools</a>',
    '        <a href="/pdf-tools/ocr-pdf/" class="ud-mobile-dropdown-item">Advanced PDF Tools</a>',
    '        <a href="/hr/" class="ud-mobile-dropdown-item">All HR Tools</a>',
    '        <a href="/hr/offer-letter/" class="ud-mobile-dropdown-item">HR Documents</a>',
    '        <a href="/hr/interview-questions/" class="ud-mobile-dropdown-item">Career Tools</a>',
    '        <a href="/hr/resume-rewrite/" class="ud-mobile-dropdown-item">AI Tools</a>',
    '        <a href="/document-generators/" class="ud-mobile-dropdown-item">All Documents</a>',
    '        <a href="/document-generators/offer-letter-generator/" class="ud-mobile-dropdown-item">HR Documents</a>',
    '        <a href="/document-generators/invoice/" class="ud-mobile-dropdown-item">Business Documents</a>',
    '        <a href="/blog/" class="ud-mobile-dropdown-item">Blog</a>',
    '        <a href="/about/" class="ud-mobile-dropdown-item">About</a>',
    '        <a href="/contact/" class="ud-mobile-dropdown-item">Contact</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</header>'
  ].join('\n');

  const CANONICAL_FOOTER = [
    '<footer class="ud-footer" data-ud-footer>',
    '  <div class="ud-footer-inner">',
    '    <div class="ud-footer-grid">',
    '      <div class="ud-footer-brand">',
    '        <a href="/" class="ud-footer-logo">',
    '          <img src="../assets/brand/utilitydesk-logo-icon.svg" alt="UtilityDesk.in" class="ud-footer-logo-img">',
    '          <div class="ud-footer-logo-text">',
    '            <div class="ud-footer-logo-title">UtilityDesk.in</div>',
    '            <div class="ud-footer-logo-tagline">Productivity Tools for India</div>',
    '          </div>',
    '        </a>',
    '        <p class="ud-footer-description">Free calculators, PDF tools, HR tools and document generators for Indian professionals. No signup required.</p>',
    '      </div>',
    '      <div class="ud-footer-column">',
    '        <h4 class="ud-footer-title">Calculators</h4>',
    '        <ul class="ud-footer-links">',
    '          <li><a href="/calculators/income-tax/" class="ud-footer-link">Income Tax</a></li>',
    '          <li><a href="/calculators/salary-hike/" class="ud-footer-link">Salary Hike</a></li>',
    '          <li><a href="/calculators/in-hand-salary/" class="ud-footer-link">In-Hand Salary</a></li>',
    '          <li><a href="/calculators/emi/" class="ud-footer-link">EMI Calculator</a></li>',
    '          <li><a href="/calculators/pf-calculator/" class="ud-footer-link">PF Calculator</a></li>',
    '          <li><a href="/calculators/" class="ud-footer-link">All Calculators &#8594;</a></li>',
    '        </ul>',
    '      </div>',
    '      <div class="ud-footer-column">',
    '        <h4 class="ud-footer-title">PDF Tools</h4>',
    '        <ul class="ud-footer-links">',
    '          <li><a href="/pdf-tools/jpg-to-pdf/" class="ud-footer-link">JPG to PDF</a></li>',
    '          <li><a href="/pdf-tools/protect-pdf/" class="ud-footer-link">Protect PDF</a></li>',
    '          <li><a href="/pdf-tools/watermark-pdf/" class="ud-footer-link">Watermark PDF</a></li>',
    '          <li><a href="/pdf-tools/delete-pages/" class="ud-footer-link">Delete Pages</a></li>',
    '          <li><a href="/pdf-tools/merge-pdf/" class="ud-footer-link">Merge PDF</a></li>',
    '          <li><a href="/pdf-tools/" class="ud-footer-link">All PDF Tools &#8594;</a></li>',
    '        </ul>',
    '      </div>',
    '      <div class="ud-footer-column">',
    '        <h4 class="ud-footer-title">HR Suite</h4>',
    '        <ul class="ud-footer-links">',
    '          <li><a href="/hr/resume-builder/" class="ud-footer-link">Resume Builder</a></li>',
    '          <li><a href="/hr/ats-checker/" class="ud-footer-link">ATS Checker AI</a></li>',
    '          <li><a href="/hr/offer-letter/" class="ud-footer-link">Offer Letter</a></li>',
    '          <li><a href="/hr/salary-slip/" class="ud-footer-link">Salary Slip</a></li>',
    '          <li><a href="/hr/hr-policy-generator/" class="ud-footer-link">HR Policy AI</a></li>',
    '          <li><a href="/hr/" class="ud-footer-link">All HR Tools &#8594;</a></li>',
    '        </ul>',
    '      </div>',
    '      <div class="ud-footer-column">',
    '        <h4 class="ud-footer-title">Document Generators</h4>',
    '        <ul class="ud-footer-links">',
    '          <li><a href="/document-generators/offer-letter-generator/" class="ud-footer-link">Offer Letter</a></li>',
    '          <li><a href="/document-generators/appointment-letter/" class="ud-footer-link">Appointment Letter</a></li>',
    '          <li><a href="/document-generators/invoice/" class="ud-footer-link">Invoice</a></li>',
    '          <li><a href="/document-generators/nda/" class="ud-footer-link">NDA Generator</a></li>',
    '          <li><a href="/document-generators/salary-slip/" class="ud-footer-link">Salary Slip</a></li>',
    '          <li><a href="/document-generators/" class="ud-footer-link">All Documents &#8594;</a></li>',
    '        </ul>',
    '      </div>',
    '      <div class="ud-footer-column">',
    '        <h4 class="ud-footer-title">Company</h4>',
    '        <ul class="ud-footer-links">',
    '          <li><a href="/about/" class="ud-footer-link">About</a></li>',
    '          <li><a href="/contact/" class="ud-footer-link">Contact</a></li>',
    '          <li><a href="/blog/" class="ud-footer-link">Blog</a></li>',
    '          <li><a href="/privacy-policy/" class="ud-footer-link">Privacy Policy</a></li>',
    '          <li><a href="/terms-and-conditions/" class="ud-footer-link">Terms &amp; Conditions</a></li>',
    '          <li><a href="/disclaimer/" class="ud-footer-link">Disclaimer</a></li>',
    '          <li><a href="/sitemap.xml" class="ud-footer-link">Sitemap</a></li>',
    '        </ul>',
    '      </div>',
    '    </div>',
    '    <div class="ud-footer-bottom">',
    '      <div class="ud-footer-copyright">&#169; 2026 UtilityDesk.in. All rights reserved.</div>',
    '      <ul class="ud-footer-legal">',
    '        <li><a href="/privacy-policy/" class="ud-footer-legal-link">Privacy</a></li>',
    '        <li><a href="/terms-and-conditions/" class="ud-footer-legal-link">Terms</a></li>',
    '        <li><a href="/disclaimer/" class="ud-footer-legal-link">Disclaimer</a></li>',
    '      </ul>',
    '    </div>',
    '  </div>',
    '</footer>'
  ].join('\n');

  function ensureFavicon() {
    const existing = document.querySelector('link[rel="icon"][href*="utilitydesk"]');
    if (existing) {
      existing.href = BRAND.favicon;
      existing.type = 'image/svg+xml';
      return;
    }
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = BRAND.favicon;
    document.head.appendChild(link);
  }

  function safeInject() {
    const body = document.body;
    if (!body) return;

    const hasHeader = body.querySelector('[data-ud-header]');
    const hasFooter = body.querySelector('[data-ud-footer]');

    if (!hasHeader) {
      const headerWrapper = document.createElement('div');
      headerWrapper.innerHTML = CANONICAL_HEADER;
      body.insertBefore(headerWrapper, body.firstChild);
    }

    if (!hasFooter) {
      const footerWrapper = document.createElement('div');
      footerWrapper.innerHTML = CANONICAL_FOOTER;
      body.appendChild(footerWrapper);
    }
  }

  function setActiveNav() {
    const path = window.location.pathname.replace(/index\.html$/, '');
    const links = document.querySelectorAll('.ud-nav-link, .ud-mobile-menu-link');
    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('/')) return;
      const target = href.endsWith('/') ? href : href + '/';
      const active = path === target || (target !== '/' && path.startsWith(target));
      link.classList.toggle('active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function initScroll() {
    const header = document.querySelector('[data-ud-header]');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  function initDropdown() {
    const dropdown = document.querySelector('.ud-nav-dropdown');
    if (!dropdown) return;
    const trigger = dropdown.querySelector('.ud-nav-dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isActive = dropdown.classList.toggle('active');
      trigger.setAttribute('aria-expanded', isActive);
    });

    document.addEventListener('click', function (e) {
      if (dropdown.classList.contains('active') && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.ud-mobile-toggle');
    const menu = document.querySelector('.ud-mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    const mobileLinks = menu.querySelectorAll('.ud-mobile-menu-link, .ud-mobile-dropdown-item');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });

    document.addEventListener('click', function (e) {
      if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    const mobileDropdownTrigger = menu.querySelector('.ud-mobile-dropdown-trigger');
    const mobileDropdownMenu = menu.querySelector('.ud-mobile-dropdown-menu');
    if (mobileDropdownTrigger && mobileDropdownMenu) {
      mobileDropdownTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        const isActive = mobileDropdownMenu.classList.toggle('active');
        mobileDropdownTrigger.setAttribute('aria-expanded', isActive);
      });
    }
  }

  function init() {
    ensureFavicon();
    safeInject();
    setActiveNav();
    initScroll();
    initDropdown();
    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
