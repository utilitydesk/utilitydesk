/* UtilityDesk.in — V6 Functional Repair Layer
   Safe, page-agnostic compatibility fixes. Does not replace tool logic.
*/
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else fn();
  }

  function callSafely(name) {
    try {
      if (typeof window[name] === 'function') {
        window[name]();
        return true;
      }
    } catch (err) {
      console.warn('[UtilityDesk V6] ' + name + ' failed:', err);
    }
    return false;
  }

  function bindLiveGenerator() {
    // Existing HR/document generators expose generate(). Re-bind only when
    // a real preview is present, avoiding interference with unrelated pages.
    if (typeof window.generate !== 'function') return;
    const preview = document.querySelector(
      '[id^="preview"], [id^="p"], .live-preview, .preview, .preview-pane, .preview-container'
    );
    if (!preview) return;

    const controls = document.querySelectorAll(
      'input:not([type="file"]):not([type="button"]):not([type="submit"]), textarea, select'
    );
    if (!controls.length) return;

    let timer = 0;
    const refresh = function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        callSafely('generate');
      }, 120);
    };

    controls.forEach(function (control) {
      if (control.dataset.udV6Bound === '1') return;
      control.dataset.udV6Bound = '1';
      control.addEventListener('input', refresh);
      control.addEventListener('change', refresh);
    });

    // Ensure the preview is populated after all page scripts have initialized.
    setTimeout(function () { callSafely('generate'); }, 0);
  }

  function repairPrintActions() {
    document.querySelectorAll(
      '[onclick*="print"], button[data-action="print"], .print-btn, .btn-print'
    ).forEach(function (button) {
      if (button.dataset.udV6PrintBound === '1') return;
      button.dataset.udV6PrintBound = '1';
      button.addEventListener('click', function () {
        if (typeof window.generate === 'function') {
          try { window.generate(); } catch (err) {
            console.warn('[UtilityDesk V6] preview refresh before print failed:', err);
          }
        }
      }, true);
    });
  }

  function repairAIFileMode() {
    if (window.location.protocol !== 'file:') return;
    const aiButtons = document.querySelectorAll('button');
    aiButtons.forEach(function (button) {
      const label = (button.textContent || '').toLowerCase();
      if (!label.includes('generate with ai') || button.dataset.udV6AiBound === '1') return;
      button.dataset.udV6AiBound = '1';
      button.addEventListener('click', function () {
        // File:// pages cannot call the Vercel /api/ai endpoint. The page's
        // own runAI() may fail immediately or may briefly show a loading state.
        // Replace either state with a clear, deterministic local-mode message.
        [120, 500].forEach(function (delay) {
          setTimeout(function () {
            const output = document.querySelector('#aiOut, .ai-output');
            if (!output) return;
            const text = output.textContent || '';
            if (!text.includes('Generating with UtilityDesk AI') && !text.includes('Failed to fetch') && !text.includes('NetworkError')) return;
            output.innerHTML = '<div class="ai-error"><strong>AI is available after deployment.</strong><br>You are testing the File Explorer copy, so <code>/api/ai</code> is not available here. Deploy this V6 package to Vercel with <code>OPENROUTER_API_KEY</code> configured to enable AI generation.</div>';
          }, delay);
        });
      }, true);
    });
  }

  function repairLocalShell() {
    // Keep pages opened directly from Windows/File Explorer usable.
    if (window.location.protocol !== 'file:') return;
    document.documentElement.classList.add('ud-file-mode');
  }

  ready(function () {
    repairLocalShell();
    bindLiveGenerator();
    repairPrintActions();
    repairAIFileMode();
  });
}());
