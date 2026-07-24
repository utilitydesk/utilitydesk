/* Makes root-relative links work both on a deployed site and when opened locally. */
(function () {
  'use strict';
  if (window.location.protocol !== 'file:') return;
  const script = document.currentScript;
  if (!script || !script.src) return;
  const siteRoot = new URL('../', script.src);
  const blocked = /^\/(?:cdn-cgi|__webpack|_next)\//;
  document.querySelectorAll('[href^="/"], [src^="/"]').forEach(element => {
    const attribute = element.hasAttribute('href') ? 'href' : 'src';
    const value = element.getAttribute(attribute);
    if (!value || blocked.test(value)) return;
    element.setAttribute(attribute, new URL(value.slice(1), siteRoot).href);
  });
  const page = window.location.pathname.replace(/\\/g, '/').replace(/\/index\.html$/, '/');
  document.querySelectorAll('.ud-nav-link, .ud-mobile-menu-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('/')) return;
    const target = href.endsWith('/') ? href : `${href}/`;
    if (page.endsWith(target)) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
  });
}());
