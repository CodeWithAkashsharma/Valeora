import { state } from '../state.js';
import { showToast } from './toast.js';

export function renderQuickViewModal() {
  const product = state.quickViewProduct;
  if (!product) return '';

  const originalPriceVal = (product.originalPrice && product.originalPrice > product.price)
    ? product.originalPrice
    : (product.price >= 500 ? Math.round((product.price * 1.6) / 50) * 50 - 1 : Math.round((product.price * 1.8) / 50) * 50 - 1);

  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price);
  const formattedOriginalPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(originalPriceVal);

  const images = (Array.isArray(product.galleryImages) && product.galleryImages.length > 0)
    ? product.galleryImages.filter(Boolean)
    : [product.image || '/images/imperial_necklace.jpg'];

  return `
    <style>
      .quickview-modal-dialog {
        max-width: 840px;
        width: 94%;
        padding: 32px 28px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        background: linear-gradient(155deg, rgba(38, 5, 17, 0.98) 0%, rgba(18, 2, 8, 0.99) 100%);
        border: 1px solid rgba(236, 207, 208, 0.35);
        border-radius: 28px;
        box-shadow: 0 28px 80px rgba(0, 0, 0, 0.85), 0 0 40px rgba(236, 207, 208, 0.15);
      }
      .quickview-close-btn {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 32px;
        height: 32px;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: rgba(255, 255, 255, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
        cursor: pointer;
        z-index: 10;
        transition: color 0.2s ease, transform 0.2s ease;
      }
      .quickview-close-btn:hover {
        transform: scale(1.15);
        color: var(--color-rose-pill);
      }
      .quickview-grid-layout {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 24px;
        align-items: center;
      }
      .quickview-img-wrap {
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: #140206;
        border: 1px solid var(--glass-border);
        box-shadow: 0 8px 30px rgba(0,0,0,0.6);
        position: relative;
        user-select: none;
      }
      .quickview-img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .qv-gallery-frame-container {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .qv-gallery-nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 36px;
        height: 36px;
        background: transparent;
        border: none;
        box-shadow: none;
        backdrop-filter: none;
        color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 8;
        padding: 0;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9));
      }
      .qv-gallery-nav-btn:hover {
        background: transparent;
        border: none;
        box-shadow: none;
        color: var(--color-rose-pill, #ECCFD0);
        transform: translateY(-50%) scale(1.25);
        filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.95));
      }
      .qv-gallery-nav-btn svg {
        width: 28px;
        height: 28px;
        stroke-width: 2.4;
      }
      .qv-gallery-prev-btn {
        left: 10px;
      }
      .qv-gallery-next-btn {
        right: 10px;
      }
      .qv-img-counter-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(14, 2, 6, 0.85);
        backdrop-filter: blur(6px);
        border: 1px solid rgba(236, 207, 208, 0.3);
        color: #ECCFD0;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 3px 9px;
        border-radius: 99px;
        z-index: 8;
        letter-spacing: 0.05em;
      }
      .qv-thumbnails-strip {
        display: flex;
        gap: 8px;
        justify-content: center;
        margin-top: 10px;
        flex-wrap: wrap;
      }
      .qv-thumb-btn {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        overflow: hidden;
        border: 1.5px solid rgba(214, 184, 190, 0.25);
        background: #140206;
        padding: 0;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        opacity: 0.55;
        flex-shrink: 0;
      }
      .qv-thumb-btn:hover {
        opacity: 0.9;
        border-color: rgba(236, 207, 208, 0.6);
      }
      .qv-thumb-btn.active {
        border-color: #D6B8BE;
        opacity: 1;
        box-shadow: 0 0 14px rgba(214, 184, 190, 0.5);
        transform: scale(1.06);
      }
      .qv-thumb-btn img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .quickview-trust-chips {
        margin-top: 10px;
        font-size: 0.76rem;
        color: var(--color-rose-pill);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        flex-wrap: nowrap;
        white-space: nowrap;
      }
      .quickview-delivery-pill {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        background: rgba(236, 207, 208, 0.08);
        border: 1px solid rgba(236, 207, 208, 0.22);
        border-radius: var(--radius-pill);
        padding: 7px 14px;
        font-size: 0.76rem;
        color: #ECCFD0;
        margin-bottom: 14px;
        text-align: center;
      }
      .quickview-delivery-pill svg {
        color: #ECCFD0;
        flex-shrink: 0;
      }
      .quickview-badge-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .quickview-badge {
        font-size: 0.68rem;
      }
      .quickview-category {
        font-size: 0.75rem;
        color: var(--color-text-muted);
      }
      .quickview-title {
        font-family: var(--font-serif);
        font-size: 1.65rem;
        margin-bottom: 6px;
        color: #ffffff;
        line-height: 1.2;
      }

      .quickview-desc {
        font-size: 0.88rem;
        color: var(--color-text-secondary);
        line-height: 1.55;
        margin-bottom: 16px;
        text-align: left;
        word-spacing: normal;
        letter-spacing: normal;
      }
      .quickview-specs-box {
        background: rgba(18, 2, 7, 0.7);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: var(--radius-md);
        padding: 12px 14px;
        margin-bottom: 20px;
      }
      .quickview-specs-title {
        font-family: var(--font-serif);
        font-size: 0.95rem;
        color: #ffffff;
        margin-bottom: 8px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        padding-bottom: 4px;
      }
      .quickview-specs-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.8rem;
      }
      .quickview-actions-row {
        display: flex;
        gap: 14px;
        align-items: center;
        border-top: 1px solid var(--glass-border-subtle);
        padding-top: 16px;
      }
      .quickview-price {
        font-size: 1.6rem;
        font-weight: 700;
        color: #ffffff;
        font-family: var(--font-sans);
        line-height: 1.1;
      }
      .quickview-orig-price {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        text-decoration: line-through;
      }
      .quickview-stock-text {
        font-size: 0.72rem;
        color: var(--color-rose-pill);
        margin-top: 2px;
      }
      .quickview-add-btn {
        flex-grow: 1;
        font-size: 0.88rem;
        padding: 12px 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: var(--color-rose-pill);
        color: var(--color-rose-pill-text);
        font-weight: 600;
        border-radius: var(--radius-pill);
        border: none;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .quickview-add-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(236, 207, 208, 0.35);
      }

      /* Hide Scrollbars completely across all devices and browsers */
      .quickview-modal-dialog {
        scrollbar-width: none !important; /* Firefox */
        -ms-overflow-style: none !important; /* IE/Edge */
      }
      .quickview-modal-dialog::-webkit-scrollbar {
        display: none !important; /* Chrome, Safari, Opera */
        width: 0 !important;
        height: 0 !important;
      }

      /* Dedicated Tablet View (601px - 1100px) */
      @media (min-width: 601px) and (max-width: 1100px) {
        .quickview-modal-dialog {
          max-width: 620px !important;
          width: 92% !important;
          padding: 22px 22px 20px 22px !important;
          border-radius: 22px !important;
          max-height: 88vh !important;
        }
        .quickview-close-btn {
          top: 10px !important;
          right: 12px !important;
          width: 28px !important;
          height: 28px !important;
          font-size: 1.4rem !important;
        }
        .quickview-grid-layout {
          display: grid !important;
          grid-template-columns: 240px 1fr !important;
          gap: 20px !important;
          align-items: start !important;
        }
        .quickview-img-wrap {
          width: 240px !important;
          height: 240px !important;
          max-width: 240px !important;
          max-height: 240px !important;
          border-radius: 16px !important;
          margin: 0 !important;
        }
        .quickview-trust-chips {
          margin-top: 10px !important;
          font-size: 0.72rem !important;
          gap: 8px !important;
        }
        .quickview-badge-row {
          margin-bottom: 6px !important;
          gap: 6px !important;
        }
        .quickview-badge {
          font-size: 0.65rem !important;
          padding: 2px 8px !important;
        }
        .quickview-category {
          font-size: 0.72rem !important;
        }
        .quickview-title {
          font-size: 1.35rem !important;
          margin-bottom: 5px !important;
          line-height: 1.22 !important;
        }
        .quickview-desc {
          font-size: 0.86rem !important;
          line-height: 1.5 !important;
          margin-bottom: 10px !important;
        }
        .quickview-specs-box {
          padding: 8px 10px !important;
          margin-bottom: 12px !important;
          border-radius: 10px !important;
        }
        .quickview-specs-title {
          font-size: 0.84rem !important;
          margin-bottom: 4px !important;
        }
        .quickview-specs-list {
          font-size: 0.76rem !important;
          gap: 3px !important;
        }
        .quickview-actions-row {
          padding-top: 10px !important;
          gap: 12px !important;
        }
        .quickview-price {
          font-size: 1.45rem !important;
        }
        .quickview-orig-price {
          font-size: 0.84rem !important;
        }
        .quickview-add-btn {
          font-size: 0.86rem !important;
          padding: 10px 18px !important;
          border-radius: var(--radius-pill) !important;
        }
      }

      /* Compact Mobile Presentation (Small Screens <= 600px) */
      @media (max-width: 600px) {
        .quickview-modal-dialog {
          width: 94% !important;
          max-width: 440px !important;
          padding: 20px 20px 22px 20px !important;
          border-radius: 24px !important;
          max-height: 88vh !important;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.9), 0 0 25px rgba(236, 207, 208, 0.12) !important;
          overflow-y: auto !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .quickview-modal-dialog::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .quickview-close-btn {
          top: 10px !important;
          right: 12px !important;
          width: 30px !important;
          height: 30px !important;
          font-size: 1.65rem !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: rgba(236, 207, 208, 0.95) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 20 !important;
          cursor: pointer !important;
          transition: transform 0.2s ease, color 0.2s ease !important;
        }
        .quickview-close-btn:hover {
          color: #FFFFFF !important;
          transform: scale(1.15) !important;
        }
        .quickview-grid-layout {
          grid-template-columns: 1fr !important;
          gap: 12px !important;
        }
        .qv-gallery-frame-container {
          width: max-content !important;
          margin: 0 auto !important;
          position: relative !important;
        }
        .quickview-img-wrap {
          width: 224px !important;
          height: 224px !important;
          max-width: 224px !important;
          max-height: 224px !important;
          margin: 0 auto !important;
          border-radius: 20px !important;
          aspect-ratio: 1/1 !important;
        }
        .qv-img-counter-badge {
          display: none !important;
        }
        .qv-thumbnails-strip {
          display: none !important;
        }
        .qv-gallery-nav-btn {
          width: 32px !important;
          height: 32px !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: rgba(236, 207, 208, 0.95) !important;
          backdrop-filter: none !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .qv-gallery-nav-btn:hover {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: #FFFFFF !important;
          transform: translateY(-50%) scale(1.2) !important;
        }
        .qv-gallery-nav-btn svg {
          width: 26px !important;
          height: 26px !important;
          stroke-width: 2.2 !important;
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.8));
        }
        .qv-gallery-prev-btn {
          left: -36px !important;
        }
        .qv-gallery-next-btn {
          right: -36px !important;
        }
        .quickview-trust-chips {
          margin-top: 8px !important;
          margin-bottom: 2px !important;
          font-size: 0.74rem !important;
          gap: 14px !important;
          justify-content: center !important;
          text-align: center !important;
          display: flex !important;
          flex-wrap: nowrap !important;
          white-space: nowrap !important;
        }
        .quickview-delivery-pill {
          font-size: 0.74rem !important;
          padding: 6px 12px !important;
          margin-bottom: 10px !important;
          gap: 6px !important;
        }
        .quickview-badge-row {
          gap: 6px !important;
          margin-bottom: 6px !important;
          justify-content: flex-start !important;
          display: flex !important;
        }
        .quickview-badge {
          font-size: 0.68rem !important;
          padding: 2.5px 8px !important;
        }
        .quickview-category {
          font-size: 0.75rem !important;
        }
        .quickview-title {
          font-size: 1.25rem !important;
          margin-bottom: 6px !important;
          line-height: 1.25 !important;
          text-align: left !important;
        }
        .quickview-desc {
          font-size: 0.84rem !important;
          line-height: 1.55 !important;
          margin-bottom: 12px !important;
          display: block !important;
          text-align: left !important;
          word-spacing: normal !important;
          letter-spacing: normal !important;
          width: 100% !important;
        }
        .quickview-specs-box {
          padding: 10px 12px !important;
          margin-bottom: 12px !important;
          border-radius: 12px !important;
        }
        .quickview-specs-title {
          font-size: 0.88rem !important;
          margin-bottom: 5px !important;
          padding-bottom: 4px !important;
        }
        .quickview-specs-list {
          font-size: 0.78rem !important;
          gap: 4px !important;
        }
        .quickview-actions-row {
          padding-top: 12px !important;
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 10px !important;
        }
        .quickview-price {
          font-size: 1.45rem !important;
        }
        .quickview-orig-price {
          font-size: 0.86rem !important;
        }
        .quickview-stock-text {
          display: none !important;
        }
        .quickview-add-btn {
          font-size: 0.88rem !important;
          padding: 10px 20px !important;
          border-radius: var(--radius-pill) !important;
          gap: 6px !important;
          width: auto !important;
          flex-grow: 0 !important;
        }
        .quickview-add-btn svg {
          width: 15px !important;
          height: 15px !important;
        }
      }

      @media (max-width: 360px) {
        .quickview-modal-dialog {
          width: 95% !important;
          max-width: 350px !important;
          padding: 14px 14px 18px 14px !important;
          border-radius: 20px !important;
        }
        .quickview-img-wrap {
          width: 185px !important;
          height: 185px !important;
          max-width: 185px !important;
          max-height: 185px !important;
        }
        .qv-gallery-prev-btn {
          left: -36px !important;
        }
        .qv-gallery-next-btn {
          right: -36px !important;
        }
        .quickview-trust-chips {
          font-size: 0.68rem !important;
        }
        .quickview-badge-row {
          justify-content: flex-start !important;
        }
        .quickview-title {
          font-size: 1.15rem !important;
          text-align: left !important;
        }
        .quickview-desc {
          font-size: 0.78rem !important;
          text-align: left !important;
          word-spacing: normal !important;
          letter-spacing: normal !important;
        }
        .quickview-specs-title {
          font-size: 0.80rem !important;
        }
        .quickview-specs-list {
          font-size: 0.72rem !important;
        }
        .quickview-add-btn {
          font-size: 0.80rem !important;
          padding: 8px 14px !important;
        }
      }
    </style>

    <div class="modal-overlay open" id="quickview-modal-overlay">
        <div class="modal-dialog quickview-modal-dialog">
          <button class="quickview-close-btn" id="quickview-close-btn" aria-label="Close details">&times;</button>
          
          <div class="quickview-grid-layout">
            <!-- Left: High Res Jewelry Image Carousel with Infinite Slide -->
            <div>
              <div class="qv-gallery-frame-container">
                ${images.length > 1 ? `
                  <!-- Navigation Arrows positioned relative to frame -->
                  <button type="button" class="qv-gallery-nav-btn qv-gallery-prev-btn" id="qv-prev-btn" aria-label="Previous image">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button type="button" class="qv-gallery-nav-btn qv-gallery-next-btn" id="qv-next-btn" aria-label="Next image">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                ` : ''}

                <div class="quickview-img-wrap" id="qv-image-slider-wrap">
                  ${images.length > 1 ? `
                    <div class="qv-img-counter-badge" id="qv-image-counter">
                      1 / ${images.length}
                    </div>
                  ` : ''}

                  <img id="qv-main-image" src="${images[0]}" alt="${product.name}" class="qv-active-img" />
                </div>
              </div>

              <!-- Clickable Thumbnails Row -->
              ${images.length > 1 ? `
                <div class="qv-thumbnails-strip">
                  ${images.map((img, idx) => `
                    <button type="button" class="qv-thumb-btn ${idx === 0 ? 'active' : ''}" data-thumb-index="${idx}" aria-label="View photo ${idx + 1}">
                      <img src="${img}" alt="Thumbnail ${idx + 1}">
                    </button>
                  `).join('')}
                </div>
              ` : ''}

              <div class="quickview-trust-chips">
                <span>• Long-Lasting Shine</span>
                <span>• Safe for Sensitive Skin</span>
              </div>
            </div>

            <!-- Right: Compact Details & Specifications -->
            <div>
              <div class="quickview-badge-row">
                <span class="badge-pill badge-rose quickview-badge">${product.badge || 'Popular'}</span>
                <span class="quickview-category">${product.category}</span>
              </div>
              
              <h2 class="quickview-title">
                ${product.name}
              </h2>
              
              <p class="quickview-desc">
                ${product.description}
              </p>

              <!-- Specification Micro-Grid -->
              <div class="quickview-specs-box">
                <div class="quickview-specs-title">
                  Product Highlights
                </div>
                <div class="quickview-specs-list">
                  ${(product.supplementFacts?.ingredients || [
      { name: 'Polish', amount: '18K Long-Lasting Shine' },
      { name: 'Metal', amount: 'Skin-Safe Hypoallergenic' },
      { name: 'Packaging', amount: 'Valeora Gift Box Included' }
    ]).slice(0, 3).map(ing => `
                    <div style="display:flex; justify-content:space-between; color:var(--color-text-muted);">
                      <span style="color:var(--color-text-secondary);">${ing.name}</span>
                      <span style="font-weight:600; color:var(--color-rose-pill);">${ing.amount}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Free Delivery Notice -->
              <div class="quickview-delivery-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>Free Delivery on orders above ₹999</span>
              </div>

              <!-- Price & Action Controls -->
              <div class="quickview-actions-row">
                <div>
                  <div style="display:flex; align-items:baseline; gap:6px;">
                    <span class="quickview-price">${formattedPrice}</span>
                    ${formattedOriginalPrice ? `<span class="quickview-orig-price">${formattedOriginalPrice}</span>` : ''}
                  </div>
                  ${(product.stockQty !== undefined && Number(product.stockQty) <= 0) || (product.stockCount !== undefined && Number(product.stockCount) <= 0)
      ? `<div class="quickview-stock-text" style="color: #FF6B6B; font-weight: 700;">Out of Stock · Restocking Soon</div>`
      : `<div class="quickview-stock-text">In Stock · Ready to Ship (Delhi)</div>`
    }
                </div>
                
                ${(product.stockQty !== undefined && Number(product.stockQty) <= 0) || (product.stockCount !== undefined && Number(product.stockCount) <= 0) ? `
                  <button class="btn btn-pill quickview-add-btn" id="qv-add-cart-btn" disabled style="opacity: 0.55; cursor: not-allowed; background: rgba(255,255,255,0.08); color: rgba(236,207,208,0.5); border: 1px solid rgba(214,184,190,0.2);">
                    <span>Out of Stock</span>
                  </button>
                ` : `
                  <button class="btn btn-pill quickview-add-btn" id="qv-add-cart-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
        </div>
      </div>
    `;
}

