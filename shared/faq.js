/* UtilityDesk V6.69 — delegated FAQ, output recovery, and legacy markup/encoding repair. */
(function () {
  'use strict';

  function fixMojibake(value) {
    if (!/[âÃÂð�]/.test(value)) return value;
    return value
      .replaceAll('â‚¹', '₹').replaceAll('â€”', '—').replaceAll('â€“', '–')
      .replaceAll('â€™', '’').replaceAll('â€˜', '‘').replaceAll('â€œ', '“')
      .replaceAll('â€', '”').replaceAll('â€¦', '…').replaceAll('â€¢', '•')
      .replaceAll('Ã—', '×').replaceAll('Â©', '©').replaceAll('Â°', '°');
  }

  function recoverLegacyMarkup() {
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(textNode => {
      let value = textNode.nodeValue || '';
      if (!value) return;
      value = fixMojibake(value).replaceAll('`n', '');
      const match = value.match(/^\s*section\s+class\s*=\s*(["'])([^"']+)\1\s*>\s*$/i);
      if (match) {
        const parent = textNode.parentNode;
        if (!parent) return;
        const section = document.createElement('section'); section.className = match[2];
        parent.insertBefore(section, textNode);
        let sibling = textNode.nextSibling; textNode.remove();
        while (sibling) {
          const next = sibling.nextSibling;
          if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === 'section') break;
          section.appendChild(sibling); sibling = next;
        }
        return;
      }
      if (value !== textNode.nodeValue) textNode.nodeValue = value;
    });
  }

  function init() {
    if (document.documentElement.dataset.udFaqRuntime === '1') return;
    document.documentElement.dataset.udFaqRuntime = '1';
    if (!document.querySelector('link[data-ud-site-fix]')) {
      var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = '/shared/site-fix.css'; css.dataset.udSiteFix = '1'; document.head.appendChild(css);
    }
    recoverLegacyMarkup();

    function getTrigger(target){return target&&target.closest?target.closest('.faq-question,.faq-q'):null}
    function prepare(trigger){
      if(!trigger)return null;var item=trigger.closest('.faq-item');if(!item)return null;var answer=item.querySelector('.faq-answer,.faq-a');if(!answer)return null;
      if(trigger.tagName!=='BUTTON'&&trigger.tagName!=='SUMMARY'){trigger.setAttribute('role','button');trigger.setAttribute('tabindex','0')}
      var expanded=item.classList.contains('active')||item.classList.contains('open');trigger.setAttribute('aria-expanded',expanded?'true':'false');
      if(!answer.id)answer.id='ud-faq-answer-'+Math.random().toString(36).slice(2,9);trigger.setAttribute('aria-controls',answer.id);return{item:item,answer:answer,trigger:trigger}
    }
    function toggle(trigger){
      var state=prepare(trigger);if(!state)return;var item=state.item,answer=state.answer,isOpen=item.classList.contains('active')||item.classList.contains('open');
      document.querySelectorAll('.faq-item.active,.faq-item.open').forEach(function(other){if(other===item)return;other.classList.remove('active','open');var t=other.querySelector('.faq-question,.faq-q'),a=other.querySelector('.faq-answer,.faq-a');if(t)t.setAttribute('aria-expanded','false');if(a)a.style.maxHeight='0'});
      item.classList.toggle('active',!isOpen);if(trigger.classList.contains('faq-q'))item.classList.toggle('open',!isOpen);trigger.setAttribute('aria-expanded',!isOpen?'true':'false');answer.style.maxHeight=!isOpen?answer.scrollHeight+'px':'0'
    }
    document.querySelectorAll('.faq-question,.faq-q').forEach(prepare);
    document.addEventListener('click',function(e){var t=getTrigger(e.target);if(!t)return;e.preventDefault();e.stopPropagation();toggle(t)},true);
    document.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var t=getTrigger(e.target);if(!t)return;e.preventDefault();e.stopPropagation();toggle(t)},true);
    function recoverOutputs(root){
      (root||document).querySelectorAll('.error-box,.err,.error-message').forEach(function(el){if(!el.textContent.trim())el.style.display='none'});
      (root||document).querySelectorAll('a[download],#downloadLink,.download-link').forEach(function(el){if(!el.hasAttribute('hidden')&&el.getAttribute('href')){el.style.visibility='visible';el.style.opacity='1'}});
    }
    recoverOutputs(document);
    new MutationObserver(function(muts){muts.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)recoverOutputs(n)})})}).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
}());
