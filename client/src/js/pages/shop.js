import { state } from '../state.js';
import { PRODUCTS, SUBCATEGORIES_CONFIG } from '../productsData.js';
import { renderProductCard, bindProductCardEvents } from '../components/productCard.js';

let activeFilter = 'For Everyone'; // 'For Everyone' | 'For Her' | 'For Him'
let activeSubcategory = 'all'; // 'all' | subcategory key

export function setShopFilter(filter, subcategory = null) {
  if (!filter) return;
  const f = filter.toLowerCase();
  if (f.includes('him') || f.includes('men')) {
    activeFilter = 'For Him';
  } else if (f.includes('her') || f.includes('women')) {
    activeFilter = 'For Her';
  } else {
    activeFilter = 'For Everyone';
  }

  const validSubs = getAvailableSubcategories(activeFilter).map(s => s.id);
  if (subcategory && validSubs.includes(subcategory)) {
    activeSubcategory = subcategory;
  } else if (!validSubs.includes(activeSubcategory)) {
    activeSubcategory = 'all';
  }
}

export function getShopFilter() {
  return { audience: activeFilter, subcategory: activeSubcategory };
}

function getAvailableSubcategories(audienceFilter) {
  if (audienceFilter === 'For Him') {
    return SUBCATEGORIES_CONFIG.men;
  } else if (audienceFilter === 'For Her') {
    return SUBCATEGORIES_CONFIG.women;
  }
  return SUBCATEGORIES_CONFIG.all;
}

