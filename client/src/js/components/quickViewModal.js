import { state } from '../state.js';
import { showToast } from './toast.js';

export function renderQuickViewModal() {
  const product = state.quickViewProduct;
  if (!product) return '';

  return `
    <div class="modal-overlay open" id="quickview-modal-overlay">
      <div class="modal-card" style="max-width: 840px;">
        <button class="modal-close-btn" id="quickview-close-btn">&times;</button>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 36px;">
          <!-- Left Image Gallery -->
          <div>
            <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius:var(--radius-md); background:var(--color-sand); border:1px solid var(--color-sand-border);">
            <div style="margin-top:16px; font-size:0.8rem; color:var(--color-text-muted); text-align:center;">
              🛡️ 30-Day Money Back Guarantee • Third-Party Lab Certified
            </div>
          </div>

          <!-- Right Details & Supplement Facts -->
          <div>
            <span class="badge badge-gold" style="margin-bottom:12px;">${product.badge}</span>
            <h2 style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:6px;">${product.name}</h2>
            <p style="color:var(--color-gold); font-weight:600; font-size:0.9rem; margin-bottom:12px;">${product.tagline}</p>
            
            <p style="font-size:0.92rem; color:var(--color-text-muted); line-height:1.6; margin-bottom:20px;">
              ${product.description}
            </p>

            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; margin-bottom:24px; font-size:0.85rem; color:var(--color-forest-dark);">
              ${product.highlights.map(h => `
                <li style="display:flex; align-items:center; gap:8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--color-gold);">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${h}</span>
                </li>
              `).join('')}
            </ul>

            <!-- Supplement Facts Mockup Label -->
            <div class="supplement-facts-box">
              <div class="supplement-facts-title">Supplement Facts</div>
              <div class="supplement-facts-sub">Serving Size: ${product.supplementFacts.servingSize} | Servings: ${product.supplementFacts.servingsPerContainer}</div>
              <div class="supplement-facts-header">
                <span>Amount Per Serving</span>
                <span>% Daily Value</span>
              </div>
              ${product.supplementFacts.ingredients.map(ing => `
                <div class="supplement-facts-row">
                  <span>${ing.name} ${ing.amount}</span>
                  <span>${ing.dv}</span>
                </div>
              `).join('')}
            </div>

            <!-- Add to Cart Controls -->
            <div style="display:flex; gap:16px; margin-top:24px; align-items:center;">
              <div>
                <div style="font-size:1.4rem; font-weight:700; color:var(--color-forest-dark);">$${product.price.toFixed(2)}</div>
                <div style="font-size:0.75rem; color:var(--color-text-muted);">${product.servings}</div>
              </div>
              <button class="btn btn-gold btn-lg" id="qv-add-cart-btn" style="flex-grow:1;">
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindQuickViewEvents() {
  const overlay = document.getElementById('quickview-modal-overlay');
  const closeBtn = document.getElementById('quickview-close-btn');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) state.setQuickViewProduct(null);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => state.setQuickViewProduct(null));
  }

  const addBtn = document.getElementById('qv-add-cart-btn');
  if (addBtn && state.quickViewProduct) {
    addBtn.addEventListener('click', () => {
      state.addToCart(state.quickViewProduct, 'one-time', 1);
      showToast(`Added ${state.quickViewProduct.name} to cart!`, 'success');
      state.setQuickViewProduct(null);
    });
  }
}
