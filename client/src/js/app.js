import { state } from './state.js';
import { REVIEWS } from './productsData.js';
import { ScrollCanvasEngine } from './scrollAnimation.js';
import { showToast } from './components/toast.js';

// ============================================================
// UTILITY HELPERS & LOGO SVG
// ============================================================
const VALID_ROUTES = ['home', 'shop', 'science', 'about', 'contact', 'profile', 'product', 'admin'];
let activeProductId = 'omega-3-triple';
let pendingSignupUser = null;
let activeAdminTab = 'analytics';

function formatPrice(n) { return `₹${Number(n || 0).toLocaleString('en-IN')}`; }

function getInitials(name) {
  if (!name) return 'AM';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

function renderLogoSVG(color = '#0f281e', size = 38) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="leaf-cutout">
        <rect width="100" height="100" fill="white"/>
        <path d="M 14 52 C 26 62, 38 72, 47 84" stroke="black" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 28 65 L 34 68 M 36 74 L 43 75" stroke="black" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 86 52 C 74 62, 62 72, 53 84" stroke="black" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 72 65 L 66 68 M 64 74 L 57 75" stroke="black" stroke-width="2" fill="none" stroke-linecap="round"/>
      </mask>
    </defs>
    <!-- Top Arc -->
    <path d="M 18 42 A 34 34 0 0 1 82 42" stroke="${color}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <!-- Mountain -->
    <path d="M 14 55 L 30 35 L 40 45 L 50 28 L 60 45 L 70 35 L 86 55" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Tree Trunk -->
    <line x1="50" y1="74" x2="50" y2="48" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Tree Branches -->
    <path d="M 44 65 L 50 59 L 56 65 M 45 58 L 50 52 L 55 58" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Leaves -->
    <path d="M 14 55 A 36 36 0 0 0 48 85 C 36 72, 22 58, 14 55 Z" fill="${color}" mask="url(#leaf-cutout)"/>
    <path d="M 86 55 A 36 36 0 0 1 52 85 C 64 72, 78 58, 86 55 Z" fill="${color}" mask="url(#leaf-cutout)"/>
  </svg>`;
}

function svgIcon(name, size = 20) {
  const icons = {
    home: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    login: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
    user: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    cart: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    menu: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    close: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    shield: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    star: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    truck: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    arrow_dn: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`,
    logout: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    order: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    mail: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    phone: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    message: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    lock: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    leaf: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    award: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    chart: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    box: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    chat: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    plus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  };
  return icons[name] || '';
}

// ============================================================
// NAVBAR
// ============================================================
function renderNavbar() {
  const count = state.getCartCount();
  const r = state.currentRoute;
  const userName = (state.user && state.user.name) ? String(state.user.name).split(' ')[0] : (state.user && state.user.email ? String(state.user.email).split('@')[0] : 'Member');
  const userLabel = state.user ? `My Account (${userName})` : 'Sign In';

  return `
  <header class="navbar ${r !== 'home' ? 'dark-nav' : ''}" id="main-navbar">
    <div class="container navbar-container">
      <div class="nav-brand-static">
        ${renderLogoSVG('#faf7f2', 38)}
        <span class="brand-name">Aurite</span>
      </div>
      <ul class="nav-links">
        <li><a class="nav-link ${r==='home'?'active':''}" data-route="home">Home</a></li>
        <li><a class="nav-link ${r==='shop'||r==='product'?'active':''}" data-route="shop">Shop All</a></li>
        <li><a class="nav-link ${r==='science'?'active':''}" data-route="science">Science</a></li>
        <li><a class="nav-link ${r==='about'?'active':''}" data-route="about">About</a></li>
        <li><a class="nav-link ${r==='contact'?'active':''}" data-route="contact">Contact</a></li>
      </ul>
      <div class="nav-actions">
        ${state.isAdmin ? `<button class="btn btn-gold btn-sm nav-desktop-only" data-route="admin" style="padding:5px 10px;font-weight:700">Admin</button>` : ''}
        <button class="icon-btn nav-desktop-only" id="nav-user-btn" aria-label="Account">${svgIcon('user',20)}</button>
        <button class="icon-btn nav-desktop-only" id="nav-cart-btn" aria-label="Cart">${svgIcon('cart',20)}${count>0?`<span class="cart-badge-count">${count}</span>`:''}</button>
        <button class="icon-btn mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">${svgIcon('menu',22)}</button>
      </div>
    </div>
    <div class="mobile-drawer" id="mobile-drawer">
      <button class="drawer-close-btn" id="drawer-close-btn" aria-label="Close Menu">${svgIcon('close', 20)}</button>
      <ul class="mobile-nav-links">
        <li>
          <a class="mobile-nav-link ${r==='home'?'active':''}" data-route="home">
            <span class="drawer-link-inner">${svgIcon('home', 18)} <span>Home</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link ${r==='shop'||r==='product'?'active':''}" data-route="shop">
            <span class="drawer-link-inner">${svgIcon('box', 18)} <span>Shop All</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link ${r==='science'?'active':''}" data-route="science">
            <span class="drawer-link-inner">${svgIcon('check', 18)} <span>Our Science</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link ${r==='about'?'active':''}" data-route="about">
            <span class="drawer-link-inner">${svgIcon('shield', 18)} <span>About Us</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link ${r==='contact'?'active':''}" data-route="contact">
            <span class="drawer-link-inner">${svgIcon('mail', 18)} <span>Contact</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link ${r==='profile'?'active':''}" data-route="profile">
            <span class="drawer-link-inner">${svgIcon('user', 18)} <span>${state.user ? 'My Profile' : 'Profile / Sign In'}</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link" id="drawer-cart-link" style="cursor:pointer">
            <span class="drawer-link-inner">${svgIcon('cart', 18)} <span>Cart</span></span>
            ${count > 0 ? `<span class="badge badge-gold" style="font-size:.62rem;padding:2px 8px">${count}</span>` : ''}
          </a>
        </li>
        ${state.isAdmin ? `
        <li>
          <a class="mobile-nav-link ${r==='admin'?'active':''}" data-route="admin" style="color:var(--gold)">
            <span class="drawer-link-inner">${svgIcon('lock', 18)} <span>Admin Portal</span></span>
          </a>
        </li>` : ''}
      </ul>
    </div>
  </header>`;
}

function updateNavbarScrollState() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;
  if (state.currentRoute !== 'home') {
    navbar.classList.add('dark-nav');
    navbar.classList.remove('scrolled');
  } else {
    const heroSec = document.getElementById('hero-section');
    const threshold = heroSec ? (heroSec.offsetTop + heroSec.offsetHeight - 120) : 400;
    if (window.scrollY > threshold) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('dark-nav');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.remove('dark-nav');
    }
  }
}

function bindNavbarEvents() {
  let mobileOpen = false;
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  if (mobileBtn && drawer) {
    mobileBtn.addEventListener('click', () => {
      mobileOpen = !mobileOpen;
      drawer.classList.toggle('open', mobileOpen);
      mobileBtn.innerHTML = mobileOpen ? svgIcon('close',24) : svgIcon('menu',24);
    });
  }
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  if (drawerCloseBtn && drawer) {
    drawerCloseBtn.addEventListener('click', () => {
      mobileOpen = false;
      drawer.classList.remove('open'); setModalBackgroundFreeze(false);
      if (mobileBtn) mobileBtn.innerHTML = svgIcon('menu',22);
    });
  }
  const drawerCartLink = document.getElementById('drawer-cart-link');
  if (drawerCartLink) {
    drawerCartLink.addEventListener('click', () => {
      mobileOpen = false;
      if (drawer) drawer.classList.remove('open');
      if (mobileBtn) mobileBtn.innerHTML = svgIcon('menu',22);
      openCartDrawer();
    });
  }
  // Drawer nav links
  if (drawer) {
    drawer.querySelectorAll('[data-route]').forEach(link => {
      link.addEventListener('click', (e) => {
        const r = link.dataset.route;
        if (!r) return;
        e.preventDefault();
        mobileOpen = false;
        drawer.classList.remove('open');
        if (mobileBtn) mobileBtn.innerHTML = svgIcon('menu',22);
        if (r === 'cart') { openCartDrawer(); return; }
        if (r === 'login') { openAuthModal('login'); return; }
        if (VALID_ROUTES.includes(r)) navigate(r);
      });
    });
  }
  const userBtn = document.getElementById('nav-user-btn');
  if (userBtn) {
    userBtn.addEventListener('click', () => {
      if (state.user) navigate('profile');
      else openAuthModal('login');
      if (drawer) { mobileOpen = false; drawer.classList.remove('open'); }
    });
  }
  const cartBtn = document.getElementById('nav-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      openCartDrawer();
      if (drawer) { mobileOpen = false; drawer.classList.remove('open'); }
    });
  }

  window.removeEventListener('scroll', updateNavbarScrollState);
  window.addEventListener('scroll', updateNavbarScrollState, { passive: true });
  updateNavbarScrollState();
}

function refreshNavbar() {
  const el = document.getElementById('main-navbar');
  if (el) { el.outerHTML = renderNavbar(); bindNavbarEvents(); }
}

// ============================================================
// PRODUCT CARD
// ============================================================
function renderProductCard(p) {
  const isOutOfStock = (p.stockQty !== undefined && p.stockQty <= 0);

  return `
  <div class="product-card" data-product-id="${p.id}">
    <div class="product-image-wrap" data-product-id="${p.id}">
      ${isOutOfStock ? `<span class="badge" style="position:absolute;bottom:14px;left:14px;z-index:2;background:rgba(198,40,40,0.95);color:#fff">Out of Stock</span>` : ''}
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.background='#f4efe6'">
    </div>
    <div class="product-info">
      <div class="product-category">${p.category}</div>
      <h3 class="product-title" data-product-id="${p.id}" style="cursor:pointer">${p.name}</h3>
      <div class="product-rating">
        <span class="stars" style="color:var(--gold)">★★★★★</span>
        <span>${p.rating} (${p.reviewsCount})</span>
      </div>
      <p class="product-benefit-tag">${p.tagline}</p>
      <div class="product-price-row">
        <div class="product-price-details">
          <div class="product-price">${formatPrice(p.price)}</div>
        </div>
        ${isOutOfStock ? 
          `<button class="btn btn-secondary btn-sm" disabled style="opacity:0.6;cursor:not-allowed;flex-shrink:0">Out of Stock</button>` :
          `<button class="btn btn-primary btn-sm add-cart-btn" data-action="add-cart" data-product-id="${p.id}">Add To Cart</button>`
        }
      </div>
    </div>
  </div>`;
}

function bindProductGridEvents(container) {
  if (!container) return;
  container.addEventListener('click', e => {
    const addBtn = e.target.closest('[data-action="add-cart"]');
    if (addBtn) {
      e.stopPropagation();
      const pid = addBtn.dataset.productId;
      const product = state.products.find(p => p.id === pid);
      if (product) {
        state.addToCart(product, 'one-time', 1);
        showToast(`${product.name} added to cart!`);
      }
      return;
    }

    const card = e.target.closest('.product-card');
    if (card) {
      const pid = card.dataset.productId;
      if (pid) navigate('product', pid);
    }
  });
}

// ============================================================
// CART DRAWER & CHECKOUT
// ============================================================
function setModalBackgroundFreeze(freeze) {
  if (freeze) {
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  } else {
    setTimeout(() => {
      const hasOpenModal = document.querySelector('.modal-overlay.open') ||
                           document.querySelector('.cart-overlay.open') ||
                           document.querySelector('.mobile-drawer.open') ||
                           (document.getElementById('modal-box') && document.getElementById('modal-box').children.length > 0);
      if (!hasOpenModal) {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        document.body.style.overflow = '';
      }
    }, 50);
  }
}

function openCartDrawer() {
  state.isCartOpen = true;
  let box = document.getElementById('cart-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'cart-box';
    document.body.appendChild(box);
  }
  box.innerHTML = renderCartHTML();
  bindCartEvents();
  const overlay = document.getElementById('cart-overlay');
  if (overlay) {
    overlay.classList.add('open');
    setModalBackgroundFreeze(true);
  }
}

function closeCartDrawer() {
  state.isCartOpen = false;
  const overlay = document.getElementById('cart-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    setModalBackgroundFreeze(false);
  }
}

function renderCartHTML() {
  const cart = state.cart;
  const subtotal = state.getCartSubtotal();
  const total = state.getCartTotal();
  const count = state.getCartCount();
  const threshold = 1499;
  const pct = Math.min((subtotal / threshold) * 100, 100);
  const remaining = threshold - subtotal;

  return `
  <div class="cart-overlay ${state.isCartOpen ? 'open' : ''}" id="cart-overlay">
    <div class="cart-drawer">
      <div class="cart-header">
        <h3 class="cart-title">Your Cart ${count > 0 ? `(${count})` : ''}</h3>
        <button id="cart-close-btn" aria-label="Close Cart">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="free-shipping-bar">
        <p style="font-size:.82rem;font-weight:600;color:var(--forest-dark)">
          ${remaining <= 0 ? '🎉 You unlocked FREE Express Shipping!' : `Add ${formatPrice(remaining)} more for free shipping`}
        </p>
        <div class="shipping-progress-track"><div class="shipping-progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="cart-items">
        ${cart.length === 0 ? `
          <div class="cart-empty">
            ${svgIcon('cart',48)}
            <p>Your cart is empty</p>
            <button class="btn btn-primary btn-sm" data-route="shop">Explore Products</button>
          </div>` :
          cart.map(item => `
          <div class="cart-item" data-id="${item.id}" data-type="${item.purchaseType}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.style.background='#f4efe6'">
            <div class="cart-item-details">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
                <div class="cart-item-title">${item.name}</div>
                <button class="cart-remove-btn" data-action="remove" data-id="${item.id}" data-type="${item.purchaseType}" title="Remove item" aria-label="Remove item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div class="cart-item-qty-row">
                <div class="qty-control">
                  <button class="qty-btn" data-action="dec" data-id="${item.id}" data-type="${item.purchaseType}" aria-label="Decrease quantity">−</button>
                  <span class="qty-val">${item.qty}</span>
                  <button class="qty-btn" data-action="inc" data-id="${item.id}" data-type="${item.purchaseType}" aria-label="Increase quantity">+</button>
                </div>
                <div class="cart-item-price">${formatPrice(item.unitPrice * item.qty)}</div>
              </div>
            </div>
          </div>`).join('')
        }
      </div>
      ${cart.length > 0 ? `
      <div class="cart-footer">
        <div class="cart-summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
        <div class="cart-summary-row"><span>Shipping</span><span>${remaining<=0?'FREE':formatPrice(149)}</span></div>
        <div class="cart-summary-row total"><span>Total</span><span>${formatPrice(total + (remaining<=0?0:149))}</span></div>
        <button class="btn btn-gold btn-lg" id="checkout-open-btn" style="width:100%;margin-top:14px;${state.isAdmin ? 'opacity:0.6;cursor:not-allowed' : ''}" ${state.isAdmin ? 'disabled title="Admins cannot place orders"' : ''}>Proceed →</button>
      </div>` : ''}
    </div>
  </div>`;
}

function bindCartEvents() {
  const overlay = document.getElementById('cart-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', e => { if (e.target === overlay) closeCartDrawer(); });

  const closeBtn = document.getElementById('cart-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => closeCartDrawer());

  overlay.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const route = btn.dataset.route;
      closeCartDrawer();
      if (route && VALID_ROUTES.includes(route)) {
        navigate(route);
      }
    });
  });

  overlay.querySelectorAll('.qty-btn, .cart-remove-btn, [data-action="inc"], [data-action="dec"], [data-action="remove"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { action, id, type } = btn.dataset;
      const item = state.cart.find(i => i.id === id && i.purchaseType === type);
      if (!item) return;
      if (action === 'inc') state.updateCartQty(id, type, item.qty + 1);
      else if (action === 'dec') state.updateCartQty(id, type, item.qty - 1);
      else if (action === 'remove') state.removeCartItem(id, type);
    });
  });

  const checkoutBtn = document.getElementById('checkout-open-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeCartDrawer();
      openCheckoutModal();
    });
  }
}

function openCheckoutModal() {
  setModalBackgroundFreeze(true);
  let box = document.getElementById('modal-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'modal-box';
    document.body.appendChild(box);
  }
  const total = state.getCartTotal();
  const totalItems = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const itemsSummary = state.cart.map(i => `${i.name} (x${i.qty})`).join(', ');

  box.innerHTML = `
  <div class="modal-overlay open" id="checkout-overlay" style="padding:16px 12px;align-items:center;justify-content:center">
    <div class="modal-card checkout-modal-card">
      
      <!-- Modal Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--sand-border);padding-bottom:12px;margin-bottom:16px">
        <div>
          <h3 style="font-family:var(--font-serif);font-size:clamp(1.15rem, 3vw, 1.35rem);color:var(--forest-dark);margin:0;line-height:1.2">Secure Payment Gateway</h3>
          <span style="font-size:.74rem;color:var(--text-muted);letter-spacing:.02em">256-bit Bank-Grade Encrypted &amp; PCI-DSS Compliant</span>
        </div>
        <button class="modal-close-btn" id="checkout-close-btn" style="position:static;width:32px;height:32px;font-size:1rem;display:flex;align-items:center;justify-content:center">${svgIcon('close',15)}</button>
      </div>

      <!-- Checkout Form with Full Address -->
      <form id="checkout-form" style="display:flex;flex-direction:column;gap:14px">
        
        <!-- Contact Information Section -->
        <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px 16px;box-shadow:var(--shadow-sm)">
          <div style="font-size:.74rem;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;display:flex;align-items:center;gap:6px">
            <span>1. Contact &amp; Shipping Details</span>
          </div>
          
          <!-- Name & Mobile -->
          <div class="checkout-form-grid">
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Full Name *</label>
              <input type="text" id="co-name" class="form-input" required value="${state.user?.name || 'Alex Mercer'}" placeholder="Full name" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Mobile Number *</label>
              <input type="tel" id="co-phone" class="form-input" required value="${state.user?.phone || '+91 98765 43210'}" placeholder="10-digit mobile" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
          </div>

          <!-- Email & Country -->
          <div class="checkout-form-grid">
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Email Address *</label>
              <input type="email" id="co-email" class="form-input" required value="${state.user?.email || 'alex@example.com'}" placeholder="Email address" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Country *</label>
              <input type="text" id="co-country" class="form-input" required value="${state.user?.country || 'India'}" placeholder="Country" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
          </div>

          <!-- City & Pincode -->
          <div class="checkout-city-grid">
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">City / Town *</label>
              <input type="text" id="co-city" class="form-input" required value="${state.user?.city || 'Mumbai'}" placeholder="City" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Pincode *</label>
              <input type="text" id="co-pincode" class="form-input" required value="${state.user?.pincode || '400001'}" placeholder="6-digit pincode" maxlength="6" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
          </div>

          <!-- Delivery Address -->
          <div style="margin-top:2px">
            <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Delivery Address *</label>
            <textarea id="co-addr" class="form-input" rows="2" required placeholder="House / Flat No., Building, Street &amp; Locality" style="padding:8px 10px;font-size:.82rem;resize:vertical;min-height:48px">${state.user?.address || 'Flat 402, Green Glen Heights, HSR Layout'}</textarea>
          </div>
        </div>

        <!-- Payment Method Preference (UPI/QR and COD Only) -->
        <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px 16px;box-shadow:var(--shadow-sm)">
          <div style="font-size:.74rem;font-weight:800;color:var(--forest-dark);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em">2. Select Payment Method</div>
          <div class="checkout-pay-methods">
            <label class="pay-method-pill">
              <input type="radio" name="pay-method" value="upi" checked style="accent-color:var(--forest);margin:0;flex-shrink:0">
              <span>⚡ UPI / QR (Instant &amp; Secure)</span>
            </label>
            <label class="pay-method-pill">
              <input type="radio" name="pay-method" value="cod" style="accent-color:var(--forest);margin:0;flex-shrink:0">
              <span>💵 Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        <!-- Clean Minimalist Order Summary Box -->
        <div style="background:var(--forest-dark);color:var(--sand-light);border-radius:var(--r-lg);padding:14px 18px;display:flex;justify-content:space-between;align-items:center;gap:12px;box-shadow:var(--shadow-md);border:1px solid rgba(197,160,89,.3)">
          <div>
            <div style="font-size:.86rem;font-weight:700;color:var(--sand-light)">${totalItems} Item${totalItems > 1 ? 's' : ''}</div>
            <div style="font-size:.70rem;color:var(--gold);font-weight:600;margin-top:2px">Free Express Shipping</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:.66rem;color:rgba(250,247,242,.7);text-transform:uppercase;font-weight:700;letter-spacing:.05em">Total Payable</div>
            <div style="font-size:1.25rem;font-weight:800;color:#ffffff;line-height:1.1;margin-top:2px">${formatPrice(total)}</div>
          </div>
        </div>

        <!-- Action Button -->
        <button type="submit" class="btn btn-gold btn-lg" style="width:100%;padding:13px;font-size:.95rem;font-weight:800;letter-spacing:.02em;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:var(--shadow-gold)">
          <span>Pay ${formatPrice(total)} Securely</span> →
        </button>

        <!-- Trust Badges Strip (Compact & Clean) -->
        <div style="display:flex;align-items:center;justify-content:center;gap:8px 12px;font-size:.66rem;color:var(--text-muted);padding-top:2px;flex-wrap:wrap;text-align:center">
          <span>🛡️ 100% Secure</span>
          <span>⚡ Instant Dispatch</span>
          <span>↩️ 2-Day Returns</span>
        </div>
      </form>
    </div>
  </div>`;

  const overlay = document.getElementById('checkout-overlay');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModals(); });
  const closeBtn = document.getElementById('checkout-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModals);

  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nm = document.getElementById('co-name')?.value.trim();
      const ph = document.getElementById('co-phone')?.value.trim();
      const em = document.getElementById('co-email')?.value.trim();
      const addr = document.getElementById('co-addr')?.value.trim();
      const city = document.getElementById('co-city')?.value.trim();
      const pin = document.getElementById('co-pincode')?.value.trim();
      const country = document.getElementById('co-country')?.value.trim() || 'India';

      if (!nm || !ph || !em || !addr || !city || !pin) {
        showToast('Please fill all mandatory address and contact fields.');
        return;
      }

      // Format clean full address string
      const fullDeliveryAddress = `${addr}, ${city} - ${pin}, ${country}`;

      // Update user state address in background if user is logged in
      if (state.user) {
        state.updateUserAddress(addr, city, pin, country);
      }

      const order = state.checkout({
        customerName: nm,
        email: em,
        phone: ph,
        address: fullDeliveryAddress
      });

      if (order) {
        closeModals();
        showToast(`Order #${order.id} placed successfully! 🎉`);
        navigate('profile');
      }
    });
  }
}

// ============================================================
// AUTH MODAL WITH SINGLE LOGIN SUPPORT FOR ADMIN & USERS
// ============================================================
function openAuthModal(initialView = 'login') {
  setModalBackgroundFreeze(true);
  state.isAuthOpen = true;
  renderAuthModalView(initialView);
}

function renderAuthModalView(view, extraData = {}) {
  const box = document.getElementById('modal-box');
  if (!box) return;

  if (view === 'login') {
    box.innerHTML = `
    <div class="modal-overlay open" id="auth-overlay">
      <div class="modal-card">
        <button class="modal-close-btn" id="auth-close-btn">${svgIcon('close',20)}</button>
        <div style="text-align:center;margin-bottom:24px">
          <div style="display:flex;justify-content:center;margin-bottom:12px">
            ${renderLogoSVG('var(--forest)', 36)}
          </div>
          <span class="badge badge-gold" style="margin-bottom:8px">Aurite Access Portal</span>
          <h2 style="font-family:var(--font-serif);color:var(--forest-dark)">Sign In</h2>
          <p style="font-size:.85rem;color:var(--text-muted);margin-top:6px">Access your orders, queries and clinical dashboard</p>
        </div>

        <div id="lg-error-alert" style="display:none" class="auth-error-alert"></div>

        <form id="login-form">
          <div class="form-group"><label class="form-label">Email or Mobile Number *</label><input type="text" id="lg-identifier" class="form-input" placeholder="alex@example.com or admin@aurite.com" required value=""></div>
          <div class="form-group"><label class="form-label">Password *</label><input type="password" id="lg-password" class="form-input" placeholder="••••••••" required value=""></div>
          <button type="submit" class="btn btn-gold btn-lg" style="width:100%;margin-top:8px">Sign In →</button>
          <div style="text-align:center;margin-top:16px;font-size:.85rem;color:var(--text-muted)">
            Don't have an account? <a href="#" id="goto-signup-btn" style="color:var(--forest-dark);font-weight:700">Create Account</a>
          </div>
        </form>
      </div>
    </div>`;

    bindAuthCommonEvents();

    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const iden = document.getElementById('lg-identifier')?.value.trim();
        const pass = document.getElementById('lg-password')?.value;
        
        const res = state.login(iden, pendingSignupUser?.name || 'Alex Mercer', pass);
        if (res.isAdmin) {
          showToast('Welcome to Admin Portal! 👑');
          closeModals();
          navigate('admin');
        } else {
          showToast(`Welcome back, ${state.user.name.split(' ')[0]}! 🎉`);
          closeModals();
          navigate('profile');
        }
      });
    }

    const gotoSignup = document.getElementById('goto-signup-btn');
    if (gotoSignup) gotoSignup.addEventListener('click', e => { e.preventDefault(); renderAuthModalView('signup'); });
  } else {
    let generatedPhoneOtp = null;
    let isOtpSent = false;

    box.innerHTML = `
    <div class="modal-overlay open" id="auth-overlay">
      <div class="modal-card">
        <button class="modal-close-btn" id="auth-close-btn">${svgIcon('close',20)}</button>
        <div style="text-align:center;margin-bottom:18px">
          <div style="display:flex;justify-content:center;margin-bottom:12px">
            ${renderLogoSVG('var(--forest)', 36)}
          </div>
          <span class="badge badge-gold" style="margin-bottom:8px">Aurite Registration</span>
          <h2 style="font-family:var(--font-serif);color:var(--forest-dark)">Create Account</h2>
          <p style="font-size:.85rem;color:var(--text-muted);margin-top:4px">Join Aurite for clinical nutraceutical access</p>
        </div>
        <form id="signup-form">
          <div class="form-group"><label class="form-label">Full Name *</label><input type="text" id="su-name" class="form-input" placeholder="e.g. Akash Sharma" required value=""></div>
          <div class="form-group"><label class="form-label">Email Address *</label><input type="email" id="su-email" class="form-input" placeholder="akash@example.com" required value=""></div>
          <div class="form-group"><label class="form-label">Create Password *</label><input type="password" id="su-password" class="form-input" placeholder="••••••••" required value=""></div>
          
          <div class="form-group">
            <label class="form-label">Mobile Number (for OTP Verification) *</label>
            <div style="display:flex;gap:8px">
              <input type="tel" id="su-phone" class="form-input" placeholder="+91 98765 43210" required value="" style="flex:1">
              <button type="button" id="send-su-otp-btn" class="btn btn-sm btn-ghost" style="padding:0 14px;white-space:nowrap;font-size:.8rem;border-color:var(--forest);color:var(--forest);font-weight:700">Send OTP</button>
            </div>
          </div>

          <div id="su-otp-group" style="display:none;margin-bottom:16px;background:var(--sand);padding:14px;border-radius:var(--r-md);border:1px dashed var(--forest)">
            <label class="form-label" style="margin-bottom:4px">Enter 6-Digit Verification Code *</label>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="text" id="su-otp-input" class="form-input" placeholder="e.g. 482910" maxlength="6" style="letter-spacing:3px;font-weight:800;font-size:1.1rem;text-align:center">
              <span id="su-otp-status" style="font-size:.78rem;color:var(--forest);font-weight:700">Code Sent!</span>
            </div>
            <p style="font-size:.75rem;color:var(--text-muted);margin-top:6px">Demo OTP: <strong id="demo-otp-display" style="color:var(--gold)">482910</strong></p>
          </div>

          <button type="submit" id="su-submit-btn" class="btn btn-gold btn-lg" style="width:100%;margin-top:8px">Verify &amp; Register →</button>
          
          <div style="text-align:center;margin-top:16px;font-size:.85rem;color:var(--text-muted)">
            Already have an account? <a href="#" id="goto-login-btn" style="color:var(--forest-dark);font-weight:700">Sign In</a>
          </div>
        </form>
      </div>
    </div>`;

    bindAuthCommonEvents();

    const sendOtpBtn = document.getElementById('send-su-otp-btn');
    const otpGroup = document.getElementById('su-otp-group');
    const otpInput = document.getElementById('su-otp-input');
    const demoOtpSpan = document.getElementById('demo-otp-display');

    sendOtpBtn?.addEventListener('click', () => {
      const phone = document.getElementById('su-phone')?.value.trim();
      if (!phone) { showToast('Please enter a valid mobile number.'); return; }
      generatedPhoneOtp = String(Math.floor(100000 + Math.random() * 900000));
      isOtpSent = true;
      if (otpGroup) otpGroup.style.display = 'block';
      if (demoOtpSpan) demoOtpSpan.textContent = generatedPhoneOtp;
      if (otpInput) otpInput.value = generatedPhoneOtp;
      sendOtpBtn.textContent = 'Resend OTP';
      showToast(`Verification code sent to ${phone}: ${generatedPhoneOtp} 📱`);
    });

    const gotoLogin = document.getElementById('goto-login-btn');
    if (gotoLogin) gotoLogin.addEventListener('click', e => { e.preventDefault(); renderAuthModalView('login'); });

    const form = document.getElementById('signup-form');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (isOtpSent && generatedPhoneOtp) {
          const entered = otpInput?.value.trim();
          if (entered !== generatedPhoneOtp) {
            showToast('Invalid OTP entered. Please check the code.');
            return;
          }
        }
        const name = document.getElementById('su-name')?.value;
        const email = document.getElementById('su-email')?.value;
        const phone = document.getElementById('su-phone')?.value;
        state.login(email, name);
        if (state.user) state.user.phone = phone;
        showToast('Phone verified & registration successful! Welcome to Aurite 🎉');
        closeModals();
        navigate('profile');
      });
    }
  }
}

function bindAuthCommonEvents() {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModals(); });
  const closeBtn = document.getElementById('auth-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModals);
}

function closeModals() {
  const box = document.getElementById('modal-box');
  if (box) {
    box.innerHTML = '';
  }
  setModalBackgroundFreeze(false);
}


function scrollChatToBottom(target) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  requestAnimationFrame(() => {
    el.scrollTop = el.scrollHeight;
    setTimeout(() => { if (el) el.scrollTop = el.scrollHeight; }, 60);
  });
}

