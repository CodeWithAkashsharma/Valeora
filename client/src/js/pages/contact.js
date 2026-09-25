import { state } from '../state.js';
import { showToast } from '../components/toast.js';

export function renderContactPage() {
  return `
    <style>
      .contact-form-card {
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                    border-color 0.4s ease,
                    box-shadow 0.4s ease,
                    background 0.4s ease;
        position: relative;
        overflow: hidden;
      }
      .contact-form-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        opacity: 0.8;
      }
      .contact-form-card:hover {
        border-color: rgba(90, 16, 40, 0.35) !important;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 0 25px rgba(236, 207, 208, 0.25) !important;
        transform: translateY(-2px);
      }
      .contact-form-group {
        transition: all 0.25s ease;
      }
      .contact-form-group:hover label {
        color: #260510 !important;
      }
      .contact-form-group:focus-within label {
        color: #1A030A !important;
        transform: translateX(4px);
        font-weight: 700 !important;
      }
      .contact-input-field {
        width: 100%;
        padding: 13px 16px;
        border-radius: 14px;
        background: #FFFFFF;
        border: 1.5px solid rgba(75, 14, 35, 0.2);
        color: #1C040D;
        font-size: 0.9rem;
        font-weight: 500;
        outline: none;
        transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
      }
      .contact-input-field::placeholder {
        color: #8C5E68;
        transition: color 0.25s ease;
      }
      .contact-input-field:hover {
        background: #FFFFFF !important;
        border-color: #800020 !important;
        transform: translateY(-1.5px);
        box-shadow: 0 6px 16px rgba(75, 14, 35, 0.12), inset 0 1px 2px rgba(0, 0, 0, 0.04);
      }
      .contact-input-field:hover::placeholder {
        color: #5A1A28;
      }
      .contact-input-field:focus {
        border-color: #550E26 !important;
        background: #FFFFFF !important;
        box-shadow: 0 0 0 3.5px rgba(85, 14, 38, 0.16), 0 8px 20px rgba(0, 0, 0, 0.1) !important;
        color: #1A030A !important;
        transform: translateY(-2px);
      }
      .contact-input-field:active {
        transform: translateY(0px) scale(0.995);
      }
      .contact-submit-btn {
        width: 100%;
        margin-top: 6px;
        padding: 14px 22px;
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        border-radius: var(--radius-pill);
        background: linear-gradient(135deg, #5A0E28 0%, #300615 100%);
        color: #FFFFFF;
        border: 1px solid rgba(255, 255, 255, 0.15);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 8px 22px rgba(60, 10, 26, 0.35);
        position: relative;
        overflow: hidden;
      }
      .contact-submit-btn::after {
        content: '';
        position: absolute;
        top: 0; left: -100%; width: 60%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transform: skewX(-20deg);
        transition: left 0.6s ease;
      }
      .contact-submit-btn:hover {
        transform: translateY(-3px) scale(1.015);
        background: linear-gradient(135deg, #741436 0%, #44081E 100%);
        box-shadow: 0 14px 32px rgba(60, 10, 26, 0.45), 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      .contact-submit-btn:hover::after {
        left: 140%;
      }
      .contact-submit-btn:active {
        transform: translateY(1px) scale(0.975);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        background: #300615;
        transition: all 0.1s ease;
      }
      .contact-main-grid {
        display: grid;
        grid-template-columns: 1.62fr 0.88fr;
        gap: 26px;
        align-items: start;
        max-width: 980px;
        margin: 0 auto;
      }
      .contact-info-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .contact-info-card {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    border-color 0.3s ease,
                    box-shadow 0.3s ease,
                    background 0.3s ease;
        cursor: pointer;
        background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%) !important;
        border: 1.5px solid rgba(85, 15, 38, 0.22) !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
      }
      .contact-info-card:hover {
        transform: translateY(-3px) scale(1.015);
        background: linear-gradient(145deg, #DFCAD0 0%, #CEACB4 100%) !important;
        border-color: rgba(90, 16, 40, 0.38) !important;
        box-shadow: 0 14px 34px rgba(0, 0, 0, 0.45), 0 0 20px rgba(214, 184, 190, 0.3) !important;
      }
      .contact-info-card:active {
        transform: translateY(-1px) scale(0.985);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        transition: all 0.1s ease;
      }
      .contact-info-card:hover .contact-card-icon {
        transform: scale(1.1) rotate(4deg);
        background: rgba(90, 14, 40, 0.18) !important;
        border-color: rgba(90, 14, 40, 0.38) !important;
        color: #24040E !important;
        box-shadow: 0 0 10px rgba(90, 14, 40, 0.15);
      }
      .contact-card-icon {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
        background: rgba(90, 14, 40, 0.1) !important;
        border: 1px solid rgba(90, 14, 40, 0.22) !important;
        color: #4A1222 !important;
      }

      /* Responsive Mobile Styles (Desktop Untouched) */
      /* Responsive Mobile Styles (Desktop Untouched) */
      @media (max-width: 840px) {
        .contact-page-backdrop {
          min-height: auto !important;
          padding-top: 50px !important;
          padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px)) !important;
        }
        .contact-container {
          padding-left: 16px !important;
          padding-right: 16px !important;
          box-sizing: border-box !important;
        }
        .contact-header-box {
          margin: 0 auto 48px auto !important;
          text-align: center !important;
        }
        .contact-header-title {
          font-size: clamp(2rem, 5.8vw, 2.6rem) !important;
          margin-bottom: 8px !important;
          line-height: 1.18 !important;
        }
        .contact-header-desc {
          font-size: clamp(0.92rem, 3.2vw, 1.05rem) !important;
          line-height: 1.5 !important;
          max-width: 95% !important;
          margin: 0 auto !important;
          opacity: 0.95 !important;
        }
        .contact-main-grid {
          grid-template-columns: 1fr !important;
          gap: 32px !important;
        }
        .contact-form-card {
          padding: 24px 20px !important;
          border-radius: 18px !important;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35) !important;
        }
        .contact-form-title {
          font-size: 1.35rem !important;
          margin-bottom: 14px !important;
          letter-spacing: -0.01em !important;
          font-weight: 700 !important;
        }
        .contact-form-inner {
          gap: 14px !important;
        }
        .contact-form-group {
          margin-bottom: 0 !important;
        }
        .contact-form-group label {
          font-size: 0.88rem !important;
          margin-bottom: 5px !important;
          font-weight: 600 !important;
          letter-spacing: 0.01em !important;
        }
        .contact-input-field {
          padding: 11px 13px !important;
          font-size: 0.92rem !important;
          border-radius: 10px !important;
        }
        textarea.contact-input-field {
          min-height: 85px !important;
        }
        .contact-submit-btn {
          padding: 12px 20px !important;
          font-size: 0.95rem !important;
          font-weight: 600 !important;
          border-radius: 99px !important;
          margin-top: 4px !important;
        }
        .contact-info-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }
        .contact-info-card {
          padding: 14px 16px !important;
          border-radius: 14px !important;
          gap: 12px !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28) !important;
          min-width: 0 !important;
        }
        .contact-card-icon {
          width: 38px !important;
          height: 38px !important;
          min-width: 38px !important;
          border-radius: 10px !important;
          flex-shrink: 0 !important;
        }
        .contact-card-icon svg {
          width: 18px !important;
          height: 18px !important;
        }
        .contact-info-title {
          font-size: 0.94rem !important;
          font-weight: 700 !important;
          margin-bottom: 3px !important;
          white-space: normal !important;
          overflow: visible !important;
          text-overflow: unset !important;
          line-height: 1.25 !important;
          word-break: break-word !important;
        }
        .contact-info-desc {
          font-size: 0.82rem !important;
          font-weight: 500 !important;
          white-space: normal !important;
          overflow: visible !important;
          text-overflow: unset !important;
          line-height: 1.35 !important;
          word-break: break-word !important;
        }
      }

      @media (max-width: 480px) {
        .contact-page-backdrop {
          padding-top: 46px !important;
          padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px)) !important;
        }
        .contact-container {
          padding-left: 12px !important;
          padding-right: 12px !important;
        }
        .contact-header-box {
          margin: 0 auto 44px auto !important;
        }
        .contact-header-title {
          font-size: clamp(1.8rem, 6.4vw, 2.2rem) !important;
          margin-bottom: 8px !important;
        }
        .contact-header-desc {
          font-size: clamp(0.85rem, 3.4vw, 0.96rem) !important;
          line-height: 1.45 !important;
          max-width: 98% !important;
        }
        .contact-main-grid {
          gap: 24px !important;
        }
        .contact-form-card {
          padding: 18px 14px !important;
          border-radius: 14px !important;
        }
        .contact-form-title {
          font-size: 1.25rem !important;
          margin-bottom: 12px !important;
        }
        .contact-form-inner {
          gap: 11px !important;
        }
        .contact-form-group label {
          font-size: 0.84rem !important;
          margin-bottom: 4px !important;
        }
        .contact-input-field {
          padding: 10px 12px !important;
          font-size: 0.88rem !important;
          border-radius: 9px !important;
        }
        textarea.contact-input-field {
          min-height: 75px !important;
        }
        .contact-submit-btn {
          padding: 11px 18px !important;
          font-size: 0.90rem !important;
        }
        .contact-info-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
        }
        .contact-info-card {
          padding: 12px 14px !important;
          border-radius: 12px !important;
          gap: 10px !important;
        }
        .contact-card-icon {
          width: 34px !important;
          height: 34px !important;
          border-radius: 8px !important;
        }
        .contact-card-icon svg {
          width: 16px !important;
          height: 16px !important;
        }
        .contact-info-title {
          font-size: 0.90rem !important;
        }
        .contact-info-desc {
          font-size: 0.80rem !important;
          line-height: 1.32 !important;
        }
      }

      @media (max-width: 360px) {
        .contact-page-backdrop {
          padding-top: 42px !important;
          padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)) !important;
        }
        .contact-container {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        .contact-header-box {
          margin: 0 auto 38px auto !important;
        }
        .contact-header-title {
          font-size: clamp(1.6rem, 6vw, 1.85rem) !important;
          margin-bottom: 5px !important;
        }
        .contact-header-desc {
          font-size: 0.80rem !important;
          line-height: 1.4 !important;
          max-width: 100% !important;
        }
        .contact-main-grid {
          gap: 20px !important;
        }
        .contact-form-card {
          padding: 16px 12px !important;
          border-radius: 12px !important;
        }
        .contact-form-title {
          font-size: 1.15rem !important;
          margin-bottom: 10px !important;
        }
        .contact-form-inner {
          gap: 10px !important;
        }
        .contact-form-group label {
          font-size: 0.80rem !important;
          margin-bottom: 3px !important;
        }
        .contact-input-field {
          padding: 9px 10px !important;
          font-size: 0.84rem !important;
          border-radius: 8px !important;
        }
        textarea.contact-input-field {
          min-height: 65px !important;
        }
        .contact-submit-btn {
          padding: 10px 16px !important;
          font-size: 0.86rem !important;
        }
        .contact-info-list {
          gap: 7px !important;
        }
        .contact-info-card {
          padding: 10px 12px !important;
          border-radius: 10px !important;
          gap: 9px !important;
        }
        .contact-card-icon {
          width: 30px !important;
          height: 30px !important;
          border-radius: 7px !important;
        }
        .contact-card-icon svg {
          width: 14px !important;
          height: 14px !important;
        }
        .contact-info-title {
          font-size: 0.85rem !important;
        }
        .contact-info-desc {
          font-size: 0.75rem !important;
          line-height: 1.3 !important;
        }
      }

      @media (max-width: 300px) {
        .contact-page-backdrop {
          min-height: auto !important;
          padding-top: 38px !important;
          padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px)) !important;
        }
        .contact-main-grid {
          gap: 14px !important;
        }
        .contact-form-card {
          padding: 12px 10px !important;
          border-radius: 10px !important;
        }
        .contact-form-title {
          font-size: 1.05rem !important;
        }
        .contact-form-inner {
          gap: 8px !important;
        }
        .contact-form-group label {
          font-size: 0.76rem !important;
        }
        .contact-input-field {
          padding: 8px 9px !important;
          font-size: 0.80rem !important;
        }
        textarea.contact-input-field {
          min-height: 55px !important;
        }
        .contact-submit-btn {
          padding: 9px 14px !important;
          font-size: 0.82rem !important;
        }
        .contact-info-card {
          padding: 8px 10px !important;
          border-radius: 8px !important;
        }
        .contact-card-icon {
          width: 26px !important;
          height: 26px !important;
        }
        .contact-info-title {
          font-size: 0.80rem !important;
        }
        .contact-info-desc {
          font-size: 0.70rem !important;
        }
      }
    </style>

    <div class="satin-backdrop contact-page-backdrop" style="min-height: 100vh; padding: 110px 0 80px 0;">
      <div class="container contact-container" style="max-width: 1020px; margin: 0 auto; padding: 0 20px;">
        
        <!-- Header (Clean & Centered) -->
        <div class="contact-header-box" style="text-align: center; max-width: 680px; margin: 0 auto 36px auto;">
          <h1 class="contact-header-title" style="font-family: var(--font-serif); font-size: clamp(2.2rem, 4vw, 3.2rem); color: #ffffff; margin-bottom: 10px; letter-spacing: -0.01em; line-height: 1.15;">
            Need Help ?
          </h1>
          <p class="contact-header-desc" style="color: var(--color-text-secondary); font-size: 0.98rem; line-height: 1.6; margin: 0; max-width: 540px; margin-left: auto; margin-right: auto;">
            We'd love to hear from you. Reach out for order tracking, express delivery support, or jewelry care questions.
          </p>
        </div>

        <!-- 2-Column Responsive Layout: Form on Left, 3 Info Cards on Right -->
        <div class="contact-main-grid">
          
          <!-- Left: Message Form (Muted Dusky Matte Rose Card with Dark Text) -->
          <div class="spotlight-card-main contact-form-card" style="padding: 36px 32px; background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%); border: 1.5px solid rgba(85, 15, 38, 0.22); border-radius: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.45);">
            <h3 class="contact-form-title" style="font-family: var(--font-serif); font-size: 1.55rem; font-weight: 700; color: #24040E; margin-bottom: 20px; letter-spacing: -0.01em;">
              Send Us a Message
            </h3>
            
            <form id="contact-concierge-form" class="contact-form-inner" style="display: flex; flex-direction: column; gap: 16px;">
              <div class="contact-form-group">
                <label style="font-size: 0.82rem; color: #3C0818; display: block; margin-bottom: 6px; font-weight: 600; transition: color 0.2s ease, transform 0.2s ease;">Your Name *</label>
                <input type="text" id="ct-name" class="contact-input-field" required placeholder="e.g. Your Full Name" value="${state.user?.name || ''}" style="background: #FAF3F5;">
              </div>

              <div class="contact-form-group">
                <label style="font-size: 0.82rem; color: #3C0818; display: block; margin-bottom: 6px; font-weight: 600; transition: color 0.2s ease, transform 0.2s ease;">Email Address *</label>
                <input type="email" id="ct-email" class="contact-input-field" required placeholder="name@example.com" value="${state.user?.email || ''}" style="background: #FAF3F5;">
              </div>

              <div class="contact-form-group">
                <label style="font-size: 0.82rem; color: #3C0818; display: block; margin-bottom: 6px; font-weight: 600; transition: color 0.2s ease, transform 0.2s ease;">Topic</label>
                <select id="ct-subject" class="contact-input-field" style="cursor: pointer; background: #FAF3F5;">
                  <option value="Order Tracking">Track My Order / Delivery</option>
                  <option value="Replacement Request">24-Hour Replacement Request (Damage / Sizing)</option>
                  <option value="Product Details">Jewelry Sizing & Fit Question</option>
                  <option value="General Inquiry">General Question</option>
                </select>
              </div>

              <div class="contact-form-group">
                <label style="font-size: 0.82rem; color: #3C0818; display: block; margin-bottom: 6px; font-weight: 600; transition: color 0.2s ease, transform 0.2s ease;">Message *</label>
                <textarea id="ct-msg" class="contact-input-field" rows="4" required placeholder="Type your question or query here..." style="resize: vertical; background: #FAF3F5;"></textarea>
              </div>

              <button type="submit" class="contact-submit-btn">
                Submit Message
              </button>
            </form>
          </div>

          <!-- Right / Bottom: 3 Contact Info Cards -->
          <div class="contact-info-list">
            
            <div class="contact-info-card" style="border-radius: 14px; padding: 13px 16px; display: flex; gap: 12px; align-items: center;">
              <div class="contact-card-icon" style="width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div style="min-width: 0;">
                <h5 class="contact-info-title" style="color: #24040E; font-size: 0.84rem; font-weight: 700; margin-bottom: 2px;">Delhi Janakpuri Dispatch</h5>
                <p class="contact-info-desc" style="color: #4A1222; font-size: 0.74rem; font-weight: 500; margin: 0; line-height: 1.35;">Janakpuri, Delhi · Pan-India</p>
              </div>
            </div>

            <div class="contact-info-card" style="border-radius: 14px; padding: 13px 16px; display: flex; gap: 12px; align-items: center;">
              <div class="contact-card-icon" style="width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div style="min-width: 0;">
                <h5 class="contact-info-title" style="color: #24040E; font-size: 0.84rem; font-weight: 700; margin-bottom: 2px;">Email Support</h5>
                <p class="contact-info-desc" style="color: #4A1222; font-size: 0.74rem; font-weight: 500; margin: 0; line-height: 1.35;"><a href="mailto:Valeora.shop@gmail.com" style="color: #3C0818; font-weight: 600; text-decoration: none;">Valeora.shop@gmail.com</a></p>
              </div>
            </div>

            <div class="contact-info-card" style="border-radius: 14px; padding: 13px 16px; display: flex; gap: 12px; align-items: center;">
              <div class="contact-card-icon" style="width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div style="min-width: 0;">
                <h5 class="contact-info-title" style="color: #24040E; font-size: 0.84rem; font-weight: 700; margin-bottom: 2px;">Express Response</h5>
                <p class="contact-info-desc" style="color: #4A1222; font-size: 0.74rem; font-weight: 500; margin: 0; line-height: 1.35;">Under 3 hours reply · Mon–Sat</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  `;
}

export function bindContactPageEvents() {
  const form = document.getElementById('contact-concierge-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('ct-name');
      const emailInput = document.getElementById('ct-email');
      const topicSelect = document.getElementById('ct-subject');
      const msgInput = document.getElementById('ct-msg');

      const name = nameInput?.value.trim();
      const email = emailInput?.value.trim();
      const topic = topicSelect?.value || 'General Inquiry';
      const msg = msgInput?.value.trim();

      if (!name || !email || !msg) {
        showToast('Please complete all required fields.', 'error');
        return;
      }

      state.submitQuery({
        customerName: name,
        email: email,
        subject: topic,
        category: topic,
        message: msg
      });

      showToast('Thank you! Your query has been submitted and added to your Profile Help & Queries.', 'success');

      // Reset all form inputs completely to blank
      form.reset();
      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (msgInput) msgInput.value = '';
    });
  }
}

