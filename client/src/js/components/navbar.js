import { state } from '../state.js';

export function renderNavbar() {
  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const user = state.user;
  const currentRoute = state.currentRoute || 'home';
  const isMenuOpen = Boolean(state.isMobileMenuOpen);

  return `
    <!-- Top Luxury Header -->
    <header class="valeora-navbar ${currentRoute !== 'home' ? 'scrolled' : ''}">
      <div class="container navbar-container">
        <!-- Official Brand Logo & Name (Aligned Top-Left on Mobile) -->
        <a href="#home" class="nav-brand-link" data-route="home" aria-label="VALEORA Home">
          <img src="/images/valeora_logo.png" alt="VALEORA" class="nav-brand-logo-img">
          <div class="nav-brand-text-block">
            <span class="nav-brand-text">VALEORA</span>
            <span class="nav-brand-subtext">ANTI-TARNISH JEWELLERY</span>
          </div>
        </a>

        <!-- Desktop Navigation Links: Home, Jewellery, About Us, Contact -->
        <ul class="nav-menu-links">
          <li><a href="#home" class="nav-link-item ${currentRoute === 'home' ? 'active' : ''}" data-route="home">Home</a></li>
          <li><a href="#shop" class="nav-link-item ${currentRoute === 'shop' ? 'active' : ''}" data-route="shop">Jewellery</a></li>
          <li><a href="#about" class="nav-link-item ${currentRoute === 'about' ? 'active' : ''}" data-route="about">About Us</a></li>
          <li><a href="#contact" class="nav-link-item ${currentRoute === 'contact' ? 'active' : ''}" data-route="contact">Contact</a></li>
          ${state.isAdmin ? `<li><a href="#admin" class="nav-link-item ${currentRoute === 'admin' ? 'active' : ''}" data-route="admin" style="color:#FFFFFF; font-weight:700; background:rgba(138,21,56,0.45); padding:4px 12px; border-radius:99px; border:1px solid rgba(214,184,190,0.35);">Admin Panel</a></li>` : ''}
        </ul>

        <!-- Desktop Action Buttons (Account, Bag) -->
        <div class="nav-action-buttons">
          <button class="nav-icon-btn" id="nav-user-btn" title="${user ? 'My Account' : 'Sign In'}" data-action="user">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>

          <button class="nav-icon-btn" id="nav-cart-btn" title="Shopping Bag" data-action="cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            ${cartCount > 0 ? `<span class="nav-badge-count">${cartCount}</span>` : ''}
          </button>
        </div>

        <!-- Mobile Controls: Pure Floating Bag & Luxury Menu (No Text, No Background) -->
        <div class="nav-mobile-controls">
          <button class="nav-floating-btn nav-mobile-cart-btn" id="nav-mobile-cart-btn" title="Shopping Bag" aria-label="Shopping Bag">
            <svg class="lux-bag-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 8h14l1.2 13H3.8L5 8z"></path>
              <path d="M8.5 8V5.5a3.5 3.5 0 0 1 7 0V8"></path>
            </svg>
            ${cartCount > 0 ? `<span class="nav-floating-badge">${cartCount}</span>` : ''}
          </button>

          <button class="nav-floating-btn nav-mobile-burger-btn ${isMenuOpen ? 'active' : ''}" id="mobile-burger-btn" aria-label="Navigation Menu" aria-expanded="${isMenuOpen}">
            <div class="lux-haute-menu">
              <span class="haute-bar haute-bar-1"></span>
              <span class="haute-bar haute-bar-2"></span>
              <span class="haute-bar haute-bar-3"></span>
            </div>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Slide-Out Navigation Drawer (Opens from Right) -->
    <div class="mobile-drawer-overlay ${isMenuOpen ? 'open' : ''}" id="mobile-drawer-overlay">
      <div class="mobile-drawer-container" id="mobile-drawer-container">
        
        <!-- Drawer Header -->
        <div class="mobile-drawer-header">
          <div class="mobile-drawer-brand">
            <img src="/images/valeora_logo.png" alt="VALEORA" class="drawer-brand-logo">
            <div class="drawer-brand-info">
              <span class="drawer-brand-name">VALEORA</span>
              <span class="drawer-brand-tag">ANTI-TARNISH JEWELLERY</span>
            </div>
          </div>
          <button class="mobile-drawer-close-btn" id="mobile-drawer-close-btn" aria-label="Close menu">
            <svg class="drawer-close-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Anti-Tarnish Feature Showcase Banner -->
        <div class="mobile-drawer-at-banner">
          <div class="drawer-at-seal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>ANTI-TARNISH CERTIFIED</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="mobile-drawer-nav">
          <ul class="mobile-drawer-links">
            <li class="drawer-item" style="--item-index: 1;">
              <a href="#home" class="mobile-drawer-link ${currentRoute === 'home' ? 'active' : ''}" data-route="home">
                <svg class="drawer-link-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span class="drawer-link-label">Home</span>
                <span class="drawer-link-arrow">›</span>
              </a>
            </li>

            <li class="drawer-item" style="--item-index: 2;">
              <a href="#shop" class="mobile-drawer-link ${currentRoute === 'shop' ? 'active' : ''}" data-route="shop">
                <svg class="drawer-link-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M6 3h12l4 6-10 13L2 9Z"></path>
                  <path d="M11 3L8 9l4 13 4-13-3-6"></path>
                  <path d="M2 9h20"></path>
                </svg>
                <div class="drawer-link-label-group">
                  <span class="drawer-link-label">Jewellery</span>
                  <span class="drawer-link-sublabel">Rings · Necklaces · Bracelets · Earrings</span>
                </div>
                <span class="drawer-link-arrow">›</span>
              </a>
            </li>

            <li class="drawer-item" style="--item-index: 3;">
              <a href="#about" class="mobile-drawer-link ${currentRoute === 'about' ? 'active' : ''}" data-route="about">
                <svg class="drawer-link-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span class="drawer-link-label">About Us</span>
                <span class="drawer-link-arrow">›</span>
              </a>
            </li>

            <li class="drawer-item" style="--item-index: 4;">
              <a href="#contact" class="mobile-drawer-link ${currentRoute === 'contact' ? 'active' : ''}" data-route="contact">
                <svg class="drawer-link-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span class="drawer-link-label">Contact</span>
                <span class="drawer-link-arrow">›</span>
              </a>
            </li>

            <li class="drawer-item" style="--item-index: 5;">
              <a href="#profile" class="mobile-drawer-link ${currentRoute === 'profile' ? 'active' : ''}" id="drawer-profile-link" data-route="profile">
                <svg class="drawer-link-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <div class="drawer-link-label-group">
                  <span class="drawer-link-label">${user ? (user.name || 'My Profile') : 'Sign In / Account'}</span>
                  <span class="drawer-link-sublabel">${user ? (user.email || 'Member') : 'Track orders & manage wishlist'}</span>
                </div>
                <span class="drawer-link-arrow">›</span>
              </a>
            </li>

            ${state.isAdmin ? `
            <li class="drawer-item" style="--item-index: 6;">
              <a href="#admin" class="mobile-drawer-link drawer-admin-link ${currentRoute === 'admin' ? 'active' : ''}" id="drawer-admin-link" data-route="admin">
                <svg class="drawer-link-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div class="drawer-link-label-group">
                  <span class="drawer-link-label">Admin Control Panel</span>
                  <span class="drawer-link-sublabel">Orders, products, inquiries & patrons</span>
                </div>
                <span class="drawer-link-arrow">›</span>
              </a>
            </li>
            ` : ''}
          </ul>
        </nav>

        <!-- Drawer Footer with Quick Cart Action -->
        <div class="mobile-drawer-footer">
          <button class="drawer-bag-quick-btn" id="drawer-bag-quick-btn" aria-label="Shopping Bag">
            <div class="drawer-bag-quick-left">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 8h14l1.2 13H3.8L5 8z"></path>
                <path d="M8.5 8V5.5a3.5 3.5 0 0 1 7 0V8"></path>
              </svg>
              <span>Shopping Bag</span>
            </div>
            <span class="drawer-bag-badge">${cartCount} ${cartCount === 1 ? 'item' : 'items'}</span>
          </button>
        </div>

      </div>
    </div>
  `;
}