// ============================================================
// PAGES: HOMEPAGE (RESPONSIVE MOBILE & DESKTOP DESIGNS)
// ============================================================
let activeProcessStep = 1;
function renderHomeMobile() {
  const step = { num: 1, title: 'Ethical Botanical Sourcing', phase: 'Botanical Extraction & Cold Storage Phase', temp: '-12°C Cold Storage', param: '100% Organic Habitat', desc: 'Wild-harvested marine algae and organic botanicals extracted at peak potency from certified eco-refuges.' };

  return `
  <!-- HERO SECTION -->
  <section class="hero-section" id="hero-section" style="margin-bottom: 0 !important;">
    <canvas id="scroll-canvas" class="hero-canvas"></canvas>
    <div id="frame-loader" class="frame-loader"><div class="frame-loader-bar" id="frame-load-bar"></div></div>
    <div class="hero-overlay-content">
      <div class="hero-text-block animate-fade-in">
        <h1 class="hero-title-big">Science-Backed<br><span class="hero-title-accent">Better Health.</span></h1>
        <div class="hero-actions">
          <button class="btn btn-gold" data-route="shop">Shop Now</button>
          <button class="btn btn-ghost" data-route="science">Our Science →</button>
        </div>
      </div>
      <!-- Desktop Trust Strip (Shown only on desktop/laptop) -->
      <div class="hero-trust-strip desktop-only animate-fade-in" style="margin-top:24px">
        <div class="trust-chip">${svgIcon('shield',16)}<span>GMP Certified Facility</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">${svgIcon('check',16)}<span>100% 3rd-Party Tested</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">${svgIcon('truck',16)}<span>Cold-Chain Shipping ₹1,499+</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">★★★★★<span>4.9/5 Clinical Score</span></div>
      </div>
    </div>
  </section>

  <!-- METRICS BAR (Mobile only) — directly touches hero and products section with 0 margin -->
  <div class="mobile-only" style="background:var(--forest-dark); margin-top: 0 !important; margin-bottom: 0 !important;">
    <div class="container">
      <div class="home-metrics-strip">
        <div class="home-metric"><span class="home-metric-val">500+</span><span class="home-metric-lbl">Members</span></div>
        <div class="home-metric"><span class="home-metric-val">99.4%</span><span class="home-metric-lbl">Absorbed</span></div>
        <div class="home-metric"><span class="home-metric-val">100%</span><span class="home-metric-lbl">Lab Tested</span></div>
        <div class="home-metric"><span class="home-metric-val">4.9★</span><span class="home-metric-lbl">Rating</span></div>
      </div>
    </div>
  </div>

  <!-- 4-STAGE PRECISION STEPPER (Desktop Only) -->
  <section class="desktop-only section-padding" style="background:var(--sand);border-top:1px solid var(--sand-border);border-bottom:1px solid var(--sand-border)">
    <div class="container">
      <div class="section-header" style="text-align:center;max-width:700px;margin:0 auto 48px">
        <span class="badge badge-gold" style="margin-bottom:12px;border-radius:999px">Bio-Engineered Process</span>
        <h2 style="font-family:var(--font-serif);color:var(--forest-dark)">4-Stage Pharmaceutical Precision</h2>
        <p style="color:var(--text-muted);font-size:1rem;margin-top:8px">Every milligram passes through stringent clinical manufacturing stages before packaging.</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1.6fr;gap:36px;align-items:stretch">
        <div style="display:flex;flex-direction:column;gap:12px">
          ${[
            { num: 1, title: 'Ethical Botanical Sourcing', subtitle: 'Eco-Refuges & Wild Harvest' },
            { num: 2, title: 'Supercritical CO₂ Extraction', subtitle: 'Zero Chemical Solvents' },
            { num: 3, title: 'Enteric Micro-Shielding', subtitle: 'Gastric Acid Bypass Matrix' },
            { num: 4, title: 'ICP-MS Quadruple Audit', subtitle: 'Heavy Metal & Potency Purity' }
          ].map(s => `
            <button class="lab-step-btn ${s.num === 1 ? 'active' : ''}" data-step="${s.num}" style="display:flex;align-items:center;gap:16px;padding:18px 22px;border-radius:var(--r-lg);border:1.5px solid ${s.num === 1 ? 'var(--gold)' : 'var(--sand-border)'};background:${s.num === 1 ? 'var(--forest)' : 'var(--sand)'};color:${s.num === 1 ? '#fff' : 'var(--forest-dark)'};cursor:pointer;text-align:left;transition:all .3s ease">
              <span style="font-family:var(--font-serif);font-size:1.4rem;font-weight:800;opacity:0.85">0${s.num}</span>
              <div>
                <div style="font-weight:700;font-size:1rem">${s.title}</div>
                <div style="font-size:.82rem;opacity:0.75;margin-top:2px">${s.subtitle}</div>
              </div>
            </button>
          `).join('')}
        </div>

        <div style="background:var(--forest-dark);border-radius:var(--r-xl);padding:40px;color:var(--sand-light);display:flex;flex-direction:column;justify-content:space-between;box-shadow:var(--shadow-xl);border:1px solid rgba(197,160,89,.3)">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
              <span class="badge badge-gold" id="lab-step-badge" style="border-radius:999px">Step 01 Active</span>
              <span id="lab-step-phase" style="font-size:.78rem;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;font-weight:700">Botanical Extraction & Cold Storage Phase</span>
            </div>
            <h3 id="lab-step-title" style="font-family:var(--font-serif);font-size:1.8rem;color:#faf7f2;margin-bottom:16px">Ethical Botanical Sourcing</h3>
            <p id="lab-step-desc" style="color:rgba(250,247,242,.85);font-size:1rem;line-height:1.75;margin-bottom:32px">Wild-harvested marine algae and organic botanicals extracted at peak potency from certified eco-refuges.</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;padding-top:24px;border-top:1px solid rgba(255,255,255,.12)">
            <div>
              <div style="font-size:.75rem;text-transform:uppercase;color:var(--gold);font-weight:700;letter-spacing:.05em">Process Control</div>
              <div id="lab-metric-a" style="font-size:1.1rem;font-weight:800;color:#fff;margin-top:4px">-12°C Cold Storage</div>
            </div>
            <div>
              <div style="font-size:.75rem;text-transform:uppercase;color:var(--gold);font-weight:700;letter-spacing:.05em">Quality Benchmark</div>
              <div id="lab-metric-b" style="font-size:1.1rem;font-weight:800;color:#fff;margin-top:4px">100% Organic Habitat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PRODUCTS SECTION -->
  <section class="section-padding" style="background:var(--white); margin-top: 0 !important; padding-top: 28px !important;">
    <div class="container">
      <div class="home-section-label" style="display:flex;flex-direction:column;align-items:flex-start;gap:3px;margin-bottom:22px">
        <h2 class="home-section-title" style="font-family:var(--font-serif);font-size:1.18rem;font-weight:700;color:var(--forest-dark);margin:0;line-height:1.2">Our Products</h2>
        <span style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--gold);margin-top:2px;margin-bottom:4px">Daily Essentials</span>
      </div>
      <div class="products-grid" id="home-grid">${state.products.map(p=>renderProductCard(p)).join('')}</div>
      <div style="text-align:center; margin-top: 32px;">
        <button class="btn btn-outline" data-route="shop">Explore All Products →</button>
      </div>
    </div>
  </section>

  <!-- SCIENCE CALLOUT (Mobile Compact Version) -->
  <div class="mobile-only" style="background:var(--sand-light); padding: 32px 0; margin: 24px 0;">
    <div class="container">
      <div class="home-science-card animate-on-scroll">
        <div class="home-science-img">
          <img src="/images/science_capsule.jpg" alt="Science">
        </div>
        <div class="home-science-text">
          <span class="badge badge-gold" style="font-size:.58rem;padding:3px 8px;margin-bottom:8px;align-self:flex-start;border-radius:999px">Enteric Shield Tech</span>
          <h3 class="home-science-h3">Supplements that<br>actually absorb.</h3>
          <p class="home-science-p">Standard capsules lose 84% in stomach acid. Aurite releases 100% in your intestine.</p>
          <button class="btn btn-gold" style="font-size:.78rem;padding:8px 16px;margin-top:10px;align-self:flex-start;border-radius:999px" data-route="science">Learn More →</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SCIENCE & ABSORPTION BANNER (Desktop Rich Version) -->
  <section class="desktop-only section-padding" style="background:var(--sand-light)">
    <div class="container">
      <div class="science-banner animate-on-scroll">
        <div class="science-content">
          <span class="badge badge-gold" style="margin-bottom:14px;align-self:flex-start;border-radius:999px">Enteric Shield Technology</span>
          <h2 style="font-family:var(--font-serif);color:var(--sand-light);font-size:2.4rem;line-height:1.2;margin-bottom:18px">Engineered to Surpass Gastric Acid Destruction</h2>
          <p style="color:rgba(250,247,242,.85);font-size:1.05rem;line-height:1.7;margin-bottom:28px">Up to 84% of ordinary supplements degrade in stomach acid before reaching cellular pathways. Aurite uses nested enteric micro-spheres that activate only in the alkaline intestine.</p>
          <div style="display:flex;gap:16px">
            <button class="btn btn-gold" data-route="science">Explore Clinical Trials →</button>
          </div>
        </div>
        <div class="science-image-wrap">
          <img src="/images/science_capsule.jpg" alt="Aurite Enteric Capsule Technology">
        </div>
      </div>

      <!-- Desktop Metrics Strip -->
      <div class="metrics-row" style="margin-top:32px">
        <div class="metric-item">
          <div class="metric-value">99.4%</div>
          <div class="metric-label">Intestinal Bio-Delivery</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">0.00 PPM</div>
          <div class="metric-label">Heavy Metal Tolerances</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">100%</div>
          <div class="metric-label">Third-Party Lab Audited</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">4.9 / 5.0</div>
          <div class="metric-label">Clinical Practitioner Rating</div>
        </div>
      </div>
    </div>
  </section>

  <!-- REVIEWS SECTION -->
  <section class="section-padding" style="background:var(--white); padding: 40px 0 60px;">
    <div class="container">
      <div class="home-section-label" style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px">
        <div style="display:flex;flex-direction:column;gap:3px">
          <h2 class="home-section-title" style="font-family:var(--font-serif);font-size:1.18rem;font-weight:700;color:var(--forest-dark);margin:0;line-height:1.2">What Members Say</h2>
          <span style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--gold);margin-top:2px">Verified Member Reviews</span>
        </div>
        <span style="font-size:.78rem;color:var(--gold);font-weight:700;align-self:center">★★★★★ 4.9</span>
      </div>
      <div class="home-reviews-row">
        ${[
          { name: 'Dr. Priya Mehta', role: 'Cardiologist, Mumbai', avatar: 'PM', text: 'I recommend Aurite Omega-3 to my cardiac patients. The enteric-shielded delivery is the only way to guarantee EPA/DHA absorption past stomach acid. Exceptional clinical quality.', product: 'Omega-3 Ultra' },
          { name: 'Rajesh Khanna',  role: 'Competitive Athlete, Bangalore', avatar: 'RK', text: 'My recovery time dropped by nearly 30% after starting Magnesium Bisglycinate. Sleep quality went from 6 hours fitful to 7.5 hours deep sleep. The science is real.', product: 'Pure Magnesium' },
          { name: 'Ananya Sharma',  role: 'Wellness Coach, Delhi', avatar: 'AS', text: 'The Daily Greens formula completely changed my gut health journey. Bloating gone within 2 weeks. My clients now ask me which greens I use — I only recommend Aurite.', product: 'Daily Greens' },
        ].map(r => `
        <div class="home-review-card">
          <div class="home-review-top">
            <div class="home-review-avatar">${r.avatar}</div>
            <div style="flex:1;min-width:0">
              <div class="home-review-name">${r.name}</div>
              <div class="home-review-role">${r.role}</div>
            </div>
            <span style="color:var(--gold);font-size:.75rem">★★★★★</span>
          </div>
          <p class="home-review-text">"${r.text}"</p>
          <span class="badge badge-gold" style="font-size:.58rem;padding:3px 10px;align-self:flex-start;border-radius:999px">${r.product}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderHomeDesktop() {
  const labSteps = [
    { num: 1, title: 'Ethical Botanical Sourcing', phase: 'Botanical Extraction & Cold Storage Phase', temp: '-12°C Cold Storage', param: '100% Organic Habitat', desc: 'Wild-harvested marine algae and organic botanicals extracted at peak potency from certified eco-refuges.' },
    { num: 2, title: 'Supercritical CO₂ Extraction', phase: 'Supercritical CO₂ Molecular Separation Phase', temp: '31.1°C Critical Temp', param: '73.8 Bar Pressure', desc: 'Cold supercritical carbon dioxide isolates target bioactive compounds without thermal destruction or chemical solvents.' },
    { num: 3, title: 'Enteric Micro-Shielding', phase: 'Enteric Alginate Micro-Encapsulation Phase', temp: 'pH 1.5 Gastric Bypass', param: 'pH 7.4 Intestinal Release', desc: 'Patented alginate dual-capsule matrix shields sensitive probiotic strains and liposomal nutrients from stomach acid.' },
    { num: 4, title: 'ICP-MS Quadruple Audit', phase: 'ICP-MS Mass Spectrometry Quality Audit Phase', temp: '0.00 PPM Heavy Metals', param: 'ISO-17025 Certified', desc: 'Every production batch undergoes 4-stage mass spectrometry testing for heavy metals, microbial safety, and active purity.' }
  ];

  const step = labSteps[activeProcessStep - 1];

  return `
  <!-- HERO SECTION -->
  <section class="hero-section" id="hero-section">
    <canvas id="scroll-canvas" class="hero-canvas"></canvas>
    <div id="frame-loader" class="frame-loader"><div class="frame-loader-bar" id="frame-load-bar"></div></div>
    <div class="scroll-hint-overlay" id="scroll-hint">${svgIcon('arrow_dn',16)}<span>Scroll to explore</span></div>
    
    <div class="hero-overlay-content">
      <div class="hero-text-block animate-fade-in">
        <span class="badge badge-gold hero-badge">Science-Backed Nutraceuticals</span>
        <h1 class="hero-title-big">Start Your Journey To<br><span class="hero-title-accent">Better Health.</span></h1>
        <p class="hero-tagline">High-absorption nutraceuticals. Clinically engineered. Zero compromise.</p>
        
        <div class="hero-actions">
          <button class="btn btn-gold btn-lg" data-route="shop">Shop Formulations</button>
          <button class="btn btn-ghost btn-lg" data-route="science">Our Science →</button>
        </div>
      </div>
      <div class="hero-trust-strip animate-fade-in">
        <div class="trust-chip">${svgIcon('shield',16)}<span>GMP Certified</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">${svgIcon('check',16)}<span>100% Lab Tested</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">${svgIcon('truck',16)}<span>Free Shipping ₹1,499+</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">★★★★★<span>4.9 Rating</span></div>
      </div>
    </div>
  </section>

  <!-- PRODUCTS GRID -->
  <section class="section-padding" style="background:var(--white)">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <span class="badge badge-forest" style="margin-bottom:10px">Daily Essentials</span>
        <h2>Clinically Formulated For Every Cell.</h2>
        <p>Science-backed synbiotics, minerals, and lipid nutrients targeting cellular bio-available pathways.</p>
      </div>
      <div class="products-grid" id="home-grid">${state.products.map(p=>renderProductCard(p)).join('')}</div>
    </div>
  </section>

  <!-- IN-PLACE LAB PROCESS SECTION (NO FULL PAGE RELOAD) -->
  <section class="section-padding" style="background:var(--sand-light);border-top:1px solid var(--sand-border);border-bottom:1px solid var(--sand-border)">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <span class="badge badge-gold" style="margin-bottom:10px">Inside The Aurite Bio-Lab</span>
        <h2>How We Engineer Bio-Availability</h2>
        <p>Click through our 4-step formulation lifecycle to see real-time lab parameters and delivery technology.</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:36px;align-items:center;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-xl);padding:36px;box-shadow:var(--shadow-md)">
        <div>
          <div style="display:flex;flex-direction:column;gap:12px">
            ${labSteps.map(s => `
              <button class="lab-step-btn ${activeProcessStep===s.num?'active':''}" data-step="${s.num}" type="button" style="display:flex;align-items:center;gap:16px;padding:16px 20px;border-radius:var(--r-md);border:1px solid ${activeProcessStep===s.num?'var(--gold)':'var(--sand-border)'};background:${activeProcessStep===s.num?'var(--forest)':'var(--sand)'};color:${activeProcessStep===s.num?'#fff':'var(--forest-dark)'};cursor:pointer;transition:all 0.3s ease;text-align:left">
                <span style="font-family:var(--font-serif);font-weight:800;font-size:1.4rem;color:${activeProcessStep===s.num?'var(--gold)':'var(--text-light)'}">0${s.num}</span>
                <span style="font-weight:700;font-size:.95rem">${s.title}</span>
              </button>`).join('')}
          </div>
        </div>

        <div style="background:var(--forest-dark);color:var(--sand-light);padding:36px;border-radius:var(--r-lg);position:relative;overflow:hidden" id="lab-step-display">
          <span class="badge badge-gold" style="position:absolute;top:20px;right:20px" id="lab-step-badge">Step 0${step.num} Active</span>
          <h3 style="font-family:var(--font-serif);font-size:1.8rem;color:var(--sand-light);margin-bottom:4px" id="lab-step-title">${step.title}</h3>
          <div style="font-size:.85rem;color:var(--gold);font-weight:700;margin-bottom:14px" id="lab-step-phase">${step.phase}</div>
          <p style="color:rgba(250,247,242,.8);line-height:1.7;margin-bottom:24px;font-size:1rem" id="lab-step-desc">${step.desc}</p>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;border-top:1px solid rgba(255,255,255,0.15);padding-top:20px">
            <div>
              <div style="font-size:.75rem;color:var(--gold);text-transform:uppercase;font-weight:700">Lab Metric A</div>
              <div style="font-weight:800;font-size:1.1rem;margin-top:2px" id="lab-metric-a">${step.temp}</div>
            </div>
            <div>
              <div style="font-size:.75rem;color:var(--gold);text-transform:uppercase;font-weight:700">Lab Metric B</div>
              <div style="font-weight:800;font-size:1.1rem;margin-top:2px" id="lab-metric-b">${step.param}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SCIENCE BANNER -->
  <section class="section-padding" style="background:var(--sand)">
    <div class="container">
      <div class="science-banner animate-on-scroll">
        <div class="science-content">
          <span class="badge badge-gold" style="align-self:flex-start;margin-bottom:14px">Enteric Shield Tech</span>
          <h2>Most supplements fail to survive digestion. Aurite does.</h2>
          <p style="color:rgba(250,247,242,.75);line-height:1.7;margin-bottom:28px;font-size:1rem">Standard capsules dissolve in stomach acid, destroying up to 84% of active nutrients. Aurite's nested capsule shield releases 100% of compounds safely into the small intestine.</p>
          <button class="btn btn-gold btn-lg" data-route="science" style="align-self:flex-start">Learn Bio-Shield Tech →</button>
        </div>
        <div class="science-image-wrap"><img src="/images/science_capsule.jpg" alt="Aurite Science Capsule"></div>
      </div>
      <div class="metrics-row animate-on-scroll">
        <div class="metric-item"><div class="metric-value" data-count="500">0</div><div class="metric-label">Health Transformations</div></div>
        <div class="metric-item"><div class="metric-value" data-count="99.4">0</div><div class="metric-label">Stomach Acid Survival %</div></div>
        <div class="metric-item"><div class="metric-value" data-count="100">0</div><div class="metric-label">Third-Party Tested %</div></div>
        <div class="metric-item"><div class="metric-value" data-count="4.9">0</div><div class="metric-label">Customer Score / 5</div></div>
      </div>
    </div>
  </section>

  <!-- CUSTOMER TESTIMONIALS / FEEDBACK -->
  <section class="section-padding" style="background:var(--white)">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <span class="badge badge-forest" style="margin-bottom:10px">Real Transformations</span>
        <h2>What Our Members Say</h2>
        <p>Over 500+ members have transformed their health with Aurite science-backed formulations.</p>
      </div>
      <div class="products-grid" style="grid-template-columns:repeat(3,1fr)">
        ${[
          { name: 'Dr. Priya Mehta', role: 'Cardiologist, Mumbai', avatar: 'PM', rating: 5, text: 'I recommend Aurite Omega-3 to my cardiac patients. The enteric-shielded delivery is the only way to guarantee EPA/DHA absorption past stomach acid. Exceptional clinical quality.', product: 'Omega-3 Triple Strength' },
          { name: 'Rajesh Khanna', role: 'Competitive Athlete, Bangalore', avatar: 'RK', rating: 5, text: 'My recovery time dropped by nearly 30% after starting Magnesium Bisglycinate. Sleep quality went from 6 hours fitful to 7.5 hours deep sleep. The science is real.', product: 'Magnesium Complex' },
          { name: 'Ananya Sharma', role: 'Wellness Coach, Delhi', avatar: 'AS', rating: 5, text: 'The Daily Greens formula completely changed my gut health journey. Bloating gone within 2 weeks. My clients now ask me which greens I use — I only recommend Aurite.', product: 'Daily Wellness Greens' },
        ].map(r => `
        <div class="product-card" style="padding:28px;cursor:default">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--forest);color:var(--sand-light);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;flex-shrink:0">${r.avatar}</div>
            <div>
              <div style="font-weight:700;font-size:.95rem;color:var(--forest-dark)">${r.name}</div>
              <div style="font-size:.78rem;color:var(--text-muted)">${r.role}</div>
            </div>
          </div>
          <div style="color:var(--gold);font-size:1rem;margin-bottom:12px">★★★★★</div>
          <p style="font-size:.88rem;color:var(--text-muted);line-height:1.7;margin-bottom:14px;font-style:italic">"${r.text}"</p>
          <span class="badge badge-gold" style="font-size:.68rem">${r.product}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderHome() {
  return window.innerWidth >= 900 ? renderHomeDesktop() : renderHomeMobile();
}

// ============================================================
// PAGES: SHOP
// ============================================================
let activeCategory = 'All';
function renderShopMobile() {
  const cats = ['All', 'Vitality & Brain', 'Minerals & Sleep', 'Daily Greens & Gut'];
  const filtered = activeCategory === 'All' ? state.products : state.products.filter(p => p.category === activeCategory);
  return `
  <div class="shop-page-wrapper">
    <div class="container">
      <div style="text-align:center;max-width:680px;margin:0 auto 28px">
        <span class="badge badge-gold" style="margin-bottom:10px;font-size:.65rem;padding:4px 12px;border-radius:999px">Complete Catalog</span>
        <h1 style="font-family:var(--font-serif);color:var(--forest-dark);margin-bottom:8px;font-size:1.75rem;line-height:1.2">Shop Aurite Products</h1>
        <p style="color:var(--text-muted);font-size:.88rem;margin:0">Pure science-backed nutrients engineered for peak cellular absorption.</p>
      </div>

      <!-- FILTER ROW WITH CLEAN HIDDEN SCROLLBAR -->
      <div class="shop-filter-bar" style="margin: 28px 0 36px; padding-bottom: 18px; border-bottom: 1px solid var(--sand-border); display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
        <div class="filter-pills" style="display: flex; gap: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none; padding: 4px 2px 6px; max-width: 100%;">
          ${cats.map(c=>`<button class="filter-pill ${activeCategory===c?'active':''}" data-cat="${c}" style="flex-shrink:0;white-space:nowrap;font-size:.78rem;padding:7px 16px;border-radius:999px">${c}</button>`).join('')}
        </div>
        <div style="font-size:.78rem;font-weight:700;color:var(--text-muted);white-space:nowrap">${filtered.length} Products Available</div>
      </div>

      <!-- PRODUCTS GRID -->
      <div class="products-grid" id="shop-grid" style="margin-bottom: 48px;">${filtered.map(p=>renderProductCard(p)).join('')}</div>
    </div>
  </div>`;
}

function renderShopDesktop() {
  const cats = ['All', 'Vitality & Brain', 'Minerals & Sleep', 'Daily Greens & Gut'];
  const filtered = activeCategory === 'All' ? state.products : state.products.filter(p => p.category === activeCategory);
  return `
  <div class="container section-padding">
    <div style="text-align:center;max-width:680px;margin:0 auto 36px">
      <span class="badge badge-gold" style="margin-bottom:10px">All Formulations</span>
      <h1 style="font-family:var(--font-serif);color:var(--forest-dark);margin-bottom:12px">Shop Aurite Formulations</h1>
      <p style="color:var(--text-muted);font-size:1rem">Pure science-backed nutrients engineered for peak cellular absorption.</p>
    </div>
    <div class="shop-filter-bar">
      <div class="filter-pills">
        ${cats.map(c=>`<button class="filter-pill ${activeCategory===c?'active':''}" data-cat="${c}">${c}</button>`).join('')}
      </div>
      <div style="font-size:.85rem;font-weight:600;color:var(--text-muted)">${filtered.length} Formulations</div>
    </div>
    <div class="products-grid" id="shop-grid">${filtered.map(p=>renderProductCard(p)).join('')}</div>
  </div>`;
}

function renderShop() {
  return window.innerWidth >= 900 ? renderShopDesktop() : renderShopMobile();
}

// ============================================================
// PAGES: PRODUCT DETAIL
// ============================================================
function renderProductDetailMobile(pid) {
  const p = state.products.find(prod => prod.id === pid) || state.products[0];
  const isOutOfStock = (p.stockQty !== undefined && p.stockQty <= 0);
  const images = (p.images && p.images.length > 0) ? p.images : [p.image];
  const productReviews = (state.reviews || []).filter(r => r.productId === pid);
  const avgRating = productReviews.length > 0 ? (productReviews.reduce((s,r)=>s+r.rating,0)/productReviews.length).toFixed(1) : (p.rating || 4.9);
  const highlights = p.highlights || ['100% Lab Tested','Enteric Shielded','No Artificial Additives'];

  // Build star display dynamically
  const fullStars = Math.round(parseFloat(avgRating));
  const starDisplay = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

  return `
  <div style="width:100%;max-width:1000px;margin:0 auto;padding:68px 0 40px">
    <div style="padding:10px 16px 6px">
      <a data-route="shop" style="display:inline-flex;align-items:center;gap:6px;font-size:.78rem;font-weight:700;color:var(--forest);cursor:pointer;opacity:.85;transition:opacity .2s">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
        Back to Shop
      </a>
    </div>

    <div class="product-detail-hero" style="gap:20px">
      <!-- FULL BLEED EDGE-TO-EDGE IMAGE GALLERY -->
      <div style="display:flex;flex-direction:column;gap:8px">
        <div id="pd-main-img-wrap" style="background:#f4efe6;border-radius:0 !important;padding:0;display:flex;align-items:center;justify-content:center;border:none;overflow:hidden;position:relative;touch-action:pan-y;cursor:grab;aspect-ratio:1/1;width:100%;max-height:440px">
          <img id="pd-main-img" src="${images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;object-position:center center;display:block;transition:opacity .25s ease" onerror="this.src='${p.image}'">
        </div>
        ${images.length > 1 ? `
        <div style="display:flex;gap:6px;overflow-x:auto;padding:6px 16px" id="pd-thumb-strip">
          ${images.map((img, i) => `
          <div class="pd-thumb ${i===0?'active':''} " data-idx="${i}" style="flex-shrink:0;width:52px;height:52px;border-radius:0 !important;border:1.5px solid ${i===0?'var(--forest-dark)':'var(--sand-border)'};background:#f4efe6;overflow:hidden;cursor:pointer;transition:border-color .2s;display:flex;align-items:center;justify-content:center;padding:0">
            <img src="${img}" style="width:100%;height:100%;object-fit:cover;object-position:center" onerror="this.style.background='#f4efe6'">
          </div>`).join('')}
        </div>` : ''}
      </div>

      <!-- PRODUCT INFO (COMPACT WITH PADDING) -->
      <div style="padding:10px 16px 16px;display:flex;flex-direction:column">
        <span class="badge badge-gold" style="align-self:flex-start;font-size:.58rem;padding:2px 7px;border-radius:999px;margin-bottom:6px">${p.badge}</span>
        <h1 style="font-family:var(--font-serif);color:var(--forest-dark);margin-bottom:3px;font-size:1.25rem;line-height:1.25">${p.name}</h1>
        <p style="color:var(--gold);font-weight:600;font-size:.76rem;margin-bottom:8px">${p.tagline}</p>

        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
          <div style="color:#f59e0b;font-size:.82rem;letter-spacing:.5px">${starDisplay}</div>
          <span style="font-weight:700;color:var(--forest-dark);font-size:.76rem">${avgRating}</span>
          <span style="color:var(--text-muted);font-size:.70rem">(${productReviews.length || p.reviewsCount || 0} reviews)</span>
        </div>

        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px">
          <span style="font-size:1.15rem;font-weight:800;color:var(--forest-dark);letter-spacing:-0.3px">${formatPrice(p.price)}</span>
          <span style="font-size:.72rem;color:var(--text-light)">${p.servings}</span>
        </div>

        <p style="font-size:.78rem;color:var(--text-dark);line-height:1.55;margin-bottom:12px">${p.description}</p>

        <!-- HIGHLIGHTS -->
        <div style="background:linear-gradient(135deg,rgba(20,51,37,.04),rgba(197,160,89,.08));border:1px solid var(--sand-border);border-radius:var(--r-md);padding:10px 12px;margin-bottom:14px">
          <div style="font-weight:700;font-size:.68rem;color:var(--forest-dark);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Key Highlights</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${highlights.map(h => `<span style="display:inline-flex;align-items:center;gap:4px;background:var(--white);border:1px solid var(--sand-border);border-radius:999px;padding:3px 8px;font-size:.66rem;font-weight:600;color:var(--forest-dark)">
              <span style="color:var(--forest);font-weight:800">✓</span> ${h}
            </span>`).join('')}
          </div>
        </div>

        <!-- ADD TO CART -->
        <div style="margin-bottom:14px">
          ${isOutOfStock ?
            `<button class="btn btn-secondary" disabled style="width:100%;opacity:0.6;cursor:not-allowed;padding:10px;font-size:.82rem">Out of Stock</button>` :
            `<button class="btn btn-gold" id="detail-add-btn" style="width:100%;padding:10px 16px;font-size:.85rem;font-weight:700">Add To Cart — ${formatPrice(p.price)}</button>`
          }
        </div>

        <!-- TRUST BADGES -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${[['🚚','Free Shipping','₹1,499+'],['↩️','Easy Returns','2-day'],['🔬','Lab Tested','Certified'],['⚡','Fast Dispatch','24 hours']].map(([ic,t,s])=>`
          <div style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-sm)">
            <span style="font-size:.85rem">${ic}</span>
            <div><div style="font-size:.66rem;font-weight:700;color:var(--forest-dark);line-height:1.2">${t}</div><div style="font-size:.58rem;color:var(--text-muted);line-height:1.2">${s}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- BOTTOM DETAILS ROW (COMPACT) -->
    <div style="padding:0 16px;margin-top:16px;display:flex;flex-direction:column;gap:12px" class="product-bottom-grid">
      <!-- RETURN & REFUND POLICY -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--sand-border)">
          <span style="font-size:1rem">↩️</span>
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:.82rem;color:var(--forest-dark);margin:0">Returns &amp; Refund Policy</h3>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:.74rem;color:var(--text-dark);line-height:1.45">
          <div style="display:flex;gap:6px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div><strong>2-Day Window</strong> — Return if damaged, defective, or incorrect.</div></div>
          <div style="display:flex;gap:6px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div><strong>Full Refund</strong> — 5–7 days to original payment method.</div></div>
          <div style="display:flex;gap:6px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div>Contact <a href="mailto:returns@aurite.com" style="color:var(--forest);font-weight:700">returns@aurite.com</a> with order ID.</div></div>
        </div>
      </div>

      <!-- CUSTOMER SUPPORT -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--sand-border)">
          <span style="font-size:1rem">💬</span>
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:.82rem;color:var(--forest-dark);margin:0">Customer Support</h3>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:.74rem;color:var(--text-dark)">
          <div style="display:flex;gap:8px;align-items:center;padding:6px 8px;background:var(--sand-light);border-radius:var(--r-sm)">
            <span style="font-size:.9rem">📧</span>
            <div style="font-size:.72rem"><strong style="color:var(--forest-dark)">Email:</strong> <a href="mailto:support@aurite.com" style="color:var(--forest);font-weight:700">support@aurite.com</a></div>
          </div>
          <a data-route="contact" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:7px 10px;background:var(--forest);color:var(--sand-light);border-radius:var(--r-sm);font-weight:700;font-size:.72rem;cursor:pointer;text-decoration:none;margin-top:2px">
            Submit Support Query →
          </a>
        </div>
      </div>
    </div>

    <!-- CUSTOMER REVIEWS (COMPACT) -->
    <div style="padding:0 16px;margin:16px 0 28px">
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:14px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--sand-border)">
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:.85rem;color:var(--forest-dark);margin:0">Customer Reviews</h3>
          <div style="display:flex;align-items:center;gap:4px">
            <span style="color:#f59e0b;font-size:.80rem">${'★'.repeat(Math.round(parseFloat(avgRating)))}</span>
            <span style="font-weight:700;color:var(--forest-dark);font-size:.76rem">${avgRating}</span>
          </div>
        </div>
        ${productReviews.length > 0 ?
          `<div style="display:flex;flex-direction:column;gap:10px">
            ${productReviews.map(r => `
            <div style="padding-bottom:8px;border-bottom:1px solid var(--sand-border)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:22px;height:22px;border-radius:50%;background:var(--forest);color:var(--sand-light);display:flex;align-items:center;justify-content:center;font-size:.58rem;font-weight:700">${getInitials(r.customerName)}</div>
                  <div style="font-weight:700;color:var(--forest-dark);font-size:.76rem">${r.customerName}</div>
                </div>
                <span style="color:var(--text-muted);font-size:.62rem">${r.date}</span>
              </div>
              ${r.text ? `<p style="font-size:.72rem;color:var(--text-dark);line-height:1.4;margin:0;padding-left:28px">${r.text}</p>` : ''}
            </div>`).join('')}
          </div>` :
          `<p style="font-size:.74rem;color:var(--text-muted);font-style:italic;margin:0;text-align:center;padding:10px 0">No reviews yet. Be the first to review!</p>`
        }
      </div>
    </div>
  </div>`;
}

function renderProductDetailDesktop(pid) {
  const p = state.products.find(prod => prod.id === pid) || state.products[0];
  const isOutOfStock = (p.stockQty !== undefined && p.stockQty <= 0);
  const images = (p.images && p.images.length > 0) ? p.images : [p.image];
  const productReviews = (state.reviews || []).filter(r => r.productId === pid);
  const avgRating = productReviews.length > 0 ? (productReviews.reduce((s,r)=>s+r.rating,0)/productReviews.length).toFixed(1) : (p.rating || 4.9);
  const highlights = p.highlights || ['100% Lab Tested','Enteric Shielded','No Artificial Additives'];

  // Build star display dynamically
  const fullStars = Math.round(parseFloat(avgRating));
  const starDisplay = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

  return `
  <div class="container section-padding">
    <div style="margin-bottom:20px">
      <a data-route="shop" style="display:inline-flex;align-items:center;gap:6px;font-size:.9rem;font-weight:700;color:var(--forest);cursor:pointer;opacity:.8;transition:opacity .2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
        Back to Shop
      </a>
    </div>

    <div class="product-detail-hero" style="gap:48px">
      <!-- FULL-COVER IMAGE SHOWCASE (Mobile-style Cover Box, No Left/Right Arrow Buttons) -->
      <div style="display:flex;flex-direction:column;gap:12px">
        <div id="pd-main-img-wrap" style="background:#f4efe6;border-radius:var(--r-xl);padding:0;display:flex;align-items:center;justify-content:center;border:1px solid var(--sand-border);overflow:hidden;position:relative;touch-action:pan-y;cursor:grab;aspect-ratio:1/1;width:100%;max-height:520px;box-shadow:var(--shadow-md)">
          <img id="pd-main-img" src="${images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;object-position:center center;display:block;transition:opacity .25s ease" onerror="this.src='${p.image}'">
        </div>
        ${images.length > 1 ? `
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:4px" id="pd-thumb-strip">
          ${images.map((img, i) => `
            <div class="pd-thumb ${i===0?'active':''}" data-idx="${i}" style="width:72px;height:72px;border-radius:var(--r-md);border:2px solid ${i===0?'var(--forest-dark)':'var(--sand-border)'};overflow:hidden;cursor:pointer;flex-shrink:0;transition:border-color .2s;background:#f4efe6">
              <img src="${img}" alt="Thumbnail ${i+1}" style="width:100%;height:100%;object-fit:cover;display:block">
            </div>`).join('')}
        </div>` : ''}
      </div>

      <!-- PRODUCT INFO & BUY -->
      <div style="display:flex;flex-direction:column;gap:20px">
        <div>
          <div style="display:flex;gap:8px;margin-bottom:10px">
            <span class="badge badge-gold">${p.badge}</span>
            <span class="badge badge-forest">${p.category}</span>
          </div>
          <h1 style="font-family:var(--font-serif);font-size:2.2rem;color:var(--forest-dark);margin-bottom:8px">${p.name}</h1>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="color:var(--gold);font-size:1.1rem">${starDisplay}</div>
            <span style="font-weight:700;color:var(--forest-dark)">${avgRating}</span>
            <span style="color:var(--text-muted);font-size:.85rem">(${productReviews.length || p.reviewsCount || 0} reviews)</span>
          </div>
        </div>

        <p style="font-size:1rem;color:var(--text-muted);line-height:1.7">${p.longDesc || p.desc}</p>

        <!-- HIGHLIGHTS -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:18px">
          ${highlights.map(h => `
          <div style="display:flex;align-items:center;gap:8px;font-size:.85rem;font-weight:600;color:var(--forest-dark)">
            ${svgIcon('check',16)}<span>${h}</span>
          </div>`).join('')}
        </div>

        <!-- DOSAGE & SPEC -->
        <div style="display:flex;gap:16px;font-size:.82rem;color:var(--text-muted);background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px 16px">
          <div><strong style="color:var(--forest-dark)">Dosage:</strong> ${p.dosage || '2 capsules daily'}</div>
          <div>&bull;</div>
          <div><strong style="color:var(--forest-dark)">Form:</strong> ${p.form || 'Enteric Shielded'}</div>
          <div>&bull;</div>
          <div><strong style="color:var(--forest-dark)">Supply:</strong> ${p.supply || '30-Day'}</div>
        </div>

        <!-- PURCHASE OPTIONS -->
        <div style="display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;align-items:baseline;gap:12px">
            <span style="font-size:2rem;font-weight:800;color:var(--forest-dark)">${formatPrice(p.price)}</span>
            <span style="font-size:.85rem;color:var(--gold);font-weight:600">Free cold-chain delivery ₹1,499+</span>
          </div>
          ${isOutOfStock ?
            `<button class="btn btn-secondary btn-lg" disabled style="width:100%;opacity:0.6;cursor:not-allowed">Out of Stock</button>` :
            `<button class="btn btn-gold btn-lg" id="detail-add-btn" style="width:100%">Add To Cart — ${formatPrice(p.price)}</button>`
          }
        </div>

        <!-- TRUST BADGES -->
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          ${[['🚚','Free Shipping','on orders above ₹1,499'],['↩️','Easy Returns','2-day hassle-free'],['🔬','Lab Tested','3rd party verified'],['⚡','Fast Dispatch','Ships in 24 hours']].map(([ic,t,s])=>`
          <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-md);flex:1;min-width:120px">
            <span style="font-size:1.1rem">${ic}</span>
            <div><div style="font-size:.75rem;font-weight:700;color:var(--forest-dark)">${t}</div><div style="font-size:.68rem;color:var(--text-muted)">${s}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- BOTTOM DETAILS ROW -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:40px" class="product-bottom-grid">

      <!-- RETURN & REFUND POLICY -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--sand-border)">
          <span style="font-size:1.4rem">↩️</span>
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:1rem;color:var(--forest-dark);margin:0">Returns &amp; Refund Policy</h3>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;font-size:.85rem;color:var(--text-dark);line-height:1.6">
          <div style="display:flex;gap:10px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div><strong>2-Day Return & Exchange Window</strong> — You can raise a return or exchange request within 2 days (48 hours) of delivery if the product is damaged, defective, or incorrect.</div></div>
          <div style="display:flex;gap:10px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div><strong>Full Refund / Replacement</strong> — Refunds are processed within 5–7 business days to your original payment method after inspection.</div></div>
          <div style="display:flex;gap:10px"><span style="color:#f59e0b;font-weight:700;flex-shrink:0">⚠</span><div><strong>Non-Returnable</strong> — Opened or used products cannot be returned due to health &amp; safety regulations, unless defective.</div></div>
          <div style="display:flex;gap:10px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div>To initiate a return or exchange, raise a request directly from your <strong>Order History</strong> in your Profile.</div></div>
        </div>
      </div>

      <!-- CUSTOMER SUPPORT -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--sand-border)">
          <span style="font-size:1.4rem">💬</span>
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:1rem;color:var(--forest-dark);margin:0">Customer Support</h3>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;font-size:.85rem;color:var(--text-dark);">
          <div style="display:flex;gap:12px;align-items:flex-start;padding:14px 16px;background:var(--sand-light);border-radius:var(--r-md);border:1px solid var(--sand-border)">
            <span style="font-size:1.3rem">📧</span>
            <div><div style="font-weight:700;color:var(--forest-dark);margin-bottom:2px">Email Support</div><div style="color:var(--text-muted);font-size:.8rem;margin-bottom:4px">Dedicated clinical assistance · Response within 24 hours</div><a href="mailto:support@aurite.com" style="color:var(--forest);font-weight:700">support@aurite.com</a></div>
          </div>
          <a data-route="contact" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 18px;background:var(--forest);color:var(--sand-light);border-radius:var(--r-md);font-weight:700;font-size:.88rem;cursor:pointer;text-decoration:none">
            Submit a Support Query →
          </a>
        </div>
      </div>
    </div>

    <!-- CUSTOMER REVIEWS -->
    <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:28px;margin-top:24px;box-shadow:var(--shadow-sm)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--sand-border)">
        <div>
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:1.05rem;color:var(--forest-dark);margin:0 0 4px">Customer Reviews</h3>
          <div style="display:flex;align-items:center;gap:6px">
            <div style="color:#f59e0b;font-size:1rem">${'★'.repeat(Math.round(parseFloat(avgRating)))}${'☆'.repeat(5-Math.round(parseFloat(avgRating)))}</div>
            <span style="font-weight:700;color:var(--forest-dark)">${avgRating}</span>
            <span style="color:var(--text-muted);font-size:.82rem">out of 5 · ${productReviews.length || p.reviewsCount || 0} reviews</span>
          </div>
        </div>
      </div>

      ${productReviews.length > 0 ?
        `<div style="display:flex;flex-direction:column;gap:20px">
          ${productReviews.map(r => `
          <div style="padding-bottom:20px;border-bottom:1px solid var(--sand-border)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:36px;height:36px;border-radius:50%;background:var(--forest);color:var(--sand-light);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0">${getInitials(r.customerName)}</div>
                <div>
                  <div style="font-weight:700;color:var(--forest-dark);font-size:.9rem">${r.customerName}</div>
                  <div style="color:#f59e0b;font-size:.9rem;margin-top:2px">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                </div>
              </div>
              <span style="color:var(--text-muted);font-size:.75rem;flex-shrink:0">${r.date}</span>
            </div>
            ${r.text ? `<p style="font-size:.88rem;color:var(--text-dark);line-height:1.65;margin:0;padding-left:46px">${r.text}</p>` : ''}
          </div>`).join('')}
        </div>` :
        `<div style="text-align:center;padding:40px 0;color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:10px">⭐</div>
          <p style="font-size:.9rem;font-style:italic">No reviews yet. Be the first to review this product after purchasing!</p>
        </div>`
      }
    </div>
  </div>`;
}

function renderProductDetail(pid) {
  return window.innerWidth >= 900 ? renderProductDetailDesktop(pid) : renderProductDetailMobile(pid);
}


function bindProductDetailEvents(pid) {
  const addBtn = document.getElementById('detail-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const p = state.products.find(prod => prod.id === pid);
      if (p) {
        state.addToCart(p, 'one-time', 1);
        showToast(`${p.name} added to cart! 🎉`);
      }
    });
  }

  // Image gallery with swipe and thumbnail clicks
  const p = state.products.find(prod => prod.id === pid) || state.products[0];
  const images = (p.images && p.images.length > 0) ? p.images : [p.image];
  if (images.length <= 1) return;

  let currentIdx = 0;

  function setImage(idx) {
    idx = (idx + images.length) % images.length;
    currentIdx = idx;
    const mainImg = document.getElementById('pd-main-img');
    if (mainImg) {
      mainImg.style.opacity = '0';
      setTimeout(() => { mainImg.src = images[idx]; mainImg.style.opacity = '1'; }, 150);
    }
    document.querySelectorAll('.pd-thumb').forEach((t, i) => {
      t.style.borderColor = i === idx ? 'var(--forest-dark)' : 'var(--sand-border)';
      t.classList.toggle('active', i === idx);
    });
  }

  document.getElementById('pd-prev-btn')?.addEventListener('click', () => setImage(currentIdx - 1));
  document.getElementById('pd-next-btn')?.addEventListener('click', () => setImage(currentIdx + 1));

  document.querySelectorAll('.pd-thumb').forEach((thumb, i) => {
    thumb.addEventListener('click', () => setImage(i));
  });

  // Touch swipe support
  const wrap = document.getElementById('pd-main-img-wrap');
  if (wrap) {
    let startX = 0;
    wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? setImage(currentIdx + 1) : setImage(currentIdx - 1);
    }, { passive: true });
    // Mouse drag swipe
    let mouseDown = false, mouseStartX = 0;
    wrap.addEventListener('mousedown', e => { mouseDown = true; mouseStartX = e.clientX; wrap.style.cursor='grabbing'; });
    wrap.addEventListener('mouseleave', () => { mouseDown = false; wrap.style.cursor='grab'; });
    wrap.addEventListener('mouseup', e => {
      if (!mouseDown) return;
      mouseDown = false;
      wrap.style.cursor = 'grab';
      const diff = mouseStartX - e.clientX;
      if (Math.abs(diff) > 40) diff > 0 ? setImage(currentIdx + 1) : setImage(currentIdx - 1);
    });
  }
}


