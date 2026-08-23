import { state } from '../state.js';
import { showToast } from './toast.js';

export function renderAuthModal() {
  if (!state.isAuthOpen) return '';

  return `
    <div class="modal-overlay open" id="auth-modal-overlay">
      <div class="modal-card" style="max-width: 440px; padding: 36px;">
        <button class="modal-close-btn" id="auth-close-btn">&times;</button>
        
        <div style="text-align:center; margin-bottom: 24px;">
          <svg width="40" height="40" viewBox="0 0 100 100" style="margin: 0 auto 12px auto;">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#c5a059" stroke-width="2.5"/>
            <path d="M50 22 L72 58 L28 58 Z" fill="none" stroke="#143325" stroke-width="3"/>
          </svg>
          <h3 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--color-forest-dark);">Welcome To Aurite</h3>
          <p style="font-size:0.85rem; color:var(--color-text-muted);">Access your club benefits & active subscriptions</p>
        </div>

        <form id="auth-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="auth-name" placeholder="Alex Mercer" value="Alex Mercer" required class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="auth-email" placeholder="alex@example.com" value="alex@example.com" required class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="auth-password" value="••••••••" required class="form-input">
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%; margin-top:8px;">
            Sign In / Register
          </button>
        </form>

        <div style="margin-top:20px; text-align:center; font-size:0.8rem; color:var(--color-text-light);">
          By signing in, you agree to Aurite's Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  `;
}

export function bindAuthEvents() {
  const overlay = document.getElementById('auth-modal-overlay');
  const closeBtn = document.getElementById('auth-close-btn');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) state.toggleAuthModal(false);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => state.toggleAuthModal(false));
  }

  const form = document.getElementById('auth-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      const name = document.getElementById('auth-name').value;
      
      state.login(email, name);
      showToast(`Welcome back, ${name}! Logged in successfully.`, 'success');
      state.setRoute('profile');
    });
  }
}
