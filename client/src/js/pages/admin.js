import { state } from '../state.js';
import { PRODUCTS } from '../productsData.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal } from '../components/confirmModal.js';
import { formatDateDDMMYYYY } from './profile.js';
import {
  fetchUsersFromDb,
  subscribeToUsers,
  createReturnInDb,
  subscribeToReturns,
  updateReturnInDb
} from '../services/firebase.js';

import { optimizeImageFile } from '../services/imageOptimizer.js';

let activeAdminSection = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('valeora_active_admin_section') : null) || 'dashboard'; // 'dashboard' | 'orders' | 'queries' | 'returns' | 'products' | 'users' | 'coupons'
let isAddProductModalOpen = false;
let isInitiateClaimModalOpen = false;
let isCouponModalOpen = false;
let editingCouponId = null;
let couponModalData = {
  id: '',
  code: '',
  discountPercent: 15,
  minAmount: 499,
  description: '',
  isActive: true
};
let claimModalData = {
  type: 'Return', // 'Return' | 'Exchange' | 'Refund'
  queryId: null,
  orderId: '',
  customerName: '',
  email: '',
  phone: '',
  productId: '',
  productName: '',
  amount: 0,
  reason: '',
  details: '',
  draftResponse: ''
};
let activeOrderFilter = 'all'; // 'all' | 'in-progress' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled'
let activeReturnFilter = 'all'; // 'all' | 'Return' | 'Exchange' | 'Refund'
let editingProductId = null;
let selectedQueryId = null;
let openAdminEditModal = null;

let liveReturnsCache = [];
let hasSubscribedReturns = false;
let liveDbUsers = [];
let hasSubscribedUsers = false;
let isDbUsersFetched = false;

export function renderAdminProductCards(products = []) {
  if (!products || products.length === 0) {
    return `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: rgba(255,255,255,0.02); border: 1.5px dashed rgba(214,184,190,0.25); border-radius: 18px; color: #ECCFD0;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.6;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <h4 style="color: #FFFFFF; margin: 0 0 8px 0; font-size: 1.05rem;">No products in catalog</h4>
        <p style="margin: 0; font-size: 0.85rem; color: rgba(214,184,190,0.7);">Click "Add New Product" above to publish your first jewelry piece to the website.</p>
      </div>
    `;
  }

  return products.map(p => {
    const stock = p.stockQty !== undefined ? Number(p.stockQty) : 25;
    const isLowStock = stock > 0 && stock <= 3;
    const isOutOfStock = stock === 0;
    const stockBadgeClass = isOutOfStock ? 'admin-badge-danger' : (isLowStock ? 'admin-badge-warning' : 'admin-badge-success');
    const stockText = isOutOfStock ? 'Out of Stock' : (isLowStock ? `${stock} left (Low)` : `${stock} in stock`);

    const sellingPrice = Number(p.price) || 0;
    const originalPrice = Number(p.originalPrice) || (sellingPrice * 2);
    const costPrice = Number(p.costPrice) || Math.round(sellingPrice * 0.35);
    const unitProfit = Math.max(0, sellingPrice - costPrice);
    const profitMargin = sellingPrice > 0 ? ((unitProfit / sellingPrice) * 100).toFixed(0) : '65';

    return `
      <div class="admin-product-card" data-card-id="${p.id}" style="background: linear-gradient(155deg, rgba(38, 9, 21, 0.95) 0%, rgba(18, 2, 9, 0.98) 100%); border: 1.5px solid rgba(214, 184, 190, 0.22); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); transition: all 0.2s ease;">
        <div>
          <!-- Top Row: Thumbnail + Product Name & Category / Stock Badges -->
          <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 12px;">
            <img src="${p.image || '/images/imperial_necklace.jpg'}" alt="${p.name}" style="width: 72px; height: 72px; border-radius: 12px; object-fit: cover; border: 1.5px solid rgba(214, 184, 190, 0.25); flex-shrink: 0;" onerror="this.src='/images/imperial_necklace.jpg'" />
            <div style="min-width: 0; flex: 1;">
              <h5 style="color: #FFFFFF; font-size: 0.94rem; font-weight: 700; margin: 0 0 6px 0; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                ${p.name}
              </h5>
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(214, 184, 190, 0.2); border-radius: 6px; color: #ECCFD0; font-size: 0.72rem; font-weight: 600; padding: 2px 8px;">
                  ${p.category || 'Jewellery'}
                </span>
                ${p.subcategory ? `
                  <span style="background: rgba(138, 21, 56, 0.35); border: 1px solid rgba(230, 57, 70, 0.4); border-radius: 6px; color: #FFA8B5; font-size: 0.72rem; font-weight: 700; padding: 2px 8px;">
                    ${p.subcategory}
                  </span>
                ` : ''}
                <span class="admin-badge ${stockBadgeClass}" style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px;">
                  ${stockText}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Stock Inline Update -->
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); border: 1px solid rgba(214,184,190,0.16); padding: 8px 12px; border-radius: 10px;">
            <span style="font-size: 0.76rem; color: #ECCFD0; font-weight: 600;">Stock Inventory:</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="number" min="0" value="${stock}" class="admin-quick-stock-input" data-product-id="${p.id}" style="width: 64px; background: rgba(255,255,255,0.08); border: 1px solid rgba(214,184,190,0.3); border-radius: 6px; color: #4EEDA0; font-weight: 700; font-size: 0.82rem; padding: 4px 6px; text-align: center;" />
              <button class="admin-btn admin-btn-outline quick-stock-save-btn" data-product-id="${p.id}" style="padding: 4px 10px; font-size: 0.74rem; border-color: #4EEDA0; color: #4EEDA0;" title="Save stock quantity">
                Save
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Price & Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(214,184,190,0.14); padding-top: 12px;">
          <div>
            <span style="font-size: 1.15rem; font-weight: 800; font-family: var(--font-brand, serif); color: #FFFFFF;">₹${sellingPrice.toLocaleString('en-IN')}</span>
          </div>

          <div style="display: flex; gap: 6px;">
            <button class="admin-btn admin-btn-outline edit-product-btn" data-product-id="${p.id}" style="padding: 6px 12px; font-size: 0.76rem; border-color: rgba(214,184,190,0.35); color: #FFFFFF;" title="Edit product details">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit
            </button>
            <button class="admin-btn admin-btn-danger delete-product-btn" data-product-id="${p.id}" style="padding: 6px 10px; font-size: 0.76rem;" title="Remove from website catalog">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function bindAdminProductCardEvents() {
  const editProductBtns = document.querySelectorAll('.edit-product-btn');
  editProductBtns.forEach(btn => {
    btn.onclick = () => {
      const pid = btn.getAttribute('data-product-id');
      if (pid && typeof openAdminEditModal === 'function') openAdminEditModal(pid);
    };
  });

  const quickStockBtns = document.querySelectorAll('.quick-stock-save-btn');
  quickStockBtns.forEach(btn => {
    btn.onclick = async () => {
      const pid = btn.getAttribute('data-product-id');
      const input = document.querySelector(`.admin-quick-stock-input[data-product-id="${pid}"]`);
      if (pid && input) {
        const newStock = Math.max(0, parseInt(input.value, 10) || 0);
        await state.updateProductStock(pid, newStock);
        showToast(`Stock updated to ${newStock} units for product #${pid}!`, 'success');
      }
    };
  });

  const deleteProductBtns = document.querySelectorAll('.delete-product-btn');
  deleteProductBtns.forEach(btn => {
    btn.onclick = async (e) => {
      if (e) e.stopPropagation();
      const pid = btn.getAttribute('data-product-id');
      if (!pid) return;

      const product = (state.products || PRODUCTS || []).find(p => String(p.id) === String(pid));
      const productName = product ? product.name : `#${pid}`;

      const confirmed = await showConfirmModal({
        title: 'Remove Product',
        message: `Are you sure you want to remove "${productName}" from the website catalog? This will delete it across the store.`,
        confirmText: 'Remove Product',
        cancelText: 'Cancel',
        danger: true
      });
      if (confirmed) {
        await state.deleteProduct(pid);
        showToast('Product removed from catalog across all admin sessions.', 'info');
        refreshAdminView(true);
      }
    };
  });
}

export function updateAdminProductsCatalogGrid() {
  const products = state.products || PRODUCTS || [];
  const grid = document.getElementById('admin-products-grid-container');
  if (grid) {
    grid.innerHTML = renderAdminProductCards(products);
    bindAdminProductCardEvents();
  }
  const headerCount = document.getElementById('admin-products-count-header');
  if (headerCount) {
    headerCount.textContent = products.length;
  }
  const navBadge = document.querySelector('.admin-nav-item[data-nav-target="products"] .admin-nav-badge');
  if (navBadge) {
    navBadge.textContent = products.length;
  }
}

export function refreshAdminView(keepScroll = true) {
  if (state.currentRoute === 'admin' && state.user && state.isAdmin) {
    const root = document.getElementById('app-root');
    if (root) {
      // Guard: only re-render if the root currently holds the admin standalone layout.
      // This prevents Firestore callbacks from wiping the regular site layout
      // (navbar + footer) if they fire during a route transition.
      const adminRoot = root.querySelector('.valeora-admin-standalone-root');
      if (!adminRoot) return;

      const modalContainer = document.getElementById('admin-add-product-modal-container');
      const isProductModalOpen = isAddProductModalOpen || (modalContainer && modalContainer.style.display !== 'none');
      const couponModalContainer = document.getElementById('admin-coupon-modal-container');
      const isCouponModalActivelyOpen = isCouponModalOpen || (couponModalContainer && couponModalContainer.style.display !== 'none');
      const claimModalContainer = document.getElementById('admin-claim-modal-container');
      const isClaimModalActivelyOpen = isInitiateClaimModalOpen || (claimModalContainer && claimModalContainer.style.display !== 'none');

      const isAnyModalOpen = isProductModalOpen || isCouponModalActivelyOpen || isClaimModalActivelyOpen;
      const isUserTyping = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');

      const productsGrid = document.getElementById('admin-products-grid-container');

      // If viewing products and a modal is open or user is typing, surgically update only the background catalog grid
      if (activeAdminSection === 'products' && productsGrid && (isAnyModalOpen || isUserTyping)) {
        updateAdminProductsCatalogGrid();
        return;
      }

      // If an admin is actively interacting with another form/modal, defer full re-render so work is not lost
      if (isAnyModalOpen || isUserTyping) {
        return;
      }

      const scrollY = keepScroll ? (window.scrollY || window.pageYOffset || 0) : 0;
      root.innerHTML = renderAdminPage();
      bindAdminPageEvents();
      if (keepScroll && scrollY > 0) {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }
    }
  }
}


function initReturnsSubscription() {
  if (hasSubscribedReturns) return;
  hasSubscribedReturns = true;
  subscribeToReturns((claims) => {
    if (Array.isArray(claims)) {
      liveReturnsCache = claims;
      const raw = localStorage.getItem('valeora_returns');
      let localClaims = [];
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            localClaims = parsed.filter(r => r.id !== 'RET-101' && r.orderId !== 'VAL-9481-2026');
          }
        } catch (e) { }
      }
      claims.forEach(cl => {
        if (!localClaims.some(lc => lc.id === cl.id)) {
          localClaims.unshift(cl);
        }
      });
      localStorage.setItem('valeora_returns', JSON.stringify(localClaims));
      if (activeAdminSection === 'returns' || activeAdminSection === 'dashboard') {
        refreshAdminView(true);
      }
    }
  });
}

function initUsersSubscription() {
  if (hasSubscribedUsers) return;
  hasSubscribedUsers = true;
  subscribeToUsers((users) => {
    if (Array.isArray(users)) {
      liveDbUsers = users;
      isDbUsersFetched = true;
      if (activeAdminSection === 'users' || activeAdminSection === 'dashboard') {
        refreshAdminView(true);
      }
    }
  });
}

function getAdminReturns() {
  initReturnsSubscription();
  const raw = localStorage.getItem('valeora_returns');
  let returns = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        returns = parsed.filter(r => r.id !== 'RET-101' && r.orderId !== 'VAL-9481-2026');
      }
    } catch (e) { }
  }
  if (liveReturnsCache && liveReturnsCache.length > 0) {
    liveReturnsCache.forEach(lr => {
      if (!returns.some(r => r.id === lr.id)) {
        returns.unshift(lr);
      }
    });
  }
  localStorage.setItem('valeora_returns', JSON.stringify(returns));
  return returns;
}

async function syncDbUsers() {
  if (isDbUsersFetched) return;
  try {
    const dbUsers = await fetchUsersFromDb();
    if (Array.isArray(dbUsers)) {
      liveDbUsers = dbUsers;
      isDbUsersFetched = true;
      if (activeAdminSection === 'users' || activeAdminSection === 'dashboard') {
        refreshAdminView(true);
      }
    }
  } catch (err) {
    console.warn('Error syncing db users in admin:', err);
  }
}

function getAdminUsers() {
  initUsersSubscription();
  syncDbUsers();
  
  let users = [];

  // Use only Firestore live registered users (from database)
  liveDbUsers.forEach(dbu => {
    const dEmail = (dbu.email || '').toLowerCase();
    if (dEmail && !users.some(u => (u.email || '').toLowerCase() === dEmail)) {
      users.push({
        id: dbu.id || `USR-${(dbu.uid || '').slice(0, 5).toUpperCase()}`,
        name: dbu.name || dbu.displayName || (dEmail ? dEmail.split('@')[0] : 'Patron'),
        email: dbu.email || '',
        phone: dbu.phone || '',
        city: dbu.city || 'Delhi',
        pincode: dbu.pincode || '',
        membership: dbu.membership || 'Valeora Atelier Patron',
        memberSince: dbu.memberSince || '2026',
        status: dbu.status || 'active'
      });
    }
  });

  return users;
}

export function setAdminSection(sec) {
  activeAdminSection = sec || 'dashboard';
}

function getStatusClass(status) {
  const s = (status || '').toLowerCase().trim().replace(/\s+/g, '-');
  return `status-${s}`;
}

function isClaimRelatedQuery(query) {
  if (!query) return false;
  const combinedText = `${query.category || ''} ${query.subject || ''} ${query.message || ''}`.toLowerCase();
  const keywords = [
    'return',
    'refund',
    'exchange',
    'replace',
    'replacement',
    'damage',
    'damaged',
    'defective',
    'defect',
    'broken',
    'sizing',
    'fitment',
    'size',
    'cancel',
    'cancellation',
    'clasp',
    'wrong item',
    'incorrect',
    'broken piece',
    'claim'
  ];
  return keywords.some(kw => combinedText.includes(kw));
}