// ============================================================
// PAGES: SCIENCE
// ============================================================
function renderScienceMobile() {
  return `
  <div style="padding-top:80px;padding-bottom:48px;">
    <div class="container">

      <!-- Hero intro -->
      <div style="text-align:center;max-width:480px;margin:0 auto 24px;padding:0 8px">
        <span class="badge badge-gold" style="margin-bottom:6px;font-size:.56rem;padding:2px 8px">Innovation</span>
        <h1 style="font-family:var(--font-serif);font-size:1.22rem;font-weight:700;color:var(--forest-dark);margin-bottom:6px;line-height:1.28">The Science of<br>Bio-Availability</h1>
        <p style="color:var(--text-muted);font-size:.78rem;line-height:1.5;max-width:340px;margin:0 auto">Why standard supplements fail, and how Aurite's delivery system guarantees cellular absorption.</p>
      </div>

      <!-- Encapsulation -->
      <div style="display:grid;grid-template-columns:1fr;gap:16px;margin-bottom:28px" class="science-page-grid">
        <div style="order:2;border-radius:var(--r-xl);overflow:hidden" class="science-image-wrap">
          <img src="/images/science_capsule.jpg" alt="Capsule Absorption" style="border-radius:var(--r-xl) !important;width:100%;object-fit:cover;max-height:220px;box-shadow:var(--shadow-md);display:block">
        </div>
        <div style="order:1">
          <span class="badge badge-forest" style="margin-bottom:6px;font-size:.54rem;padding:2px 8px">Digestive Bypass</span>
          <h2 style="font-family:var(--font-serif);font-size:1.1rem;font-weight:700;color:var(--forest-dark);margin-bottom:6px;line-height:1.28">Acid-Resistant<br>Micro-Encapsulation</h2>
          <p style="color:var(--text-muted);font-size:.78rem;line-height:1.55;margin-bottom:6px">The human stomach secretes acid at pH 1.5–2.0. Standard gel caps disintegrate in 15 minutes, destroying nutrients before absorption.</p>
          <p style="color:var(--text-muted);font-size:.78rem;line-height:1.55">Aurite's alginate matrix dissolves only at the alkaline pH 7.4 environment of the lower GI tract — maximising delivery.</p>
        </div>
      </div>

      <!-- Research stats — dark card -->
      <div style="background:var(--forest-dark);border-radius:var(--r-xl);padding:24px 20px;margin-bottom:28px">
        <div style="text-align:center;margin-bottom:20px">
          <span class="badge badge-gold" style="margin-bottom:6px;font-size:.6rem">Research</span>
          <p style="font-family:var(--font-serif);font-size:1rem;color:var(--sand-light);margin:0">Backed by Peer-Reviewed Science</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:12px">
          ${[
            { icon: '🧬', title: 'Liposomal Omega-3', stat: '340% Higher Bioavailability', desc: 'Nano-encapsulated EPA/DHA outperforms standard fish oil by 3.4× in 2023 JAMA Cardiology trial.' },
            { icon: '⚗️', title: 'Bisglycinate Chelation', stat: '67% Faster Absorption', desc: 'Glycine-chelated magnesium bypasses intestinal transporters, eliminating competitive absorption loss.' },
            { icon: '🌱', title: 'Synbiotic Matrix', stat: '89% Strain Survival', desc: 'Multi-strain probiotic achieves 89% cecal delivery vs 12% for standard powder.' },
          ].map(s => `
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:var(--r-md);padding:16px;display:flex;gap:14px;align-items:flex-start">
            <span style="font-size:1.5rem;flex-shrink:0">${s.icon}</span>
            <div>
              <div style="font-size:.7rem;color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">${s.title}</div>
              <div style="font-family:var(--font-serif);font-size:.95rem;color:var(--sand-light);margin-bottom:4px">${s.stat}</div>
              <p style="font-size:.78rem;color:rgba(250,247,242,.65);line-height:1.55;margin:0">${s.desc}</p>
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Certifications -->
      <div style="margin-bottom:28px">
        <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);text-align:center;margin-bottom:14px">Facility Certifications</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${[
            { cert: 'GMP', full: 'Good Manufacturing Practice', desc: 'ISO 22716 certified facility with continuous air filtration.' },
            { cert: 'ISO-17025', full: 'Lab Accreditation', desc: 'Accredited for trace mineral and bioactive compound analysis.' },
            { cert: 'FSSAI', full: 'Food Safety Standards', desc: 'Fully licensed with annual facility audits.' },
            { cert: 'COA', full: 'Certificate of Analysis', desc: '3rd-party COA covering potency, purity and microbial safety.' },
          ].map(c => `
          <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:14px;text-align:center;box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-serif);font-size:1.2rem;font-weight:700;color:var(--forest-dark);margin-bottom:2px">${c.cert}</div>
            <div style="font-size:.62rem;font-weight:700;text-transform:uppercase;color:var(--gold);letter-spacing:.05em;margin-bottom:6px">${c.full}</div>
            <p style="font-size:.72rem;color:var(--text-muted);line-height:1.5;margin:0">${c.desc}</p>
          </div>`).join('')}
        </div>
      </div>

      <!-- No nasties -->
      <div style="background:var(--sand);border-radius:var(--r-xl);padding:20px 18px">
        <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);text-align:center;margin-bottom:4px">What We Never Put In</p>
        <p style="font-size:.76rem;color:var(--text-muted);text-align:center;margin-bottom:14px">Strict prohibited ingredient list across all products.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${['Artificial Colors','Magnesium Stearate','Titanium Dioxide','GMO Ingredients','Sodium Benzoate','Silicon Dioxide'].map(i => `
          <div style="display:flex;align-items:center;gap:10px;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:10px 12px;box-shadow:var(--shadow-sm)">
            <span style="width:24px;height:24px;border-radius:50%;background:rgba(239,68,68,0.12);color:var(--error);display:flex;align-items:center;justify-content:center;font-size:.84rem;font-weight:800;flex-shrink:0;line-height:1">✗</span>
            <span style="font-size:.76rem;font-weight:600;color:var(--forest-dark)">${i}</span>
          </div>`).join('')}
        </div>
      </div>

    </div>
  </div>`;
}

function renderScienceDesktop() {
  return `
  <div class="container section-padding">
    <div style="text-align:center; max-width:760px; margin:0 auto 56px auto;">
      <span class="badge badge-forest" style="margin-bottom:12px;">Molecular Innovation</span>
      <h1 style="font-family:var(--font-serif); font-size:3rem; color:var(--forest-dark); margin-bottom:16px;">
        The Science of Bio-Availability
      </h1>
      <p style="color:var(--text-muted); font-size:1.1rem; line-height:1.7;">
        Why standard supplements fail, and how Aurite's patent-pending delivery system guarantees cellular absorption.
      </p>
    </div>

    <!-- Acid-Resistant Micro-Encapsulation Grid -->
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:48px; align-items:center; margin-bottom:64px;" class="science-page-grid">
      <div>
        <span class="badge badge-gold" style="margin-bottom:12px;">Enteric Shield Tech</span>
        <h2 style="font-family:var(--font-serif); font-size:2.2rem; color:var(--forest-dark); margin-bottom:16px;">
          Acid-Resistant Micro-Encapsulation
        </h2>
        <p style="color:var(--text-muted); line-height:1.7; margin-bottom:20px; font-size:1.02rem">
          The human stomach secretes hydrochloric acid at a pH of 1.5 to 2.0. Standard gelatin capsules disintegrate within 15 minutes, exposing sensitive probiotics, enzymes, and delicate lipids to destruction.
        </p>
        <p style="color:var(--text-muted); line-height:1.7; font-size:1.02rem">
          Aurite utilizes a natural alginate-derived matrix that remains completely intact through stomach passage, dissolving smoothly only when exposed to the alkaline pH 7.4 environment of the lower GI tract.
        </p>
      </div>

      <div>
        <img src="/images/science_capsule.jpg" alt="Science Bio Capsule" style="width:100%; border-radius:var(--r-xl); box-shadow:var(--shadow-lg); border:1px solid var(--sand-border)">
      </div>
    </div>

    <!-- 3 Delivery Research Breakthroughs (Dark Luxury Card) -->
    <div style="background:var(--forest-dark); border-radius:var(--r-xl); padding:40px; margin-bottom:64px; color:var(--sand-light)">
      <div style="text-align:center; max-width:680px; margin:0 auto 32px">
        <span class="badge badge-gold" style="margin-bottom:10px">Clinical Research</span>
        <h3 style="font-family:var(--font-serif); font-size:2rem; color:var(--sand-light); margin-bottom:8px">Delivery Breakthroughs</h3>
        <p style="color:rgba(250,247,242,.75); font-size:.95rem">Proven bio-availability gains confirmed through peer-reviewed human clinical trials.</p>
      </div>

      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:24px">
        ${[
          { icon: '🧬', title: 'Liposomal Omega-3', stat: '340% Higher Bioavailability', desc: 'Nano-encapsulated EPA/DHA outperforms standard fish oil by 3.4× in 2023 JAMA Cardiology trial.' },
          { icon: '⚗️', title: 'Bisglycinate Chelation', stat: '67% Faster Absorption', desc: 'Glycine-chelated magnesium bypasses intestinal transporters, eliminating competitive absorption loss.' },
          { icon: '🌱', title: 'Synbiotic Matrix', stat: '89% Strain Survival', desc: 'Multi-strain probiotic achieves 89% cecal delivery vs 12% for standard powder.' },
        ].map(s => `
        <div class="science-research-card" style="background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12); border-radius:var(--r-lg); padding:24px; display:flex; flex-direction:column; gap:12px; cursor:default">
          <span style="font-size:2rem">${s.icon}</span>
          <div style="font-size:.78rem; color:var(--gold); font-weight:700; text-transform:uppercase; letter-spacing:.06em">${s.title}</div>
          <div style="font-family:var(--font-serif); font-size:1.2rem; color:var(--sand-light); font-weight:700">${s.stat}</div>
          <p style="font-size:.88rem; color:rgba(250,247,242,.7); line-height:1.6; margin:0">${s.desc}</p>
        </div>`).join('')}
      </div>
    </div>

    <!-- Facility Certifications (4-column Grid) -->
    <div style="margin-bottom:64px">
      <div style="text-align:center; margin-bottom:32px">
        <span class="badge badge-forest" style="margin-bottom:8px">Purity Standards</span>
        <h3 style="font-family:var(--font-serif); font-size:2rem; color:var(--forest-dark); margin:0">Facility Certifications &amp; Auditing</h3>
      </div>
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:20px">
        ${[
          { cert: 'GMP', full: 'Good Manufacturing Practice', desc: 'ISO 22716 certified facility with continuous HEPA air filtration and cleanroom isolation.' },
          { cert: 'ISO-17025', full: 'Lab Accreditation', desc: 'Accredited for trace mineral, heavy metals, and bioactive compound potency analysis.' },
          { cert: 'FSSAI', full: 'Food Safety Standards', desc: 'Fully licensed with strict continuous batch surveillance and annual facility audits.' },
          { cert: 'COA', full: 'Certificate of Analysis', desc: 'Every SKU backed by public 3rd-party COA verifying potency, purity and zero pathogens.' },
        ].map(c => `
        <div class="science-cert-card" style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:24px; text-align:center; box-shadow:var(--shadow-sm); cursor:default">
          <div style="font-family:var(--font-serif); font-size:1.8rem; font-weight:800; color:var(--forest-dark); margin-bottom:4px">${c.cert}</div>
          <div style="font-size:.72rem; font-weight:700; text-transform:uppercase; color:var(--gold); letter-spacing:.05em; margin-bottom:10px">${c.full}</div>
          <p style="font-size:.82rem; color:var(--text-muted); line-height:1.55; margin:0">${c.desc}</p>
        </div>`).join('')}
      </div>
    </div>

    <!-- What We Never Put In (Prohibited List) -->
    <div style="background:var(--sand-light); border:1px solid var(--sand-border); border-radius:var(--r-xl); padding:36px 40px; margin-bottom:64px">
      <div style="text-align:center; max-width:620px; margin:0 auto 24px">
        <h3 style="font-family:var(--font-serif); font-size:1.8rem; color:var(--forest-dark); margin-bottom:6px">What We Never Put In</h3>
        <p style="font-size:.9rem; color:var(--text-muted); margin:0">Strict prohibited ingredient list maintained across all Aurite formulations.</p>
      </div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:14px">
        ${['Artificial Colors & Dyes','Magnesium Stearate','Titanium Dioxide','GMO Ingredients','Sodium Benzoate Preservatives','Silicon Dioxide Flow Agents'].map(i => `
        <div class="science-prohibited-card" style="display:flex; align-items:center; gap:12px; background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-md); padding:14px 18px; box-shadow:var(--shadow-sm); cursor:default">
          <span style="width:28px;height:28px;border-radius:50%;background:rgba(239,68,68,0.12);color:var(--error);display:flex;align-items:center;justify-content:center;font-size:.95rem;font-weight:800;flex-shrink:0;line-height:1">✗</span>
          <span style="font-size:.9rem; font-weight:700; color:var(--forest-dark)">${i}</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- Clinical Standards Comparison Table -->
    <div style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-xl); padding:40px; box-shadow:var(--shadow-md);">
      <h3 style="font-family:var(--font-serif); text-align:center; font-size:2rem; margin-bottom:32px; color:var(--forest-dark)">Clinical Standards Comparison</h3>
      
      <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.95rem;">
        <thead>
          <tr style="border-bottom:2px solid var(--forest-dark);">
            <th style="padding:16px;">Quality Metric</th>
            <th style="padding:16px; color:var(--forest); font-weight:700;">Aurite Standards</th>
            <th style="padding:16px; color:var(--text-light);">Generic Store Brands</th>
          </tr>
        </thead>
        <tbody>
          <tr class="science-table-row" style="border-bottom:1px solid var(--sand-border);">
            <td style="padding:16px; font-weight:600;">Stomach Acid Survival</td>
            <td style="padding:16px; color:var(--forest); font-weight:700;">✓ 99.4% Survival Guaranteed</td>
            <td style="padding:16px; color:var(--error);">✗ &lt; 16% Active Compound Survival</td>
          </tr>
          <tr class="science-table-row" style="border-bottom:1px solid var(--sand-border);">
            <td style="padding:16px; font-weight:600;">Heavy Metal Screening</td>
            <td style="padding:16px; color:var(--forest); font-weight:700;">✓ Quadruple ICP-MS Tested</td>
            <td style="padding:16px; color:var(--text-light);">Basic Batch Testing</td>
          </tr>
          <tr class="science-table-row" style="border-bottom:1px solid var(--sand-border);">
            <td style="padding:16px; font-weight:600;">Fish Oil Oxidation (TOTOX)</td>
            <td style="padding:16px; color:var(--forest); font-weight:700;">✓ Ultra-fresh TOTOX &lt; 5</td>
            <td style="padding:16px; color:var(--error);">TOTOX &gt; 26 (Rancid Smell)</td>
          </tr>
          <tr class="science-table-row">
            <td style="padding:16px; font-weight:600;">Synthetic Binders / Fillers</td>
            <td style="padding:16px; color:var(--forest); font-weight:700;">✓ Zero Artificial Fillers</td>
            <td style="padding:16px; color:var(--text-light);">Magnesium Stearate &amp; Silicon Dioxide</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderScience() {
  return window.innerWidth >= 900 ? renderScienceDesktop() : renderScienceMobile();
}

// ============================================================
// PAGES: ABOUT
// ============================================================
function renderAboutMobile() {
  return `
  <div style="padding-top:80px;padding-bottom:48px;">
    <div class="container">

      <!-- Hero intro -->
      <div style="text-align:center;max-width:560px;margin:0 auto 28px">
        <span class="badge badge-gold" style="margin-bottom:8px;font-size:.62rem">Our Mission</span>
        <h1 style="font-family:var(--font-serif);font-size:1.45rem;color:var(--forest-dark);margin-bottom:8px;line-height:1.25">Empowering Human Longevity</h1>
        <p style="color:var(--text-muted);font-size:.82rem;line-height:1.6">Founded to eliminate marketing fluff and engineer supplements that deliver measurable biological results.</p>
      </div>

      <!-- Three pillars -->
      <div style="display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:28px">
        ${[
          {t:'Clinical Efficacy', d:'Every compound is supported by double-blind human clinical trials.', icon:'award'},
          {t:'Radical Transparency', d:'Full-disclosure labeling with exact milligram amounts and published COA.', icon:'shield'},
          {t:'Earth Stewardship', d:'Friend of the Sea certified sourcing & 100% recyclable glass containers.', icon:'leaf'},
        ].map(v=>`
        <div style="display:flex;gap:14px;align-items:flex-start;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:16px;box-shadow:var(--shadow-sm)">
          <div style="width:38px;height:38px;border-radius:var(--r-md);background:var(--gold-light);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--forest-dark)">${svgIcon(v.icon,18)}</div>
          <div>
            <div style="font-weight:700;font-size:.88rem;color:var(--forest-dark);margin-bottom:3px">${v.t}</div>
            <p style="font-size:.78rem;color:var(--text-muted);line-height:1.55;margin:0">${v.d}</p>
          </div>
        </div>`).join('')}
      </div>

      <!-- Origin story -->
      <div style="background:var(--forest-dark);border-radius:var(--r-xl);padding:22px 18px;margin-bottom:24px;color:var(--sand-light)">
        <span class="badge badge-gold" style="margin-bottom:10px;font-size:.6rem">Founded 2024</span>
        <p style="font-family:var(--font-serif);font-size:1rem;color:var(--sand-light);margin-bottom:10px;line-height:1.3">Born From Frustration With Broken Industry Standards</p>
        <p style="font-size:.8rem;color:rgba(250,247,242,.8);line-height:1.6;margin-bottom:10px">After a decade of clinical research, our founders found 79% of bestselling brands used inferior ingredients, underdosed beyond therapeutic thresholds, and hid fillers.</p>
        <p style="font-size:.8rem;color:rgba(250,247,242,.8);line-height:1.6;margin:0">Aurite was built from scratch — starting with manufacturing, then working backwards to ingredients, dosing, and finally branding.</p>
      </div>

      <!-- Timeline -->
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px">
        ${[
          { year: '2022', event: 'R&D Phase', desc: '3 years of sourcing research across 14 countries. Final shortlist: 6 suppliers above 99.8% COA compliance.' },
          { year: '2024', event: 'GMP Facility', desc: 'GMP facility in Pune commissioned with inline mass spectrometry quality auditing.' },
          { year: '2025', event: 'First Launch', desc: 'Omega-3 & Magnesium launched. 94% of early customers reported measurable effects within 28 days.' },
          { year: '2026', event: 'Clinical Expansion', desc: 'Synbiotic blend added. Partnerships with 12 leading cardiologists and GPs initiated.' },
        ].map(e => `
        <div style="display:flex;gap:14px;align-items:flex-start">
          <div style="flex-shrink:0;width:52px;height:52px;border-radius:var(--r-md);background:var(--gold-light);border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:var(--font-serif);font-weight:700;color:var(--forest-dark);font-size:.78rem">${e.year}</div>
          <div>
            <div style="font-weight:700;font-size:.85rem;color:var(--forest-dark);margin-bottom:2px">${e.event}</div>
            <p style="font-size:.76rem;color:var(--text-muted);line-height:1.55;margin:0">${e.desc}</p>
          </div>
        </div>`).join('')}
      </div>

      <!-- Stats grid -->
      <div style="background:var(--sand);border-radius:var(--r-xl);padding:20px 16px;margin-bottom:24px">
        <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);text-align:center;margin-bottom:14px">By the Numbers</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${[
            { num: '500+', label: 'Transformations', sub: 'Verified outcomes in 2025–26' },
            { num: '12', label: 'Clinical Partners', sub: 'Cardiologists & GPs' },
            { num: '0', label: 'Hidden Fillers', sub: 'Full-disclosure every SKU' },
            { num: '48h', label: 'Support Response', sub: 'Human advisors, not bots' },
          ].map(s => `
          <div style="text-align:center;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:16px;box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-serif);font-size:1.6rem;font-weight:700;color:var(--forest-dark);line-height:1">${s.num}</div>
            <div style="font-weight:700;font-size:.78rem;color:var(--forest);margin:3px 0 2px">${s.label}</div>
            <div style="font-size:.68rem;color:var(--text-muted);line-height:1.4">${s.sub}</div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Sustainability -->
      <div style="border:1px solid var(--sand-border);border-radius:var(--r-xl);padding:20px 18px;background:var(--white)">
        <span class="badge badge-forest" style="margin-bottom:8px;font-size:.6rem">Sustainability</span>
        <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);margin-bottom:8px">Crafted for Health. Packaged for the Planet.</p>
        <p style="font-size:.78rem;color:var(--text-muted);line-height:1.6;margin-bottom:12px">Zero-plastic dark-forest glass packaging. 100% recyclable and refillable. Wild-sourced marine ingredients are Friend of the Sea certified.</p>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <span class="badge badge-gold" style="font-size:.54rem;padding:3px 9px;letter-spacing:.04em">Friend of the Sea</span>
            <span class="badge badge-purity" style="font-size:.54rem;padding:3px 9px;letter-spacing:.04em">Zero Plastic</span>
          </div>
          <div>
            <span class="badge badge-forest" style="font-size:.54rem;padding:3px 9px;letter-spacing:.04em">Carbon Neutral Shipping</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0">
          ${[
            { label: 'Glass Jars Recycled', value: '12,400+' },
            { label: 'Plastic Eliminated', value: '3,200 kg' },
            { label: 'Wild Catch Offset', value: '100%' },
            { label: 'Carbon Offset Credits', value: '8.4 Tonnes' },
          ].map(r => `
          <div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--sand-border)">
            <span style="font-size:.78rem;color:var(--text-muted)">${r.label}</span>
            <span style="font-size:.78rem;font-weight:700;color:var(--forest-dark)">${r.value}</span>
          </div>`).join('')}
        </div>
      </div>

    </div>
  </div>`;
}

