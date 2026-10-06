// Luxury Valeora Popup Confirmation & Alert Modal System
// Replaces all native browser alerts & confirms with a sleek, themed popup modal

let _activeModalPromise = null;

export function dismissConfirmModal() {
  const existing = document.getElementById('valeora-confirm-modal-overlay');
  if (existing) {
    if (typeof _activeModalPromise === 'function') {
      const resolveFn = _activeModalPromise;
      _activeModalPromise = null;
      resolveFn(false);
    }
    existing.remove();
  }
}

export function showConfirmModal({
  title = 'Confirmation',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false
} = {}) {
  return new Promise((resolve) => {
    // Dismiss any existing confirm modal cleanly and resolve its promise
    dismissConfirmModal();
    _activeModalPromise = resolve;

    const overlay = document.createElement('div');
    overlay.id = 'valeora-confirm-modal-overlay';
    overlay.className = 'modal-overlay open confirm-modal-overlay';
    overlay.style.zIndex = '9999999';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';

    const iconSvg = danger ? `
      <div class="confirm-modal-icon danger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>` : `
      <div class="confirm-modal-icon info">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>`;

    overlay.innerHTML = `
      <div class="confirm-modal-dialog ${danger ? 'is-danger' : ''}" role="dialog" aria-modal="true">
        <button class="confirm-modal-close" id="confirm-modal-close-btn" aria-label="Close dialog">&times;</button>
        <div class="confirm-modal-header">
          ${iconSvg}
          <h3 class="confirm-modal-title">${title}</h3>
        </div>
        <div class="confirm-modal-body">
          <p class="confirm-modal-message">${message}</p>
        </div>
        <div class="confirm-modal-actions">
          ${cancelText ? `<button type="button" class="btn confirm-btn-cancel" id="confirm-btn-cancel">${cancelText}</button>` : ''}
          <button type="button" class="btn ${danger ? 'confirm-btn-danger' : 'confirm-btn-primary'}" id="confirm-btn-confirm">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const cleanup = (result) => {
      _activeModalPromise = null;
      document.removeEventListener('keydown', keyHandler);
      overlay.classList.remove('open');
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.2s ease';
      setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
      }, 220);
      resolve(result);
    };

    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        cleanup(false);
      } else if (e.key === 'Enter') {
        cleanup(true);
      }
    };

    document.addEventListener('keydown', keyHandler);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cleanup(false);
      }
    });

    const closeBtn = overlay.querySelector('#confirm-modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => cleanup(false));

    const cancelBtn = overlay.querySelector('#confirm-btn-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', () => cleanup(false));

    const confirmBtn = overlay.querySelector('#confirm-btn-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => cleanup(true));
      confirmBtn.focus();
    }
  });
}

export function showAlertModal({
  title = 'Notice',
  message = '',
  buttonText = 'Got It',
  type = 'info'
} = {}) {
  return showConfirmModal({
    title,
    message,
    confirmText: buttonText,
    cancelText: '',
    danger: type === 'error'
  }).then(() => true);
}
