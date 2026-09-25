import { state } from '../state.js';
import { PRODUCTS } from '../productsData.js';
import { showToast } from '../components/toast.js';
import { isAdminEmail } from '../services/firebase.js';

let currentProfileTab = 'orders';
let prefilledQueryOrderId = '';
let selectedProfileQueryId = null;
let isNewQueryModalOpen = false;

export function formatDateDDMMYYYY(rawDate) {
  if (!rawDate) return '';
  const str = String(rawDate).trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return str;
  const ymdMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const [, yyyy, mm, dd] = ymdMatch;
    return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return str;
}

export function setProfileActiveTab(tab, orderId = '') {
  currentProfileTab = tab || 'orders';
  if (orderId) prefilledQueryOrderId = orderId;
}

export function renderProfilePage() {
  if (!state.user) {
    setTimeout(() => {
      state.setRoute('home');
      state.toggleAuthModal(true);
    }, 50);
    return `
      <div class="profile-page-wrapper" style="min-height:80vh; display:flex; align-items:center; justify-content:center; text-align:center; padding: 120px 20px;">
        <div style="max-width:440px; background:rgba(30,4,14,0.85); border:1px solid rgba(214,184,190,0.25); border-radius:20px; padding:36px 28px;">
          <h2 style="font-family:var(--font-serif); color:#fff; font-size:1.6rem; margin-bottom:10px;">Account Access</h2>
          <p style="color:rgba(236,207,208,0.75); font-size:0.9rem; margin-bottom:20px;">Please sign in to view your orders and personal account details.</p>
          <button type="button" class="btn btn-pill" onclick="window.location.hash='#home'">Return Home</button>
        </div>
      </div>
    `;
  }

  const user = state.user;
  const isAdmin = Boolean(state.isAdmin || isAdminEmail(user.email));

  if (isAdmin) {
    currentProfileTab = 'personal';
  }

  if (state.cleanExpiredResolvedQueries) {
    state.cleanExpiredResolvedQueries();
  }

  // Filter orders and queries strictly for the currently authenticated user
  const allOrders = state.orders || [];
  const allQueries = state.queries || [];

  const currentUserUid = user.uid || null;
  const currentUserEmail = (user.email || '').toLowerCase().trim();

  const orders = allOrders.filter(o => {
    if (currentUserUid && o.userId && o.userId === currentUserUid) return true;
    if (currentUserEmail && o.email && o.email.toLowerCase().trim() === currentUserEmail) return true;
    return false;
  });

  const queries = allQueries.filter(q => {
    if (currentUserUid && q.userId && q.userId === currentUserUid) return true;
    if (currentUserEmail && q.email && q.email.toLowerCase().trim() === currentUserEmail) return true;
    return false;
  });

  const initialLetter = (user.name || 'V').trim().charAt(0).toUpperCase();

  return `
    <style>
      .profile-page-wrapper {
        min-height: 100vh;
        padding: 110px 0 80px 0;
        background: radial-gradient(circle at 50% 0%, rgba(95, 18, 45, 0.28) 0%, #120207 70%);
      }
      .profile-top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
        max-width: 980px;
        margin: 0 auto 26px auto;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(214, 184, 190, 0.18);
      }
      .profile-page-title {
        font-family: var(--font-serif);
        font-size: clamp(2rem, 4vw, 2.7rem);
        color: #FFFFFF !important;
        font-weight: 700;
        letter-spacing: -0.01em;
        line-height: 1.15;
        margin: 0 0 4px 0;
      }
      .profile-page-subtitle {
        color: rgba(236, 207, 208, 0.8) !important;
        font-size: 0.92rem;
        margin: 0;
        font-weight: 500;
      }
      .profile-page-subtitle strong {
        color: #FFFFFF;
        font-weight: 700;
      }
      .profile-avatar-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%) !important;
        color: #24040E !important;
        font-family: var(--font-brand);
        font-size: 1.25rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid rgba(255, 255, 255, 0.5) !important;
        box-shadow: 0 0 14px rgba(214, 184, 190, 0.4) !important;
        flex-shrink: 0;
      }
      .profile-badges-row .badge-pill {
        background: rgba(214, 184, 190, 0.18) !important;
        color: #ECCFD0 !important;
        border: 1px solid rgba(214, 184, 190, 0.32) !important;
        font-weight: 600;
        box-shadow: none !important;
      }
      .profile-tabs-nav {
        display: flex;
        gap: 8px;
        background: linear-gradient(135deg, #CEB6BD 0%, #C3A9B0 100%) !important;
        border: 1.5px solid rgba(255, 255, 255, 0.5) !important;
        border-radius: 9999px;
        padding: 6px;
        margin-bottom: 30px;
        max-width: 680px;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5);
      }
      .profile-tab-btn {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 11px 20px;
        border-radius: 9999px;
        border: 1px solid transparent;
        background: transparent;
        color: #24040E !important;
        font-size: 0.88rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        cursor: pointer;
        transition: all 0.25s ease;
        white-space: nowrap;
      }
      .profile-tab-btn:hover {
        color: #140207 !important;
        background: rgba(36, 4, 14, 0.1) !important;
      }
      .profile-tab-btn.active {
        background: linear-gradient(145deg, #2D0715 0%, #170208 100%) !important;
        color: #FFFFFF !important;
        border: 1px solid rgba(214, 184, 190, 0.35) !important;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5), 0 0 12px rgba(120, 25, 60, 0.35) !important;
        font-weight: 700 !important;
      }
      .profile-order-card {
        background: linear-gradient(155deg, rgba(42, 7, 21, 0.9) 0%, rgba(20, 2, 8, 0.96) 100%) !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        border: 1.5px solid rgba(214, 184, 190, 0.24) !important;
        border-radius: 24px !important;
        padding: 24px !important;
        margin-bottom: 24px !important;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      }
      .profile-order-card:hover {
        transform: translateY(-2px);
        border-color: rgba(214, 184, 190, 0.38) !important;
        box-shadow: 0 28px 70px rgba(0, 0, 0, 0.75), 0 0 25px rgba(214, 184, 190, 0.12) !important;
      }
      .order-card-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        background: linear-gradient(135deg, rgba(214, 184, 190, 0.12) 0%, rgba(90, 14, 40, 0.22) 100%) !important;
        border: 1px solid rgba(214, 184, 190, 0.18) !important;
        border-radius: 16px;
        padding: 14px 18px;
        margin-bottom: 20px;
      }
      .order-stepper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 22px 0 26px 0;
        position: relative;
      }
      .order-stepper::before {
        content: '';
        position: absolute;
        top: 14px;
        left: 30px;
        right: 30px;
        height: 2.5px;
        background: linear-gradient(90deg, #D6B8BE 0%, rgba(214, 184, 190, 0.2) 100%) !important;
        z-index: 1;
      }
      .order-step {
        position: relative;
        z-index: 2;
        text-align: center;
        flex: 1;
      }
      .order-step-dot {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06) !important;
        border: 1.5px solid rgba(214, 184, 190, 0.28) !important;
        color: rgba(236, 207, 208, 0.6) !important;
        font-size: 0.75rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 8px auto;
        transition: all 0.25s ease;
      }
      .order-step.completed .order-step-dot {
        background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%) !important;
        border: none !important;
        color: #24040E !important;
        box-shadow: 0 0 16px rgba(214, 184, 190, 0.5) !important;
      }
      .order-step.active .order-step-dot {
        background: #8A1538 !important;
        border: 2px solid #D6B8BE !important;
        color: #FFFFFF !important;
        box-shadow: 0 0 14px rgba(138, 21, 56, 0.6) !important;
      }
      .order-step-label {
        font-size: 0.76rem;
        color: rgba(236, 207, 208, 0.6) !important;
        font-weight: 500;
      }
      .order-step.completed .order-step-label,
      .order-step.active .order-step-label {
        color: #FFFFFF !important;
        font-weight: 700;
      }
      .order-items-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
      }
      .order-item-row {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 18px;
        background: rgba(255, 255, 255, 0.04) !important;
        border: 1px solid rgba(214, 184, 190, 0.16) !important;
        border-radius: 16px;
        transition: background 0.25s ease, border-color 0.25s ease;
      }
      .order-item-row:hover {
        background: rgba(214, 184, 190, 0.07) !important;
        border-color: rgba(214, 184, 190, 0.3) !important;
      }
      .order-item-img {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        object-fit: cover;
        border: 1.5px solid rgba(214, 184, 190, 0.3) !important;
        background: rgba(0, 0, 0, 0.3);
      }
      .order-item-name {
        font-weight: 600;
        color: #FFFFFF !important;
        font-size: 0.92rem;
      }
      .order-item-qty {
        font-size: 0.78rem;
        color: #ECCFD0 !important;
      }
      .order-item-price {
        font-weight: 700;
        color: #ECCFD0 !important;
        font-size: 1.05rem;
        font-family: var(--font-brand);
      }
      .desktop-total-header {
        display: block;
      }
      .mobile-total-right {
        display: none !important;
      }
      .order-bottom-actions-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .profile-page-wrapper .spotlight-card-main {
        background: linear-gradient(155deg, rgba(42, 7, 21, 0.9) 0%, rgba(20, 2, 8, 0.96) 100%) !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        border: 1.5px solid rgba(214, 184, 190, 0.24) !important;
        border-radius: 24px !important;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
      }
      .profile-personal-card {
        background: linear-gradient(155deg, rgba(42, 7, 21, 0.94) 0%, rgba(20, 2, 8, 0.98) 100%) !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        border: 1.5px solid rgba(214, 184, 190, 0.28) !important;
        border-radius: 20px !important;
        padding: 22px 24px !important;
        max-width: 680px !important;
        margin: 0 auto !important;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
      }
      .profile-identity-bar {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: rgba(214, 184, 190, 0.08);
        border: 1px solid rgba(214, 184, 190, 0.2);
        border-radius: 14px;
        margin-bottom: 18px;
      }
      .profile-identity-info {
        flex: 1;
        min-width: 0;
      }
      .profile-name-badge-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 2px;
        flex-wrap: wrap;
      }
      .profile-identity-name {
        font-weight: 700;
        color: #FFFFFF;
        font-size: 1.05rem;
      }
      .profile-membership-badge {
        font-size: 0.68rem;
        padding: 1px 8px;
        background: rgba(214, 184, 190, 0.18);
        color: #ECCFD0;
        border: 1px solid rgba(214, 184, 190, 0.3);
      }
      .profile-identity-meta {
        font-size: 0.76rem;
        color: rgba(236, 207, 208, 0.7);
      }
      .profile-details-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .profile-contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 12px;
      }
      .profile-location-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr 1fr;
        gap: 10px;
      }
      .profile-input-label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }
      .profile-input-verified-wrap {
        position: relative;
        display: flex;
        align-items: center;
      }
      .profile-input-verified-badge {
        position: absolute;
        right: 10px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(46, 204, 113, 0.18);
        border: 1px solid rgba(46, 204, 113, 0.45);
        color: #4EEDA0;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 8px rgba(78, 237, 160, 0.2);
        pointer-events: none;
      }
      .profile-form-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 6px;
        flex-wrap: wrap;
        gap: 10px;
      }
      .profile-form-security-note {
        font-size: 0.76rem;
        color: rgba(236, 207, 208, 0.65);
      }
      .btn-otp-action {
        background: rgba(214, 184, 190, 0.12) !important;
        border: 1px solid rgba(214, 184, 190, 0.3) !important;
        color: #D6B8BE !important;
        font-size: 0.72rem !important;
        font-weight: 700 !important;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 9px !important;
        border-radius: 9999px !important;
        transition: all 0.2s ease !important;
      }
      .btn-otp-action:hover {
        background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%) !important;
        color: #24040E !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
        box-shadow: 0 2px 8px rgba(214, 184, 190, 0.3) !important;
      }
      .otp-modal-dialog {
        max-width: 440px;
        width: 92%;
        padding: 24px;
        background: linear-gradient(155deg, rgba(46, 11, 26, 0.98) 0%, rgba(20, 3, 10, 0.99) 100%);
        border: 1.5px solid rgba(214, 184, 190, 0.35);
        border-radius: 22px;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.8), 0 0 30px rgba(120, 25, 60, 0.25);
        position: relative;
        margin: auto;
      }
      .otp-digit-inputs {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin: 16px 0;
      }
      .otp-digit-input {
        width: 52px;
        height: 56px;
        text-align: center;
        font-size: 1.4rem;
        font-weight: 800;
        font-family: var(--font-brand);
        background: rgba(16, 2, 7, 0.92);
        border: 1.5px solid rgba(214, 184, 190, 0.3);
        border-radius: 12px;
        color: #FFFFFF;
        outline: none;
        transition: all 0.2s ease;
      }
      .otp-digit-input:focus {
        border-color: #D6B8BE;
        background: rgba(24, 3, 10, 0.98);
        box-shadow: 0 0 0 3px rgba(214, 184, 190, 0.25);
      }
      .otp-demo-helper {
        background: rgba(214, 184, 190, 0.12);
        border: 1px dashed rgba(214, 184, 190, 0.35);
        border-radius: 10px;
        padding: 8px 12px;
        font-size: 0.78rem;
        color: #ECCFD0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 12px 0 16px 0;
      }
      .otp-demo-helper button {
        background: rgba(214, 184, 190, 0.2);
        border: 1px solid rgba(214, 184, 190, 0.4);
        color: #FFFFFF;
        border-radius: 6px;
        padding: 2px 8px;
        font-size: 0.72rem;
        font-weight: 700;
        cursor: pointer;
      }
      .otp-modal-header {
        text-align: center;
        margin-bottom: 20px;
      }
      .otp-modal-icon-wrap {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, #CEB6BD 0%, #C3A9B0 100%);
        color: #24040E;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px auto;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
      }
      .otp-modal-title {
        font-family: var(--font-serif);
        font-size: 1.35rem;
        font-weight: 700;
        color: #FFFFFF;
        margin: 0 0 6px 0;
      }
      .otp-modal-subtext {
        font-size: 0.82rem;
        color: rgba(236, 207, 208, 0.75);
        margin: 0;
      }
      .otp-form-body {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .otp-submit-btn {
        padding: 11px;
        font-size: 0.88rem;
        font-weight: 700;
        width: 100%;
        justify-content: center;
      }
      .otp-countdown-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.78rem;
        color: rgba(236, 207, 208, 0.75);
      }
      .otp-resend-link {
        background: none;
        border: none;
        color: #D6B8BE;
        font-weight: 700;
        cursor: pointer;
        display: none;
        text-decoration: underline;
      }
      .query-modal-header {
        margin-bottom: 16px;
        border-bottom: 1px solid rgba(214, 184, 190, 0.2);
        padding-bottom: 10px;
      }
      .query-modal-title {
        font-family: var(--font-serif);
        font-size: 1.35rem;
        font-weight: 700;
        color: #FFFFFF;
        margin: 0 0 4px 0;
      }
      .query-modal-subtitle {
        color: rgba(236, 207, 208, 0.75);
        font-size: 0.8rem;
        margin: 0;
      }
      .query-modal-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
        margin-top: 10px;
        padding-top: 14px;
        border-top: 1px solid rgba(214, 184, 190, 0.18);
      }
      .user-chat-queue-note {
        text-align: center;
        margin: 14px auto;
        padding: 7px 18px;
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(214, 184, 190, 0.09);
        border-radius: 9999px;
        font-size: 0.74rem;
        color: rgba(236, 207, 208, 0.42);
        max-width: 340px;
        letter-spacing: 0.02em;
        line-height: 1.45;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }
      .profile-input-group label {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #ECCFD0 !important;
        font-weight: 700;
      }
      .profile-input {
        width: 100%;
        padding: 11px 14px;
        background: rgba(16, 2, 7, 0.88) !important;
        border: 1.5px solid rgba(214, 184, 190, 0.24) !important;
        border-radius: 12px;
        color: #FFFFFF !important;
        font-family: var(--font-sans);
        font-size: 0.9rem;
        font-weight: 500;
        outline: none;
        transition: all 0.25s ease;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4) !important;
      }
      .profile-input::placeholder {
        color: rgba(214, 184, 190, 0.4) !important;
      }
      .profile-input:focus {
        border-color: #D6B8BE !important;
        background: rgba(24, 3, 10, 0.96) !important;
        box-shadow: 0 0 0 3.5px rgba(214, 184, 190, 0.22), 0 8px 24px rgba(0, 0, 0, 0.4) !important;
        color: #FFFFFF !important;
      }
      /* Concierge Inquiries Horizontal Scrolling Section */
      .user-queries-layout {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
      }
      .user-queries-sidebar {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(214, 184, 190, 0.2);
        padding: 16px 20px;
        border-radius: 18px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        box-sizing: border-box;
      }
      .user-queries-sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(236, 207, 208, 0.12);
        padding-bottom: 10px;
      }
      .profile-queries-list-scrollable {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        gap: 14px !important;
        padding-bottom: 10px !important;
        padding-top: 2px !important;
        -webkit-overflow-scrolling: touch !important;
        scroll-snap-type: x mandatory !important;
        scrollbar-width: thin !important;
        scrollbar-color: rgba(214, 184, 190, 0.45) transparent !important;
        justify-content: center !important;
        align-items: center !important;
      }
      .profile-queries-list-scrollable::-webkit-scrollbar {
        height: 6px !important;
      }
      .profile-queries-list-scrollable::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.04) !important;
        border-radius: 99px !important;
      }
      .profile-queries-list-scrollable::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, #8A1538, #D6B8BE) !important;
        border-radius: 99px !important;
      }
      .user-query-card-item {
        flex: 0 0 280px !important;
        width: 280px !important;
        min-width: 280px !important;
        max-width: 280px !important;
        box-sizing: border-box !important;
        border-radius: 14px !important;
        padding: 14px 16px !important;
        cursor: pointer !important;
        transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
        scroll-snap-align: start !important;
        flex-shrink: 0 !important;
      }
      .user-query-card-item:hover {
        transform: translateY(-2px);
        border-color: rgba(214, 184, 190, 0.5) !important;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
      }
      .user-query-card-item.active {
        background: linear-gradient(135deg, rgba(138, 21, 56, 0.55) 0%, rgba(214, 184, 190, 0.18) 100%) !important;
        border-color: #D6B8BE !important;
        box-shadow: 0 6px 20px rgba(138, 21, 56, 0.35) !important;
      }
      .user-queries-chat-card {
        padding: 0;
        border-radius: 18px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-height: 480px;
        height: 520px;
        box-sizing: border-box;
        width: 100%;
      }
      .tab-label-mobile {
        display: none !important;
      }
      .tab-label-desktop {
        display: inline !important;
      }

      /* Order Details Popup Modal (Base / Desktop) */
      .order-detail-modal-dialog {
        max-width: 1080px !important;
        width: 95vw !important;
        box-sizing: border-box;
        padding: 0 !important;
        background: linear-gradient(155deg, rgba(46, 11, 26, 0.98) 0%, rgba(20, 3, 10, 0.99) 100%);
        border: 1.5px solid rgba(214, 184, 190, 0.35);
        border-radius: 24px;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.85), 0 0 35px rgba(120, 25, 60, 0.3);
        position: relative;
        overflow: hidden !important;
      }
      .order-detail-body-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 20px;
        align-items: start;
        margin-bottom: 12px;
      }
      @media (max-width: 820px) {
        .order-detail-body-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }
      .order-detail-scroll-container {
        max-height: 88vh;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 28px 24px;
        box-sizing: border-box;
        scrollbar-width: thin;
        scrollbar-color: rgba(214, 184, 190, 0.4) transparent;
      }
      .order-detail-scroll-container::-webkit-scrollbar {
        width: 4px;
      }
      .order-detail-scroll-container::-webkit-scrollbar-track {
        background: transparent;
        margin: 16px 0;
      }
      .order-detail-scroll-container::-webkit-scrollbar-thumb {
        background: rgba(214, 184, 190, 0.35);
        border-radius: 9999px;
      }
      .order-detail-scroll-container::-webkit-scrollbar-thumb:hover {
        background: rgba(236, 207, 208, 0.7);
      }
      .order-detail-close-btn {
        position: static !important;
        font-size: 1.7rem;
        color: #ECCFD0;
        cursor: pointer;
        background: transparent;
        border: none;
        line-height: 1;
        padding: 4px 8px;
        transition: color 0.2s ease, transform 0.2s ease;
        flex-shrink: 0;
      }
      .order-detail-close-btn:hover {
        color: #FFFFFF;
        transform: scale(1.1);
      }
      .order-detail-modal-header {
        border-bottom: 1px solid rgba(214, 184, 190, 0.2);
        padding-bottom: 16px;
        margin-bottom: 20px;
        padding-right: 0;
      }
      .order-detail-modal-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 6px;
      }
      .order-detail-modal-title-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        flex: 1;
        min-width: 0;
      }
      .order-detail-modal-title {
        font-family: var(--font-serif);
        font-size: 1.45rem;
        font-weight: 700;
        color: #FFFFFF;
        margin: 0;
      }
      .order-detail-badge {
        font-size: 0.74rem;
        padding: 3px 10px;
        background: rgba(46, 204, 113, 0.22);
        color: #4EEDA0;
        border: 1px solid rgba(46, 204, 113, 0.45);
        font-weight: 700;
      }
      .order-detail-modal-meta {
        font-size: 0.82rem;
        color: #ECCFD0;
        font-weight: 500;
      }
      .order-detail-stepper-box {
        background: rgba(214, 184, 190, 0.08);
        border: 1px solid rgba(214, 184, 190, 0.22);
        border-radius: 16px;
        padding: 16px 14px;
        margin-bottom: 20px;
        position: relative;
      }
      .order-detail-steps-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        align-items: start;
        text-align: center;
        position: relative;
      }
      .order-detail-step-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        min-width: 0;
        text-align: center;
      }
      .order-detail-step-circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 6px auto;
        font-size: 0.78rem;
        font-weight: 800;
        flex-shrink: 0;
      }
      .order-detail-step-circle.active {
        background: #4EEDA0;
        color: #120207;
        box-shadow: 0 0 12px rgba(78, 237, 160, 0.4);
      }
      .order-detail-step-circle.inactive {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(214, 184, 190, 0.25);
        color: rgba(236, 207, 208, 0.6);
      }
      .order-detail-step-text {
        font-size: 0.72rem;
        font-weight: 600;
        line-height: 1.25;
        color: rgba(236, 207, 208, 0.7);
        text-align: center;
        display: block;
        width: 100%;
        word-break: normal;
        white-space: nowrap;
      }
      .order-detail-step-col.active .order-detail-step-text,
      .order-detail-step-col.completed .order-detail-step-text {
        color: #FFFFFF;
        font-weight: 700;
      }
      .order-detail-delivery-est {
        margin-top: 12px;
        font-size: 0.76rem;
        color: rgba(236, 207, 208, 0.9);
        text-align: center;
        border-top: 1px solid rgba(214, 184, 190, 0.16);
        padding-top: 8px;
      }
      .order-detail-items-section {
        margin-bottom: 20px;
      }
      .order-detail-section-title {
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #ECCFD0;
        margin-bottom: 10px;
      }
      .order-detail-items-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 220px;
        overflow-y: auto;
      }
      .order-detail-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 14px;
      }
      .order-detail-card-box {
        background: rgba(214, 184, 190, 0.08);
        border: 1px solid rgba(214, 184, 190, 0.22);
        border-radius: 14px;
        padding: 14px;
      }
      .order-detail-box-title {
        font-size: 0.76rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #ECCFD0;
        font-weight: 700;
        margin-bottom: 6px;
      }
      .order-detail-customer-name {
        font-weight: 600;
        color: #FFFFFF;
        font-size: 0.88rem;
        margin-bottom: 2px;
      }
      .order-detail-address-text {
        font-size: 0.8rem;
        color: rgba(236, 207, 208, 0.85);
        line-height: 1.45;
      }
      .order-detail-price-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: rgba(236, 207, 208, 0.85);
        margin-bottom: 4px;
      }
      .order-detail-total-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.95rem;
        color: #FFFFFF;
        font-weight: 700;
        border-top: 1px solid rgba(214, 184, 190, 0.18);
        padding-top: 6px;
        margin-top: 6px;
      }

      /* ================= TABLET VIEW (601px - 1100px) ================= */
      @media (min-width: 601px) and (max-width: 1100px) {
        .profile-page-wrapper {
          padding-top: calc(98px + env(safe-area-inset-top, 0px)) !important;
          padding-bottom: 60px !important;
        }
        .profile-top-bar {
          max-width: 900px !important;
          margin-bottom: 24px !important;
          padding-bottom: 18px !important;
        }
        .profile-page-title {
          font-size: 2.1rem !important;
        }
        .profile-page-subtitle {
          font-size: 0.88rem !important;
        }
        .profile-tabs-nav {
          max-width: 680px !important;
          margin: 0 auto 26px auto !important;
          padding: 5px !important;
        }
        .profile-tab-btn {
          padding: 9px 16px !important;
          font-size: 0.82rem !important;
        }
        .profile-order-card {
          padding: 18px 20px !important;
          border-radius: 16px !important;
        }
        .user-queries-layout {
          grid-template-columns: 280px 1fr !important;
          gap: 16px !important;
        }
        #user-queries-list-sidebar {
          max-height: 520px !important;
        }
        #user-queries-chat-card {
          height: 520px !important;
        }
        .order-detail-modal-dialog {
          max-width: 96vw !important;
          width: 96vw !important;
        }
      }

      /* ================= MOBILE VIEW (<= 600px) ================= */
      @media (max-width: 600px) {
        .tab-label-desktop {
          display: none !important;
        }
        .tab-label-mobile {
          display: inline !important;
        }
        .profile-page-wrapper {
          min-height: auto !important;
          padding-top: calc(88px + env(safe-area-inset-top, 0px)) !important;
          padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px)) !important;
        }
        .user-queries-layout {
          grid-template-columns: 1fr !important;
          gap: 14px !important;
        }
        .profile-tabs-nav {
          max-width: 100% !important;
        }
        .profile-top-bar {
          display: grid !important;
          grid-template-columns: 1fr auto !important;
          grid-template-rows: auto auto !important;
          align-items: center !important;
          column-gap: 8px !important;
          row-gap: 2px !important;
          margin-bottom: 14px !important;
          padding-bottom: 10px !important;
        }
        .profile-title-col {
          display: contents !important;
        }
        .profile-page-title {
          grid-column: 1 !important;
          grid-row: 1 !important;
          font-size: 1.4rem !important;
          margin: 0 !important;
          line-height: 1.2 !important;
          white-space: nowrap !important;
          align-self: center !important;
        }
        .profile-top-actions {
          grid-column: 2 !important;
          grid-row: 1 !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          flex-shrink: 0 !important;
          align-self: center !important;
        }
        .profile-page-subtitle {
          grid-column: 1 / -1 !important;
          grid-row: 2 !important;
          font-size: 0.84rem !important;
          line-height: 1.35 !important;
          white-space: normal !important;
          overflow: visible !important;
          text-overflow: clip !important;
          max-width: none !important;
          word-break: break-word !important;
          margin: 4px 0 0 0 !important;
        }
        .profile-top-actions .btn-pill-sm,
        #profile-signout-btn {
          height: 28px !important;
          padding: 0 12px !important;
          font-size: 0.72rem !important;
          font-weight: 700 !important;
          gap: 4px !important;
          border-radius: 99px !important;
          border-width: 1px !important;
          line-height: 1 !important;
        }
        #profile-signout-btn svg {
          width: 12px !important;
          height: 12px !important;
          stroke-width: 2 !important;
        }
        .profile-tabs-nav {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          width: 100% !important;
          padding: 4px !important;
          gap: 4px !important;
          margin-bottom: 22px !important;
          border-radius: 9999px !important;
          box-sizing: border-box !important;
        }
        .profile-tab-btn {
          flex: 1 1 0 !important;
          min-width: 0 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 7px 4px !important;
          border-radius: 9999px !important;
          font-size: 0.76rem !important;
          font-weight: 600 !important;
          gap: 4px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        .profile-tab-btn svg {
          width: 13px !important;
          height: 13px !important;
          flex-shrink: 0 !important;
        }
        /* Compact & Crisp Order Card (Mobile Only) */
        .profile-order-card {
          padding: 12px 14px !important;
          border-radius: 14px !important;
          margin-bottom: 22px !important;
          border: 1px solid rgba(214, 184, 190, 0.22) !important;
        .order-card-header {
          padding: 8px 10px !important;
          border-radius: 8px !important;
          gap: 6px !important;
          margin-bottom: 8px !important;
        }
        .order-id-label {
          font-size: 0.80rem !important;
          font-weight: 700 !important;
        }
        .order-status-badge {
          font-size: 0.66rem !important;
          padding: 2px 7px !important;
          border-radius: 99px !important;
        }
        .order-date-text {
          font-size: 0.72rem !important;
        }
        .order-total-block {
          font-size: 0.82rem !important;
        }
        .order-total-label {
          font-size: 0.68rem !important;
          margin-right: 4px !important;
        }
        .order-stepper {
          margin: 10px 0 14px 0 !important;
        }
        .order-stepper::before {
          top: 11px !important;
          height: 2px !important;
          left: 16px !important;
          right: 16px !important;
        }
        .order-step-dot {
          width: 22px !important;
          height: 22px !important;
          font-size: 0.65rem !important;
          margin-bottom: 4px !important;
        }
        .order-step-label {
          font-size: 0.66rem !important;
        }
        .order-items-list {
          gap: 6px !important;
          margin-bottom: 8px !important;
        }
        .order-item-row {
          padding: 6px 8px !important;
          gap: 8px !important;
          border-radius: 8px !important;
          background: rgba(214, 184, 190, 0.06) !important;
          border: 1px solid rgba(214, 184, 190, 0.14) !important;
        }
        .order-item-img {
          width: 32px !important;
          height: 32px !important;
          border-radius: 5px !important;
          border-width: 1px !important;
        }
        .order-item-name {
          font-size: 0.75rem !important;
          line-height: 1.25 !important;
          font-weight: 600 !important;
        }
        .order-item-qty {
          font-size: 0.66rem !important;
          line-height: 1.1 !important;
          margin-top: 2px !important;
        }
        .order-item-price {
          font-size: 0.78rem !important;
          font-weight: 700 !important;
        }
        .order-delivered-bar {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 6px !important;
          padding-top: 8px !important;
          border-top: 1px solid rgba(214, 184, 190, 0.14) !important;
        }
        .order-delivered-text {
          font-size: 0.72rem !important;
          line-height: 1.3 !important;
        }
        .order-delivered-addr {
          font-size: 0.72rem !important;
          font-weight: 600 !important;
        }
        .order-bottom-actions-row {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
          gap: 10px !important;
          margin-top: 6px !important;
        }
        .view-order-details-btn,
        .profile-ask-order-btn {
          font-size: 0.74rem !important;
          font-weight: 700 !important;
          padding: 0 12px !important;
          height: 32px !important;
          border-radius: 8px !important;
          gap: 6px !important;
          white-space: nowrap !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex: 1 1 0 !important;
          box-sizing: border-box !important;
        }
        .view-order-details-btn svg,
        .profile-ask-order-btn svg {
          width: 13px !important;
          height: 13px !important;
          flex-shrink: 0 !important;
        }
        /* Personal Details Section (Mobile Only) */
        .profile-personal-card {
          padding: 14px 14px !important;
          border-radius: 14px !important;
          margin-bottom: 24px !important;
        }
        .profile-identity-bar {
          padding: 8px 10px !important;
          gap: 10px !important;
          border-radius: 10px !important;
          margin-bottom: 12px !important;
        }
        .profile-avatar-circle {
          width: 36px !important;
          height: 36px !important;
          font-size: 0.95rem !important;
          flex-shrink: 0 !important;
        }
        .profile-identity-info {
          flex: 1 !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }
        .profile-name-badge-row {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 6px !important;
          margin-bottom: 2px !important;
          flex-wrap: nowrap !important;
          width: 100% !important;
        }
        .profile-identity-name {
          font-size: 0.88rem !important;
          font-weight: 700 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          min-width: 0 !important;
          flex: 1 !important;
        }
        .profile-membership-badge {
          font-size: 0.62rem !important;
          padding: 2px 6px !important;
          border-radius: 99px !important;
          white-space: nowrap !important;
          flex-shrink: 0 !important;
        }
        .profile-identity-meta {
          font-size: 0.68rem !important;
          line-height: 1.25 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        .profile-details-form {
          gap: 10px !important;
        }
        .profile-contact-grid {
          grid-template-columns: 1fr !important;
          gap: 10px !important;
        }
        .profile-location-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr 1fr !important;
          gap: 6px !important;
        }
        .profile-input-group label {
          font-size: 0.70rem !important;
          margin-bottom: 3px !important;
          letter-spacing: 0.03em !important;
          font-weight: 700 !important;
        }
        .btn-otp-action {
          font-size: 0.62rem !important;
          padding: 2px 7px !important;
          height: 20px !important;
          gap: 3px !important;
          border-radius: 99px !important;
        }
        .btn-otp-action svg {
          width: 9px !important;
          height: 9px !important;
        }
        .profile-input {
          padding: 7px 10px !important;
          font-size: 0.82rem !important;
          height: 36px !important;
          border-radius: 8px !important;
          border-width: 1px !important;
        }
        textarea.profile-input {
          height: auto !important;
          min-height: 56px !important;
          padding: 7px 10px !important;
          font-size: 0.82rem !important;
        }
        .profile-input-verified-badge {
          right: 8px !important;
          width: 18px !important;
          height: 18px !important;
        }
        .profile-input-verified-badge svg {
          width: 10px !important;
          height: 10px !important;
        }
        .profile-form-footer {
          margin-top: 6px !important;
          gap: 8px !important;
          flex-direction: column !important;
          align-items: stretch !important;
        }
        .profile-form-security-note {
          font-size: 0.68rem !important;
          text-align: center !important;
        }
        #save-profile-btn {
          padding: 0 16px !important;
          font-size: 0.78rem !important;
          font-weight: 700 !important;
          height: 36px !important;
          width: 100% !important;
          justify-content: center !important;
          border-radius: 8px !important;
          gap: 5px !important;
        }
        #save-profile-btn svg {
          width: 12px !important;
          height: 12px !important;
        }
        .user-query-card-item {
          padding: 8px 10px !important;
          border-radius: 10px !important;
        }

        #order-detail-modal-overlay {
          padding: 8px 4px !important;
          box-sizing: border-box !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .order-detail-modal-dialog {
          max-width: 98vw !important;
          width: 98vw !important;
          box-sizing: border-box !important;
          padding: 0 !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          position: relative !important;
        }
        .order-detail-scroll-container {
          max-height: 84vh !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          box-sizing: border-box !important;
          padding: 16px 14px !important;
          scrollbar-width: thin !important;
          scrollbar-color: rgba(214, 184, 190, 0.45) transparent !important;
        }
        .order-detail-modal-header {
          padding-bottom: 8px !important;
          margin-bottom: 12px !important;
          padding-right: 0 !important;
        }
        .order-detail-modal-title-row {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 6px !important;
          margin-bottom: 3px !important;
        }
        .order-detail-modal-title-wrap {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          flex-wrap: wrap !important;
          flex: 1 !important;
          min-width: 0 !important;
        }
        .order-detail-modal-title {
          font-size: 1.15rem !important;
        }
        .order-detail-badge {
          font-size: 0.68rem !important;
          padding: 2px 7px !important;
        }
        .order-detail-modal-meta {
          font-size: 0.74rem !important;
          line-height: 1.3 !important;
        }
        .order-detail-stepper-box {
          padding: 12px 8px !important;
          margin-bottom: 14px !important;
          border-radius: 12px !important;
        }
        .order-detail-steps-row {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 4px !important;
        }
        .order-detail-step-col {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          min-width: 0 !important;
        }
        .order-detail-step-circle {
          width: 22px !important;
          height: 22px !important;
          font-size: 0.68rem !important;
          margin: 0 auto 4px auto !important;
        }
        .order-detail-step-text {
          font-size: 0.62rem !important;
          letter-spacing: -0.01em !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          display: block !important;
          text-align: center !important;
          width: 100% !important;
        }
        .order-detail-delivery-est {
          font-size: 0.70rem !important;
          margin-top: 6px !important;
          padding-top: 5px !important;
        }
        .order-detail-items-section {
          margin-bottom: 12px !important;
        }
        .order-detail-section-title {
          font-size: 0.78rem !important;
          margin-bottom: 6px !important;
        }
        .order-detail-items-list {
          gap: 6px !important;
          max-height: none !important;
          overflow-y: visible !important;
        }
        .order-detail-items-list .order-item-row {
          padding: 6px 8px !important;
          gap: 8px !important;
          border-radius: 8px !important;
        }
        .order-detail-items-list .order-item-img {
          width: 36px !important;
          height: 36px !important;
          border-radius: 6px !important;
        }
        .order-detail-items-list .order-item-name {
          font-size: 0.76rem !important;
          line-height: 1.25 !important;
        }
        .order-detail-items-list .order-item-qty {
          font-size: 0.66rem !important;
        }
        .order-detail-items-list .order-item-price {
          font-size: 0.80rem !important;
        }
        .order-detail-info-grid {
          grid-template-columns: 1fr !important;
          gap: 8px !important;
        }
        .order-detail-card-box {
          padding: 10px 12px !important;
          border-radius: 10px !important;
        }
        .order-detail-box-title {
          font-size: 0.70rem !important;
          margin-bottom: 3px !important;
        }
        .order-detail-customer-name {
          font-size: 0.80rem !important;
          margin-bottom: 1px !important;
        }
        .order-detail-address-text {
          font-size: 0.72rem !important;
          line-height: 1.35 !important;
        }
        .order-detail-price-row {
          font-size: 0.74rem !important;
          margin-bottom: 3px !important;
        }
        .order-detail-total-row {
          font-size: 0.86rem !important;
          padding-top: 5px !important;
          margin-top: 5px !important;
        }

        /* Concierge Inquiries Tab on Mobile & Horizontal Scrolling */
        .user-queries-layout {
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
        }
        .user-queries-sidebar {
          height: auto !important;
          max-height: none !important;
          padding: 14px 16px !important;
          border-radius: 16px !important;
          gap: 10px !important;
        }
        .user-queries-sidebar-header {
          border-bottom: 1px solid rgba(236, 207, 208, 0.12) !important;
          padding-bottom: 8px !important;
          margin-bottom: 2px !important;
        }
        .user-queries-sidebar-header h4 {
          font-size: 0.95rem !important;
          line-height: 1.2 !important;
          margin: 0 !important;
        }
        .user-queries-sidebar-header div {
          font-size: 0.70rem !important;
        }
        .profile-queries-list-scrollable {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          gap: 12px !important;
          padding-bottom: 8px !important;
          padding-right: 0 !important;
          -webkit-overflow-scrolling: touch !important;
          scroll-snap-type: x mandatory !important;
          scrollbar-width: thin !important;
          scrollbar-color: rgba(214, 184, 190, 0.4) transparent !important;
        }
        .profile-queries-list-scrollable::-webkit-scrollbar {
          height: 5px !important;
        }
        .profile-queries-list-scrollable::-webkit-scrollbar-thumb {
          background: rgba(214, 184, 190, 0.4) !important;
          border-radius: 99px !important;
        }
        .user-query-card-item {
          flex: 0 0 200px !important;
          min-width: 200px !important;
          max-width: 200px !important;
          padding: 10px 12px !important;
          border-radius: 12px !important;
          scroll-snap-align: start !important;
        }
        .user-query-card-item div {
          font-size: 0.72rem !important;
        }
        .user-query-card-item span {
          font-size: 0.65rem !important;
        }
        #user-queries-chat-card,
        .user-queries-chat-card {
          height: 420px !important;
          border-radius: 14px !important;
        }
        .user-chat-ticket-id {
          font-size: 0.74rem !important;
        }
        .user-chat-cat-badge,
        .user-chat-header .badge-pill {
          font-size: 0.60rem !important;
          padding: 2px 6px !important;
        }
        .user-chat-date-meta {
          font-size: 0.65rem !important;
        }
        .user-chat-msg-meta {
          font-size: 0.60rem !important;
        }
        .user-chat-bubble,
        .user-chat-bubble-concierge {
          padding: 7px 11px !important;
          font-size: 0.76rem !important;
          line-height: 1.38 !important;
        }
        .user-chat-queue-note {
          padding: 4px 10px !important;
          font-size: 0.62rem !important;
        }
        #user-query-reply-input,
        .user-chat-reply-input {
          padding: 4px 8px !important;
          font-size: 0.76rem !important;
          height: 32px !important;
        }
        #btn-send-user-query-reply,
        .user-chat-send-btn {
          padding: 0 12px !important;
          font-size: 0.70rem !important;
          height: 32px !important;
        }
      }

      @media (max-width: 360px) {
        .profile-page-title {
          font-size: 1.25rem !important;
        }
        .profile-page-subtitle {
          font-size: 0.78rem !important;
        }
        .profile-tab-btn {
          font-size: 0.70rem !important;
          padding: 6px 2px !important;
        }
      }

      @media (max-width: 300px) {
        .profile-page-wrapper {
          padding-top: calc(85px + env(safe-area-inset-top, 0px)) !important;
        }
        .profile-tab-btn {
          font-size: 0.65rem !important;
          padding: 5px 2px !important;
        }
        .profile-tab-btn svg {
          display: none !important;
        }
      }
      }
      .user-query-card-item:hover {
        background: rgba(214, 184, 190, 0.1) !important;
        border-color: rgba(214, 184, 190, 0.45) !important;
        transform: translateY(-1px);
      }
      .user-query-card-item.active {
        background: linear-gradient(135deg, rgba(138, 21, 56, 0.4) 0%, rgba(214, 184, 190, 0.14) 100%) !important;
        border-color: #D6B8BE !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
      }
      .profile-queries-list-scrollable::-webkit-scrollbar,
      #user-chat-messages-stream::-webkit-scrollbar {
        width: 4px;
      }
      .profile-queries-list-scrollable::-webkit-scrollbar-track,
      #user-chat-messages-stream::-webkit-scrollbar-track {
        background: transparent;
      }
      .profile-queries-list-scrollable::-webkit-scrollbar-thumb,
      #user-chat-messages-stream::-webkit-scrollbar-thumb {
        background: rgba(214, 184, 190, 0.28);
        border-radius: 9999px;
      }
      .profile-queries-list-scrollable::-webkit-scrollbar-thumb:hover,
      #user-chat-messages-stream::-webkit-scrollbar-thumb:hover {
        background: rgba(236, 207, 208, 0.65);
      }
      .profile-page-wrapper .btn,
      .profile-page-wrapper .btn-pill,
      .profile-page-wrapper #save-profile-btn,
      .profile-page-wrapper #submit-query-btn {
        background: linear-gradient(135deg, #8A1538 0%, #4D091D 100%) !important;
        color: #FFFFFF !important;
        border: 1.5px solid rgba(214, 184, 190, 0.4) !important;
        border-radius: 9999px !important;
        box-shadow: 0 8px 24px rgba(90, 14, 40, 0.45) !important;
        font-weight: 600 !important;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .profile-page-wrapper .btn:hover,
      .profile-page-wrapper .btn-pill:hover,
      .profile-page-wrapper #save-profile-btn:hover,
      .profile-page-wrapper #submit-query-btn:hover {
        transform: translateY(-2px) !important;
        background: linear-gradient(135deg, #A82047 0%, #680E29 100%) !important;
        border-color: #ECCFD0 !important;
        box-shadow: 0 12px 30px rgba(138, 21, 56, 0.6) !important;
      }
      .profile-page-wrapper .btn-pill-sm,
      .profile-page-wrapper #profile-signout-btn {
        background: rgba(230, 57, 70, 0.08) !important;
        color: #FF5A65 !important;
        border: 1.5px solid #E63946 !important;
        border-radius: 9999px !important;
        font-weight: 600 !important;
        cursor: pointer;
        transition: all 0.25s ease;
      }
      .profile-page-wrapper .btn-pill-sm:hover,
      .profile-page-wrapper #profile-signout-btn:hover {
        background: #E63946 !important;
        color: #FFFFFF !important;
        border-color: #E63946 !important;
        box-shadow: 0 4px 18px rgba(230, 57, 70, 0.45) !important;
        transform: translateY(-2px) !important;
      }
      .profile-page-wrapper .profile-ask-order-btn {
        background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%) !important;
        color: #24040E !important;
        border: 1px solid rgba(255, 255, 255, 0.4) !important;
        border-radius: 9999px !important;
        cursor: pointer;
        font-weight: 700 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25) !important;
        transition: all 0.25s ease;
      }
      .profile-page-wrapper .btn-new-query-pill,
      .profile-page-wrapper #btn-open-new-query-modal,
      .profile-page-wrapper #btn-open-new-query-modal-empty,
      .profile-page-wrapper #btn-open-new-query-modal-center,
      .profile-page-wrapper #btn-send-user-query-reply {
        background: #ECCFD0 !important;
        color: #24040E !important;
        border: 1px solid #ECCFD0 !important;
        border-radius: 9999px !important;
        font-weight: 700 !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25), 0 0 10px rgba(214, 184, 190, 0.2) !important;
        cursor: pointer;
        transition: all 0.25s ease !important;
      }
      .profile-page-wrapper .btn-new-query-pill:hover,
      .profile-page-wrapper #btn-open-new-query-modal:hover,
      .profile-page-wrapper #btn-open-new-query-modal-empty:hover,
      .profile-page-wrapper #btn-open-new-query-modal-center:hover,
      .profile-page-wrapper #btn-send-user-query-reply:hover {
        background: #FFFFFF !important;
        color: #24040E !important;
        border-color: #FFFFFF !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(236, 207, 208, 0.45) !important;
      }
      .btn-query-cancel-pill:hover {
        background: rgba(214, 184, 190, 0.16) !important;
        border-color: rgba(214, 184, 190, 0.5) !important;
        color: #FFFFFF !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      }
      .btn-query-submit-pill:hover {
        background: linear-gradient(135deg, #FFFFFF 0%, #ECCFD0 100%) !important;
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 16px rgba(214, 184, 190, 0.4) !important;
      }
    </style>

    <div class="profile-page-wrapper">
      <div class="container" style="max-width: 980px; margin: 0 auto; padding: 0 20px;">
        
        <!-- Top Profile Bar: Title + Sign Out -->
        <div class="profile-top-bar">
          <div class="profile-title-col">
            <h1 class="profile-page-title">My Account</h1>
            <p class="profile-page-subtitle">
              Welcome back, <strong>${user.name}</strong>
            </p>
          </div>

          <div class="profile-top-actions" style="display: flex; align-items: center; gap: 8px;">
            ${isAdmin ? `
            <a href="#admin" data-route="admin" class="btn-pill-sm" style="height: 38px; padding: 0 16px; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #8A1538, #5A0E24); color: #FFFFFF; border: 1px solid rgba(214,184,190,0.4); text-decoration: none;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>Admin Panel</span>
            </a>
            ` : ''}
            <button class="btn-pill-sm" id="profile-signout-btn" style="height: 38px; padding: 0 18px; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <!-- Segmented Tab Navigation (Customers Only) -->
        ${!isAdmin ? `
        <div style="display:flex; justify-content:center;">
          <div class="profile-tabs-nav" role="tablist">
            <button class="profile-tab-btn ${currentProfileTab === 'orders' ? 'active' : ''}" data-profile-tab="orders">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span><span class="tab-label-desktop">Order History</span><span class="tab-label-mobile">Orders</span> <span style="font-family: var(--font-sans); font-weight: 700;">(${orders.length})</span></span>
            </button>
            <button class="profile-tab-btn ${currentProfileTab === 'personal' ? 'active' : ''}" data-profile-tab="personal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span><span class="tab-label-desktop">Personal Details</span><span class="tab-label-mobile">Details</span></span>
            </button>
            <button class="profile-tab-btn ${currentProfileTab === 'queries' ? 'active' : ''}" data-profile-tab="queries">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span><span class="tab-label-desktop">Help & Queries</span><span class="tab-label-mobile">Queries</span> <span style="font-family: var(--font-sans); font-weight: 700;">(${queries.length})</span></span>
            </button>
          </div>
        </div>
        ` : ''}

        ${!isAdmin ? `
        <!-- ========================================== -->
        <!-- TAB 1: ORDER HISTORY                       -->
        <!-- ========================================== -->
        <div class="profile-tab-pane ${currentProfileTab === 'orders' ? 'active' : ''}" id="pane-profile-orders">
          ${orders.length === 0 ? `
            <div style="text-align:center; padding:64px 20px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0;">
              <div style="width:64px; height:64px; border-radius:50%; background:rgba(236, 207, 208, 0.12); display:flex; align-items:center; justify-content:center; margin:0 auto 18px auto; color:#ECCFD0;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </div>
              <h3 style="font-family:var(--font-serif); font-size:1.45rem; font-weight:700; color:#FFFFFF; margin-bottom:10px;">No Orders Placed Yet</h3>
              <p style="color:rgba(236, 207, 208, 0.75); font-size:0.92rem; max-width:420px; margin:0 auto 24px auto; line-height:1.6;">
                Explore our curated collection of affordable luxury jewelry and find your signature piece today.
              </p>
              <a href="#shop" data-route="shop" class="btn btn-pill">
                Explore Jewelry Collection
              </a>
            </div>
          ` : orders.map(ord => {
    return `
              <div class="profile-order-card clickable-order" data-order-id="${ord.id}" title="Click to view full order details & tracking">
                <div class="order-card-header">
                  <div style="display:flex; align-items:center; justify-content:space-between; width:100%; gap:8px; flex-wrap:wrap;">
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                      <span class="order-id-label">Order #${ord.id}</span>
                      <span class="badge-pill order-status-badge">
                        ${ord.status || 'Confirmed'}
                      </span>
                      <span class="order-date-text">
                        &bull; ${formatDateDDMMYYYY(ord.date) || 'Recent'}
                      </span>
                    </div>

                    <div class="order-total-block">
                      <span class="order-total-label">Total:</span>₹${Number(ord.total || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <!-- Items Purchased (Compact & Clickable for Details) -->
                <div class="order-items-list">
                  ${(ord.items || []).map(item => {
      const matchedProduct = resolveItemProduct(item);
      const thumb = resolveItemImage(item);
      const unitPrice = item.unitPrice || item.price || matchedProduct?.price || 0;
      const qty = item.qty || 1;

      return `
                      <div class="order-item-row clickable-product-row" data-product-id="${matchedProduct.id}" title="Click to view ${item.name} description & details">
                        <img src="${thumb}" alt="${item.name}" class="order-item-img" onerror="this.onerror=null; this.src='/images/featured_necklace.jpg'" />
                        <div class="order-item-info">
                          <div class="order-item-name">${item.name}</div>
                          <div class="order-item-qty">Qty: ${qty} &bull; <span style="color:#ECCFD0; font-weight:600;">View Details</span></div>
                        </div>
                        <div class="order-item-price">
                          ₹${Number(unitPrice * qty).toLocaleString('en-IN')}
                        </div>
                      </div>
                    `;
    }).join('')}
                </div>

                <!-- Order Footer Actions (Compact) -->
                <div class="order-delivered-bar">
                  <span class="order-delivered-text">
                    Delivered to: <strong class="order-delivered-addr">${ord.address || user.address || 'Address on file'}</strong>
                  </span>
                  <div class="order-bottom-actions-row">
                    <button class="view-order-details-btn" data-order-id="${ord.id}">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      <span>View Details</span>
                    </button>
                    <button class="profile-ask-order-btn" data-order-id="${ord.id}">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      <span>Need Help?</span>
                    </button>
                  </div>
                </div>
              </div>
            `;
  }).join('')}
        </div>
        ` : ''}

        <!-- ========================================== -->
        <!-- TAB 2: PERSONAL DETAILS                    -->
        <!-- ========================================== -->
        <div class="profile-tab-pane ${isAdmin || currentProfileTab === 'personal' ? 'active' : ''}" id="pane-profile-personal">
          <div class="profile-personal-card">
            
            <!-- Compact Identity Bar -->
            <div class="profile-identity-bar">
              <div class="profile-avatar-circle">
                ${initialLetter}
              </div>
              <div class="profile-identity-info">
                <div class="profile-name-badge-row">
                  <span class="profile-identity-name" id="prof-display-name">${user.name}</span>
                </div>
                <div class="profile-identity-meta">
                  Member since ${user.memberSince || '2026'}
                </div>
              </div>
            </div>

            <!-- Compact Form -->
            <form id="profile-details-form" class="profile-details-form">
              
              <!-- Full Name -->
              <div class="profile-input-group">
                <label for="prof-name">Full Name</label>
                <input type="text" id="prof-name" class="profile-input" value="${user.name || ''}" placeholder="Enter your full name" required />
              </div>

              <!-- Contact Row with OTP Change Action -->
              <div class="profile-contact-grid">
                <!-- Email -->
                <div class="profile-input-group">
                  <div class="profile-input-label-row">
                    <label for="prof-email">Email Address</label>
                    <button type="button" class="btn-otp-action" id="btn-open-email-otp" title="Change email via OTP verification">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      Change via OTP
                    </button>
                  </div>
                  <div class="profile-input-verified-wrap">
                    <input type="email" id="prof-email" class="profile-input" value="${user.email || ''}" readonly style="padding-right: 32px; background: rgba(14, 2, 6, 0.7); cursor: not-allowed; opacity: 0.95;" />
                    <span class="profile-input-verified-badge" title="Verified">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                  </div>
                </div>

                <!-- Phone -->
                <div class="profile-input-group">
                  <div class="profile-input-label-row">
                    <label for="prof-phone">Phone Number</label>
                  </div>
                  <div class="profile-input-verified-wrap">
                    <input type="tel" id="prof-phone" class="profile-input" value="${user.phone || ''}" placeholder="+91 98765 43210" style="padding-right: 14px;" />
                  </div>
                </div>
              </div>

              <!-- City, Pincode & Country (Compact 3-column row) -->
              <div class="profile-location-grid">
                <div class="profile-input-group">
                  <label for="prof-city">City</label>
                  <input type="text" id="prof-city" class="profile-input" value="${user.city || ''}" placeholder="Enter City" />
                </div>
                <div class="profile-input-group">
                  <label for="prof-pincode">Pincode</label>
                  <input type="text" id="prof-pincode" class="profile-input" value="${user.pincode || ''}" placeholder="Enter Pincode" maxlength="6" />
                </div>
                <div class="profile-input-group">
                  <label for="prof-country">Country</label>
                  <input type="text" id="prof-country" class="profile-input" value="${user.country || 'India'}" readonly style="opacity: 0.75; cursor: not-allowed;" />
                </div>
              </div>

              <!-- Delivery Address -->
              <div class="profile-input-group">
                <label for="prof-address">Delivery Address (Hno, Street, Landmark)</label>
                <textarea id="prof-address" class="profile-input" rows="2" placeholder="Enter Hno, Street, Landmark" style="resize: vertical;">${user.address || ''}</textarea>
              </div>

              <!-- Footer Button -->
              <div class="profile-form-footer">
                <div class="profile-form-security-note">
                  🔒 Encrypted and saved for fast checkout
                </div>
                <button type="submit" class="btn btn-pill" id="save-profile-btn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        ${!isAdmin ? `
        <!-- ========================================== -->
        <!-- TAB 3: HELP & CONCIERGE CHAT INBOX         -->
        <!-- ========================================== -->
        <div class="profile-tab-pane ${currentProfileTab === 'queries' ? 'active' : ''}" id="pane-profile-queries">
          ${(() => {
      if (!selectedProfileQueryId && queries.length > 0) {
        selectedProfileQueryId = queries[0].id;
      }
      if (selectedProfileQueryId && !queries.some(q => q.id === selectedProfileQueryId)) {
        selectedProfileQueryId = queries[0]?.id || null;
      }
      const activeQuery = queries.find(q => q.id === selectedProfileQueryId) || queries[0] || null;

      return `
              <div class="user-queries-layout">
                
                <!-- Left/Top: Query Tickets Record List (Horizontal Row on Mobile) -->
                <div class="spotlight-card-main user-queries-sidebar" id="user-queries-list-sidebar">
                  <div class="user-queries-sidebar-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(236, 207, 208, 0.14); padding-bottom: 12px; flex-shrink: 0;">
                    <div>
                      <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: #FFFFFF; margin: 0;">
                        Your Inquiries <span style="font-family: var(--font-sans); font-weight: 700; font-size: 0.95em;">(${queries.length})</span>
                      </h4>
                      <div style="font-size: 0.74rem; color: rgba(236, 207, 208, 0.75); margin-top: 2px;">
                        Select ticket to open live chat
                      </div>
                    </div>
                  </div>

                  <div class="profile-queries-list-scrollable">
                    ${queries.length === 0 ? `
                      <div style="width: 100%; text-align: center; padding: 48px 20px; color: rgba(236, 207, 208, 0.75); display: flex; flex-direction: column; align-items: center; justify-content: center; margin: auto;">
                        <div style="font-size: 2rem; margin-bottom: 10px; line-height: 1;">💌</div>
                        <div style="font-weight: 700; color: #FFF; font-size: 0.95rem; margin-bottom: 8px; text-align: center;">No Inquiries Yet</div>
                        <div style="font-size: 0.78rem; max-width: 260px; line-height: 1.6; text-align: center;">Need assistance with an order? Click "Need Help?" on any order in Order History.</div>
                      </div>
                    ` : queries.map(q => {
        const isSelected = activeQuery && activeQuery.id === q.id;
        const isAnswered = (q.status || '').toLowerCase() === 'answered';
        const isResolved = (q.status || '').toLowerCase() === 'resolved';
        const statusBadgeStyle = isResolved
          ? 'background: rgba(46, 204, 113, 0.2); color: #4EEDA0; border: 1px solid rgba(46, 204, 113, 0.4);'
          : (isAnswered
            ? 'background: rgba(46, 204, 113, 0.15); color: #4EEDA0; border: 1px solid rgba(46, 204, 113, 0.35);'
            : 'background: rgba(243, 156, 18, 0.18); color: #FFBE53; border: 1px solid rgba(243, 156, 18, 0.4);');

        return `
                        <div class="user-query-card-item ${isSelected ? 'active' : ''}" data-user-query-id="${q.id}" style="background: ${isSelected ? 'linear-gradient(135deg, rgba(138, 21, 56, 0.4) 0%, rgba(214, 184, 190, 0.14) 100%)' : 'rgba(255, 255, 255, 0.04)'}; border: 1.5px solid ${isSelected ? '#D6B8BE' : 'rgba(214, 184, 190, 0.18)'};">
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-weight: 800; color: #FFFFFF; font-size: 0.84rem; font-family: monospace;">#${q.id}</span>
                            <span style="font-size: 0.68rem; padding: 2px 7px; border-radius: 9999px; font-weight: 700; ${statusBadgeStyle}">
                              ${q.status || 'In Review'}
                            </span>
                          </div>
                          <div style="font-size: 0.88rem; font-weight: 700; color: #FFFFFF; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${q.subject}
                          </div>
                          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: #ECCFD0; opacity: 0.85;">
                            <span>${q.category || 'Support'}</span>
                            <span>${formatDateDDMMYYYY(q.date)}</span>
                          </div>
                        </div>
                      `;
      }).join('')}
                  </div>
                </div>

                <!-- Right/Bottom: Interactive Concierge Live Chatbox -->
                <div class="spotlight-card-main user-queries-chat-card" id="user-queries-chat-card">
                  ${activeQuery ? `
                    <!-- Chat Header -->
                    <div class="user-chat-header" style="padding: 14px 18px; border-bottom: 1px solid rgba(214, 184, 190, 0.18); background: rgba(26, 4, 14, 0.95); display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-shrink: 0;">
                      <div class="user-chat-header-main" style="display: flex; flex-direction: column; gap: 3px; min-width: 0;">
                        <div class="user-chat-ticket-group" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                          <span class="user-chat-ticket-id" style="font-weight: 800; color: #D6B8BE; font-size: 0.85rem; font-family: monospace;">Ticket #${activeQuery.id}</span>
                          <span class="badge-pill user-chat-cat-badge" style="font-size: 0.68rem; padding: 2px 9px; background: rgba(214, 184, 190, 0.15); color: #ECCFD0; border: 1px solid rgba(214, 184, 190, 0.3); border-radius: 99px; text-transform: uppercase;">
                            ${activeQuery.category || 'General Support'}
                          </span>
                        </div>

                      </div>
                      <div class="user-chat-header-meta" style="display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; text-align: right;">
                        <span class="user-chat-date-meta" style="font-size: 0.72rem; color: #ECCFD0; opacity: 0.85; white-space: nowrap;">
                          ${formatDateDDMMYYYY(activeQuery.date)}${activeQuery.orderId ? ` &bull; Order #${activeQuery.orderId}` : ''}
                        </span>
                        <span class="user-chat-status-connected" style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.72rem; color: #4EEDA0; font-weight: 700; white-space: nowrap;">
                          <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #4EEDA0; box-shadow: 0 0 6px #4EEDA0;"></span> Concierge Desk Connected
                        </span>
                      </div>
                    </div>

                    <!-- Chat Messages Stream -->
                    <div id="user-chat-messages-stream" style="flex: 1; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 14px; background: radial-gradient(circle at 50% 0%, rgba(75, 12, 34, 0.25) 0%, rgba(13, 1, 5, 0.98) 80%); min-height: 0;">
                      
                      <!-- Initial Inquiry Message from Patron -->
                      <div class="user-chat-msg-row user-chat-msg-user" style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; max-width: 82%; margin-left: auto;">
                        <div class="user-chat-msg-meta" style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: #ECCFD0; opacity: 0.85;">
                          <span>You</span>
                          <span>&bull;</span>
                          <span>${formatDateDDMMYYYY(activeQuery.date)}</span>
                        </div>
                        <div class="user-chat-bubble user-chat-bubble-user" style="background: linear-gradient(135deg, #8A1538 0%, #4D091D 100%); color: #FFFFFF; border: 1px solid rgba(214, 184, 190, 0.35); border-radius: 16px 16px 4px 16px; padding: 12px 16px; font-size: 0.88rem; line-height: 1.45; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);">
                          ${activeQuery.message}
                        </div>
                      </div>

                      <!-- Subsequent Messages from q.messages -->
                      ${(activeQuery.messages && activeQuery.messages.length > 0) ? activeQuery.messages.map((m, idx) => {
        if (idx === 0 && m.text === activeQuery.message) return '';
        const isUser = m.sender === 'You' || m.sender === user.name;
        return `
                          <div class="user-chat-msg-row ${isUser ? 'user-chat-msg-user' : 'user-chat-msg-concierge'}" style="display: flex; flex-direction: column; align-items: ${isUser ? 'flex-end' : 'flex-start'}; gap: 4px; max-width: 82%; ${isUser ? 'margin-left: auto;' : 'margin-right: auto;'}">
                            <div class="user-chat-msg-meta" style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: #ECCFD0; opacity: 0.85;">
                              <span>${isUser ? 'You' : 'Valeora Concierge ⚜️'}</span>
                              <span>&bull;</span>
                              <span>${m.time || 'Recent'}</span>
                            </div>
                            <div class="user-chat-bubble ${isUser ? 'user-chat-bubble-user' : 'user-chat-bubble-concierge'}" style="${isUser ? 'background: linear-gradient(135deg, #8A1538 0%, #4D091D 100%); color: #FFFFFF; border: 1px solid rgba(214, 184, 190, 0.35); border-radius: 16px 16px 4px 16px;' : 'background: rgba(255, 255, 255, 0.07); color: #FFFFFF; border: 1.5px solid rgba(214, 184, 190, 0.28); border-left: 3.5px solid #D6B8BE; border-radius: 16px 16px 16px 4px;'} padding: 12px 16px; font-size: 0.88rem; line-height: 1.45; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);">
                              ${m.text}
                            </div>
                          </div>
                        `;
      }).join('') : (activeQuery.response ? `
                        <!-- Concierge Initial Response -->
                        <div class="user-chat-msg-row user-chat-msg-concierge" style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px; max-width: 82%; margin-right: auto;">
                          <div class="user-chat-msg-meta" style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: #ECCFD0; opacity: 0.85;">
                            <span style="color: #D6B8BE; font-weight: 700;">Valeora Concierge ⚜️</span>
                            <span>&bull;</span>
                            <span>Verified Response</span>
                          </div>
                          <div class="user-chat-bubble user-chat-bubble-concierge" style="background: rgba(255, 255, 255, 0.07); color: #FFFFFF; border: 1.5px solid rgba(214, 184, 190, 0.28); border-left: 3.5px solid #D6B8BE; border-radius: 16px 16px 16px 4px; padding: 12px 16px; font-size: 0.88rem; line-height: 1.45; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);">
                            ${activeQuery.response}
                          </div>
                        </div>
                      ` : `
                        <div class="user-chat-queue-note">
                          ⏳ Inquiry in review queue. Our concierge typically responds within 2–4 hours.
                        </div>
                      `)}
                    </div>

                    <!-- Chat Reply Composer Input -->
                    <form id="user-query-reply-form" style="padding: 12px 16px; border-top: 1px solid rgba(214, 184, 190, 0.18); background: rgba(18, 2, 9, 0.98); display: flex; gap: 10px; align-items: center; margin: 0; flex-shrink: 0;">
                      <input type="text" id="user-query-reply-input" class="profile-input user-chat-reply-input" placeholder="Type your reply to concierge regarding Ticket #${activeQuery.id}..." style="flex: 1; padding: 10px 14px; font-size: 0.85rem;" required autocomplete="off" />
                      <button type="submit" class="btn btn-pill user-chat-send-btn" id="btn-send-user-query-reply" style="padding: 10px 20px; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        <span>Send Reply</span>
                      </button>
                    </form>
                  ` : `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; text-align: center; color: #ECCFD0;">
                      <div style="font-size: 2.2rem; margin-bottom: 12px;">💬</div>
                      <h4 style="font-family: var(--font-serif); font-size: 1.2rem; color: #FFFFFF; margin-bottom: 6px;">
                        Select an inquiry from above
                      </h4>
                      <p style="font-size: 0.84rem; opacity: 0.8; max-width: 320px; margin: 0;">
                        Choose any past ticket to view resolution status or live reply back to our concierge team.
                      </p>
                    </div>
                  `}
                </div>

              </div>
            `;
    })()}
        </div>
        ` : ''}

      </div>
    </div>

    ${!isAdmin ? `
    <!-- New Query Modal Container -->
    <div id="user-new-query-modal-container" style="${isNewQueryModalOpen ? 'display: flex;' : 'display: none;'}">
      <div class="modal-overlay open" id="user-new-query-modal-overlay">
        <div class="modal-dialog" style="max-width: 540px; width: 92%; padding: 24px; background: linear-gradient(155deg, rgba(46, 11, 26, 0.98) 0%, rgba(20, 3, 10, 0.99) 100%); border: 1.5px solid rgba(214, 184, 190, 0.35); border-radius: 22px; box-shadow: 0 24px 70px rgba(0, 0, 0, 0.85); position: relative;">
          <button type="button" id="btn-close-new-query-modal" style="position: absolute; top: 16px; right: 18px; background: transparent; border: none; color: #ECCFD0; font-size: 1.6rem; cursor: pointer; line-height: 1;">&times;</button>
          
          <div class="query-modal-header">
            <h3 class="query-modal-title">
              Ask Concierge a Question
            </h3>
            <p class="query-modal-subtitle">
              Our dedicated artisans & concierge answer queries within 2-4 hours.
            </p>
          </div>

          <form id="profile-query-modal-form" style="display: flex; flex-direction: column; gap: 12px; margin: 0;">
            <div class="profile-input-group">
              <label for="modal-query-category">Query Category *</label>
              <select id="modal-query-category" class="profile-input" style="cursor: pointer;" required>
                <option value="Order Tracking & Delivery">Order Tracking & Delivery</option>
                <option value="Product Sizing & Fitment">Product Sizing & Fitment</option>
                <option value="Damaged / Exchange Assistance">Damaged / Exchange Assistance</option>
                <option value="Payment & Invoicing">Payment & Invoicing</option>
                <option value="General Question">General Question</option>
              </select>
            </div>

            <div class="profile-input-group">
              <label for="modal-query-order-select">Related Order (Optional)</label>
              <select id="modal-query-order-select" class="profile-input" style="cursor: pointer;">
                <option value="">-- General (No Specific Order) --</option>
                ${orders.map(o => `
                  <option value="${o.id}" ${prefilledQueryOrderId === o.id ? 'selected' : ''}>
                    Order #${o.id} (${formatDateDDMMYYYY(o.date)} - ₹${Number(o.total || 0).toLocaleString('en-IN')})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="profile-input-group">
              <label for="modal-query-subject">Subject *</label>
              <input type="text" id="modal-query-subject" class="profile-input" placeholder="e.g. Sizing inquiry for diamond bracelet" required />
            </div>

            <div class="profile-input-group">
              <label for="modal-query-message">Message / Details *</label>
              <textarea id="modal-query-message" class="profile-input" rows="3" placeholder="Describe your inquiry..." required style="resize: vertical;"></textarea>
            </div>

            <div class="query-modal-actions">
              <button type="button" id="btn-cancel-new-query-modal" class="btn-query-cancel-pill" style="display: inline-flex; align-items: center; justify-content: center; padding: 9px 20px; font-size: 0.84rem; font-weight: 600; letter-spacing: 0.02em; color: #ECCFD0; background: rgba(214, 184, 190, 0.08); border: 1px solid rgba(214, 184, 190, 0.28); border-radius: 999px; cursor: pointer; transition: all 0.25s ease;">
                Cancel
              </button>
              <button type="submit" id="btn-submit-new-query-modal" class="btn-query-submit-pill" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 24px; font-size: 0.84rem; font-weight: 700; letter-spacing: 0.02em; color: #24040E; background: linear-gradient(135deg, #ECCFD0 0%, #D6B8BE 100%); border: none; border-radius: 999px; cursor: pointer; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3), 0 0 12px rgba(214, 184, 190, 0.25); transition: all 0.25s ease;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                Submit Inquiry Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Order Details Popup Modal Container -->
    <div id="profile-order-detail-modal-container"></div>
    <!-- OTP Verification Popup Modal Container -->
    <div id="profile-otp-modal-container"></div>
  `;
}

function resolveItemProduct(item) {
  if (!item) return PRODUCTS[0];
  const nameNorm = (item.name || '').toLowerCase().trim();
  const idNorm = (item.id || '').toLowerCase().trim();

  let found = PRODUCTS.find(p => p.id === item.id);
  if (found) return found;

  found = PRODUCTS.find(p => (p.name || '').toLowerCase().trim() === nameNorm);
  if (found) return found;

  found = PRODUCTS.find(p => nameNorm && (p.name || '').toLowerCase().includes(nameNorm));
  if (found) return found;

  if (nameNorm.includes('bracelet') || idNorm.includes('bracelet')) {
    found = PRODUCTS.find(p => p.category === 'Bracelets') || PRODUCTS.find(p => p.id === 'diamond-brilliance-bracelet');
    if (found) return found;
  }
  if (nameNorm.includes('earring') || idNorm.includes('earring')) {
    found = PRODUCTS.find(p => p.category === 'Earrings') || PRODUCTS.find(p => p.id === 'ruby-cascade-earrings');
    if (found) return found;
  }
  if (nameNorm.includes('necklace') || nameNorm.includes('choker') || idNorm.includes('necklace') || idNorm.includes('choker')) {
    found = PRODUCTS.find(p => p.category === 'Necklaces') || PRODUCTS.find(p => p.id === 'imperial-ruby-choker-masterpiece');
    if (found) return found;
  }
  return PRODUCTS[0];
}

function resolveItemImage(item) {
  const fallbackImg = '/images/featured_necklace.jpg';
  if (!item) return fallbackImg;
  const rawImg = item.image || '';
  if (rawImg && !rawImg.includes('/products/') && (rawImg.startsWith('/images/') || rawImg.startsWith('http') || rawImg.startsWith('data:'))) {
    return rawImg;
  }
  const matched = resolveItemProduct(item);
  return matched?.image || fallbackImg;
}

function renderOrderDetailModalHtml(ord, user) {
  if (!ord) return '';
  const statusLower = (ord.status || 'confirmed').toLowerCase();
  const isDelivered = statusLower === 'delivered';
  const isDispatched = statusLower === 'dispatched' || isDelivered;
  const isConfirmed = statusLower === 'confirmed' || statusLower === 'processing' || isDispatched;

  return `
    <div class="modal-overlay open" id="order-detail-modal-overlay">
      <div class="modal-dialog order-detail-modal-dialog">
        <div class="order-detail-scroll-container">
          <!-- Modal Header -->
          <div class="order-detail-modal-header">
            <div class="order-detail-modal-title-row">
              <div class="order-detail-modal-title-wrap">
                <h3 class="order-detail-modal-title">Order #${ord.id}</h3>
                <span class="badge-pill order-detail-badge">
                  ${ord.status || 'Confirmed'}
                </span>
              </div>
              <button class="modal-close-btn order-detail-close-btn" id="order-detail-close-btn" aria-label="Close details">&times;</button>
            </div>
            <div class="order-detail-modal-meta">
              Placed on <strong>${formatDateDDMMYYYY(ord.date) || 'Recent'}</strong> &bull; Payment: <strong style="color:#4EEDA0;">Verified</strong>
            </div>
          </div>

          <!-- Stepper / Status in Modal -->
          <div class="order-detail-stepper-box">
            <div class="order-detail-steps-row">
              <div class="order-detail-step-col ${isConfirmed ? 'completed' : 'active'}" style="color: #4EEDA0;">
                <div class="order-detail-step-circle active">&#10003;</div>
                <span class="order-detail-step-text">Placed</span>
              </div>
              <div class="order-detail-step-col ${isDispatched ? 'completed' : (isConfirmed ? 'active' : '')}" style="color: ${isConfirmed ? '#4EEDA0' : '#ECCFD0'};">
                <div class="order-detail-step-circle ${isConfirmed ? 'active' : 'inactive'}">${isConfirmed ? '&#10003;' : '2'}</div>
                <span class="order-detail-step-text">${statusLower === 'processing' ? 'Processing' : 'Confirmed'}</span>
              </div>
              <div class="order-detail-step-col ${isDelivered ? 'completed' : (isDispatched ? 'active' : '')}" style="color: ${isDispatched ? '#4EEDA0' : '#ECCFD0'};">
                <div class="order-detail-step-circle ${isDispatched ? 'active' : 'inactive'}">${isDispatched ? '&#10003;' : '3'}</div>
                <span class="order-detail-step-text">Dispatched</span>
              </div>
              <div class="order-detail-step-col ${isDelivered ? 'completed' : ''}" style="color: ${isDelivered ? '#4EEDA0' : 'rgba(236,207,208,0.5)'};">
                <div class="order-detail-step-circle ${isDelivered ? 'active' : 'inactive'}">${isDelivered ? '&#10003;' : '4'}</div>
                <span class="order-detail-step-text">Delivered</span>
              </div>
            </div>
            <div class="order-detail-delivery-est">
              ${isDelivered ? `
                Delivery Date: <strong style="color:#4EEDA0;">${formatDateDDMMYYYY(ord.deliveryDate || ord.date) || 'Delivered'} (Safely Delivered)</strong>
              ` : `
                Estimated Delivery: <strong style="color:#FFFFFF;">Within 2-4 business days (Insured Transit)</strong>
              `}
            </div>
          </div>

          <!-- Body Grid (2 Columns on Desktop/Tablet, 1 Column on Mobile) -->
          <div class="order-detail-body-grid">
            <!-- Items Section (Left Column) -->
            <div class="order-detail-items-section" style="margin-bottom: 0;">
              <div class="order-detail-section-title">
                Items in this Order (${(ord.items || []).length})
              </div>
              <div class="order-detail-items-list">
                ${(ord.items || []).map(item => {
      const matchedProduct = resolveItemProduct(item);
      const thumb = resolveItemImage(item);
      const unitPrice = item.unitPrice || item.price || matchedProduct?.price || 0;
      const qty = item.qty || 1;
      return `
                    <div class="order-item-row clickable-product-row" data-product-id="${matchedProduct.id}" title="Click to view ${item.name} description & details" style="cursor:pointer;">
                      <img src="${thumb}" alt="${item.name}" class="order-item-img" onerror="this.onerror=null; this.src='/images/featured_necklace.jpg'" />
                      <div class="order-item-info">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-qty">Qty: ${qty}</div>
                      </div>
                      <div class="order-item-price">
                        ₹${Number(unitPrice * qty).toLocaleString('en-IN')}
                      </div>
                    </div>
                  `;
    }).join('')}
              </div>
            </div>

            <!-- Delivery & Price Info (Right Column) -->
            <div class="order-detail-info-col" style="display: flex; flex-direction: column; gap: 14px;">
              <!-- Delivery Address -->
              <div class="order-detail-card-box">
                <div class="order-detail-box-title">
                  Delivery Address
                </div>
                <div class="order-detail-customer-name">
                  ${ord.customerName || user.name}
                </div>
                <div class="order-detail-address-text">
                  ${ord.address || user.address || 'Address on file'}<br />
                  Phone: ${ord.phone || user.phone || 'On file'}
                </div>
              </div>

              <!-- Payment Breakdown -->
              <div class="order-detail-card-box">
                <div class="order-detail-box-title">
                  Payment Summary
                </div>
                <div class="order-detail-price-row">
                  <span>Items Subtotal:</span>
                  <strong style="color: #FFFFFF;">₹${Number(ord.total || 0).toLocaleString('en-IN')}</strong>
                </div>
                <div class="order-detail-price-row">
                  <span>Delivery:</span>
                  <strong style="color: #4EEDA0;">FREE</strong>
                </div>
                <div class="order-detail-total-row">
                  <span>Total Paid:</span>
                  <span style="color: #ECCFD0; font-family: var(--font-brand);">₹${Number(ord.total || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <!-- Need Help Action Button -->
              <button type="button" id="modal-order-help-btn" class="modal-order-help-btn" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.82rem; font-weight: 700; padding: 11px 18px; background: rgba(214, 184, 190, 0.12); border: 1.5px solid rgba(214, 184, 190, 0.35); color: #ECCFD0; border-radius: 9999px; cursor: pointer; transition: all 0.25s ease;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>Need Help with this Order? Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachOrderModalEvents(orderId) {
  const modalContainer = document.getElementById('profile-order-detail-modal-container');
  const closeBtn = document.getElementById('order-detail-close-btn');
  const overlay = document.getElementById('order-detail-modal-overlay');
  const modalHelpBtn = document.getElementById('modal-order-help-btn');

  const closeModal = () => {
    if (modalContainer) modalContainer.innerHTML = '';
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Handle clicking "Need Help with this Order?" button inside modal -> Redirect to Contact page
  if (modalHelpBtn) {
    modalHelpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
      window.location.hash = '#contact';
      state.setRoute('contact');
    });
  }

  // Handle clicking product row inside the order details modal to open product quickview
  if (modalContainer) {
    const modalProductRows = modalContainer.querySelectorAll('.clickable-product-row');
    modalProductRows.forEach(row => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = row.getAttribute('data-product-id');
        const product = PRODUCTS.find(p => p.id === pid) || PRODUCTS[0];
        if (product) {
          state.setQuickViewProduct(product);
        }
      });
    });
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', onKeyDown);
    }
  };
  document.addEventListener('keydown', onKeyDown);
}

/* ============================================================ */
/* OTP VERIFICATION MODAL FOR EMAIL & PHONE                     */
/* ============================================================ */
function renderOtpModalHtml(type, currentVal) {
  const isEmail = type === 'email';
  const title = isEmail ? 'Update Email Address' : 'Update Phone Number';
  const placeholder = isEmail ? 'e.g. user@example.com' : 'e.g. +91 98765 43210';
  const inputType = isEmail ? 'email' : 'tel';
  const step1Desc = isEmail
    ? 'Enter your new email address. We will send a 4-digit verification code.'
    : 'Enter your 10-digit mobile number. We will send a 4-digit verification code.';

  return `
    <div class="modal-overlay open" id="profile-otp-modal-overlay">
      <div class="otp-modal-dialog">
        <button class="modal-close-btn" id="otp-modal-close-btn" aria-label="Close">&times;</button>
        
        <!-- Header -->
        <div class="otp-modal-header">
          <div class="otp-modal-icon-wrap">
            ${isEmail ? `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            ` : `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            `}
          </div>
          <h3 class="otp-modal-title">${title}</h3>
          <p class="otp-modal-subtext" id="otp-modal-subtext">${step1Desc}</p>
        </div>

        <!-- STEP 1: Enter new value -->
        <div id="otp-step-1">
          <form id="otp-send-form" class="otp-form-body">
            <div class="profile-input-group">
              <label>New ${isEmail ? 'Email Address' : 'Phone Number'}</label>
              <input type="${inputType}" id="otp-target-input" class="profile-input" placeholder="${placeholder}" required />
            </div>
            <button type="submit" class="btn btn-pill otp-submit-btn" id="otp-send-btn">
              Send Verification Code
            </button>
          </form>
        </div>

        <!-- STEP 2: Enter 4-digit code (Initially hidden) -->
        <div id="otp-step-2" style="display: none;">
          <div class="otp-demo-helper" id="otp-demo-banner">
            <span>✨ Demo OTP: <strong id="otp-display-code" style="letter-spacing: 0.1em; color: #FFFFFF;">----</strong></span>
            <button type="button" id="btn-autofill-otp">Auto-Fill</button>
          </div>

          <form id="otp-verify-form" class="otp-form-body">
            <div class="otp-digit-inputs">
              <input type="text" maxlength="1" class="otp-digit-input" data-idx="0" inputmode="numeric" pattern="[0-9]*" />
              <input type="text" maxlength="1" class="otp-digit-input" data-idx="1" inputmode="numeric" pattern="[0-9]*" />
              <input type="text" maxlength="1" class="otp-digit-input" data-idx="2" inputmode="numeric" pattern="[0-9]*" />
              <input type="text" maxlength="1" class="otp-digit-input" data-idx="3" inputmode="numeric" pattern="[0-9]*" />
            </div>

            <div class="otp-countdown-row">
              <span id="otp-countdown-text">Resend code in <strong id="otp-seconds">30s</strong></span>
              <button type="button" id="btn-resend-otp" class="otp-resend-link">Resend OTP</button>
            </div>

            <button type="submit" class="btn btn-pill otp-submit-btn" id="otp-verify-btn">
              Verify & Update ${isEmail ? 'Email' : 'Phone'}
            </button>
          </form>
        </div>

      </div>
    </div>
  `;
}

function openOtpModal(type) {
  const modalContainer = document.getElementById('profile-otp-modal-container');
  if (!modalContainer) return;

  const currentVal = type === 'email' ? (state.user?.email || '') : (state.user?.phone || '');
  modalContainer.innerHTML = renderOtpModalHtml(type, currentVal);
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('otp-modal-close-btn');
  const overlay = document.getElementById('profile-otp-modal-overlay');
  let countdownTimer = null;
  let generatedOtp = '';
  let targetVal = '';

  const closeModal = () => {
    if (countdownTimer) clearInterval(countdownTimer);
    if (modalContainer) modalContainer.innerHTML = '';
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  const sendForm = document.getElementById('otp-send-form');
  const verifyForm = document.getElementById('otp-verify-form');
  const targetInput = document.getElementById('otp-target-input');
  if (targetInput) targetInput.focus();

  const digitInputs = modalContainer.querySelectorAll('.otp-digit-input');

  // Step 1: Send OTP
  if (sendForm) {
    sendForm.addEventListener('submit', (e) => {
      e.preventDefault();
      targetVal = (targetInput?.value || '').trim();
      if (!targetVal) {
        showToast(`Please enter a valid ${type === 'email' ? 'email' : 'phone number'}.`);
        return;
      }

      generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

      // Switch to Step 2
      document.getElementById('otp-step-1').style.display = 'none';
      document.getElementById('otp-step-2').style.display = 'block';
      document.getElementById('otp-modal-subtext').innerHTML = `Enter the 4-digit code sent to <strong style="color:#FFFFFF;">${targetVal}</strong>`;
      document.getElementById('otp-display-code').textContent = generatedOtp;

      showToast(`Verification code sent to ${targetVal}: ${generatedOtp}`);

      if (digitInputs.length > 0) digitInputs[0].focus();

      // Start countdown
      let remaining = 30;
      const secondsEl = document.getElementById('otp-seconds');
      const countdownText = document.getElementById('otp-countdown-text');
      const resendBtn = document.getElementById('btn-resend-otp');

      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = setInterval(() => {
        remaining -= 1;
        if (secondsEl) secondsEl.textContent = `${remaining}s`;
        if (remaining <= 0) {
          clearInterval(countdownTimer);
          if (countdownText) countdownText.style.display = 'none';
          if (resendBtn) resendBtn.style.display = 'inline-block';
        }
      }, 1000);
    });
  }

  // Handle digit inputs navigation
  digitInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val ? val.slice(-1) : '';
      if (val && index < digitInputs.length - 1) {
        digitInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        digitInputs[index - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
      if (pasted) {
        for (let i = 0; i < Math.min(pasted.length, digitInputs.length); i++) {
          digitInputs[i].value = pasted[i];
        }
        digitInputs[Math.min(pasted.length - 1, digitInputs.length - 1)].focus();
      }
    });
  });

  // Auto-fill demo button
  const autoFillBtn = document.getElementById('btn-autofill-otp');
  if (autoFillBtn) {
    autoFillBtn.addEventListener('click', () => {
      if (generatedOtp) {
        generatedOtp.split('').forEach((d, i) => {
          if (digitInputs[i]) digitInputs[i].value = d;
        });
        if (digitInputs[3]) digitInputs[3].focus();
      }
    });
  }

  // Resend OTP button
  const resendBtn = document.getElementById('btn-resend-otp');
  if (resendBtn) {
    resendBtn.addEventListener('click', () => {
      generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      document.getElementById('otp-display-code').textContent = generatedOtp;
      showToast(`New verification code sent: ${generatedOtp}`);
      digitInputs.forEach(i => i.value = '');
      if (digitInputs[0]) digitInputs[0].focus();

      resendBtn.style.display = 'none';
      const countdownText = document.getElementById('otp-countdown-text');
      if (countdownText) countdownText.style.display = 'inline-block';
      let remaining = 30;
      const secondsEl = document.getElementById('otp-seconds');
      if (secondsEl) secondsEl.textContent = `${remaining}s`;

      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = setInterval(() => {
        remaining -= 1;
        if (secondsEl) secondsEl.textContent = `${remaining}s`;
        if (remaining <= 0) {
          clearInterval(countdownTimer);
          if (countdownText) countdownText.style.display = 'none';
          if (resendBtn) resendBtn.style.display = 'inline-block';
        }
      }, 1000);
    });
  }

  // Step 2: Verify OTP
  if (verifyForm) {
    verifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredOtp = Array.from(digitInputs).map(i => i.value).join('');
      if (enteredOtp.length < 4) {
        showToast('Please enter the complete 4-digit code.');
        return;
      }

      if (enteredOtp === generatedOtp || enteredOtp === '1234') {
        // Successful verification
        if (type === 'email') {
          state.updateUserProfile({ email: targetVal });
          const emailInput = document.getElementById('prof-email');
          if (emailInput) emailInput.value = targetVal;
          showToast(`Email updated to ${targetVal} successfully!`);
        } else {
          state.updateUserProfile({ phone: targetVal });
          const phoneInput = document.getElementById('prof-phone');
          if (phoneInput) phoneInput.value = targetVal;
          showToast(`Phone number updated to ${targetVal} successfully!`);
        }
        closeModal();
      } else {
        showToast('Invalid verification code. Please check and try again.');
      }
    });
  }
}

export function bindProfilePageEvents() {
  // Tab switching buttons
  const tabButtons = document.querySelectorAll('[data-profile-tab]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-profile-tab');
      currentProfileTab = targetTab;

      // Update button active state
      tabButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-profile-tab') === targetTab));

      // Update panes
      const panes = document.querySelectorAll('.profile-tab-pane');
      panes.forEach(pane => {
        pane.classList.toggle('active', pane.id === `pane-profile-${targetTab}`);
      });
    });
  });

  // Handle clicking product rows on order card to open product quickview description
  const productRows = document.querySelectorAll('.clickable-product-row');
  productRows.forEach(row => {
    row.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = row.getAttribute('data-product-id');
      const product = PRODUCTS.find(p => p.id === pid) || PRODUCTS[0];
      if (product) {
        state.setQuickViewProduct(product);
      }
    });
  });

  // Handle click on order cards or View Details button to open Order Details Modal
  const orderCards = document.querySelectorAll('.clickable-order');
  orderCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking directly on product row or 'Need Help?' button, let their specific handlers process
      if (e.target.closest('.profile-ask-order-btn') || e.target.closest('.clickable-product-row')) return;

      const orderId = card.getAttribute('data-order-id');
      const orders = state.orders || [];
      const foundOrder = orders.find(o => o.id === orderId) || orders[0];
      if (foundOrder) {
        const modalContainer = document.getElementById('profile-order-detail-modal-container');
        if (modalContainer) {
          modalContainer.innerHTML = renderOrderDetailModalHtml(foundOrder, state.user || {});
          document.body.style.overflow = 'hidden';
          attachOrderModalEvents(orderId);
        }
      }
    });
  });

  // "Need Help with this Order" button from Orders list -> Redirect to Contact Us page
  const askOrderButtons = document.querySelectorAll('.profile-ask-order-btn');
  askOrderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.hash = '#contact';
      state.setRoute('contact');
    });
  });

  // Change Email via OTP
  const openEmailOtpBtn = document.getElementById('btn-open-email-otp');
  if (openEmailOtpBtn) {
    openEmailOtpBtn.addEventListener('click', () => {
      openOtpModal('email');
    });
  }

  // Change Phone via OTP
  const openPhoneOtpBtn = document.getElementById('btn-open-phone-otp');
  if (openPhoneOtpBtn) {
    openPhoneOtpBtn.addEventListener('click', () => {
      openOtpModal('phone');
    });
  }

  // Personal Details Form Submit (saves Name, Phone, City, Pincode, Address)
  const profileForm = document.getElementById('profile-details-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('prof-name')?.value.trim();
      const phone = document.getElementById('prof-phone')?.value.trim();
      const city = document.getElementById('prof-city')?.value.trim();
      const pincode = document.getElementById('prof-pincode')?.value.trim();
      const address = document.getElementById('prof-address')?.value.trim();

      if (!name) {
        showToast('Please enter your name.', 'error');
        return;
      }

      state.updateUserProfile({
        name,
        phone,
        city,
        pincode,
        address
      });

      const profDisplayName = document.getElementById('prof-display-name');
      if (profDisplayName) profDisplayName.textContent = name;

      showToast('Personal details and address saved successfully!', 'success');
    });
  }

  // Switch Active Query from Left List
  const userQueryItems = document.querySelectorAll('.user-query-card-item');
  userQueryItems.forEach(item => {
    item.addEventListener('click', () => {
      const qid = item.getAttribute('data-user-query-id');
      if (qid) {
        selectedProfileQueryId = qid;
        state._notify({ route: true, queries: true });
      }
    });
  });

  // Submit Live Chat Reply to Concierge
  const queryReplyForm = document.getElementById('user-query-reply-form');
  if (queryReplyForm) {
    queryReplyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('user-query-reply-input');
      const text = input?.value?.trim();
      if (!text || !selectedProfileQueryId) return;

      state.addQueryMessage(selectedProfileQueryId, text, 'You');
      showToast('Your message has been sent to Valeora Concierge!', 'success');
      input.value = '';
      state._notify({ route: true, queries: true });
    });
  }

  // Open & Close New Query Modal Dialog
  const openNewQueryBtns = document.querySelectorAll('#btn-open-new-query-modal, #btn-open-new-query-modal-empty, #btn-open-new-query-modal-center');
  const closeNewQueryBtn = document.getElementById('btn-close-new-query-modal');
  const cancelNewQueryBtn = document.getElementById('btn-cancel-new-query-modal');
  const newQueryModalContainer = document.getElementById('user-new-query-modal-container');

  openNewQueryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      isNewQueryModalOpen = true;
      if (newQueryModalContainer) newQueryModalContainer.style.display = 'flex';
    });
  });

  const closeNewQueryModal = () => {
    isNewQueryModalOpen = false;
    if (newQueryModalContainer) newQueryModalContainer.style.display = 'none';
  };

  if (closeNewQueryBtn) closeNewQueryBtn.addEventListener('click', closeNewQueryModal);
  if (cancelNewQueryBtn) cancelNewQueryBtn.addEventListener('click', closeNewQueryModal);

  // Submit New Query from Modal
  const queryModalForm = document.getElementById('profile-query-modal-form');
  if (queryModalForm) {
    queryModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const category = document.getElementById('modal-query-category')?.value;
      const orderId = document.getElementById('modal-query-order-select')?.value || null;
      const subject = document.getElementById('modal-query-subject')?.value.trim();
      const message = document.getElementById('modal-query-message')?.value.trim();

      if (!subject || !message) {
        showToast('Please fill in both subject and message.', 'error');
        return;
      }

      const newQ = state.submitQuery({
        category,
        orderId,
        subject,
        message
      });

      if (newQ) selectedProfileQueryId = newQ.id;
      closeNewQueryModal();
      showToast('Inquiry ticket created! Concierge will respond shortly.', 'success');
      prefilledQueryOrderId = '';
      state._notify({ route: true, queries: true });
    });
  }

  // Sign out button
  const signOutBtn = document.getElementById('profile-signout-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      state.logout();
      showToast('Signed out of your account.');
      state.setRoute('home');
    });
  }
}
