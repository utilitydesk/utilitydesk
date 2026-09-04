/* UtilityDesk V6.69 shared site shell + legacy markup recovery. */
(function () {
  'use strict';

  const PDF_TOOLS = [
    ['rotate-pdf','Rotate PDF','Rotate PDF pages clockwise or counter-clockwise','↻'],
    ['rearrange-pages','Rearrange Pages','Reorder PDF pages into a new document','↕'],
    ['pdf-to-images','PDF to Images','Convert PDF pages to image files','🖼️']
  ];
  const DOC_TOOLS = [
    ['joining-letter','Joining Letter','Create a professional joining letter','📄'],
    ['increment-letter','Increment Letter','Create an employee salary increment letter','💰'],
    ['promotion-letter','Promotion Letter','Create an employee promotion letter','📈'],
    ['warning-letter','Warning Letter','Create a formal employee warning letter','⚠️'],
    ['cover-letter','Cover Letter Generator','Create a tailored professional cover letter','✉️'],
    ['exit-checklist','Exit Checklist','Prepare a complete employee exit checklist','☑️'],
    ['resume-builder','Resume Builder','Build an ATS-friendly professional resume','📋'],
    ['payslip','Payslip Generator','Create a professional monthly payslip','🧾']
  ];

  function injectSiteFix() {
    if (document.querySelector('link[data-ud-site-fix]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/shared/site-fix.css';
    link.dataset.udSiteFix = '1';
    (document.head || document.documentElement).appendChild(link);
  }

  function fixMojibake(value) {
    if (!/[âÃÂð�]/.test(value)) return value;
    try {
      const fixed = value.encode ? value : null;
      void fixed;
      // JS strings do not expose byte encodings directly. Handle the recurring
      // UTF-8/Windows-1252 corruption deterministically.
      return value
        .replaceAll('â‚¹', '₹').replaceAll('â€”', '—').replaceAll('â€“', '–')
        .replaceAll('â€™', '’').replaceAll('â€˜', '‘').replaceAll('â€œ', '“')
        .replaceAll('â€', '”').replaceAll('â€¦', '…').replaceAll('â€¢', '•')
        .replaceAll('Ã—', '×').replaceAll('Â©', '©').replaceAll('Â°', '°');
    } catch (_) { return value; }
  }

  function recoverLegacyMarkup() {
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(textNode => {
      let value = textNode.nodeValue || '';
      if (!value) return;
      value = value.replaceAll('`n', '');
      value = fixMojibake(value);
      const match = value.match(/^\s*section\s+class\s*=\s*(["'])([^"']+)\1\s*>/i);
      if (match) {
        const parent = textNode.parentNode;
        if (!parent) return;
        const range = document.createRange();
        range.selectNode(textNode);
        const holder = document.createElement('template');
        holder.innerHTML = '<section class="' + match[2] + '"></section>';
        const section = holder.content.firstElementChild;
        const remainder = value.slice(match[0].length);
        if (section) {
          range.insertNode(section);
          if (remainder) section.after(document.createTextNode(remainder));
          textNode.remove();
          return;
        }
      }
      if (value !== textNode.nodeValue) textNode.nodeValue = value;
    });
  }

  function ensurePdfInventory() {
    if (location.pathname.replace(/index\.html$/, '') !== '/pdf-tools/') return;
    const section = document.querySelector('.category-block[data-cat="browser"], .category-block[data-cat="client"]');
    if (!section) return;
    const grid = section.querySelector('.tools-grid');
    if (!grid) return;
    const existing = new Set([...document.querySelectorAll('.tool-card[href^="/pdf-tools/"]')].map(a => a.getAttribute('href')));
    PDF_TOOLS.forEach(([slug,title,desc,icon]) => {
      const href = '/pdf-tools/' + slug + '/';
      if (existing.has(href)) return;
      const a = document.createElement('a');
      a.href = href; a.className = 'tool-card'; a.dataset.title = title.toLowerCase(); a.dataset.desc = desc.toLowerCase();
      a.innerHTML = '<div class="tool-icon">' + icon + '</div><div class="tool-card-body"><h3>' + title + '</h3><p>' + desc + '</p></div>';
      grid.appendChild(a);
    });
    const all = document.querySelectorAll('.tool-card[href^="/pdf-tools/"]').length;
    const count = document.querySelector('#searchCount'); if (count) count.textContent = all + ' tools available';
    const input = document.querySelector('#searchInput'); if (input) input.placeholder = 'Search ' + all + '+ tools...';
    document.querySelectorAll('.category-block .cat-count').forEach(el => {
      const block = el.closest('.category-block');
      if (block) el.textContent = block.querySelectorAll('.tool-card').length;
    });
    const heading = document.querySelector('.category-block[data-cat="convert"] h2');
    if (heading) heading.firstChild.textContent = '🔄 Convert & Advanced ';
  }

  function ensureDocumentInventory() {
    if (location.pathname.replace(/index\.html$/, '') !== '/document-generators/') return;
    const section = document.querySelector('.category-block[data-cat="hr"], .category-block[data-cat="hr-docs"]') || document.querySelector('.category-block');
    if (!section) return;
    const blocks = [...document.querySelectorAll('.category-block')];
    const hrBlock = blocks.find(b => /hr|employment/i.test(b.textContent)) || blocks[0];
    const grid = hrBlock && hrBlock.querySelector('.tools-grid');
    if (!grid) return;
    const existing = new Set([...document.querySelectorAll('.tool-card[href^="/document-generators/"]')].map(a => a.getAttribute('href')));
    DOC_TOOLS.forEach(([slug,title,desc,icon]) => {
      const href = '/document-generators/' + slug + '/';
      if (existing.has(href)) return;
      const a = document.createElement('a');
      a.href = href; a.className = 'tool-card'; a.dataset.title = title.toLowerCase(); a.dataset.desc = desc.toLowerCase();
      a.innerHTML = '<div class="tool-icon">' + icon + '</div><div class="tool-card-body"><h3>' + title + '</h3><p>' + desc + '</p></div>';
      grid.appendChild(a);
    });
    const all = document.querySelectorAll('.tool-card[href^="/document-generators/"]').length;
    const count = document.querySelector('#searchCount'); if (count) count.textContent = all + ' tools available';
    const input = document.querySelector('#searchInput'); if (input) input.placeholder = 'Search ' + all + '+ tools...';
    document.querySelectorAll('.category-block .cat-count').forEach(el => {
      const block = el.closest('.category-block');
      if (block) el.textContent = block.querySelectorAll('.tool-card').length;
    });
  }

  function normalizeInventoryCounts() {
    const path = location.pathname.replace(/index\.html$/, '');
    if (path === '/hr/') {
      const count = document.querySelector('#searchCount');
      if (count) count.textContent = document.querySelectorAll('.tool-card[href*="/hr/"], .tool-card[href*="/document-generators/"]').length + ' tools available';
      const input = document.querySelector('#searchInput');
      if (input) input.placeholder = 'Search 23+ tools...';
    }
  }

  function init() {
    injectSiteFix();
    recoverLegacyMarkup();
    ensurePdfInventory();
    ensureDocumentInventory();
    normalizeInventoryCounts();

    if (window.location.protocol === 'file:') {
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
    }

    const page = window.location.pathname.replace(/\\/g, '/').replace(/\/index\.html$/, '/');
    document.querySelectorAll('.ud-nav-link, .ud-mobile-menu-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('/')) return;
      const target = href.endsWith('/') ? href : `${href}/`;
      if (page === target || (target !== '/' && page.startsWith(target))) {
        link.classList.add('active'); link.setAttribute('aria-current', 'page');
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