export function bindNavbarEvents() {
  const userBtn = document.getElementById('nav-user-btn');
  const drawerProfileLink = document.getElementById('drawer-profile-link');

  const handleUserClick = (e) => {
    e.preventDefault();
    state.toggleMobileMenu(false);
    if (state.user) {
      state.setRoute('profile');
    } else {
      state.toggleAuthModal(true);
    }
  };

  if (userBtn) userBtn.addEventListener('click', handleUserClick);
  if (drawerProfileLink && !state.user) {
    drawerProfileLink.addEventListener('click', handleUserClick);
  }

  const cartBtn = document.getElementById('nav-cart-btn');
  const mobileCartBtn = document.getElementById('nav-mobile-cart-btn');
  const drawerBagBtn = document.getElementById('drawer-bag-quick-btn');

  const handleCartClick = (e) => {
    e.preventDefault();
    state.toggleMobileMenu(false);
    state.toggleCart(true);
  };

  if (cartBtn) cartBtn.addEventListener('click', handleCartClick);
  if (mobileCartBtn) mobileCartBtn.addEventListener('click', handleCartClick);
  if (drawerBagBtn) drawerBagBtn.addEventListener('click', handleCartClick);

  // Mobile Burger Menu Toggle
  const burgerBtn = document.getElementById('mobile-burger-btn');
  const closeBtn = document.getElementById('mobile-drawer-close-btn');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const drawerContainer = document.getElementById('mobile-drawer-container');

  if (burgerBtn) {
    burgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.toggleMobileMenu();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.toggleMobileMenu(false);
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (drawerContainer && !drawerContainer.contains(e.target)) {
        state.toggleMobileMenu(false);
      }
    });
  }

  // Close drawer on clicking any navigation link inside drawer
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      state.toggleMobileMenu(false);
    });
  });
}
