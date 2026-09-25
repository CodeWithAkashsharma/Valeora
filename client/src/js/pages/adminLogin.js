import { state } from '../state.js';
import { loginWithEmail, isAdminEmail, getUserDoc } from '../services/firebase.js';
import { showToast } from '../components/toast.js';

export function renderAdminLoginPage() {
  return `
    <div class="admin-login-wrapper" style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      position: relative;
      background: radial-gradient(circle at 50% 30%, rgba(138, 21, 56, 0.22) 0%, rgba(10, 2, 5, 0.98) 75%), #0a0205;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
    ">
      <!-- Background Ambient Geometric Patterns -->
      <div style="
        position: absolute;
        top: -10%;
        left: -10%;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(138, 21, 56, 0.25) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
      "></div>
      <div style="
        position: absolute;
        bottom: -10%;
        right: -10%;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(214, 184, 190, 0.12) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
      "></div>

      <div class="admin-login-card" style="
        max-width: 460px;
        width: 100%;
        position: relative;
        z-index: 5;
        background: rgba(22, 3, 9, 0.88);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(214, 184, 190, 0.28);
        border-radius: 24px;
        padding: 44px 36px;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.75), 0 0 50px rgba(138, 21, 56, 0.3);
      ">
        <!-- Brand Header & Security Crest -->
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="
            width: 64px;
            height: 64px;
            margin: 0 auto 16px auto;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(138, 21, 56, 0.5), rgba(214, 184, 190, 0.15));
            border: 1.5px solid rgba(214, 184, 190, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D6B8BE;
            box-shadow: 0 0 30px rgba(138, 21, 56, 0.4);
          ">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
          </div>

          <h2 style="
            font-family: 'Cinzel', serif;
            font-size: 1.65rem;
            color: #FFFFFF;
            letter-spacing: 0.08em;
            margin-bottom: 6px;
            font-weight: 700;
          ">
            VALEORA
          </h2>
          <div style="
            display: inline-block;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: #D6B8BE;
            padding: 4px 14px;
            border-radius: 99px;
            background: rgba(138, 21, 56, 0.35);
            border: 1px solid rgba(214, 184, 190, 0.25);
          ">
            Executive Admin Portal
          </div>
        </div>

        <!-- Feedback Alert Container -->
        <div id="admin-login-error" style="
          display: none;
          background: rgba(220, 38, 38, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.88rem;
          margin-bottom: 20px;
          line-height: 1.4;
          align-items: center;
          gap: 10px;
        "></div>

        <!-- Login Form -->
        <form id="admin-login-form" autocomplete="on">
          <!-- Email Input -->
          <div style="margin-bottom: 20px;">
            <label for="admin-login-email" style="
              display: block;
              font-size: 0.8rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              color: rgba(255, 255, 255, 0.85);
              margin-bottom: 8px;
            ">
              Administrator Email
            </label>
            <div style="position: relative;">
              <span style="
                position: absolute;
                left: 14px;
                top: 50%;
                transform: translateY(-50%);
                color: rgba(214, 184, 190, 0.6);
                display: flex;
                align-items: center;
              ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                type="email"
                id="admin-login-email"
                required
                placeholder="admin@valeora.com"
                autocomplete="username"
                style="
                  width: 100%;
                  background: rgba(255, 255, 255, 0.06);
                  border: 1px solid rgba(214, 184, 190, 0.25);
                  border-radius: 12px;
                  padding: 13px 16px 13px 44px;
                  color: #FFFFFF;
                  font-size: 0.95rem;
                  outline: none;
                  box-sizing: border-box;
                  transition: all 0.2s ease;
                "
              />
            </div>
          </div>

          <!-- Password Input -->
          <div style="margin-bottom: 28px;">
            <label for="admin-login-password" style="
              display: block;
              font-size: 0.8rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              color: rgba(255, 255, 255, 0.85);
              margin-bottom: 8px;
            ">
              Security Password
            </label>
            <div style="position: relative;">
              <span style="
                position: absolute;
                left: 14px;
                top: 50%;
                transform: translateY(-50%);
                color: rgba(214, 184, 190, 0.6);
                display: flex;
                align-items: center;
              ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                type="password"
                id="admin-login-password"
                required
                placeholder="••••••••••••"
                autocomplete="current-password"
                style="
                  width: 100%;
                  background: rgba(255, 255, 255, 0.06);
                  border: 1px solid rgba(214, 184, 190, 0.25);
                  border-radius: 12px;
                  padding: 13px 44px 13px 44px;
                  color: #FFFFFF;
                  font-size: 0.95rem;
                  outline: none;
                  box-sizing: border-box;
                  transition: all 0.2s ease;
                "
              />
              <button
                type="button"
                id="admin-toggle-pwd-btn"
                style="
                  position: absolute;
                  right: 12px;
                  top: 50%;
                  transform: translateY(-50%);
                  background: none;
                  border: none;
                  color: rgba(214, 184, 190, 0.6);
                  cursor: pointer;
                  padding: 4px;
                  display: flex;
                  align-items: center;
                "
                aria-label="Toggle password visibility"
              >
                <svg id="admin-eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            id="admin-login-submit-btn"
            style="
              width: 100%;
              padding: 14px 20px;
              border-radius: 12px;
              background: linear-gradient(135deg, #8A1538 0%, #5B0C23 100%);
              color: #FFFFFF;
              border: 1px solid rgba(214, 184, 190, 0.45);
              font-size: 0.95rem;
              font-weight: 700;
              letter-spacing: 0.04em;
              cursor: pointer;
              box-shadow: 0 8px 24px rgba(138, 21, 56, 0.5);
              transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            "
          >
            <span>Authenticate & Access Dashboard</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>

        <!-- Footer / Return Link -->
        <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(214, 184, 190, 0.15);">
          <a
            href="/"
            data-route="home"
            style="
              color: rgba(214, 184, 190, 0.75);
              font-size: 0.85rem;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 8px;
              transition: color 0.2s ease;
            "
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Return to VALEORA Storefront</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

export function bindAdminLoginPageEvents() {
  const form = document.getElementById('admin-login-form');
  const emailInput = document.getElementById('admin-login-email');
  const pwdInput = document.getElementById('admin-login-password');
  const submitBtn = document.getElementById('admin-login-submit-btn');
  const errorDiv = document.getElementById('admin-login-error');
  const togglePwdBtn = document.getElementById('admin-toggle-pwd-btn');

  // If already logged in as admin, redirect immediately
  if (state.user && state.isAdmin) {
    state.setRoute('admin');
    return;
  }

  // Toggle Password Visibility
  if (togglePwdBtn && pwdInput) {
    togglePwdBtn.addEventListener('click', () => {
      const isPwd = pwdInput.type === 'password';
      pwdInput.type = isPwd ? 'text' : 'password';
      togglePwdBtn.innerHTML = isPwd
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  }

  // Input styling focus events
  [emailInput, pwdInput].forEach(inp => {
    if (!inp) return;
    inp.addEventListener('focus', () => {
      inp.style.borderColor = 'rgba(214, 184, 190, 0.7)';
      inp.style.boxShadow = '0 0 12px rgba(138, 21, 56, 0.4)';
    });
    inp.addEventListener('blur', () => {
      inp.style.borderColor = 'rgba(214, 184, 190, 0.25)';
      inp.style.boxShadow = 'none';
    });
  });

  // Handle Form Submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
      }

      const email = emailInput?.value.trim() || '';
      const password = pwdInput?.value || '';

      if (!email || !password) {
        if (errorDiv) {
          errorDiv.style.display = 'flex';
          errorDiv.textContent = 'Please enter both administrator email and password.';
        }
        return;
      }

      // Set Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          <span>Authenticating Administrator...</span>
        `;
      }

      try {
        const user = await loginWithEmail(email, password);
        let userData = null;
        try {
          userData = await getUserDoc(user.uid);
        } catch (err) {
          console.warn('Could not fetch user document:', err);
        }

        const isAuthorizedAdmin = isAdminEmail(user.email) || userData?.role === 'admin';

        if (!isAuthorizedAdmin) {
          if (errorDiv) {
            errorDiv.style.display = 'flex';
            errorDiv.textContent = 'Access Denied: This account is not registered with Administrative credentials.';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.innerHTML = `<span>Authenticate & Access Dashboard</span>`;
          }
          return;
        }

        // Set Firebase Admin User in state
        state.setFirebaseUser(user, userData);
        showToast('Administrative Access Granted. Welcome to the Control Center.', 'success');
        
        // Route to admin control panel
        state.setRoute('admin');
      } catch (err) {
        console.error('Admin Login error:', err);
        let msg = 'Failed to authenticate. Please check your credentials and try again.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'Invalid email or password. Please verify your administrator credentials.';
        } else if (err.code === 'auth/too-many-requests') {
          msg = 'Too many failed login attempts. Please wait a few minutes before trying again.';
        }
        if (errorDiv) {
          errorDiv.style.display = 'flex';
          errorDiv.textContent = msg;
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.innerHTML = `
            <span>Authenticate & Access Dashboard</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          `;
        }
      }
    });
  }
}
