import { PRODUCTS } from '../productsData.js';
import { renderProductCard, bindProductCardEvents } from '../components/productCard.js';

let activeCategory = 'All';

export function renderShopPage() {
  const categories = ['All', 'Vitality & Brain', 'Minerals & Sleep', 'Daily Greens & Gut'];

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return `
    <div class="container section-padding">
      <div style="text-align:center; max-width:640px; margin:0 auto 40px auto;">
        <span class="badge badge-gold" style="margin-bottom:12px;">Cellular Formulations</span>
        <h1 style="font-family:var(--font-serif); font-size:3rem; color:var(--color-forest-dark); margin-bottom:16px;">
          Shop Aurite Formulations
        </h1>
        <p style="color:var(--color-text-muted); font-size:1.05rem;">
          Pure, science-backed nutrients engineered with micro-encapsulation for peak cellular absorption.
        </p>
      </div>

      <!-- Shop Filter Bar -->
      <div class="shop-filter-bar">
        <div class="filter-pills" id="shop-category-pills">
          ${categories.map(cat => `
            <button class="filter-pill ${activeCategory === cat ? 'active' : ''}" data-cat="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>

        <div style="font-size:0.85rem; font-weight:600; color:var(--color-text-muted);">
          Showing ${filteredProducts.length} Formulations
        </div>
      </div>

      <!-- Product Cards Grid -->
      <div class="products-grid" id="shop-products-grid">
        ${filteredProducts.map(product => renderProductCard(product)).join('')}
      </div>
    </div>
  `;
}

export function bindShopPageEvents() {
  const pillsBox = document.getElementById('shop-category-pills');
  if (pillsBox) {
    pillsBox.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      activeCategory = btn.getAttribute('data-cat');
      
      // Re-render shop content
      const appContent = document.getElementById('app-main-content');
      if (appContent) {
        appContent.innerHTML = renderShopPage();
        bindShopPageEvents();
      }
    });
  }

  const gridEl = document.getElementById('shop-products-grid');
  if (gridEl) {
    bindProductCardEvents(gridEl, PRODUCTS);
  }
}
