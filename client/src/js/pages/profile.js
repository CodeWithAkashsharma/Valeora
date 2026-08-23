import { state } from '../state.js';
import { showToast } from '../components/toast.js';

let activeTab = 'orders';

export function renderProfilePage() {
  const user = state.user || {
    name: "Alex Mercer",
    email: "alex.mercer@example.com",
    membership: "Aurite Gold Member",
    memberSince: "2026",
    points: 480
  };

  const orders = state.orders;
  const subscriptions = state.subscriptions;

  return `
    <div class="container section-padding">
      <div class="profile-grid">
        <!-- Sidebar -->
        <div class="profile-sidebar">
          <div class="user-card-header">
            <div class="user-avatar">${user.name.charAt(0)}</div>
            <h3 style="font-family:var(--font-serif); font-size:1.3rem; margin-bottom:4px;">${user.name}</h3>
            <span class="badge badge-gold">${user.membership}</span>
            <div style="font-size:0.78rem; color:var(--color-text-light); margin-top:8px;">Member Since ${user.memberSince} • ${user.points} Rewards Points</div>
          </div>

          <nav class="profile-nav">
            <button class="profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              </svg>
              <span>Order History (${orders.length})</span>
            </button>

            <button class="profile-nav-btn ${activeTab === 'subs' ? 'active' : ''}" data-tab="subs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
              </svg>
              <span>Subscriptions (${subscriptions.length})</span>
            </button>

            <button class="profile-nav-btn ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span>Account Settings</span>
            </button>

            <button class="profile-nav-btn" id="logout-btn-el" style="color:var(--color-error); margin-top:20px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        <!-- Main Content Area -->
        <div class="profile-content-card">
          ${activeTab === 'orders' ? renderOrdersTab(orders) : ''}
          ${activeTab === 'subs' ? renderSubscriptionsTab(subscriptions) : ''}
          ${activeTab === 'settings' ? renderSettingsTab(user) : ''}
        </div>
      </div>
    </div>
  `;
}

function renderOrdersTab(orders) {
  if (orders.length === 0) {
    return `<p style="color:var(--color-text-muted);">No orders placed yet.</p>`;
  }

  return `
    <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:24px; color:var(--color-forest-dark);">Order History</h3>
    ${orders.map(ord => `
      <div class="order-history-card">
        <div class="order-history-header">
          <div>
            <div style="font-weight:700; color:var(--color-forest-dark);">Order #${ord.id}</div>
            <div style="font-size:0.8rem; color:var(--color-text-muted);">Placed on ${ord.date}</div>
          </div>
          <div style="text-align:right;">
            <span class="badge ${ord.status === 'Delivered' ? 'badge-gold' : 'badge-purity'}">${ord.status}</span>
            <div style="font-size:0.75rem; color:var(--color-text-light); margin-top:4px;">${ord.tracking}</div>
          </div>
        </div>

        <div style="margin-bottom:16px;">
          ${ord.items.map(i => `
            <div style="display:flex; justify-content:space-between; font-size:0.9rem; padding:4px 0;">
              <span>${i.name} (x${i.qty || 1})</span>
              <span style="font-weight:600;">$${((i.unitPrice || i.price) * (i.qty || 1)).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-sand-border); padding-top:12px;">
          <div style="font-size:1.1rem; font-weight:700; color:var(--color-forest-dark);">Total: $${ord.total.toFixed(2)}</div>
          <button class="btn btn-secondary btn-sm" data-action="reorder" data-id="${ord.id}">Re-Order Items</button>
        </div>
      </div>
    `).join('')}
  `;
}

function renderSubscriptionsTab(subscriptions) {
  return `
    <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:24px; color:var(--color-forest-dark);">Active Subscriptions</h3>
    ${subscriptions.map(sub => `
      <div class="order-history-card">
        <div class="order-history-header">
          <div>
            <div style="font-weight:700; color:var(--color-forest-dark);">${sub.product}</div>
            <div style="font-size:0.8rem; color:var(--color-gold); font-weight:600;">Frequency: ${sub.frequency} (Save 15%)</div>
          </div>
          <span class="badge badge-gold">${sub.status}</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
          <div>
            <div style="font-size:0.8rem; color:var(--color-text-muted);">Next Delivery</div>
            <div style="font-weight:600;">${sub.nextShipDate} • $${sub.price.toFixed(2)}</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline btn-sm" data-action="pause-sub">Skip Shipment</button>
            <button class="btn btn-secondary btn-sm" data-action="manage-sub">Manage</button>
          </div>
        </div>
      </div>
    `).join('')}
  `;
}

function renderSettingsTab(user) {
  return `
    <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:24px; color:var(--color-forest-dark);">Account Settings</h3>
    <form id="profile-settings-form">
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" class="form-input" value="${user.name}">
      </div>

      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input type="email" class="form-input" value="${user.email}">
      </div>

      <div class="form-group">
        <label class="form-label">Default Shipping Address</label>
        <input type="text" class="form-input" value="742 Evergreen Terrace, Springfield OR 97477">
      </div>

      <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
  `;
}

export function bindProfilePageEvents() {
  document.querySelectorAll('.profile-nav-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-tab');
      const appContent = document.getElementById('app-main-content');
      if (appContent) {
        appContent.innerHTML = renderProfilePage();
        bindProfilePageEvents();
      }
    });
  });

  const logoutBtn = document.getElementById('logout-btn-el');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.logout();
      showToast('Signed out of your account.', 'info');
      state.setRoute('home');
    });
  }

  // Handle reorder
  document.querySelectorAll('[data-action="reorder"]').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Re-order items added to your cart!', 'success');
      state.toggleCart(true);
    });
  });

  // Handle pause sub
  document.querySelectorAll('[data-action="pause-sub"]').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Next shipment skipped. You will be notified before the following cycle.', 'info');
    });
  });
}
