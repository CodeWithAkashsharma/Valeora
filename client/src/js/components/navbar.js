import { state } from '../state.js';

let isMobileMenuOpen = false;

export function renderNavbar() {
  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const user = state.user;

  return `
    <header class="navbar">
      <div class="container navbar-container">
        <!-- Brand Logo -->
        <a href="#home" class="nav-brand" data-route="home">
          <svg class="brand-logo-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#c5a059" stroke-width="2.5"/>
            <path d="M50 22 L72 58 L28 58 Z" fill="none" stroke="#143325" stroke-width="3"/>
            <path d="M50 34 L62 58 L38 58 Z" fill="none" stroke="#c5a059" stroke-width="2"/>
            <path d="M50 58 Q30 75 50 82 Q70 75 50 58 Z" fill="#143325"/>
          </svg>
          <span class="brand-name">Aurite</span>
        </a>

        <!-- Desktop Navigation Links -->
        <ul class="nav-links">
          <li><a href="#home" class="nav-link ${state.currentRoute === 'home' ? 'active' : ''}" data-route="home">Home</a></li>
          <li><a href="#shop" class="nav-link ${state.currentRoute === 'shop' ? 'active' : ''}" data-route="shop">Shop All</a></li>
          <li><a href="#science" class="nav-link ${state.currentRoute === 'science' ? 'active' : ''}" data-route="science">Science & Quality</a></li>
          <li><a href="#about" class="nav-link ${state.currentRoute === 'about' ? 'active' : ''}" data-route="about">About</a></li>
          <li><a href="#contact" class="nav-link ${state.currentRoute === 'contact' ? 'active' : ''}" data-route="contact">Contact</a></li>
        </ul>

        <!-- Action Buttons -->
        <div class="nav-actions">
          <!-- Auth User Button -->
          <button class="icon-btn" id="nav-user-btn" title="${user ? 'Account Profile' : 'Sign In'}" data-action="user">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>

          <!-- Cart Drawer Button -->
          <button class="icon-btn" id="nav-cart-btn" title="Shopping Cart" data-action="cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            ${cartCount > 0 ? `<span class="cart-badge-count">${cartCount}</span>` : ''}
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button class="icon-btn mobile-toggle-btn" id="mobile-menu-toggle" aria-label="Toggle Navigation Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${isMobileMenuOpen 
                ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' 
                : '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>'}
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation Drawer -->
      <div class="mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}" id="mobile-nav-drawer">
        <ul class="mobile-nav-links">
          <li><a href="#home" class="mobile-nav-link ${state.currentRoute === 'home' ? 'active' : ''}" data-route="home">Home</a></li>
          <li><a href="#shop" class="mobile-nav-link ${state.currentRoute === 'shop' ? 'active' : ''}" data-route="shop">Shop All</a></li>
          <li><a href="#science" class="mobile-nav-link ${state.currentRoute === 'science' ? 'active' : ''}" data-route="science">Science & Quality</a></li>
          <li><a href="#about" class="mobile-nav-link ${state.currentRoute === 'about' ? 'active' : ''}" data-route="about">About</a></li>
          <li><a href="#contact" class="mobile-nav-link ${state.currentRoute === 'contact' ? 'active' : ''}" data-route="contact">Contact</a></li>
          ${user ? `<li><a href="#profile" class="mobile-nav-link ${state.currentRoute === 'profile' ? 'active' : ''}" data-route="profile">My Account (${user.name})</a></li>` : ''}
        </ul>
        <div style="padding: 16px 24px; border-top: 1px solid var(--color-sand-border); display:flex; gap:12px;">
          ${!user ? `<button class="btn btn-primary btn-sm" id="mobile-signin-btn" style="width:100%;">Sign In / Register</button>` : ''}
        </div>
      </div>
    </header>
  `;
}

export function bindNavbarEvents() {
  // Mobile Hamburger Toggle
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isMobileMenuOpen = !isMobileMenuOpen;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.toggle('open', isMobileMenuOpen);
    });
  }

  // User Icon Button
  const userBtn = document.getElementById('nav-user-btn');
  if (userBtn) {
    userBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.user) {
        state.setRoute('profile');
      } else {
        state.toggleAuthModal(true);
      }
      isMobileMenuOpen = false;
    });
  }

  // Mobile Signin Button
  const mobileSignin = document.getElementById('mobile-signin-btn');
  if (mobileSignin) {
    mobileSignin.addEventListener('click', () => {
      state.toggleAuthModal(true);
      isMobileMenuOpen = false;
    });
  }

  // Cart Button
  const cartBtn = document.getElementById('nav-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.toggleCart(true);
      isMobileMenuOpen = false;
    });
  }
}
