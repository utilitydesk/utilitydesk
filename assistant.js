/* UtilityDesk Helper — client-side guidance with safe message rendering. */
(function () {
  'use strict';

  const answers = [
    { match: ['tax regime', 'old regime', 'new regime'], title: 'Choosing a tax regime', text: 'Compare both regimes using your salary and deductions. The old regime can suit people claiming HRA, 80C or home-loan deductions; the new regime is simpler when deductions are limited.', href: '/income-tax/', label: 'Open Income Tax Calculator' },
    { match: ['pf', 'provident fund', 'epf'], title: 'PF planning', text: 'Your employee contribution is generally 12% of basic salary plus DA. Use the calculator to estimate your long-term corpus.', href: '/pf-calculator/', label: 'Open PF Calculator' },
    { match: ['gratuity'], title: 'Gratuity', text: 'For eligible employees, gratuity is usually calculated from last drawn basic salary, service years and the statutory 15/26 formula.', href: '/gratuity-calculator/', label: 'Open Gratuity Calculator' },
    { match: ['emi', 'loan'], title: 'Loan and EMI', text: 'Enter the loan amount, interest rate and tenure to see the monthly EMI and the total interest payable.', href: '/emi/', label: 'Open EMI Calculator' },
    { match: ['sip', 'investment'], title: 'SIP planning', text: 'A SIP estimate helps you compare monthly contributions, returns and investment horizons before you commit.', href: '/sip-calculator/', label: 'Open SIP Calculator' },
    { match: ['hra', 'rent allowance'], title: 'HRA exemption', text: 'HRA exemption depends on salary, rent, city and the applicable tax regime. Keep rent receipts and landlord details where required.', href: '/hra-exemption/', label: 'Open HRA Calculator' },
    { match: ['gst'], title: 'GST calculator', text: 'Calculate GST-inclusive or GST-exclusive prices and understand the CGST/SGST split.', href: '/gst/', label: 'Open GST Calculator' }
  ];

  const rootPath = () => {
    const script = document.currentScript || document.querySelector('script[src*="assistant.js"]');
    return script ? new URL('../', script.src) : new URL('./', window.location.href);
  };

  function resolveLink(path) {
    if (window.location.protocol !== 'file:') return path;
    return new URL(path.replace(/^\//, ''), rootPath()).href;
  }

  class UtilityDeskHelper {
    constructor() { this.opened = false; this.render(); this.bind(); this.addMessage('assistant', 'Hi! I can help you find the right UtilityDesk tool. Ask about tax, PF, gratuity, EMI, SIP, HRA or GST.'); }

    render() {
      const trigger = document.createElement('button');
      trigger.className = 'ud-assistant-trigger'; trigger.id = 'udAssistantTrigger';
      trigger.type = 'button'; trigger.setAttribute('aria-label', 'Open UtilityDesk Helper'); trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 15.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM13 13h-2V6h2v7Z"/></svg>';
      const panel = document.createElement('section');
      panel.className = 'ud-assistant-widget'; panel.id = 'udAssistantWidget'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'UtilityDesk Helper');
      panel.innerHTML = '<div class="ud-assistant-header"><div class="ud-assistant-avatar" aria-hidden="true">✦</div><div class="ud-assistant-info"><div class="ud-assistant-name">UtilityDesk Helper</div><div class="ud-assistant-status">Tool guidance, instantly</div></div><button class="ud-assistant-close" id="udAssistantClose" type="button" aria-label="Close helper">×</button></div><div class="ud-assistant-messages" id="udAssistantMessages" aria-live="polite"></div><div class="ud-assistant-quick-actions"><button class="ud-assistant-quick-btn" type="button" data-question="Which tax regime is better?">Tax regime</button><button class="ud-assistant-quick-btn" type="button" data-question="How is PF calculated?">PF calculation</button><button class="ud-assistant-quick-btn" type="button" data-question="Help with EMI">EMI help</button></div><form class="ud-assistant-input-area" id="udAssistantForm"><input type="text" class="ud-assistant-input" id="udAssistantInput" placeholder="Ask about a tool…" autocomplete="off"><button class="ud-assistant-send" type="submit" aria-label="Send question">→</button></form>';
      document.body.append(trigger, panel);
    }

    bind() {
      this.trigger = document.getElementById('udAssistantTrigger'); this.panel = document.getElementById('udAssistantWidget'); this.input = document.getElementById('udAssistantInput');
      this.trigger.addEventListener('click', () => this.toggle());
      document.getElementById('udAssistantClose').addEventListener('click', () => this.close());
      document.getElementById('udAssistantForm').addEventListener('submit', event => { event.preventDefault(); this.ask(this.input.value); });
      this.panel.querySelectorAll('.ud-assistant-quick-btn').forEach(button => button.addEventListener('click', () => this.ask(button.dataset.question)));
      document.addEventListener('keydown', event => { if (event.key === 'Escape') this.close(); });
      document.addEventListener('click', event => { if (this.opened && !this.panel.contains(event.target) && !this.trigger.contains(event.target)) this.close(); });
    }

    toggle() { this.opened ? this.close() : this.show(); }
    show() { this.opened = true; this.panel.classList.add('active'); this.trigger.classList.add('active'); this.trigger.setAttribute('aria-expanded', 'true'); this.input.focus(); }
    close() { this.opened = false; this.panel.classList.remove('active'); this.trigger.classList.remove('active'); this.trigger.setAttribute('aria-expanded', 'false'); this.trigger.focus(); }

    ask(question) {
      const query = question.trim(); if (!query) return;
      this.addMessage('user', query); this.input.value = '';
      const lower = query.toLowerCase(); const answer = answers.find(item => item.match.some(term => lower.includes(term)));
      window.setTimeout(() => this.addAnswer(answer || { title: 'Find a tool', text: 'Browse the calculator directory to find tools for tax, salary, loans, investments, documents and more.', href: '/calculators/', label: 'Browse all calculators' }), 250);
    }

    addMessage(type, text) {
      const message = document.createElement('div'); message.className = `ud-assistant-message ${type}`;
      const avatar = document.createElement('div'); avatar.className = 'ud-assistant-message-avatar'; avatar.textContent = type === 'assistant' ? '✦' : 'You';
      const content = document.createElement('div'); content.className = 'ud-assistant-message-content'; content.textContent = text;
      message.append(avatar, content); document.getElementById('udAssistantMessages').append(message); this.scrollToLatest();
    }

    addAnswer(answer) {
      const message = document.createElement('div'); message.className = 'ud-assistant-message assistant';
      const avatar = document.createElement('div'); avatar.className = 'ud-assistant-message-avatar'; avatar.textContent = '✦';
      const content = document.createElement('div'); content.className = 'ud-assistant-message-content';
      const title = document.createElement('strong'); title.textContent = answer.title;
      const paragraph = document.createElement('p'); paragraph.textContent = answer.text;
      const link = document.createElement('a'); link.className = 'ud-assistant-calculator-link'; link.href = resolveLink(answer.href); link.textContent = answer.label;
      content.append(title, paragraph, link); message.append(avatar, content); document.getElementById('udAssistantMessages').append(message); this.scrollToLatest();
    }

    scrollToLatest() { const messages = document.getElementById('udAssistantMessages'); messages.scrollTop = messages.scrollHeight; }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => new UtilityDeskHelper());
  else new UtilityDeskHelper();
}());