function renderAboutDesktop() {
  const values = [
    {t:'Clinical Efficacy',d:'Every compound included in Aurite formulations is supported by double-blind human clinical trials.',icon:'award'},
    {t:'Radical Transparency',d:'Full-disclosure labeling with exact milligram amounts and published Certificate of Analysis.',icon:'shield'},
    {t:'Ocean & Earth Stewardship',d:'Friend of the Sea certified wild sourcing and 100% recyclable dark-green glass containers.',icon:'leaf'},
  ];
  return `
  <div class="container section-padding">
    <div style="text-align:center; max-width:760px; margin:0 auto 56px auto;">
      <span class="badge badge-gold" style="margin-bottom:12px;">Purity &amp; Purpose</span>
      <h1 style="font-family:var(--font-serif); font-size:3rem; color:var(--forest-dark); margin-bottom:16px;">
        Empowering Human Longevity Through Science
      </h1>
      <p style="color:var(--text-muted); font-size:1.1rem; line-height:1.7;">
        Aurite was founded on a simple principle: supplements should deliver measurable biological results, not just marketing claims.
      </p>
    </div>

    <!-- Core Pillars Grid (3 Columns) -->
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:28px; margin-bottom:64px;" class="about-hero-grid">
      ${values.map(val => `
        <div class="about-pillar-card" style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-xl); padding:32px; box-shadow:var(--shadow-sm); cursor:default">
          <div style="width:52px; height:52px; border-radius:var(--r-md); background:var(--sand); color:var(--forest); display:flex; align-items:center; justify-content:center; margin-bottom:20px;">
            ${svgIcon(val.icon, 24)}
          </div>
          <h3 style="font-family:var(--font-serif); font-size:1.4rem; color:var(--forest-dark); margin-bottom:12px;">${val.t}</h3>
          <p style="color:var(--text-muted); line-height:1.65; font-size:0.95rem;">${val.d}</p>
        </div>
      `).join('')}
    </div>

    <!-- Origin Story Card (Dark Forest Luxury Panel) -->
    <div class="about-origin-card" style="background:var(--forest-dark); border-radius:var(--r-xl); padding:48px 56px; margin-bottom:64px; color:var(--sand-light); border:1px solid rgba(197,160,89,0.3); transition:all .3s ease">
      <div style="max-width:840px; margin:0 auto; text-align:center">
        <span class="badge badge-gold" style="margin-bottom:14px; font-size:.74rem">Founded 2024</span>
        <h2 style="font-family:var(--font-serif); font-size:2.2rem; color:var(--sand-light); margin-bottom:16px; line-height:1.3">
          Born From Frustration With Broken Industry Standards
        </h2>
        <p style="font-size:1.02rem; color:rgba(250,247,242,.85); line-height:1.75; margin-bottom:16px">
          After a decade of clinical research, our founders found that 79% of bestselling supplement brands used inferior chemical forms, underdosed active compounds below therapeutic thresholds, and hid synthetic fillers under proprietary blends.
        </p>
        <p style="font-size:1.02rem; color:rgba(250,247,242,.85); line-height:1.75; margin:0">
          Aurite was built from scratch — starting in certified laboratories, working backwards from human mucosal absorption pathways to ingredient selection, clinical dosing, and zero-plastic glass packaging.
        </p>
      </div>
    </div>

    <!-- The Journey Timeline -->
    <div style="background:var(--sand-light); border-radius:var(--r-xl); padding:56px 64px; border:1px solid var(--sand-border); margin-bottom:64px">
      <h2 style="font-family:var(--font-serif); font-size:2.2rem; text-align:center; color:var(--forest-dark); margin-bottom:44px;">Our Clinical Timeline</h2>
      
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:32px; max-width:960px; margin:0 auto;">
        ${[
          { year: '2022', event: 'Global Sourcing & R&D', desc: '3 years of botanical research across 14 countries. Final shortlist: 6 certified suppliers exceeding 99.8% purity compliance.' },
          { year: '2024', event: 'GMP Cleanroom Facility', desc: 'State-of-the-art facility commissioned with inline mass spectrometry quality auditing and inert atmosphere encapsulation.' },
          { year: '2025', event: 'Enteric Shield Patent & Launch', desc: 'Omega-3 & Magnesium launched. 94% of early trial members reported measurable bio-markers within 28 days.' },
          { year: '2026', event: 'National Clinical Network', desc: 'Partnered with over 500 clinical practitioners and established direct-to-consumer molecular purity tracking.' },
        ].map(e => `
        <div class="about-timeline-card" style="display:flex; gap:18px; align-items:flex-start; background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:24px; box-shadow:var(--shadow-sm); cursor:default">
          <div style="flex-shrink:0; width:60px; height:60px; border-radius:var(--r-md); background:var(--gold-light); border:1.5px solid var(--gold); display:flex; align-items:center; justify-content:center; font-family:var(--font-serif); font-weight:800; color:var(--forest-dark); font-size:1.1rem">${e.year}</div>
          <div>
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--forest-dark); margin-bottom:4px">${e.event}</h4>
            <p style="font-size:.88rem; color:var(--text-muted); line-height:1.6; margin:0">${e.desc}</p>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <!-- By The Numbers (4-Column Stats Grid) -->
    <div style="margin-bottom:64px">
      <div style="text-align:center; margin-bottom:32px">
        <span class="badge badge-forest" style="margin-bottom:8px">Impact Metrics</span>
        <h3 style="font-family:var(--font-serif); font-size:2rem; color:var(--forest-dark); margin:0">By the Numbers</h3>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:20px">
        ${[
          { num: '500+', label: 'Transformations', sub: 'Verified member health outcomes in 2025–26' },
          { num: '12+', label: 'Clinical Partners', sub: 'Board-certified cardiologists & general practitioners' },
          { num: '0', label: 'Hidden Fillers', sub: 'Full-disclosure milligram labeling on every SKU' },
          { num: '&lt; 24h', label: 'Support Response', sub: 'Dedicated human wellness advisors, never bots' },
        ].map(s => `
        <div class="about-stat-card" style="text-align:center; background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:28px 20px; box-shadow:var(--shadow-sm); cursor:default">
          <div style="font-family:var(--font-serif); font-size:2.4rem; font-weight:800; color:var(--forest-dark); line-height:1">${s.num}</div>
          <div style="font-weight:800; font-size:.9rem; color:var(--forest); margin:8px 0 4px">${s.label}</div>
          <div style="font-size:.78rem; color:var(--text-muted); line-height:1.45">${s.sub}</div>
        </div>`).join('')}
      </div>
    </div>

    <!-- Sustainability & Planet Stewardship -->
    <div style="border:1px solid var(--sand-border); border-radius:var(--r-xl); padding:40px 48px; background:var(--white); box-shadow:var(--shadow-sm)">
      <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:48px; align-items:center">
        <div>
          <span class="badge badge-forest" style="margin-bottom:12px; font-size:.72rem">Sustainability</span>
          <h3 style="font-family:var(--font-serif); font-size:2rem; color:var(--forest-dark); margin-bottom:12px">Crafted for Health. Packaged for the Planet.</h3>
          <p style="font-size:.95rem; color:var(--text-muted); line-height:1.7; margin-bottom:18px">Zero-plastic dark-forest glass packaging. 100% recyclable, UV-shielded and refillable. Wild-sourced marine ingredients are Friend of the Sea certified to preserve marine ecosystems.</p>
          <div style="display:flex; flex-wrap:wrap; gap:10px">
            <span class="badge badge-gold" style="font-size:.72rem; padding:6px 14px">Friend of the Sea Certified</span>
            <span class="badge badge-forest" style="font-size:.72rem; padding:6px 14px">Carbon Neutral Shipping</span>
            <span class="badge badge-purity" style="font-size:.72rem; padding:6px 14px">100% Zero Single-Use Plastic</span>
          </div>
        </div>

        <div style="background:var(--sand-light); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:24px 28px; display:flex; flex-direction:column; gap:6px">
          ${[
            { label: 'Glass Jars Recycled & Refilled', value: '12,400+' },
            { label: 'Single-Use Plastic Eliminated', value: '3,200 kg' },
            { label: 'Wild Catch Offset', value: '100%' },
            { label: 'Carbon Offset Credits Verified', value: '8.4 Tonnes' },
          ].map(r => `
          <div class="sustainability-row" style="display:flex; justify-content:space-between; align-items:center; padding:12px 6px; border-bottom:1px solid var(--sand-border)">
            <span style="font-size:.88rem; color:var(--text-dark); font-weight:500">${r.label}</span>
            <span style="font-size:.95rem; font-weight:800; color:var(--forest-dark)">${r.value}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>

  </div>`;
}

function renderAbout() {
  return window.innerWidth >= 900 ? renderAboutDesktop() : renderAboutMobile();
}

// ============================================================
// PAGES: CONTACT
// ============================================================
function renderContactMobile() {
  const faqs = [
    {q:'How should I store my supplements?',a:'Store in a cool, dry place. Our dark glass jars are light-shielded — refrigeration not required.'},
    {q:'Can I manage orders anytime?',a:'Yes — adjust delivery dates or update details from your Account Dashboard.'},
    {q:'Are products third-party tested?',a:'Every batch is ISO-accredited 3rd-party tested for heavy metals, microbial safety, and potency.'},
    {q:'What is your support response window?',a:'Our team responds to all inquiries within 24 business hours.'},
  ];
  return `
  <div style="padding-top:80px;padding-bottom:48px;">
    <div class="container">
      <div style="text-align:center;max-width:520px;margin:0 auto 20px">
        <span class="badge badge-gold" style="margin-bottom:8px;font-size:.65rem">Customer Support</span>
        <h1 style="font-family:var(--font-serif);font-size:1.45rem;color:var(--forest-dark);margin-bottom:8px;line-height:1.25">We're Here To Help</h1>
        <p style="color:var(--text-muted);font-size:.82rem;line-height:1.6">Questions about your order, dosage, or products? Our team is ready.</p>
      </div>

      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;box-shadow:var(--shadow-sm);flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:38px;height:38px;border-radius:50%;background:var(--gold-light);color:var(--forest-dark);display:flex;align-items:center;justify-content:center;flex-shrink:0">${svgIcon('mail',18)}</div>
          <div>
            <div style="font-weight:700;font-size:.8rem;color:var(--forest-dark)">Email Support</div>
            <a href="mailto:aurite@gmail.com" style="font-size:.9rem;font-weight:800;color:var(--gold);text-decoration:none">aurite@gmail.com</a>
          </div>
        </div>
        <span class="badge badge-gold" style="font-size:.6rem">Response &lt; 24h</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr;gap:14px" class="contact-grid">
        <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:18px;box-shadow:var(--shadow-sm)">
          <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);margin-bottom:14px">Send a Message</p>
          <form id="contact-form" style="display:flex;flex-direction:column;gap:11px">
            <div><label class="form-label" style="font-size:.75rem;margin-bottom:3px;display:block">Full Name</label><input type="text" id="ct-name" class="form-input" placeholder="Akash Sharma" required style="font-size:.84rem;padding:9px 12px"></div>
            <div><label class="form-label" style="font-size:.75rem;margin-bottom:3px;display:block">Email</label><input type="email" id="ct-email" class="form-input" placeholder="akash@example.com" required style="font-size:.84rem;padding:9px 12px"></div>
            <div><label class="form-label" style="font-size:.75rem;margin-bottom:3px;display:block">Subject</label>
              <select id="ct-subject" class="form-input" style="font-size:.84rem;padding:9px 12px"><option>General Question</option><option>Order Tracking</option><option>Medical Partnership</option></select>
            </div>
            <div><label class="form-label" style="font-size:.75rem;margin-bottom:3px;display:block">Message</label><textarea id="ct-msg" class="form-input" rows="3" placeholder="How can we help?" required style="font-size:.84rem;padding:9px 12px;resize:vertical"></textarea></div>
            <button type="submit" class="btn btn-primary" style="width:100%;font-size:.84rem;padding:10px">Send Message</button>
          </form>
        </div>
        <div>
          <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);margin-bottom:10px">Frequently Asked</p>
          <div style="display:flex;flex-direction:column;gap:9px">
            ${faqs.map(f=>`
            <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:13px 15px;box-shadow:var(--shadow-sm)">
              <div style="font-weight:700;font-size:.8rem;color:var(--forest-dark);margin-bottom:3px">${f.q}</div>
              <div style="font-size:.75rem;color:var(--text-muted);line-height:1.55">${f.a}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderContactDesktop() {
  const faqs = [
    {
      q: "How should I store my Aurite supplements?",
      a: "Aurite dark forest glass jars are light-shielded. Store them in a cool, dry place away from direct sunlight. Refrigeration is not required but can extend fish oil freshness in warm climates."
    },
    {
      q: "Can I modify or pause my subscription anytime?",
      a: "Yes! You can skip deliveries, adjust delivery intervals, or swap formulations anytime directly inside your User Account Dashboard."
    },
    {
      q: "Are Aurite products third-party tested?",
      a: "Every single production batch undergoes ISO-accredited 3rd-party laboratory testing for heavy metals, microbial safety, and active compound potency."
    },
    {
      q: "What is your shipping & return policy?",
      a: "We offer Free Express Shipping on orders over ₹1,499. All purchases are backed by our verified 2-day return and exchange policy."
    }
  ];

  return `
  <div class="container section-padding">
    <div style="text-align:center; max-width:720px; margin:0 auto 48px auto;">
      <span class="badge badge-gold" style="margin-bottom:12px;">Customer Support</span>
      <h1 style="font-family:var(--font-serif); font-size:3rem; color:var(--forest-dark); margin-bottom:16px;">
        We are here to help.
      </h1>
      <p style="color:var(--text-muted); font-size:1.05rem;">
        Have a question about your order, dosage guidelines, or formulations? Reach out to our wellness team.
      </p>
    </div>

    <!-- Quick Direct Contact Channels (2-column Clean Support Cards) -->
    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:24px; margin-bottom:48px; max-width:960px; margin-left:auto; margin-right:auto">
      <div style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:24px 28px; display:flex; align-items:center; gap:18px; box-shadow:var(--shadow-sm); transition:transform .2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
        <div style="width:52px; height:52px; border-radius:50%; background:var(--gold-light); color:var(--forest-dark); display:flex; align-items:center; justify-content:center; flex-shrink:0">${svgIcon('mail',24)}</div>
        <div>
          <div style="font-size:.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.05em">Email Support</div>
          <a href="mailto:aurite@gmail.com" style="font-size:1.1rem; font-weight:800; color:var(--forest-dark); text-decoration:none">aurite@gmail.com</a>
          <div style="font-size:.76rem; color:var(--gold); font-weight:700; margin-top:3px">Response within 24 Hours</div>
        </div>
      </div>

      <div style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:24px 28px; display:flex; align-items:center; gap:18px; box-shadow:var(--shadow-sm); transition:transform .2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
        <div style="width:52px; height:52px; border-radius:50%; background:rgba(16,185,129,.1); color:var(--success); display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0">💬</div>
        <div>
          <div style="font-size:.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.05em">Account Support</div>
          <div style="font-size:1.1rem; font-weight:800; color:var(--forest-dark)">Live Query Portal</div>
          <div style="font-size:.76rem; color:var(--success); font-weight:700; margin-top:3px">2-Way Verified Customer Chat</div>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:48px; align-items:start;" class="contact-grid">
      <!-- Contact Form -->
      <div style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-xl); padding:36px; box-shadow:var(--shadow-sm);">
        <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:20px; color:var(--forest-dark);">Send Us a Message</h3>
        
        <form id="contact-form">
          <div class="form-group" style="margin-bottom:16px">
            <label class="form-label" style="font-size:.82rem; font-weight:700; color:var(--forest-dark); margin-bottom:6px; display:block">Your Full Name *</label>
            <input type="text" id="ct-name" required class="form-input" placeholder="Akash Sharma" style="height:44px; padding:10px 14px; font-size:.92rem">
          </div>

          <div class="form-group" style="margin-bottom:16px">
            <label class="form-label" style="font-size:.82rem; font-weight:700; color:var(--forest-dark); margin-bottom:6px; display:block">Email Address *</label>
            <input type="email" id="ct-email" required class="form-input" placeholder="akash@example.com" style="height:44px; padding:10px 14px; font-size:.92rem">
          </div>

          <div class="form-group" style="margin-bottom:16px">
            <label class="form-label" style="font-size:.82rem; font-weight:700; color:var(--forest-dark); margin-bottom:6px; display:block">Inquiry Subject *</label>
            <select id="ct-subject" class="form-input" style="height:44px; padding:10px 14px; font-size:.92rem">
              <option>General Question</option>
              <option>Order Tracking &amp; Shipping</option>
              <option>Return / Exchange Question</option>
              <option>Medical Professional Partnership</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom:20px">
            <label class="form-label" style="font-size:.82rem; font-weight:700; color:var(--forest-dark); margin-bottom:6px; display:block">Message *</label>
            <textarea id="ct-msg" required class="form-input" rows="4" placeholder="How can our clinical team assist you?" style="padding:12px 14px; font-size:.92rem; resize:vertical"></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%; padding:14px; font-weight:800; font-size:.95rem">
            Send Message →
          </button>
        </form>
      </div>

      <!-- FAQs Accordion -->
      <div>
        <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:24px; color:var(--forest-dark);">Frequently Asked Questions</h3>
        
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${faqs.map(faq => `
            <div style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:22px; box-shadow:var(--shadow-sm)">
              <div style="font-weight:700; font-size:1.02rem; color:var(--forest-dark); margin-bottom:8px;">${faq.q}</div>
              <div style="font-size:0.9rem; color:var(--text-muted); line-height:1.65;">${faq.a}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function renderContact() {
  return window.innerWidth >= 900 ? renderContactDesktop() : renderContactMobile();
}


function renderAdminPanel() {
  if (!state.isAdmin) {
    // Redirect to the main login modal — no separate admin portal needed
    setTimeout(() => openAuthModal('login'), 50);
    return `
    <div class="container" style="max-width:480px;text-align:center;padding-top:84px;padding-bottom:56px">
      <p style="color:var(--text-muted);font-size:.95rem">Redirecting to sign in...</p>
    </div>`;
  }

  const stats = state.getAnalytics();

  return `
  <div class="container" style="padding-top: 84px; padding-bottom: 56px;">
    <div class="admin-header">
      <div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="badge badge-gold">Verified Admin Session</span>
          <span style="font-size:.8rem;color:rgba(255,255,255,0.7)">${state.user?.email || 'admin@aurite.com'}</span>
        </div>
        <h1 style="font-family:var(--font-sans);font-size:1.8rem;font-weight:700;letter-spacing:-0.3px;color:var(--sand-light);margin-top:6px">Aurite Executive Control Center</h1>
      </div>
    </div>

    <div class="admin-tab-bar" id="admin-tabs-row">
      <button class="admin-tab-btn ${activeAdminTab==='analytics'?'active':''}" data-adm-tab="analytics" type="button">${svgIcon('chart',18)} Profit &amp; Analytics</button>
      <button class="admin-tab-btn ${activeAdminTab==='products'?'active':''}" data-adm-tab="products" type="button">${svgIcon('box',18)} Manage Products</button>
      <button class="admin-tab-btn ${activeAdminTab==='orders'?'active':''}" data-adm-tab="orders" type="button">${svgIcon('truck',18)} Customer Orders (${state.orders.length})</button>
      <button class="admin-tab-btn ${activeAdminTab==='queries'?'active':''}" data-adm-tab="queries" type="button">${svgIcon('chat',18)} Live Queries (${state.queries.filter(q=>q.status==='Open').length})</button>
      <button class="admin-tab-btn ${activeAdminTab==='returns'?'active':''}" data-adm-tab="returns" type="button"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg> Return &amp; Refund (${(state.returns||[]).filter(r=>r.status!=='Refund Successful'&&r.status!=='Refund Processed'&&r.status!=='Request Rejected'&&r.status!=='Case Closed').length})</button>
      <button class="admin-tab-btn ${activeAdminTab==='users'?'active':''}" data-adm-tab="users" type="button">${svgIcon('user',18)} Registered Users (${(state.users||[]).length})</button>
    </div>

    <div id="admin-tab-content">
      ${renderAdminTabContent(activeAdminTab, stats)}
    </div>
  </div>`;
}

function renderAdminTabContent(tab, stats) {
  if (tab === 'analytics') {
    const lowStockProducts = state.products.filter(p => (p.stockQty || 0) < 15);
    const chartData = [
      { month: 'Jan', revenue: 14500, profit: 9800, revPct: 65, profPct: 44, growth: '+14%' },
      { month: 'Feb', revenue: 18200, profit: 12400, revPct: 82, profPct: 56, growth: '+25%' },
      { month: 'Mar', revenue: 12900, profit: 8600, revPct: 58, profPct: 38, growth: '-29%' },
      { month: 'Apr', revenue: 21000, profit: 14700, revPct: 94, profPct: 66, growth: '+62%' },
      { month: 'May', revenue: 16800, profit: 11500, revPct: 75, profPct: 51, growth: '-20%' },
      { month: 'Jun', revenue: 24500, profit: 17200, revPct: 100, profPct: 77, growth: '+45%' },
      { month: 'Jul', revenue: 19400, profit: 13600, revPct: 87, profPct: 61, growth: '-20%' }
    ];

    return `
    <!-- RESTOCK ALERT -->
    ${lowStockProducts.length > 0 ? `
    <div style="background:linear-gradient(135deg,#fff3cd,#ffe8a3);border:2px solid #f59e0b;border-radius:var(--r-lg);padding:16px 20px;margin-bottom:20px;display:flex;align-items:flex-start;gap:14px">
      <div style="font-size:1.5rem;flex-shrink:0">&#9888;&#65039;</div>
      <div style="flex-grow:1">
        <div style="font-weight:800;font-size:.92rem;color:#92400e;margin-bottom:6px">Restock Alert &mdash; ${lowStockProducts.length} Product${lowStockProducts.length>1?'s':''} Running Low</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${lowStockProducts.map(p => `
          <div style="background:#fff;border:1px solid #f59e0b;border-radius:var(--r-sm);padding:5px 10px;font-size:.78rem;font-weight:700;color:#92400e;display:flex;align-items:center;gap:6px">
            <img src="${p.image}" style="width:20px;height:20px;border-radius:4px;object-fit:cover">
            ${p.name} &mdash; <span style="color:var(--error);font-weight:800">${p.stockQty || 0} left</span>
          </div>`).join('')}
        </div>
      </div>
    </div>` : `<div style="background:linear-gradient(135deg,#d1fae5,#a7f3d0);border:2px solid #10b981;border-radius:var(--r-lg);padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;gap:10px">
      <span style="font-size:1.2rem">&#10003;</span>
      <span style="font-weight:700;color:#065f46;font-size:.85rem">All products are well-stocked. No restock needed.</span>
    </div>`}

    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <div class="admin-stat-label">Total Gross Sales</div>
        <div class="admin-stat-val">${formatPrice(stats.totalRevenue)}</div>
        <div style="font-size:.74rem;color:var(--gold);font-weight:700">From ${stats.totalOrders} Orders</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-label">Production Cost</div>
        <div class="admin-stat-val" style="color:var(--text-muted)">${formatPrice(stats.totalCost)}</div>
        <div style="font-size:.74rem;color:var(--text-light)">Unit Production Expense</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-label">Net Profit Margin</div>
        <div class="admin-stat-val" style="color:var(--forest)">${formatPrice(stats.netProfit)}</div>
        <div style="font-size:.74rem;color:var(--forest);font-weight:700">&uarr; ${stats.profitMargin}% Net Margin</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-label">Low Stock Alerts</div>
        <div class="admin-stat-val" style="color:${stats.lowStockCount>0?'var(--error)':'var(--forest)'}">${stats.lowStockCount} Items</div>
        <div style="font-size:.74rem;color:var(--error)">Requires Re-stocking</div>
      </div>
    </div>

    <!-- COMBO BAR + LINE CHART -->
    <div class="admin-chart-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
        <div>
          <h3 style="font-family:var(--font-sans);font-size:1.05rem;font-weight:700;color:var(--forest-dark);margin:0">Monthly Revenue &amp; Profit Performance</h3>
        </div>
        <div style="display:flex;gap:12px;font-size:.74rem;font-weight:700;flex-wrap:wrap">
          <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;background:var(--forest);border-radius:2px"></span>Gross Revenue</span>
          <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;background:var(--gold);border-radius:2px"></span>Net Profit</span>
          <span style="display:flex;align-items:center;gap:5px"><span style="width:16px;height:3px;background:#4f46e5;border-radius:2px;display:inline-block"></span>Growth Curve</span>
        </div>
      </div>

      <!-- SVG COMBO CHART with ample top headroom and clean labels -->
      <div style="position:relative;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch">
        <svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;min-width:520px;display:block;font-family:var(--font-sans);overflow:visible">
          <defs>
            <linearGradient id="barRevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#143325"/>
              <stop offset="100%" stop-color="#091b13"/>
            </linearGradient>
            <linearGradient id="barProfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#d4af37"/>
              <stop offset="100%" stop-color="#b38938"/>
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#4f46e5" flood-opacity="0.4"/>
            </filter>
          </defs>

          <!-- Y-axis grid lines with top headroom -->
          ${[0,25,50,75,100].map(pct => `
          <line x1="50" y1="${55 + (100 - pct) * 1.8}" x2="690" y2="${55 + (100 - pct) * 1.8}" stroke="#e5e0d3" stroke-width="1" stroke-dasharray="4,4"/>
          <text x="44" y="${59 + (100 - pct) * 1.8}" text-anchor="end" font-size="10" fill="#718096" font-weight="600">${pct}%</text>`).join('')}

          <!-- Background hover columns -->
          ${chartData.map((m, i) => {
            const colX = 52 + i * 92;
            return `<rect x="${colX}" y="45" width="84" height="200" rx="8" fill="rgba(20,51,37,0.02)" class="chart-col-hover" style="cursor:pointer;transition:fill .2s" onmouseover="this.setAttribute('fill','rgba(197,160,89,0.09)')" onmouseout="this.setAttribute('fill','rgba(20,51,37,0.02)')"><title>${m.month}: Revenue ₹${m.revenue.toLocaleString('en-IN')}, Profit ₹${m.profit.toLocaleString('en-IN')}, Growth ${m.growth}</title></rect>`;
          }).join('')}

          <!-- Revenue Bars -->
          ${chartData.map((m, i) => {
            const x = 62 + i * 92;
            const barH = m.revPct * 1.8;
            const y = 55 + (100 - m.revPct) * 1.8;
            return `
            <rect x="${x}" y="${y}" width="28" height="${barH}" rx="4" fill="url(#barRevGrad)" style="transition:opacity .2s;cursor:pointer"><title>${m.month} Gross Revenue: ₹${m.revenue.toLocaleString('en-IN')}</title></rect>
            <text x="${x + 14}" y="${y - 8}" text-anchor="middle" font-size="10.5" fill="#143325" font-weight="800">₹${Math.round(m.revenue/1000)}k</text>`;
          }).join('')}

          <!-- Profit Bars -->
          ${chartData.map((m, i) => {
            const x = 62 + i * 92 + 32;
            const barH = m.profPct * 1.8;
            const y = 55 + (100 - m.profPct) * 1.8;
            return `
            <rect x="${x}" y="${y}" width="22" height="${barH}" rx="4" fill="url(#barProfGrad)" style="transition:opacity .2s;cursor:pointer"><title>${m.month} Net Profit: ₹${m.profit.toLocaleString('en-IN')}</title></rect>
            <text x="${x + 11}" y="${y - 8}" text-anchor="middle" font-size="10" fill="#92400e" font-weight="800">₹${Math.round(m.profit/1000)}k</text>`;
          }).join('')}

          <!-- Growth Curve Polyline & Glowing Points -->
          <polyline points="${chartData.map((m, i) => `${62 + i * 92 + 32 + 11},${55 + (100 - m.profPct) * 1.8}`).join(' ')}" fill="none" stroke="#4f46e5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
          
          ${chartData.map((m, i) => `
          <circle cx="${62 + i * 92 + 32 + 11}" cy="${55 + (100 - m.profPct) * 1.8}" r="5" fill="#4f46e5" stroke="#ffffff" stroke-width="2" style="cursor:pointer;transition:transform .2s">
            <title>${m.month} Growth Rate: ${m.growth}</title>
          </circle>`).join('')}

          <!-- X-Axis Baseline & Labels -->
          <line x1="50" y1="240" x2="690" y2="240" stroke="#d5ccb6" stroke-width="2"/>
          ${chartData.map((m, i) => `<text x="${62 + i * 92 + 27}" y="265" text-anchor="middle" font-size="12" fill="#0f281e" font-weight="800">${m.month}</text>`).join('')}
        </svg>
      </div>
    </div>

    <div class="admin-table-card">
      <h3 style="font-family:var(--font-sans);font-size:1.05rem;font-weight:700;margin-bottom:14px;color:var(--forest-dark)">Product Margin &amp; Profit Breakdown</h3>
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:.84rem;min-width:540px">
        <thead>
          <tr style="border-bottom:2px solid var(--forest-dark)">
            <th style="padding:8px 0">Product Name</th>
            <th style="padding:8px 0">Stock Qty</th>
            <th style="padding:8px 0">Selling Price</th>
            <th style="padding:8px 0">Production Cost</th>
            <th style="padding:8px 0">Unit Profit</th>
            <th style="padding:8px 0;text-align:right">Margin %</th>
          </tr>
        </thead>
        <tbody>
          ${state.products.map(p => {
            const unitProfit = p.price - (p.costPrice || 0);
            const marginPct = ((unitProfit / p.price) * 100).toFixed(1);
            return `
            <tr style="border-bottom:1px solid var(--sand-border)">
              <td style="padding:10px 0;font-weight:700;color:var(--forest-dark)">${p.name}</td>
              <td style="padding:10px 0"><span class="badge ${p.stockQty<15?'badge-forest':'badge-gold'}" style="${p.stockQty<15?'background:rgba(198,40,40,.15);color:var(--error)':''}">${p.stockQty} left</span></td>
              <td style="padding:10px 0;font-weight:700">${formatPrice(p.price)}</td>
              <td style="padding:10px 0;color:var(--text-muted)">${formatPrice(p.costPrice)}</td>
              <td style="padding:10px 0;color:var(--forest);font-weight:700">+${formatPrice(unitProfit)}</td>
              <td style="padding:10px 0;text-align:right;font-weight:800;color:var(--gold)">${marginPct}%</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
  }

  if (tab === 'queries') {
    const qOpen = state.queries.filter(q=>q.status==='Open').length;
    const qResolved = state.queries.filter(q=>q.status==='Resolved').length;
    const qClosed = state.queries.filter(q=>q.status==='Closed').length;
    const qAnswered = state.queries.filter(q=>q.status==='Answered').length;
    return `
    <h3 style="font-size:1.15rem;font-weight:700;color:var(--forest-dark);margin-bottom:12px">Customer Queries &amp; Support Chat</h3>
    <!-- Query status summary -->
    <div class="admin-summary-grid">
      <div class="admin-summary-card" style="border-top:4px solid var(--forest)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="width:12px;height:12px;border-radius:50%;background:var(--forest)"></div>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--forest-dark)">${qOpen}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Open</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #f59e0b">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="width:12px;height:12px;border-radius:50%;background:#f59e0b"></div>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#92400e">${qAnswered}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Answered</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #10b981">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="width:12px;height:12px;border-radius:50%;background:#10b981"></div>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#065f46">${qResolved}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Resolved</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid var(--error)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="width:12px;height:12px;border-radius:50%;background:var(--error)"></div>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--error)">${qClosed}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Closed</div>
      </div>
      <div class="admin-summary-card" style="background:var(--forest-dark);border-color:var(--forest-dark);border-top:4px solid var(--gold)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="width:12px;height:12px;border-radius:50%;background:var(--gold)"></div>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--gold)">${state.queries.length}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.7);letter-spacing:0.5px">Total</div>
      </div>
    </div>

    <!-- Live Queries View -->
    <div class="admin-split-grid">
      <div class="admin-scroll-box admin-split-left" style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:18px;max-height:640px;overflow-y:auto">
        <h4 style="font-size:.95rem;margin-bottom:12px;color:var(--forest-dark);font-weight:700">Received Customer Queries (${state.queries.length})</h4>
        ${state.queries.length === 0 ? '<p style="color:var(--text-muted);font-size:.84rem">No queries yet.</p>' : state.queries.map(q => `
          <div class="query-item-card" data-id="${q.id}" style="border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px;margin-bottom:10px;cursor:pointer;background:var(--sand-light);transition:all .2s ease">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-weight:700;font-size:.84rem;color:var(--forest-dark)">${q.customerName}</span>
              <span class="badge ${q.status==='Open'?'badge-forest':q.status==='Answered'?'badge-gold':''}" style="font-size:.64rem;${q.status==='Resolved'?'background:var(--success);color:#fff':''}${q.status==='Closed'?'background:#888;color:#fff':''};">${q.status}</span>
            </div>
            <div style="font-size:.8rem;font-weight:600;color:var(--text-dark)">${q.subject}</div>
            <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">${q.date} &bull; ${q.email}</div>
          </div>`).join('')}
      </div>

      <div class="admin-split-right" style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:20px;display:flex;flex-direction:column;min-height:540px;max-height:640px;justify-content:space-between" id="query-chatbox">
        <p style="color:var(--text-muted);text-align:center;margin:auto;font-size:.86rem">Select a customer query to open live chat conversation.</p>
      </div>
    </div>`;
  }

  if (tab === 'users') {
    const userList = state.users || [];
    const activeCount = userList.filter(u => !u.isBlocked).length;
    const blockedCount = userList.filter(u => u.isBlocked).length;
    const totalVal = userList.reduce((s, u) => s + (u.totalSpent || 0), 0);

    return `
    <h3 style="font-size:1.15rem;font-weight:700;color:var(--forest-dark);margin-bottom:12px">Registered Customer Accounts &amp; Access Control</h3>

    <!-- Summary cards -->
    <div class="admin-summary-grid">
      <div class="admin-summary-card" style="border-top:4px solid var(--forest)">
        <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--forest-dark)">${userList.length}</div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Total Accounts</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #10b981">
        <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#065f46">${activeCount}</div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Active Accounts</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid var(--error)">
        <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--error)">${blockedCount}</div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Suspended / Blocked</div>
      </div>
      <div class="admin-summary-card" style="background:var(--forest-dark);border-color:var(--forest-dark);border-top:4px solid var(--gold)">
        <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--gold)">${formatPrice(totalVal)}</div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.7);letter-spacing:0.5px">Total Customer Value</div>
      </div>
    </div>

    <!-- Live Search Bar for Users by Name, ID, Email, Phone -->
    <div style="display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap">
      <div style="position:relative;flex-grow:1;max-width:440px">
        <input type="text" id="user-search-input" class="form-input" placeholder="🔍 Search users by name, ID, email, or phone..." style="padding:9px 14px;background:var(--white);border-color:var(--sand-border);font-size:.84rem">
      </div>
    </div>

    <!-- Users Table with full details and block/unblock -->
    <div class="admin-table-card">
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:.82rem;min-width:640px">
        <thead>
          <tr style="border-bottom:2px solid var(--forest-dark)">
            <th style="padding:8px 0">User Info</th>
            <th style="padding:8px 0">Email &amp; Joined</th>
            <th style="padding:8px 0">Mobile</th>
            <th style="padding:8px 0">Address</th>
            <th style="padding:8px 0">Orders / Spend</th>
            <th style="padding:8px 0">Status</th>
            <th style="padding:8px 0;text-align:right">Access</th>
          </tr>
        </thead>
        <tbody id="users-catalog-tbody">
          ${userList.map(u => `
          <tr class="user-row" data-user-name="${u.name}" data-user-id="${u.id}" data-user-email="${u.email}" data-user-phone="${u.phone || ''}" style="border-bottom:1px solid var(--sand-border)">
            <td style="padding:10px 0">
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:32px;height:32px;border-radius:50%;background:var(--forest);color:var(--sand-light);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.76rem;flex-shrink:0">${getInitials(u.name)}</div>
                <div>
                  <div style="font-weight:700;color:var(--forest-dark)">${u.name}</div>
                  <div style="font-size:.7rem;color:var(--text-muted)">ID: ${u.id}</div>
                </div>
              </div>
            </td>
            <td style="padding:10px 0">
              <div style="font-weight:600;color:var(--forest-dark)">${u.email}</div>
              <div style="font-size:.7rem;color:var(--text-muted)">Joined ${u.joinedDate || '2026-01-01'}</div>
            </td>
            <td style="padding:10px 0;font-weight:700;color:var(--forest)">${u.phone || 'N/A'}</td>
            <td style="padding:10px 0;font-size:.78rem;color:var(--text-dark);max-width:160px">${u.address || 'N/A'}</td>
            <td style="padding:10px 0">
              <div style="font-weight:700">${u.ordersCount || 0} orders</div>
              <div style="font-size:.74rem;color:var(--gold);font-weight:700">${formatPrice(u.totalSpent || 0)}</div>
            </td>
            <td style="padding:10px 0">
              <span class="badge ${u.isBlocked ? '' : 'badge-forest'}" style="font-size:.65rem;${u.isBlocked ? 'background:rgba(239,68,68,.15);color:var(--error);border:1px solid rgba(239,68,68,.3)' : ''}">
                ${u.isBlocked ? '🚫 Suspended' : '✅ Active'}
              </span>
            </td>
            <td style="padding:10px 0;text-align:right">
              ${u.isBlocked ? `
              <button class="btn btn-sm btn-gold" data-adm-toggle-block="${u.id}" style="padding:4px 10px;font-size:.72rem">
                ✅ Unblock
              </button>` : `
              <button class="btn btn-sm" data-adm-toggle-block="${u.id}" style="padding:4px 10px;font-size:.72rem;background:rgba(239,68,68,.12);color:var(--error);border:1px solid rgba(239,68,68,.3);border-radius:var(--r-sm)">
                🚫 Block
              </button>`}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }

  if (tab === 'returns') {
    const returnsList = state.returns || [];
    const underReviewCount = returnsList.filter(r => r.status === 'Under Review' || r.status === 'Requested').length;
    const approvedCount = returnsList.filter(r => r.status === 'Approved' || r.status === 'Refund Successful' || r.status === 'Refund Processed' || r.status === 'Return Approved (Ship Back)').length;
    const totalRefundVal = returnsList.reduce((s, r) => s + (r.amount || 0), 0);

    return `
    <h3 style="font-size:1.15rem;font-weight:700;color:var(--forest-dark);margin-bottom:12px">Returns, Refunds &amp; Exchanges Resolution Center</h3>
    
    <!-- Return status summary -->
    <div class="admin-summary-grid">
      <div class="admin-summary-card" style="border-top:4px solid #f59e0b">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">⏳</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#92400e">${underReviewCount}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Under Review</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #10b981">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">✅</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#065f46">${approvedCount}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Approved / Resolved</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid var(--forest)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">💰</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--forest-dark)">${formatPrice(totalRefundVal)}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Total Claimed Value</div>
      </div>
      <div class="admin-summary-card" style="background:var(--forest-dark);border-color:var(--forest-dark);border-top:4px solid var(--gold)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">📦</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--gold)">${returnsList.length}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.7);letter-spacing:0.5px">Total Cases</div>
      </div>
    </div>

    <!-- Returns Interactive Split View -->
    <div class="admin-split-grid">
      <!-- Left Column: Return Cases List -->
      <div class="admin-scroll-box admin-split-left" style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:18px;max-height:640px;overflow-y:auto">
        <h4 style="font-size:.95rem;margin-bottom:12px;color:var(--forest-dark);font-weight:700">Return &amp; Refund Requests (${returnsList.length})</h4>
        ${returnsList.length === 0 ? '<p style="color:var(--text-muted);font-size:.84rem;text-align:center;padding:30px 0">No return requests logged.</p>' : `
        <div style="display:flex;flex-direction:column;gap:10px">
          ${returnsList.map(r => `
          <div class="adm-return-card" data-retid="${r.id}" style="border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px;cursor:pointer;background:var(--sand-light);transition:all .2s ease">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-weight:800;font-size:.84rem;color:var(--forest-dark)">#${r.id} &bull; Order #${r.orderId}</span>
              <span class="badge ${r.status==='Refund Successful'||r.status==='Refund Processed'||r.status==='Approved'?'badge-forest':r.status==='Request Rejected'?'':'badge-gold'}" style="font-size:.65rem;${r.status==='Request Rejected'?'background:rgba(198,40,40,.15);color:var(--error)':''}">${r.status}</span>
            </div>
            <div style="font-weight:700;font-size:.82rem;color:var(--forest-dark)">${r.productName}</div>
            <div style="font-size:.74rem;color:#92400e;font-weight:600;margin-top:2px">${r.reason}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:.72rem;color:var(--text-muted)">
              <span>${r.customerName} (${r.phone || 'N/A'})</span>
              <span style="font-weight:800;color:var(--gold);font-size:.84rem">${formatPrice(r.amount)}</span>
            </div>
          </div>`).join('')}
        </div>`}
      </div>

      <!-- Right Column: Dedicated Return Discussion & Action Center -->
      <div class="admin-split-right" id="adm-return-chatbox" style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px 24px 36px 24px;display:flex;flex-direction:column;min-height:560px;box-shadow:var(--shadow-sm)">
        <p style="color:var(--text-muted);text-align:center;margin:auto;font-size:.86rem">Select a return case to review details, chat with customer, or update decision.</p>
      </div>
    </div>`;
  }

  if (tab === 'products') {
    return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
      <h3 style="font-size:1.1rem;font-weight:700;color:var(--forest-dark);margin:0">Product Catalog</h3>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="position:relative">
          <svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-muted);pointer-events:none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="prod-search-input" class="form-input" placeholder="Search products..." style="padding-left:30px;height:34px;font-size:.82rem;width:180px;border-radius:var(--r-md)">
        </div>
        <button class="btn btn-gold btn-sm" id="adm-add-prod-btn" style="padding:6px 12px;font-size:.78rem">${svgIcon('plus',14)} Add Product</button>
      </div>
    </div>

    <div class="admin-table-card">
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:.82rem;min-width:580px">
        <thead>
          <tr style="border-bottom:2px solid var(--forest-dark)">
            <th style="padding:8px 0">Image</th>
            <th style="padding:8px 0">Product Name</th>
            <th style="padding:8px 0">Category</th>
            <th style="padding:8px 0">Selling Price</th>
            <th style="padding:8px 0">Cost Price</th>
            <th style="padding:8px 0">Stock</th>
            <th style="padding:8px 0;text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody id="prod-catalog-tbody">
          ${state.products.map(p => `
          <tr style="border-bottom:1px solid var(--sand-border)" data-prod-name="${p.name.toLowerCase()}" data-prod-stock="${p.stockQty}">
            <td style="padding:8px 0"><img src="${p.image}" alt="${p.name}" style="width:34px;height:34px;object-fit:cover;border-radius:6px" onerror="this.style.background='#f4efe6'"></td>
            <td style="padding:8px 0;font-weight:700;color:var(--forest-dark)">${p.name}</td>
            <td style="padding:8px 0;color:var(--text-muted)">${p.category}</td>
            <td style="padding:8px 0;font-weight:700">${formatPrice(p.price)}</td>
            <td style="padding:8px 0;color:var(--text-muted)">${formatPrice(p.costPrice)}</td>
            <td style="padding:8px 0">
              <span class="badge ${p.stockQty<15?'':'badge-gold'}" style="font-size:.65rem;${p.stockQty<15?'background:rgba(198,40,40,.15);color:var(--error);':''}">${p.stockQty}</span>
            </td>
            <td style="padding:8px 0;text-align:right">
              <div style="display:inline-flex;gap:4px">
                <button class="icon-btn" data-adm-action="edit-prod" data-id="${p.id}" title="Edit Product" style="display:inline-flex;width:28px;height:28px;color:var(--forest);border:1px solid var(--sand-border);border-radius:6px;align-items:center;justify-content:center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="icon-btn" data-adm-action="delete-prod" data-id="${p.id}" title="Delete Product" style="display:inline-flex;width:28px;height:28px;color:var(--error);border:1px solid rgba(198,40,40,.25);border-radius:6px;align-items:center;justify-content:center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }

  if (tab === 'orders') {
    const oCount = { Processing: 0, Delivered: 0, Cancelled: 0, 'Out for Delivery': 0 };
    state.orders.forEach(o => { if (oCount[o.status] !== undefined) oCount[o.status]++; else oCount[o.status] = (oCount[o.status]||0)+1; });
    return `
    <h3 style="font-size:1.15rem;font-weight:700;color:var(--forest-dark);margin-bottom:12px">Customer Orders &amp; Delivery Dispatch</h3>
    <!-- Order status summary -->
    <div class="admin-summary-grid">
      <div class="admin-summary-card" style="border-top:4px solid #f59e0b">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">&#9203;</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#92400e">${oCount['Processing']||0}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Processing</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #3b82f6">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">&#128666;</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#1d4ed8">${oCount['Out for Delivery']||0}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Out for Delivery</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #10b981">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">&#9989;</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#065f46">${oCount['Delivered']||0}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Delivered</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #ef4444">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">&#10060;</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--error)">${oCount['Cancelled']||0}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Cancelled</div>
      </div>
      <div class="admin-summary-card" style="background:var(--forest-dark);border-color:var(--forest-dark);border-top:4px solid var(--gold)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">&#128230;</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--gold)">${state.orders.length}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.7);letter-spacing:0.5px">Total Orders</div>
      </div>
    </div>
    <div class="admin-table-card">
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:.82rem;min-width:640px">
        <thead>
          <tr style="border-bottom:2px solid var(--forest-dark)">
            <th style="padding:8px 0">Order ID</th>
            <th style="padding:8px 0">Customer Info</th>
            <th style="padding:8px 0">Delivery Address</th>
            <th style="padding:8px 0">Items Purchased</th>
            <th style="padding:8px 0">Total Payable</th>
            <th style="padding:8px 0">Delivery Status</th>
          </tr>
        </thead>
        <tbody>
          ${state.orders.map(o => `
          <tr style="border-bottom:1px solid var(--sand-border)">
            <td style="padding:10px 0;font-weight:800;color:var(--forest-dark)">#${o.id}</td>
            <td style="padding:10px 0">
              <div style="font-weight:700">${o.customerName}</div>
              <div style="font-size:.74rem;color:var(--text-muted)">${o.email} | ${o.phone}</div>
            </td>
            <td style="padding:10px 0;font-size:.78rem;color:var(--text-dark);max-width:180px">${o.address}</td>
            <td style="padding:10px 0;font-size:.78rem">${o.items.map(i=>`${i.name} (x${i.qty})`).join('<br>')}</td>
            <td style="padding:10px 0;font-weight:800;color:var(--forest-dark)">${formatPrice(o.total)}</td>
            <td style="padding:10px 0">
              <select class="form-input" data-adm-action="change-order-status" data-id="${o.id}" style="padding:5px 8px;font-size:.76rem;font-weight:700">
                <option value="Processing" ${o.status==='Processing'?'selected':''}>⏳ Processing</option>
                <option value="Out for Delivery" ${o.status==='Out for Delivery'?'selected':''}>🚚 Out for Delivery</option>
                <option value="Delivered" ${o.status==='Delivered'?'selected':''}>✅ Delivered</option>
                <option value="Cancelled" ${o.status==='Cancelled'?'selected':''}>❌ Cancelled</option>
              </select>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }

  return '';
}

function bindAdminEvents() {
  // Product catalog search
  const searchInput = document.getElementById('prod-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#prod-catalog-tbody tr');
      rows.forEach(row => {
        const name = row.dataset.prodName || '';
        const stock = row.dataset.prodStock || '';
        const match = name.includes(q) || stock.includes(q);
        row.style.display = match ? '' : 'none';
      });
    });
  }

  // Registered user search by name, ID, email, or phone
  const userSearchInput = document.getElementById('user-search-input');
  if (userSearchInput) {
    userSearchInput.addEventListener('input', () => {
      const q = userSearchInput.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#users-catalog-tbody tr');
      let visibleCount = 0;
      rows.forEach(row => {
        const name = (row.dataset.userName || '').toLowerCase();
        const id = (row.dataset.userId || '').toLowerCase();
        const email = (row.dataset.userEmail || '').toLowerCase();
        const phone = (row.dataset.userPhone || '').toLowerCase();
        const match = name.includes(q) || id.includes(q) || email.includes(q) || phone.includes(q);
        row.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });
      const countEl = document.getElementById('user-search-count');
      if (countEl) countEl.textContent = visibleCount;
    });
  }

  // IN-PLACE ADMIN TAB SWITCHING
  document.querySelectorAll('[data-adm-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      activeAdminTab = btn.dataset.admTab;

      document.querySelectorAll('[data-adm-tab]').forEach(b => {
        b.classList.toggle('active', b.dataset.admTab === activeAdminTab);
      });

      const container = document.getElementById('admin-tab-content');
      if (container) {
        container.innerHTML = renderAdminTabContent(activeAdminTab, state.getAnalytics());
        bindAdminEvents();
      }
    });
  });

  document.querySelectorAll('[data-adm-action="change-order-status"]').forEach(sel => {
    sel.addEventListener('change', () => {
      const orderId = sel.dataset.id;
      const newStatus = sel.value;
      state.updateOrderStatus(orderId, newStatus);
      showToast(`Order #${orderId} status updated to ${newStatus}!`);
    });
  });

  // Return & Refund status change
  document.querySelectorAll('[data-adm-return-status]').forEach(sel => {
    sel.addEventListener('change', () => {
      const retId = sel.dataset.admReturnStatus;
      const newStatus = sel.value;
      state.updateReturnStatus(retId, newStatus);
      showToast(`Return #${retId} status marked as ${newStatus}!`);
    });
  });

  // Quick process refund
  document.querySelectorAll('[data-adm-quick-refund]').forEach(btn => {
    btn.addEventListener('click', () => {
      const retId = btn.dataset.admQuickRefund;
      state.updateReturnStatus(retId, 'Refund Processed', 'Refund approved & processed to original payment method.');
      showToast(`Refund processed for #${retId}! 💰`);
      const container = document.getElementById('admin-tab-content');
      if (container) {
        container.innerHTML = renderAdminTabContent(activeAdminTab, state.getAnalytics());
        bindAdminEvents();
      }
    });
  });

  // Open linked query chat from return row
  // Return Card Clicks & Auto-Open First Return
  document.querySelectorAll('.adm-return-card').forEach(card => {
    card.addEventListener('click', () => {
      const retId = card.dataset.retid;
      document.querySelectorAll('.adm-return-card').forEach(c => {
        c.style.borderColor = c.dataset.retid === retId ? 'var(--forest)' : 'var(--sand-border)';
        c.style.background = c.dataset.retid === retId ? 'var(--white)' : 'var(--sand-light)';
      });
      openAdminReturnChat(retId);
    });
  });

  if (activeAdminTab === 'returns' && state.returns && state.returns.length > 0) {
    const firstRet = state.returns[0];
    const firstCard = document.querySelector(`.adm-return-card[data-retid="${firstRet.id}"]`);
    if (firstCard) {
      firstCard.style.borderColor = 'var(--forest)';
      firstCard.style.background = 'var(--white)';
    }
    openAdminReturnChat(firstRet.id);
  }

  const addProdBtn = document.getElementById('adm-add-prod-btn');
  if (addProdBtn) {
    addProdBtn.addEventListener('click', () => openAddProductModal());
  }

  document.querySelectorAll('[data-adm-action="delete-prod"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.id;
      if (confirm('Delete this product? This cannot be undone.')) {
        state.deleteProduct(pid);
        showToast('Product deleted from catalog.');
        activeAdminTab = 'products';
        renderPage('admin');
      }
    });
  });

  document.querySelectorAll('[data-adm-action="edit-prod"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.id;
      openEditProductModal(pid);
    });
  });

  document.querySelectorAll('.query-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const qid = card.dataset.id;
      openQueryChatbox(qid);
    });
  });

  document.querySelectorAll('[data-adm-toggle-block]').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.admToggleBlock;
      const u = state.toggleBlockUser(uid);
      if (u) {
        showToast(u.isBlocked ? `User ${u.name} has been suspended/blocked from logging in. 🚫` : `User ${u.name} has been unblocked! ✅`);
        const container = document.getElementById('admin-tab-content');
        if (container) {
          container.innerHTML = renderAdminTabContent('users', state.getAnalytics());
          bindAdminEvents();
        }
      }
    });
  });
}

