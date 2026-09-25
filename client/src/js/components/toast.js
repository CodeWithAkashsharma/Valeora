// Lightweight luxury toast notification utility with timeline progress bar
let _container = null;

function getContainer() {
  if (!_container || !document.body.contains(_container)) {
    _container = document.createElement('div');
    _container.className = 'toast-container';
    document.body.appendChild(_container);
  }
  return _container;
}

export function showToast(message, durationOrType = 4000, optionalType = 'info') {
  let duration = 4000;
  let type = 'info';

  if (typeof durationOrType === 'number') {
    duration = durationOrType;
    if (typeof optionalType === 'string') {
      type = optionalType;
    }
  } else if (typeof durationOrType === 'string') {
    type = durationOrType;
    if (typeof optionalType === 'number') {
      duration = optionalType;
    }
  }

  // Ensure minimum duration of 4 seconds (4000ms) view time
  if (!duration || isNaN(duration) || duration < 1000) {
    duration = 4000;
  }

  const container = getContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  // Icon based on notification type
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>`;
  } else if (type === 'error') {
    iconSvg = `
      <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>`;
  } else {
    iconSvg = `
      <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-message">${message}</div>
    <button type="button" class="toast-close-btn" aria-label="Dismiss notification">&times;</button>
    <div class="toast-timeline" style="animation-duration: ${duration}ms;"></div>
  `;

  container.appendChild(toast);

  let dismissTimer = null;
  const dismiss = () => {
    if (dismissTimer) clearTimeout(dismissTimer);
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 320);
  };

  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', dismiss);
  }

  dismissTimer = setTimeout(dismiss, duration);
}

