import { state } from '../state.js';
import { showToast } from './toast.js';

export function renderProductCard(product) {
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <span class="badge badge-gold product-badge-overlay">${product.badge}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="product-quick-view-btn" data-action="quick-view" data-product-id="${product.id}">
          Quick View
        </button>
      </div>

      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.name}</h3>
        
        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <span>${product.rating} (${product.reviewsCount} reviews)</span>
        </div>

        <p class="product-benefit-tag">${product.tagline}</p>

        <!-- Purchase Type Toggle -->
        <div class="purchase-options" id="options-${product.id}">
          <button class="option-btn active" data-type="one-time">One-Time</button>
          <button class="option-btn" data-type="subscription">Subscribe (15% Off)</button>
        </div>

        <div class="product-price-row">
          <div>
            <div class="product-price" id="price-display-${product.id}">$${product.price.toFixed(2)}</div>
            <div class="product-price-sub" id="sub-display-${product.id}">${product.servings}</div>
          </div>

          <button class="btn btn-primary btn-sm" data-action="add-cart" data-product-id="${product.id}">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindProductCardEvents(containerElement, products) {
  if (!containerElement) return;

  containerElement.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.product-card');
    if (!cardEl) return;

    const productId = cardEl.getAttribute('data-product-id');
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Handle Option Toggle
    const optionBtn = e.target.closest('.option-btn');
    if (optionBtn) {
      const optionsBox = cardEl.querySelector('.purchase-options');
      optionsBox.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
      optionBtn.classList.add('active');

      const type = optionBtn.getAttribute('data-type');
      const priceEl = cardEl.querySelector(`#price-display-${product.id}`);
      if (priceEl) {
        priceEl.textContent = type === 'subscription' ? `$${product.subscribePrice.toFixed(2)}` : `$${product.price.toFixed(2)}`;
      }
      return;
    }

    // Handle Quick View
    if (e.target.closest('[data-action="quick-view"]')) {
      state.setQuickViewProduct(product);
      return;
    }

    // Handle Add to Cart
    if (e.target.closest('[data-action="add-cart"]')) {
      const activeOption = cardEl.querySelector('.option-btn.active');
      const purchaseType = activeOption ? activeOption.getAttribute('data-type') : 'one-time';
      
      state.addToCart(product, purchaseType, 1);
      showToast(`Added ${product.name} to cart!`, 'success');
    }
  });
}