function openAdminReturnChat(retId) {
  const r = (state.returns || []).find(item => item.id === retId);
  const box = document.getElementById('adm-return-chatbox');
  if (!box || !r) return;

  const chatMessages = r.chat || [];

  box.innerHTML = `
  <div style="display:flex;flex-direction:column;gap:14px;width:100%">
    <!-- Return & Customer Header Info -->
    <div style="border-bottom:1px solid var(--sand-border);padding-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px">
        <div>
          <h4 style="font-family:var(--font-sans);font-weight:700;font-size:1.12rem;color:var(--forest-dark);margin:0 0 2px">${r.productName}</h4>
          <div style="font-size:.76rem;color:var(--text-muted)">Return #${r.id} &bull; Order #${r.orderId} &bull; ${r.date}</div>
        </div>
        <div style="text-align:right">
          <span class="badge ${r.status==='Refund Successful'||r.status==='Refund Processed'||r.status==='Approved'?'badge-forest':r.status==='Request Rejected'?'':'badge-gold'}" style="font-size:.72rem;${r.status==='Request Rejected'?'background:rgba(239,68,68,.15);color:var(--error)':''}">${r.status}</span>
          <div style="font-weight:800;color:var(--gold);font-size:1.05rem;margin-top:2px">${formatPrice(r.amount)}</div>
        </div>
      </div>

      <!-- Customer Contact Info Pill -->
      <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:.76rem;background:var(--sand-light);padding:6px 10px;border-radius:var(--r-sm);margin-bottom:6px">
        <div><strong>Customer:</strong> ${r.customerName}</div>
        <div><strong>Phone:</strong> <a href="tel:${r.phone || ''}" style="color:var(--forest);font-weight:700">${r.phone || 'N/A'}</a></div>
        <div><strong>Email:</strong> ${r.email}</div>
      </div>

      <!-- Claim Reason & Issue Details -->
      <div style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:var(--r-sm);padding:6px 10px;font-size:.78rem;color:var(--text-dark)">
        <strong>Reason:</strong> ${r.reason} &mdash; <span style="color:var(--text-muted)">${r.details}</span>
      </div>
    </div>

    <!-- THE UNIFIED CHAT & DECISION CARD (Fully nested inside the large white card with proper breathing room) -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:14px 16px 16px 16px;display:flex;flex-direction:column;box-shadow:var(--shadow-sm);margin-bottom:6px">
      <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;color:var(--forest-dark);letter-spacing:.5px;margin-bottom:8px;display:flex;align-items:center;gap:6px">
        <span style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block"></span> Live Customer Conversation
      </div>

      <!-- Messages Viewport -->
      <div id="adm-ret-messages-viewport" style="flex-grow:1;overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:8px;margin-bottom:10px;padding-right:4px;height:200px;max-height:240px">
        ${chatMessages.map(msg => `
          <div class="chat-bubble ${msg.sender === 'Admin' || msg.sender === 'Aurite Returns Bot' ? 'chat-bubble-admin' : 'chat-bubble-customer'}" style="padding:8px 12px;font-size:.82rem">
            <div style="font-weight:700;font-size:.72rem;margin-bottom:2px;color:${msg.sender === 'Admin' || msg.sender === 'Aurite Returns Bot' ? 'var(--gold)' : 'var(--forest-dark)'}">
              ${msg.sender} &bull; ${msg.time}
            </div>
            <div style="white-space:pre-line">${msg.text}</div>
          </div>`).join('')}
      </div>

      <!-- Message input & send button -->
      <form id="adm-ret-reply-form" style="display:flex;gap:8px;padding-top:10px;border-top:1px solid var(--sand-border);margin-bottom:10px">
        <input type="text" id="adm-ret-reply-input" class="form-input" placeholder="Type your reply to customer..." required style="flex-grow:1;background:var(--white);height:38px;font-size:.82rem;padding:6px 10px">
        <button type="submit" class="btn btn-gold btn-sm" style="white-space:nowrap;padding:0 18px;font-size:.82rem;font-weight:700">Send Reply</button>
      </form>

      <!-- Decision / Status Dropdown integrated inside chat card -->
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:10px;border-top:1px dashed var(--sand-border);flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:1rem">⚖️</span>
          <label style="font-size:.80rem;font-weight:700;color:var(--forest-dark);white-space:nowrap">Decision / Status:</label>
        </div>
        <select id="adm-ret-status-dropdown" class="form-input" style="padding:6px 10px;font-size:.82rem;font-weight:700;border-radius:var(--r-sm);background:var(--white);min-width:240px;height:36px;cursor:pointer">
          <option value="Requested" ${r.status==='Requested'?'selected':''}>⏳ Requested</option>
          <option value="Under Review" ${r.status==='Under Review'?'selected':''}>🔍 Under Review</option>
          <option value="Awaiting Customer Reply" ${r.status==='Awaiting Customer Reply'?'selected':''}>💬 Awaiting Customer Reply</option>
          <option value="Return Approved (Ship Back)" ${r.status==='Return Approved (Ship Back)'?'selected':''}>📦 Return Approved (Ship Back)</option>
          <option value="Return In-Transit" ${r.status==='Return In-Transit'?'selected':''}>🚚 Return In-Transit</option>
          <option value="Exchange Initiated" ${r.status==='Exchange Initiated'?'selected':''}>🔄 Exchange Initiated</option>
          <option value="Exchange Delivered" ${r.status==='Exchange Delivered'?'selected':''}>✨ Exchange Delivered</option>
          <option value="Refund Approved" ${r.status==='Refund Approved'?'selected':''}>💰 Refund Approved</option>
          <option value="Refund Successful" ${r.status==='Refund Successful'?'selected':''}>💸 Refund Successful</option>
          <option value="Request Rejected" ${r.status==='Request Rejected'?'selected':''}>❌ Request Rejected</option>
          <option value="Case Closed" ${r.status==='Case Closed'?'selected':''}>🔒 Case Closed</option>
        </select>
      </div>
    </div>
  </div>`;

  // Handle live chat submit
  const replyForm = document.getElementById('adm-ret-reply-form');
  if (replyForm) {
    replyForm.addEventListener('submit', e => {
      e.preventDefault();
      const txt = document.getElementById('adm-ret-reply-input')?.value.trim();
      if (txt) {
        state.replyToReturnChat(r.id, txt, 'Admin');
        showToast('Reply sent to customer! 💬');
        openAdminReturnChat(r.id);
      }
    });
  }

  // Handle dropdown status change
  const statusDropdown = document.getElementById('adm-ret-status-dropdown');
  if (statusDropdown) {
    statusDropdown.addEventListener('change', () => {
      const newStatus = statusDropdown.value;
      state.updateReturnStatus(r.id, newStatus);
      showToast(`Status updated to "${newStatus}"! ✅`);
      const container = document.getElementById('admin-tab-content');
      if (container) {
        container.innerHTML = renderAdminTabContent('returns', state.getAnalytics());
        bindAdminEvents();
        setTimeout(() => openAdminReturnChat(r.id), 50);
      }
    });
  }

  // Bind mousewheel handler so chat box scrolls internally instead of scrolling the window
  const vp = document.getElementById('adm-ret-messages-viewport');
  if (vp) {
    vp.addEventListener('wheel', e => {
      const delta = e.deltaY;
      const canScrollUp = vp.scrollTop > 0;
      const canScrollDown = vp.scrollTop + vp.clientHeight < vp.scrollHeight;
      if ((delta < 0 && canScrollUp) || (delta > 0 && canScrollDown)) {
        vp.scrollTop += delta;
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
  }

  scrollChatToBottom('adm-ret-messages-viewport');
}

function refreshAdminReturns(currentRetId) {
  const container = document.getElementById('admin-tab-content');
  if (container) {
    container.innerHTML = renderAdminTabContent('returns', state.getAnalytics());
    bindAdminEvents();
    if (currentRetId) setTimeout(() => openAdminReturnChat(currentRetId), 50);
  }
}

function openQueryChatbox(qid) {
  const q = state.queries.find(item => item.id === qid);
  const box = document.getElementById('query-chatbox');
  if (!box || !q) return;

  box.innerHTML = `
  <div style="border-bottom:1px solid var(--sand-border);padding-bottom:14px;margin-bottom:12px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
      <h4 style="font-family:var(--font-sans);font-weight:700;font-size:1.18rem;color:var(--forest-dark);margin:0">${q.customerName}</h4>
      <span class="badge ${q.status==='Open'?'badge-forest':q.status==='Answered'?'badge-gold':''}" style="${q.status==='Resolved'?'background:var(--success);color:#fff':''}${q.status==='Closed'?'background:#888;color:#fff':''}">${q.status}</span>
    </div>
    <div style="font-size:.82rem;font-weight:600;color:var(--text-dark)">${q.subject}</div>
    <div style="font-size:.74rem;color:var(--text-muted);margin-top:2px">${q.email} &bull; ${q.date}</div>
  </div>

  <!-- Spacious Messages View: Customer Left, Admin Right with auto-scroll -->
  <div id="query-messages-viewport" style="flex-grow:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;margin-bottom:14px;min-height:340px;max-height:440px;padding-right:4px">
    <div class="chat-bubble chat-bubble-customer">
      <div style="font-weight:700;font-size:.76rem;margin-bottom:3px;color:var(--forest-dark)">${q.customerName} &bull; ${q.date}</div>
      <div style="white-space:pre-line">${q.message}</div>
    </div>
    ${q.replies.map(r=>`
      <div class="chat-bubble chat-bubble-admin">
        <div style="font-weight:700;font-size:.76rem;margin-bottom:3px;color:var(--gold)">Admin &bull; ${r.time}</div>
        <div style="white-space:pre-line">${r.text}</div>
      </div>`).join('')}
  </div>

  <!-- Pinned Bottom Action & Reply Area (Zero dead space) -->
  <div style="border-top:1px solid var(--sand-border);padding-top:12px;margin-top:auto">
    <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
      <button class="btn btn-sm btn-ghost" data-adm-query-status="Open" data-qid="${q.id}" style="font-size:.75rem;padding:4px 10px;border-color:var(--forest);color:var(--forest);font-weight:700">Mark Open</button>
      <button class="btn btn-sm btn-ghost" data-adm-query-status="Resolved" data-qid="${q.id}" style="font-size:.75rem;padding:4px 10px;border-color:var(--success);color:var(--success);font-weight:700">Mark Resolved</button>
      <button class="btn btn-sm btn-ghost" data-adm-query-status="Closed" data-qid="${q.id}" style="font-size:.75rem;padding:4px 10px;border-color:var(--error);color:var(--error);font-weight:700">Mark Closed</button>
    </div>
    <form id="adm-reply-form" style="display:flex;gap:10px">
      <input type="text" id="adm-reply-input" class="form-input" placeholder="Type your reply to customer..." required style="flex-grow:1">
      <button type="submit" class="btn btn-gold btn-sm">Send Reply</button>
    </form>
  </div>`;

  const form = document.getElementById('adm-reply-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const txt = document.getElementById('adm-reply-input')?.value.trim();
      if (txt) {
        state.replyToQuery(q.id, txt);
        showToast('Reply sent to customer!');
        openQueryChatbox(q.id);
      }
    });
  }
  // Status change buttons in chatbox
  box.querySelectorAll('[data-adm-query-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newStatus = btn.dataset.admQueryStatus;
      const theQ = state.queries.find(item => item.id === btn.dataset.qid);
      if (theQ) {
        theQ.status = newStatus;
        if (newStatus === 'Resolved' || newStatus === 'Closed') {
          theQ.resolvedAt = new Date().toISOString();
        } else {
          delete theQ.resolvedAt;
        }
        state._notify({ queries: true });
        showToast(`Query marked as ${newStatus}`);
        openQueryChatbox(q.id);
      }
    });
  });

  scrollChatToBottom('query-messages-viewport');
}

function openEditProductModal(pid) {
  setModalBackgroundFreeze(true);
  const p = state.products.find(prod => prod.id === pid);
  if (!p) return;
  const box = document.getElementById('modal-box');
  if (!box) return;

  box.innerHTML = `
  <div class="modal-overlay open" id="edit-prod-overlay">
    <div class="modal-card modal-lg">
      <button class="modal-close-btn" id="edit-prod-close">${svgIcon('close',20)}</button>
      <h3 style="font-size:1.3rem;font-weight:700;color:var(--forest-dark);margin-bottom:20px">Edit Product</h3>
      <form id="edit-prod-form" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group"><label class="form-label">Product Name *</label><input type="text" id="ep-name" class="form-input" required value="${p.name.replace(/"/g,'&quot;')}"></div>
        <div class="form-group"><label class="form-label">Category *</label>
          <select id="ep-cat" class="form-input">
            <option ${p.category==='Vitality & Brain'?'selected':''}>Vitality &amp; Brain</option>
            <option ${p.category==='Minerals & Sleep'?'selected':''}>Minerals &amp; Sleep</option>
            <option ${p.category==='Daily Greens & Gut'?'selected':''}>Daily Greens &amp; Gut</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Selling Price (&#8377;) *</label><input type="number" id="ep-price" class="form-input" required value="${p.price}"></div>
        <div class="form-group"><label class="form-label">Cost Price (&#8377;) *</label><input type="number" id="ep-cost" class="form-input" required value="${p.costPrice || 0}"></div>
        <div class="form-group"><label class="form-label">Stock Quantity *</label><input type="number" id="ep-stock" class="form-input" required value="${p.stockQty || 0}"></div>
        <div class="form-group"><label class="form-label">Badge Label</label><input type="text" id="ep-badge" class="form-input" value="${p.badge || ''}"></div>
        <div class="form-group" style="grid-column:1 / -1">
          <label class="form-label">Product Images (URLs)</label>
          <div id="ep-img-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px">
            ${(p.images && p.images.length > 0 ? p.images : [p.image||'']).map((url, idx) => `
            <div class="ep-img-row" style="display:flex;gap:8px;align-items:center">
              <input type="text" class="form-input ep-img-input" value="${url}" style="flex:1" placeholder="/images/product.jpg">
              ${idx > 0 ? `<button type="button" class="img-remove-btn" style="flex-shrink:0;width:30px;height:30px;background:transparent;border:1.5px solid var(--error);color:var(--error);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;font-weight:700">&times;</button>` : ''}
            </div>`).join('')}
          </div>
          <button type="button" id="ep-add-img-btn" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:1.5px dashed var(--forest);background:transparent;color:var(--forest);border-radius:var(--r-md);font-size:.82rem;font-weight:700;cursor:pointer">
            ${svgIcon('plus',14)} Add Another Image
          </button>
        </div>
        <div class="form-group" style="grid-column:1 / -1"><label class="form-label">Tagline / Subtitle</label><input type="text" id="ep-tagline" class="form-input" value="${(p.tagline||'').replace(/"/g,'&quot;')}"></div>
        <div class="form-group" style="grid-column:1 / -1"><label class="form-label">Servings Format</label><input type="text" id="ep-servings" class="form-input" value="${(p.servings||'').replace(/"/g,'&quot;')}"></div>
        <div class="form-group" style="grid-column:1 / -1"><label class="form-label">Description</label><textarea id="ep-desc" class="form-input" rows="3">${p.description || ''}</textarea></div>
        <div class="form-group" style="grid-column:1 / -1">
          <label class="form-label">Product Highlights <span style="font-size:.78rem;color:var(--text-muted);font-weight:400">(one per line)</span></label>
          <textarea id="ep-highlights" class="form-input" rows="4" placeholder="100% Lab Tested&#10;Enteric Shielded&#10;No Artificial Additives">${(p.highlights || []).join('\n')}</textarea>
        </div>
        <button type="submit" class="btn btn-gold btn-lg" style="grid-column:1 / -1;margin-top:8px">Save Changes &#8594;</button>
      </form>
    </div>
  </div>`;

  // Wire up remove buttons for pre-existing rows
  document.querySelectorAll('#ep-img-list .img-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.ep-img-row')?.remove());
  });

  // Add image row
  document.getElementById('ep-add-img-btn')?.addEventListener('click', () => {
    const list = document.getElementById('ep-img-list');
    if (!list) return;
    const row = document.createElement('div');
    row.className = 'ep-img-row';
    row.style.cssText = 'display:flex;gap:8px;align-items:center';
    row.innerHTML = `
      <input type="text" class="form-input ep-img-input" placeholder="/images/extra.jpg" style="flex:1">
      <button type="button" class="img-remove-btn" style="flex-shrink:0;width:30px;height:30px;background:transparent;border:1.5px solid var(--error);color:var(--error);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;font-weight:700">&times;</button>
    `;
    row.querySelector('.img-remove-btn')?.addEventListener('click', () => row.remove());
    list.appendChild(row);
  });

  const overlay = document.getElementById('edit-prod-overlay');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModals(); });
  const closeBtn = document.getElementById('edit-prod-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModals);

  const form = document.getElementById('edit-prod-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // collect all image URLs from the list
      const imgInputs = document.querySelectorAll('.ep-img-input');
      const imgUrls = Array.from(imgInputs).map(i => i.value.trim()).filter(Boolean);
      const updatedFields = {
        name: document.getElementById('ep-name')?.value,
        category: document.getElementById('ep-cat')?.value,
        price: parseFloat(document.getElementById('ep-price')?.value || 0),
        costPrice: parseFloat(document.getElementById('ep-cost')?.value || 0),
        stockQty: parseInt(document.getElementById('ep-stock')?.value || 0),
        badge: document.getElementById('ep-badge')?.value || p.badge,
        image: imgUrls[0] || p.image,
        images: imgUrls,
        tagline: document.getElementById('ep-tagline')?.value || p.tagline,
        servings: document.getElementById('ep-servings')?.value || p.servings,
        description: document.getElementById('ep-desc')?.value || p.description,
        highlights: (document.getElementById('ep-highlights')?.value || '').split('\n').map(s=>s.trim()).filter(Boolean),
      };
      state.updateProduct(pid, updatedFields);
      showToast('Product updated successfully! \u2705');
      closeModals();
      activeAdminTab = 'products';
      renderPage('admin');
    });
  }
}

function openAddProductModal() {
  setModalBackgroundFreeze(true);
  const box = document.getElementById('modal-box');
  if (!box) return;

  box.innerHTML = `
  <div class="modal-overlay open" id="add-prod-overlay">
    <div class="modal-card modal-lg">
      <button class="modal-close-btn" id="add-prod-close">${svgIcon('close',20)}</button>
      <h3 style="font-size:1.3rem;font-weight:700;color:var(--forest-dark);margin-bottom:18px">Add New Product to Catalog</h3>
      <form id="add-prod-form" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group"><label class="form-label">Product Name *</label><input type="text" id="ap-name" class="form-input" required placeholder="e.g. Aurite Bio-Active NMN"></div>
        <div class="form-group"><label class="form-label">Category *</label><select id="ap-cat" class="form-input"><option>Vitality &amp; Brain</option><option>Minerals &amp; Sleep</option><option>Daily Greens &amp; Gut</option></select></div>
        <div class="form-group"><label class="form-label">Selling Price (&#8377;) *</label><input type="number" id="ap-price" class="form-input" required placeholder="3999"></div>
        <div class="form-group"><label class="form-label">Production Cost (&#8377;) *</label><input type="number" id="ap-cost" class="form-input" required placeholder="1200"></div>
        <div class="form-group"><label class="form-label">Stock Quantity *</label><input type="number" id="ap-stock" class="form-input" required placeholder="50"></div>
        <div class="form-group"><label class="form-label">Badge Label</label><input type="text" id="ap-badge" class="form-input" placeholder="New Release"></div>
        <div class="form-group" style="grid-column:1 / -1">
          <label class="form-label">Product Images (URLs)</label>
          <div id="ap-img-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px">
            <div class="img-url-row" style="display:flex;gap:8px;align-items:center">
              <input type="text" class="form-input ap-img-input" placeholder="/images/product.jpg" style="flex:1" value="">
            </div>
          </div>
          <button type="button" id="ap-add-img-btn" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:1.5px dashed var(--forest);background:transparent;color:var(--forest);border-radius:var(--r-md);font-size:.82rem;font-weight:700;cursor:pointer">
            ${svgIcon('plus',14)} Add Another Image
          </button>
        </div>
        <div class="form-group" style="grid-column:1 / -1"><label class="form-label">Servings Format</label><input type="text" id="ap-servings" class="form-input" placeholder="e.g. 60 Capsules (30-Day Supply)" value=""></div>
        <div class="form-group" style="grid-column:1 / -1"><label class="form-label">Description</label><textarea id="ap-desc" class="form-input" rows="3" placeholder="Describe product clinical benefits and ingredients..."></textarea></div>
        <div class="form-group" style="grid-column:1 / -1">
          <label class="form-label">Product Highlights <span style="font-size:.78rem;color:var(--text-muted);font-weight:400">(one per line)</span></label>
          <textarea id="ap-highlights" class="form-input" rows="4" placeholder="100% Lab Tested&#10;Enteric Shielded&#10;No Artificial Additives"></textarea>
        </div>
        <button type="submit" class="btn btn-gold btn-lg" style="grid-column:1 / -1;margin-top:10px">Publish Product to Shop Catalog &rarr;</button>
      </form>
    </div>
  </div>`;

  // Add image row button
  document.getElementById('ap-add-img-btn')?.addEventListener('click', () => {
    const list = document.getElementById('ap-img-list');
    if (!list) return;
    const row = document.createElement('div');
    row.className = 'img-url-row';
    row.style.cssText = 'display:flex;gap:8px;align-items:center';
    row.innerHTML = `
      <input type="text" class="form-input ap-img-input" placeholder="/images/extra.jpg" style="flex:1">
      <button type="button" class="img-remove-btn" style="flex-shrink:0;width:30px;height:30px;background:transparent;border:1.5px solid var(--error);color:var(--error);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;font-weight:700">&times;</button>
    `;
    row.querySelector('.img-remove-btn')?.addEventListener('click', () => row.remove());
    list.appendChild(row);
  });

  const overlay = document.getElementById('add-prod-overlay');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModals(); });
  const closeBtn = document.getElementById('add-prod-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModals);

  const form = document.getElementById('add-prod-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // collect all image URLs
      const imgInputs = document.querySelectorAll('.ap-img-input');
      const imgUrls = Array.from(imgInputs).map(i => i.value.trim()).filter(Boolean);
      const newP = {
        id: `prod-${Date.now()}`,
        name: document.getElementById('ap-name')?.value,
        category: document.getElementById('ap-cat')?.value,
        price: parseFloat(document.getElementById('ap-price')?.value || 0),
        costPrice: parseFloat(document.getElementById('ap-cost')?.value || 0),
        stockQty: parseInt(document.getElementById('ap-stock')?.value || 0),
        badge: document.getElementById('ap-badge')?.value || 'New Product',
        image: imgUrls[0] || '/images/omega3.jpg',
        images: imgUrls,
        servings: document.getElementById('ap-servings')?.value,
        description: document.getElementById('ap-desc')?.value,
        tagline: "Cellular Bio-Available Nutrition",
        rating: 4.9,
        reviewsCount: 1,
        highlights: (document.getElementById('ap-highlights')?.value || '').split('\n').map(s=>s.trim()).filter(Boolean)
      };
      state.addProduct(newP);
      showToast('New product added to catalog successfully! \uD83C\uDF89');
      closeModals();
      activeAdminTab = 'products';
      renderPage('admin');
    });
  }
}

function openLegalModal(type) {
  setModalBackgroundFreeze(true);
  const box = document.getElementById('modal-box');
  if (!box) return;
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy &amp; Security Policy' : 'Terms &amp; Conditions';
  const content = isPrivacy ? `
    <h4 style="color:var(--forest-dark);margin-bottom:8px">1. Information We Collect</h4>
    <p>We collect information you provide directly to us, including your name, email address, phone number, and delivery address when you register or place an order. We also collect payment information securely through our payment partners — Aurite does not store card details on our servers.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">2. How We Use Your Information</h4>
    <p>Your information is used exclusively to process orders, provide customer support, send order confirmations and shipping updates, and improve our products and services. We do not sell, rent, or trade your personal information to third parties under any circumstances.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">3. Data Security</h4>
    <p>All data is encrypted in transit using TLS 1.3. Stored customer data is protected with AES-256 encryption. We conduct regular security audits and vulnerability assessments. Access to your personal data is restricted to authorized Aurite personnel only on a need-to-know basis.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">4. Cookies &amp; Tracking</h4>
    <p>We use essential cookies to maintain your shopping cart and login session. We use analytics cookies (anonymized) to understand site traffic patterns and improve your experience. You may disable non-essential cookies in your browser settings without affecting core functionality.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">5. Your Rights</h4>
    <p>You have the right to access, correct, or delete your personal data at any time from the Personal Details section of your profile. You may also submit a data deletion request to <a href="mailto:aurite@gmail.com" style="color:var(--gold)">aurite@gmail.com</a> and we will process it within 7 business days.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">6. Third-Party Services</h4>
    <p>We use trusted third-party payment and delivery partners. These partners have their own privacy policies and we encourage you to review them. We share only the minimum necessary information required to fulfil your order.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">7. Contact</h4>
    <p>For any privacy-related concerns, please contact us at <a href="mailto:aurite@gmail.com" style="color:var(--gold)">aurite@gmail.com</a>. Last updated: August 2026.</p>
  ` : `
    <h4 style="color:var(--forest-dark);margin-bottom:8px">1. Acceptance of Terms</h4>
    <p>By accessing or using the Aurite website, placing an order, or creating an account, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please discontinue use of the service immediately.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">2. Product Information</h4>
    <p>All product information, including nutritional data and health claims, is provided for informational purposes only. Aurite products are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any supplement regimen.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">3. Orders &amp; Pricing</h4>
    <p>All prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Aurite reserves the right to modify pricing at any time without prior notice. Orders are confirmed only upon successful payment processing.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">4. Shipping &amp; Delivery</h4>
    <p>Standard delivery takes 5–7 business days. Express delivery options may be available at checkout. Aurite is not liable for delays caused by courier partners, weather events, or circumstances beyond our control.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">5. Returns &amp; Refunds</h4>
    <p>If you receive a damaged or incorrect product, please contact <a href="mailto:aurite@gmail.com" style="color:var(--gold)">aurite@gmail.com</a> within 48 hours of delivery with photographic evidence. We will arrange a replacement or full refund at our discretion. Opened products cannot be returned due to health and safety regulations.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">6. Account Responsibility</h4>
    <p>You are responsible for maintaining the confidentiality of your account credentials. Aurite is not liable for any unauthorized access resulting from your failure to secure your login information.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">7. Intellectual Property</h4>
    <p>All content on this website, including text, images, logos, and product data, is the intellectual property of Aurite Nutraceutical Laboratories Inc. and is protected by applicable copyright and trademark laws. Reproduction without written consent is prohibited.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">8. Governing Law</h4>
    <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts of Pune, Maharashtra. Last updated: August 2026.</p>
  `;

  box.innerHTML = `
  <div class="modal-overlay open" id="legal-modal-overlay" style="z-index:9999">
    <div class="modal-card" style="max-width:640px;max-height:82vh;display:flex;flex-direction:column">
      <button class="modal-close-btn" id="legal-modal-close" style="flex-shrink:0">${svgIcon('close',20)}</button>
      <h3 style="font-size:1.3rem;font-weight:700;color:var(--forest-dark);margin-bottom:4px;flex-shrink:0">${title}</h3>
      <div style="width:48px;height:3px;background:var(--gold);border-radius:2px;margin-bottom:20px;flex-shrink:0"></div>
      <div style="overflow-y:auto;flex-grow:1;padding-right:6px;font-size:.88rem;color:var(--text-muted);line-height:1.75">
        ${content}
      </div>
    </div>
  </div>`;

  const overlay = document.getElementById('legal-modal-overlay');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModals(); });
  const closeBtn = document.getElementById('legal-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModals);
}


