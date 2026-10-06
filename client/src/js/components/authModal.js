import { state } from '../state.js';
import { showToast } from './toast.js';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  resetUserPassword,
  getUserDoc,
  logoutUser,
  checkUserExistsByEmail,
  isAdminEmail
} from '../services/firebase.js';

let modalAuthTab = 'login'; // 'login' | 'register' | 'forgot'

export function setModalAuthTab(tab) {
  if (['login', 'register', 'forgot'].includes(tab)) {
    modalAuthTab = tab;
  }
}

export function renderAuthModal() {
  if (!state.isAuthOpen) return '';

  return `
    <div class="modal-overlay open" id="auth-modal-overlay">
      <div class="modal-dialog auth-modal-dialog">
        <!-- Close Button -->
        <button class="modal-close-btn" id="auth-close-btn" aria-label="Close modal">&times;</button>
        
        <!-- Header -->
        <div class="auth-modal-header">
          <div class="auth-modal-logo-wrap">
            <img src="/images/valeora_logo.png" alt="Valeora Logo" class="auth-modal-logo-img">
          </div>
          <h3 class="auth-modal-title">VALEORA</h3>
          <p class="auth-modal-subtitle">Welcome to our jewelry store</p>
        </div>

        <!-- Segmented Tab Controls (Hidden when in Forgot Password mode) -->
        <div class="auth-modal-tabs" id="modal-tabs-nav" style="${modalAuthTab === 'forgot' ? 'display:none;' : 'display:flex;'}">
          <button type="button" class="auth-modal-tab-btn ${modalAuthTab === 'login' ? 'active' : ''}" id="modal-tab-login">
            Sign In
          </button>
          <button type="button" class="auth-modal-tab-btn ${modalAuthTab === 'register' ? 'active' : ''}" id="modal-tab-register">
            Create Account
          </button>
        </div>

        <!-- ================= 1. MODAL SIGN IN TAB ================= -->
        <div class="auth-modal-pane ${modalAuthTab === 'login' ? 'active' : ''}" id="modal-pane-login">
          <form id="modal-signin-form" class="auth-modal-form">
            <div class="auth-input-group">
              <label class="auth-field-label" for="modal-signin-email">Email Address <span class="req-star">*</span></label>
              <div class="auth-input-container">
                <div class="auth-input-prefix-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <input 
                  type="email" 
                  id="modal-signin-email" 
                  class="auth-text-input" 
                  placeholder="name@example.com" 
                  required 
                  autocomplete="email"
                >
              </div>
            </div>

            <div class="auth-input-group">
              <div class="auth-label-row">
                <label class="auth-field-label" for="modal-signin-password">Password <span class="req-star">*</span></label>
                <button type="button" class="auth-inline-link" id="modal-btn-forgot">Forgot Password?</button>
              </div>
              <div class="auth-input-container">
                <div class="auth-input-prefix-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input 
                  type="password" 
                  id="modal-signin-password" 
                  class="auth-text-input" 
                  placeholder="••••••••••••" 
                  required 
                  autocomplete="current-password"
                >
                <button type="button" class="auth-pwd-toggle-btn" data-target="modal-signin-password" aria-label="Toggle password">
                  <svg class="eye-open" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg class="eye-closed" style="display:none;" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="auth-submit-btn" id="modal-signin-submit-btn" style="margin-top:10px;">
              <span>Sign In</span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>

          <div class="auth-divider-wrap">
            <div class="auth-divider-line"></div>
            <span class="auth-divider-text">OR SIGN IN WITH</span>
            <div class="auth-divider-line"></div>
          </div>

          <div class="auth-social-row" style="grid-template-columns: 1fr;">
            <button type="button" class="auth-social-btn" id="modal-social-google" style="justify-content:center; width:100%;">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div class="auth-bottom-switch">
            <span>Don't have an account?</span>
            <button type="button" class="auth-switch-link" id="modal-switch-to-register">Create Account</button>
          </div>
        </div>

        <!-- ================= 2. MODAL REGISTER TAB ================= -->
        <div class="auth-modal-pane ${modalAuthTab === 'register' ? 'active' : ''}" id="modal-pane-register">
          <form id="modal-signup-form" class="auth-modal-form">
            <div class="auth-input-group">
              <label class="auth-field-label" for="modal-signup-name">Full Name <span class="req-star">*</span></label>
              <div class="auth-input-container">
                <div class="auth-input-prefix-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <input 
                  type="text" 
                  id="modal-signup-name" 
                  class="auth-text-input" 
                  placeholder="e.g. Your Full Name" 
                  required 
                  autocomplete="name"
                >
              </div>
            </div>

            <div class="auth-input-group">
              <label class="auth-field-label" for="modal-signup-email">Email Address <span class="req-star">*</span></label>
              <div class="auth-input-container">
                <div class="auth-input-prefix-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <input 
                  type="email" 
                  id="modal-signup-email" 
                  class="auth-text-input" 
                  placeholder="name@example.com" 
                  required 
                  autocomplete="email"
                >
              </div>
            </div>

            <div class="auth-input-group">
              <label class="auth-field-label" for="modal-signup-phone">Phone Number <span class="req-star">*</span></label>
              <div class="auth-input-container">
                <div class="auth-input-prefix-icon auth-phone-prefix">
                  <span>+91</span>
                </div>
                <input 
                  type="tel" 
                  id="modal-signup-phone" 
                  class="auth-text-input phone-input-pad" 
                  placeholder="98765 43210" 
                  pattern="[0-9]{10}"
                  maxlength="10"
                  required 
                  autocomplete="tel"
                >
              </div>
            </div>

            <div class="auth-input-group">
              <label class="auth-field-label" for="modal-signup-password">Password <span class="req-star">*</span></label>
              <div class="auth-input-container">
                <div class="auth-input-prefix-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input 
                  type="password" 
                  id="modal-signup-password" 
                  class="auth-text-input" 
                  placeholder="At least 6 characters" 
                  required 
                  minlength="6"
                  autocomplete="new-password"
                >
                <button type="button" class="auth-pwd-toggle-btn" data-target="modal-signup-password" aria-label="Toggle password">
                  <svg class="eye-open" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg class="eye-closed" style="display:none;" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>

              <!-- Live Password Strength Meter Bar -->
              <div class="auth-pwd-meter" id="modal-pwd-meter-box">
                <div class="pwd-meter-track">
                  <div class="pwd-meter-fill" id="modal-pwd-meter-bar"></div>
                </div>
                <span class="pwd-meter-status" id="modal-pwd-meter-label">Password strength</span>
              </div>
            </div>

            <button type="submit" class="auth-submit-btn" id="modal-signup-submit-btn" style="margin-top:10px;">
              <span>Create Account</span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </form>

          <div class="auth-bottom-switch">
            <span>Already have an account?</span>
            <button type="button" class="auth-switch-link" id="modal-switch-to-signin">Sign In</button>
          </div>
        </div>

        <!-- ================= 3. MODAL FORGOT PASSWORD PANE ================= -->
        <div class="auth-modal-pane ${modalAuthTab === 'forgot' ? 'active' : ''}" id="modal-pane-forgot">
          <div class="auth-pane-header" style="text-align:center; margin-bottom:18px;">
            <h3 style="font-family:var(--font-serif); font-size:1.4rem; color:#ffffff; margin-bottom:4px;">Reset Password</h3>
            <p style="font-size:0.84rem; color:var(--color-text-muted); line-height:1.4;">Enter your registered email and Firebase will send you a secure password reset link.</p>
          </div>

          <form id="modal-forgot-form" class="auth-modal-form">
            <div class="auth-input-group">
              <label class="auth-field-label" for="modal-forgot-email">Email Address <span class="req-star">*</span></label>
              <div class="auth-input-container">
                <div class="auth-input-prefix-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <input 
                  type="email" 
                  id="modal-forgot-email" 
                  class="auth-text-input" 
                  placeholder="name@example.com" 
                  required 
                  autocomplete="email"
                >
              </div>
            </div>

            <button type="submit" class="auth-submit-btn" id="modal-btn-submit-forgot" style="margin-top:10px;">
              <span>Send Reset Link</span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>

          <div class="auth-bottom-switch" style="margin-top:16px;">
            <span>Remember your password?</span>
            <button type="button" class="auth-switch-link" id="modal-switch-back-signin">Back to Sign In</button>
          </div>
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

  // Tab switching (Sign In vs Create Account)
  const tabLogin = document.getElementById('modal-tab-login');
  const tabRegister = document.getElementById('modal-tab-register');
  const paneLogin = document.getElementById('modal-pane-login');
  const paneRegister = document.getElementById('modal-pane-register');
  const paneForgot = document.getElementById('modal-pane-forgot');
  const tabsNav = document.getElementById('modal-tabs-nav');

  const switchModalTab = (mode) => {
    modalAuthTab = mode;
    if (tabsNav) {
      tabsNav.style.display = mode === 'forgot' ? 'none' : 'flex';
    }

    if (tabLogin) tabLogin.classList.toggle('active', mode === 'login');
    if (tabRegister) tabRegister.classList.toggle('active', mode === 'register');

    if (paneLogin) paneLogin.classList.toggle('active', mode === 'login');
    if (paneRegister) paneRegister.classList.toggle('active', mode === 'register');
    if (paneForgot) paneForgot.classList.toggle('active', mode === 'forgot');
  };

  if (tabLogin) tabLogin.addEventListener('click', () => switchModalTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchModalTab('register'));

  const switchRegBtn = document.getElementById('modal-switch-to-register');
  if (switchRegBtn) switchRegBtn.addEventListener('click', () => switchModalTab('register'));

  const switchSignBtn = document.getElementById('modal-switch-to-signin');
  if (switchSignBtn) switchSignBtn.addEventListener('click', () => switchModalTab('login'));

  const forgotBtn = document.getElementById('modal-btn-forgot');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', () => switchModalTab('forgot'));
  }

  const backSignBtn = document.getElementById('modal-switch-back-signin');
  if (backSignBtn) {
    backSignBtn.addEventListener('click', () => switchModalTab('login'));
  }

  // Password toggles
  const pwdToggles = overlay ? overlay.querySelectorAll('.auth-pwd-toggle-btn') : [];
  pwdToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');

      if (input.type === 'password') {
        input.type = 'text';
        if (eyeOpen) eyeOpen.style.display = 'none';
        if (eyeClosed) eyeClosed.style.display = 'block';
      } else {
        input.type = 'password';
        if (eyeOpen) eyeOpen.style.display = 'block';
        if (eyeClosed) eyeClosed.style.display = 'none';
      }
    });
  });

  // Live Password Strength Meter
  const signupPwdInput = document.getElementById('modal-signup-password');
  const meterBar = document.getElementById('modal-pwd-meter-bar');
  const meterLabel = document.getElementById('modal-pwd-meter-label');

  if (signupPwdInput && meterBar && meterLabel) {
    signupPwdInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (!val) {
        meterBar.style.width = '0%';
        meterBar.className = 'pwd-meter-fill';
        meterLabel.textContent = 'Password strength';
        meterLabel.style.color = 'var(--color-text-dim)';
        return;
      }

      let score = 0;
      if (val.length >= 6) score += 1;
      if (val.length >= 10) score += 1;
      if (/[A-Z]/.test(val)) score += 1;
      if (/[0-9]/.test(val)) score += 1;
      if (/[^A-Za-z0-9]/.test(val)) score += 1;

      if (score <= 2) {
        meterBar.style.width = '33%';
        meterBar.className = 'pwd-meter-fill weak';
        meterLabel.textContent = 'Weak';
        meterLabel.style.color = '#FF6B8B';
      } else if (score <= 3) {
        meterBar.style.width = '66%';
        meterBar.className = 'pwd-meter-fill medium';
        meterLabel.textContent = 'Good';
        meterLabel.style.color = '#E2C290';
      } else {
        meterBar.style.width = '100%';
        meterBar.className = 'pwd-meter-fill strong';
        meterLabel.textContent = 'Strong';
        meterLabel.style.color = '#68D391';
      }
    });
  }

  // 1. Email & Password Sign In
  const signinForm = document.getElementById('modal-signin-form');
  const signinSubmitBtn = document.getElementById('modal-signin-submit-btn');

  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('modal-signin-email')?.value?.trim();
      const password = document.getElementById('modal-signin-password')?.value;

      if (!email || !password) {
        showToast('Please enter your email and password.', 'error');
        return;
      }

      // Check if trying to sign in as Administrator via patron modal
      if (isAdminEmail(email)) {
        showToast('Administrative accounts cannot sign in from the patron login page. Please use the dedicated Admin Portal at /admin/login.', 'warning');
        return;
      }

      const origText = signinSubmitBtn ? signinSubmitBtn.innerHTML : '';
      if (signinSubmitBtn) {
        signinSubmitBtn.disabled = true;
        signinSubmitBtn.innerHTML = '<span>Verifying credentials...</span>';
      }

      try {
        const user = await loginWithEmail(email, password);
        const userData = await getUserDoc(user.uid);

        const isAdm = isAdminEmail(user.email) || userData?.role === 'admin';
        if (isAdm) {
          await logoutUser();
          showToast('Administrative accounts cannot sign in from the patron login page. Please use the dedicated Admin Portal at /admin/login.', 'warning');
          return;
        }

        state.setFirebaseUser(user, userData);
        state.recordRegisteredUser({
          uid: user.uid,
          name: userData?.name || user.displayName || email.split('@')[0],
          email: user.email,
          phone: userData?.phone || user.phoneNumber || '',
          role: 'customer'
        });
        state.toggleAuthModal(false);
        state.toggleCheckoutModal(false);
        showToast(`Welcome back, ${state.user.name}!`, 'success');
        state.setRoute('home');
      } catch (err) {
        console.warn('Firebase Email Sign In error:', err);
        
        let userExists = false;
        try {
          userExists = await checkUserExistsByEmail(email);
        } catch (e) {
          console.warn('Could not check user existence:', e);
        }

        if (!userExists || err.code === 'auth/user-not-found') {
          showToast('No account found with this email. Please create an account first.', 'warning');
          switchModalTab('register');
          const signupEmailInput = document.getElementById('modal-signup-email');
          if (signupEmailInput) signupEmailInput.value = email;
          const signupNameInput = document.getElementById('modal-signup-name');
          if (signupNameInput) signupNameInput.focus();
          return;
        }

        let msg = 'Invalid email or password. Please try again.';
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'Incorrect password. Click "Forgot Password" if needed.';
        } else if (err.code === 'auth/too-many-requests') {
          msg = 'Access temporarily disabled due to failed attempts. Reset password or wait a moment.';
        }
        showToast(msg, 'error');
      } finally {
        if (signinSubmitBtn) {
          signinSubmitBtn.disabled = false;
          signinSubmitBtn.innerHTML = origText;
        }
      }
    });
  }

  // 2. User Registration Form
  const signupForm = document.getElementById('modal-signup-form');
  const signupSubmitBtn = document.getElementById('modal-signup-submit-btn');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-signup-name')?.value?.trim();
      const email = document.getElementById('modal-signup-email')?.value?.trim();
      const phone = document.getElementById('modal-signup-phone')?.value?.trim();
      const password = document.getElementById('modal-signup-password')?.value;

      if (!name || !email || !phone || !password) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      if (isAdminEmail(email)) {
        showToast('This administrative email is reserved. Please sign in via the Admin Portal at /admin/login.', 'error');
        return;
      }

      if (phone.length < 10) {
        showToast('Please enter a valid 10-digit mobile number.', 'error');
        return;
      }

      if (password.length < 6) {
        showToast('Password must be at least 6 characters long.', 'error');
        return;
      }

      const origText = signupSubmitBtn ? signupSubmitBtn.innerHTML : '';
      if (signupSubmitBtn) {
        signupSubmitBtn.disabled = true;
        signupSubmitBtn.innerHTML = '<span>Creating Account...</span>';
      }

      try {
        const regUser = await registerWithEmail(email, password, name, `+91 ${phone}`);
        state.recordRegisteredUser({
          uid: regUser?.uid || null,
          name: name,
          email: email,
          phone: `+91 ${phone}`,
          role: 'customer'
        });
        // Log out immediately so the session does not auto-login to user profile
        try {
          await logoutUser();
        } catch (ign) {}

        showToast('Account created successfully! Please sign in with your credentials.', 'success');

        // Automatically switch to the Sign In tab
        switchModalTab('login');

        // Prefill email in Sign In form and focus password
        const signinEmail = document.getElementById('modal-signin-email');
        if (signinEmail) signinEmail.value = email;
        const signinPassword = document.getElementById('modal-signin-password');
        if (signinPassword) {
          signinPassword.value = '';
          signinPassword.focus();
        }

        // Clear signup form
        signupForm.reset();
      } catch (err) {
        console.warn('Firebase Registration error:', err);
        let msg = err.message || 'Could not complete registration. Please try again.';
        if (err.code === 'auth/email-already-in-use') {
          msg = 'This email is already registered. Please sign in instead.';
        } else if (err.code === 'auth/weak-password') {
          msg = 'Password is too weak. Please use at least 6 characters.';
        } else if (err.code === 'auth/operation-not-allowed') {
          msg = 'Email/Password provider is not enabled in Firebase Console (Authentication > Sign-in method).';
        } else if (err.code === 'auth/unauthorized-domain') {
          msg = 'This domain is not authorized in Firebase Console (Authentication > Settings > Authorized domains).';
        }
        showToast(msg, 'error');
      } finally {
        if (signupSubmitBtn) {
          signupSubmitBtn.disabled = false;
          signupSubmitBtn.innerHTML = origText;
        }
      }
    });
  }

  // 3. Forgot Password Reset Form
  const forgotForm = document.getElementById('modal-forgot-form');
  const forgotSubmitBtn = document.getElementById('modal-btn-submit-forgot');

  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('modal-forgot-email')?.value?.trim();
      if (!email) {
        showToast('Please enter your email address.', 'error');
        return;
      }

      const origText = forgotSubmitBtn ? forgotSubmitBtn.innerHTML : '';
      if (forgotSubmitBtn) {
        forgotSubmitBtn.disabled = true;
        forgotSubmitBtn.innerHTML = '<span>Sending link...</span>';
      }

      try {
        await resetUserPassword(email);
        showToast(`Password reset link sent to ${email}. Please check your inbox.`, 'success');
        setTimeout(() => {
          switchModalTab('login');
        }, 3000);
      } catch (err) {
        console.warn('Password reset error:', err);
        showToast(err.message || 'Could not send reset link. Please verify the email address.', 'error');
      } finally {
        if (forgotSubmitBtn) {
          forgotSubmitBtn.disabled = false;
          forgotSubmitBtn.innerHTML = origText;
        }
      }
    });
  }

  // 4. Google 1-Tap Sign In
  const googleBtn = document.getElementById('modal-social-google');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        const user = await loginWithGoogle();
        const userData = await getUserDoc(user.uid);

        const isAdm = isAdminEmail(user.email) || userData?.role === 'admin';
        if (isAdm) {
          await logoutUser();
          showToast('Administrative accounts cannot sign in from the patron login page. Please use the dedicated Admin Portal at /admin/login.', 'warning');
          return;
        }

        state.setFirebaseUser(user, userData);
        state.recordRegisteredUser({
          uid: user.uid,
          name: userData?.name || user.displayName || user.email.split('@')[0],
          email: user.email,
          phone: userData?.phone || user.phoneNumber || '',
          role: 'customer'
        });
        state.toggleAuthModal(false);
        state.toggleCheckoutModal(false);
        showToast(`Signed in as ${state.user.name}`, 'success');
        state.setRoute('home');
      } catch (err) {
        console.warn('Google Sign In error:', err);
        if (err.code !== 'auth/popup-closed-by-user') {
          let msg = err.message || 'Google sign-in could not be completed.';
          if (err.code === 'auth/operation-not-allowed') {
            msg = 'Google provider is not enabled in Firebase Console (Authentication > Sign-in method).';
          } else if (err.code === 'auth/unauthorized-domain') {
            msg = 'Domain not authorized in Firebase (Authentication > Settings > Authorized domains).';
          }
          showToast(msg, 'error');
        }
      }
    });
  }
}
