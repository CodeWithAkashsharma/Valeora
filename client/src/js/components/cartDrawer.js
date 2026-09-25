import { state } from '../state.js';
import { showToast } from './toast.js';

export function renderCartDrawer() {
  const isOpen = state.isCartOpen;
  const cart = state.cart;
  const subtotal = state.getCartSubtotal();
  const discount = state.getCartDiscount();
  const shipping = state.getCartShipping();
  const total = state.getCartTotal();
  const threshold = state.freeDeliveryThreshold; // 999
  const remainingForFree = Math.max(0, threshold - subtotal);
  const appliedCoupon = state.appliedCoupon;
  const feedback = state.couponFeedback;
  const availableCoupons = (state.coupons || []).filter(c => c.active !== false);

  const formatMoney = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return `
    <div class="cart-drawer-backdrop ${isOpen ? 'open' : ''}" id="cart-overlay-el"></div>
    <div class="cart-drawer ${isOpen ? 'open' : ''}">
      <div class="cart-drawer-header">
        <h3>Your Cart (${cart.reduce((sum, item) => sum + item.qty, 0)})</h3>
        <button class="cart-close-btn" id="cart-close-btn" aria-label="Close Cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Free Delivery Progress / Banner across India -->
      <div class="cart-delivery-banner" style="background:rgba(85, 15, 38, 0.1); padding:13px 22px; border-bottom:1.5px solid rgba(85, 15, 38, 0.16); color:#24040E; font-size:0.94rem; font-weight:600;">
        ${subtotal >= threshold ? `
          <div style="display:flex; align-items:center; gap:8px;">
            <svg class="cart-delivery-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E6B37" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span style="color:#1C040D;">You have unlocked <strong style="color:#1E6B37;">FREE Delivery</strong> across India!</span>
          </div>
        ` : `
          <div>
            <span style="color:#24040E;">Add <strong style="color:#5A0E28;">${formatMoney(remainingForFree)}</strong> more to get <strong style="color:#5A0E28;">FREE Delivery</strong> (All India)</span>
            <div style="width:100%; height:5px; background:rgba(85,15,38,0.18); border-radius:3px; margin-top:8px; overflow:hidden;">
              <div style="width:${Math.min(100, Math.round((subtotal / threshold) * 100))}%; height:100%; background:linear-gradient(90deg, #6A122E, #360A16); border-radius:3px;"></div>
            </div>
          </div>
        `}
      </div>

      <!-- Cart Items List -->
      <div class="cart-drawer-body">
        <!-- Compact Coupon / Promo Section at the Top -->
        ${cart.length > 0 ? `
          <div class="cart-coupon-container" style="
            margin-bottom: 14px;
            padding: 10px 12px;
            background: rgba(85, 15, 38, 0.05);
            border: 1px dashed rgba(85, 15, 38, 0.25);
            border-radius: 12px;
          ">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #24040E; display: flex; align-items: center; gap: 5px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6A122E" stroke-width="2.2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                Apply Coupon / Promo Code
              </span>
              ${appliedCoupon ? `
                <span style="font-size: 0.68rem; font-weight: 700; color: #1E6B37; background: rgba(30, 107, 55, 0.12); padding: 1px 6px; border-radius: 99px;">
                  ${appliedCoupon.discountPercent}% OFF APPLIED
                </span>
              ` : ''}
            </div>

            ${appliedCoupon ? `
              <!-- Applied Coupon Active Pill -->
              <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #FFFFFF;
                border: 1.5px solid #1E6B37;
                padding: 6px 10px;
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(30, 107, 55, 0.08);
              ">
                <div>
                  <div style="font-weight: 800; font-size: 0.8rem; color: #1E6B37; letter-spacing: 0.03em;">
                    🏷️ ${appliedCoupon.code}
                  </div>
                  <div style="font-size: 0.7rem; color: #4A1222;">
                    Saving <strong style="color: #1E6B37;">${formatMoney(discount)}</strong> on this order
                  </div>
                </div>
                <button type="button" id="cart-remove-coupon-btn" style="
                  background: rgba(230, 57, 70, 0.1);
                  border: 1px solid rgba(230, 57, 70, 0.3);
                  color: #E63946;
                  padding: 3px 8px;
                  border-radius: 5px;
                  font-size: 0.72rem;
                  font-weight: 700;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">
                  ✕ Remove
                </button>
              </div>
            ` : `
              <!-- Coupon Input Form -->
              <div style="display: flex; gap: 6px;">
                <input
                  type="text"
                  id="cart-coupon-input"
                  placeholder="e.g. VALEORA10"
                  style="
                    flex: 1;
                    padding: 7px 10px;
                    border-radius: 7px;
                    border: 1px solid rgba(85, 15, 38, 0.25);
                    font-size: 0.82rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    background: #FFFFFF;
                    color: #24040E;
                    outline: none;
                  "
                />
                <button
                  type="button"
                  id="cart-apply-coupon-btn"
                  style="
                    padding: 7px 14px;
                    border-radius: 7px;
                    background: linear-gradient(135deg, #6A122E 0%, #360A16 100%);
                    color: #FFFFFF;
                    border: none;
                    font-size: 0.78rem;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    cursor: pointer;
                    transition: transform 0.15s ease;
                  "
                >
                  Apply
                </button>
              </div>
            `}

            <!-- Real-time Feedback & Minimum Order Shortfall Notice -->
            ${feedback && !appliedCoupon ? `
              <div style="
                margin-top: 6px;
                padding: 6px 10px;
                border-radius: 7px;
                font-size: 0.76rem;
                line-height: 1.35;
                display: flex;
                align-items: flex-start;
                gap: 6px;
                background: ${feedback.type === 'shortfall' ? 'rgba(217, 119, 6, 0.12)' : (feedback.type === 'success' ? 'rgba(30, 107, 55, 0.12)' : 'rgba(230, 57, 70, 0.12)')};
                border: 1px solid ${feedback.type === 'shortfall' ? 'rgba(217, 119, 6, 0.35)' : (feedback.type === 'success' ? 'rgba(30, 107, 55, 0.35)' : 'rgba(230, 57, 70, 0.35)')};
                color: ${feedback.type === 'shortfall' ? '#92400E' : (feedback.type === 'success' ? '#1E6B37' : '#991B1B')};
              ">
                <span style="font-size: 0.85rem; line-height: 1;">${feedback.type === 'shortfall' ? '⚠️' : (feedback.type === 'success' ? '✅' : '❌')}</span>
                <div style="flex: 1;">
                  ${feedback.message}
                  ${feedback.type === 'shortfall' ? `
                    <div style="margin-top: 2px; font-weight: 600;">
                      <a href="#shop" data-route="shop" id="cart-shortfall-shop-link" style="color: #6A122E; text-decoration: underline; cursor: pointer;">
                        + Add items to reach ₹${feedback.minAmount}
                      </a>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${cart.length === 0 ? `
          <div style="text-align:center; padding:60px 20px; color:#4A1222;">
            <div style="width:68px; height:68px; border-radius:50%; background:rgba(85,15,38,0.12); display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto; color:#5A0E28;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:#24040E; margin-bottom:8px; font-weight:700;">Your Cart is Empty</h4>
            <p style="font-size:0.9rem; line-height:1.5; color:#4A1222; margin-bottom: 20px;">Explore our everyday artificial jewelry starting from just ₹249.</p>
            <button class="btn btn-pill" id="cart-explore-btn" style="padding:12px 28px; background:linear-gradient(135deg, #5A0E28 0%, #2A0512 100%); color:#ffffff; border:none; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(90, 14, 40, 0.25); display:inline-flex; align-items:center; gap:8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Explore Jewelry</span>
            </button>
          </div>
        ` : cart.map(item => `
          <div class="cart-item-row">
            <div class="cart-item-img">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
              <div>
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-unit-price" style="font-size:0.78rem; color:#6A122E; margin-top:3px; font-weight:500;">${formatMoney(item.unitPrice)} each</div>
              </div>
              
              <div class="cart-item-action-row" style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <div class="cart-qty-ctrl">
                  <button class="cart-qty-btn qty-btn" data-action="dec" data-id="${item.id}" data-type="${item.purchaseType}">-</button>
                  <span class="cart-qty-val" style="font-size:0.9rem; font-weight:700; color:#24040E; padding:0 6px;">${item.qty}</span>
                  <button class="cart-qty-btn qty-btn" data-action="inc" data-id="${item.id}" data-type="${item.purchaseType}">+</button>
                </div>
                <div class="cart-item-price">${formatMoney(item.unitPrice * item.qty)}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      ${cart.length > 0 ? `
        <div class="cart-drawer-footer">
          <div class="cart-subtotal-row">
            <span class="cart-summary-label">Item Total</span>
            <span class="cart-subtotal-amount">${formatMoney(subtotal)}</span>
          </div>

          ${discount > 0 ? `
            <div class="cart-summary-row" style="color: #1E6B37; font-weight: 600;">
              <span class="cart-summary-label" style="color: #1E6B37;">
                Coupon Discount (${appliedCoupon?.code || 'Promo'})
              </span>
              <span class="cart-discount-amount" style="font-weight: 700; color: #1E6B37;">
                -${formatMoney(discount)}
              </span>
            </div>
          ` : ''}

          <div class="cart-summary-row">
            <span class="cart-summary-label">Delivery Fee (All India)</span>
            <span class="cart-delivery-status" style="font-weight:700; color:${shipping === 0 ? '#1E6B37' : '#24040E'};">
              ${shipping === 0 ? 'FREE' : '₹79'}
            </span>
          </div>

          <div class="cart-grand-total-row">
            <span class="cart-grand-total-title">Grand Total</span>
            <span class="cart-grand-total-amount">${formatMoney(total)}</span>
          </div>

          ${state.user ? `
            <button class="btn btn-pill btn-pill-lg cart-checkout-btn" id="checkout-trigger-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Proceed to Checkout · ${formatMoney(total)}</span>
            </button>
          ` : `
            <button class="btn btn-pill btn-pill-lg cart-checkout-btn" id="login-checkout-trigger-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Login First to Checkout · ${formatMoney(total)}</span>
            </button>
            <div class="cart-guest-note">
              Please log in or sign up to complete your checkout
            </div>
          `}
        </div>
      ` : ''}
    </div>
  `;
}

export function bindCartEvents() {
  const backdrop = document.getElementById('cart-overlay-el');
  const closeBtn = document.getElementById('cart-close-btn');

  if (backdrop) {
    backdrop.addEventListener('click', () => state.toggleCart(false));
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => state.toggleCart(false));
  }

  // Explore button in empty cart
  const exploreBtn = document.getElementById('cart-explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      state.toggleCart(false);
      state.setRoute('shop');
    });
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

  // Apply Coupon button
  const applyBtn = document.getElementById('cart-apply-coupon-btn');
  const couponInput = document.getElementById('cart-coupon-input');
  if (applyBtn && couponInput) {
    const handleApply = () => {
      const code = couponInput.value.trim();
      const res = state.applyCoupon(code);
      if (res.success) {
        showToast(res.message, 'success');
      } else if (res.isShortfall) {
        showToast(res.message, 'warning');
      } else {
        showToast(res.message, 'error');
      }
    };

    applyBtn.addEventListener('click', handleApply);
    couponInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleApply();
      }
    });
  }

  // Coupon pill suggestions
  document.querySelectorAll('.cart-coupon-pill-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      const code = pill.getAttribute('data-coupon-code');
      if (code) {
        const res = state.applyCoupon(code);
        if (res.success) {
          showToast(res.message, 'success');
        } else if (res.isShortfall) {
          showToast(res.message, 'warning');
        } else {
          showToast(res.message, 'error');
        }
      }
    });
  });

  // Remove Coupon button
  const removeBtn = document.getElementById('cart-remove-coupon-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      state.removeCoupon();
      showToast('Coupon removed.', 'info');
    });
  }

  // Shortfall shop more link
  const shortfallLink = document.getElementById('cart-shortfall-shop-link');
  if (shortfallLink) {
    shortfallLink.addEventListener('click', () => {
      state.toggleCart(false);
      state.setRoute('shop');
    });
  }

  // Trigger Checkout (Logged in)
  const checkoutBtn = document.getElementById('checkout-trigger-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      state.toggleCart(false);
      state.toggleCheckoutModal(true);
    });
  }

  // Trigger Login First (Guest)
  const loginCheckoutBtn = document.getElementById('login-checkout-trigger-btn');
  if (loginCheckoutBtn) {
    loginCheckoutBtn.addEventListener('click', () => {
      state.toggleCart(false);
      state.toggleAuthModal(true);
      showToast('Please log in or register to proceed to checkout.', 'info');
    });
  }
}