// ============================================================
// PROFILE & CUSTOMER DASHBOARD
// ============================================================
let profileTab = 'orders';
function purgeOldResolvedQueries() {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  state.queries = state.queries.filter(q => {
    if (q.status === 'Resolved' || q.status === 'Closed') {
      const resolvedAt = q.resolvedAt ? new Date(q.resolvedAt).getTime() : 0;
      return resolvedAt === 0 || resolvedAt > cutoff;
    }
    return true;
  });
}

function renderProfileMobile() {
  if (!state.user) {
    return `
    <div style="padding-top:84px;padding-bottom:60px;min-height:75vh;display:flex;align-items:center;justify-content:center">
      <div class="container" style="max-width:440px;text-align:center">
        <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-xl);padding:36px 24px;box-shadow:var(--shadow-md)">
          <div style="width:64px;height:64px;border-radius:50%;background:rgba(20,51,37,.06);color:var(--forest);display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
            ${svgIcon('user', 28)}
          </div>
          <span class="badge badge-gold" style="font-size:.65rem;margin-bottom:8px">Member Account</span>
          <h2 style="font-family:var(--font-serif);font-size:1.4rem;color:var(--forest-dark);margin-bottom:8px">Welcome to Aurite</h2>
          <p style="font-size:.82rem;color:var(--text-muted);line-height:1.6;margin-bottom:24px">
            Sign in to view your order history, track shipments, check return status, and manage personal profile details.
          </p>
          <div style="display:flex;flex-direction:column;gap:10px">
            <button class="btn btn-primary" data-action="open-login" style="width:100%;font-size:.86rem;padding:12px;font-weight:700">Sign In / Register</button>
            <button class="btn btn-ghost" data-route="shop" style="width:100%;font-size:.82rem;padding:10px">Explore Products</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  if (state.isAdmin && (profileTab === 'orders' || profileTab === 'queries')) {
    profileTab = 'settings';
  }
  purgeOldResolvedQueries();

  const user = state.user;
  const initials = getInitials(user.name);
  const myOrders = state.orders.filter(o => o.email === user.email || o.customerName === user.name);
  const myQueries = state.queries.filter(q => q.email === user.email);
  const openQueriesCount = myQueries.filter(q => q.status === 'Open' || q.status === 'Answered').length;

  const tabs = [
    ...(!state.isAdmin ? [
      { id:'orders', label:`Orders (${myOrders.length})`, icon:'order' },
      { id:'queries', label:`Queries${openQueriesCount > 0 ? ` (${openQueriesCount})` : ''}`, icon:'chat' }
    ] : []),
    { id:'settings', label:'Details', icon:'user' },
  ];

  return `
  <div style="padding-top:76px;padding-bottom:60px;min-height:80vh;">
    <div class="container" style="max-width:640px">

      <!-- Profile Header Card -->
      <div style="background:var(--forest-dark);border-radius:var(--r-xl);padding:14px 14px;margin-bottom:14px;box-shadow:var(--shadow-md)">
        <div style="display:flex;align-items:flex-start;gap:12px;width:100%">
          <div style="width:42px;height:42px;border-radius:50%;background:var(--gold);color:var(--forest-dark);display:flex;align-items:center;justify-content:center;font-size:1.05rem;font-weight:800;flex-shrink:0;letter-spacing:-.5px">${initials}</div>
          <div style="min-width:0;flex-grow:1;display:flex;flex-direction:column;gap:2px">
            <div style="font-family:var(--font-serif);font-size:.98rem;color:var(--sand-light);font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.2">${user.name}</div>
            <div style="font-size:.72rem;color:rgba(250,247,242,.75);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3">${user.email}</div>
            
            <!-- Bottom row: AURITE MEMBER badge and compact Sign Out button -->
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px;width:100%">
              <span style="display:inline-flex;align-items:center;background:var(--gold);color:var(--forest-dark);border-radius:999px;padding:2px 7px;font-size:.52rem;font-weight:800;letter-spacing:.04em;line-height:1;white-space:nowrap">${state.isAdmin ? 'EXECUTIVE ADMIN' : 'AURITE MEMBER'}</span>
              <button id="profile-logout-btn" data-action="logout" type="button" style="flex-shrink:0;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:var(--r-md);padding:3px 8px;font-size:.64rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;transition:all .18s;line-height:1">
                ${svgIcon('logout',11)} Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Buttons in a Row (Full Width Auto-Fit Grid) -->
      <div class="profile-tabs-row">
        ${tabs.map(t=>`
        <button class="profile-nav-btn ${profileTab===t.id?'active':''}" data-profile-tab="${t.id}" type="button">
          ${svgIcon(t.icon, 16)} <span>${t.label}</span>
        </button>`).join('')}
      </div>

      <!-- Tab Content Area -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-xl);padding:20px;box-shadow:var(--shadow-sm)" id="profile-content">
        ${profileTab==='orders' ? renderOrdersTab() : profileTab==='queries' ? renderUserQueriesTab() : renderSettingsTab(user)}
      </div>

    </div>
  </div>`;
}

function renderProfileDesktop() {
  if (state.isAdmin && (profileTab === 'orders' || profileTab === 'queries')) {
    profileTab = 'settings';
  }
  purgeOldResolvedQueries();
  const user = state.user || { name:'Alex Mercer', email:'alex@example.com', membership:'Aurite Member', memberSince:'2026' };
  const initials = getInitials(user.name);
  const myQueries = state.queries.filter(q => !state.user || q.email === state.user.email);
  const openQueriesCount = myQueries.filter(q => q.status === 'Open' || q.status === 'Answered').length;

  return `
  <div class="container section-padding">
    <div class="profile-grid" style="display:grid;grid-template-columns:280px 1fr;gap:40px;align-items:start">
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;box-shadow:var(--shadow-sm)" class="profile-sidebar">
        <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid var(--sand-border);margin-bottom:20px">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--forest);color:var(--sand-light);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;margin:0 auto 12px">${initials}</div>
          <h3 style="font-family:var(--font-serif);font-size:1.2rem;margin-bottom:6px;color:var(--forest-dark)">${user.name}</h3>
          <span class="badge badge-gold">Aurite Member</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${!state.isAdmin ? `
          <button class="profile-nav-btn ${profileTab==='orders'?'active':''}" data-profile-tab="orders" type="button">${svgIcon('order',18)}<span>Order History</span></button>
          <button class="profile-nav-btn ${profileTab==='queries'?'active':''}" data-profile-tab="queries" type="button">${svgIcon('chat',18)}<span>My Queries${openQueriesCount>0?` <span style="background:var(--error);color:#fff;border-radius:999px;padding:1px 7px;font-size:.7rem;font-weight:700">${openQueriesCount}</span>`:''}</span></button>
          ` : ''}
          <button class="profile-nav-btn ${profileTab==='settings'?'active':''}" data-profile-tab="settings" type="button">${svgIcon('user',18)}<span>Personal Details</span></button>
          <button class="profile-nav-btn" id="profile-logout-btn" style="color:var(--error);margin-top:16px" type="button">${svgIcon('logout',18)}<span>Sign Out</span></button>
        </div>
      </div>
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:36px;box-shadow:var(--shadow-sm)" id="profile-content">
        ${profileTab==='orders' ? renderOrdersTab() : profileTab==='queries' ? renderUserQueriesTab() : renderSettingsTab(user)}
      </div>
    </div>
  </div>`;
}

function renderProfile() {
  return window.innerWidth >= 900 ? renderProfileDesktop() : renderProfileMobile();
}


function isOrderWithin2Days(orderDateStr) {
  if (!orderDateStr) return true;
  try {
    const d = new Date(orderDateStr);
    if (isNaN(d.getTime())) return true;
    const now = new Date();
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 2.0;
  } catch (e) {
    return true;
  }
}

function renderOrdersTabMobile() {
  if (!state.user) return '';
  const myOrders = state.orders.filter(o => o.email === state.user.email || o.customerName === state.user.name);
  const ordersToShow = myOrders.length > 0 ? myOrders : state.orders;

  if (!ordersToShow.length) return `
  <div style="text-align:center;padding:48px 16px;color:var(--text-muted)">
    <div style="font-size:2.8rem;margin-bottom:10px">📦</div>
    <p style="font-size:1rem;font-weight:700;color:var(--forest-dark)">No orders found</p>
    <p style="font-size:.82rem;margin-top:4px">When you place an order, it will appear here with live tracking.</p>
    <button class="btn btn-primary btn-sm" data-route="shop" style="margin-top:16px;font-size:.82rem">Start Shopping</button>
  </div>`;

  const statusConfig = {
    'Processing': { color: '#f59e0b', bg: 'rgba(245,158,11,.1)', icon: '⏳' },
    'Out for Delivery': { color: '#3b82f6', bg: 'rgba(59,130,246,.1)', icon: '🚚' },
    'Delivered': { color: '#10b981', bg: 'rgba(16,185,129,.1)', icon: '✅' },
    'Cancelled': { color: '#ef4444', bg: 'rgba(239,68,68,.1)', icon: '❌' }
  };

  return `
  <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
    <div>
      <h3 style="font-family:var(--font-serif);font-size:1.15rem;color:var(--forest-dark);margin:0">Order History</h3>
      <p style="font-size:.76rem;color:var(--text-muted);margin-top:2px">${ordersToShow.length} order${ordersToShow.length>1?'s':''} placed</p>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px">
    ${ordersToShow.map(o => {
      const cfg = statusConfig[o.status] || { color:'var(--forest)',bg:'rgba(20,51,37,.08)',icon:'📦' };
      const isDelivered = (o.status === 'Delivered');
      const isProcessing = (o.status === 'Processing');
      const within2Days = isOrderWithin2Days(o.deliveredDate || o.date);

      return `
      <div class="profile-order-card" style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow-sm);transition:all .3s ease;margin-bottom:14px">
        <!-- ORDER HEADER -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:12px 14px;background:rgba(20,51,37,.04);border-bottom:1px solid var(--sand-border);gap:8px">
          <div>
            <div style="font-weight:800;color:var(--forest-dark);font-size:.88rem;letter-spacing:-0.01em">#${o.id}</div>
            <div style="font-size:.70rem;color:var(--text-muted);margin-top:1px">Placed on ${o.date}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end">
            <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;background:${cfg.bg};color:${cfg.color};font-size:.66rem;font-weight:700;line-height:1">
              <span style="width:5px;height:5px;border-radius:50%;background:${cfg.color};display:inline-block"></span>
              ${o.status.toUpperCase()}
            </span>
            ${isProcessing ? `
            <button class="btn btn-sm profile-action-btn" data-action="cancel-order" data-oid="${o.id}"
              style="padding:3px 7px;font-size:.65rem;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#ef4444;border-radius:var(--r-md);font-weight:700;cursor:pointer">
              Cancel
            </button>` : ''}
            <div style="font-weight:800;color:var(--forest-dark);font-size:.90rem;margin-left:2px">${formatPrice(o.total)}</div>
          </div>
        </div>

        <!-- ORDER ITEMS -->
        <div style="padding:10px 14px">
          <div style="display:flex;flex-direction:column;gap:10px">
            ${o.items.map(i => {
              const hasReviewed = state.reviews && state.reviews.find(r => r.orderId === o.id && r.productId === i.id);
              const existingReturn = (state.returns || []).find(r => r.orderId === o.id && r.productId === i.id);
              const prod = state.products.find(p2 => p2.id === i.id);
              return `
              <div style="display:flex;flex-direction:column;gap:6px;padding:8px 0;border-bottom:1px dashed var(--sand-border)">
                <div style="display:flex;align-items:center;gap:10px;width:100%">
                  ${prod ? `
                  <img src="${prod.image}" alt="${i.name}" class="order-prod-link" data-pid="${i.id}" style="width:42px;height:42px;object-fit:cover;border-radius:var(--r-sm);flex-shrink:0;cursor:pointer" onerror="this.style.background='#f4efe6'">` : `<div class="order-prod-link" data-pid="${i.id}" style="width:42px;height:42px;border-radius:var(--r-sm);background:var(--sand);flex-shrink:0;cursor:pointer"></div>`}
                  
                  <div style="flex-grow:1;min-width:0">
                    <a href="#product/${i.id}" class="order-prod-link" data-pid="${i.id}" style="font-weight:700;font-size:.78rem;color:var(--forest-dark);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;text-decoration:none;display:block">${i.name}</a>
                    <div style="font-size:.70rem;color:var(--text-muted);margin-top:2px">Qty: ${i.qty} &bull; ${formatPrice(i.unitPrice || 0)}</div>
                  </div>
                </div>

                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-start;padding-left:52px">
                  <!-- Return & Exchange (Delivered Only, within 2 days) -->
                  ${existingReturn ? `
                  <div style="display:flex;align-items:center;gap:4px">
                    <span class="badge ${existingReturn.status==='Approved'||existingReturn.status==='Refund Successful'?'badge-forest':'badge-gold'}" style="font-size:.62rem;padding:2px 6px">
                      Return: ${existingReturn.status}
                    </span>
                    <button class="btn btn-sm btn-ghost profile-action-btn" data-action="view-return-chat" data-retid="${existingReturn.id}"
                      style="padding:3px 6px;font-size:.64rem;border-color:var(--forest);color:var(--forest);font-weight:700;cursor:pointer">
                      💬 Return Chat
                    </button>
                  </div>` : (isDelivered ? (within2Days ? `
                  <button class="btn btn-sm btn-ghost profile-action-btn" data-action="request-return" data-oid="${o.id}" data-pid="${i.id}" data-pname="${i.name}" data-price="${i.unitPrice * i.qty}"
                    style="padding:3px 7px;font-size:.65rem;border-color:var(--forest);color:var(--forest);font-weight:700;cursor:pointer">
                    ↩️ Return / Exchange
                  </button>` : `<span style="font-size:.62rem;color:var(--text-muted);padding:2px 6px;background:rgba(0,0,0,0.05);border-radius:var(--r-sm)">Return Expired (2-Day)</span>`) : '')}

                  <!-- Write Review (Delivered Only) -->
                  ${isDelivered && !hasReviewed ? `
                  <button class="btn btn-sm profile-action-btn" data-action="write-review" data-pid="${i.id}" data-oid="${o.id}" data-pname="${i.name}"
                    style="padding:3px 8px;font-size:.65rem;background:var(--forest-dark);color:var(--sand-light);border:none;border-radius:999px;font-weight:700;cursor:pointer">★ Review</button>
                  ` : ''}
                  ${hasReviewed ? `<span style="font-size:.65rem;color:var(--forest);font-weight:700;padding:2px 7px;background:rgba(20,51,37,.08);border-radius:999px">★ Reviewed</span>` : ''}
                </div>
              </div>`;
            }).join('')}
          </div>

          <!-- Delivery Address -->
          ${o.address ? `<div style="display:flex;align-items:flex-start;gap:6px;margin-top:8px;padding:7px 9px;background:rgba(20,51,37,.03);border-radius:var(--r-md)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" stroke-width="2" style="flex-shrink:0;margin-top:2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <div style="font-size:.68rem;color:var(--text-muted);line-height:1.3;word-break:break-word">${o.address}</div>
          </div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderOrdersTabDesktop() {
  const myOrders = state.orders.filter(o => !state.user || o.email === state.user?.email || o.customerName === state.user?.name);
  const ordersToShow = myOrders.length > 0 ? myOrders : state.orders;
  if (!ordersToShow.length) return `
  <div style="text-align:center;padding:60px 0;color:var(--text-muted)">
    <div style="font-size:3rem;margin-bottom:12px">📦</div>
    <p style="font-size:1.1rem;font-weight:700;color:var(--forest-dark)">No orders found</p>
    <p style="font-size:.9rem;margin-top:6px">Your order history and return tracking will appear here.</p>
    <a data-route="shop" style="display:inline-block;margin-top:16px;padding:12px 28px;background:var(--forest);color:var(--sand-light);border-radius:var(--r-md);font-weight:700;font-size:.9rem;cursor:pointer">Start Shopping</a>
  </div>`;

  const statusConfig = {
    'Processing': { color: '#f59e0b', bg: 'rgba(245,158,11,.1)', icon: '⏳' },
    'Out for Delivery': { color: '#3b82f6', bg: 'rgba(59,130,246,.1)', icon: '🚚' },
    'Delivered': { color: '#10b981', bg: 'rgba(16,185,129,.1)', icon: '✅' },
    'Cancelled': { color: '#ef4444', bg: 'rgba(239,68,68,.1)', icon: '❌' }
  };

  return `
  <div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
    <div>
      <h3 style="font-family:var(--font-serif);font-size:1.6rem;color:var(--forest-dark);margin:0 0 4px">Order History</h3>
      <p style="font-size:.88rem;color:var(--text-muted)">${ordersToShow.length} order${ordersToShow.length>1?'s':''} total &bull; Manage deliveries, cancel or request 2-day return &amp; exchange</p>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:20px">
    ${ordersToShow.map(o => {
      const cfg = statusConfig[o.status] || { color:'var(--forest)',bg:'rgba(20,51,37,.08)',icon:'📦' };
      const isDelivered = (o.status === 'Delivered');
      const isProcessing = (o.status === 'Processing');
      const within2Days = isOrderWithin2Days(o.deliveredDate || o.date);

      return `
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow-sm);transition:box-shadow .2s" onmouseover="this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.boxShadow='var(--shadow-sm)'">
        <!-- ORDER HEADER -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 22px;background:var(--sand-light);border-bottom:1px solid var(--sand-border);flex-wrap:wrap;gap:10px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:42px;height:42px;border-radius:var(--r-md);background:${cfg.bg};display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">${cfg.icon}</div>
            <div>
              <div style="font-weight:800;color:var(--forest-dark);font-size:1rem">Order #${o.id}</div>
              <div style="font-size:.78rem;color:var(--text-muted);margin-top:2px">Placed on ${o.date}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:14px">
            <span style="display:inline-flex;align-items:center;gap:5px;padding:5px 14px;border-radius:999px;background:${cfg.bg};color:${cfg.color};font-size:.78rem;font-weight:700;letter-spacing:.3px">
              <span style="width:6px;height:6px;border-radius:50%;background:${cfg.color};display:inline-block"></span>
              ${o.status.toUpperCase()}
            </span>
            ${isProcessing ? `
            <button class="btn btn-sm" data-action="cancel-order" data-oid="${o.id}"
              style="padding:5px 12px;font-size:.76rem;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;font-weight:700;border-radius:var(--r-sm);cursor:pointer">
              Cancel Order
            </button>` : ''}
            <div style="font-weight:800;color:var(--forest-dark);font-size:1.15rem">${formatPrice(o.total)}</div>
          </div>
        </div>

        <!-- ORDER ITEMS -->
        <div style="padding:20px 22px">
          <div style="display:flex;flex-direction:column;gap:12px">
            ${o.items.map(i => {
              const hasReviewed = state.reviews && state.reviews.find(r => r.orderId === o.id && r.productId === i.id);
              const existingReturn = (state.returns || []).find(r => r.orderId === o.id && r.productId === i.id);
              const prod = state.products.find(p2 => p2.id === i.id);
              return `
              <div style="display:flex;align-items:center;gap:16px;padding:14px;background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-md);flex-wrap:wrap">
                ${prod ? `
                <img src="${prod.image}" alt="${i.name}" class="order-prod-link" data-pid="${i.id}" style="width:54px;height:54px;object-fit:cover;border-radius:var(--r-sm);flex-shrink:0;cursor:pointer;border:1px solid var(--sand-border);transition:transform .2s" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'" onerror="this.style.background='#f4efe6'">` : `<div class="order-prod-link" data-pid="${i.id}" style="width:54px;height:54px;border-radius:var(--r-sm);background:var(--sand);flex-shrink:0;cursor:pointer"></div>`}
                
                <div style="flex-grow:1;min-width:200px">
                  <a href="#product/${i.id}" class="order-prod-link" data-pid="${i.id}" style="font-weight:700;font-size:.95rem;color:var(--forest-dark);cursor:pointer;text-decoration:none;display:inline-block;transition:color .2s" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='var(--forest-dark)'">${i.name}</a>
                  <div style="font-size:.8rem;color:var(--text-muted);margin-top:3px">Qty: ${i.qty} &bull; ${formatPrice(i.unitPrice || 0)} each</div>
                </div>

                <div style="flex-shrink:0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end">
                  <!-- Return & Exchange (Delivered Only, within 2 days) -->
                  ${existingReturn ? `
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="badge ${existingReturn.status==='Approved'||existingReturn.status==='Refund Successful'||existingReturn.status==='Refund Processed'?'badge-forest':'badge-gold'}" style="font-size:.78rem;padding:5px 12px">
                      Return: ${existingReturn.status}
                    </span>
                    <button class="btn btn-sm btn-ghost" data-action="view-return-chat" data-retid="${existingReturn.id}"
                      style="padding:6px 12px;font-size:.78rem;border-color:var(--forest);color:var(--forest);font-weight:700;cursor:pointer">
                      💬 Return Chat &amp; Status
                    </button>
                  </div>` : (isDelivered ? (within2Days ? `
                  <button class="btn btn-sm btn-ghost" data-action="request-return" data-oid="${o.id}" data-pid="${i.id}" data-pname="${i.name}" data-price="${i.unitPrice * i.qty}"
                    style="padding:6px 14px;font-size:.78rem;border-color:var(--forest);color:var(--forest);font-weight:700;cursor:pointer">
                    ↩️ Return / Exchange
                  </button>` : `<span style="font-size:.74rem;color:var(--text-muted);padding:4px 10px;background:rgba(0,0,0,0.05);border-radius:var(--r-sm)">Return Window Expired (2-Day Policy)</span>`) : '')}

                  <!-- Write Review (Delivered Only) -->
                  ${isDelivered && !hasReviewed ? `
                  <button class="btn btn-sm" data-action="write-review" data-pid="${i.id}" data-oid="${o.id}" data-pname="${i.name}"
                    style="padding:6px 14px;font-size:.78rem;background:var(--forest);color:var(--sand-light);border:none;border-radius:var(--r-md);font-weight:700;cursor:pointer;transition:opacity .2s"
                    onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">✍ Write Review</button>
                  ` : ''}
                  ${hasReviewed ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:.78rem;color:var(--forest);font-weight:700;padding:5px 12px;background:rgba(20,51,37,.08);border-radius:999px">★ Reviewed</span>` : ''}
                </div>
              </div>`;
            }).join('')}
          </div>

          <!-- DELIVERY ADDRESS -->
          ${o.address ? `<div style="display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:12px 14px;background:rgba(20,51,37,.04);border-radius:var(--r-md);border:1px solid var(--sand-border)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" stroke-width="2" style="flex-shrink:0;margin-top:2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <div style="font-size:.82rem;color:var(--text-dark)"><strong style="color:var(--forest-dark)">Delivery Address:</strong> ${o.address}</div>
          </div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderOrdersTab() {
  return window.innerWidth >= 900 ? renderOrdersTabDesktop() : renderOrdersTabMobile();
}


function renderUserQueriesTabMobile() {
  if (!state.user) return '';
  const myQueries = state.queries.filter(q => q.email === state.user.email);

  return `
  <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
    <div>
      <h3 style="font-family:var(--font-serif);font-size:1.15rem;color:var(--forest-dark);margin:0">My Support Queries</h3>
      <p style="font-size:.76rem;color:var(--text-muted);margin-top:2px">Direct communication channel with Aurite advisors</p>
    </div>
    <button class="btn btn-primary btn-sm" id="toggle-query-form-btn" type="button" style="font-size:.78rem;padding:6px 12px">
      + New Query
    </button>
  </div>

  <!-- Inline New Query Form (Collapsible) -->
  <div id="inline-query-form-card" style="display:${myQueries.length === 0 ? 'block' : 'none'};background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;margin-bottom:16px">
    <div style="font-weight:700;font-size:.82rem;color:var(--forest-dark);margin-bottom:8px">Submit a New Support Query</div>
    <form id="inline-user-query-form" style="display:flex;flex-direction:column;gap:10px">
      <div>
        <label class="form-label" style="font-size:.72rem;margin-bottom:3px;display:block">Subject / Topic</label>
        <input type="text" id="iq-subject" class="form-input" placeholder="e.g. Dosage advice for Magnesium" required style="font-size:.82rem;padding:8px 10px">
      </div>
      <div>
        <label class="form-label" style="font-size:.72rem;margin-bottom:3px;display:block">Message / Question</label>
        <textarea id="iq-message" class="form-input" rows="3" placeholder="Describe your question or concern in detail..." required style="font-size:.82rem;padding:8px 10px;resize:vertical"></textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button type="button" id="cancel-query-form-btn" class="btn btn-ghost btn-sm" style="font-size:.76rem;padding:6px 12px">Cancel</button>
        <button type="submit" class="btn btn-gold btn-sm" style="font-size:.76rem;padding:6px 14px">Submit Query →</button>
      </div>
    </form>
  </div>

  <!-- Queries List -->
  ${myQueries.length === 0 ? `
  <div style="text-align:center;padding:24px 16px;color:var(--text-muted)">
    <p style="font-size:.82rem">You have no previous queries on record.</p>
  </div>` : `
  <div style="display:flex;flex-direction:column;gap:10px">
    ${myQueries.map(q => {
      const isAnswered = q.status === 'Answered';
      const isOpen = q.status === 'Open';
      const badgeStyle = isOpen ? 'background:rgba(20,51,37,.1);color:var(--forest);' : isAnswered ? 'background:rgba(197,160,89,.2);color:#92722a;' : 'background:rgba(0,0,0,.06);color:var(--text-muted);';
      return `
      <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px 14px;display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div>
            <div style="font-weight:700;font-size:.86rem;color:var(--forest-dark)">${q.subject}</div>
            <div style="font-size:.72rem;color:var(--text-muted)">${q.date} &bull; ${q.replies.length} ${q.replies.length === 1 ? 'reply' : 'replies'}</div>
          </div>
          <span style="font-size:.65rem;font-weight:800;padding:2px 8px;border-radius:999px;letter-spacing:.04em;${badgeStyle}">
            ${q.status.toUpperCase()}
          </span>
        </div>
        <p style="font-size:.78rem;color:var(--text-muted);margin:0;line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${q.message}
        </p>
        <div style="display:flex;justify-content:flex-end">
          <button class="btn btn-sm btn-ghost" data-action="open-query-chat" data-qid="${q.id}"
            style="font-size:.74rem;padding:4px 10px;border-color:var(--forest);color:var(--forest);font-weight:700;cursor:pointer">
            💬 Open Conversation (${q.replies.length})
          </button>
        </div>
      </div>`;
    }).join('')}
  </div>`}`;
}

function renderUserQueriesTabDesktop() {
  const myQueries = state.user
    ? state.queries.filter(q => q.email === state.user.email)
    : state.queries;
  let activeQueryId = null;
  if (!myQueries.length) return `
  <h3 style="font-family:var(--font-serif);font-size:1.7rem;margin-bottom:16px;color:var(--forest-dark)">My Support Queries</h3>
  <div style="text-align:center;padding:60px 0;color:var(--text-muted)">
    ${svgIcon('chat',48)}
    <p style="margin-top:16px;font-size:1rem">You have no active support queries.</p>
    <p style="margin-top:8px;font-size:.85rem">Submit a query from the <a data-route="contact" style="color:var(--forest);font-weight:700;cursor:pointer">Contact Us</a> page.</p>
  </div>`;

  return `
  <h3 style="font-family:var(--font-serif);font-size:1.7rem;margin-bottom:20px;color:var(--forest-dark)">My Support Queries</h3>
  <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:20px;min-height:400px">
    <div class="clean-scroll-box" style="display:flex;flex-direction:column;gap:10px;max-height:500px;overflow-y:auto;padding-right:4px">
      ${myQueries.map(q => `
      <div class="user-query-card" data-qid="${q.id}" style="border:1px solid var(--sand-border);border-radius:var(--r-md);padding:14px;cursor:pointer;background:var(--sand-light);transition:all .2s ease">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-weight:700;font-size:.88rem;color:var(--forest-dark)">${q.subject}</span>
          <span class="badge ${q.status==='Open'?'badge-forest':q.status==='Answered'?'badge-gold':''}" style="font-size:.65rem">${q.status}</span>
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">${q.date} · ${q.replies.length} replies</div>
      </div>`).join('')}
    </div>
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:20px;display:flex;flex-direction:column" id="user-query-chatbox">
      <p style="color:var(--text-muted);text-align:center;margin:auto">Select a query to view the conversation.</p>
    </div>
  </div>`;
}

function renderUserQueriesTab() {
  return window.innerWidth >= 900 ? renderUserQueriesTabDesktop() : renderUserQueriesTabMobile();
}


function openUserQueryChatModal(qid) {
  const q = state.queries.find(i => i.id === qid);
  const box = document.getElementById('modal-box');
  if (!q || !box) return;

  box.innerHTML = `
  <div class="modal-overlay open" id="user-query-chat-overlay" style="z-index:9999">
    <div class="modal-card modal-lg" style="max-height:85vh;display:flex;flex-direction:column">
      <button class="modal-close-btn" id="user-query-chat-close">${svgIcon('close',20)}</button>
      <div style="border-bottom:1px solid var(--sand-border);padding-bottom:12px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div>
            <span class="badge badge-gold" style="font-size:.65rem;margin-bottom:4px">Support Ticket #${q.id}</span>
            <h3 style="font-family:var(--font-sans);font-weight:700;font-size:1.15rem;color:var(--forest-dark);margin:0">${q.subject}</h3>
            <div style="font-size:.75rem;color:var(--text-muted);margin-top:2px">Created on ${q.date}</div>
          </div>
          <span class="badge ${q.status==='Open'?'badge-forest':'badge-gold'}" style="font-size:.7rem">${q.status}</span>
        </div>
      </div>

      <div id="user-query-modal-viewport" style="flex-grow:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;max-height:340px;margin-bottom:14px;padding-right:4px">
        <div class="chat-bubble chat-bubble-customer" style="background:var(--sand-light);border:1px solid var(--sand-border);padding:10px 12px;border-radius:var(--r-md)">
          <div style="font-weight:700;font-size:.72rem;color:var(--forest);margin-bottom:3px">You &bull; ${q.date}</div>
          <div style="font-size:.82rem;line-height:1.5">${q.message}</div>
        </div>
        ${q.replies.map(r => `
        <div class="chat-bubble ${r.sender==='Admin'?'chat-bubble-admin':'chat-bubble-customer'}" style="padding:10px 12px;border-radius:var(--r-md);background:${r.sender==='Admin'?'var(--forest-dark)':'var(--sand-light)'};color:${r.sender==='Admin'?'var(--sand-light)':'var(--forest-dark)'};border:1px solid ${r.sender==='Admin'?'transparent':'var(--sand-border)'}">
          <div style="font-weight:700;font-size:.72rem;margin-bottom:3px;color:${r.sender==='Admin'?'var(--gold)':'var(--forest)'}">${r.sender} &bull; ${r.time}</div>
          <div style="font-size:.82rem;line-height:1.5">${r.text}</div>
        </div>`).join('')}
      </div>

      ${q.status !== 'Resolved' && q.status !== 'Closed' ? `
      <form id="user-query-modal-reply-form" style="display:flex;gap:8px;margin-top:auto">
        <input type="text" id="user-query-reply-input" class="form-input" placeholder="Type your reply or additional information..." required style="flex-grow:1;font-size:.82rem;padding:9px 12px">
        <button type="submit" class="btn btn-gold btn-sm" style="font-size:.78rem;padding:9px 16px;flex-shrink:0">Send 💬</button>
      </form>` : `<div style="text-align:center;font-size:.78rem;color:var(--text-muted);padding:8px;background:var(--sand);border-radius:var(--r-sm)">This ticket has been marked as resolved.</div>`}
    </div>
  </div>`;

  const overlay = document.getElementById('user-query-chat-overlay');
  const closeBtn = document.getElementById('user-query-chat-close');
  const form = document.getElementById('user-query-modal-reply-form');

  const cleanup = () => { if (box) box.innerHTML = ''; };
  closeBtn?.addEventListener('click', cleanup);
  overlay?.addEventListener('click', e => { if (e.target === overlay) cleanup(); });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const txt = document.getElementById('user-query-reply-input')?.value.trim();
    if (!txt) return;
    q.replies.push({
      sender: state.user?.name || 'Customer',
      text: txt,
      time: new Date().toISOString().replace('T',' ').substring(0,16)
    });
    if (q.status === 'Answered') q.status = 'Open';
    state._notify({ queries: true });
    showToast('Reply sent! 💬');
    openUserQueryChatModal(qid);
  });

  scrollChatToBottom('user-query-modal-viewport');
}

function openUserQueryChat(qid) {
  const q = state.queries.find(i => i.id === qid);
  const box = document.getElementById('user-query-chatbox');
  if (!q || !box) return;
  box.innerHTML = `
  <div style="border-bottom:1px solid var(--sand-border);padding-bottom:12px;margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h4 style="font-family:var(--font-serif);font-size:1.1rem;color:var(--forest-dark)">${q.subject}</h4>
      <span class="badge badge-gold">${q.status}</span>
    </div>
    <div style="font-size:.76rem;color:var(--text-muted);margin-top:4px">${q.date}</div>
  </div>
  <div id="user-query-messages-viewport" style="flex-grow:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;max-height:300px;margin-bottom:14px;padding-right:4px">
    <div class="chat-bubble chat-bubble-customer">
      <div style="font-weight:700;font-size:.75rem;margin-bottom:3px">You · ${q.date}</div>
      ${q.message}
    </div>
    ${q.replies.map(r => `
    <div class="chat-bubble ${r.sender==='Admin'?'chat-bubble-admin':'chat-bubble-customer'}">
      <div style="font-weight:700;font-size:.75rem;margin-bottom:3px;color:${r.sender==='Admin'?'var(--gold)':'inherit'}">${r.sender} · ${r.time}</div>
      ${r.text}
    </div>`).join('')}
  </div>
  ${q.status !== 'Resolved' && q.status !== 'Closed' ? `
  <form id="user-reply-form" style="display:flex;gap:10px">
    <input type="text" id="user-reply-input" class="form-input" placeholder="Reply or add info..." style="flex-grow:1">
    <button type="submit" class="btn btn-gold btn-sm">Send</button>
  </form>` : `<div style="text-align:center;font-size:.82rem;color:var(--text-muted);padding:10px;background:var(--sand);border-radius:var(--r-sm)">This query has been ${q.status.toLowerCase()}.</div>`}
  `;
  const form = document.getElementById('user-reply-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const txt = document.getElementById('user-reply-input')?.value.trim();
      if (!txt) return;
      const theQ = state.queries.find(i => i.id === qid);
      if (theQ) {
        theQ.replies.push({ sender: state.user?.name || 'You', text: txt, time: new Date().toISOString().replace('T',' ').substring(0,16) });
        state._notify({ queries: true });
        openUserQueryChat(qid);
      }
    });
  }

  scrollChatToBottom('user-query-messages-viewport');
}

function openReturnModal(orderId, productId, productName, amount) {
  setModalBackgroundFreeze(true);
  let box = document.getElementById('modal-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'modal-box';
    document.body.appendChild(box);
  }

  box.innerHTML = `
  <div class="modal-overlay open" id="return-modal-overlay" style="padding:14px 10px;align-items:center;justify-content:center;z-index:9999">
    <div class="modal-card modal-lg" style="max-width:540px;width:100%;padding:20px;border-radius:var(--r-xl);box-shadow:var(--shadow-xl);background:var(--sand-light);border:1px solid var(--sand-border);margin:auto;max-height:90vh;overflow-y:auto">
      
      <!-- Modal Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--sand-border);padding-bottom:12px;margin-bottom:14px">
        <div>
          <span class="badge badge-gold" style="font-size:.65rem;margin-bottom:4px">Order #${orderId}</span>
          <h3 style="font-family:var(--font-serif);font-size:1.2rem;color:var(--forest-dark);margin:0">Return &amp; Exchange Request</h3>
        </div>
        <button class="modal-close-btn" id="return-modal-close" style="position:static;width:30px;height:30px;font-size:1.1rem;display:flex;align-items:center;justify-content:center">${svgIcon('close',16)}</button>
      </div>

      <!-- Item Preview Card -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px 14px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px">
        <div>
          <div style="font-weight:700;font-size:.86rem;color:var(--forest-dark)">${productName}</div>
          <div style="font-size:.72rem;color:var(--text-muted)">Eligible for 2-day return, exchange or 100% refund</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:.65rem;color:var(--text-muted)">Item Value</div>
          <div style="font-weight:800;color:var(--forest-dark);font-size:1rem">${formatPrice(amount || 0)}</div>
        </div>
      </div>

      <!-- Form -->
      <form id="return-request-form" style="display:flex;flex-direction:column;gap:12px">
        <div>
          <label style="display:block;font-size:.74rem;font-weight:700;color:var(--forest-dark);margin-bottom:4px">Request Preference *</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <label style="display:flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:8px 12px;font-size:.78rem;cursor:pointer;font-weight:600">
              <input type="radio" name="ret-type" value="Return & Refund" checked style="accent-color:var(--forest)">
              <span>Return &amp; Refund</span>
            </label>
            <label style="display:flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:8px 12px;font-size:.78rem;cursor:pointer;font-weight:600">
              <input type="radio" name="ret-type" value="Exchange / Replacement" style="accent-color:var(--forest)">
              <span>Exchange / Replace</span>
            </label>
          </div>
        </div>

        <div>
          <label style="display:block;font-size:.74rem;font-weight:700;color:var(--forest-dark);margin-bottom:4px">Reason for Return / Exchange *</label>
          <select id="ret-reason" class="form-input" required style="font-size:.82rem;padding:8px 10px">
            <option value="Damaged Outer Packaging / Broken Seal">Damaged Outer Packaging / Broken Seal</option>
            <option value="Received Incorrect Item or Flavor">Received Incorrect Item or Flavor</option>
            <option value="Quality or Taste Not as Expected">Quality or Taste Not as Expected</option>
            <option value="Allergic Sensitivity or Health Precaution">Allergic Sensitivity or Health Precaution</option>
            <option value="Ordered Duplicate by Mistake">Ordered Duplicate by Mistake</option>
            <option value="Other / Personal Discretion">Other / Personal Discretion</option>
          </select>
        </div>

        <div>
          <label style="display:block;font-size:.74rem;font-weight:700;color:var(--forest-dark);margin-bottom:4px">Explain the Issue in Detail *</label>
          <textarea id="ret-details" class="form-input" rows="3" required placeholder="Please describe the condition of the package, batch details, or reason for return/exchange..." style="font-size:.82rem;padding:8px 10px;resize:vertical"></textarea>
        </div>

        <div>
          <label style="display:block;font-size:.74rem;font-weight:700;color:var(--forest-dark);margin-bottom:4px">Contact Mobile for Pickup Coordination *</label>
          <input type="tel" id="ret-phone" class="form-input" required value="${state.user?.phone || '9876543210'}" placeholder="Mobile number" style="font-size:.82rem;padding:8px 10px">
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px">
          <button type="button" id="cancel-return-btn" class="btn btn-ghost btn-sm" style="font-size:.8rem;padding:8px 14px">Cancel</button>
          <button type="submit" class="btn btn-gold btn-sm" style="font-size:.8rem;padding:8px 16px;font-weight:700">Submit Request →</button>
        </div>
      </form>

    </div>
  </div>`;

  const overlay = document.getElementById('return-modal-overlay');
  const closeBtn = document.getElementById('return-modal-close');
  const cancelBtn = document.getElementById('cancel-return-btn');
  const close = () => { overlay?.remove(); };
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (cancelBtn) cancelBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  const form = document.getElementById('return-request-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.querySelector('input[name="ret-type"]:checked')?.value || 'Return & Refund';
      const reason = `${type}: ${document.getElementById('ret-reason')?.value || 'Return requested'}`;
      const details = document.getElementById('ret-details')?.value.trim() || '';
      const phone = document.getElementById('ret-phone')?.value.trim() || '';

      const res = state.requestReturn(orderId, productId, productName, reason, details, amount, phone);
      showToast('Return & Exchange request submitted! Live chat opened. 📦');
      close();

      const content = document.getElementById('profile-content');
      if (content) {
        content.innerHTML = renderOrdersTab();
      }

      if (res && res.returnId) {
        setTimeout(() => openUserReturnChatModal(res.returnId), 400);
      }
    });
  }
}

function openUserReturnChatModal(returnId) {
  setModalBackgroundFreeze(true);
  const r = (state.returns || []).find(item => item.id === returnId);
  const box = document.getElementById('modal-box');
  if (!r || !box) return;

  const statusColors = {
    'Requested': { bg: 'rgba(245,158,11,.15)', color: '#d97706' },
    'Under Review': { bg: 'rgba(59,130,246,.15)', color: '#2563eb' },
    'Approved': { bg: 'rgba(16,185,129,.15)', color: '#059669' },
    'Replacement Shipped': { bg: 'rgba(16,185,129,.15)', color: '#059669' },
    'Refund Completed': { bg: 'rgba(16,185,129,.15)', color: '#059669' },
    'Rejected': { bg: 'rgba(239,68,68,.15)', color: '#dc2626' }
  };
  const sc = statusColors[r.status] || { bg: 'rgba(20,51,37,.1)', color: 'var(--forest)' };

  box.innerHTML = `
  <div class="modal-overlay open" id="user-return-chat-overlay" style="padding:14px 10px;align-items:center;justify-content:center;z-index:9999">
    <div class="modal-card modal-lg" style="max-width:560px;width:100%;padding:20px;border-radius:var(--r-xl);box-shadow:var(--shadow-xl);background:var(--sand-light);border:1px solid var(--sand-border);margin:auto;max-height:88vh;display:flex;flex-direction:column">
      
      <!-- Header -->
      <div style="border-bottom:1px solid var(--sand-border);padding-bottom:12px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span class="badge badge-gold" style="font-size:.65rem">Ticket #${r.id}</span>
              <span class="badge" style="font-size:.65rem;background:${sc.bg};color:${sc.color};font-weight:800">${r.status.toUpperCase()}</span>
            </div>
            <h3 style="font-family:var(--font-sans);font-weight:800;font-size:1.05rem;color:var(--forest-dark);margin:0">${r.productName}</h3>
            <div style="font-size:.72rem;color:var(--text-muted);margin-top:2px">Order #${r.orderId} &bull; Refund / Value: ${formatPrice(r.amount || 0)}</div>
          </div>
          <button class="modal-close-btn" id="user-return-chat-close" style="position:static;width:30px;height:30px;font-size:1.1rem;display:flex;align-items:center;justify-content:center">${svgIcon('close',16)}</button>
        </div>
      </div>

      <!-- Chat Viewport -->
      <div id="user-ret-messages-viewport" style="flex-grow:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;max-height:340px;margin-bottom:14px;padding-right:4px">
        ${(r.chat || []).map(m => {
          const isCustomer = m.sender === 'Customer' || m.sender === state.user?.name;
          return `
          <div style="display:flex;flex-direction:column;align-items:${isCustomer?'flex-end':'flex-start'}">
            <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:2px;padding:0 4px">
              ${m.sender} &bull; ${m.time || ''}
            </div>
            <div style="max-width:85%;padding:9px 13px;border-radius:${isCustomer?'14px 14px 2px 14px':'14px 14px 14px 2px'};background:${isCustomer?'var(--forest-dark)':'var(--white)'};color:${isCustomer?'var(--sand-light)':'var(--text-dark)'};border:1px solid ${isCustomer?'var(--forest-dark)':'var(--sand-border)'};font-size:.82rem;line-height:1.45;word-break:break-word;white-space:pre-wrap">
              ${m.text}
            </div>
          </div>`;
        }).join('')}
      </div>

      <!-- Reply Box -->
      <form id="user-return-reply-form" style="display:flex;gap:8px;align-items:center;border-top:1px solid var(--sand-border);padding-top:12px">
        <input type="text" id="user-ret-reply-input" class="form-input" placeholder="Type message to Aurite Returns Desk..." required style="flex-grow:1;font-size:.82rem;padding:9px 12px;height:38px">
        <button type="submit" class="btn btn-gold btn-sm" style="flex-shrink:0;padding:9px 16px;font-size:.8rem;height:38px;font-weight:700">Send 💬</button>
      </form>

    </div>
  </div>`;

  const overlay = document.getElementById('user-return-chat-overlay');
  const closeBtn = document.getElementById('user-return-chat-close');
  const close = () => { overlay?.remove(); };
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  const viewport = document.getElementById('user-ret-messages-viewport');
  if (viewport) viewport.scrollTop = viewport.scrollHeight;

  const replyForm = document.getElementById('user-return-reply-form');
  if (replyForm) {
    replyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('user-ret-reply-input');
      const text = input?.value.trim();
      if (!text) return;

      state.replyToReturnChat(returnId, text, state.user?.name || "Customer");
      input.value = '';

      // Re-render chat modal with updated message
      openUserReturnChatModal(returnId);
    });
  }
}