let activeGalleryIndex = 0;

export function bindQuickViewEvents() {
  const overlay = document.getElementById('quickview-modal-overlay');
  const closeBtn = document.getElementById('quickview-close-btn');
  const product = state.quickViewProduct;

  activeGalleryIndex = 0;

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) state.setQuickViewProduct(null);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => state.setQuickViewProduct(null));
  }

  if (!product) return;

  const images = (Array.isArray(product.galleryImages) && product.galleryImages.length > 0)
    ? product.galleryImages.filter(Boolean)
    : [product.image || '/images/imperial_necklace.jpg'];

  const mainImg = document.getElementById('qv-main-image');
  const counterEl = document.getElementById('qv-image-counter');
  const prevBtn = document.getElementById('qv-prev-btn');
  const nextBtn = document.getElementById('qv-next-btn');
  const thumbBtns = document.querySelectorAll('.qv-thumb-btn');
  const sliderWrap = document.getElementById('qv-image-slider-wrap');

  const updateGallery = (newIdx) => {
    if (images.length <= 1) return;
    // Infinite wrap-around math: (idx % len + len) % len
    activeGalleryIndex = ((newIdx % images.length) + images.length) % images.length;

    if (mainImg) {
      mainImg.style.opacity = '0.3';
      mainImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        mainImg.src = images[activeGalleryIndex];
        mainImg.style.opacity = '1';
        mainImg.style.transform = 'scale(1)';
      }, 120);
    }

    if (counterEl) {
      counterEl.textContent = `${activeGalleryIndex + 1} / ${images.length}`;
    }

    thumbBtns.forEach((btn, idx) => {
      if (idx === activeGalleryIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGallery(activeGalleryIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGallery(activeGalleryIndex + 1);
    });
  }

  thumbBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-thumb-index'), 10);
      if (!isNaN(idx)) {
        updateGallery(idx);
      }
    });
  });

  // Touch Swipe Gesture Support
  if (sliderWrap && images.length > 1) {
    let touchStartX = 0;
    let touchStartY = 0;

    sliderWrap.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    sliderWrap.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Check horizontal swipe greater than vertical scroll threshold
        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < 0) {
            // Swiped left -> Next image
            updateGallery(activeGalleryIndex + 1);
          } else {
            // Swiped right -> Previous image
            updateGallery(activeGalleryIndex - 1);
          }
        }
      }
    }, { passive: true });
  }

  const addBtn = document.getElementById('qv-add-cart-btn');
  if (addBtn && state.quickViewProduct) {
    addBtn.addEventListener('click', () => {
      const prod = state.quickViewProduct;
      const isOutOfStock = prod && ((prod.stockQty !== undefined && Number(prod.stockQty) <= 0) || (prod.stockCount !== undefined && Number(prod.stockCount) <= 0));
      if (isOutOfStock) {
        showToast(`${prod.name} is currently out of stock`, 'error');
        return;
      }
      state.addToCart(state.quickViewProduct, 'standard', 1);
      showToast(`Added ${state.quickViewProduct.name} to your bag`, 'success');
      state.setQuickViewProduct(null);
    });
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      state.setQuickViewProduct(null);
      document.removeEventListener('keydown', onKeyDown);
    } else if (e.key === 'ArrowRight' && images.length > 1) {
      updateGallery(activeGalleryIndex + 1);
    } else if (e.key === 'ArrowLeft' && images.length > 1) {
      updateGallery(activeGalleryIndex - 1);
    }
  };
  document.addEventListener('keydown', onKeyDown);
}
