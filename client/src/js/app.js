import { state } from './state.js';
import { PRODUCTS } from './productsData.js';
import { renderNavbar, bindNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderCartDrawer, bindCartEvents } from './components/cartDrawer.js';
import { renderQuickViewModal, bindQuickViewEvents } from './components/quickViewModal.js';
import { renderCheckoutModal, bindCheckoutEvents } from './components/checkoutModal.js';
import { renderAuthModal, bindAuthEvents } from './components/authModal.js';
import { renderPolicyModal, bindPolicyModalEvents } from './components/policyModal.js';
import { renderHomePage, bindHomePageEvents, updateCircularGallery } from './pages/home.js';
import { renderShopPage, bindShopPageEvents, setShopFilter } from './pages/shop.js';
import { renderAboutPage, bindAboutPageEvents } from './pages/about.js';
import { renderSciencePage } from './pages/science.js';
import { renderContactPage, bindContactPageEvents } from './pages/contact.js';
import { renderProfilePage, bindProfilePageEvents } from './pages/profile.js';
import { renderAdminPage, bindAdminPageEvents, refreshAdminView } from './pages/admin.js';
import { renderAdminLoginPage, bindAdminLoginPageEvents } from './pages/adminLogin.js';
import { renderNotFoundPage, bindNotFoundPageEvents } from './pages/notFound.js';
import { renderProductCard, bindProductCardEvents } from './components/productCard.js';
import { showToast } from './components/toast.js';
import { showAlertModal, dismissConfirmModal } from './components/confirmModal.js';
import { setModalAuthTab } from './components/authModal.js';
import { auth, getUserDoc } from './services/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { updateSEO } from './seo.js';

function refreshNavbar() {
  const navRoot = document.getElementById('navbar-root');
  if (navRoot) {
    navRoot.innerHTML = renderNavbar();
    bindNavbarEvents();
    updateNavbarScrollState();
  }
}

// Ensure no native browser alert() dialog ever opens; always use luxury popup modal
window.alert = (msg) => {
  showAlertModal({
    title: 'VALEORA',
    message: String(msg || ''),
    buttonText: 'Understood'
  });
};

export const VALID_ROUTES = ['home', 'shop', 'about', 'science', 'contact', 'profile', 'admin', 'admin-login', '404'];