function openReviewModal(productId, orderId, productName) {
  // Clean up any existing review modal first to avoid duplicates
  document.querySelectorAll('#review-modal').forEach(el => el.remove());
  setModalBackgroundFreeze(true);
  
  const modalHTML = `
  <div id="review-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px);padding:16px">
    <div style="background:var(--white);padding:24px 20px;border-radius:var(--r-lg);width:100%;max-width:460px;box-shadow:var(--shadow-lg);position:relative;animation:slideUp 0.25s ease">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <h3 style="font-family:var(--font-serif);font-size:1.35rem;color:var(--forest-dark);margin:0">Write a Review</h3>
        <button class="modal-close-btn" id="close-review-modal" data-action="close-review-modal" aria-label="Close Review Modal" style="position:static;width:30px;height:30px;font-size:1rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer">${svgIcon('close',14)}</button>
      </div>
      <p style="color:var(--text-muted);font-size:.82rem;margin-bottom:16px;line-height:1.4">Share your experience with <strong style="color:var(--forest-dark)">${productName}</strong>.</p>
      
      <form id="review-form">
        <div style="margin-bottom:14px">
          <label style="display:block;font-size:.80rem;font-weight:700;margin-bottom:6px;color:var(--text-dark)">Overall Rating</label>
          <div id="star-rating" style="display:flex;gap:6px;font-size:1.8rem;color:#f59e0b;cursor:pointer;transition:color 0.2s">
            <span data-val="1">★</span><span data-val="2">★</span><span data-val="3">★</span><span data-val="4">★</span><span data-val="5">★</span>
          </div>
          <input type="hidden" id="review-rating" value="5">
        </div>
        
        <div style="margin-bottom:20px">
          <label style="display:block;font-size:.80rem;font-weight:700;margin-bottom:6px;color:var(--text-dark)">Your Review (Optional)</label>
          <textarea id="review-text" class="form-input" rows="3" placeholder="What did you like or dislike? (Optional)" style="resize:vertical;font-size:.82rem;padding:8px 10px"></textarea>
        </div>
        
        <button type="submit" class="btn btn-gold" style="width:100%;padding:12px;font-size:.9rem;font-weight:800;border-radius:var(--r-md)">Submit Review</button>
      </form>
    </div>
  </div>`;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const modal = document.getElementById('review-modal');
  const form = document.getElementById('review-form');
  const stars = document.querySelectorAll('#star-rating span');
  const ratingInput = document.getElementById('review-rating');
  
  const closeModal = () => {
    setModalBackgroundFreeze(false);
    document.querySelectorAll('#review-modal').forEach(el => el.remove());
  };

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.closest('#close-review-modal') || e.target.closest('[data-action="close-review-modal"]')) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      }
    });
  }
  
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.val);
      ratingInput.value = val;
      stars.forEach(s => {
        s.style.color = parseInt(s.dataset.val) <= val ? '#f59e0b' : 'var(--sand-border)';
      });
    });
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.val);
      stars.forEach(s => { s.style.color = parseInt(s.dataset.val) <= val ? '#f59e0b' : 'var(--sand-border)'; });
    });
    star.addEventListener('mouseleave', () => {
      const val = parseInt(ratingInput.value) || 5;
      stars.forEach(s => { s.style.color = parseInt(s.dataset.val) <= val ? '#f59e0b' : 'var(--sand-border)'; });
    });
  });
  
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const rating = parseInt(ratingInput.value) || 5;
      const text = document.getElementById('review-text')?.value.trim() || 'Excellent product quality and prompt delivery.';
      const customerName = state.user ? state.user.name : 'Verified Buyer';
      
      state.addReview(productId, orderId, rating, text, customerName);
      showToast('Thank you! Your review has been submitted. 🎉');
      closeModal();
      // Refresh the orders tab
      const content = document.getElementById('profile-content');
      if (content) content.innerHTML = renderOrdersTab();
    });
  }
}

function renderSettingsTabMobile(user) {
  const fullAddress = `${user.address || 'Flat 402, Green Glen Heights, HSR Layout'}, ${user.city || 'Mumbai'} - ${user.pincode || '400001'}, ${user.country || 'India'}`;

  return `
  <div style="display:flex;flex-direction:column;gap:14px">
    
    <!-- Account Details Overview Card -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="font-size:.70rem;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Account Overview</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div>
          <span style="font-size:.72rem;color:var(--text-muted);display:block">Full Name</span>
          <span style="font-size:.88rem;font-weight:700;color:var(--forest-dark)">${user.name}</span>
        </div>
        <div>
          <span style="font-size:.72rem;color:var(--text-muted);display:block">Email Address</span>
          <span style="font-size:.84rem;font-weight:600;color:var(--forest-dark)">${user.email}</span>
        </div>
        <div>
          <span style="font-size:.72rem;color:var(--text-muted);display:block">Registered Mobile</span>
          <span style="font-size:.84rem;font-weight:600;color:var(--forest-dark)">${user.phone || '+91 98765 43210'}</span>
        </div>
        <div>
          <span style="font-size:.72rem;color:var(--text-muted);display:block">Default Address</span>
          <span style="font-size:.82rem;font-weight:600;color:var(--forest-dark)">${fullAddress}</span>
        </div>
      </div>
    </div>

    <!-- Update Delivery Address Form Card -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="font-weight:800;font-size:.84rem;color:var(--forest-dark);margin-bottom:2px">Update Delivery Address</div>
      <p style="font-size:.72rem;color:var(--text-muted);margin-bottom:10px">Edit your default shipping and delivery address.</p>
      
      <form id="update-address-form" style="display:flex;flex-direction:column;gap:8px">
        <div>
          <label class="form-label" style="font-size:.70rem">Delivery Address *</label>
          <textarea id="prof-addr" class="form-input" rows="2" required placeholder="House / Flat No., Building, Street &amp; Locality" style="font-size:.80rem;padding:7px 10px;resize:vertical">${user.address || 'Flat 402, Green Glen Heights, HSR Layout'}</textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div>
            <label class="form-label" style="font-size:.70rem">City / Town *</label>
            <input type="text" id="prof-city" class="form-input" value="${user.city || 'Mumbai'}" required placeholder="City" style="font-size:.80rem;padding:7px 10px">
          </div>
          <div>
            <label class="form-label" style="font-size:.70rem">Pincode *</label>
            <input type="text" id="prof-pincode" class="form-input" value="${user.pincode || '400001'}" required placeholder="6-digit PIN" maxlength="6" style="font-size:.80rem;padding:7px 10px">
          </div>
        </div>
        <div>
          <label class="form-label" style="font-size:.70rem">Country *</label>
          <input type="text" id="prof-country" class="form-input" value="${user.country || 'India'}" required placeholder="Country" style="font-size:.80rem;padding:7px 10px">
        </div>
        <button type="submit" class="btn btn-primary btn-sm" style="font-size:.78rem;padding:8px 14px;margin-top:2px">Save Delivery Address 🏡</button>
      </form>
    </div>

    <!-- Update Name Card -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="font-weight:800;font-size:.84rem;color:var(--forest-dark);margin-bottom:2px">Update Full Name</div>
      <form id="update-name-form" style="display:flex;flex-direction:column;gap:8px;margin-top:6px">
        <div>
          <label class="form-label" style="font-size:.70rem;margin-bottom:2px">Full Name *</label>
          <input type="text" id="prof-name" class="form-input" value="${user.name}" required placeholder="e.g. Akash Sharma" style="font-size:.82rem;padding:7px 10px">
        </div>
        <button type="submit" class="btn btn-primary btn-sm" style="font-size:.78rem;padding:8px 14px;width:100%">Save Name</button>
      </form>
    </div>

    <!-- Update Email Address Card -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="font-weight:800;font-size:.84rem;color:var(--forest-dark);margin-bottom:2px">Update Email Address</div>
      <p style="font-size:.72rem;color:var(--text-muted);margin-bottom:8px">OTP will be sent to your new email for verification.</p>
      <form id="update-email-form" style="display:flex;flex-direction:column;gap:8px" data-step="1">
        <input type="email" class="form-input" value="${user.email}" disabled style="opacity:0.7;font-size:.80rem;padding:7px 10px">
        <div id="new-email-field">
          <input type="email" id="prof-new-email" class="form-input" placeholder="New email address" required style="font-size:.80rem;padding:7px 10px">
        </div>
        <div id="email-otp-field" style="display:none">
          <input type="text" id="prof-email-otp" class="form-input" placeholder="Enter 6-digit OTP sent to new email" maxlength="6" style="font-size:.80rem;padding:7px 10px">
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" id="send-email-otp-btn" class="btn btn-primary btn-sm" style="font-size:.78rem;padding:8px 14px;flex-grow:1">Send OTP</button>
          <button type="submit" id="verify-email-btn" class="btn btn-gold btn-sm" style="display:none;font-size:.78rem;padding:8px 14px;flex-grow:1">Verify &amp; Update</button>
        </div>
      </form>
    </div>

    <!-- Update Mobile Number Card -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="font-weight:800;font-size:.84rem;color:var(--forest-dark);margin-bottom:2px">Registered Mobile Number</div>
      <p style="font-size:.72rem;color:var(--text-muted);margin-bottom:8px">OTP will be sent to confirm your mobile number change.</p>
      <form id="update-phone-form" style="display:flex;flex-direction:column;gap:8px">
        <input type="tel" class="form-input" value="${user.phone || '+91 98765 43210'}" disabled style="opacity:0.75;font-size:.80rem;padding:7px 10px">
        <div id="new-phone-field">
          <input type="tel" id="prof-new-phone" class="form-input" placeholder="New 10-digit mobile number" required style="font-size:.80rem;padding:7px 10px">
        </div>
        <div id="phone-otp-field" style="display:none">
          <input type="text" id="prof-phone-otp" class="form-input" placeholder="Enter 6-digit OTP sent to mobile" maxlength="6" style="font-size:.80rem;padding:7px 10px">
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" id="send-phone-otp-btn" class="btn btn-primary btn-sm" style="font-size:.78rem;padding:8px 14px;flex-grow:1">Send OTP to Mobile</button>
          <button type="submit" id="verify-phone-btn" class="btn btn-gold btn-sm" style="display:none;font-size:.78rem;padding:8px 14px;flex-grow:1">Verify &amp; Update</button>
        </div>
      </form>
    </div>

    <!-- Change Password Card with Cancel/Close Reset option -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">
        <div style="font-weight:800;font-size:.84rem;color:var(--forest-dark)">Change Password</div>
      </div>
      <p style="font-size:.74rem;color:var(--text-muted);margin-bottom:12px;line-height:1.35">A 6-digit verification code will be sent to <strong style="color:var(--forest-dark);word-break:break-all">${user.email}</strong>.</p>
      
      <form id="change-password-form" style="display:flex;flex-direction:column;gap:10px">
        <div id="pwd-otp-request-group">
          <button type="button" id="send-pwd-otp-btn" class="btn btn-primary btn-sm" style="font-size:.80rem;padding:9px 16px;width:100%">Send OTP to Email</button>
        </div>
        
        <div id="pwd-otp-fields" style="display:none;flex-direction:column;gap:10px">
          <div style="background:rgba(197,160,89,0.12);border:1px solid rgba(197,160,89,0.3);border-radius:var(--r-sm);padding:8px 10px;font-size:.74rem;color:var(--forest-dark);display:flex;flex-direction:column;gap:6px">
            <div style="word-break:break-all;line-height:1.35">OTP sent to <strong style="color:var(--forest-dark)">${user.email}</strong></div>
            <div style="display:flex;gap:12px;align-items:center">
              <button type="button" id="resend-pwd-otp-btn" style="background:none;border:none;color:var(--gold);font-weight:700;cursor:pointer;font-size:.72rem;text-decoration:underline;padding:0">Resend OTP</button>
              <button type="button" id="cancel-pwd-otp-btn" style="background:none;border:none;color:var(--error);font-weight:700;cursor:pointer;font-size:.72rem;text-decoration:underline;padding:0">Cancel</button>
            </div>
          </div>

          <div>
            <label class="form-label" style="font-size:.70rem;margin-bottom:2px">Enter 6-Digit OTP *</label>
            <input type="text" id="pwd-otp-input" class="form-input" placeholder="e.g. 123456" maxlength="6" style="font-size:.82rem;padding:8px 11px;letter-spacing:1px">
          </div>

          <div>
            <label class="form-label" style="font-size:.70rem;margin-bottom:2px">New Password *</label>
            <input type="password" id="prof-new-pwd" class="form-input" placeholder="Min 8 chars, 1 uppercase, 1 number" style="font-size:.82rem;padding:8px 11px">
          </div>

          <div>
            <label class="form-label" style="font-size:.70rem;margin-bottom:2px">Confirm New Password *</label>
            <input type="password" id="prof-confirm-pwd" class="form-input" placeholder="Confirm new password" style="font-size:.82rem;padding:8px 11px">
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
            <button type="submit" class="btn btn-gold btn-sm" style="width:100%;font-size:.78rem;padding:9px 12px;font-weight:800;border-radius:var(--r-md);white-space:nowrap">Verify &amp; Update Password</button>
            <button type="button" id="cancel-pwd-otp-btn-2" class="btn btn-secondary btn-sm" style="width:100%;font-size:.78rem;padding:8px 12px;border-radius:var(--r-md)">Cancel</button>
          </div>
        </div>
      </form>
    </div>

  </div>`;
}

function renderSettingsTabDesktop(user) {
  const fullAddress = `${user.address || 'Flat 402, Green Glen Heights, HSR Layout'}, ${user.city || 'Mumbai'} - ${user.pincode || '400001'}, ${user.country || 'India'}`;

  return `
  <h3 style="font-family:var(--font-serif);font-size:1.7rem;margin-bottom:8px;color:var(--forest-dark)">Personal Details &amp; Addresses</h3>
  <p style="font-size:.88rem;color:var(--text-muted);margin-bottom:24px">Manage your delivery destination, verified contact details, and account security.</p>
  
  <!-- Account Details Overview Card -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:20px 24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <div style="font-size:.78rem;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px">Account Overview</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 24px">
      <div>
        <span style="font-size:.76rem;color:var(--text-muted);display:block;margin-bottom:2px">Primary Member Name</span>
        <span style="font-size:.95rem;font-weight:700;color:var(--forest-dark)">${user.name}</span>
      </div>
      <div>
        <span style="font-size:.76rem;color:var(--text-muted);display:block;margin-bottom:2px">Email Address</span>
        <span style="font-size:.92rem;font-weight:600;color:var(--forest-dark)">${user.email}</span>
      </div>
      <div>
        <span style="font-size:.76rem;color:var(--text-muted);display:block;margin-bottom:2px">Registered Mobile</span>
        <span style="font-size:.92rem;font-weight:600;color:var(--forest-dark)">${user.phone || '+91 98765 43210'}</span>
      </div>
      <div>
        <span style="font-size:.76rem;color:var(--text-muted);display:block;margin-bottom:2px">Default Delivery Destination</span>
        <span style="font-size:.88rem;font-weight:600;color:var(--forest-dark);line-height:1.4">${fullAddress}</span>
      </div>
    </div>
  </div>

  <!-- Update Delivery Address Section -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <h4 style="font-family:var(--font-serif);font-size:1.15rem;margin-bottom:4px;color:var(--forest-dark)">Update Delivery Address</h4>
    <p style="font-size:.82rem;color:var(--text-muted);margin-bottom:16px">Edit your default shipping and delivery address for future orders.</p>
    <form id="update-address-form" style="max-width:620px;display:flex;flex-direction:column;gap:12px">
      <div>
        <label class="form-label" style="font-size:.76rem">Delivery Address *</label>
        <textarea id="prof-addr" class="form-input" rows="2" required placeholder="House / Flat No., Building Name, Street &amp; Locality" style="padding:10px 12px;font-size:.88rem;resize:vertical">${user.address || 'Flat 402, Green Glen Heights, HSR Layout'}</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label class="form-label" style="font-size:.76rem">City / Town *</label>
          <input type="text" id="prof-city" class="form-input" value="${user.city || 'Mumbai'}" required placeholder="City" style="height:42px;font-size:.88rem;padding:8px 12px">
        </div>
        <div>
          <label class="form-label" style="font-size:.76rem">Pincode *</label>
          <input type="text" id="prof-pincode" class="form-input" value="${user.pincode || '400001'}" required placeholder="6-digit pincode" maxlength="6" style="height:42px;font-size:.88rem;padding:8px 12px">
        </div>
      </div>
      <div>
        <label class="form-label" style="font-size:.76rem">Country *</label>
        <input type="text" id="prof-country" class="form-input" value="${user.country || 'India'}" required placeholder="Country" style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div style="display:flex;justify-content:flex-start;margin-top:6px">
        <button type="submit" class="btn btn-primary" style="font-size:.85rem;padding:10px 22px">Save Delivery Address 🏡</button>
      </div>
    </form>
  </div>

  <!-- Update Name Section -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <h4 style="font-family:var(--font-serif);font-size:1.15rem;margin-bottom:14px;color:var(--forest-dark)">Update Full Name</h4>
    <form id="update-name-form" style="max-width:540px;display:flex;gap:12px;align-items:flex-end">
      <div style="flex-grow:1">
        <label class="form-label" style="font-size:.76rem">Full Name *</label>
        <input type="text" id="prof-name" class="form-input" value="${user.name}" required placeholder="e.g. Akash Sharma" style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <button type="submit" class="btn btn-primary" style="font-size:.85rem;padding:11px 22px;white-space:nowrap">Save Name</button>
    </form>
  </div>

  <!-- Update Email Section -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <h4 style="font-family:var(--font-serif);font-size:1.15rem;margin-bottom:4px;color:var(--forest-dark)">Update Email Address</h4>
    <p style="font-size:.82rem;color:var(--text-muted);margin-bottom:14px">An OTP will be sent to your new email for verification.</p>
    <form id="update-email-form" style="max-width:540px;display:flex;flex-direction:column;gap:12px" data-step="1">
      <div>
        <label class="form-label" style="font-size:.76rem">Current Email</label>
        <input type="email" class="form-input" value="${user.email}" disabled style="opacity:0.75;height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div id="new-email-field">
        <label class="form-label" style="font-size:.76rem">New Email Address *</label>
        <input type="email" id="prof-new-email" class="form-input" placeholder="newemail@example.com" required style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div id="email-otp-field" style="display:none">
        <label class="form-label" style="font-size:.76rem">Enter 6-Digit OTP sent to new email</label>
        <input type="text" id="prof-email-otp" class="form-input" placeholder="6-digit OTP" maxlength="6" style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div style="display:flex;gap:10px">
        <button type="button" id="send-email-otp-btn" class="btn btn-primary" style="font-size:.85rem;padding:10px 20px">Send OTP</button>
        <button type="submit" id="verify-email-btn" class="btn btn-gold" style="display:none;font-size:.85rem;padding:10px 20px">Verify &amp; Update Email</button>
      </div>
    </form>
  </div>

  <!-- Registered Mobile Number with OTP Verification -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <h4 style="font-family:var(--font-serif);font-size:1.15rem;margin-bottom:4px;color:var(--forest-dark)">Registered Mobile Number</h4>
    <p style="font-size:.82rem;color:var(--text-muted);margin-bottom:14px">A 6-digit verification code will be sent to confirm your mobile number change.</p>
    <form id="update-phone-form" style="max-width:540px;display:flex;flex-direction:column;gap:12px">
      <div>
        <label class="form-label" style="font-size:.76rem">Current Registered Number</label>
        <input type="tel" class="form-input" value="${user.phone || '+91 98765 43210'}" disabled style="opacity:0.75;height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div id="new-phone-field">
        <label class="form-label" style="font-size:.76rem">New Mobile Number *</label>
        <input type="tel" id="prof-new-phone" class="form-input" placeholder="+91 98765 43210" required style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div id="phone-otp-field" style="display:none">
        <label class="form-label" style="font-size:.76rem">Enter 6-Digit OTP sent to mobile</label>
        <input type="text" id="prof-phone-otp" class="form-input" placeholder="6-digit OTP" maxlength="6" style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div style="display:flex;gap:10px">
        <button type="button" id="send-phone-otp-btn" class="btn btn-primary" style="font-size:.85rem;padding:10px 20px">Send OTP to Mobile</button>
        <button type="submit" id="verify-phone-btn" class="btn btn-gold" style="display:none;font-size:.85rem;padding:10px 20px">Verify &amp; Update Mobile</button>
      </div>
    </form>
  </div>

  <!-- Change Password Section with Close/Cancel option -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <div style="margin-bottom:4px">
      <h4 style="font-family:var(--font-serif);font-size:1.2rem;color:var(--forest-dark);margin:0">Change Password</h4>
    </div>
    <p style="font-size:.82rem;color:var(--text-muted);margin-bottom:16px;line-height:1.4">A 6-digit verification code will be sent to <strong style="color:var(--forest-dark)">${user.email}</strong> before password update.</p>
    
    <form id="change-password-form" style="max-width:540px;display:flex;flex-direction:column;gap:14px">
      <div id="pwd-otp-request-group">
        <button type="button" id="send-pwd-otp-btn" class="btn btn-primary" style="font-size:.85rem;padding:10px 22px">Send OTP to Email</button>
      </div>
      
      <div id="pwd-otp-fields" style="display:none;display:flex;flex-direction:column;gap:14px">
        <div style="background:rgba(197,160,89,0.12);border:1px solid rgba(197,160,89,0.3);border-radius:var(--r-sm);padding:10px 14px;font-size:.80rem;color:var(--forest-dark);display:flex;justify-content:space-between;align-items:center">
          <span>OTP sent to <strong>${user.email}</strong></span>
          <div style="display:flex;gap:12px;align-items:center">
            <button type="button" id="resend-pwd-otp-btn" style="background:none;border:none;color:var(--gold);font-weight:700;cursor:pointer;font-size:.80rem;text-decoration:underline">Resend</button>
            <button type="button" id="cancel-pwd-otp-btn" style="background:none;border:none;color:var(--error);font-weight:700;cursor:pointer;font-size:.80rem;text-decoration:underline">Cancel</button>
          </div>
        </div>

        <div>
          <label class="form-label" style="font-size:.76rem;margin-bottom:3px">Enter 6-Digit OTP *</label>
          <input type="text" id="pwd-otp-input" class="form-input" placeholder="e.g. 123456" maxlength="6" style="height:42px;font-size:.88rem;padding:8px 12px;letter-spacing:1.5px">
        </div>
        <div>
          <label class="form-label" style="font-size:.76rem;margin-bottom:3px">New Password *</label>
          <input type="password" id="prof-new-pwd" class="form-input" placeholder="Min 8 chars, 1 uppercase, 1 number" style="height:42px;font-size:.88rem;padding:8px 12px">
        </div>
        <div>
          <label class="form-label" style="font-size:.76rem;margin-bottom:3px">Confirm New Password *</label>
          <input type="password" id="prof-confirm-pwd" class="form-input" placeholder="Repeat new password" style="height:42px;font-size:.88rem;padding:8px 12px">
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <button type="submit" class="btn btn-gold" style="font-size:.88rem;padding:12px 24px;font-weight:800;border-radius:var(--r-md)">Verify &amp; Update Password</button>
          <button type="button" id="cancel-pwd-otp-btn-2" class="btn btn-secondary" style="font-size:.88rem;padding:12px 20px;border-radius:var(--r-md)">Cancel</button>
        </div>
      </div>
    </form>
  </div>`;
}

function renderSettingsTab(user) {
  return window.innerWidth >= 900 ? renderSettingsTabDesktop(user) : renderSettingsTabMobile(user);
}