function normalizeKey(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchProductSubcategory(product, targetSubcategory) {
  if (!targetSubcategory || targetSubcategory === 'all') return true;

  const targetNorm = normalizeKey(targetSubcategory);
  const prodSubNorm = normalizeKey(product.subcategory);
  const prodCatNorm = normalizeKey(product.category);
  const prodNameNorm = normalizeKey(product.name);

  // Direct subcategory match
  if (prodSubNorm && (prodSubNorm === targetNorm || prodSubNorm.startsWith(targetNorm) || targetNorm.startsWith(prodSubNorm))) {
    return true;
  }

  // Handle specific subcategory alias logic
  if (targetNorm === 'chains' || targetNorm === 'chain') {
    return prodSubNorm.includes('chain') || prodCatNorm.includes('chain') || prodNameNorm.includes('chain');
  }

  if (targetNorm === 'handchains' || targetNorm === 'handchain') {
    return prodSubNorm.includes('hand') || prodSubNorm.includes('chain') || prodSubNorm.includes('bracelet') || prodCatNorm.includes('chain') || prodCatNorm.includes('bracelet') || prodNameNorm.includes('figaro') || prodNameNorm.includes('hand');
  }

  if (targetNorm === 'handbracelets' || targetNorm === 'handbracelet') {
    return prodSubNorm.includes('hand') || prodSubNorm.includes('bracelet') || prodCatNorm.includes('bracelet') || prodNameNorm.includes('bracelet');
  }

  if (targetNorm === 'rings' || targetNorm === 'ring') {
    return prodSubNorm.includes('ring') || prodCatNorm.includes('ring') || prodNameNorm.includes('ring');
  }

  if (targetNorm === 'necklace' || targetNorm === 'necklaces') {
    return prodSubNorm.includes('necklace') || prodSubNorm.includes('choker') || prodCatNorm.includes('necklace') || prodNameNorm.includes('necklace') || prodNameNorm.includes('choker');
  }

  if (targetNorm === 'pendant' || targetNorm === 'pendants') {
    return prodSubNorm.includes('pendant') || prodCatNorm.includes('pendant') || prodNameNorm.includes('pendant');
  }

  if (targetNorm === 'earrings' || targetNorm === 'earring' || targetNorm === 'earing') {
    return prodSubNorm.includes('earring') || prodSubNorm.includes('earing') || prodCatNorm.includes('earring') || prodNameNorm.includes('earring');
  }

  if (targetNorm === 'bracelets' || targetNorm === 'bracelet' || targetNorm === 'handbracelets' || targetNorm === 'handbracelet') {
    return prodSubNorm.includes('bracelet') || prodCatNorm.includes('bracelet') || prodNameNorm.includes('bracelet') || prodNameNorm.includes('figaro');
  }

  return prodSubNorm === targetNorm || prodCatNorm === targetNorm;
}

export function renderShopPage() {
  const filterPills = [
    { id: 'For Everyone', label: 'For Everyone' },
    { id: 'For Her', label: 'For Her' },
    { id: 'For Him', label: 'For Him' }
  ];

  const subcategoryList = getAvailableSubcategories(activeFilter);

  // Verify that activeSubcategory is part of the current subcategory list
  if (!subcategoryList.some(s => s.id === activeSubcategory)) {
    activeSubcategory = 'all';
  }

  const allCatalogProducts = state.products?.length ? state.products : PRODUCTS;

  // Step 1: Filter by Audience / Gender
  let audienceFiltered = allCatalogProducts;
  if (activeFilter === 'For Her') {
    audienceFiltered = allCatalogProducts.filter(p => {
      const a = (p.audience || '').toLowerCase();
      const c = (p.category || '').toLowerCase();
      return a === 'her' || a === 'women' || a === 'for her' || (!a && !c.includes('men'));
    });
  } else if (activeFilter === 'For Him') {
    audienceFiltered = allCatalogProducts.filter(p => {
      const a = (p.audience || '').toLowerCase();
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return a === 'him' || a === 'men' || a === 'for him' || c.includes('men') || n.includes("men's");
    });
  }

  // Step 2: Filter by Subcategory
  const filteredProducts = audienceFiltered.filter(p => matchProductSubcategory(p, activeSubcategory));

  return `
    <div class="satin-backdrop shop-page-backdrop" style="min-height: 100vh; padding: 85px 0 80px 0;">
      <div class="container shop-container">
        <!-- Header -->
        <div class="shop-header-box">
          <h1 class="shop-header-title">
            The Valeora Collection
          </h1>
          <p class="shop-header-subtitle">
            Everyday fashion jewelry with lasting shine, skin-safe comfort & honest pricing.
          </p>
          <div class="shop-header-badges">
            <span class="badge-pill badge-rose">All Items ₹249 – ₹999</span>
            <span class="badge-pill badge-ruby">Free Delivery > ₹999</span>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="shop-filters-container">
          <div class="shop-filter-pills-row" id="shop-category-pills">
            ${filterPills.map(pill => `
              <button class="shop-pill-btn ${activeFilter === pill.id ? 'active' : ''}" data-filter-id="${pill.id}">
                ${pill.label}
              </button>
            `).join('')}
          </div>

          <div class="shop-results-count">
            ${filteredProducts.length} Product${filteredProducts.length === 1 ? '' : 's'}
          </div>
        </div>

        <!-- Subcategories Bar (shown for all categories) -->
        ${subcategoryList.length > 0 ? `
          <div class="shop-subcategories-bar" id="shop-subcategories-bar">
            ${subcategoryList.map(sub => `
              <button class="shop-sub-pill-btn ${activeSubcategory === sub.id ? 'active' : ''}" data-subcategory-id="${sub.id}">
                ${sub.name}
              </button>
            `).join('')}
          </div>
        ` : ''}

        <!-- Product Cards Grid -->
        <div class="featured-arrivals-grid shop-products-grid" id="shop-products-grid">
          ${filteredProducts.length > 0
      ? filteredProducts.map(product => renderProductCard(product)).join('')
      : `
        <div class="shop-empty-catalog" style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(214,184,190,0.2); border-radius: 16px; margin: 10px 0 20px 0;">
          <div style="font-size: 2.2rem; margin-bottom: 10px;">✨</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: #FFFFFF; margin-bottom: 8px;">Collection Updating</h3>
          <p style="font-size: 0.88rem; color: #ECCFD0; max-width: 440px; margin: 0 auto; line-height: 1.5;">New handcrafted pieces are currently being added to the atelier. Check back shortly!</p>
        </div>
      `
    }
        </div>

        <!-- Assurance Banner -->
        <div class="shop-guarantee-strip">
          <div class="trust-pillar-card">
            <div class="trust-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <div class="trust-pillar-text">
              <h4 class="trust-pillar-title">Color Shine Guarantee</h4>
              <p class="trust-pillar-desc">Designed with high-polish coating that stays bright with daily wear.</p>
            </div>
          </div>
          <div class="trust-pillar-card">
            <div class="trust-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
            <div class="trust-pillar-text">
              <h4 class="trust-pillar-title">Honest Pricing</h4>
              <p class="trust-pillar-desc">Every piece priced between ₹249 to ₹999 with complete quality assurance.</p>
            </div>
          </div>
          <div class="trust-pillar-card">
            <div class="trust-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <div class="trust-pillar-text">
              <h4 class="trust-pillar-title">All India Delivery</h4>
              <p class="trust-pillar-desc">Free Delivery on orders above ₹999. Fast dispatch from Delhi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindShopPageEvents() {
  const pillsBox = document.getElementById('shop-category-pills');
  if (pillsBox) {
    pillsBox.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter-id]');
      if (!btn) return;
      const targetFilter = btn.getAttribute('data-filter-id');
      if (targetFilter !== activeFilter) {
        activeFilter = targetFilter;
        activeSubcategory = 'all'; // reset subcategory on category switch
        refreshShopView();
      }
    });
  }

  const subcategoryPillsBox = document.getElementById('shop-subcategories-bar');
  if (subcategoryPillsBox) {
    subcategoryPillsBox.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-subcategory-id]');
      if (!btn) return;
      activeSubcategory = btn.getAttribute('data-subcategory-id');
      refreshShopView();
    });
  }

  const gridEl = document.getElementById('shop-products-grid');
  if (gridEl) {
    bindProductCardEvents(gridEl, state.products || PRODUCTS);
  }
}

function refreshShopView() {
  const appContent = document.getElementById('app-main-content');
  if (appContent) {
    appContent.innerHTML = renderShopPage();
    bindShopPageEvents();
  }
}