export function renderAdminPage() {
  const orders = state.orders || [];
  const queries = state.queries || [];
  const products = state.products || PRODUCTS || [];
  const returns = getAdminReturns();
  const registeredUsers = getAdminUsers();

  // Financial & Margin Analysis Calculations
  let totalRevenue = 0;
  let totalCost = 0;
  let totalUnitsSold = 0;

  // Track product-level sales
  const productSalesMap = {};
  products.forEach(p => {
    productSalesMap[p.id] = { qtySold: 0, revenue: 0 };
  });

  orders.forEach(ord => {
    totalRevenue += Number(ord.total) || 0;
    (ord.items || []).forEach(item => {
      const matchedP = products.find(p => p.id === item.id) || products.find(p => p.name === item.name) || { costPrice: (item.unitPrice || item.price || 0) * 0.35 };
      const itemCost = Number(matchedP.costPrice || (item.unitPrice || item.price || 0) * 0.35);
      const qty = Number(item.qty || 1);
      totalCost += itemCost * qty;
      totalUnitsSold += qty;

      if (productSalesMap[item.id]) {
        productSalesMap[item.id].qtySold += qty;
        productSalesMap[item.id].revenue += (Number(item.unitPrice || item.price || 0) * qty);
      }
    });
  });

  // Base metrics
  if (totalCost === 0 && totalRevenue > 0) {
    totalCost = Math.round(totalRevenue * 0.32);
  }
  const totalProfit = Math.max(0, totalRevenue - totalCost);
  const profitMarginPercent = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Dynamic 6-Month Real Trends (Calculated directly from live database orders)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const curDate = new Date();
  const monthlyBuckets = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(curDate.getFullYear(), curDate.getMonth() - i, 1);
    const mIdx = d.getMonth();
    const yVal = d.getFullYear();
    const label = monthNames[mIdx];
    const fullLabel = `${d.toLocaleString('default', { month: 'long' })} ${yVal}`;

    // Filter orders belonging to this month & year
    const mOrders = orders.filter(o => {
      if (o.createdAt) {
        const od = new Date(o.createdAt);
        return od.getMonth() === mIdx && od.getFullYear() === yVal;
      }
      if (o.date) {
        const parts = o.date.split('/');
        if (parts.length === 3) {
          return Number(parts[1]) - 1 === mIdx && Number(parts[2]) === yVal;
        }
      }
      return false;
    });

    const mRev = mOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const mCost = mOrders.reduce((sum, o) => sum + Math.round((Number(o.total) || 0) * 0.35), 0);
    const mProfit = Math.max(0, mRev - mCost);
    const mMargin = mRev > 0 ? ((mProfit / mRev) * 100).toFixed(1) : '0.0';

    monthlyBuckets.push({
      label,
      fullLabel,
      revenue: mRev,
      profit: mProfit,
      margin: mMargin,
      isCurrent: i === 0
    });
  }

  // If current month has totalRevenue from all orders (even if date parsing didn't match), assign totalRevenue
  const currentBucket = monthlyBuckets[monthlyBuckets.length - 1];
  if (totalRevenue > 0 && currentBucket.revenue === 0) {
    currentBucket.revenue = totalRevenue;
    currentBucket.profit = totalProfit;
    currentBucket.margin = profitMarginPercent;
  }

  const maxMonthRev = Math.max(...monthlyBuckets.map(b => b.revenue), 1000);
  const chartHeight = 130;
  const chartPoints = monthlyBuckets.map((b, idx) => {
    const x = 75 + idx * 90;
    const y = 170 - (b.revenue > 0 ? Math.max(4, Math.round((b.revenue / maxMonthRev) * chartHeight)) : 0);
    return `${x},${y}`;
  });
  const trendPolyline = chartPoints.join(' ');
  const trendAreaPoints = `75,170 ${trendPolyline} 525,170`;
  const lastPoint = chartPoints[chartPoints.length - 1].split(',');

  // Total Inventory Valuation (Stock Quantity * Cost Price)
  const totalInventoryAssetValue = products.reduce((sum, p) => sum + ((Number(p.stockQty) || 25) * (Number(p.costPrice) || Math.round(p.price * 0.35))), 0);

  // Critical Low Stock Items (stock < 3)
  const criticalStockProducts = products.filter(p => (Number(p.stockQty) !== undefined ? Number(p.stockQty) : 25) < 3);

  // 24-Hour Orders Feed (Orders placed today or within past 24h window)
  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const yesterdayTime = now.getTime() - (24 * 60 * 60 * 1000);
  const recent24hOrders = orders.filter(o => {
    if (o.createdAt) {
      return new Date(o.createdAt).getTime() >= yesterdayTime;
    }
    return o.date === todayStr;
  });

  const openQueries = queries.filter(q => (q.status || '').toLowerCase() === 'in review' || !(q.response || q.reply)).length;
  const activeReturns = returns.filter(r => (r.status || '').toLowerCase() === 'in review' || (r.status || '').toLowerCase() === 'requested').length;

  if (!selectedQueryId && queries.length > 0) {
    selectedQueryId = queries[0].id;
  }
  const activeQuery = queries.find(q => q.id === selectedQueryId) || queries[0] || null;

  // Order Filter Counts & Filtering
  const countAll = orders.length;
  const countInProgress = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const countConfirmed = orders.filter(o => (o.status || '').toLowerCase() === 'confirmed').length;
  const countProcessing = orders.filter(o => (o.status || '').toLowerCase() === 'processing').length;
  const countDispatched = orders.filter(o => (o.status || '').toLowerCase() === 'dispatched').length;
  const countDelivered = orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
  const countCancelled = orders.filter(o => (o.status || '').toLowerCase() === 'cancelled').length;

  let displayedOrders = orders;
  if (activeOrderFilter === 'in-progress') {
    displayedOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  } else if (activeOrderFilter === 'confirmed') {
    displayedOrders = orders.filter(o => (o.status || '').toLowerCase() === 'confirmed');
  } else if (activeOrderFilter === 'processing') {
    displayedOrders = orders.filter(o => (o.status || '').toLowerCase() === 'processing');
  } else if (activeOrderFilter === 'dispatched') {
    displayedOrders = orders.filter(o => (o.status || '').toLowerCase() === 'dispatched');
  } else if (activeOrderFilter === 'delivered') {
    displayedOrders = orders.filter(o => (o.status || '').toLowerCase() === 'delivered');
  } else if (activeOrderFilter === 'cancelled') {
    displayedOrders = orders.filter(o => (o.status || '').toLowerCase() === 'cancelled');
  }

  return `
    <div class="valeora-admin-standalone-root">
      <style>
        .valeora-admin-standalone-root {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100vw;
          height: 100vh;
          background: #0D0105;
          color: #FFFFFF;
          display: flex;
          font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
          z-index: 1000;
          overflow: hidden;
        }

        /* Dedicated Left Sidebar */
        .admin-sidebar {
          width: 275px;
          height: 100%;
          background: linear-gradient(180deg, #1A030C 0%, #0D0105 100%);
          border-right: 1.5px solid rgba(214, 184, 190, 0.22);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          z-index: 10;
        }

        .admin-sidebar-brand {
          padding: 24px 22px;
          border-bottom: 1px solid rgba(214, 184, 190, 0.16);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-sidebar-logo {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          object-fit: contain;
          background: rgba(214, 184, 190, 0.1);
          border: 1px solid rgba(214, 184, 190, 0.25);
          padding: 4px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
          display: block;
        }

        .admin-sidebar-title {
          font-family: var(--font-brand, serif);
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.2;
        }

        .admin-sidebar-badge {
          display: inline-block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #ECCFD0;
          background: rgba(138, 21, 56, 0.6);
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid rgba(214, 184, 190, 0.3);
          font-weight: 700;
          margin-top: 3px;
        }

        .admin-sidebar-nav {
          flex: 1;
          padding: 18px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          background: transparent;
          color: rgba(236, 207, 208, 0.75);
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .admin-nav-item:hover {
          background: rgba(214, 184, 190, 0.08);
          color: #FFFFFF;
          border-color: rgba(214, 184, 190, 0.2);
          transform: translateX(3px);
        }

        .admin-nav-item.active {
          background: linear-gradient(135deg, #CEB6BD 0%, #C3A9B0 100%) !important;
          color: #24040E !important;
          font-weight: 800 !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45) !important;
          transform: none !important;
        }

        .admin-nav-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-nav-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.15);
          color: inherit;
        }

        .admin-nav-item.active .admin-nav-badge {
          background: #2D0715 !important;
          color: #FFFFFF !important;
        }

        .admin-sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(214, 184, 190, 0.16);
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .admin-user-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(214, 184, 190, 0.2);
          border-radius: 12px;
        }

        /* Main Workspace */
        .admin-main-viewport {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: radial-gradient(circle at 50% 0%, rgba(75, 12, 34, 0.32) 0%, #0D0105 75%);
        }

        .admin-header-bar {
          height: 70px;
          padding: 0 32px;
          border-bottom: 1.5px solid rgba(214, 184, 190, 0.2);
          background: rgba(20, 3, 10, 0.85);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .admin-header-title {
          font-family: var(--font-brand, serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-live-pulse {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #4EEDA0;
          background: rgba(78, 237, 160, 0.12);
          border: 1px solid rgba(78, 237, 160, 0.35);
          padding: 4px 10px;
          border-radius: 999px;
        }

        .admin-live-dot {
          width: 7px;
          height: 7px;
          background: #4EEDA0;
          border-radius: 50%;
          box-shadow: 0 0 8px #4EEDA0;
          animation: adminPulse 2s infinite;
        }

        @keyframes adminPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }

        .admin-content-scrollable {
          flex: 1;
          padding: 28px 32px 60px 32px;
          overflow-y: auto;
        }

        .admin-content-scrollable::-webkit-scrollbar {
          width: 6px;
        }
        .admin-content-scrollable::-webkit-scrollbar-track {
          background: rgba(214, 184, 190, 0.08);
        }
        .admin-content-scrollable::-webkit-scrollbar-thumb {
          background: rgba(214, 184, 190, 0.35);
          border-radius: 999px;
        }

        /* Financial Analytics 6-Card Grid */
        .admin-finance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-fin-card {
          background: linear-gradient(155deg, rgba(46, 11, 26, 0.94) 0%, rgba(20, 3, 10, 0.98) 100%);
          border: 1.5px solid rgba(214, 184, 190, 0.25);
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          overflow: hidden;
        }

        .admin-fin-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #D6B8BE, #8A1538);
        }

        .admin-fin-label {
          font-size: 0.74rem;
          color: rgba(236, 207, 208, 0.75);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 700;
        }

        .admin-fin-value {
          font-family: var(--font-brand, serif);
          font-size: 1.55rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.1;
        }

        .admin-fin-sub {
          font-size: 0.74rem;
          color: #4EEDA0;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Visual Graph Cards Grid */
        .admin-charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .admin-chart-box {
          background: linear-gradient(155deg, rgba(42, 7, 21, 0.94) 0%, rgba(20, 2, 8, 0.98) 100%);
          border: 1.5px solid rgba(214, 184, 190, 0.24);
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        .admin-chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .admin-chart-wrapper {
          width: 100%;
          height: 220px;
          position: relative;
        }

        .chart-month-group {
          cursor: pointer;
          transition: filter 0.2s ease, transform 0.2s ease;
        }

        .chart-month-group:hover {
          filter: brightness(1.3) drop-shadow(0 0 10px rgba(214, 184, 190, 0.4));
        }

        .chart-month-group:hover text {
          fill: #FFFFFF !important;
          font-weight: 800 !important;
        }

        .graph-floating-tooltip {
          position: absolute;
          display: none;
          pointer-events: none;
          background: rgba(22, 3, 11, 0.96);
          border: 1.5px solid rgba(214, 184, 190, 0.45);
          border-radius: 12px;
          padding: 10px 14px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.85);
          z-index: 100;
          backdrop-filter: blur(10px);
          font-size: 0.8rem;
          min-width: 170px;
        }

        .admin-panel-card {
          background: linear-gradient(155deg, rgba(42, 7, 21, 0.94) 0%, rgba(20, 2, 8, 0.98) 100%);
          border: 1.5px solid rgba(214, 184, 190, 0.24);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          margin-bottom: 24px;
        }

        .admin-panel-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 14px;
          width: 100%;
        }

        .admin-query-list-item:hover {
          background: rgba(214, 184, 190, 0.08) !important;
        }
        .admin-query-list-item.active {
          background: linear-gradient(90deg, rgba(138, 21, 56, 0.45) 0%, rgba(214, 184, 190, 0.08) 100%) !important;
          border-left: 3.5px solid #D6B8BE !important;
        }
        .admin-quick-reply-pill:hover {
          background: rgba(214, 184, 190, 0.22) !important;
          color: #FFFFFF !important;
          border-color: #D6B8BE !important;
        }

        /* Stock Alert Banner */
        .admin-alert-banner {
          background: linear-gradient(135deg, rgba(230, 126, 34, 0.15) 0%, rgba(138, 21, 56, 0.25) 100%);
          border: 1.5px solid rgba(243, 156, 18, 0.45);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 24px;
        }

        /* Per-Product Margin Table (Lower Dashboard) */
        .admin-table-container {
          width: 100%;
          overflow-x: auto;
        }

        .admin-margin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-margin-table th {
          background: rgba(20, 3, 10, 0.85);
          color: rgba(236, 207, 208, 0.8);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          font-weight: 700;
          padding: 12px 14px;
          border-bottom: 1.5px solid rgba(214, 184, 190, 0.2);
        }

        .admin-margin-table td {
          padding: 14px;
          border-bottom: 1px solid rgba(214, 184, 190, 0.12);
          font-size: 0.84rem;
          vertical-align: middle;
        }

        .admin-margin-table tr:hover td {
          background: rgba(214, 184, 190, 0.04);
        }

        .margin-badge-high {
          background: rgba(46, 204, 113, 0.18);
          color: #4EEDA0;
          border: 1px solid rgba(46, 204, 113, 0.4);
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.76rem;
          box-shadow: 0 0 10px rgba(78, 237, 160, 0.15);
        }

        .stock-badge-low {
          background: rgba(243, 156, 18, 0.2);
          color: #FFBE53;
          border: 1px solid rgba(243, 156, 18, 0.6);
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.76rem;
          box-shadow: 0 0 10px rgba(243, 156, 18, 0.25);
        }

        .stock-badge-good {
          background: rgba(52, 152, 219, 0.18);
          color: #70B8FF;
          border: 1px solid rgba(52, 152, 219, 0.4);
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.76rem;
        }

        /* Color-Coded Admin Status Badges */
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .admin-badge-success {
          background: rgba(46, 204, 113, 0.18) !important;
          color: #4EEDA0 !important;
          border: 1.5px solid rgba(78, 237, 160, 0.5) !important;
          box-shadow: 0 0 12px rgba(78, 237, 160, 0.25);
        }

        .admin-badge-warning {
          background: rgba(243, 156, 18, 0.2) !important;
          color: #FFBE53 !important;
          border: 1.5px solid rgba(243, 156, 18, 0.6) !important;
          box-shadow: 0 0 12px rgba(243, 156, 18, 0.25);
        }

        .admin-badge-danger {
          background: rgba(230, 57, 70, 0.2) !important;
          color: #FF7B84 !important;
          border: 1.5px solid rgba(230, 57, 70, 0.6) !important;
          box-shadow: 0 0 12px rgba(230, 57, 70, 0.25);
        }

        .admin-badge-info {
          background: rgba(52, 152, 219, 0.2) !important;
          color: #70B8FF !important;
          border: 1.5px solid rgba(52, 152, 219, 0.5) !important;
          box-shadow: 0 0 12px rgba(52, 152, 219, 0.25);
        }

        .admin-badge-purple {
          background: rgba(155, 93, 229, 0.2) !important;
          color: #D4A5FF !important;
          border: 1.5px solid rgba(155, 93, 229, 0.5) !important;
          box-shadow: 0 0 12px rgba(155, 93, 229, 0.25);
        }

        /* Order Interactive Filter Pills */
        .admin-filter-pill {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.05);
          border: 1.5px solid rgba(214, 184, 190, 0.22);
          color: #ECCFD0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          user-select: none;
        }

        .admin-filter-pill:hover {
          background: rgba(214, 184, 190, 0.12);
          color: #FFFFFF;
          border-color: rgba(214, 184, 190, 0.45);
          transform: translateY(-1px);
        }

        .admin-filter-pill.active {
          background: linear-gradient(135deg, #D6B8BE 0%, #C4A2A9 100%) !important;
          color: #24040E !important;
          font-weight: 800 !important;
          border-color: #FFFFFF !important;
          box-shadow: 0 4px 14px rgba(214, 184, 190, 0.35);
        }

        .admin-filter-pill.active span {
          color: #24040E !important;
          opacity: 0.85;
        }

        /* Color-Coded Select Dropdown & Status Controls */
        .admin-select {
          appearance: none;
          -webkit-appearance: none;
          background-color: rgba(36, 4, 16, 0.95);
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 5.5L11 1.5' stroke='%23ECCFD0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding: 6px 32px 6px 14px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1.5px solid rgba(214, 184, 190, 0.35);
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
        }

        .admin-select:focus {
          outline: none;
          transform: translateY(-1px);
        }

        .admin-select option {
          background-color: #16020B !important;
          color: #FFFFFF !important;
          padding: 8px 12px !important;
          font-weight: 600 !important;
          font-size: 0.84rem !important;
        }

        /* Dynamic Status-Specific Colors for Select Elements */
        .admin-select.status-confirmed {
          background-color: rgba(46, 204, 113, 0.18) !important;
          color: #4EEDA0 !important;
          border-color: #4EEDA0 !important;
          box-shadow: 0 0 14px rgba(78, 237, 160, 0.32) !important;
        }

        .admin-select.status-processing {
          background-color: rgba(243, 156, 18, 0.22) !important;
          color: #FFC048 !important;
          border-color: #F39C12 !important;
          box-shadow: 0 0 14px rgba(243, 156, 18, 0.35) !important;
        }

        .admin-select.status-dispatched {
          background-color: rgba(155, 93, 229, 0.24) !important;
          color: #D4A5FF !important;
          border-color: #A855F7 !important;
          box-shadow: 0 0 14px rgba(168, 85, 247, 0.35) !important;
        }

        .admin-select.status-delivered {
          background-color: rgba(0, 180, 216, 0.22) !important;
          color: #48CAE4 !important;
          border-color: #00B4D8 !important;
          box-shadow: 0 0 14px rgba(0, 180, 216, 0.35) !important;
        }

        .admin-select.status-cancelled {
          background-color: rgba(230, 57, 70, 0.22) !important;
          color: #FF7B84 !important;
          border-color: #E63946 !important;
          box-shadow: 0 0 14px rgba(230, 57, 70, 0.35) !important;
        }

        .admin-select.status-in-review {
          background-color: rgba(230, 126, 34, 0.22) !important;
          color: #FFA94D !important;
          border-color: #E67E22 !important;
          box-shadow: 0 0 14px rgba(230, 126, 34, 0.35) !important;
        }

        .admin-select.status-answered, .admin-select.status-resolved {
          background-color: rgba(46, 204, 113, 0.18) !important;
          color: #4EEDA0 !important;
          border-color: #2ECC71 !important;
          box-shadow: 0 0 14px rgba(46, 204, 113, 0.32) !important;
        }

        /* Buttons & Forms */
        .admin-btn {
          padding: 9px 18px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
        }

        .admin-btn-primary {
          background: linear-gradient(135deg, #8A1538 0%, #4D091D 100%);
          color: #FFFFFF;
          border: 1px solid rgba(214, 184, 190, 0.35);
          box-shadow: 0 4px 14px rgba(138, 21, 56, 0.45);
        }
        .admin-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(138, 21, 56, 0.65);
        }

        .admin-btn-outline {
          background: rgba(214, 184, 190, 0.08);
          color: #ECCFD0;
          border: 1px solid rgba(214, 184, 190, 0.3);
        }
        .admin-btn-outline:hover {
          background: rgba(214, 184, 190, 0.16);
          color: #FFFFFF;
        }

        .admin-btn-danger {
          background: rgba(230, 57, 70, 0.1);
          color: #FF5A65;
          border: 1.5px solid #E63946;
        }
        .admin-btn-danger:hover {
          background: #E63946;
          color: #FFFFFF;
        }

        /* Modal Backdrop */
        .admin-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000000;
          padding: 20px;
        }

        .admin-modal-dialog {
          background: linear-gradient(155deg, rgba(46, 11, 26, 0.98) 0%, rgba(20, 3, 10, 0.99) 100%);
          border: 1.5px solid rgba(214, 184, 190, 0.35);
          border-radius: 24px;
          max-width: 680px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.85);
          position: relative;
        }

        .valeora-admin-standalone-root,
        .admin-modal-dialog {
          color-scheme: dark;
        }

        .admin-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .admin-form-group label {
          font-size: 0.8rem;
          color: #ECCFD0;
          font-weight: 600;
        }

        .admin-input-field,
        textarea.admin-input-field,
        select.admin-input-field {
          background-color: #1A030C;
          border: 1px solid rgba(214, 184, 190, 0.28);
          border-radius: 10px;
          color: #FFFFFF;
          padding: 10px 14px;
          font-family: inherit;
          font-size: 0.86rem;
          line-height: 1.45;
          box-sizing: border-box;
          width: 100%;
          transition: all 0.2s ease;
          color-scheme: dark;
        }

        select.admin-input-field option,
        .admin-select option {
          background-color: #1A030C !important;
          color: #FFFFFF !important;
          padding: 10px 14px;
        }

        select.admin-input-field option:checked,
        select.admin-input-field option:hover,
        .admin-select option:checked,
        .admin-select option:hover {
          background-color: #8A1538 !important;
          color: #FFFFFF !important;
        }

        .admin-input-field:focus,
        textarea.admin-input-field:focus,
        select.admin-input-field:focus {
          outline: none;
          border-color: #D6B8BE;
          background-color: #260514;
          box-shadow: 0 0 0 3px rgba(214, 184, 190, 0.2);
        }

        /* Image Drag and Drop Zone */
        .admin-image-dropzone {
          border: 1.5px dashed rgba(214, 184, 190, 0.38);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .admin-image-dropzone:hover {
          border-color: #D6B8BE;
          background: rgba(214, 184, 190, 0.07);
        }
        .admin-image-dropzone.dragover {
          border-color: #4EEDA0;
          background: rgba(78, 237, 160, 0.12);
          box-shadow: 0 0 15px rgba(78, 237, 160, 0.25);
        }

        /* Multi-image Slot Studio */
        .admin-gallery-slots-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 4px;
        }
        @media (max-width: 600px) {
          .admin-gallery-slots-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .admin-gallery-slot {
          position: relative;
          aspect-ratio: 1 / 1;
          border: 1.5px dashed rgba(214, 184, 190, 0.35);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.2s ease;
          padding: 6px;
          text-align: center;
        }
        .admin-gallery-slot:hover {
          border-color: #D6B8BE;
          background: rgba(214, 184, 190, 0.08);
        }
        .admin-gallery-slot.dragover {
          border-color: #4EEDA0;
          background: rgba(78, 237, 160, 0.15);
          box-shadow: 0 0 12px rgba(78, 237, 160, 0.3);
        }
        .admin-gallery-slot.has-image {
          border-style: solid;
          border-color: rgba(214, 184, 190, 0.4);
          padding: 0;
        }
        .admin-slot-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }
        .admin-slot-badge {
          position: absolute;
          top: 4px;
          left: 4px;
          font-size: 0.60rem;
          font-weight: 700;
          padding: 1.5px 5px;
          border-radius: 4px;
          background: rgba(18, 2, 8, 0.88);
          color: #ECCFD0;
          border: 1px solid rgba(214, 184, 190, 0.25);
          z-index: 2;
          pointer-events: none;
        }
        .admin-slot-remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.9);
          color: #FFFFFF;
          border: none;
          font-size: 0.75rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .admin-slot-remove-btn:hover {
          transform: scale(1.15);
          background: #DC2626;
        }

        /* Custom scrollbars for modal scroll areas and textareas */
        .admin-modal-dialog::-webkit-scrollbar,
        .admin-modal-scrollable::-webkit-scrollbar,
        textarea.admin-input-field::-webkit-scrollbar,
        .admin-content-scrollable::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .admin-modal-dialog::-webkit-scrollbar-track,
        .admin-modal-scrollable::-webkit-scrollbar-track,
        textarea.admin-input-field::-webkit-scrollbar-track,
        .admin-content-scrollable::-webkit-scrollbar-track {
          background: transparent;
        }
        .admin-modal-dialog::-webkit-scrollbar-thumb,
        .admin-modal-scrollable::-webkit-scrollbar-thumb,
        textarea.admin-input-field::-webkit-scrollbar-thumb,
        .admin-content-scrollable::-webkit-scrollbar-thumb {
          background: rgba(214, 184, 190, 0.28);
          border-radius: 9999px;
        }
        .admin-modal-dialog::-webkit-scrollbar-thumb:hover,
        .admin-modal-scrollable::-webkit-scrollbar-thumb:hover,
        textarea.admin-input-field::-webkit-scrollbar-thumb:hover,
        .admin-content-scrollable::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 207, 208, 0.65);
        }

        /* Admin Responsive Styles */
        @media (max-width: 900px) {
          .valeora-admin-standalone-root {
            flex-direction: column;
            overflow-y: auto;
          }
          .admin-sidebar {
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid rgba(214, 184, 190, 0.2);
          }
          .admin-sidebar-brand {
            padding: 12px 16px;
          }
          .admin-sidebar-nav {
            flex-direction: row;
            overflow-x: auto;
            padding: 8px 12px;
            gap: 6px;
            white-space: nowrap;
          }
          .admin-sidebar-footer {
            display: none;
          }
          .admin-main-viewport {
            height: auto;
            min-height: calc(100vh - 120px);
            overflow: visible;
          }
          .admin-header-bar {
            padding: 0 16px;
            height: 56px;
          }
          .admin-content-scrollable {
            padding: 16px 12px 60px 12px;
            overflow: visible;
          }
          .admin-finance-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 10px;
          }
        }
        @media (max-width: 480px) {
          .admin-finance-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }
          .admin-fin-card {
            padding: 12px 10px;
            border-radius: 12px;
          }
          .admin-fin-card h4 {
            font-size: 1.1rem !important;
          }
          .admin-table-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .admin-modal-dialog {
            width: 95% !important;
            padding: 16px 12px !important;
          }
        }
      </style>

      <!-- 1. Left Sidebar Navigation -->
      <aside class="admin-sidebar">
        <div class="admin-sidebar-brand">
          <img src="/images/valeora_logo.png" alt="VALEORA" class="admin-sidebar-logo" />
          <div>
            <h4 class="admin-sidebar-title">VALEORA</h4>
            <span class="admin-sidebar-badge">Control Center</span>
          </div>
        </div>

        <nav class="admin-sidebar-nav">
          <button class="admin-nav-item ${activeAdminSection === 'dashboard' ? 'active' : ''}" data-nav-target="dashboard">
            <div class="admin-nav-item-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              <span>Analytics & Margin</span>
            </div>
          </button>

          <button class="admin-nav-item ${activeAdminSection === 'orders' ? 'active' : ''}" data-nav-target="orders">
            <div class="admin-nav-item-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span>Orders & Fulfillment</span>
            </div>
            <span class="admin-nav-badge">${orders.length}</span>
          </button>

          <button class="admin-nav-item ${activeAdminSection === 'queries' ? 'active' : ''}" data-nav-target="queries">
            <div class="admin-nav-item-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>Customer Queries</span>
            </div>
            <span class="admin-nav-badge">${openQueries}</span>
          </button>

          <button class="admin-nav-item ${activeAdminSection === 'returns' ? 'active' : ''}" data-nav-target="returns">
            <div class="admin-nav-item-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
              <span>Returns & Claims</span>
            </div>
            <span class="admin-nav-badge">${returns.length}</span>
          </button>

          <button class="admin-nav-item ${activeAdminSection === 'products' ? 'active' : ''}" data-nav-target="products">
            <div class="admin-nav-item-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>Product Catalog</span>
            </div>
            <span class="admin-nav-badge">${products.length}</span>
          </button>

          <button class="admin-nav-item ${activeAdminSection === 'users' ? 'active' : ''}" data-nav-target="users">
            <div class="admin-nav-item-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>User Registry</span>
            </div>
            <span class="admin-nav-badge">${registeredUsers.length}</span>
          </button>

          <button class="admin-nav-item ${activeAdminSection === 'coupons' ? 'active' : ''}" data-nav-target="coupons">
            <div class="admin-nav-item-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              <span>Coupons & Promos</span>
            </div>
            <span class="admin-nav-badge">${(state.coupons || []).length}</span>
          </button>
        </nav>

        <div class="admin-sidebar-footer">
          <div class="admin-user-pill">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%); color: #24040E; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
              A
            </div>
            <div style="min-width: 0; flex: 1;">
              <div style="font-size: 0.82rem; font-weight: 700; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Valeora Admin</div>
              <div style="font-size: 0.72rem; color: #ECCFD0; opacity: 0.75;">admin@valeora.com</div>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <a href="#home" class="admin-btn admin-btn-outline" data-route="home" style="flex: 1; justify-content: center; font-size: 0.76rem; padding: 7px 10px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              Storefront
            </a>
            <button id="admin-sidebar-signout-btn" class="admin-btn admin-btn-danger" style="padding: 7px 12px; font-size: 0.76rem;" title="Sign out of admin session">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- 2. Main Administration Area -->
      <main class="admin-main-viewport">
        <!-- Top Control Bar -->
        <header class="admin-header-bar">
          <div class="admin-header-title">
            <span>${activeAdminSection.toUpperCase()} &bull; FINANCIAL & STORE OPERATIONS</span>
          </div>

          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="admin-live-pulse">
              <span class="admin-live-dot"></span>
              <span>LIVE SERVER SYNCED</span>
            </div>

            <div style="font-size: 0.8rem; color: #ECCFD0; font-weight: 500;">
              ${new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </header>

        <!-- Scrollable Content View -->
        <div class="admin-content-scrollable">

          <!-- ========================================== -->
          <!-- 1. ANALYTICS & MARGIN DASHBOARD (DEFAULT)  -->
          <!-- ========================================== -->
          ${activeAdminSection === 'dashboard' ? `
            
            <!-- Essential Financial Key Metrics -->
            <div class="admin-finance-grid">
              <div class="admin-fin-card">
                <span class="admin-fin-label">Gross Revenue</span>
                <span class="admin-fin-value">₹${Math.round(totalRevenue).toLocaleString('en-IN')}</span>
                <span class="admin-fin-sub">↑ 100% Verified Sales</span>
              </div>

              <div class="admin-fin-card">
                <span class="admin-fin-label">Net Gross Profit</span>
                <span class="admin-fin-value" style="color: #4EEDA0;">₹${Math.round(totalProfit).toLocaleString('en-IN')}</span>
                <span class="admin-fin-sub" style="color: #4EEDA0;">↑ ${profitMarginPercent}% Margin</span>
              </div>

              <div class="admin-fin-card">
                <span class="admin-fin-label">Avg Order Value (AOV)</span>
                <span class="admin-fin-value">₹${Math.round(avgOrderValue).toLocaleString('en-IN')}</span>
                <span class="admin-fin-sub" style="color: #ECCFD0;">Across ${orders.length} orders</span>
              </div>
            </div>

            <!-- Visual Graph & Margin Analysis Charts -->
            <div class="admin-charts-grid">
              <!-- Revenue vs Net Profit Monthly Trend (SVG Vector Chart) -->
              <div class="admin-chart-box">
                <div class="admin-chart-header">
                  <div>
                    <h3 style="font-family: var(--font-brand, serif); font-size: 1.15rem; color: #FFFFFF; margin: 0;">
                      Revenue vs Profit Margin Trajectory
                    </h3>
                    <p style="font-size: 0.76rem; color: rgba(236, 207, 208, 0.7); margin: 2px 0 0 0;">
                      Monthly performance analysis (Gross Revenue vs Net Margins)
                    </p>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px; font-size: 0.75rem;">
                    <span style="display:flex; align-items:center; gap:5px; color:#FFFFFF;">
                      <span style="width:10px; height:10px; border-radius:3px; background:#D6B8BE; display:inline-block;"></span>
                      Gross Revenue
                    </span>
                    <span style="display:flex; align-items:center; gap:5px; color:#4EEDA0;">
                      <span style="width:10px; height:10px; border-radius:3px; background:#4EEDA0; display:inline-block;"></span>
                      Net Profit
                    </span>
                  </div>
                </div>

                <!-- SVG Interactive Multi-Bar & Trend Area Graph -->
                <div class="admin-chart-wrapper">
                  <!-- Floating Tooltip Container -->
                  <div id="graph-tooltip" class="graph-floating-tooltip">
                    <div id="tooltip-month" style="font-weight: 700; color: #FFFFFF; margin-bottom: 6px; border-bottom: 1px solid rgba(214,184,190,0.25); padding-bottom: 4px; font-size: 0.84rem;">Month</div>
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 4px;">
                      <span style="color: #ECCFD0; font-size: 0.76rem; display: flex; align-items: center; gap: 4px;">
                        <span style="width: 8px; height: 8px; border-radius: 2px; background: #D6B8BE; display: inline-block;"></span> Gross Revenue:
                      </span>
                      <span id="tooltip-rev" style="color: #FFFFFF; font-weight: 800;">₹0</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 4px;">
                      <span style="color: #ECCFD0; font-size: 0.76rem; display: flex; align-items: center; gap: 4px;">
                        <span style="width: 8px; height: 8px; border-radius: 2px; background: #4EEDA0; display: inline-block;"></span> Net Profit:
                      </span>
                      <span id="tooltip-profit" style="color: #4EEDA0; font-weight: 800;">₹0</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; border-top: 1px dashed rgba(214,184,190,0.18); padding-top: 4px;">
                      <span style="color: #ECCFD0; font-size: 0.72rem;">Profit Margin:</span>
                      <span id="tooltip-margin" style="color: #70B8FF; font-weight: 700; font-size: 0.75rem;">0%</span>
                    </div>
                  </div>

                  <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none" style="overflow: visible;">
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#D6B8BE" stop-opacity="0.95"/>
                        <stop offset="100%" stop-color="#8A1538" stop-opacity="0.6"/>
                      </linearGradient>
                      <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#4EEDA0" stop-opacity="0.95"/>
                        <stop offset="100%" stop-color="#1B6340" stop-opacity="0.6"/>
                      </linearGradient>
                      <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#4EEDA0" stop-opacity="0.25"/>
                        <stop offset="100%" stop-color="#4EEDA0" stop-opacity="0.0"/>
                      </linearGradient>
                    </defs>

                    <!-- Horizontal Gridlines -->
                    <line x1="40" y1="30" x2="580" y2="30" stroke="rgba(214, 184, 190, 0.1)" stroke-dasharray="4"/>
                    <line x1="40" y1="80" x2="580" y2="80" stroke="rgba(214, 184, 190, 0.1)" stroke-dasharray="4"/>
                    <line x1="40" y1="130" x2="580" y2="130" stroke="rgba(214, 184, 190, 0.1)" stroke-dasharray="4"/>
                    <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(214, 184, 190, 0.2)"/>

                    <!-- Y Axis Labels -->
                    <text x="32" y="34" fill="rgba(236,207,208,0.5)" font-size="10" text-anchor="end">₹${maxMonthRev >= 1000 ? Math.round(maxMonthRev / 1000) + 'k' : Math.round(maxMonthRev)}</text>
                    <text x="32" y="84" fill="rgba(236,207,208,0.5)" font-size="10" text-anchor="end">₹${maxMonthRev >= 1000 ? Math.round((maxMonthRev * 0.66) / 1000) + 'k' : Math.round(maxMonthRev * 0.66)}</text>
                    <text x="32" y="134" fill="rgba(236,207,208,0.5)" font-size="10" text-anchor="end">₹${maxMonthRev >= 1000 ? Math.round((maxMonthRev * 0.33) / 1000) + 'k' : Math.round(maxMonthRev * 0.33)}</text>
                    <text x="32" y="174" fill="rgba(236,207,208,0.5)" font-size="10" text-anchor="end">₹0</text>

                    <!-- Trend Area Fill -->
                    <polygon points="${trendAreaPoints}" fill="url(#areaGlow)" />

                    <!-- Dynamic 6 Months from Database Orders -->
                    ${monthlyBuckets.map((b, idx) => {
    const xBox = 55 + idx * 90;
    const xRev = 65 + idx * 90;
    const xProfit = 88 + idx * 90;
    const xText = 86 + idx * 90;
    const revH = b.revenue > 0 ? Math.max(4, Math.round((b.revenue / maxMonthRev) * chartHeight)) : 2;
    const profitH = b.profit > 0 ? Math.max(4, Math.round((b.profit / maxMonthRev) * chartHeight)) : 2;
    const revY = 170 - revH;
    const profitY = 170 - profitH;
    const isCur = b.isCurrent;

    return `
                        <g class="chart-month-group" data-month="${b.fullLabel}${isCur ? ' (Live Store)' : ''}" data-rev="₹${Math.round(b.revenue).toLocaleString('en-IN')}" data-profit="₹${Math.round(b.profit).toLocaleString('en-IN')}" data-margin="${b.margin}%">
                          <rect x="${xBox}" y="10" width="60" height="180" fill="transparent" />
                          <rect x="${xRev}" y="${revY}" width="20" height="${revH}" rx="4" fill="url(#revGrad)" />
                          <rect x="${xProfit}" y="${profitY}" width="20" height="${profitH}" rx="4" fill="url(#profitGrad)" />
                          <text x="${xText}" y="188" fill="${isCur ? '#FFFFFF' : 'rgba(236,207,208,0.8)'}" font-weight="${isCur ? '700' : '400'}" font-size="11" text-anchor="middle">${b.label}</text>
                        </g>
                      `;
  }).join('')}

                    <!-- Trend Line Overlay -->
                    <polyline points="${trendPolyline}" fill="none" stroke="#4EEDA0" stroke-width="2.5" stroke-linecap="round" />
                    <circle cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="4" fill="#4EEDA0" stroke="#FFFFFF" stroke-width="1.5" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Dashboard Operations Grid: Critical Stock (< 3) & 24h Recent Incoming Orders -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 20px; margin-bottom: 24px;">
              
              <!-- 1. Critical Stock Alert Box (Stock < 3) -->
              <div class="admin-chart-box" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div class="admin-chart-header" style="margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(230, 57, 70, 0.2); color: #FF7B84; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                        ⚠️
                      </div>
                      <div>
                        <h3 style="font-family: var(--font-brand, serif); font-size: 1.12rem; color: #FFFFFF; margin: 0;">
                          Critical Inventory Watch (&lt; 3 Units)
                        </h3>
                        <p style="font-size: 0.74rem; color: rgba(236, 207, 208, 0.7); margin: 2px 0 0 0;">
                          ${criticalStockProducts.length === 0 ? 'All catalog items sufficiently stocked' : `${criticalStockProducts.length} item(s) require immediate restocking`}
                        </p>
                      </div>
                    </div>
                    <button class="admin-btn admin-btn-outline" data-nav-target="products" style="font-size: 0.74rem; padding: 5px 12px; border-color: rgba(214,184,190,0.35);">
                      Manage Stock &rarr;
                    </button>
                  </div>

                  ${criticalStockProducts.length === 0 ? `
                    <div style="background: rgba(46, 204, 113, 0.1); border: 1px solid rgba(78, 237, 160, 0.3); border-radius: 12px; padding: 18px; text-align: center; color: #4EEDA0; font-size: 0.82rem; margin-top: 10px;">
                      ✓ All products currently have healthy stock quantities (3+ items in inventory).
                    </div>
                  ` : `
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px; max-height: 240px; overflow-y: auto; padding-right: 4px;">
                      ${criticalStockProducts.map(p => {
    const isOutOfStock = (Number(p.stockQty) || 0) <= 0;
    return `
                          <div style="background: rgba(255, 255, 255, 0.03); border: 1.5px solid ${isOutOfStock ? 'rgba(230, 57, 70, 0.45)' : 'rgba(243, 156, 18, 0.4)'}; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                            <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                              <img src="${p.image || '/images/imperial_necklace.jpg'}" alt="${p.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(214,184,190,0.25); flex-shrink: 0;" onerror="this.src='/images/imperial_necklace.jpg'" />
                              <div style="min-width: 0;">
                                <div style="color: #FFFFFF; font-weight: 700; font-size: 0.86rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">
                                  ${p.name}
                                </div>
                                <div style="font-size: 0.72rem; color: #ECCFD0;">
                                  ${p.category || 'Jewelry'} &bull; ₹${p.price}
                                </div>
                              </div>
                            </div>

                            <div>
                              ${isOutOfStock ? `
                                <span class="admin-badge admin-badge-danger" style="font-weight: 800; font-size: 0.76rem; letter-spacing: 0.02em;">
                                  🚨 OUT OF STOCK (0 left)
                                </span>
                              ` : `
                                <span class="admin-badge admin-badge-warning" style="font-weight: 800; font-size: 0.76rem; letter-spacing: 0.02em;">
                                  ⚠️ ONLY ${p.stockQty} LEFT
                                </span>
                              `}
                            </div>
                          </div>
                        `;
  }).join('')}
                    </div>
                  `}
                </div>
              </div>

              <!-- 2. 24-Hour Incoming Orders Quick-View Feed -->
              <div class="admin-chart-box" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div class="admin-chart-header" style="margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div class="admin-live-pulse" style="padding: 4px 8px;">
                        <span class="admin-live-dot"></span>
                      </div>
                      <div>
                        <h3 style="font-family: var(--font-brand, serif); font-size: 1.12rem; color: #FFFFFF; margin: 0;">
                          Live Orders (Last 24 Hours)
                        </h3>
                        <p style="font-size: 0.74rem; color: rgba(236, 207, 208, 0.7); margin: 2px 0 0 0;">
                          Auto-clears after 24h &bull; ${recent24hOrders.length} order(s) received
                        </p>
                      </div>
                    </div>
                    <button class="admin-btn admin-btn-outline" data-nav-target="orders" style="font-size: 0.74rem; padding: 5px 12px; border-color: rgba(214,184,190,0.35);">
                      View All Orders &rarr;
                    </button>
                  </div>

                  ${recent24hOrders.length === 0 ? `
                    <div style="background: rgba(255, 255, 255, 0.02); border: 1px dashed rgba(214, 184, 190, 0.2); border-radius: 12px; padding: 24px; text-align: center; color: #ECCFD0; font-size: 0.8rem; margin-top: 10px;">
                      No new orders received in the last 24 hours window.
                      <div style="font-size: 0.72rem; color: rgba(236,207,208,0.5); margin-top: 4px;">Incoming customer orders will appear here automatically.</div>
                    </div>
                  ` : `
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px; max-height: 240px; overflow-y: auto; padding-right: 4px;">
                      ${recent24hOrders.map(ord => `
                        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(214, 184, 190, 0.18); border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                          <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                              <strong style="color: #FFFFFF; font-size: 0.88rem;">#${ord.id}</strong>
                              <span style="font-size: 0.74rem; color: #ECCFD0;">&bull; ${ord.customerName}</span>
                            </div>
                            <div style="font-size: 0.72rem; color: rgba(236,207,208,0.7); margin-top: 2px;">
                              ${(ord.items || []).length} items &bull; Placed on ${ord.date || 'Today'}
                            </div>
                          </div>

                          <div style="display: flex; align-items: center; gap: 10px;">
                            <strong style="font-family: var(--font-brand); color: #FFFFFF; font-size: 0.96rem;">
                              ₹${Number(ord.total || 0).toLocaleString('en-IN')}
                            </strong>
                            <span class="admin-badge ${ord.status === 'Delivered' ? 'admin-badge-success' : 'admin-badge-info'}" style="font-size: 0.72rem; padding: 3px 8px;">
                              ${ord.status || 'Confirmed'}
                            </span>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  `}
                </div>
              </div>

            </div>
          ` : ''}

          <!-- ========================================== -->
          <!-- 2. ORDERS SECTION                          -->
          <!-- ========================================== -->
          ${activeAdminSection === 'orders' ? `
            <div class="admin-panel-card">
              <div class="admin-panel-head" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
                <div>
                  <h3 style="font-family: var(--font-brand, serif); font-size: 1.35rem; margin: 0; color: #FFFFFF;">
                    Orders & Fulfillment Manager
                  </h3>
                </div>

                <!-- Interactive Filter Tabs -->
                <div class="admin-order-filters-row" style="display: flex; flex-wrap: wrap; gap: 7px; align-items: center;">
                  <button class="admin-filter-pill ${activeOrderFilter === 'all' ? 'active' : ''}" data-order-filter="all">
                    All <span>(${countAll})</span>
                  </button>
                  <button class="admin-filter-pill ${activeOrderFilter === 'in-progress' ? 'active' : ''}" data-order-filter="in-progress">
                    In Progress <span>(${countInProgress})</span>
                  </button>
                  <button class="admin-filter-pill ${activeOrderFilter === 'confirmed' ? 'active' : ''}" data-order-filter="confirmed">
                    Confirmed <span>(${countConfirmed})</span>
                  </button>
                  <button class="admin-filter-pill ${activeOrderFilter === 'processing' ? 'active' : ''}" data-order-filter="processing">
                    Processing <span>(${countProcessing})</span>
                  </button>
                  <button class="admin-filter-pill ${activeOrderFilter === 'dispatched' ? 'active' : ''}" data-order-filter="dispatched">
                    Dispatched <span>(${countDispatched})</span>
                  </button>
                  <button class="admin-filter-pill ${activeOrderFilter === 'delivered' ? 'active' : ''}" data-order-filter="delivered">
                    Delivered <span>(${countDelivered})</span>
                  </button>
                  <button class="admin-filter-pill ${activeOrderFilter === 'cancelled' ? 'active' : ''}" data-order-filter="cancelled">
                    Cancelled <span>(${countCancelled})</span>
                  </button>
                </div>
              </div>

              ${displayedOrders.length === 0 ? `
                <p style="color: #ECCFD0; text-align: center; padding: 40px; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px dashed rgba(214,184,190,0.2);">
                  No orders found matching filter "${activeOrderFilter}".
                </p>
              ` : `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(440px, 1fr)); gap: 18px;">
                  ${displayedOrders.map(ord => `
                    <div style="background: linear-gradient(155deg, rgba(46, 11, 26, 0.55) 0%, rgba(20, 3, 10, 0.85) 100%); border: 1.5px solid rgba(214, 184, 190, 0.22); border-radius: 18px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);">
                      
                      <!-- Header Row: Order ID, Date, Amount & Status -->
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; border-bottom: 1px solid rgba(214, 184, 190, 0.15); padding-bottom: 12px;">
                        <div>
                          <strong style="color: #FFFFFF; font-size: 1.05rem; letter-spacing: 0.02em;">#${ord.id}</strong>
                          <div style="color: rgba(236, 207, 208, 0.7); font-size: 0.78rem; margin-top: 2px;">
                            Placed on ${formatDateDDMMYYYY(ord.date)}
                          </div>
                        </div>

                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
                          <strong style="color: #FFFFFF; font-family: var(--font-brand); font-size: 1.22rem; line-height: 1;">
                            ₹${Number(ord.total || 0).toLocaleString('en-IN')}
                          </strong>
                          <select class="admin-select order-status-changer ${getStatusClass(ord.status)}" data-order-id="${ord.id}" style="padding: 4px 28px 4px 10px; font-size: 0.78rem;">
                            <option value="Confirmed" ${ord.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>Processing</option>
                            <option value="Dispatched" ${ord.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
                            <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="Cancelled" ${ord.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <!-- Customer & Shipping Details Box -->
                      <div style="background: rgba(0, 0, 0, 0.28); border: 1px solid rgba(214, 184, 190, 0.14); border-radius: 12px; padding: 10px 12px; font-size: 0.82rem; color: rgba(236, 207, 208, 0.88); line-height: 1.45;">
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px; color: #FFFFFF; font-weight: 700;">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D6B8BE" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          <span>${ord.customerName || 'Valued Customer'}</span>
                        </div>
                        <div style="font-size: 0.76rem; color: rgba(236, 207, 208, 0.7); margin-bottom: 4px;">
                          ${ord.email || 'No email on file'} &bull; ${ord.phone || 'No phone'}
                        </div>
                        <div style="font-size: 0.78rem; color: rgba(236, 207, 208, 0.95); display: flex; gap: 5px; align-items: flex-start;">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ECCFD0" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          <span>${ord.address || 'Address on file'}</span>
                        </div>
                      </div>

                      <!-- Ordered Items List -->
                      <div>
                        <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(236, 207, 208, 0.6); font-weight: 700; margin-bottom: 6px;">
                          Order Items (${(ord.items || []).reduce((s, i) => s + (Number(i.qty) || 1), 0)}):
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                          ${(ord.items || []).map(item => `
                            <div style="background: rgba(214, 184, 190, 0.1); border: 1px solid rgba(214, 184, 190, 0.22); border-radius: 8px; padding: 5px 10px; font-size: 0.78rem; color: #FFFFFF; display: flex; align-items: center; gap: 6px;">
                              <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${item.name}</span>
                              <strong style="color: #ECCFD0; font-size: 0.74rem;">&times;${item.qty || 1}</strong>
                              <span style="color: #4EEDA0; font-weight: 700; font-size: 0.74rem;">₹${Number((item.unitPrice || item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</span>
                            </div>
                          `).join('')}
                        </div>
                      </div>

                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          ` : ''}

          <!-- ========================================== -->
          <!-- 3. CUSTOMER QUERIES SECTION (2-PANE SPLIT) -->
          <!-- ========================================== -->
          ${activeAdminSection === 'queries' ? `
            <div class="admin-panel-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; min-height: 600px; height: calc(100vh - 190px);">
              
              <!-- Section Header -->
              <div class="admin-panel-head" style="padding: 18px 24px; margin-bottom: 0; border-bottom: 1.5px solid rgba(214, 184, 190, 0.2); background: rgba(20, 3, 10, 0.85); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h3 style="font-family: var(--font-brand, serif); font-size: 1.3rem; margin: 0; color: #FFFFFF;">
                    Concierge & Help Desk (${queries.length})
                  </h3>
                </div>
              </div>

              <!-- 2-Pane Split Container -->
              <div style="display: grid; grid-template-columns: 330px 1fr; flex: 1; min-height: 0; overflow: hidden;">
                
                <!-- Left Pane: Scrollable List of All Queries -->
                <div class="admin-queries-sidebar" style="border-right: 1.5px solid rgba(214, 184, 190, 0.2); background: rgba(0, 0, 0, 0.35); overflow-y: auto; display: flex; flex-direction: column;">
                  ${queries.length === 0 ? `
                    <div style="padding: 30px; text-align: center; color: #ECCFD0; font-size: 0.84rem;">
                      No customer inquiries logged yet.
                    </div>
                  ` : queries.map(q => {
    const isSelected = activeQuery && q.id === activeQuery.id;
    const statusLower = (q.status || '').toLowerCase();
    const isAnswered = statusLower === 'answered';
    const isResolved = statusLower === 'resolved' || statusLower === 'closed';
    return `
                      <div class="admin-query-list-item ${isSelected ? 'active' : ''}" data-query-select-id="${q.id}" style="padding: 14px 16px; border-bottom: 1px solid rgba(214, 184, 190, 0.12); cursor: pointer; transition: all 0.2s ease; background: ${isSelected ? 'linear-gradient(90deg, rgba(138, 21, 56, 0.45) 0%, rgba(214, 184, 190, 0.08) 100%)' : 'transparent'}; border-left: ${isSelected ? '3.5px solid #D6B8BE' : '3.5px solid transparent'};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                          <span style="font-weight: 700; font-size: 0.85rem; color: ${isSelected ? '#FFFFFF' : '#ECCFD0'};">#${q.id}</span>
                          <div style="display: flex; align-items: center; gap: 6px;">
                            <span class="admin-badge ${isResolved ? 'admin-badge-info' : (isAnswered ? 'admin-badge-success' : 'admin-badge-warning')}" style="font-size: 0.68rem; padding: 2px 7px;">
                              ${q.status || (q.response ? 'Answered' : 'In Review')}
                            </span>
                            ${isResolved ? `
                              <button type="button" class="admin-query-delete-btn" data-query-delete-id="${q.id}" title="Delete resolved/closed ticket" style="background: rgba(230, 57, 70, 0.15); border: 1px solid rgba(230, 57, 70, 0.4); border-radius: 6px; color: #FF7B84; cursor: pointer; padding: 2px 5px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.7rem; transition: all 0.2s;">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </button>
                            ` : ''}
                          </div>
                        </div>
                        <div style="color: #FFFFFF; font-weight: 600; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;">
                          ${q.subject || 'Customer Inquiry'}
                        </div>
                        <div style="font-size: 0.74rem; color: rgba(236, 207, 208, 0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;">
                          ${q.message || ''}
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: rgba(236, 207, 208, 0.5);">
                          <span>${q.category || 'General'}</span>
                          <span>${formatDateDDMMYYYY(q.date)}</span>
                        </div>
                      </div>
                    `;
  }).join('')}
                </div>

                <!-- Right Pane: Specific Selected Query Chat & Thread -->
                <div style="display: flex; flex-direction: column; height: 100%; min-height: 0; background: rgba(16, 2, 8, 0.95); overflow: hidden;">
                  ${!activeQuery ? `
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #ECCFD0; font-size: 0.9rem; flex-direction: column; gap: 8px;">
                      <div style="font-size: 2.2rem;">💬</div>
                      <div>Select a customer ticket on the left to read messages and dispatch a response.</div>
                    </div>
                  ` : `
                    <!-- Chat Header -->
                    <div style="padding: 16px 24px; border-bottom: 1.5px solid rgba(214, 184, 190, 0.2); background: rgba(28, 4, 14, 0.9); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                      <div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <h4 style="font-family: var(--font-brand, serif); font-size: 1.15rem; color: #FFFFFF; margin: 0;">
                            ${activeQuery.subject}
                          </h4>
                          <span class="admin-badge ${(activeQuery.status || '').toLowerCase() === 'resolved' || (activeQuery.status || '').toLowerCase() === 'closed' ? 'admin-badge-info' : ((activeQuery.status || '').toLowerCase() === 'answered' ? 'admin-badge-success' : 'admin-badge-warning')}">
                            ${activeQuery.status || (activeQuery.response ? 'Answered' : 'In Review')}
                          </span>
                        </div>
                        <div style="font-size: 0.76rem; color: #ECCFD0; margin-top: 3px;">
                          Ticket #${activeQuery.id} &bull; Topic: <strong>${activeQuery.category || 'Concierge'}</strong> &bull; Received on ${formatDateDDMMYYYY(activeQuery.date)}
                        </div>
                      </div>

                      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <span style="font-size: 0.76rem; color: #ECCFD0; font-weight: 600;">Ticket Status:</span>
                        <select class="admin-select query-status-changer ${getStatusClass(activeQuery.status || (activeQuery.response ? 'Answered' : 'In Review'))}" data-query-id="${activeQuery.id}" style="padding: 4px 28px 4px 10px; font-size: 0.78rem;">
                          <option value="In Review" ${(activeQuery.status || '').toLowerCase() === 'in review' ? 'selected' : ''}>In Review</option>
                          <option value="Answered" ${(activeQuery.status || '').toLowerCase() === 'answered' ? 'selected' : ''}>Answered</option>
                          <option value="Resolved" ${(activeQuery.status || '').toLowerCase() === 'resolved' ? 'selected' : ''}>Resolved</option>
                          <option value="Closed" ${(activeQuery.status || '').toLowerCase() === 'closed' ? 'selected' : ''}>Closed</option>
                        </select>

                        ${(activeQuery.status || '').toLowerCase() === 'resolved' || (activeQuery.status || '').toLowerCase() === 'closed' ? `
                          <button type="button" class="admin-btn admin-btn-danger delete-active-query-btn" data-query-id="${activeQuery.id}" style="padding: 5px 12px; font-size: 0.75rem;" title="Permanently delete this resolved / closed ticket to maintain cleanlyness">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            <span>Delete Ticket</span>
                          </button>
                        ` : ''}
                      </div>
                    </div>

                    <!-- Chat Messages Conversation Area -->
                    <div style="flex: 1; overflow-y: auto; padding: 22px 24px; display: flex; flex-direction: column; gap: 16px;">
                      
                      <!-- Customer Query Bubble -->
                      <div style="display: flex; gap: 12px; align-items: flex-start; max-width: 82%;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #D6B8BE 0%, #8A1538 100%); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">
                          C
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.05); border: 1.5px solid rgba(214, 184, 190, 0.22); border-radius: 4px 16px 16px 16px; padding: 14px 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.3);">
                          <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 6px;">
                            <span style="font-weight: 700; color: #FFFFFF; font-size: 0.86rem;">Customer Message</span>
                            <span style="font-size: 0.72rem; color: rgba(236, 207, 208, 0.6);">${formatDateDDMMYYYY(activeQuery.date)}</span>
                          </div>
                          <div style="font-size: 0.88rem; color: rgba(236, 207, 208, 0.95); line-height: 1.5; white-space: pre-wrap;">${activeQuery.message}</div>
                        </div>
                      </div>

                      <!-- Official Valeora Response Bubble (if any) -->
                      ${activeQuery.response || activeQuery.reply ? `
                        <div style="display: flex; gap: 12px; align-items: flex-start; max-width: 82%; align-self: flex-end; flex-direction: row-reverse;">
                          <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #8A1538 0%, #4D091D 100%); border: 1.5px solid rgba(214, 184, 190, 0.4); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">
                            V
                          </div>
                          <div style="background: linear-gradient(145deg, rgba(138, 21, 56, 0.35) 0%, rgba(77, 9, 29, 0.5) 100%); border: 1.5px solid rgba(214, 184, 190, 0.35); border-radius: 16px 4px 16px 16px; padding: 14px 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.3);">
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 6px;">
                              <span style="font-weight: 700; color: #4EEDA0; font-size: 0.86rem;">Valeora Concierge Dispatch</span>
                              <span style="font-size: 0.72rem; color: rgba(236, 207, 208, 0.6);">Dispatched to Patron Profile</span>
                            </div>
                            <div style="font-size: 0.88rem; color: #FFFFFF; line-height: 1.5; white-space: pre-wrap;">${activeQuery.response || activeQuery.reply}</div>
                          </div>
                        </div>
                      ` : `
                        <div style="text-align: center; color: rgba(236, 207, 208, 0.5); font-size: 0.78rem; padding: 10px 16px; border-radius: 8px; background: rgba(0,0,0,0.25); align-self: center; border: 1px dashed rgba(214,184,190,0.2);">
                          Awaiting official response &bull; Draft your message below to send to the patron's account
                        </div>
                      `}
                    </div>

                    <!-- Interactive Reply Composer & Claim Initiator at Bottom -->
                    <div style="padding: 16px 24px; border-top: 1.5px solid rgba(214, 184, 190, 0.2); background: rgba(12, 1, 5, 0.98);">
                      
                      <!-- Quick Resolution & Claim Action Bar (Rendered ONLY if query is related to Return, Exchange or Refund) -->
                      ${isClaimRelatedQuery(activeQuery) ? `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(214,184,190,0.18); border-radius: 12px; padding: 10px 14px;">
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; color: #ECCFD0; font-weight: 700;">
                              Initiate Concierge Action:
                            </span>
                            <span style="font-size: 0.72rem; color: rgba(236,207,208,0.6);">(Reflects live in Returns & Claims)</span>
                          </div>
                          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <button type="button" class="admin-btn-claim-trigger" data-claim-type="Return" data-query-id="${activeQuery.id}" style="background: linear-gradient(135deg, rgba(243, 156, 18, 0.18) 0%, rgba(200, 110, 10, 0.28) 100%); border: 1.5px solid rgba(243, 156, 18, 0.55); border-radius: 999px; color: #FFBE53; font-size: 0.75rem; font-weight: 700; padding: 6px 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"></path></svg>
                              <span>+ Initiate Return</span>
                            </button>
                            <button type="button" class="admin-btn-claim-trigger" data-claim-type="Exchange" data-query-id="${activeQuery.id}" style="background: linear-gradient(135deg, rgba(155, 93, 229, 0.2) 0%, rgba(120, 60, 200, 0.3) 100%); border: 1.5px solid rgba(155, 93, 229, 0.55); border-radius: 999px; color: #D4A5FF; font-size: 0.75rem; font-weight: 700; padding: 6px 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"></polyline><path d="M3.51 15a9 9 0 0 0 14.85 4.36L23 10"></path></svg>
                              <span>+ Initiate Exchange</span>
                            </button>
                            <button type="button" class="admin-btn-claim-trigger" data-claim-type="Refund" data-query-id="${activeQuery.id}" style="background: linear-gradient(135deg, rgba(46, 204, 113, 0.18) 0%, rgba(30, 160, 85, 0.28) 100%); border: 1.5px solid rgba(46, 204, 113, 0.55); border-radius: 999px; color: #4EEDA0; font-size: 0.75rem; font-weight: 700; padding: 6px 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                              <span>+ Initiate Refund</span>
                            </button>
                          </div>
                        </div>
                      ` : ''}

                      <div style="display: flex; gap: 10px; align-items: flex-end;">
                        <textarea id="reply-input-${activeQuery.id}" rows="2" style="flex: 1; background: rgba(0, 0, 0, 0.6); border: 1.5px solid rgba(214, 184, 190, 0.3); border-radius: 10px; color: #FFFFFF; padding: 10px 14px; font-size: 0.86rem; resize: none;" placeholder="Type official response to customer inquiry or dispatch resolution...">${activeQuery.response || activeQuery.reply || ''}</textarea>
                        <button class="admin-btn admin-btn-primary save-query-reply-btn" data-query-id="${activeQuery.id}" style="padding: 10px 22px; font-size: 0.82rem; height: 42px; white-space: nowrap;">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          <span>Send Response</span>
                        </button>
                      </div>
                    </div>
                  `}
                </div>

              </div>
            </div>
          ` : ''}

          <!-- ========================================== -->
          <!-- 4. RETURNS, CLAIMS & EXCHANGES SECTION     -->
          <!-- ========================================== -->
          ${activeAdminSection === 'returns' ? `
            <div class="admin-panel-card">
              <div class="admin-panel-head" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 20px;">
                <div>
                  <h3 style="font-family: var(--font-brand, serif); font-size: 1.3rem; margin: 0; color: #FFFFFF;">
                    Returns, Claims & Replacements (${returns.length})
                  </h3>
                  <p style="font-size: 0.8rem; color: #ECCFD0; margin: 4px 0 0 0;">
                    Manage reverse pickups, replacement shipments, and customer refund claims
                  </p>
                </div>

                <!-- Return Type / Status Filter Tabs -->
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button class="admin-filter-pill ${activeReturnFilter === 'all' ? 'active' : ''}" data-return-filter="all">
                    All Claims <span>(${returns.length})</span>
                  </button>
                  <button class="admin-filter-pill ${activeReturnFilter === 'Return' ? 'active' : ''}" data-return-filter="Return">
                    Returns <span>(${returns.filter(r => (r.type || 'Return') === 'Return').length})</span>
                  </button>
                  <button class="admin-filter-pill ${activeReturnFilter === 'Exchange' ? 'active' : ''}" data-return-filter="Exchange">
                    Exchanges <span>(${returns.filter(r => r.type === 'Exchange').length})</span>
                  </button>
                  <button class="admin-filter-pill ${activeReturnFilter === 'Refund' ? 'active' : ''}" data-return-filter="Refund">
                    Refunds <span>(${returns.filter(r => r.type === 'Refund').length})</span>
                  </button>
                </div>
              </div>

              ${(() => {
        const filteredReturns = returns.filter(r => {
          if (activeReturnFilter === 'all') return true;
          const t = r.type || (r.id.startsWith('EXC') ? 'Exchange' : r.id.startsWith('REF') ? 'Refund' : 'Return');
          return t.toLowerCase() === activeReturnFilter.toLowerCase();
        });

        if (filteredReturns.length === 0) {
          return `
                    <div style="padding: 40px; text-align: center; color: #ECCFD0; background: rgba(0,0,0,0.25); border-radius: 16px; border: 1px dashed rgba(214,184,190,0.2);">
                      <div style="font-size: 2rem; margin-bottom: 8px;">📦</div>
                      <div style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">No Claims in this Category</div>
                      <div style="font-size: 0.82rem; color: rgba(236,207,208,0.7);">You can initiate returns, exchanges, or refunds directly from the Customer Queries section.</div>
                    </div>
                  `;
        }

        return filteredReturns.map(ret => {
          const claimType = ret.type || (ret.id.startsWith('EXC') ? 'Exchange' : ret.id.startsWith('REF') ? 'Refund' : 'Return');
          const isApproved = (ret.status || '').toLowerCase() === 'approved';
          const isCompleted = (ret.status || '').toLowerCase() === 'completed';
          const isRejected = (ret.status || '').toLowerCase() === 'rejected';

          // Clean up details note string
          let cleanDetails = (ret.details || '').trim();
          if (cleanDetails.startsWith('"') && cleanDetails.endsWith('"')) {
            cleanDetails = cleanDetails.slice(1, -1).trim();
          }

          return `
                    <div class="admin-claim-card" style="background: linear-gradient(155deg, rgba(38, 9, 21, 0.95) 0%, rgba(18, 2, 9, 0.98) 100%); border: 1.5px solid rgba(214, 184, 190, 0.25); border-radius: 18px; padding: 22px 24px; margin-bottom: 20px; box-shadow: 0 12px 36px rgba(0,0,0,0.5); transition: all 0.2s ease;">
                      
                      <!-- Top Header Row -->
                      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid rgba(214, 184, 190, 0.16);">
                        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                          <strong style="color: #FFFFFF; font-family: var(--font-brand, serif); font-size: 1.2rem; letter-spacing: 0.5px;">${ret.id}</strong>
                          
                          <!-- Claim Type Badge -->
                          ${claimType === 'Exchange' ? `
                            <span class="admin-badge admin-badge-purple" style="font-weight: 800; font-size: 0.76rem; padding: 3px 10px; border-radius: 6px;">
                              🔁 Exchange
                            </span>
                          ` : claimType === 'Refund' ? `
                            <span class="admin-badge admin-badge-success" style="font-weight: 800; font-size: 0.76rem; padding: 3px 10px; border-radius: 6px;">
                              💰 Refund
                            </span>
                          ` : `
                            <span class="admin-badge admin-badge-warning" style="font-weight: 800; font-size: 0.76rem; padding: 3px 10px; border-radius: 6px;">
                              🔄 Return
                            </span>
                          `}

                          <!-- Status Badge -->
                          <span class="admin-badge ${isApproved || isCompleted ? 'admin-badge-success' : (isRejected ? 'admin-badge-danger' : 'admin-badge-warning')}" style="font-weight: 700; font-size: 0.76rem; padding: 3px 10px; border-radius: 6px;">
                            ${ret.status || 'In Review'}
                          </span>

                          <!-- Order Link Chip -->
                          <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(214, 184, 190, 0.2); border-radius: 6px; padding: 3px 10px; font-size: 0.78rem; color: #ECCFD0;">
                            <span style="color: rgba(236,207,208,0.6);">Order:</span>
                            <strong style="color: #FFFFFF;">#${ret.orderId}</strong>
                          </span>
                          
                          <!-- Query Link Chip -->
                          ${ret.queryId ? `
                            <button class="view-linked-query-btn" data-query-id="${ret.queryId}" style="display: inline-flex; align-items: center; gap: 5px; background: rgba(214,184,190,0.12); border: 1px solid rgba(214,184,190,0.3); border-radius: 6px; color: #ECCFD0; font-size: 0.76rem; font-weight: 600; padding: 3px 10px; cursor: pointer; transition: all 0.2s;" title="View associated customer inquiry ticket">
                              <span>Ticket #${ret.queryId}</span>
                              <span style="color: #D6B8BE;">&rarr;</span>
                            </button>
                          ` : ''}
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 14px;">
                          <span style="font-size: 0.76rem; color: rgba(236, 207, 208, 0.65);">${formatDateDDMMYYYY(ret.date) || 'Today'}</span>
                          <strong style="color: #4EEDA0; font-family: var(--font-brand, serif); font-size: 1.25rem; letter-spacing: 0.5px;">₹${Number(ret.amount || 0).toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      <!-- Essential Information Grid: 3 Clean Structured Tiles -->
                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 16px;">
                        
                        <!-- Tile 1: Product Involved -->
                        <div style="background: rgba(0, 0, 0, 0.28); border: 1px solid rgba(214, 184, 190, 0.18); border-radius: 10px; padding: 12px 14px;">
                          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.07em; color: rgba(236, 207, 208, 0.6); font-weight: 700; margin-bottom: 4px;">
                            Product Involved
                          </div>
                          <div style="color: #FFFFFF; font-size: 0.88rem; font-weight: 600; line-height: 1.35;">
                            ${ret.productName || 'Jewelry Piece'}
                          </div>
                        </div>

                        <!-- Tile 2: Customer Contact -->
                        <div style="background: rgba(0, 0, 0, 0.28); border: 1px solid rgba(214, 184, 190, 0.18); border-radius: 10px; padding: 12px 14px;">
                          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.07em; color: rgba(236, 207, 208, 0.6); font-weight: 700; margin-bottom: 4px;">
                            Patron Details
                          </div>
                          <div style="color: #FFFFFF; font-size: 0.88rem; font-weight: 600;">
                            ${ret.customerName}
                          </div>
                          <div style="font-size: 0.74rem; color: rgba(236, 207, 208, 0.7); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${ret.email || ''} ${ret.phone ? `&bull; ${ret.phone}` : ''}
                          </div>
                        </div>

                        <!-- Tile 3: Reason & Instructions -->
                        <div style="background: rgba(0, 0, 0, 0.28); border: 1px solid rgba(214, 184, 190, 0.18); border-radius: 10px; padding: 12px 14px;">
                          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.07em; color: rgba(236, 207, 208, 0.6); font-weight: 700; margin-bottom: 4px;">
                            Reason & Notes
                          </div>
                          <div style="color: #FFBE53; font-size: 0.84rem; font-weight: 600; line-height: 1.3;">
                            ${ret.reason || 'Customer Resolution'}
                          </div>
                          ${cleanDetails ? `
                            <div style="font-size: 0.74rem; color: rgba(236, 207, 208, 0.85); margin-top: 3px; font-style: italic; line-height: 1.35; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                              ${cleanDetails}
                            </div>
                          ` : ''}
                        </div>

                      </div>

                      <!-- Compact Activity Log & Note Input -->
                      <div style="background: rgba(0, 0, 0, 0.32); border: 1px solid rgba(214, 184, 190, 0.16); border-radius: 10px; padding: 12px 14px; margin-bottom: 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                          <span style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #ECCFD0; font-weight: 700;">
                            Resolution Activity & Dispatch Notes
                          </span>
                          <span style="font-size: 0.7rem; color: rgba(236, 207, 208, 0.5);">${(ret.chat || []).length} update${(ret.chat || []).length === 1 ? '' : 's'}</span>
                        </div>

                        ${(ret.chat || []).map(c => `
                          <div style="font-size: 0.78rem; margin-bottom: 5px; line-height: 1.35; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                            <div>
                              <strong style="color: ${c.sender === 'Customer' ? '#70B8FF' : '#4EEDA0'}; font-size: 0.78rem;">${c.sender}:</strong>
                              <span style="color: rgba(255, 255, 255, 0.95); margin-left: 4px;">${c.text}</span>
                            </div>
                            <span style="font-size: 0.68rem; color: rgba(236, 207, 208, 0.45); white-space: nowrap;">${c.time || ''}</span>
                          </div>
                        `).join('')}

                        <!-- Add Note Input -->
                        <div style="display: flex; gap: 8px; margin-top: 8px; border-top: 1px dashed rgba(214,184,190,0.12); padding-top: 8px;">
                          <input type="text" id="ret-note-input-${ret.id}" placeholder="Add internal or dispatch note..." style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(214,184,190,0.2); border-radius: 6px; padding: 6px 10px; color: #FFF; font-size: 0.76rem;" />
                          <button class="admin-btn admin-btn-outline add-claim-log-btn" data-return-id="${ret.id}" style="padding: 4px 12px; font-size: 0.72rem; border-radius: 6px;">
                            Log Note
                          </button>
                        </div>
                      </div>

                      <!-- Action Footer -->
                      <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px; flex-wrap: wrap;">
                        ${!isApproved && !isCompleted && !isRejected ? `
                          <button class="admin-btn admin-btn-outline approve-return-btn" data-return-id="${ret.id}" style="border-color: #4EEDA0; color: #4EEDA0; padding: 7px 16px; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>${claimType === 'Refund' ? 'Approve & Process Refund' : 'Approve & Schedule Reverse Pickup'}</span>
                          </button>
                        ` : ''}

                        ${isApproved && !isCompleted ? `
                          <button class="admin-btn admin-btn-primary complete-return-btn" data-return-id="${ret.id}" style="background: linear-gradient(135deg, #10B981 0%, #047857 100%); border-color: #34D399; padding: 7px 18px; font-size: 0.8rem; font-weight: 700; border-radius: 8px;">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>Mark Completed</span>
                          </button>
                        ` : ''}

                        ${!isRejected && !isCompleted ? `
                          <button class="admin-btn admin-btn-danger reject-return-btn" data-return-id="${ret.id}" style="padding: 7px 16px; font-size: 0.8rem; border-radius: 8px;">
                            Reject Claim
                          </button>
                        ` : ''}

                        ${isCompleted || isRejected ? `
                          <button class="admin-btn admin-btn-danger delete-claim-btn" data-return-id="${ret.id}" style="padding: 6px 14px; font-size: 0.76rem; border-radius: 8px; opacity: 0.85;" title="Remove processed claim from active list">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            <span>Delete Record</span>
                          </button>
                        ` : ''}
                      </div>
                    </div>
                  `;
        }).join('');
      })()}
            </div>
          ` : ''}

          <!-- ========================================== -->
          <!-- 5. PRODUCT CATALOG & ADD PRODUCT SECTION   -->
          <!-- ========================================== -->
          ${activeAdminSection === 'products' ? `
            <div class="admin-panel-card">
              <div class="admin-panel-head" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
                <div>
                  <h3 style="font-family: var(--font-brand, serif); font-size: 1.3rem; margin: 0; color: #FFFFFF;">
                    Product Catalog & Live Website Inventory (<span id="admin-products-count-header">${products.length}</span>)
                  </h3>
                </div>
                <button class="admin-btn admin-btn-primary" id="btn-open-add-product-modal-2" style="margin-left: auto;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  <span>Add New Product</span>
                </button>
              </div>

              <div id="admin-products-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 18px;">
                ${renderAdminProductCards(products)}
              </div>
            </div>
          ` : ''}

          <!-- ========================================== -->
          <!-- 6. USER REGISTRY SECTION                   -->
          <!-- ========================================== -->
          ${activeAdminSection === 'users' ? `
            <div class="admin-panel-card">
              <div class="admin-panel-head">
                <div>
                  <h3 style="font-family: var(--font-brand, serif); font-size: 1.3rem; margin: 0; color: #FFFFFF;">
                    Patron & User Accounts (${registeredUsers.length})
                  </h3>
                  <p style="font-size: 0.8rem; color: #ECCFD0; margin: 4px 0 0 0;">
                    Registered customer profiles, purchase history, lifetime value & access controls
                  </p>
                </div>
              </div>

              ${registeredUsers.map(u => {
        const userOrders = orders.filter(o => {
          const oEmail = (o.email || (o.shippingAddress && o.shippingAddress.email) || '').toLowerCase();
          const oName = (o.customerName || o.customer || (o.shippingAddress && o.shippingAddress.fullName) || '').toLowerCase();
          return (oEmail && oEmail === (u.email || '').toLowerCase()) || (oName && oName === (u.name || '').toLowerCase());
        });
        const liveSpend = userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        const totalSpent = liveSpend;
        const totalOrdersCount = userOrders.length;
        const isBlocked = u.status === 'blocked';

        return `
                  <div class="admin-user-card" style="background: linear-gradient(155deg, rgba(38, 9, 21, 0.95) 0%, rgba(18, 2, 9, 0.98) 100%); border: 1.5px solid ${isBlocked ? 'rgba(230, 57, 70, 0.55)' : 'rgba(214, 184, 190, 0.2)'}; border-radius: 16px; padding: 18px 22px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45); transition: all 0.2s ease;">
                    <!-- User Details -->
                    <div style="display: flex; align-items: center; gap: 14px; min-width: 280px; flex: 1;">
                      <div style="width: 48px; height: 48px; border-radius: 50%; background: ${isBlocked ? 'linear-gradient(145deg, #E63946 0%, #8A1538 100%)' : 'linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%)'}; color: ${isBlocked ? '#FFFFFF' : '#24040E'}; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; box-shadow: 0 4px 14px rgba(0,0,0,0.35);">
                        ${(u.name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div style="min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                          <strong style="color: #FFFFFF; font-size: 1.02rem;">${u.name}</strong>
                          <span style="font-family: monospace; font-size: 0.74rem; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(214, 184, 190, 0.25); color: #ECCFD0; padding: 2px 8px; border-radius: 6px; font-weight: 700;">
                            ${u.id}
                          </span>
                          <span class="admin-badge ${isBlocked ? 'admin-badge-danger' : 'admin-badge-success'}" style="font-size: 0.7rem; font-weight: 800; padding: 2px 9px;">
                            ${isBlocked ? '🚫 Blocked' : '● Active'}
                          </span>
                        </div>
                        <div style="font-size: 0.81rem; color: #ECCFD0; margin-top: 4px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                          <span>✉️ <strong>${u.email}</strong></span>
                          <span>📞 <strong>${u.phone || 'Phone on file'}</strong></span>
                          <span style="opacity: 0.85;">📍 ${u.city || 'Delhi'}</span>
                          <span style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(214, 184, 190, 0.2); border-radius: 6px; padding: 2px 8px; font-size: 0.74rem; color: #ECCFD0;">
                            🗓️ On Valeora since: <strong>${u.memberSince || '2026'}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Spend Analytics & Block Action -->
                    <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                      <!-- Total Amount Spent -->
                      <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(214, 184, 190, 0.2); border-radius: 12px; padding: 8px 16px; text-align: right; min-width: 140px;">
                        <div style="font-size: 0.7rem; color: rgba(236, 207, 208, 0.75); text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Total Amount Spent</div>
                        <div style="font-family: var(--font-brand, serif); font-size: 1.2rem; font-weight: 800; color: #4EEDA0; margin-top: 1px;">
                          ₹${totalSpent.toLocaleString('en-IN')}
                        </div>
                        <div style="font-size: 0.7rem; color: #ECCFD0; opacity: 0.85;">${totalOrdersCount} order${totalOrdersCount > 1 ? 's' : ''} purchased</div>
                      </div>

                      <!-- Block / Unblock Toggle Action -->
                      <div>
                        <button class="admin-btn toggle-user-block-btn ${isBlocked ? 'admin-btn-outline' : 'admin-btn-danger'}" data-user-id="${u.id}" style="padding: 8px 16px; font-size: 0.78rem; font-weight: 700; border-radius: 10px; ${isBlocked ? 'border-color: #4EEDA0; color: #4EEDA0;' : ''}" title="${isBlocked ? 'Restore user access' : 'Restrict and block user account'}">
                          ${isBlocked ? `
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            <span>Unblock User</span>
                          ` : `
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                            <span>Block User</span>
                          `}
                        </button>
                      </div>
                    </div>
                  </div>
                `;
      }).join('')}
            </div>
          ` : ''}

          <!-- ========================================== -->
          <!-- 7. COUPONS & PROMOS STUDIO SECTION         -->
          <!-- ========================================== -->
          ${activeAdminSection === 'coupons' ? `
            <div class="admin-panel-card">
              <div class="admin-panel-head" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 20px;">
                <div>
                  <h3 style="font-family: var(--font-brand, serif); font-size: 1.3rem; margin: 0; color: #FFFFFF;">
                    Coupons & Promotional Studio (${(state.coupons || []).length})
                  </h3>
                  <p style="font-size: 0.8rem; color: #ECCFD0; margin: 4px 0 0 0;">
                    Manage percentage discounts, minimum cart spend eligibility, and live store promotions
                  </p>
                </div>

                <div>
                  <button id="btn-open-create-coupon-modal" class="admin-btn admin-btn-primary" style="padding: 8px 18px; font-size: 0.82rem; box-shadow: 0 4px 14px rgba(138, 21, 56, 0.5);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>Create New Coupon</span>
                  </button>
                </div>
              </div>

              <!-- Quick Promo Insights Bar -->
              <div class="admin-finance-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px;">
                <div class="admin-fin-card" style="background: rgba(0,0,0,0.35); border: 1.5px solid rgba(214,184,190,0.22); border-radius: 14px; padding: 14px 16px;">
                  <div style="font-size: 0.72rem; text-transform: uppercase; color: rgba(236,207,208,0.7); font-weight: 700; letter-spacing: 0.05em;">Active Promos</div>
                  <h4 style="font-family: var(--font-brand, serif); font-size: 1.4rem; color: #4EEDA0; margin: 4px 0 0 0;">
                    ${(state.coupons || []).filter(c => c.active).length}
                  </h4>
                  <div style="font-size: 0.72rem; color: #ECCFD0; opacity: 0.8; margin-top: 2px;">Live in customer carts</div>
                </div>

                <div class="admin-fin-card" style="background: rgba(0,0,0,0.35); border: 1.5px solid rgba(214,184,190,0.22); border-radius: 14px; padding: 14px 16px;">
                  <div style="font-size: 0.72rem; text-transform: uppercase; color: rgba(236,207,208,0.7); font-weight: 700; letter-spacing: 0.05em;">Max Discount</div>
                  <h4 style="font-family: var(--font-brand, serif); font-size: 1.4rem; color: #FFBE53; margin: 4px 0 0 0;">
                    ${(state.coupons || []).length > 0 ? Math.max(...(state.coupons || []).map(c => Number(c.discountPercent) || 0)) : 0}% OFF
                  </h4>
                  <div style="font-size: 0.72rem; color: #ECCFD0; opacity: 0.8; margin-top: 2px;">Top savings offered</div>
                </div>

                <div class="admin-fin-card" style="background: rgba(0,0,0,0.35); border: 1.5px solid rgba(214,184,190,0.22); border-radius: 14px; padding: 14px 16px;">
                  <div style="font-size: 0.72rem; text-transform: uppercase; color: rgba(236,207,208,0.7); font-weight: 700; letter-spacing: 0.05em;">Total Redemptions</div>
                  <h4 style="font-family: var(--font-brand, serif); font-size: 1.4rem; color: #FFFFFF; margin: 4px 0 0 0;">
                    ${(state.coupons || []).reduce((sum, c) => sum + (Number(c.usesCount) || 0), 0)}
                  </h4>
                  <div style="font-size: 0.72rem; color: #ECCFD0; opacity: 0.8; margin-top: 2px;">All-time orders applied</div>
                </div>

                <div class="admin-fin-card" style="background: rgba(0,0,0,0.35); border: 1.5px solid rgba(214,184,190,0.22); border-radius: 14px; padding: 14px 16px;">
                  <div style="font-size: 0.72rem; text-transform: uppercase; color: rgba(236,207,208,0.7); font-weight: 700; letter-spacing: 0.05em;">Min Cart Criteria</div>
                  <h4 style="font-family: var(--font-brand, serif); font-size: 1.4rem; color: #D6B8BE; margin: 4px 0 0 0;">
                    ₹${(state.coupons || []).length > 0 ? Math.min(...(state.coupons || []).map(c => Number(c.minAmount) || 0)) : 0}+
                  </h4>
                  <div style="font-size: 0.72rem; color: #ECCFD0; opacity: 0.8; margin-top: 2px;">Minimum basket threshold</div>
                </div>
              </div>

              <!-- Coupons List / Grid -->
              ${(state.coupons || []).length === 0 ? `
                <div style="padding: 40px; text-align: center; color: #ECCFD0; background: rgba(0,0,0,0.25); border-radius: 16px; border: 1px dashed rgba(214,184,190,0.2);">
                  <div style="font-size: 2.2rem; margin-bottom: 8px;">🏷️</div>
                  <div style="font-size: 1rem; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">No Promotional Coupons Configured</div>
                  <div style="font-size: 0.82rem; color: rgba(236,207,208,0.7); max-width: 400px; margin: 0 auto 16px auto;">
                    Create coupon codes to offer percentage discounts when customers hit a minimum order threshold.
                  </div>
                  <button class="admin-btn admin-btn-primary" id="btn-empty-create-coupon">
                    + Create First Coupon
                  </button>
                </div>
              ` : `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
                  ${(state.coupons || []).map(cp => {
        const isActive = cp.active !== false;
        const discount = Number(cp.discountPercent) || 0;
        const minAmount = Number(cp.minAmount) || 0;

        return `
                      <div class="admin-coupon-card" style="background: linear-gradient(155deg, rgba(38, 9, 21, 0.95) 0%, rgba(18, 2, 9, 0.98) 100%); border: 1.5px solid ${isActive ? 'rgba(214, 184, 190, 0.25)' : 'rgba(230, 57, 70, 0.25)'}; border-radius: 18px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.45); transition: all 0.2s ease;">
                        
                        <div>
                          <!-- Top Row: Code Pill + Discount & Status Badge -->
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 10px; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                              <div style="font-family: monospace; font-size: 1.05rem; font-weight: 800; color: #FFFFFF; background: rgba(214,184,190,0.14); border: 1.5px dashed rgba(214,184,190,0.4); padding: 5px 12px; border-radius: 8px; letter-spacing: 0.08em; display: inline-flex; align-items: center; gap: 6px;">
                                <span>${cp.code}</span>
                              </div>
                              <button class="copy-coupon-code-btn" data-code="${cp.code}" style="background: transparent; border: none; color: #ECCFD0; cursor: pointer; padding: 4px; border-radius: 4px; display: inline-flex;" title="Copy Code">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              </button>
                            </div>

                            <div style="display: flex; align-items: center; gap: 6px;">
                              <span style="background: rgba(78, 237, 160, 0.15); border: 1px solid rgba(78, 237, 160, 0.35); color: #4EEDA0; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 6px;">
                                ${discount}% OFF
                              </span>
                              <span class="admin-badge ${isActive ? 'admin-badge-success' : 'admin-badge-danger'}" style="font-size: 0.72rem; font-weight: 700; padding: 3px 8px;">
                                ${isActive ? 'Active' : 'Paused'}
                              </span>
                            </div>
                          </div>

                          <!-- Description & Condition Details -->
                          <div style="color: #ECCFD0; font-size: 0.84rem; line-height: 1.4; margin-bottom: 12px;">
                            ${cp.description || `${discount}% discount on eligible orders.`}
                          </div>

                          <!-- Key Criterion Badges -->
                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: rgba(0,0,0,0.28); border: 1px solid rgba(214,184,190,0.15); border-radius: 10px; padding: 10px 12px;">
                            <div>
                              <div style="font-size: 0.68rem; text-transform: uppercase; color: rgba(236,207,208,0.6); font-weight: 700; letter-spacing: 0.05em;">Min Cart Value</div>
                              <div style="color: #FFFFFF; font-weight: 700; font-size: 0.88rem; margin-top: 2px;">
                                ₹${minAmount.toLocaleString('en-IN')}
                              </div>
                            </div>
                            <div>
                              <div style="font-size: 0.68rem; text-transform: uppercase; color: rgba(236,207,208,0.6); font-weight: 700; letter-spacing: 0.05em;">Redemptions</div>
                              <div style="color: #FFBE53; font-weight: 700; font-size: 0.88rem; margin-top: 2px;">
                                ${cp.usesCount || 0} used
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Footer Actions -->
                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(214,184,190,0.14); padding-top: 12px; gap: 8px;">
                          <button class="admin-btn ${isActive ? 'admin-btn-outline' : 'admin-btn-primary'} toggle-coupon-btn" data-coupon-id="${cp.id}" style="padding: 6px 12px; font-size: 0.76rem;" title="${isActive ? 'Pause coupon' : 'Activate coupon'}">
                            ${isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                          </button>

                          <div style="display: flex; gap: 6px;">
                            <button class="admin-btn admin-btn-outline edit-coupon-btn" data-coupon-id="${cp.id}" style="padding: 6px 12px; font-size: 0.76rem;" title="Edit coupon criteria">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                              Edit
                            </button>
                            <button class="admin-btn admin-btn-danger delete-coupon-btn" data-coupon-id="${cp.id}" style="padding: 6px 10px; font-size: 0.76rem;" title="Delete this coupon">
                              Delete
                            </button>
                          </div>
                        </div>

                      </div>
                    `;
      }).join('')}
                </div>
              `}
            </div>
          ` : ''}

        </div>
      </main>

      <!-- ========================================== -->
      <!-- ADD / EDIT PRODUCT MODAL (MULTI-IMAGE GALLERY STUDIO) -->
      <!-- ========================================== -->
      <div id="admin-add-product-modal-container" style="${isAddProductModalOpen ? 'display:flex;' : 'display:none;'}">
        <div class="admin-modal-overlay" id="admin-add-modal-overlay" style="padding: 12px;">
          <div class="admin-modal-dialog" style="max-width: 660px; width: 100%; max-height: 92vh; overflow-y: auto; padding: 20px 24px; border-radius: 20px; box-shadow: 0 24px 70px rgba(0, 0, 0, 0.9);">
            <button id="close-add-product-modal" style="position: absolute; top: 16px; right: 18px; background: transparent; border: none; color: #ECCFD0; font-size: 1.5rem; cursor: pointer; line-height: 1;">&times;</button>
            
            <div style="margin-bottom: 12px; border-bottom: 1px solid rgba(214,184,190,0.18); padding-bottom: 8px;">
              <h3 id="modal-product-title" style="font-family: var(--font-brand, serif); font-size: 1.3rem; color: #FFFFFF; margin: 0 0 2px 0;">
                Add New Jewelry Product
              </h3>
              <p id="modal-product-subtitle" style="font-size: 0.78rem; color: rgba(236, 207, 208, 0.75); margin: 0;">
                Enter details and add up to 4 high-res photos to publish live across the store.
              </p>
            </div>

            <form id="admin-add-product-form" style="margin: 0;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px;">
                <!-- Product Title -->
                <div class="admin-form-group" style="grid-column: span 2; margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Product Title / Name *</label>
                  <input type="text" id="np-name" class="admin-input-field" style="padding: 7px 12px; font-size: 0.83rem;" placeholder="e.g. Royal Emerald Crystal Choker" required />
                </div>

                <!-- Category: For Her, For Him, For All only -->
                <div class="admin-form-group" style="margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Category *</label>
                  <select id="np-category" class="admin-input-field" style="padding: 7px 12px; font-size: 0.83rem; cursor: pointer;" required>
                    <option value="For Her">For Her (Women)</option>
                    <option value="For Him">For Him (Men)</option>
                    <option value="For All">For All (Unisex)</option>
                  </select>
                </div>

                <!-- Subcategory Dropdown: Dynamic based on Category -->
                <div class="admin-form-group" style="margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Subcategory *</label>
                  <select id="np-subcategory" class="admin-input-field" style="padding: 7px 12px; font-size: 0.83rem; cursor: pointer;" required>
                    <option value="Necklace">Necklace</option>
                    <option value="Rings">Rings</option>
                    <option value="Pendant">Pendant</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                  </select>
                </div>

                <!-- Badge / Ribbon Label -->
                <div class="admin-form-group" style="margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Badge / Ribbon Label</label>
                  <select id="np-badge" class="admin-input-field" style="padding: 7px 12px; font-size: 0.83rem; cursor: pointer;">
                    <option value="New Arrival">New Arrival</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Trending">Trending</option>
                    <option value="Popular Pick">Popular Pick</option>
                    <option value="Special Edition">Special Edition</option>
                  </select>
                </div>

                <!-- Single Product Price -->
                <div class="admin-form-group" style="margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Product Price (₹) *</label>
                  <input type="number" id="np-price" class="admin-input-field" style="padding: 7px 12px; font-size: 0.83rem;" placeholder="e.g. 18500" min="1" required />
                </div>

                <!-- Stock Quantity -->
                <div class="admin-form-group" style="margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Stock Quantity *</label>
                  <input type="number" id="np-stock" class="admin-input-field" style="padding: 7px 12px; font-size: 0.83rem;" placeholder="e.g. 25" min="0" required />
                </div>

                <!-- Multi-image Slot Studio (Up to 4 Images) -->
                <div class="admin-form-group" style="grid-column: span 2; margin-bottom: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <label style="font-size: 0.76rem; margin: 0;">Product Gallery Photos (Upload up to 4 images) *</label>
                    <span style="font-size: 0.7rem; color: rgba(236, 207, 208, 0.75);">Photo 1 is the main cover image</span>
                  </div>

                  <div class="admin-gallery-slots-grid">
                    <!-- Slot 0 (Main) -->
                    <div class="admin-gallery-slot" id="np-slot-container-0" data-slot-index="0" title="Click or drop Photo 1 (Cover)">
                      <span class="admin-slot-badge">Photo 1 (Cover)</span>
                      <input type="hidden" id="np-image-data-0" value="" />
                      <input type="file" id="np-file-input-0" accept="image/*" style="display: none;" />
                      <img id="np-slot-preview-0" src="" class="admin-slot-preview-img" style="display: none;" alt="Photo 1" />
                      <div id="np-slot-empty-0" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <span style="font-size: 0.68rem; color: #ECCFD0;">+ Main Photo</span>
                      </div>
                      <button type="button" class="admin-slot-remove-btn" id="np-slot-remove-0" title="Remove image" style="display: none;">&times;</button>
                    </div>

                    <!-- Slot 1 -->
                    <div class="admin-gallery-slot" id="np-slot-container-1" data-slot-index="1" title="Click or drop Photo 2">
                      <span class="admin-slot-badge">Photo 2</span>
                      <input type="hidden" id="np-image-data-1" value="" />
                      <input type="file" id="np-file-input-1" accept="image/*" style="display: none;" />
                      <img id="np-slot-preview-1" src="" class="admin-slot-preview-img" style="display: none;" alt="Photo 2" />
                      <div id="np-slot-empty-1" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <span style="font-size: 0.68rem; color: #ECCFD0;">+ Photo 2</span>
                      </div>
                      <button type="button" class="admin-slot-remove-btn" id="np-slot-remove-1" title="Remove image" style="display: none;">&times;</button>
                    </div>

                    <!-- Slot 2 -->
                    <div class="admin-gallery-slot" id="np-slot-container-2" data-slot-index="2" title="Click or drop Photo 3">
                      <span class="admin-slot-badge">Photo 3</span>
                      <input type="hidden" id="np-image-data-2" value="" />
                      <input type="file" id="np-file-input-2" accept="image/*" style="display: none;" />
                      <img id="np-slot-preview-2" src="" class="admin-slot-preview-img" style="display: none;" alt="Photo 3" />
                      <div id="np-slot-empty-2" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <span style="font-size: 0.68rem; color: #ECCFD0;">+ Photo 3</span>
                      </div>
                      <button type="button" class="admin-slot-remove-btn" id="np-slot-remove-2" title="Remove image" style="display: none;">&times;</button>
                    </div>

                    <!-- Slot 3 -->
                    <div class="admin-gallery-slot" id="np-slot-container-3" data-slot-index="3" title="Click or drop Photo 4">
                      <span class="admin-slot-badge">Photo 4</span>
                      <input type="hidden" id="np-image-data-3" value="" />
                      <input type="file" id="np-file-input-3" accept="image/*" style="display: none;" />
                      <img id="np-slot-preview-3" src="" class="admin-slot-preview-img" style="display: none;" alt="Photo 4" />
                      <div id="np-slot-empty-3" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <span style="font-size: 0.68rem; color: #ECCFD0;">+ Photo 4</span>
                      </div>
                      <button type="button" class="admin-slot-remove-btn" id="np-slot-remove-3" title="Remove image" style="display: none;">&times;</button>
                    </div>
                  </div>
                </div>

                <!-- Product Description -->
                <div class="admin-form-group" style="grid-column: span 2; margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Description *</label>
                  <input type="text" id="np-description" class="admin-input-field" style="padding: 7px 12px; font-size: 0.83rem;" placeholder="e.g. Handcrafted royal emerald choker with sparkling ruby crystals." required />
                </div>


              </div>

              <!-- Submit Buttons -->
              <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; border-top: 1px solid rgba(214, 184, 190, 0.18); padding-top: 12px;">
                <button type="button" id="btn-cancel-add-product" class="admin-btn admin-btn-outline" style="padding: 7px 16px; font-size: 0.82rem;">Cancel</button>
                <button type="submit" id="btn-submit-product-form" class="admin-btn admin-btn-primary" style="padding: 7px 22px; font-size: 0.82rem;">Publish Product to Website</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- INITIATE CLAIM MODAL (RETURN / EXCHANGE / REFUND) -->
      <!-- ========================================== -->
      <div id="admin-initiate-claim-modal-container" style="${isInitiateClaimModalOpen ? 'display:flex;' : 'display:none;'}">
        <div class="admin-modal-overlay" id="admin-claim-modal-overlay">
          <div class="admin-modal-dialog admin-modal-scrollable" style="max-width: 680px; max-height: 90vh; overflow-y: auto;">
            <button id="close-initiate-claim-modal" style="position: absolute; top: 18px; right: 20px; background: transparent; border: none; color: #ECCFD0; font-size: 1.5rem; cursor: pointer;">&times;</button>
            
            <div style="margin-bottom: 18px; border-bottom: 1px solid rgba(214,184,190,0.18); padding-bottom: 14px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                <h3 style="font-family: var(--font-brand, serif); font-size: 1.35rem; color: #FFFFFF; margin: 0;">
                  Initiate Resolution Claim
                </h3>
                <span id="claim-modal-type-badge" class="admin-badge admin-badge-warning" style="font-size: 0.75rem; font-weight: 800; padding: 3px 10px;">
                  🔄 Initiate Return
                </span>
                <span id="claim-modal-ticket-ref" style="font-family: monospace; font-size: 0.75rem; color: #ECCFD0; background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 6px;">
                  ${claimModalData.queryId ? `From Inquiry #${claimModalData.queryId}` : 'Direct Action'}
                </span>
              </div>
              <p style="font-size: 0.8rem; color: rgba(236, 207, 208, 0.8); margin: 0;">
                Log an official customer claim, schedule resolution, and automatically dispatch a response message to their ticket.
              </p>
            </div>

            <!-- Resolution Type Selector -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px;">
              <button type="button" class="claim-type-selector-btn" data-type="Return" style="padding: 10px; border-radius: 12px; border: 1.5px solid ${claimModalData.type === 'Return' ? '#F39C12' : 'rgba(214,184,190,0.25)'}; background: ${claimModalData.type === 'Return' ? 'rgba(243, 156, 18, 0.28)' : 'rgba(255,255,255,0.05)'}; color: ${claimModalData.type === 'Return' ? '#FFBE53' : '#ECCFD0'}; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s ease;">
                <span>🔄</span> Return
              </button>
              <button type="button" class="claim-type-selector-btn" data-type="Exchange" style="padding: 10px; border-radius: 12px; border: 1.5px solid ${claimModalData.type === 'Exchange' ? '#A855F7' : 'rgba(214,184,190,0.25)'}; background: ${claimModalData.type === 'Exchange' ? 'rgba(155, 93, 229, 0.28)' : 'rgba(255,255,255,0.05)'}; color: ${claimModalData.type === 'Exchange' ? '#D4A5FF' : '#ECCFD0'}; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s ease;">
                <span>🔁</span> Exchange
              </button>
              <button type="button" class="claim-type-selector-btn" data-type="Refund" style="padding: 10px; border-radius: 12px; border: 1.5px solid ${claimModalData.type === 'Refund' ? '#2ECC71' : 'rgba(214,184,190,0.25)'}; background: ${claimModalData.type === 'Refund' ? 'rgba(46, 204, 113, 0.28)' : 'rgba(255,255,255,0.05)'}; color: ${claimModalData.type === 'Refund' ? '#4EEDA0' : '#ECCFD0'}; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s ease;">
                <span>💰</span> Refund
              </button>
            </div>

            <form id="admin-initiate-claim-form">
              <div class="admin-form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                
                <!-- Associated Order ID -->
                <div class="admin-form-group">
                  <label>Associated Order Reference *</label>
                  <select id="claim-order-id" class="admin-input-field" style="cursor: pointer;" required>
                    ${orders.length > 0 ? orders.map(o => `
                      <option value="${o.id}" ${claimModalData.orderId === o.id ? 'selected' : ''}>#${o.id} - ${o.customerName || o.customer || (o.shippingAddress && o.shippingAddress.fullName) || 'Patron'} (₹${o.total})</option>
                    `).join('') : '<option value="">No active orders found</option>'}
                  </select>
                </div>

                <!-- Product Selection -->
                <div class="admin-form-group">
                  <label>Product Involved *</label>
                  <select id="claim-product-name" class="admin-input-field" style="cursor: pointer;" required>
                    ${products.map(p => `
                      <option value="${p.name}" data-product-id="${p.id}" data-price="${p.price}" ${claimModalData.productName === p.name ? 'selected' : ''}>${p.name} - ₹${p.price}</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Customer Name -->
                <div class="admin-form-group">
                  <label>Customer Name *</label>
                  <input type="text" id="claim-customer-name" class="admin-input-field" value="${claimModalData.customerName || ''}" placeholder="Customer Full Name" required />
                </div>

                <!-- Customer Email / Phone -->
                <div class="admin-form-group">
                  <label>Customer Email & Contact *</label>
                  <input type="text" id="claim-customer-contact" class="admin-input-field" value="${claimModalData.email ? `${claimModalData.email} | ${claimModalData.phone || ''}` : ''}" placeholder="email | phone" required />
                </div>

                  <!-- Claim / Refund Amount -->
                  <div class="admin-form-group">
                    <label>Claim / Refund Value (₹) *</label>
                    <input type="number" id="claim-amount" class="admin-input-field" value="${claimModalData.amount || 599}" min="0" required />
                  </div>

                  <!-- Reason / Category -->
                  <div class="admin-form-group">
                    <label>Reason Category *</label>
                    <select id="claim-reason" class="admin-input-field" style="cursor: pointer;" required>
                      <option value="Ring / Choker Fitment Sizing Adjustment">Ring / Choker Fitment Sizing Adjustment</option>
                      <option value="Quality Inspection / Defective Clasp">Quality Inspection / Defective Clasp</option>
                      <option value="Patron Return - 7-Day Window">Patron Return - 7-Day Window</option>
                      <option value="Damaged in Transit">Damaged in Transit</option>
                      <option value="Exchange for Alternate Jewelry Design">Exchange for Alternate Jewelry Design</option>
                      <option value="Order Cancellation & Full Refund">Order Cancellation & Full Refund</option>
                    </select>
                  </div>

                  <!-- Resolution Notes -->
                  <div class="admin-form-group" style="grid-column: span 2;">
                    <label>Claim Details / Artisan Instructions</label>
                    <textarea id="claim-details" class="admin-input-field" rows="2" placeholder="e.g. Reverse courier pickup from Delhi atelier scheduled. Complimentary clasp extension." style="resize: vertical;">${claimModalData.details || ''}</textarea>
                  </div>

                  <!-- Auto-Send Response to Customer Query Checkbox -->
                  <div class="admin-form-group" style="grid-column: span 2; background: rgba(0,0,0,0.35); border: 1px solid rgba(214,184,190,0.22); border-radius: 12px; padding: 14px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #4EEDA0; font-weight: 700; margin-bottom: 10px; user-select: none;">
                      <input type="checkbox" id="claim-auto-reply" checked style="width: 16px; height: 16px; accent-color: #4EEDA0; cursor: pointer;" />
                      <span id="claim-auto-reply-label">Auto-dispatch resolution response to Customer Ticket #${claimModalData.queryId || ''}</span>
                    </label>
                    <textarea id="claim-reply-draft" class="admin-input-field" rows="3" placeholder="Resolution message that will be sent to the patron's account..." style="resize: vertical;">${claimModalData.draftResponse || ''}</textarea>
                  </div>
                </div>
              </div>

              <!-- Sticky Action Footer -->
              <div style="flex-shrink: 0; padding: 16px 28px; border-top: 1px solid rgba(214,184,190,0.18); background: rgba(18, 2, 9, 0.98); display: flex; justify-content: flex-end; align-items: center; gap: 12px;">
                <button type="button" class="admin-btn admin-btn-outline" id="btn-cancel-initiate-claim" style="padding: 10px 20px; font-weight: 600; border-radius: 10px;">
                  Cancel
                </button>
                <button type="submit" id="btn-submit-initiate-claim" class="admin-btn admin-btn-primary" style="padding: 10px 26px; font-weight: 700; border-radius: 10px; box-shadow: 0 4px 15px rgba(214,184,190,0.25);">
                  Confirm & Initiate Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- CREATE / EDIT COUPON MODAL                 -->
      <!-- ========================================== -->
      <div id="admin-coupon-modal-container" style="${isCouponModalOpen ? 'display:flex;' : 'display:none;'}">
        <div class="admin-modal-overlay" id="admin-coupon-modal-overlay" style="padding: 12px;">
          <div class="admin-modal-dialog" style="max-width: 580px; width: 100%; padding: 22px 26px; border-radius: 20px; overflow: hidden; box-shadow: 0 24px 70px rgba(0, 0, 0, 0.9);">
            <button id="close-coupon-modal" style="position: absolute; top: 16px; right: 18px; background: transparent; border: none; color: #ECCFD0; font-size: 1.5rem; cursor: pointer; line-height: 1;">&times;</button>
            
            <div style="margin-bottom: 16px; border-bottom: 1px solid rgba(214,184,190,0.18); padding-bottom: 10px;">
              <h3 id="modal-coupon-title" style="font-family: var(--font-brand, serif); font-size: 1.3rem; color: #FFFFFF; margin: 0 0 3px 0;">
                ${editingCouponId ? 'Edit Promotional Coupon' : 'Create New Promotional Coupon'}
              </h3>
              <p style="font-size: 0.78rem; color: rgba(236, 207, 208, 0.75); margin: 0;">
                Define coupon code name, percentage discount, and cart minimum amount.
              </p>
            </div>

            <form id="admin-coupon-form" style="margin: 0;">
              <input type="hidden" id="cp-id" value="${couponModalData.id || ''}" />
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px 14px;">
                <!-- Coupon Code Name -->
                <div class="admin-form-group" style="grid-column: span 2; margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Coupon Code (e.g. VALEORA20) *</label>
                  <input type="text" id="cp-code" class="admin-input-field" style="padding: 9px 12px; font-size: 0.88rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;" placeholder="e.g. ROYAL25" value="${couponModalData.code || ''}" required />
                </div>

                <!-- Discount Percentage -->
                <div class="admin-form-group" style="margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Discount Percentage (%) *</label>
                  <input type="number" id="cp-discount" class="admin-input-field" style="padding: 9px 12px; font-size: 0.88rem;" min="1" max="90" placeholder="e.g. 20" value="${couponModalData.discountPercent || 20}" required />
                </div>

                <!-- Minimum Order Cart Amount -->
                <div class="admin-form-group" style="margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Minimum Cart Value (₹) *</label>
                  <input type="number" id="cp-min-amount" class="admin-input-field" style="padding: 9px 12px; font-size: 0.88rem;" min="0" placeholder="e.g. 999" value="${couponModalData.minAmount || 499}" required />
                </div>

                <!-- Description / Conditions -->
                <div class="admin-form-group" style="grid-column: span 2; margin-bottom: 0;">
                  <label style="font-size: 0.76rem; margin-bottom: 3px;">Promotional Description *</label>
                  <input type="text" id="cp-description" class="admin-input-field" style="padding: 9px 12px; font-size: 0.85rem;" placeholder="e.g. Get 20% OFF on grand orders above ₹999" value="${couponModalData.description || ''}" required />
                </div>

                <!-- Active Status Checkbox -->
                <div class="admin-form-group" style="grid-column: span 2; margin-bottom: 0; background: rgba(0,0,0,0.25); border: 1px solid rgba(214,184,190,0.18); border-radius: 10px; padding: 10px 14px;">
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #FFFFFF; font-size: 0.82rem; margin: 0; user-select: none;">
                    <input type="checkbox" id="cp-active" ${couponModalData.isActive !== false ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: #4EEDA0; cursor: pointer;" />
                    <span>Enable and activate this coupon immediately on the storefront</span>
                  </label>
                </div>
              </div>

              <!-- Submit Buttons -->
              <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; border-top: 1px solid rgba(214, 184, 190, 0.18); padding-top: 14px;">
                <button type="button" id="btn-cancel-coupon" class="admin-btn admin-btn-outline" style="padding: 8px 16px; font-size: 0.82rem;">Cancel</button>
                <button type="submit" id="btn-submit-coupon" class="admin-btn admin-btn-primary" style="padding: 8px 22px; font-size: 0.82rem;">
                  ${editingCouponId ? 'Save Coupon Changes' : 'Publish & Launch Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  `;
}

export function bindAdminPageEvents() {
  // Sidebar navigation switching
  const navBtns = document.querySelectorAll('.admin-nav-item, [data-nav-target]');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav-target');
      if (target) {
        activeAdminSection = target;
        try { sessionStorage.setItem('valeora_active_admin_section', target); } catch (e) { }
        state._notify({ route: true });
      }
    });
  });

  // Order status filter tabs
  const orderFilterBtns = document.querySelectorAll('[data-order-filter]');
  orderFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-order-filter');
      if (filter) {
        activeOrderFilter = filter;
        state._notify({ route: true });
      }
    });
  });

  // Return status / type filter tabs
  const returnFilterBtns = document.querySelectorAll('[data-return-filter]');
  returnFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-return-filter');
      if (filter) {
        activeReturnFilter = filter;
        state._notify({ route: true });
      }
    });
  });

  // Modal Dialog Elements - Add Product
  const openModalBtn2 = document.getElementById('btn-open-add-product-modal-2');
  const closeModalBtn = document.getElementById('close-add-product-modal');
  const cancelModalBtn = document.getElementById('btn-cancel-add-product');
  const modalContainer = document.getElementById('admin-add-product-modal-container');
  const addForm = document.getElementById('admin-add-product-form');
  const modalTitle = document.getElementById('modal-product-title');
  const modalSubtitle = document.getElementById('modal-product-subtitle');
  const submitBtn = document.getElementById('btn-submit-product-form');

  // Multi-image 4-slot gallery management
  const setGallerySlot = (index, src) => {
    const container = document.getElementById(`np-slot-container-${index}`);
    const dataInput = document.getElementById(`np-image-data-${index}`);
    const previewImg = document.getElementById(`np-slot-preview-${index}`);
    const emptyState = document.getElementById(`np-slot-empty-${index}`);
    const removeBtn = document.getElementById(`np-slot-remove-${index}`);

    if (!container || !dataInput) return;

    if (src && src.trim()) {
      dataInput.value = src;
      if (previewImg) {
        previewImg.src = src;
        previewImg.style.display = 'block';
      }
      if (emptyState) emptyState.style.display = 'none';
      if (removeBtn) removeBtn.style.display = 'flex';
      container.classList.add('has-image');
    } else {
      dataInput.value = '';
      if (previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none';
      }
      if (emptyState) emptyState.style.display = 'flex';
      if (removeBtn) removeBtn.style.display = 'none';
      container.classList.remove('has-image');
    }
  };

  const getGalleryImages = () => {
    const list = [];
    for (let i = 0; i < 4; i++) {
      const val = document.getElementById(`np-image-data-${i}`)?.value?.trim();
      if (val) list.push(val);
    }
    return list;
  };

  // Wire up click, file input change, drag/drop, and remove for all 4 slots
  for (let i = 0; i < 4; i++) {
    const slotContainer = document.getElementById(`np-slot-container-${i}`);
    const fileInput = document.getElementById(`np-file-input-${i}`);
    const removeBtn = document.getElementById(`np-slot-remove-${i}`);

    if (slotContainer && fileInput) {
      slotContainer.addEventListener('click', (e) => {
        if (e.target.closest('.admin-slot-remove-btn')) return;
        fileInput.click();
      });

      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          try {
            showToast('Optimizing image for fast multi-admin synchronization...', 'info');
            const optimized = await optimizeImageFile(file, 1000, 0.8);
            setGallerySlot(i, optimized);
          } catch (err) {
            console.warn('Image optimization fallback:', err);
            const reader = new FileReader();
            reader.onload = (loadEvt) => {
              setGallerySlot(i, loadEvt.target.result);
            };
            reader.readAsDataURL(file);
          }
        }
      });

      slotContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        slotContainer.classList.add('dragover');
      });

      slotContainer.addEventListener('dragleave', () => {
        slotContainer.classList.remove('dragover');
      });

      slotContainer.addEventListener('drop', async (e) => {
        e.preventDefault();
        slotContainer.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const file = e.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            try {
              showToast('Optimizing image for fast multi-admin synchronization...', 'info');
              const optimized = await optimizeImageFile(file, 1000, 0.8);
              setGallerySlot(i, optimized);
            } catch (err) {
              console.warn('Drop image optimization fallback:', err);
              const reader = new FileReader();
              reader.onload = (loadEvt) => {
                setGallerySlot(i, loadEvt.target.result);
              };
              reader.readAsDataURL(file);
            }
          } else {
            showToast('Please drop a valid image file (PNG, JPG, WebP).', 'error');
          }
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setGallerySlot(i, '');
      });
    }
  }

  const updateSubcategoryDropdown = (catVal, selectedSubcat = null) => {
    const subcatSelect = document.getElementById('np-subcategory');
    if (!subcatSelect) return;

    let options = [];
    if (catVal === 'For Him') {
      options = [
        { value: 'Chains', label: 'Chains' },
        { value: 'Hand Chains', label: 'Hand Chains' },
        { value: 'Bracelets', label: 'Bracelets' }
      ];
    } else if (catVal === 'For Her') {
      options = [
        { value: 'Rings', label: 'Rings' },
        { value: 'Necklace', label: 'Necklace' },
        { value: 'Pendant', label: 'Pendant' },
        { value: 'Earrings', label: 'Earrings' },
        { value: 'Bracelets', label: 'Bracelets' }
      ];
    } else {
      options = [
        { value: 'Rings', label: 'Rings' },
        { value: 'Necklace', label: 'Necklace' },
        { value: 'Pendant', label: 'Pendant' },
        { value: 'Earrings', label: 'Earrings' },
        { value: 'Bracelets', label: 'Bracelets' },
        { value: 'Chains', label: 'Chains' },
        { value: 'Hand Chains', label: 'Hand Chains' }
      ];
    }

    subcatSelect.innerHTML = options.map(opt => `
      <option value="${opt.value}" ${selectedSubcat && opt.value.toLowerCase() === selectedSubcat.toLowerCase() ? 'selected' : ''}>
        ${opt.label}
      </option>
    `).join('');

    if (selectedSubcat) {
      const match = Array.from(subcatSelect.options).find(o =>
        o.value.toLowerCase() === selectedSubcat.toLowerCase() ||
        o.value.toLowerCase().includes(selectedSubcat.toLowerCase()) ||
        selectedSubcat.toLowerCase().includes(o.value.toLowerCase())
      );
      if (match) {
        subcatSelect.value = match.value;
      }
    }
  };

  const categorySelectEl = document.getElementById('np-category');
  if (categorySelectEl) {
    categorySelectEl.addEventListener('change', (e) => {
      updateSubcategoryDropdown(e.target.value);
    });
  }

  const openAddModal = () => {
    editingProductId = null;
    if (addForm) addForm.reset();
    if (modalTitle) modalTitle.textContent = 'Add New Jewelry Product';
    if (modalSubtitle) modalSubtitle.textContent = 'Fill in details and add up to 4 photos. Once added, this product will immediately reflect across the entire store!';
    if (submitBtn) submitBtn.textContent = 'Publish Product to Website';

    updateSubcategoryDropdown('For Her', 'Necklace');
    setGallerySlot(0, '');
    setGallerySlot(1, '');
    setGallerySlot(2, '');
    setGallerySlot(3, '');
    isAddProductModalOpen = true;
    if (modalContainer) modalContainer.style.display = 'flex';
  };

  const openEditModal = (productId) => {
    const products = state.products || PRODUCTS;
    const p = products.find(item => item.id === productId);
    if (!p) return;

    editingProductId = productId;
    if (modalTitle) modalTitle.textContent = `Edit Product: ${p.name}`;
    if (modalSubtitle) modalSubtitle.textContent = 'Modify product information, pricing, stock levels, or gallery photos.';
    if (submitBtn) submitBtn.textContent = 'Save Changes';

    // Pre-populate fields
    const nameInput = document.getElementById('np-name');
    const categorySelect = document.getElementById('np-category');
    const priceInput = document.getElementById('np-price');
    const stockInput = document.getElementById('np-stock');
    const badgeSelect = document.getElementById('np-badge');
    const descInput = document.getElementById('np-description');


    if (nameInput) nameInput.value = p.name || '';

    let resolvedCategory = 'For Her';
    if (p.category === 'For Her' || p.category === 'For Him' || p.category === 'For All') {
      resolvedCategory = p.category;
    } else if (p.audience === 'men' || p.audience === 'him') {
      resolvedCategory = 'For Him';
    } else if (p.audience === 'women' || p.audience === 'her') {
      resolvedCategory = 'For Her';
    } else if (p.audience === 'all' || p.audience === 'all-unisex') {
      resolvedCategory = 'For All';
    }

    if (categorySelect) {
      categorySelect.value = resolvedCategory;
    }

    // Pre-populate subcategory
    updateSubcategoryDropdown(resolvedCategory, p.subcategory || p.category || 'Necklace');

    if (priceInput) priceInput.value = p.price || '';
    if (stockInput) stockInput.value = p.stockQty !== undefined ? p.stockQty : 25;
    if (badgeSelect) badgeSelect.value = p.badge || 'New Arrival';

    // Pre-populate 4 gallery slots
    const gImgs = (Array.isArray(p.galleryImages) && p.galleryImages.length > 0)
      ? p.galleryImages.filter(Boolean)
      : (p.image ? [p.image] : []);

    for (let i = 0; i < 4; i++) {
      setGallerySlot(i, gImgs[i] || '');
    }

    if (descInput) descInput.value = p.description || '';


    isAddProductModalOpen = true;
    if (modalContainer) modalContainer.style.display = 'flex';
  };

  openAdminEditModal = openEditModal;
  bindAdminProductCardEvents();

  const closeModal = () => {
    isAddProductModalOpen = false;
    editingProductId = null;
    if (modalContainer) modalContainer.style.display = 'none';
  };

  if (openModalBtn2) openModalBtn2.addEventListener('click', openAddModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  // Add / Edit Product Form Submit
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('np-name')?.value.trim();
      const category = document.getElementById('np-category')?.value || 'For Her';
      const subcategory = document.getElementById('np-subcategory')?.value || 'Necklace';
      const audience = category === 'For Him' ? 'him' : (category === 'For Her' ? 'her' : 'all');
      const price = Number(document.getElementById('np-price')?.value) || 299;
      const originalPrice = price * 2;
      const costPrice = Math.round(price * 0.35);
      const stockQty = Math.max(0, Number(document.getElementById('np-stock')?.value) || 0);
      const badge = document.getElementById('np-badge')?.value || 'New Arrival';
      const galleryImages = getGalleryImages();
      const image = galleryImages[0] || '';
      if (!image) {
        showToast('Please upload at least 1 product image (Photo 1 Cover).', 'error');
        return;
      }
      const description = document.getElementById('np-description')?.value.trim();

      const tagline = `${category} · ${subcategory}`;

      if (!name || !price || !description) {
        showToast('Please complete all required product fields.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.textContent = editingProductId ? 'Saving Changes to Cloud...' : 'Publishing & Syncing Across Admins...';
      }

      try {
        if (editingProductId) {
          await state.updateProduct(editingProductId, {
            name,
            tagline,
            category,
            subcategory,
            audience,
            price,
            originalPrice,
            costPrice,
            stockQty,
            badge,
            image,
            galleryImages,
            description
          });
          showToast(`"${name}" (${subcategory}) updated & synchronized across all admins!`, 'success');
        } else {
          await state.addProduct({
            name,
            tagline,
            category,
            subcategory,
            audience,
            price,
            originalPrice,
            costPrice,
            stockQty,
            badge,
            image,
            galleryImages,
            description
          });
          showToast(`"${name}" published! Live on website & synchronized across all admin sessions.`, 'success');
        }

        closeModal();
        addForm.reset();
        editingProductId = null;
        isAddProductModalOpen = false;
        refreshAdminView(true);
      } catch (err) {
        console.error('Error in product publish submit:', err);
        showToast('Error syncing product to cloud. Please try again.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.textContent = editingProductId ? 'Save Changes' : 'Publish Product to Website';
        }
      }
    });
  }

  // Note: Delete product button events are securely bound in bindAdminProductCardEvents() called above

  // Order status changing
  const statusSelectors = document.querySelectorAll('.order-status-changer');
  statusSelectors.forEach(sel => {
    sel.addEventListener('change', (e) => {
      const orderId = sel.getAttribute('data-order-id');
      const newStatus = e.target.value;
      sel.className = `admin-select order-status-changer ${getStatusClass(newStatus)}`;
      if (state.updateOrderStatus) {
        state.updateOrderStatus(orderId, newStatus);
      } else {
        const orders = state.orders || [];
        const ord = orders.find(o => o.id === orderId);
        if (ord) {
          ord.status = newStatus;
          state._persist();
          state._notify({ orders: true });
        }
      }
      showToast(`Order #${orderId} status changed to "${newStatus}"!`, 'success');
    });
  });

  // Customer Query selection in left list
  const queryListItems = document.querySelectorAll('.admin-query-list-item');
  queryListItems.forEach(item => {
    item.addEventListener('click', () => {
      const qid = item.getAttribute('data-query-select-id');
      if (qid) {
        selectedQueryId = qid;
        state._notify({ route: true });
      }
    });
  });

  // =========================================================================
  // INITIATE RETURN / EXCHANGE / REFUND CLAIM WORKFLOW FROM QUERIES
  // =========================================================================
  const claimModalContainer = document.getElementById('admin-initiate-claim-modal-container');
  const closeClaimModalBtn = document.getElementById('close-initiate-claim-modal');
  const cancelClaimModalBtn = document.getElementById('btn-cancel-initiate-claim');
  const initiateClaimForm = document.getElementById('admin-initiate-claim-form');

  const getDefaultClaimReply = (type, qId) => {
    if (type === 'Exchange') {
      return `Hello, we have initiated an Exchange request for your piece under Ticket #${qId}. Our artisans in Delhi are preparing your replacement and complimentary reverse courier pickup will be scheduled shortly.`;
    } else if (type === 'Refund') {
      return `Hello, we have approved and initiated a Refund request for your order under Ticket #${qId}. The refund amount will be credited back to your original payment method within 3-5 business days.`;
    } else {
      return `Hello, we have initiated a Return pickup request for your order under Ticket #${qId}. Our express courier partner will reach out within 24-48 hours for doorstep pickup.`;
    }
  };

  const updateClaimModalTypeUI = (type) => {
    claimModalData.type = type;
    const badge = document.getElementById('claim-modal-type-badge');
    if (badge) {
      badge.className = `admin-badge ${type === 'Exchange' ? 'admin-badge-purple' : (type === 'Refund' ? 'admin-badge-success' : 'admin-badge-warning')}`;
      badge.textContent = type === 'Exchange' ? '🔁 Initiate Exchange' : (type === 'Refund' ? '💰 Initiate Refund' : '🔄 Initiate Return');
    }

    const typeBtns = document.querySelectorAll('.claim-type-selector-btn');
    typeBtns.forEach(b => {
      const bType = b.getAttribute('data-type');
      const isActive = bType === type;
      if (isActive) {
        if (type === 'Return') {
          b.style.background = 'rgba(243, 156, 18, 0.28)';
          b.style.borderColor = '#F39C12';
          b.style.color = '#FFBE53';
        } else if (type === 'Exchange') {
          b.style.background = 'rgba(155, 93, 229, 0.28)';
          b.style.borderColor = '#A855F7';
          b.style.color = '#D4A5FF';
        } else {
          b.style.background = 'rgba(46, 204, 113, 0.28)';
          b.style.borderColor = '#2ECC71';
          b.style.color = '#4EEDA0';
        }
      } else {
        b.style.background = 'rgba(255, 255, 255, 0.05)';
        b.style.borderColor = 'rgba(214, 184, 190, 0.25)';
        b.style.color = '#ECCFD0';
      }
    });

    const replyDraftTextarea = document.getElementById('claim-reply-draft');
    if (replyDraftTextarea) {
      replyDraftTextarea.value = getDefaultClaimReply(type, claimModalData.queryId || '');
    }
  };

  const getCustName = (ord) => (ord && (ord.customerName || ord.customer || (ord.shippingAddress && ord.shippingAddress.fullName))) || (state.user && state.user.name) || 'Patron';
  const getCustEmail = (ord) => (ord && (ord.email || (ord.shippingAddress && ord.shippingAddress.email))) || (state.user && state.user.email) || '';
  const getCustPhone = (ord) => (ord && (ord.phone || (ord.shippingAddress && ord.shippingAddress.phone))) || (state.user && state.user.phone) || '';

  const openClaimModal = (type, queryId) => {
    const queries = state.queries || [];
    const q = queries.find(item => item.id === queryId) || { id: queryId, message: '', subject: '' };
    const orders = state.orders || [];

    // Attempt to match order from queryId or recent orders
    const matchedOrder = (q.orderId && orders.find(o => o.id === q.orderId)) || orders[0] || null;
    const resolvedCustName = getCustName(matchedOrder);
    const resolvedEmail = getCustEmail(matchedOrder);
    const resolvedPhone = getCustPhone(matchedOrder);
    const resolvedProduct = (matchedOrder && matchedOrder.items && matchedOrder.items[0]) || (products && products[0]) || null;
    const resolvedAmount = matchedOrder ? (matchedOrder.total || (resolvedProduct ? resolvedProduct.price : 599)) : (resolvedProduct ? resolvedProduct.price : 599);

    claimModalData = {
      type: type || 'Return',
      queryId: q.id,
      orderId: matchedOrder ? matchedOrder.id : '',
      customerName: resolvedCustName,
      email: resolvedEmail,
      phone: resolvedPhone,
      productId: resolvedProduct ? resolvedProduct.id : '',
      productName: resolvedProduct ? resolvedProduct.name : '',
      amount: resolvedAmount,
      reason: q.subject ? `${q.subject}` : (type === 'Exchange' ? 'Fitment / Sizing Adjustment' : 'Patron Return Request'),
      details: q.message ? `Inquiry request: "${q.message.substring(0, 100)}"` : 'Resolution initiated by concierge admin.',
      draftResponse: getDefaultClaimReply(type, q.id)
    };

    isInitiateClaimModalOpen = true;
    if (claimModalContainer) {
      claimModalContainer.style.display = 'flex';

      // Update form values
      const ticketRef = document.getElementById('claim-modal-ticket-ref');
      if (ticketRef) ticketRef.textContent = `From Inquiry #${q.id}`;

      const autoReplyLabel = document.getElementById('claim-auto-reply-label');
      if (autoReplyLabel) autoReplyLabel.textContent = `Auto-dispatch resolution response to Customer Ticket #${q.id}`;

      const orderSelect = document.getElementById('claim-order-id');
      if (orderSelect && claimModalData.orderId) orderSelect.value = claimModalData.orderId;

      const custNameInput = document.getElementById('claim-customer-name');
      if (custNameInput) custNameInput.value = claimModalData.customerName;

      const custContactInput = document.getElementById('claim-customer-contact');
      if (custContactInput) custContactInput.value = claimModalData.email ? `${claimModalData.email} | ${claimModalData.phone}` : '';

      const amountInput = document.getElementById('claim-amount');
      if (amountInput) amountInput.value = claimModalData.amount;

      const detailsInput = document.getElementById('claim-details');
      if (detailsInput) detailsInput.value = claimModalData.details;

      const autoReplyCheckbox = document.getElementById('claim-auto-reply');
      if (autoReplyCheckbox) autoReplyCheckbox.checked = true;

      const replyDraftTextarea = document.getElementById('claim-reply-draft');
      if (replyDraftTextarea) replyDraftTextarea.value = claimModalData.draftResponse;

      updateClaimModalTypeUI(type);
    }
  };

  const closeClaimModal = () => {
    isInitiateClaimModalOpen = false;
    if (claimModalContainer) claimModalContainer.style.display = 'none';
  };

  // Dynamic order change listener inside claim modal
  const claimOrderSelect = document.getElementById('claim-order-id');
  if (claimOrderSelect) {
    claimOrderSelect.addEventListener('change', (e) => {
      const selectedOrderId = e.target.value;
      const orders = state.orders || [];
      const ord = orders.find(o => o.id === selectedOrderId);
      if (ord) {
        const cName = getCustName(ord);
        const cEmail = getCustEmail(ord);
        const cPhone = getCustPhone(ord);

        const custNameInput = document.getElementById('claim-customer-name');
        if (custNameInput) custNameInput.value = cName;

        const custContactInput = document.getElementById('claim-customer-contact');
        if (custContactInput) custContactInput.value = cEmail ? `${cEmail} | ${cPhone}` : '';

        const amountInput = document.getElementById('claim-amount');
        if (amountInput) amountInput.value = ord.total || 599;

        if (ord.items && ord.items.length > 0) {
          const prodSelect = document.getElementById('claim-product-name');
          if (prodSelect) {
            const firstItemName = ord.items[0].name;
            const matchingOption = Array.from(prodSelect.options).find(opt => opt.value === firstItemName);
            if (matchingOption) {
              prodSelect.value = firstItemName;
            }
          }
        }
      }
    });
  }

  // Claim action trigger buttons above query reply composer
  const claimTriggerBtns = document.querySelectorAll('.admin-btn-claim-trigger');
  claimTriggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-claim-type') || 'Return';
      const qid = btn.getAttribute('data-query-id');
      openClaimModal(type, qid);
    });
  });

  // Modal type switcher buttons
  const typeSelectorBtns = document.querySelectorAll('.claim-type-selector-btn');
  typeSelectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      updateClaimModalTypeUI(type);
    });
  });

  if (closeClaimModalBtn) closeClaimModalBtn.addEventListener('click', closeClaimModal);
  if (cancelClaimModalBtn) cancelClaimModalBtn.addEventListener('click', closeClaimModal);

  // Submit Initiate Claim Form
  if (initiateClaimForm) {
    initiateClaimForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const type = claimModalData.type || 'Return';
      const orderId = document.getElementById('claim-order-id')?.value || '';
      const productName = document.getElementById('claim-product-name')?.value || '';
      const customerName = document.getElementById('claim-customer-name')?.value || 'Customer';
      const customerContact = document.getElementById('claim-customer-contact')?.value || '';
      const amount = Number(document.getElementById('claim-amount')?.value) || 0;
      const reason = document.getElementById('claim-reason')?.value || 'Customer Inquiry Request';
      const details = document.getElementById('claim-details')?.value || 'Initiated by Admin Concierge';
      const isAutoReply = document.getElementById('claim-auto-reply')?.checked;
      const replyDraft = document.getElementById('claim-reply-draft')?.value?.trim();

      const [emailPart, phonePart] = customerContact.split('|').map(s => s.trim());
      const prefix = type === 'Exchange' ? 'EXC-' : (type === 'Refund' ? 'REF-' : 'RET-');
      const newClaimId = `${prefix}${Math.floor(100 + Math.random() * 900)}`;

      const now = new Date();
      const todayFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      const timeFormatted = `${todayFormatted} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newReturnRecord = {
        id: newClaimId,
        type: type,
        orderId: orderId,
        queryId: claimModalData.queryId,
        productId: 'item-' + Math.floor(1000 + Math.random() * 9000),
        productName: productName,
        customerName: customerName,
        email: emailPart || '',
        phone: phonePart || '',
        reason: reason,
        details: details,
        amount: amount,
        status: 'In Review',
        date: todayFormatted,
        chat: [
          { sender: 'Valeora Concierge', text: `Official ${type} claim #${newClaimId} initiated for Order #${orderId || 'Direct'}. Reason: ${reason}.`, time: timeFormatted }
        ]
      };

      // Add to returns in localStorage
      const returns = getAdminReturns();
      returns.unshift(newReturnRecord);
      localStorage.setItem('valeora_returns', JSON.stringify(returns));

      // Persist to Firestore live database
      createReturnInDb(newReturnRecord).catch(err => console.warn('Firestore claim write error:', err));

      // If auto-reply is selected, update active query
      if (isAutoReply && claimModalData.queryId && replyDraft) {
        const queries = state.queries || [];
        const q = queries.find(item => item.id === claimModalData.queryId);
        if (q) {
          q.response = replyDraft;
          q.status = 'Answered';
          state._persist();
          state._notify({ queries: true });
        }
      }

      closeClaimModal();
      showToast(`✨ ${type} Claim #${newClaimId} successfully initiated and logged in Returns & Claims!`, 'success');
      state._notify({ route: true });
    });
  }

  // View linked query button from Returns section
  const viewLinkedQueryBtns = document.querySelectorAll('.view-linked-query-btn');
  viewLinkedQueryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = btn.getAttribute('data-query-id');
      if (qid) {
        selectedQueryId = qid;
        activeAdminSection = 'queries';
        try { sessionStorage.setItem('valeora_active_admin_section', 'queries'); } catch (e) { }
        state._notify({ route: true });
      }
    });
  });

  // Query response saving
  const saveReplyBtns = document.querySelectorAll('.save-query-reply-btn');
  saveReplyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const queryId = btn.getAttribute('data-query-id');
      const replyInput = document.getElementById(`reply-input-${queryId}`);
      const newReply = replyInput?.value?.trim();
      const statusSelect = document.querySelector(`.query-status-changer[data-query-id="${queryId}"]`);
      const newStatus = statusSelect?.value || 'Answered';

      const queries = state.queries || [];
      const q = queries.find(item => item.id === queryId);
      if (q) {
        q.response = newReply;
        q.status = newReply ? 'Answered' : newStatus;
        if (statusSelect) {
          statusSelect.className = `admin-select query-status-changer ${getStatusClass(q.status)}`;
        }
        state._persist();
        state._notify({ queries: true });
        showToast(`Response dispatched for Query #${queryId}!`, 'success');
      }
    });
  });

  // Query status selector
  const queryStatusSelectors = document.querySelectorAll('.query-status-changer');
  queryStatusSelectors.forEach(sel => {
    sel.addEventListener('change', (e) => {
      const queryId = sel.getAttribute('data-query-id');
      const newStatus = e.target.value;
      sel.className = `admin-select query-status-changer ${getStatusClass(newStatus)}`;
      if (state.updateQueryStatus) {
        state.updateQueryStatus(queryId, newStatus);
      } else {
        const queries = state.queries || [];
        const q = queries.find(item => item.id === queryId);
        if (q) {
          q.status = newStatus;
          state._persist();
          state._notify({ route: true, queries: true });
        }
      }
      showToast(`Query #${queryId} status set to "${newStatus}".`, 'success');
    });
  });

  // Delete Resolved / Closed Customer Queries
  const deleteQueryBtns = document.querySelectorAll('.delete-active-query-btn, .admin-query-delete-btn');
  deleteQueryBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const qid = btn.getAttribute('data-query-id') || btn.getAttribute('data-query-delete-id');
      if (!qid) return;

      const confirmed = await showConfirmModal({
        title: 'Delete Inquiry Ticket',
        message: `Are you sure you want to delete inquiry ticket #${qid}? This permanently removes it from your inbox.`,
        confirmText: 'Delete Ticket',
        cancelText: 'Cancel',
        danger: true
      });
      if (confirmed) {
        state.deleteQuery(qid);
        if (selectedQueryId === qid) {
          const remaining = state.queries || [];
          selectedQueryId = remaining.length > 0 ? remaining[0].id : null;
        }
        showToast(`Ticket #${qid} deleted successfully.`, 'info');
        state._notify({ route: true });
      }
    });
  });

  // Return approval & completion & rejection
  const approveReturnBtns = document.querySelectorAll('.approve-return-btn');
  approveReturnBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const retId = btn.getAttribute('data-return-id');
      const returns = getAdminReturns();
      const r = returns.find(item => item.id === retId);
      if (r) {
        r.status = 'Approved';
        r.chat.push({ sender: 'Valeora Resolutions', text: 'Return / claim approved. Reverse courier pickup scheduled within 24 hours.', time: new Date().toISOString().substring(0, 16) });
        localStorage.setItem('valeora_returns', JSON.stringify(returns));
        updateReturnInDb(r.firestoreId || retId, { status: 'Approved', chat: r.chat }).catch(e => console.warn('Firestore update claim:', e));
        state._notify({ route: true });
        showToast(`Claim #${retId} has been Approved!`, 'success');
      }
    });
  });

  const completeReturnBtns = document.querySelectorAll('.complete-return-btn');
  completeReturnBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const retId = btn.getAttribute('data-return-id');
      const returns = getAdminReturns();
      const r = returns.find(item => item.id === retId);
      if (r) {
        r.status = 'Completed';
        r.chat.push({ sender: 'Valeora Resolutions', text: 'Resolution completed: Reverse pickup received & replacement/refund processed.', time: new Date().toISOString().substring(0, 16) });
        localStorage.setItem('valeora_returns', JSON.stringify(returns));
        updateReturnInDb(r.firestoreId || retId, { status: 'Completed', chat: r.chat }).catch(e => console.warn('Firestore update claim:', e));
        state._notify({ route: true });
        showToast(`Claim #${retId} marked as Completed!`, 'success');
      }
    });
  });

  const rejectReturnBtns = document.querySelectorAll('.reject-return-btn');
  rejectReturnBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const retId = btn.getAttribute('data-return-id');
      const returns = getAdminReturns();
      const r = returns.find(item => item.id === retId);
      if (r) {
        r.status = 'Rejected';
        r.chat.push({ sender: 'Valeora Resolutions', text: 'Claim could not be approved based on policy conditions.', time: new Date().toISOString().substring(0, 16) });
        localStorage.setItem('valeora_returns', JSON.stringify(returns));
        updateReturnInDb(r.firestoreId || retId, { status: 'Rejected', chat: r.chat }).catch(e => console.warn('Firestore update claim:', e));
        state._notify({ route: true });
        showToast(`Claim #${retId} status set to Rejected.`, 'error');
      }
    });
  });

  // Add claim log note
  const addClaimLogBtns = document.querySelectorAll('.add-claim-log-btn');
  addClaimLogBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const retId = btn.getAttribute('data-return-id');
      const input = document.getElementById(`ret-note-input-${retId}`);
      const text = input?.value?.trim();
      if (!text) return;

      const returns = getAdminReturns();
      const r = returns.find(item => item.id === retId);
      if (r) {
        const now = new Date();
        const timeFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        r.chat = r.chat || [];
        r.chat.push({ sender: 'Valeora Resolutions', text, time: timeFormatted });
        localStorage.setItem('valeora_returns', JSON.stringify(returns));
        updateReturnInDb(r.firestoreId || retId, { chat: r.chat }).catch(e => console.warn('Firestore update claim log:', e));
        showToast(`Note logged to Claim #${retId}`, 'success');
        state._notify({ route: true });
      }
    });
  });

  // Delete processed / completed / rejected claim records
  const deleteClaimBtns = document.querySelectorAll('.delete-claim-btn');
  deleteClaimBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const retId = btn.getAttribute('data-return-id');
      if (!retId) return;
      const confirmed = await showConfirmModal({
        title: 'Delete Claim Record',
        message: `Are you sure you want to delete claim #${retId}? This will remove it from your records.`,
        confirmText: 'Delete Claim',
        cancelText: 'Cancel',
        danger: true
      });
      if (confirmed) {
        let returns = getAdminReturns();
        returns = returns.filter(item => item.id !== retId);
        localStorage.setItem('valeora_returns', JSON.stringify(returns));
        showToast(`Claim #${retId} removed from records.`, 'info');
        state._notify({ route: true });
      }
    });
  });

  // Chart month group hover tooltip interaction
  const chartGroups = document.querySelectorAll('.chart-month-group');
  const tooltip = document.getElementById('graph-tooltip');
  const tMonth = document.getElementById('tooltip-month');
  const tRev = document.getElementById('tooltip-rev');
  const tProfit = document.getElementById('tooltip-profit');
  const tMargin = document.getElementById('tooltip-margin');
  const chartWrapper = document.querySelector('.admin-chart-wrapper');

  if (chartGroups.length && tooltip && chartWrapper) {
    chartGroups.forEach(group => {
      group.addEventListener('mouseenter', () => {
        const month = group.getAttribute('data-month');
        const rev = group.getAttribute('data-rev');
        const profit = group.getAttribute('data-profit');
        const margin = group.getAttribute('data-margin');

        if (tMonth) tMonth.textContent = month;
        if (tRev) tRev.textContent = rev;
        if (tProfit) tProfit.textContent = profit;
        if (tMargin) tMargin.textContent = margin;

        tooltip.style.display = 'block';
      });

      group.addEventListener('mousemove', (e) => {
        const rect = chartWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + 12;
        const y = e.clientY - rect.top - 80;

        tooltip.style.left = `${Math.min(Math.max(10, x), rect.width - 185)}px`;
        tooltip.style.top = `${Math.max(5, y)}px`;
      });

      group.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }

  // Toggle User Block / Unblock Action
  const toggleBlockBtns = document.querySelectorAll('.toggle-user-block-btn');
  toggleBlockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.getAttribute('data-user-id');
      const users = getAdminUsers();
      const user = users.find(u => u.id === uid);
      if (user) {
        const willBlock = user.status !== 'blocked';
        user.status = willBlock ? 'blocked' : 'active';
        localStorage.setItem('valeora_registered_users', JSON.stringify(users));
        showToast(`User ${user.name} (${user.id}) has been ${willBlock ? 'blocked' : 'unblocked'}.`, willBlock ? 'error' : 'success');
        state._notify({ route: true });
      }
    });
  });

  // ==========================================
  // COUPONS & PROMOTIONAL MANAGEMENT EVENTS
  // ==========================================

  // Open Create Coupon Modal
  const openCouponBtn = document.getElementById('btn-open-create-coupon-modal');
  const emptyOpenCouponBtn = document.getElementById('btn-empty-create-coupon');
  const openCouponModal = () => {
    editingCouponId = null;
    couponModalData = {
      id: '',
      code: '',
      discountPercent: 20,
      minAmount: 999,
      description: '',
      isActive: true
    };
    isCouponModalOpen = true;
    state._notify({ route: true });
  };
  if (openCouponBtn) openCouponBtn.addEventListener('click', openCouponModal);
  if (emptyOpenCouponBtn) emptyOpenCouponBtn.addEventListener('click', openCouponModal);

  // Close Coupon Modal
  const closeCouponBtn = document.getElementById('close-coupon-modal');
  const cancelCouponBtn = document.getElementById('btn-cancel-coupon');
  const couponModalOverlay = document.getElementById('admin-coupon-modal-overlay');
  const closeCouponModal = () => {
    isCouponModalOpen = false;
    editingCouponId = null;
    state._notify({ route: true });
  };
  if (closeCouponBtn) closeCouponBtn.addEventListener('click', closeCouponModal);
  if (cancelCouponBtn) cancelCouponBtn.addEventListener('click', closeCouponModal);
  if (couponModalOverlay) {
    couponModalOverlay.addEventListener('click', (e) => {
      if (e.target === couponModalOverlay) closeCouponModal();
    });
  }

  // Coupon Form Submit (Create or Edit)
  const couponForm = document.getElementById('admin-coupon-form');
  if (couponForm) {
    couponForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const codeInput = document.getElementById('cp-code');
      const discountInput = document.getElementById('cp-discount');
      const minAmountInput = document.getElementById('cp-min-amount');
      const descInput = document.getElementById('cp-description');
      const activeInput = document.getElementById('cp-active');

      const code = (codeInput?.value || '').trim().toUpperCase().replace(/\s+/g, '');
      const discountPercent = Math.min(90, Math.max(1, Number(discountInput?.value) || 10));
      const minAmount = Math.max(0, Number(minAmountInput?.value) || 0);
      const description = (descInput?.value || '').trim() || `${discountPercent}% OFF on orders above ₹${minAmount}`;
      const isActive = activeInput ? activeInput.checked : true;

      if (!code) {
        showToast('Please enter a valid coupon code.', 'error');
        return;
      }

      if (editingCouponId) {
        state.updateCoupon(editingCouponId, {
          code,
          discountPercent,
          minAmount,
          description,
          active: isActive
        });
        showToast(`Coupon ${code} updated successfully!`, 'success');
      } else {
        const res = state.addCoupon({
          code,
          discountPercent,
          minAmount,
          description,
          active: isActive
        });
        if (res.success) {
          showToast(`Coupon ${code} created & launched live!`, 'success');
        } else {
          showToast(res.message || 'Failed to create coupon.', 'error');
          return;
        }
      }
      isCouponModalOpen = false;
      editingCouponId = null;
      state._notify({ route: true });
    });
  }

  // Toggle Coupon Active Status
  const toggleCouponBtns = document.querySelectorAll('.toggle-coupon-btn');
  toggleCouponBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cid = btn.getAttribute('data-coupon-id');
      const coupons = state.coupons || [];
      const cp = coupons.find(c => c.id === cid);
      if (cp) {
        const nextState = cp.active === false;
        state.updateCoupon(cid, { active: nextState });
        showToast(`Coupon ${cp.code} is now ${nextState ? 'Active' : 'Paused'}.`, nextState ? 'success' : 'info');
        refreshAdminView(true);
      }
    });
  });

  // Edit Coupon Button
  const editCouponBtns = document.querySelectorAll('.edit-coupon-btn');
  editCouponBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cid = btn.getAttribute('data-coupon-id');
      const coupons = state.coupons || [];
      const cp = coupons.find(c => c.id === cid);
      if (cp) {
        editingCouponId = cp.id;
        couponModalData = {
          id: cp.id,
          code: cp.code,
          discountPercent: cp.discountPercent,
          minAmount: cp.minAmount,
          description: cp.description,
          isActive: cp.active !== false
        };
        isCouponModalOpen = true;
        refreshAdminView(true);
      }
    });
  });

  // Delete Coupon Button
  const deleteCouponBtns = document.querySelectorAll('.delete-coupon-btn');
  deleteCouponBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const cid = btn.getAttribute('data-coupon-id');
      const coupons = state.coupons || [];
      const cp = coupons.find(c => c.id === cid);
      if (!cp) return;

      const confirmed = await showConfirmModal({
        title: 'Delete Promo Coupon',
        message: `Are you sure you want to permanently delete coupon "${cp.code}"? Customers will no longer be able to use this code.`,
        confirmText: 'Delete Coupon',
        cancelText: 'Keep Coupon',
        danger: true
      });

      if (confirmed) {
        state.deleteCoupon(cid);
        showToast(`Coupon ${cp.code} deleted successfully.`, 'info');
        refreshAdminView(true);
      }
    });
  });

  // Copy Coupon Code Button
  const copyCouponBtns = document.querySelectorAll('.copy-coupon-code-btn');
  copyCouponBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = btn.getAttribute('data-code');
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Coupon code "${code}" copied!`, 'success');
        }).catch(() => {
          showToast(`Code: ${code}`, 'info');
        });
      }
    });
  });

  // Sign out button
  const signOutBtn = document.getElementById('admin-sidebar-signout-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      state.logout();
      showToast('Signed out of admin session.');
      state.setRoute('home');
    });
  }
}