// ============================================================
// FOOTER
// ============================================================
function renderFooterMobile() {
  return `
  <footer class="footer" style="padding:28px 0 60px">
    <div class="container">
      <div class="footer-grid" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;margin-bottom:20px;width:100%">
        
        <!-- Column 1: Follow Us -->
        <div class="footer-col" style="min-width:0;overflow:hidden">
          <h4 class="footer-col-title" style="color:var(--gold-bright);font-family:var(--font-serif);font-size:clamp(0.82rem, 3vw, 0.92rem);font-weight:700;height:24px;display:flex;align-items:center;margin:0 0 12px;white-space:nowrap">Follow Us</h4>
          <div class="footer-social-row" style="display:flex;flex-direction:column;gap:0">
            <!-- Row 1 -->
            <div style="height:28px;display:flex;align-items:center;margin-bottom:6px">
              <a href="https://instagram.com" target="_blank" rel="noopener" class="footer-social-link" style="display:flex;align-items:center;gap:6px;color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);text-decoration:none;white-space:nowrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                <span>Instagram</span>
              </a>
            </div>
            <!-- Row 2 -->
            <div style="height:28px;display:flex;align-items:center;margin-bottom:6px">
              <a href="https://twitter.com" target="_blank" rel="noopener" class="footer-social-link" style="display:flex;align-items:center;gap:6px;color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);text-decoration:none;white-space:nowrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span>X</span>
              </a>
            </div>
            <!-- Row 3 -->
            <div style="height:28px;display:flex;align-items:center;margin-bottom:6px">
              <a href="https://youtube.com" target="_blank" rel="noopener" class="footer-social-link" style="display:flex;align-items:center;gap:6px;color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);text-decoration:none;white-space:nowrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Column 2: Company -->
        <div class="footer-col" style="min-width:0;overflow:hidden">
          <h4 class="footer-col-title" style="color:var(--gold-bright);font-family:var(--font-serif);font-size:clamp(0.82rem, 3vw, 0.92rem);font-weight:700;height:24px;display:flex;align-items:center;margin:0 0 12px;white-space:nowrap">Company</h4>
          <ul class="footer-links" style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0">
            <!-- Row 1 -->
            <li style="height:28px;display:flex;align-items:center;margin-bottom:6px"><a data-route="shop" style="color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);cursor:pointer;white-space:nowrap">Shop All</a></li>
            <!-- Row 2 -->
            <li style="height:28px;display:flex;align-items:center;margin-bottom:6px"><a data-route="science" style="color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);cursor:pointer;white-space:nowrap">Our Science</a></li>
            <!-- Row 3 -->
            <li style="height:28px;display:flex;align-items:center;margin-bottom:6px"><a data-route="about" style="color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);cursor:pointer;white-space:nowrap">About Us</a></li>
            <!-- Row 4 -->
            <li style="height:28px;display:flex;align-items:center;margin-bottom:6px"><a data-route="contact" style="color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);cursor:pointer;white-space:nowrap">Contact</a></li>
          </ul>
        </div>

        <!-- Column 3: Support (Aligned Tabular with Row 1 & Row 2) -->
        <div class="footer-col" style="min-width:0;overflow:hidden">
          <h4 class="footer-col-title" style="color:var(--gold-bright);font-family:var(--font-serif);font-size:clamp(0.82rem, 3vw, 0.92rem);font-weight:700;height:24px;display:flex;align-items:center;margin:0 0 12px;white-space:nowrap">Support</h4>
          <div style="display:flex;flex-direction:column;gap:0">
            <!-- Row 1: Email Address -->
            <div style="height:28px;display:flex;align-items:center;margin-bottom:6px">
              <a href="mailto:aurite@gmail.com" class="footer-email-link" style="color:var(--gold-bright);text-decoration:none;font-size:clamp(0.66rem, 2.4vw, 0.78rem);line-height:1;word-break:break-all;overflow-wrap:anywhere;display:block">aurite@gmail.com</a>
            </div>
            <!-- Row 2: 100% LAB TESTED Badge -->
            <div style="height:28px;display:flex;align-items:center;margin-bottom:6px">
              <span style="background:#faf7f2;color:#0a1f16;font-size:clamp(0.48rem, 1.8vw, 0.54rem);font-weight:800;letter-spacing:.04em;padding:3px 8px;border-radius:999px;display:inline-flex;align-items:center;line-height:1;white-space:nowrap">100% LAB TESTED</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom" style="margin-top:20px;border-top:1px solid rgba(255,255,255,.08);padding-top:14px;display:flex;align-items:center;justify-content:space-between;flex-direction:row;flex-wrap:wrap;gap:8px;width:100%">
        <p style="font-size:clamp(0.68rem, 2.3vw, 0.76rem);margin:0;color:var(--text-light);white-space:nowrap">© 2026 Aurite Labs.</p>
        <div style="display:flex;gap:10px;margin:0;white-space:nowrap">
          <a href="#" id="footer-privacy-link" style="cursor:pointer;font-size:clamp(0.68rem, 2.3vw, 0.76rem);color:var(--text-light);text-decoration:none">Privacy Policy</a>
          <a href="#" id="footer-terms-link" style="cursor:pointer;font-size:clamp(0.68rem, 2.3vw, 0.76rem);color:var(--text-light);text-decoration:none">Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function renderFooterDesktop() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand-col">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            ${renderLogoSVG('#faf7f2', 32)}
            <span style="font-family:var(--font-serif);font-size:1.7rem;color:var(--sand-light);font-weight:600">Aurite</span>
          </div>
          <p style="font-size:.88rem;color:var(--text-light);line-height:1.65;margin-bottom:20px;max-width:320px">Clinically engineered nutraceuticals targeting cellular bio-available pathways for maximum whole-body longevity.</p>
        </div>
        <div class="footer-col">
          <h4>Follow Us</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <a href="https://instagram.com" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;color:var(--text-light);font-size:.88rem;text-decoration:none;transition:color .2s" onmouseover="this.style.color='#e1306c'" onmouseout="this.style.color=''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;color:var(--text-light);font-size:.88rem;text-decoration:none;transition:color .2s" onmouseover="this.style.color='#1da1f2'" onmouseout="this.style.color=''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;color:var(--text-light);font-size:.88rem;text-decoration:none;transition:color .2s" onmouseover="this.style.color='#ff0000'" onmouseout="this.style.color=''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              YouTube
            </a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <ul class="footer-links">
            <li><a data-route="shop">Shop All Formulations</a></li>
            <li><a data-route="science">Bio-Shield Science</a></li>
            <li><a data-route="about">About Aurite Labs</a></li>
            <li><a data-route="contact">Customer Support</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Support &amp; Quality</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <a href="mailto:aurite@gmail.com" class="footer-email-link" style="color:var(--gold-bright);text-decoration:none;font-size:.9rem">aurite@gmail.com</a>
            <div style="display:flex;align-items:center">
              <span style="background:#faf7f2;color:#0a1f16;font-size:.65rem;font-weight:800;letter-spacing:.04em;padding:4px 10px;border-radius:999px;display:inline-flex;align-items:center;line-height:1;white-space:nowrap">100% LAB TESTED</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Aurite Labs Inc. All clinical rights reserved.</p>
        <div style="display:flex;gap:20px">
          <a href="#" id="footer-privacy-link" style="cursor:pointer;color:var(--text-light);text-decoration:none">Privacy Policy</a>
          <a href="#" id="footer-terms-link" style="cursor:pointer;color:var(--text-light);text-decoration:none">Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function renderFooter() {
  return window.innerWidth >= 900 ? renderFooterDesktop() : renderFooterMobile();
}


// ============================================================
// ROUTER & NAVIGATION
// ============================================================
function navigate(route, productId = null) {
  if (!VALID_ROUTES.includes(route)) route = 'home';
  if (productId) activeProductId = productId;
  
  state.currentRoute = route;
  history.pushState({}, '', productId ? `#product/${productId}` : `#${route}`);
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  renderPage(route);
  refreshNavbar();
  updateNavbarScrollState();
  refreshMobileDock();
}

function renderPage(route) {
  const main = document.getElementById('app-main-content');
  if (!main) return;

  // Always scroll to the very top of page on any view/product render
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  let html = '';
  switch (route) {
    case 'shop':    html = renderShop(); break;
    case 'product': html = renderProductDetail(activeProductId); break;
    case 'science': html = renderScience(); break;
    case 'about':   html = renderAbout(); break;
    case 'contact': html = renderContact(); break;
    case 'profile': html = renderProfile(); break;
    case 'admin':   html = renderAdminPanel(); break;
    default:        html = renderHome(); break;
  }
  main.innerHTML = html;
  bindPageEvents(route);
  setupScrollAnimations();
  updateNavbarScrollState();
  refreshMobileDock();
}

function bindPageEvents(route) {
  if (route === 'home') {
    const grid = document.getElementById('home-grid');
    if (grid) bindProductGridEvents(grid);
    setTimeout(() => new ScrollCanvasEngine('scroll-canvas'), 80);
    setupCounters();

    // IN-PLACE LAB STEP UPDATE (NO FULL PAGE RELOAD)
    const labSteps = [
      { num: 1, title: 'Ethical Botanical Sourcing', phase: 'Botanical Extraction & Cold Storage Phase', temp: '-12°C Cold Storage', param: '100% Organic Habitat', desc: 'Wild-harvested marine algae and organic botanicals extracted at peak potency from certified eco-refuges.' },
      { num: 2, title: 'Supercritical CO₂ Extraction', phase: 'Supercritical CO₂ Molecular Separation Phase', temp: '31.1°C Critical Temp', param: '73.8 Bar Pressure', desc: 'Cold supercritical carbon dioxide isolates target bioactive compounds without thermal destruction or chemical solvents.' },
      { num: 3, title: 'Enteric Micro-Shielding', phase: 'Enteric Alginate Micro-Encapsulation Phase', temp: 'pH 1.5 Gastric Bypass', param: 'pH 7.4 Intestinal Release', desc: 'Patented alginate dual-capsule matrix shields sensitive probiotic strains and liposomal nutrients from stomach acid.' },
      { num: 4, title: 'ICP-MS Quadruple Audit', phase: 'ICP-MS Mass Spectrometry Quality Audit Phase', temp: '0.00 PPM Heavy Metals', param: 'ISO-17025 Certified', desc: 'Every production batch undergoes 4-stage mass spectrometry testing for heavy metals, microbial safety, and active purity.' }
    ];

    document.querySelectorAll('.lab-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const stepNum = parseInt(btn.dataset.step);
        activeProcessStep = stepNum;
        const stepData = labSteps[stepNum - 1];

        // Update button active classes
        document.querySelectorAll('.lab-step-btn').forEach(b => {
          const isActive = parseInt(b.dataset.step) === stepNum;
          b.classList.toggle('active', isActive);
          b.style.background = isActive ? 'var(--forest)' : 'var(--sand)';
          b.style.color = isActive ? '#fff' : 'var(--forest-dark)';
          b.style.borderColor = isActive ? 'var(--gold)' : 'var(--sand-border)';
        });

        // Update display card elements in-place with ZERO page reload
        const badge = document.getElementById('lab-step-badge');
        const title = document.getElementById('lab-step-title');
        const phase = document.getElementById('lab-step-phase');
        const desc = document.getElementById('lab-step-desc');
        const metA = document.getElementById('lab-metric-a');
        const metB = document.getElementById('lab-metric-b');

        if (badge) badge.textContent = `Step 0${stepData.num} Active`;
        if (title) title.textContent = stepData.title;
        if (phase) phase.textContent = stepData.phase;
        if (desc) desc.textContent = stepData.desc;
        if (metA) metA.textContent = stepData.temp;
        if (metB) metB.textContent = stepData.param;
      });
    });
  }

  if (route === 'shop') {
    const grid = document.getElementById('shop-grid');
    if (grid) bindProductGridEvents(grid);
    const pills = document.querySelector('.filter-pills');
    if (pills) {
      pills.addEventListener('click', e => {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;
        activeCategory = btn.dataset.cat;
        const main = document.getElementById('app-main-content');
        if (main) { main.innerHTML = renderShop(); bindPageEvents('shop'); }
      });
    }
  }

  if (route === 'product') {
    bindProductDetailEvents(activeProductId);
  }

  if (route === 'admin') {
    bindAdminEvents();
  }

  if (route === 'contact') {
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const nm = document.getElementById('ct-name')?.value.trim();
        const em = document.getElementById('ct-email')?.value.trim();
        const sub = document.getElementById('ct-subject')?.value;
        const msg = document.getElementById('ct-msg')?.value.trim();
        if (!nm || !em || !msg) { showToast('Please fill all required fields.'); return; }
        state.addCustomerQuery(nm, em, sub, msg);
        showToast('Query submitted! Redirecting to your profile... 🎉');
        form.reset();
        // If user is logged in, redirect to profile queries tab
        if (state.user) {
          profileTab = 'queries';
          setTimeout(() => navigate('profile'), 1000);
        }
      });
    }
  }

  if (route === 'profile') {
    document.querySelectorAll('[data-profile-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        profileTab = btn.dataset.profileTab;
        const content = document.getElementById('profile-content');
        const user = state.user || { name:'Alex Mercer', email:'alex@example.com' };
        if (content) {
          if (profileTab === 'orders') content.innerHTML = renderOrdersTab();
          else if (profileTab === 'queries') content.innerHTML = renderUserQueriesTab();
          else content.innerHTML = renderSettingsTab(user);
          document.querySelectorAll('.profile-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.profileTab === profileTab));
          bindProfileFormEvents();
          // bind user query card clicks
          document.querySelectorAll('.user-query-card').forEach(card => {
            card.addEventListener('click', () => openUserQueryChat(card.dataset.qid));
          });
        }
      });
    });
    bindProfileFormEvents();
    // bind user query card clicks on initial render
    document.querySelectorAll('.user-query-card').forEach(card => {
      card.addEventListener('click', () => openUserQueryChat(card.dataset.qid));
    });

    // bind profile actions (write review, request return, view return chat, product redirection) via event delegation
    const profileContainer = document.getElementById('profile-content');
    if (profileContainer) {
      profileContainer.addEventListener('click', (e) => {
        const viewRetBtn = e.target.closest('[data-action="view-return-chat"]');
        if (viewRetBtn) {
          e.preventDefault();
          e.stopPropagation();
          openUserReturnChatModal(viewRetBtn.dataset.retid);
          return;
        }

        const revBtn = e.target.closest('[data-action="write-review"]');
        if (revBtn) {
          e.preventDefault();
          e.stopPropagation();
          openReviewModal(revBtn.dataset.pid, revBtn.dataset.oid, revBtn.dataset.pname);
          return;
        }

        const retBtn = e.target.closest('[data-action="request-return"]');
        if (retBtn) {
          e.preventDefault();
          e.stopPropagation();
          openReturnModal(retBtn.dataset.oid, retBtn.dataset.pid, retBtn.dataset.pname, parseFloat(retBtn.dataset.price || 0));
          return;
        }

        const prodLink = e.target.closest('.order-prod-link');
        if (prodLink) {
          e.preventDefault();
          const pid = prodLink.dataset.pid;
          if (pid) navigate('product', pid);
          return;
        }
      });
    }
  }
}

function bindProfileFormEvents() {
  // Query Form Toggle & Submission
  const toggleQueryBtn = document.getElementById('toggle-query-form-btn');
  const cancelQueryBtn = document.getElementById('cancel-query-form-btn');
  const queryCard = document.getElementById('inline-query-form-card');
  if (toggleQueryBtn && queryCard) {
    toggleQueryBtn.addEventListener('click', () => {
      queryCard.style.display = queryCard.style.display === 'none' ? 'block' : 'none';
      if (queryCard.style.display === 'block') {
        document.getElementById('iq-subject')?.focus();
      }
    });
  }
  if (cancelQueryBtn && queryCard) {
    cancelQueryBtn.addEventListener('click', () => {
      queryCard.style.display = 'none';
    });
  }
  const inlineQueryForm = document.getElementById('inline-user-query-form');
  if (inlineQueryForm) {
    inlineQueryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sub = document.getElementById('iq-subject')?.value.trim();
      const msg = document.getElementById('iq-message')?.value.trim();
      if (!sub || !msg) { showToast('Please enter both subject and message.'); return; }
      state.addCustomerQuery(state.user?.name || 'Customer', state.user?.email || 'user@example.com', sub, msg);
      showToast('Support query created! Our team will respond shortly. 💬');
      const content = document.getElementById('profile-content');
      if (content) {
        content.innerHTML = renderUserQueriesTab();
        bindProfileFormEvents();
      }
    });
  }

  // Update Address form
  const addressForm = document.getElementById('update-address-form');
  if (addressForm) {
    addressForm.addEventListener('submit', e => {
      e.preventDefault();
      const addr = document.getElementById('prof-addr')?.value.trim();
      const city = document.getElementById('prof-city')?.value.trim();
      const pincode = document.getElementById('prof-pincode')?.value.trim();
      const country = document.getElementById('prof-country')?.value.trim() || 'India';
      if (!addr || !city || !pincode) {
        showToast('Please fill all mandatory address fields.');
        return;
      }
      state.updateUserAddress(addr, city, pincode, country);
      showToast('Delivery address updated successfully! 🏡');
      renderPage('profile');
    });
  }

  // Update Name form
  const nameForm = document.getElementById('update-name-form');
  if (nameForm) {
    nameForm.addEventListener('submit', e => {
      e.preventDefault();
      const nm = document.getElementById('prof-name')?.value.trim();
      if (!nm) { showToast('Name cannot be empty.'); return; }
      if (state.user) { state.user.name = nm; state._persist(); }
      showToast('Name updated successfully! ✅');
      renderPage('profile');
    });
  }

  // Mobile Number OTP Verification flow
  const sendPhoneOtpBtn = document.getElementById('send-phone-otp-btn');
  let generatedPhoneOtp = null;
  if (sendPhoneOtpBtn) {
    sendPhoneOtpBtn.addEventListener('click', () => {
      const newPhone = document.getElementById('prof-new-phone')?.value.trim();
      if (!newPhone || newPhone.length < 8) { showToast('Please enter a valid mobile number.'); return; }
      generatedPhoneOtp = String(Math.floor(100000 + Math.random() * 900000));
      showToast(`OTP sent to mobile! (Demo OTP: ${generatedPhoneOtp}) 📱`);
      document.getElementById('phone-otp-field').style.display = 'block';
      document.getElementById('verify-phone-btn').style.display = 'inline-flex';
      sendPhoneOtpBtn.textContent = 'Resend OTP';
    });
  }
  const phoneForm = document.getElementById('update-phone-form');
  if (phoneForm) {
    phoneForm.addEventListener('submit', e => {
      e.preventDefault();
      const enteredOtp = document.getElementById('prof-phone-otp')?.value.trim();
      const newPhone = document.getElementById('prof-new-phone')?.value.trim();
      if (!generatedPhoneOtp) { showToast('Please send OTP to mobile first.'); return; }
      if (enteredOtp !== generatedPhoneOtp) { showToast('Invalid OTP. Please try again.'); return; }
      state.updateUserPhone(newPhone);
      showToast('Mobile number updated successfully! ✅');
      generatedPhoneOtp = null;
      renderPage('profile');
    });
  }

  // Email OTP flow
  const sendEmailOtpBtn = document.getElementById('send-email-otp-btn');
  let generatedEmailOtp = null;
  if (sendEmailOtpBtn) {
    sendEmailOtpBtn.addEventListener('click', () => {
      const newEmail = document.getElementById('prof-new-email')?.value.trim();
      if (!newEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail)) { showToast('Please enter a valid new email address.'); return; }
      generatedEmailOtp = String(Math.floor(100000 + Math.random() * 900000));
      showToast(`OTP sent! (Demo OTP: ${generatedEmailOtp}) 📧`);
      document.getElementById('email-otp-field').style.display = 'block';
      document.getElementById('verify-email-btn').style.display = 'inline-flex';
      sendEmailOtpBtn.textContent = 'Resend OTP';
    });
  }
  const emailForm = document.getElementById('update-email-form');
  if (emailForm) {
    emailForm.addEventListener('submit', e => {
      e.preventDefault();
      const enteredOtp = document.getElementById('prof-email-otp')?.value.trim();
      const newEmail = document.getElementById('prof-new-email')?.value.trim();
      if (!generatedEmailOtp) { showToast('Please send OTP first.'); return; }
      if (enteredOtp !== generatedEmailOtp) { showToast('Invalid OTP. Please try again.'); return; }
      if (state.user) { state.user.email = newEmail; state._persist(); }
      showToast('Email updated successfully! ✅');
      generatedEmailOtp = null;
      renderPage('profile');
    });
  }

  // Password OTP flow (Unified for Mobile & Desktop with Cancel / Reset support)
  const sendPwdOtpBtn = document.getElementById('send-pwd-otp-btn');
  const resendPwdOtpBtn = document.getElementById('resend-pwd-otp-btn');
  const cancelPwdOtpBtn = document.getElementById('cancel-pwd-otp-btn');
  const cancelPwdOtpBtn2 = document.getElementById('cancel-pwd-otp-btn-2');
  let generatedPwdOtp = null;

  const triggerPasswordOtp = () => {
    generatedPwdOtp = String(Math.floor(100000 + Math.random() * 900000));
    showToast(`OTP sent to your email! (Demo OTP: ${generatedPwdOtp}) 📧`);
    const reqGroup = document.getElementById('pwd-otp-request-group');
    const fieldsGroup = document.getElementById('pwd-otp-fields');
    if (reqGroup) reqGroup.style.display = 'none';
    if (fieldsGroup) fieldsGroup.style.display = 'flex';
  };

  const resetPasswordOtpForm = () => {
    const reqGroup = document.getElementById('pwd-otp-request-group');
    const fieldsGroup = document.getElementById('pwd-otp-fields');
    if (reqGroup) reqGroup.style.display = 'block';
    if (fieldsGroup) fieldsGroup.style.display = 'none';
    const otpInput = document.getElementById('pwd-otp-input');
    const newPwdInput = document.getElementById('prof-new-pwd');
    const confirmPwdInput = document.getElementById('prof-confirm-pwd');
    if (otpInput) otpInput.value = '';
    if (newPwdInput) newPwdInput.value = '';
    if (confirmPwdInput) confirmPwdInput.value = '';
    generatedPwdOtp = null;
  };

  if (sendPwdOtpBtn) sendPwdOtpBtn.addEventListener('click', triggerPasswordOtp);
  if (resendPwdOtpBtn) resendPwdOtpBtn.addEventListener('click', triggerPasswordOtp);
  if (cancelPwdOtpBtn) cancelPwdOtpBtn.addEventListener('click', resetPasswordOtpForm);
  if (cancelPwdOtpBtn2) cancelPwdOtpBtn2.addEventListener('click', resetPasswordOtpForm);
  const pwdForm = document.getElementById('change-password-form');
  if (pwdForm) {
    pwdForm.addEventListener('submit', e => {
      e.preventDefault();
      const enteredOtp = document.getElementById('pwd-otp-input')?.value.trim();
      const newPwd = document.getElementById('prof-new-pwd')?.value;
      const confirmPwd = document.getElementById('prof-confirm-pwd')?.value;
      if (!generatedPwdOtp) { showToast('Please send OTP first.'); return; }
      if (enteredOtp !== generatedPwdOtp) { showToast('Invalid OTP. Please try again.'); return; }
      if (!newPwd || newPwd.length < 8) { showToast('Password must be at least 8 characters.'); return; }
      if (!/[A-Z]/.test(newPwd)) { showToast('Password must contain at least 1 uppercase letter.'); return; }
      if (!/[0-9]/.test(newPwd)) { showToast('Password must contain at least 1 number.'); return; }
      if (newPwd !== confirmPwd) { showToast('Passwords do not match.'); return; }
      if (state.user) { state.user.password = newPwd; state._persist(); }
      showToast('Password updated successfully! ✅');
      generatedPwdOtp = null;
      renderPage('profile');
    });
  }
}

function setupCounters() {
  const els = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const isDecimal = String(target).includes('.');
      const duration = 1800;
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const value = target * ease;
        el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value) + (target >= 100 ? 'k+' : target === 100 ? '%' : '');
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => observer.observe(el));
}

function setupScrollAnimations() {
  const targetSelectors = [
    '.animate-on-scroll',
    'section:not(.hero-section)',
    '.products-grid',
    '.product-card',
    '.product-detail-hero',
    '.product-bottom-grid',
    '.home-science-card',
    '.science-banner',
    '.science-research-card',
    '.science-cert-card',
    '.science-prohibited-card',
    '.science-page-grid > div',
    '.about-pillar-card',
    '.about-timeline-card',
    '.about-stat-card',
    '.sustainability-row',
    '.contact-grid > div',
    '.profile-sidebar',
    '#profile-content',
    '.profile-order-card',
    '.profile-query-card',
    '.metrics-row',
    '.shop-page-wrapper .container > div'
  ];

  const els = Array.from(document.querySelectorAll(targetSelectors.join(',')));
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Content reveals dynamically when 30% enters the viewport screen
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.30, // Exactly 30% in view screen
    rootMargin: '0px 0px -30px 0px'
  });

  const vh = window.innerHeight || document.documentElement.clientHeight;
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh * 0.85 && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    }
  });
}

// ============================================================
// MOBILE BOTTOM DOCK — module scope so navigate() can call it
// ============================================================
function renderMobileBottomDock() {
  const currentRoute = state.currentRoute || 'home';
  if (currentRoute === 'admin') {
    return `<nav class="reactbits-floating-dock" id="mobile-bottom-dock" style="display:none"></nav>`;
  }
  const cartCount = state.getCartCount();

  return `
  <nav class="reactbits-floating-dock" id="mobile-bottom-dock">
    <div class="dock-item ${currentRoute==='home'?'active':''}" data-route="home">
      ${svgIcon('home', 16)}
      <span>Home</span>
    </div>
    <div class="dock-item ${currentRoute==='shop'||currentRoute==='product'?'active':''}" data-route="shop">
      ${svgIcon('box', 16)}
      <span>Shop</span>
    </div>
    <div class="dock-item" id="dock-cart-btn">
      <div class="dock-icon-wrapper" style="position:relative;display:inline-flex;align-items:center;justify-content:center">
        ${svgIcon('cart', 16)}
        ${cartCount > 0 ? `<span class="dock-badge">${cartCount}</span>` : ''}
      </div>
      <span>Cart</span>
    </div>
    <div class="dock-item ${currentRoute==='profile'?'active':''}" data-route="profile">
      ${svgIcon('user', 16)}
      <span>Profile</span>
    </div>
  </nav>`;
}

function refreshMobileDock() {
  const dock = document.getElementById('mobile-bottom-dock');
  if (!dock) return;
  const currentRoute = state.currentRoute || 'home';
  if (currentRoute === 'admin') {
    dock.style.display = 'none';
    return;
  }
  dock.style.display = 'flex';

  dock.querySelectorAll('.dock-item').forEach(item => {
    const route = item.dataset.route;
    if (route) {
      if (route === currentRoute || (route === 'shop' && currentRoute === 'product') || (route === 'profile' && currentRoute === 'profile')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    } else {
      // cart btn — never active via route
      item.classList.remove('active');
    }
  });

  const cartCount = state.getCartCount();
  const cartIconWrapper = dock.querySelector('#dock-cart-btn .dock-icon-wrapper');
  if (cartIconWrapper) {
    let badge = cartIconWrapper.querySelector('.dock-badge');
    if (cartCount > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'dock-badge';
        cartIconWrapper.appendChild(badge);
      }
      badge.textContent = cartCount;
    } else if (badge) {
      badge.remove();
    }
  }
}

function bindDockEvents() {
  const dock = document.getElementById('mobile-bottom-dock');
  if (!dock) return;

  const handleDockAction = (item) => {
    if (!item) return;

    if (item.id === 'dock-cart-btn' || item.dataset.route === 'cart') {
      openCartDrawer();
      return;
    }

    const route = item.dataset.route;
    if (route && VALID_ROUTES.includes(route)) {
      closeCartDrawer();
      navigate(route);
    }
  };

  dock.addEventListener('click', (e) => {
    const item = e.target.closest('.dock-item');
    if (item) {
      e.preventDefault();
      e.stopPropagation();
      handleDockAction(item);
    }
  });

  dock.addEventListener('touchend', (e) => {
    const item = e.target.closest('.dock-item');
    if (item) {
      e.preventDefault();
      e.stopPropagation();
      handleDockAction(item);
    }
  }, { passive: false });
}

// ============================================================
// APP INIT & GLOBAL DELEGATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('app-root');
  root.innerHTML = `
    ${renderNavbar()}
    <main id="app-main-content" style="flex-grow:1"></main>
    <div id="footer-box">${renderFooter()}</div>
    ${renderMobileBottomDock()}
    <div id="cart-box">${renderCartHTML()}</div>
    <div id="modal-box"></div>
  `;

  bindNavbarEvents();
  bindCartEvents();
  bindDockEvents();

  // Pointer & Touch Spotlight Listener for ReactBits Cards
  document.addEventListener('pointermove', (e) => {
    document.querySelectorAll('.reactbits-spotlight-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  }, { passive: true });

  // Touch Feedback for Mobile Cards
  document.addEventListener('touchstart', (e) => {
    const card = e.target.closest('.reactbits-spotlight-card');
    if (card) {
      const rect = card.getBoundingClientRect();
      const touch = e.touches[0];
      card.style.setProperty('--mouse-x', `${touch.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${touch.clientY - rect.top}px`);
      card.classList.add('touch-active');
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    document.querySelectorAll('.reactbits-spotlight-card.touch-active').forEach(c => c.classList.remove('touch-active'));
  }, { passive: true });

  // Footer Privacy & Terms modals (mobile & desktop)
  document.addEventListener('click', (e) => {
    if (e.target.id === 'footer-privacy-link' || e.target.closest('#footer-privacy-link') || e.target.id === 'footer-privacy-link-mob' || e.target.closest('#footer-privacy-link-mob')) {
      e.preventDefault();
      openLegalModal('privacy');
      return;
    }
    if (e.target.id === 'footer-terms-link' || e.target.closest('#footer-terms-link') || e.target.id === 'footer-terms-link-mob' || e.target.closest('#footer-terms-link-mob')) {
      e.preventDefault();
      openLegalModal('terms');
      return;
    }
  });

  // SINGLE UNIFIED GLOBAL CLICK DELEGATION (cart + routing + admin tabs)
  document.addEventListener('click', (e) => {
    // --- Cart triggers ---
    const cartTrigger = e.target.closest('#nav-cart-btn, #drawer-cart-link, #dock-cart-btn, [data-action="open-cart"]');
    if (cartTrigger) {
      e.preventDefault();
      e.stopPropagation();
      openCartDrawer();
      const mDrawer = document.getElementById('mobile-drawer');
      if (mDrawer) mDrawer.classList.remove('open');
      return;
    }

    // --- Route links ([data-route]) ---
    const routeLink = e.target.closest('[data-route]');
    if (routeLink) {
      e.preventDefault();
      const route = routeLink.dataset.route;

      // Cart special case
      if (route === 'cart') {
        openCartDrawer();
        const mDrawer = document.getElementById('mobile-drawer');
        if (mDrawer) mDrawer.classList.remove('open');
        return;
      }
      // Login special case
      if (route === 'login') {
        openAuthModal('login');
        return;
      }
      // Valid page route
      if (route && VALID_ROUTES.includes(route)) {
        closeCartDrawer();
        navigate(route);
        const mDrawer = document.getElementById('mobile-drawer');
        if (mDrawer) mDrawer.classList.remove('open');
      }
      return;
    }

    // --- Logout action ---
    const logoutBtn = e.target.closest('#profile-logout-btn, [data-action="logout"]');
    if (logoutBtn) {
      e.preventDefault();
      state.logout();
      showToast('Signed out successfully. 👋');
      navigate('home');
      return;
    }

    // --- Open Login Modal ---
    const loginTrigger = e.target.closest('[data-action="open-login"]');
    if (loginTrigger) {
      e.preventDefault();
      openAuthModal('login');
      return;
    }

    // --- Profile tab buttons ([data-profile-tab]) ---
    const profTabBtn = e.target.closest('[data-profile-tab]');
    if (profTabBtn) {
      e.preventDefault();
      profileTab = profTabBtn.dataset.profileTab;
      const content = document.getElementById('profile-content');
      const user = state.user;
      if (content && user) {
        if (profileTab === 'orders') content.innerHTML = renderOrdersTab();
        else if (profileTab === 'queries') content.innerHTML = renderUserQueriesTab();
        else content.innerHTML = renderSettingsTab(user);
        document.querySelectorAll('[data-profile-tab]').forEach(b => {
          b.classList.toggle('active', b.dataset.profileTab === profileTab);
        });
        bindProfileFormEvents();
      }
      return;
    }

    // --- User Query Chat Trigger ---
    const queryChatBtn = e.target.closest('[data-action="open-query-chat"]');
    if (queryChatBtn) {
      e.preventDefault();
      openUserQueryChatModal(queryChatBtn.dataset.qid);
      return;
    }

    // --- View Return Chat Trigger ---
    const retChatBtn = e.target.closest('[data-action="view-return-chat"]');
    if (retChatBtn) {
      e.preventDefault();
      openUserReturnChatModal(retChatBtn.dataset.retid);
      return;
    }

    // --- Request Return Trigger ---
    const reqRetBtn = e.target.closest('[data-action="request-return"]');
    if (reqRetBtn) {
      e.preventDefault();
      openReturnModal(reqRetBtn.dataset.oid, reqRetBtn.dataset.pid, reqRetBtn.dataset.pname, parseFloat(reqRetBtn.dataset.price || 0));
      return;
    }

    // --- Write Review Trigger ---
    const revBtn = e.target.closest('[data-action="write-review"]');
    if (revBtn) {
      e.preventDefault();
      openReviewModal(revBtn.dataset.pid, revBtn.dataset.oid, revBtn.dataset.pname);
      return;
    }

    // --- Cancel Order Trigger (Only for Processing orders + Dispatches Query to Admin Dashboard) ---
    const cancelOrdBtn = e.target.closest('[data-action="cancel-order"]');
    if (cancelOrdBtn) {
      e.preventDefault();
      const oid = cancelOrdBtn.dataset.oid;
      const ord = (state.orders || []).find(o => o.id === oid);
      if (ord && ord.status === 'Processing') {
        ord.status = 'Cancelled';
        
        // Log new query in Admin Dashboard for cancellation tracking
        const customerName = ord.customerName || state.user?.name || 'Customer';
        const customerEmail = ord.email || state.user?.email || 'user@example.com';
        const itemsList = (ord.items || []).map(i => `${i.name} (x${i.qty})`).join(', ');
        const querySubject = `Order Cancellation Request: #${oid}`;
        const queryMessage = `Customer ${customerName} has cancelled Order #${oid} while it was in Processing status. Total Amount: ${formatPrice(ord.total)}. Items: ${itemsList}. Order status updated to Cancelled.`;
        
        state.addCustomerQuery(customerName, customerEmail, querySubject, queryMessage);
        state._persist();
        state._notify({ orders: true, queries: true, admin: true });
        
        showToast(`Order #${oid} has been cancelled successfully.`);
        const content = document.getElementById('profile-content');
        if (content) {
          content.innerHTML = renderOrdersTab();
          bindProfileFormEvents();
        }
      } else if (ord && ord.status !== 'Processing') {
        showToast(`Order #${oid} is already ${ord.status.toLowerCase()} and cannot be cancelled.`);
      }
      return;
    }

    // --- Admin tab buttons ---
    const admTabBtn = e.target.closest('[data-adm-tab]');
    if (admTabBtn) {
      e.preventDefault();
      activeAdminTab = admTabBtn.dataset.admTab;
      document.querySelectorAll('[data-adm-tab]').forEach(b => {
        b.classList.toggle('active', b.dataset.admTab === activeAdminTab);
      });
      const container = document.getElementById('admin-tab-content');
      if (container) {
        container.innerHTML = renderAdminTabContent(activeAdminTab, state.getAnalytics());
        bindAdminEvents();
      }
    }
  });

  
  // Responsive cross-breakpoint live update (900px boundary)
  let lastIsDesktop = window.innerWidth >= 900;
  window.addEventListener('resize', () => {
    const currIsDesktop = window.innerWidth >= 900;
    if (currIsDesktop !== lastIsDesktop) {
      lastIsDesktop = currIsDesktop;
      renderPage(state.currentRoute);
      refreshNavbar();
      refreshMobileDock();
      const foot = document.getElementById('footer-box');
      if (foot) foot.innerHTML = renderFooter();
    }
  });

  // Initial route from hash
  const hash = window.location.hash.replace('#', '').trim();
  if (hash.startsWith('product/')) {
    const pid = hash.replace('product/', '');
    state.currentRoute = 'product';
    activeProductId = pid;
    renderPage('product');
  } else {
    const initRoute = VALID_ROUTES.includes(hash) ? hash : 'home';
    state.currentRoute = initRoute;
    renderPage(initRoute);
  }

  // Handle browser back/forward navigation
  window.addEventListener('popstate', () => {
    const h = window.location.hash.replace('#','').trim();
    if (h.startsWith('product/')) {
      activeProductId = h.replace('product/', '');
      state.currentRoute = 'product';
      renderPage('product');
    } else {
      const r = VALID_ROUTES.includes(h) ? h : 'home';
      state.currentRoute = r;
      renderPage(r);
    }
    refreshNavbar();
    refreshMobileDock();
  });

  // Reactive state subscriber
  state.subscribe((s, flags) => {
    if (flags.cart) {
      // Re-render cart contents
      let box = document.getElementById('cart-box');
      if (!box) {
        box = document.createElement('div');
        box.id = 'cart-box';
        document.body.appendChild(box);
      }
      box.innerHTML = renderCartHTML();
      bindCartEvents();
      // Sync open/close state of overlay
      const overlay = document.getElementById('cart-overlay');
      if (overlay) {
        if (s.isCartOpen) overlay.classList.add('open');
        else overlay.classList.remove('open');
      }
      // Update navbar cart badge
      const navbar = document.getElementById('main-navbar');
      if (navbar) {
        const cartBtn = navbar.querySelector('#nav-cart-btn');
        const cnt = s.getCartCount();
        if (cartBtn) {
          let b = cartBtn.querySelector('.cart-badge-count');
          if (cnt > 0) {
            if (!b) { b = document.createElement('span'); b.className = 'cart-badge-count'; cartBtn.appendChild(b); }
            b.textContent = cnt;
          } else if (b) b.remove();
        }
      }
      refreshMobileDock();
    }
    if (flags.auth) {
      if (s.isAuthOpen) openAuthModal('login');
      else { const box = document.getElementById('modal-box'); if (box) box.innerHTML = ''; }
    }
    if (flags.checkout) {
      if (s.isCheckoutOpen) openCheckoutModal();
    }
    if (flags.quickview && s.quickViewProduct) openQuickView(s.quickViewProduct);
    if (flags.route || flags.products || flags.admin || flags.orders || flags.queries) {
      renderPage(s.currentRoute);
      refreshNavbar();
      refreshMobileDock();
    }
    if (flags.navbar) {
      refreshNavbar();
      refreshMobileDock();
    }
  });
});