export function parseRouteFromURL() {
  const hash = (window.location.hash || '').replace(/^#\/?/, '').trim().toLowerCase();
  const pathname = (window.location.pathname || '').replace(/^\/+|\/+$/g, '').trim().toLowerCase();

  // 1. Check Hash routing
  if (hash) {
    if (hash === 'admin/login' || hash === 'admin-login') return 'admin-login';
    if (hash === 'admin') {
      return (state.user && state.isAdmin) ? 'admin' : 'admin-login';
    }
    if (VALID_ROUTES.includes(hash)) return hash;
    return '404';
  }

  // 2. Check Pathname routing
  if (pathname && pathname !== 'index.html') {
    if (pathname === 'admin/login' || pathname === 'admin-login') return 'admin-login';
    if (pathname === 'admin') {
      return (state.user && state.isAdmin) ? 'admin' : 'admin-login';
    }
    if (VALID_ROUTES.includes(pathname)) return pathname;
    return '404';
  }

  return 'home';
}

function updateNavbarScrollState() {
  const navbar = document.querySelector('.valeora-navbar');
  if (!navbar) return;

  const currentRoute = state.currentRoute || 'home';
  if (currentRoute !== 'home') {
    navbar.classList.add('scrolled');
    return;
  }

  // On home page, at top of screen (or scroll position near 0), navbar is always transparent
  if (window.scrollY < 20) {
    navbar.classList.remove('scrolled');
    return;
  }

  const heroSection = document.getElementById('hero-section');
  const threshold = (heroSection && heroSection.offsetHeight > 100)
    ? Math.max(heroSection.offsetHeight * 0.30, 80)
    : 80;

  if (window.scrollY >= threshold) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

let savedScrollPosition = 0;

function updateBodyScrollLock() {
  const isAnyModalOpen = Boolean(
    state.isCartOpen ||
    state.isAuthOpen ||
    state.isCheckoutOpen ||
    state.policyModalType ||
    state.quickViewProduct ||
    state.isMobileMenuOpen
  );

  if (isAnyModalOpen) {
    if (!document.body.classList.contains('no-scroll')) {
      savedScrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      document.body.classList.add('no-scroll');
    }
  } else {
    if (document.body.classList.contains('no-scroll')) {
      document.body.classList.remove('no-scroll');
      if (savedScrollPosition > 0) {
        window.scrollTo({ top: savedScrollPosition, behavior: 'instant' });
      }
    }
  }
}

function renderApp() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const currentRoute = state.currentRoute || 'home';

  // 1. Dedicated Admin Login Page (/admin/login)
  if (currentRoute === 'admin-login') {
    if (state.user && state.isAdmin) {
      state.setRoute('admin');
      return;
    }
    root.innerHTML = `
      <div id="navbar-root">${renderNavbar()}</div>
      <main id="app-main-content" style="flex-grow:1; padding-top: 74px;">
        ${renderAdminLoginPage()}
      </main>
      <div id="modal-cart-root">${renderCartDrawer()}</div>
      <div id="modal-quickview-root">${renderQuickViewModal()}</div>
      <div id="modal-checkout-root">${renderCheckoutModal()}</div>
      <div id="modal-auth-root">${renderAuthModal()}</div>
      <div id="modal-policy-root">${renderPolicyModal()}</div>
    `;
    try { bindNavbarEvents(); } catch (e) {}
    try { bindCartEvents(); } catch (e) {}
    try { bindQuickViewEvents(); } catch (e) {}
    try { bindCheckoutEvents(); } catch (e) {}
    try { bindAuthEvents(); } catch (e) {}
    try { bindPolicyModalEvents(); } catch (e) {}
    try { bindAdminLoginPageEvents(); } catch (e) {}
    updateSEO('admin-login');
    updateNavbarScrollState();
    updateBodyScrollLock();
    return;
  }

  // 2. Standalone Admin Portal View (/admin)
  if (currentRoute === 'admin') {
    if (state.user && state.isAdmin) {
      root.innerHTML = renderAdminPage();
      if (bindAdminPageEvents) bindAdminPageEvents();
      updateSEO('admin');
      updateBodyScrollLock();
      return;
    } else {
      state.setRoute('admin-login');
      return;
    }
  }

  let pageContent = '';
  switch (currentRoute) {
    case 'shop':
      pageContent = renderShopPage();
      break;
    case 'about':
      pageContent = renderAboutPage();
      break;
    case 'science':
      pageContent = renderSciencePage();
      break;
    case 'contact':
      pageContent = renderContactPage();
      break;
    case 'profile':
      if (state.user) {
        pageContent = renderProfilePage();
      } else {
        pageContent = renderHomePage();
        setTimeout(() => state.toggleAuthModal(true), 50);
      }
      break;
    case '404':
      pageContent = renderNotFoundPage();
      break;
    case 'home':
      pageContent = renderHomePage();
      break;
    default:
      pageContent = renderNotFoundPage();
      break;
  }

  root.innerHTML = `
    <div id="navbar-root">${renderNavbar()}</div>
    <main id="app-main-content" style="flex-grow:1;">
      ${pageContent}
    </main>
    ${renderFooter()}
    <div id="modal-cart-root">${renderCartDrawer()}</div>
    <div id="modal-quickview-root">${renderQuickViewModal()}</div>
    <div id="modal-checkout-root">${renderCheckoutModal()}</div>
    <div id="modal-auth-root">${renderAuthModal()}</div>
    <div id="modal-policy-root">${renderPolicyModal()}</div>
  `;

  // Bind All Component & Page Events
  bindNavbarEvents();
  bindCartEvents();
  bindQuickViewEvents();
  bindCheckoutEvents();
  bindAuthEvents();
  bindPolicyModalEvents();

  try {
    if (currentRoute === 'home') {
      bindHomePageEvents();
    } else if (currentRoute === 'shop') {
      bindShopPageEvents();
    } else if (currentRoute === 'about') {
      bindAboutPageEvents();
    } else if (currentRoute === 'contact') {
      bindContactPageEvents();
    } else if (currentRoute === 'profile' && state.user && bindProfilePageEvents) {
      bindProfilePageEvents();
    } else if (currentRoute === 'admin' && state.user && state.isAdmin && bindAdminPageEvents) {
      bindAdminPageEvents();
    } else if (currentRoute === '404' && bindNotFoundPageEvents) {
      bindNotFoundPageEvents();
    }
  } catch (err) {
    console.warn('Page-specific event binding warning:', err);
  }

  updateSEO(currentRoute);
  updateNavbarScrollState();
  updateBodyScrollLock();
}

// Global Routing & Policy Event Listener
document.addEventListener('click', (e) => {
  // 1. Quick View delegation (takes precedence over parent cards with data-route)
  const qvBtn = e.target.closest('[data-action="quick-view"]');
  if (qvBtn) {
    e.preventDefault();
    e.stopPropagation();
    const pid = qvBtn.getAttribute('data-product-id');
    const catalog = state.products?.length ? state.products : PRODUCTS;
    const product = catalog.find(p => p.id === pid);
    if (product) {
      state.setQuickViewProduct(product);
    }
    return;
  }

  // 1b. Navbar Cart Buttons delegation
  const cartTrigger = e.target.closest('[data-action="cart"], #nav-cart-btn, #nav-mobile-cart-btn, #drawer-bag-quick-btn');
  if (cartTrigger) {
    e.preventDefault();
    state.toggleMobileMenu(false);
    state.toggleCart(true);
    return;
  }

  // 1c. Navbar User / Profile Button delegation
  const userTrigger = e.target.closest('[data-action="user"], #nav-user-btn');
  if (userTrigger) {
    e.preventDefault();
    state.toggleMobileMenu(false);
    if (state.user) {
      state.setRoute('profile');
    } else {
      state.toggleAuthModal(true);
    }
    return;
  }

  // 2. Policy links
  const policyLink = e.target.closest('[data-policy]');
  if (policyLink) {
    e.preventDefault();
    const policyType = policyLink.getAttribute('data-policy');
    if (policyType) {
      state.openPolicyModal(policyType);
    }
    return;
  }

  // 3. Route links
  const routeLink = e.target.closest('[data-route]');
  if (routeLink) {
    e.preventDefault();
    const route = routeLink.getAttribute('data-route');
    const shopFilter = routeLink.getAttribute('data-shop-filter');
    if (shopFilter) {
      setShopFilter(shopFilter);
    }

    if (route === 'login' || route === 'signup' || route === 'auth') {
      setModalAuthTab(route === 'signup' ? 'register' : 'login');
      state.toggleAuthModal(true);
      return;
    }

    if (route === 'profile' && !state.user) {
      setModalAuthTab('login');
      state.toggleAuthModal(true);
      return;
    }

    if (route && VALID_ROUTES.includes(route)) {
      state.setRoute(route);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    return;
  }

  // 4. Full Product Card Click Delegation (Home / Shop / Featured)
  const productCard = e.target.closest('.valeora-product-card');
  if (productCard && !e.target.closest('[data-action="add-cart"]')) {
    const pid = productCard.getAttribute('data-product-id');
    const catalog = state.products?.length ? state.products : PRODUCTS;
    const product = catalog.find(p => p.id === pid);
    if (product) {
      state.setQuickViewProduct(product);
    }
  }
});

// Listen for WebGL and Component Quick View Custom Events
window.addEventListener('valeora:quick-view', (e) => {
  const pid = e.detail?.productId;
  if (pid) {
    const catalog = state.products?.length ? state.products : PRODUCTS;
    const product = catalog.find(p => p.id === pid);
    if (product) {
      state.setQuickViewProduct(product);
    }
  }
});

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  const initialRoute = parseRouteFromURL();
  state.currentRoute = initialRoute;

  if (initialRoute === 'admin-login' && (window.location.pathname === '/admin' || window.location.hash)) {
    history.replaceState(null, '', '/admin/login');
  }

  renderApp();

  // Firebase Real-time Session Observer
  try {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getUserDoc(firebaseUser.uid);
          state.setFirebaseUser(firebaseUser, userData);
        } catch (e) {
          state.setFirebaseUser(firebaseUser, null);
        }
      } else if (state.user && state.user.uid) {
        state.setFirebaseUser(null);
      }
    });
  } catch (e) {
    console.warn('Firebase onAuthStateChanged setup:', e);
  }

  // Window scroll listener for 95% hero scroll navbar transition
  window.addEventListener('scroll', updateNavbarScrollState, { passive: true });

  // Listen to state changes with surgical DOM updates (0ms latency, zero scroll jump)
  state.subscribe((s, flags) => {
    if (flags.route) {
      savedScrollPosition = 0;
      window.scrollTo({ top: 0, behavior: 'instant' });
      dismissConfirmModal();
      renderApp();
      return;
    }

    if (flags.quickview !== undefined) {
      const qvRoot = document.getElementById('modal-quickview-root');
      if (qvRoot) {
        qvRoot.innerHTML = renderQuickViewModal();
        bindQuickViewEvents();
      }
      if (state.quickViewProduct) {
        updateSEO(state.currentRoute, state.quickViewProduct);
      } else {
        updateSEO(state.currentRoute);
      }
    }

    if (flags.cart !== undefined) {
      const cartRoot = document.getElementById('modal-cart-root');
      if (cartRoot) {
        cartRoot.innerHTML = renderCartDrawer();
        bindCartEvents();
      }
      const cartBadges = document.querySelectorAll('.nav-badge-count');
      cartBadges.forEach(b => {
        b.textContent = state.getCartCount();
      });
    }

    if (flags.checkout !== undefined) {
      const chkRoot = document.getElementById('modal-checkout-root');
      if (chkRoot) {
        chkRoot.innerHTML = renderCheckoutModal();
        bindCheckoutEvents();
      }
    }

    if (flags.auth !== undefined) {
      const authRoot = document.getElementById('modal-auth-root');
      if (authRoot) {
        authRoot.innerHTML = renderAuthModal();
        bindAuthEvents();
      }
    }

    if (flags.policy !== undefined) {
      const polRoot = document.getElementById('modal-policy-root');
      if (polRoot) {
        polRoot.innerHTML = renderPolicyModal();
        bindPolicyModalEvents();
      }
    }

    if (flags.products !== undefined) {
      if (state.currentRoute === 'shop') {
        const main = document.getElementById('app-main-content');
        if (main) {
          main.innerHTML = renderShopPage();
          bindShopPageEvents();
        }
      } else if (state.currentRoute === 'home') {
        const homeFeaturedGrid = document.getElementById('home-featured-grid');
        if (homeFeaturedGrid) {
          const allProducts = state.products || [];
          const featuredArrivals = allProducts.slice(0, 4);
          homeFeaturedGrid.innerHTML = featuredArrivals.length > 0
            ? featuredArrivals.map(product => product ? renderProductCard(product) : '').join('')
            : `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(214,184,190,0.2); border-radius: 16px; color: #ECCFD0; font-size: 0.88rem;">
                  ✨ New signature jewelry pieces are being added to the catalog.
                </div>
              `;
          bindProductCardEvents(homeFeaturedGrid, allProducts);
        }
        updateCircularGallery();
      } else if (state.currentRoute === 'admin' && state.user && state.isAdmin) {
        refreshAdminView(true);
      }

      if (state.quickViewProduct) {
        const updated = (state.products || []).find(p => p.id === state.quickViewProduct.id);
        if (updated) {
          state.quickViewProduct = updated;
          const qvRoot = document.getElementById('modal-quickview-root');
          if (qvRoot) {
            qvRoot.innerHTML = renderQuickViewModal();
            bindQuickViewEvents();
          }
        }
      }
    }

    if (flags.coupons !== undefined) {
      const cartRoot = document.getElementById('modal-cart-root');
      if (cartRoot) {
        cartRoot.innerHTML = renderCartDrawer();
        bindCartEvents();
      }
      const chkRoot = document.getElementById('modal-checkout-root');
      if (chkRoot && state.isCheckoutOpen) {
        chkRoot.innerHTML = renderCheckoutModal();
        bindCheckoutEvents();
      }
      if (state.currentRoute === 'admin' && state.user && state.isAdmin) {
        refreshAdminView(true);
      }
    }

    if (flags.users !== undefined) {
      refreshNavbar();
      if (state.currentRoute === 'admin' && state.user && state.isAdmin) {
        refreshAdminView(true);
      }
    }

    if (flags.user !== undefined || flags.auth !== undefined) {
      refreshNavbar();
      if (state.currentRoute === 'profile') {
        const main = document.getElementById('app-main-content');
        if (main) {
          if (state.user) {
            main.innerHTML = renderProfilePage();
            bindProfilePageEvents();
          } else {
            state.setRoute('home');
          }
        }
      } else if (state.currentRoute === 'admin') {
        if (state.user && state.isAdmin) {
          refreshAdminView(true);
        } else {
          state.setRoute('admin-login');
        }
      } else if (state.currentRoute === 'admin-login' && state.user && state.isAdmin) {
        state.setRoute('admin');
      }
    }

    if (flags.orders !== undefined) {
      if (state.currentRoute === 'profile' && state.user) {
        const main = document.getElementById('app-main-content');
        if (main) {
          main.innerHTML = renderProfilePage();
          bindProfilePageEvents();
        }
      } else if (state.currentRoute === 'admin' && state.user && state.isAdmin) {
        refreshAdminView(true);
      }
    }

    if (flags.queries !== undefined) {
      if (state.currentRoute === 'profile' && state.user) {
        const main = document.getElementById('app-main-content');
        if (main) {
          main.innerHTML = renderProfilePage();
          bindProfilePageEvents();
        }
      } else if (state.currentRoute === 'admin' && state.user && state.isAdmin) {
        refreshAdminView(true);
      }
    }

    if (flags.returns !== undefined) {
      if (state.currentRoute === 'admin' && state.user && state.isAdmin) {
        refreshAdminView(true);
      }
    }

    if (flags.mobileMenu !== undefined || flags.navbar !== undefined) {
      const drawerOverlay = document.getElementById('mobile-drawer-overlay');
      const burgerBtn = document.getElementById('mobile-burger-btn');
      if (drawerOverlay) {
        if (state.isMobileMenuOpen) {
          drawerOverlay.classList.add('open');
        } else {
          drawerOverlay.classList.remove('open');
        }
      }
      if (burgerBtn) {
        burgerBtn.setAttribute('aria-expanded', state.isMobileMenuOpen ? 'true' : 'false');
        if (state.isMobileMenuOpen) {
          burgerBtn.classList.add('active');
        } else {
          burgerBtn.classList.remove('active');
        }
      }
    }

    updateNavbarScrollState();
    updateBodyScrollLock();
  });

  // Handle browser back/forward history
  window.addEventListener('popstate', () => {
    const route = parseRouteFromURL();
    state.currentRoute = route;
    dismissConfirmModal();
    renderApp();
  });
});
