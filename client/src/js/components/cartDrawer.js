import { state } from '../state.js';
import { showToast } from './toast.js';

export function renderCartDrawer() {
  const isOpen = state.isCartOpen;
  const cart = state.cart;
  const subtotal = state.getCartSubtotal();
  const total = state.getCartTotal();
  const freeShippingThreshold = 75.00;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return `
    <div class="cart-overlay ${isOpen ? 'open' : ''}" id="cart-overlay-el">
      <div class="cart-drawer">
        <div class="cart-header">
          <h3 class="cart-title">Your Cart (${cart.reduce((sum, item) => sum + item.qty, 0)})</h3>
          <button class="modal-close-btn" id="cart-close-btn">&times;</button>
        </div>

        <!-- Free Shipping Tracker -->
        <div class="free-shipping-bar">
          <div style="font-size:0.85rem; font-weight:600; color:var(--color-forest-dark);">
            ${remainingForFreeShipping <= 0 
              ? '🎉 You unlocked FREE Express Shipping!' 
              : `Add $${remainingForFreeShipping.toFixed(2)} more to unlock Free Express Shipping`}
          </div>
          <div class="shipping-progress-track">
            <div class="shipping-progress-fill" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- Cart Items List -->
        <div class="cart-items">
          ${cart.length === 0 ? `
            <div style="text-align:center; padding:60px 20px; color:var(--color-text-muted);">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px auto; color:var(--color-gold);">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p style="font-size:1.1rem; font-weight:600; margin-bottom:8px;">Your cart is empty</p>
              <p style="font-size:0.88rem;">Explore our science-backed formulations and elevate your health journey.</p>
            </div>
          ` : cart.map(item => `
            <div class="cart-item">
              <img src="${item.image}" alt="${item.name}" class="cart-item-img">
              <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-purchase-type">${item.purchaseType === 'subscription' ? '⚡ Monthly Subscription (15% Off)' : 'One-Time Purchase'}</div>
                
                <div class="cart-item-qty-row">
                  <div class="qty-control">
                    <button class="qty-btn" data-action="dec" data-id="${item.id}" data-type="${item.purchaseType}">-</button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn" data-action="inc" data-id="${item.id}" data-type="${item.purchaseType}">+</button>
                  </div>
                  <div style="font-weight:700; font-size:0.95rem; color:var(--color-forest-dark);">
                    $${(item.unitPrice * item.qty).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        ${cart.length > 0 ? `
          <div class="cart-footer">
            <!-- Coupon Code Box -->
            <div class="coupon-box">
              <input type="text" id="coupon-input-el" placeholder="Promo code (AURITE10)" value="${state.couponCode || ''}" class="coupon-input">
              <button class="btn btn-secondary btn-sm" id="apply-coupon-btn">Apply</button>
            </div>

            <div class="cart-summary-row">
              <span>Subtotal</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>

            ${state.discountPercent > 0 ? `
              <div class="cart-summary-row" style="color:var(--color-success); font-weight:600;">
                <span>Discount (${state.discountPercent}%)</span>
                <span>-$${(subtotal * state.discountPercent / 100).toFixed(2)}</span>
              </div>
            ` : ''}

            <div class="cart-summary-row">
              <span>Estimated Shipping</span>
              <span>${remainingForFreeShipping <= 0 ? 'FREE' : '$8.00'}</span>
            </div>

            <div class="cart-summary-row total">
              <span>Total</span>
              <span>$${(total + (remainingForFreeShipping <= 0 ? 0 : 8.00)).toFixed(2)}</span>
            </div>

            <button class="btn btn-gold btn-lg" id="checkout-trigger-btn" style="width:100%; margin-top:16px;">
              Proceed To Checkout
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function bindCartEvents() {
  const overlay = document.getElementById('cart-overlay-el');
  const closeBtn = document.getElementById('cart-close-btn');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) state.toggleCart(false);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => state.toggleCart(false));
  }

  // Quantity adjustments
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      const type = btn.getAttribute('data-type');

      const item = state.cart.find(i => i.id === id && i.purchaseType === type);
      if (!item) return;

      const newQty = action === 'inc' ? item.qty + 1 : item.qty - 1;
      state.updateCartQty(id, type, newQty);
    });
  });

  // Apply Coupon
  const couponBtn = document.getElementById('apply-coupon-btn');
  const couponInput = document.getElementById('coupon-input-el');
  if (couponBtn && couponInput) {
    couponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim();
      if (!code) return;
      const res = state.applyCoupon(code);
      showToast(res.message, res.success ? 'success' : 'error');
    });
  }

  // Trigger Checkout
  const checkoutBtn = document.getElementById('checkout-trigger-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      state.toggleCart(false);
      state.toggleCheckoutModal(true);
    });
  }
}
