/**
 * Premium Micro-Interactions & Effects
 * UtilityDesk Premium Design System
 */

// ====== RIPPLE EFFECT ======
function initRippleEffect() {
  document.querySelectorAll('.ripple').forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ====== SMOOTH SCROLL ======
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ====== INTERSECTION OBSERVER FOR ANIMATIONS ======
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements with scroll-triggered animations
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

// ====== CARD HOVER TILT EFFECT ======
function initCardTilt() {
  document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

// ====== LOADING SKELETONS ======
function showSkeleton(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="skeleton-grid">
      <div class="skeleton-card">
        <div class="skeleton skeleton-avatar"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text" style="width: 80%"></div>
        <div class="skeleton skeleton-text" style="width: 60%"></div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton skeleton-avatar"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text" style="width: 90%"></div>
        <div class="skeleton skeleton-text" style="width: 70%"></div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton skeleton-avatar"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text" style="width: 75%"></div>
        <div class="skeleton skeleton-text" style="width: 85%"></div>
      </div>
    </div>
  `;
}

function hideSkeleton(containerId, content) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.style.opacity = '0';
  container.style.transition = 'opacity 0.3s ease';
  
  setTimeout(() => {
    container.innerHTML = content;
    container.style.opacity = '1';
  }, 300);
}

// ====== SUCCESS ANIMATION ======
function showSuccess(containerId, message = 'Success!') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="success-animation">
      <div class="success-checkmark"></div>
      <h3 class="success-title">${message}</h3>
    </div>
  `;
}

// ====== ERROR ANIMATION ======
function showError(containerId, title = 'Error', message = 'Something went wrong') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="error-state">
      <div class="error-icon">!</div>
      <h3 class="error-title">${title}</h3>
      <p class="error-message">${message}</p>
      <button class="btn btn-primary ripple" onclick="location.reload()">
        Try Again
      </button>
    </div>
  `;
}

// ====== EMPTY STATE ======
function showEmptyState(containerId, title = 'No data', message = 'Nothing to show yet') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">📭</div>
      <h3 class="empty-title">${title}</h3>
      <p class="empty-message">${message}</p>
    </div>
  `;
}

// ====== TOOLTIP ======
function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', function(e) {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.getAttribute('data-tooltip');
      tooltip.style.cssText = `
        position: fixed;
        background: #0f172a;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.875rem;
        z-index: 10000;
        pointer-events: none;
        animation: tooltip-fade-in 0.2s ease;
      `;
      
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
      
      this._tooltip = tooltip;
    });
    
    el.addEventListener('mouseleave', function() {
      if (this._tooltip) {
        this._tooltip.style.animation = 'tooltip-fade-out 0.2s ease';
        setTimeout(() => {
          if (this._tooltip) {
            this._tooltip.remove();
            this._tooltip = null;
          }
        }, 200);
      }
    });
  });
}

// ====== COUNTER ANIMATION ======
function animateCounter(element, start, end, duration = 2000) {
  const startTime = performance.now();
  const diff = end - start;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    const current = Math.floor(start + diff * easeOut);
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ====== PROGRESS BAR ANIMATION ======
function animateProgress(elementId, targetPercent, duration = 1500) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const bar = element.querySelector('.progress-bar');
  if (!bar) return;
  
  let current = 0;
  const increment = targetPercent / (duration / 16);
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= targetPercent) {
      current = targetPercent;
      clearInterval(timer);
    }
    bar.style.width = current + '%';
    bar.setAttribute('aria-valuenow', current);
  }, 16);
}

// ====== TAB SWITCHING WITH ANIMATION ======
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabContainer => {
    const buttons = tabContainer.querySelectorAll('.tab-button');
    const panels = tabContainer.querySelectorAll('.tab-panel');
    
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and panels
        buttons.forEach(btn => btn.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked button and corresponding panel
        button.classList.add('active');
        panels[index].classList.add('active');
        
        // Animate panel entrance
        panels[index].style.animation = 'tab-fade-in 0.3s ease';
      });
    });
  });
}

// ====== ACCORDION WITH SMOOTH ANIMATION ======
function initAccordions() {
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    if (!header || !content) return;
    
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all other items
      item.parentElement.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.maxHeight = '0';
          }
        }
      });
      
      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// ====== FORM VALIDATION WITH ANIMATIONS ======
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  const inputs = form.querySelectorAll('input, textarea, select');
  let isValid = true;
  
  inputs.forEach(input => {
    if (input.hasAttribute('required') && !input.value.trim()) {
      input.classList.add('input-error');
      input.classList.remove('input-success');
      isValid = false;
      
      // Shake animation
      input.style.animation = 'shake 0.4s ease';
      setTimeout(() => {
        input.style.animation = '';
      }, 400);
    } else if (input.checkValidity()) {
      input.classList.remove('input-error');
      input.classList.add('input-success');
    }
  });
  
  return isValid;
}

// ====== NOTIFICATION SYSTEM ======
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}</span>
      <span class="notification-message">${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Auto remove
  if (duration > 0) {
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

// ====== INITIALIZE ALL ======
document.addEventListener('DOMContentLoaded', () => {
  initRippleEffect();
  initSmoothScroll();
  initScrollAnimations();
  initCardTilt();
  initTooltips();
  initTabs();
  initAccordions();
});

// Export functions for manual use
window.showSkeleton = showSkeleton;
window.hideSkeleton = hideSkeleton;
window.showSuccess = showSuccess;
window.showError = showError;
window.showEmptyState = showEmptyState;
window.animateCounter = animateCounter;
window.animateProgress = animateProgress;
window.showNotification = showNotification;
window.validateForm = validateForm;
