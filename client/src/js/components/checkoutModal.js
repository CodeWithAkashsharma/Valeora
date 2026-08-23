import { state } from '../state.js';
import { showToast } from './toast.js';

export function renderCheckoutModal() {
  if (!state.isCheckoutOpen) return '';

  const cart = state.cart;
  const subtotal = state.getCartSubtotal();
  const total = state.getCartTotal();

  return `
    <div class="modal-overlay open" id="checkout-modal-overlay">
      <div class="modal-card" style="max-width: 680px; padding: 36px;">
        <button class="modal-close-btn" id="checkout-close-btn">&times;</button>
        
        <div style="border-bottom: 1px solid var(--color-sand-border); padding-bottom: 16px; margin-bottom: 24px;">
          <h3 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--color-forest-dark);">Aurite Secure Checkout</h3>
          <p style="font-size:0.85rem; color:var(--color-text-muted);">256-Bit Encrypted Direct Checkout</p>
        </div>

        <form id="checkout-form">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input type="text" required class="form-input" value="${state.user ? state.user.name.split(' ')[0] : 'Alex'}">
            </div>

            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input type="text" required class="form-input" value="${state.user ? (state.user.name.split(' ')[1] || 'Mercer') : 'Mercer'}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" required class="form-input" value="${state.user ? state.user.email : 'alex@example.com'}">
          </div>

          <div class="form-group">
            <label class="form-label">Shipping Address</label>
            <input type="text" required class="form-input" placeholder="100 Fifth Avenue, Suite 400" value="742 Evergreen Terrace">
          </div>

          <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:16px;">
            <div class="form-group">
              <label class="form-label">City</label>
              <input type="text" required class="form-input" value="Springfield">
            </div>
            <div class="form-group">
              <label class="form-label">State</label>
              <input type="text" required class="form-input" value="OR">
            </div>
            <div class="form-group">
              <label class="form-label">Zip Code</label>
              <input type="text" required class="form-input" value="97477">
            </div>
          </div>

          <div style="background:var(--color-sand); border:1px solid var(--color-sand-border); border-radius:var(--radius-md); padding:16px; margin:20px 0;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--color-forest-dark); margin-bottom:12px;">Payment Details (Demo Secured)</div>
            <div class="form-group" style="margin-bottom:12px;">
              <input type="text" required class="form-input" value="4532 •••• •••• 8892" placeholder="Card Number">
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <input type="text" required class="form-input" value="12/28" placeholder="MM/YY">
              <input type="text" required class="form-input" value="884" placeholder="CVC">
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-sand-border); padding-top:16px; margin-top:20px;">
            <div>
              <div style="font-size:0.8rem; color:var(--color-text-muted);">Total Amount</div>
              <div style="font-size:1.5rem; font-weight:700; color:var(--color-forest-dark);">$${total.toFixed(2)}</div>
            </div>

            <button type="submit" class="btn btn-gold btn-lg">
              Complete Order & Pay
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function bindCheckoutEvents() {
  const overlay = document.getElementById('checkout-modal-overlay');
  const closeBtn = document.getElementById('checkout-close-btn');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) state.toggleCheckoutModal(false);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => state.toggleCheckoutModal(false));
  }

  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newOrder = state.placeOrder({ address: "742 Evergreen Terrace, Springfield OR" });
      showToast(`Order #${newOrder.id} Placed Successfully!`, 'success');
      state.setRoute('profile');
    });
  }
}
