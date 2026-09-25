import { state } from '../state.js';
import { showToast } from './toast.js';

export function renderProductCard(product) {
  // Always guarantee a higher original cut price is shown for all products
  const originalPriceVal = (product.originalPrice && product.originalPrice > product.price)
    ? product.originalPrice
    : (product.price >= 500 ? Math.round((product.price * 1.6) / 50) * 50 - 1 : Math.round((product.price * 1.8) / 50) * 50 - 1);

  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price);
  const formattedOriginalPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(originalPriceVal);
  const discountPercent = Math.round(((originalPriceVal - product.price) / originalPriceVal) * 100);

  const isOutOfStock = product.stockQty !== undefined ? Number(product.stockQty) <= 0 : (product.stockCount !== undefined ? Number(product.stockCount) <= 0 : false);

  return `
    <div class="valeora-product-card ${isOutOfStock ? 'is-out-of-stock' : ''}" data-product-id="${product.id}" style="cursor: pointer;">
      <div class="product-thumb-wrap" data-action="quick-view" data-product-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${isOutOfStock 
          ? `<span class="product-feature-badge product-out-of-stock-badge" style="background: rgba(185, 28, 28, 0.95); color: #FFFFFF; font-weight: 700; border-color: rgba(255,255,255,0.4);">Out of Stock</span>`
          : (product.badge ? `<span class="product-feature-badge">${product.badge}</span>` : `<span class="product-discount-badge">${discountPercent}% OFF</span>`)
        }
      </div>

      <div class="product-card-body">
        <div class="product-card-meta-row">
          <span class="product-card-category">${product.subcategory || product.category}</span>
          <span class="product-card-rating">★ ${product.rating || '4.9'}</span>
        </div>
        <h4 class="product-card-title" data-action="quick-view" data-product-id="${product.id}" title="${product.name}">${product.name}</h4>
        
        <div class="product-card-bottom-row">
          <div class="product-card-price-wrap" style="display: flex; flex-direction: row; align-items: baseline; gap: 6px;">
            <span class="product-card-price">${formattedPrice}</span>
            <span class="product-card-original-price">${formattedOriginalPrice}</span>
          </div>
          ${isOutOfStock ? `
            <button class="btn-card-action btn-out-of-stock-action" disabled data-product-id="${product.id}" style="opacity: 0.6; cursor: not-allowed; background: rgba(255, 255, 255, 0.08); color: rgba(236, 207, 208, 0.6); border: 1px solid rgba(214, 184, 190, 0.2);" title="Currently Out of Stock">
              <span>Out of Stock</span>
            </button>
          ` : `
            <button class="btn-card-action btn-add-cart-action" data-action="add-cart" data-product-id="${product.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Add to Bag</span>
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

export function bindProductCardEvents(containerElement, products) {
  if (!containerElement) return;

  containerElement.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.valeora-product-card');
    if (!cardEl) return;

    const productId = cardEl.getAttribute('data-product-id');
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Direct Add to Cart Button Click
    const addCartBtn = e.target.closest('[data-action="add-cart"]');
    if (addCartBtn) {
      e.stopPropagation();
      const isOutOfStock = product.stockQty !== undefined ? Number(product.stockQty) <= 0 : (product.stockCount !== undefined ? Number(product.stockCount) <= 0 : false);
      if (isOutOfStock) {
        showToast(`${product.name} is currently out of stock`, 'error');
        return;
      }
      state.addToCart(product, 'bespoke', 1);
      showToast(`Added ${product.name} to your bag`, 'success');
      addCartBtn.classList.add('added');
      setTimeout(() => addCartBtn.classList.remove('added'), 1000);
      return;
    }

    // Clicking anywhere else on the product card opens Quick View
    state.setQuickViewProduct(product);
  });
}
