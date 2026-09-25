export const ABOUT_HIGHLIGHTS = [
  {
    id: 'shine',
    title: 'Long-Lasting Shine',
    desc: 'Multi-layered gold polish resistant to daily sweat, water, and fading.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    img: '/images/about_genz_shine.jpg',
    badge: 'Mirror Gold Shine',
    leftLabel: 'Gold Finish',
    leftVal: 'Anti-Fade Coating',
    rightLabel: 'Longevity',
    rightVal: 'Daily Wear Safe'
  },
  {
    id: 'safe',
    title: 'Hypoallergenic & Safe',
    desc: '100% lead and nickel-free, safe for daily wear on sensitive skin.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    img: '/images/about_genz_safe.jpg',
    badge: '100% Skin Safe',
    leftLabel: 'Hypoallergenic',
    leftVal: 'Zero Irritation',
    rightLabel: 'Tested',
    rightVal: 'Lead & Nickel Free'
  },
  {
    id: 'pricing',
    title: 'Direct Honest Pricing',
    desc: 'No middlemen or showroom markups. Direct luxury from ₹249 to ₹999.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    img: '/images/about_genz_pricing.jpg',
    badge: 'Direct From Atelier',
    leftLabel: 'Zero Markup',
    leftVal: 'Delhi Atelier',
    rightLabel: 'True Value',
    rightVal: '₹249 – ₹999'
  }
];

export function renderAboutPage() {
  const initial = ABOUT_HIGHLIGHTS[0];

  return `
    <style>
      /* Scoped About Page Animations & Dynamic Photo Switcher */
      .about-interactive-card {
        position: relative;
        overflow: hidden;
        background: rgba(45, 6, 19, 0.45);
        border: 1px solid rgba(236, 207, 208, 0.14);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                    border-color 0.4s ease,
                    box-shadow 0.4s ease,
                    opacity 0.4s ease;
        cursor: pointer;
      }
      .about-interactive-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(92, 12, 42, 0.88), rgba(38, 4, 16, 0.96));
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
        z-index: 0;
      }
      .about-interactive-card > * {
        position: relative;
        z-index: 1;
      }
      .about-interactive-card:hover {
        transform: translateY(-5px);
        border-color: rgba(236, 207, 208, 0.45) !important;
        box-shadow: 0 16px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(236, 207, 208, 0.12) !important;
      }
      .about-interactive-card.active {
        border-color: rgba(236, 207, 208, 0.75) !important;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(236, 207, 208, 0.22) !important;
        transform: translateY(-4px);
      }
      .about-interactive-card.active::before {
        opacity: 1 !important;
      }
      .about-interactive-card.active .about-card-icon {
        background: rgba(236, 207, 208, 0.25) !important;
        border-color: rgba(236, 207, 208, 0.6) !important;
        color: #ffffff !important;
        transform: scale(1.12);
      }
      .about-card-icon {
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
      }
      .about-visual-frame {
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
      }
      .about-visual-frame:hover {
        transform: translateY(-4px);
        border-color: rgba(236, 207, 208, 0.5) !important;
        box-shadow: 0 22px 50px rgba(0, 0, 0, 0.75), 0 0 30px rgba(236, 207, 208, 0.15) !important;
      }
      .about-visual-img {
        transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
      }
      .about-step-card {
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
      }
      .about-step-card:hover {
        transform: translateY(-6px);
        border-color: rgba(75, 12, 34, 0.35) !important;
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25), 0 0 20px rgba(214, 184, 190, 0.25) !important;
      }
      .about-step-card:hover .about-step-num {
        color: #24040E !important;
        transform: scale(1.08);
      }
      .about-step-num {
        transition: color 0.35s ease, transform 0.35s ease;
        display: inline-block;
      }
      .about-stat-box {
        transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
      }
      .about-stat-box:hover {
        transform: translateY(-3px);
        background: rgba(55, 8, 26, 0.7) !important;
        border-color: rgba(236, 207, 208, 0.35) !important;
      }
      @keyframes floatGlow {
        0%, 100% { transform: translateY(0px); opacity: 0.75; }
        50% { transform: translateY(-8px); opacity: 1; }
      }
      .about-floating-orb {
        animation: floatGlow 5s ease-in-out infinite;
      }

      /* Desktop & Tablet: hide clones — only 3 cards show after 600px */
      @media (min-width: 601px) {
        .about-highlights-col .about-interactive-card.infinite-clone {
          display: none !important;
        }
      }

      /* Responsive Styles for Mobile & Small Screens (Desktop Untouched) */
      @media (max-width: 600px) {
        .about-page-backdrop {
          min-height: auto !important;
          padding-top: 66px !important;
          padding-bottom: 0px !important;
        }
        .about-container {
          padding-left: 16px !important;
          padding-right: 16px !important;
          box-sizing: border-box !important;
        }
        .about-hero-header {
          margin-top: 0 !important;
          margin-bottom: 62px !important;
          text-align: center !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .about-hero-title {
          font-size: clamp(1.85rem, 6.2vw, 2.45rem) !important;
          line-height: 1.18 !important;
          margin-bottom: 10px !important;
          letter-spacing: -0.01em !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .about-hero-desc {
          font-size: clamp(0.92rem, 3.4vw, 1.05rem) !important;
          line-height: 1.5 !important;
          max-width: 100% !important;
          width: 100% !important;
          margin: 0 auto !important;
          padding: 0 4px !important;
        }
        .about-split-section {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
          margin-top: 12px !important;
          margin-bottom: 32px !important;
        }
        .about-visual-frame {
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        .about-visual-frame img {
          height: 240px !important;
          object-fit: cover !important;
          transition: opacity 0.28s cubic-bezier(0.25, 1, 0.5, 1), transform 0.28s cubic-bezier(0.25, 1, 0.5, 1) !important;
          will-change: opacity, transform;
        }
        #about-featured-badge-text,
        #about-featured-left-val,
        #about-featured-right-val {
          transition: opacity 0.24s ease !important;
        }
        .about-floating-strip {
          bottom: 6px !important;
          left: 6px !important;
          right: 6px !important;
          padding: 5px 10px !important;
          border-radius: 8px !important;
        }
        .about-floating-strip-label {
          font-size: 0.60rem !important;
          letter-spacing: 0.05em !important;
          line-height: 1.15 !important;
        }
        .about-floating-strip-val {
          font-size: 0.78rem !important;
          line-height: 1.2 !important;
          margin-top: 1px !important;
        }
        .about-floating-orb {
          top: -8px !important;
          right: 10px !important;
          padding: 3.5px 10px !important;
          gap: 5px !important;
          border-radius: 99px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
        }
        .about-floating-orb svg {
          width: 11px !important;
          height: 11px !important;
        }
        .about-floating-orb #about-featured-badge-text {
          font-size: 0.74rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.02em !important;
        }
        .about-highlights-col {
          display: flex !important;
          flex-direction: row !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          scroll-snap-type: x mandatory !important;
          -webkit-overflow-scrolling: touch !important;
          gap: 12px !important;
          padding: 8px calc(14% - 6px) 14px calc(14% - 6px) !important;
          margin: 0 -16px !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .about-highlights-col::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .about-highlights-col::-webkit-scrollbar-track {
          display: none !important;
        }
        .about-highlights-col::-webkit-scrollbar-thumb {
          display: none !important;
        }
        .about-highlights-col .about-interactive-card {
          flex: 0 0 72% !important;
          min-width: 72% !important;
          max-width: 72% !important;
          scroll-snap-align: center !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          gap: 6px !important;
          padding: 14px 12px !important;
          border-radius: 14px !important;
          box-sizing: border-box !important;
          opacity: 0.58;
          transform: scale(0.92);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease !important;
        }
        .about-highlights-col .about-interactive-card.active {
          opacity: 1 !important;
          transform: scale(1.02) !important;
          border-color: rgba(236, 207, 208, 0.75) !important;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.65), 0 0 14px rgba(236, 207, 208, 0.25) !important;
        }
        .about-highlights-col .about-interactive-card.active::before {
          opacity: 1 !important;
        }
        .about-highlights-col .about-card-icon {
          width: 36px !important;
          height: 36px !important;
          min-width: 36px !important;
          border-radius: 10px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
          margin-bottom: 2px !important;
        }
        .about-highlights-col .about-card-icon svg {
          width: 18px !important;
          height: 18px !important;
        }
        .about-highlights-col .about-card-title {
          font-size: 0.96rem !important;
          font-weight: 700 !important;
          margin-bottom: 3px !important;
          text-align: center !important;
          line-height: 1.25 !important;
        }
        .about-highlights-col .about-card-desc {
          font-size: 0.78rem !important;
          line-height: 1.4 !important;
          text-align: center !important;
          margin: 0 !important;
          color: #ECCFD0 !important;
        }
        .about-steps-section {
          margin-top: 48px !important;
          margin-bottom: 20px !important;
          padding-top: 8px !important;
        }
        .about-steps-header {
          margin-bottom: 16px !important;
          text-align: center !important;
        }
        .about-steps-title {
          font-size: 1.45rem !important;
          margin-bottom: 4px !important;
        }
        .about-steps-desc {
          font-size: 0.84rem !important;
        }
        .about-steps-grid {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          gap: 12px !important;
          margin-top: 16px !important;
          padding-top: 6px !important;
          padding-bottom: 10px !important;
          scroll-snap-type: x mandatory !important;
          -webkit-overflow-scrolling: touch !important;
          scrollbar-width: thin !important;
          scrollbar-color: rgba(236, 207, 208, 0.45) rgba(255, 255, 255, 0.04) !important;
        }
        .about-steps-grid::-webkit-scrollbar {
          height: 3px !important;
          display: block !important;
        }
        .about-steps-grid::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05) !important;
          border-radius: 99px !important;
        }
        .about-steps-grid::-webkit-scrollbar-thumb {
          background: rgba(236, 207, 208, 0.45) !important;
          border-radius: 99px !important;
        }
        .about-step-card {
          flex: 0 0 62% !important;
          min-width: 62% !important;
          max-width: 62% !important;
          scroll-snap-align: start !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          padding: 14px 12px !important;
          border-radius: 14px !important;
          box-sizing: border-box !important;
        }
        .about-step-num {
          font-size: 1.65rem !important;
          font-weight: 800 !important;
          margin-bottom: 4px !important;
        }
        .about-step-card h5 {
          font-size: 0.98rem !important;
          font-weight: 700 !important;
          margin-bottom: 4px !important;
          white-space: normal !important;
          overflow: visible !important;
          width: 100% !important;
          line-height: 1.25 !important;
        }
        .about-step-card p {
          font-size: 0.78rem !important;
          line-height: 1.38 !important;
          display: block !important;
          overflow: visible !important;
          margin: 0 !important;
        }
        .about-journey-card {
          padding: 16px 12px !important;
          border-radius: 14px !important;
          margin-bottom: 40px !important;
        }
        .about-journey-grid {
          grid-template-columns: 1fr !important;
          gap: 14px !important;
        }
        .about-journey-tag {
          font-size: 0.66rem !important;
          margin-bottom: 3px !important;
        }
        .about-journey-title {
          font-size: 1.2rem !important;
          margin-bottom: 6px !important;
          line-height: 1.2 !important;
        }
        .about-journey-desc {
          font-size: 0.76rem !important;
          line-height: 1.4 !important;
          margin-bottom: 6px !important;
        }
        .about-quote-box {
          padding: 12px 10px !important;
          border-radius: 10px !important;
        }
        .about-quote-text {
          font-size: 0.80rem !important;
          line-height: 1.35 !important;
          margin-bottom: 10px !important;
        }
        .about-founder-row {
          gap: 8px !important;
          align-items: center !important;
        }
        .about-founder-avatar {
          width: 24px !important;
          height: 24px !important;
          font-size: 0.58rem !important;
        }
        .about-founder-text {
          font-size: 0.72rem !important;
          line-height: 1.2 !important;
        }
        .about-cta-box {
          margin-top: 48px !important;
          padding: 14px 12px !important;
          border-radius: 12px !important;
          max-width: 92% !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .about-cta-title {
          font-size: 0.98rem !important;
          margin-bottom: 3px !important;
        }
        .about-cta-desc {
          font-size: 0.68rem !important;
          margin-bottom: 10px !important;
          line-height: 1.25 !important;
        }
        .about-cta-btn {
          padding: 6px 15px !important;
          font-size: 0.72rem !important;
          gap: 5px !important;
        }
        .about-cta-box {
          margin-bottom: 0 !important;
        }
        .dev-credit-wrapper {
          margin-top: 4px !important;
          padding-bottom: 0 !important;
        }
        .dev-easter-btn {
          padding: 3px 9px !important;
          border-radius: 99px !important;
          gap: 4px !important;
        }
        .dev-easter-btn span {
          font-size: 0.58rem !important;
        }
        .dev-easter-btn .dev-pulse-icon {
          width: 9px !important;
          height: 9px !important;
        }
        .dev-easter-btn .dev-twinkle-sparkle {
          font-size: 0.60rem !important;
        }
        .luxury-divider {
          margin: 16px auto !important;
        }
      }

      @media (max-width: 480px) {
        .about-page-backdrop {
          padding-top: 60px !important;
        }
        .about-container {
          padding-left: 12px !important;
          padding-right: 12px !important;
        }
        .about-hero-header {
          margin-bottom: 58px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .about-hero-title {
          font-size: clamp(1.65rem, 6.8vw, 1.95rem) !important;
          line-height: 1.18 !important;
          margin-bottom: 8px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .about-hero-desc {
          font-size: clamp(0.86rem, 3.6vw, 0.96rem) !important;
          line-height: 1.45 !important;
          max-width: 100% !important;
          width: 100% !important;
          padding: 0 2px !important;
        }
        .about-split-section {
          margin-top: 10px !important;
        }
        .about-visual-frame img {
          height: 200px !important;
        }
        .about-floating-orb {
          top: -7px !important;
          right: 8px !important;
          padding: 3px 8px !important;
          gap: 4px !important;
        }
        .about-floating-orb svg {
          width: 10px !important;
          height: 10px !important;
        }
        .about-floating-orb #about-featured-badge-text {
          font-size: 0.70rem !important;
        }
        .about-floating-strip {
          bottom: 5px !important;
          left: 5px !important;
          right: 5px !important;
          padding: 4px 8px !important;
          border-radius: 7px !important;
        }
        .about-floating-strip-label {
          font-size: 0.58rem !important;
        }
        .about-floating-strip-val {
          font-size: 0.74rem !important;
        }
        .about-highlights-col {
          gap: 10px !important;
          padding: 6px calc(12% - 4px) 12px calc(12% - 4px) !important;
          margin: 0 -12px !important;
        }
        .about-highlights-col .about-interactive-card {
          flex: 0 0 76% !important;
          min-width: 76% !important;
          max-width: 76% !important;
          padding: 12px 10px !important;
          border-radius: 12px !important;
          gap: 5px !important;
        }
        .about-highlights-col .about-card-icon {
          width: 32px !important;
          height: 32px !important;
          min-width: 32px !important;
          border-radius: 8px !important;
        }
        .about-highlights-col .about-card-icon svg {
          width: 16px !important;
          height: 16px !important;
        }
        .about-highlights-col .about-card-title {
          font-size: 0.92rem !important;
        }
        .about-highlights-col .about-card-desc {
          font-size: 0.75rem !important;
          line-height: 1.36 !important;
        }
        .about-steps-section {
          margin-top: 42px !important;
          margin-bottom: 18px !important;
        }
        .about-step-card {
          flex: 0 0 65% !important;
          min-width: 65% !important;
          max-width: 65% !important;
          padding: 12px 10px !important;
          border-radius: 12px !important;
        }
        .about-step-num {
          font-size: 1.5rem !important;
          margin-bottom: 3px !important;
        }
        .about-step-card h5 {
          font-size: 0.92rem !important;
          margin-bottom: 3px !important;
        }
        .about-step-card p {
          font-size: 0.75rem !important;
          line-height: 1.34 !important;
        }
        .about-journey-title {
          font-size: 1.15rem !important;
        }
        .about-journey-card {
          margin-bottom: 34px !important;
        }
        .about-journey-desc {
          font-size: 0.74rem !important;
        }
        .about-founder-text {
          font-size: 0.70rem !important;
        }
        .about-cta-box {
          margin-top: 42px !important;
          padding: 12px 10px !important;
          border-radius: 11px !important;
        }
        .about-cta-title {
          font-size: 0.92rem !important;
        }
        .about-cta-desc {
          font-size: 0.64rem !important;
          margin-bottom: 8px !important;
        }
        .about-cta-btn {
          padding: 5px 12px !important;
          font-size: 0.68rem !important;
        }
        .dev-easter-btn {
          padding: 2.5px 7px !important;
          gap: 3.5px !important;
        }
        .dev-easter-btn span {
          font-size: 0.52rem !important;
        }
        .dev-easter-btn .dev-pulse-icon {
          width: 8px !important;
          height: 8px !important;
        }
        .dev-easter-btn .dev-twinkle-sparkle {
          font-size: 0.54rem !important;
        }
      }

      @media (max-width: 360px) {
        .about-page-backdrop {
          padding-top: 54px !important;
        }
        .about-container {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        .about-hero-header {
          margin-bottom: 52px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .about-hero-title {
          font-size: clamp(1.45rem, 6.6vw, 1.68rem) !important;
          line-height: 1.2 !important;
          margin-bottom: 6px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .about-hero-desc {
          font-size: clamp(0.80rem, 3.5vw, 0.88rem) !important;
          line-height: 1.42 !important;
          max-width: 100% !important;
          width: 100% !important;
        }
        .about-split-section {
          margin-top: 8px !important;
        }
        .about-steps-section {
          margin-top: 36px !important;
          margin-bottom: 16px !important;
        }
        .about-floating-orb {
          top: -6px !important;
          right: 6px !important;
          padding: 2.5px 7px !important;
          gap: 3.5px !important;
        }
        .about-floating-orb svg {
          width: 9px !important;
          height: 9px !important;
        }
        .about-floating-orb #about-featured-badge-text {
          font-size: 0.66rem !important;
        }
        .about-floating-strip {
          bottom: 4px !important;
          left: 4px !important;
          right: 4px !important;
          padding: 3.5px 7px !important;
          border-radius: 6px !important;
        }
        .about-floating-strip-label {
          font-size: 0.54rem !important;
        }
        .about-floating-strip-val {
          font-size: 0.68rem !important;
        }
        .about-highlights-col {
          gap: 8px !important;
          padding: 5px calc(10% - 4px) 10px calc(10% - 4px) !important;
          margin: 0 -10px !important;
        }
        .about-highlights-col .about-interactive-card {
          flex: 0 0 80% !important;
          min-width: 80% !important;
          max-width: 80% !important;
          padding: 10px 8px !important;
          border-radius: 11px !important;
          gap: 4px !important;
        }
        .about-highlights-col .about-card-icon {
          width: 28px !important;
          height: 28px !important;
          min-width: 28px !important;
          border-radius: 7px !important;
        }
        .about-highlights-col .about-card-icon svg {
          width: 14px !important;
          height: 14px !important;
        }
        .about-highlights-col .about-card-title {
          font-size: 0.86rem !important;
        }
        .about-highlights-col .about-card-desc {
          font-size: 0.70rem !important;
          line-height: 1.32 !important;
        }
        .about-visual-frame img {
          height: 175px !important;
        }
        .about-step-card {
          flex: 0 0 70% !important;
          min-width: 70% !important;
          max-width: 70% !important;
          padding: 10px 8px !important;
          border-radius: 11px !important;
        }
        .about-step-num {
          font-size: 1.35rem !important;
        }
        .about-step-card h5 {
          font-size: 0.86rem !important;
        }
        .about-step-card p {
          font-size: 0.70rem !important;
        }
        .about-journey-card {
          margin-bottom: 30px !important;
        }
        .about-founder-text {
          font-size: 0.66rem !important;
        }
        .about-cta-box {
          margin-top: 36px !important;
          padding: 10px 8px !important;
          border-radius: 9px !important;
        }
        .about-cta-title {
          font-size: 0.86rem !important;
        }
        .about-cta-desc {
          font-size: 0.60rem !important;
          margin-bottom: 7px !important;
        }
        .about-cta-btn {
          padding: 4px 10px !important;
          font-size: 0.64rem !important;
        }
        .dev-easter-btn {
          padding: 2px 6px !important;
          gap: 3px !important;
        }
        .dev-easter-btn span {
          font-size: 0.48rem !important;
        }
        .dev-easter-btn .dev-pulse-icon {
          width: 7px !important;
          height: 7px !important;
        }
        .dev-easter-btn .dev-twinkle-sparkle {
          font-size: 0.50rem !important;
        }
      }

      @media (max-width: 300px) {
        .about-page-backdrop {
          padding-top: 48px !important;
        }
        .about-hero-header {
          margin-bottom: 46px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .about-hero-title {
          font-size: 1.3rem !important;
          line-height: 1.2 !important;
          margin-bottom: 5px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .about-hero-desc {
          font-size: 0.74rem !important;
          line-height: 1.38 !important;
          max-width: 100% !important;
          width: 100% !important;
        }
        .about-split-section {
          margin-top: 8px !important;
        }
        .about-floating-orb {
          top: -5px !important;
          right: 5px !important;
          padding: 2px 6px !important;
          gap: 3px !important;
        }
        .about-floating-orb svg {
          width: 8px !important;
          height: 8px !important;
        }
        .about-floating-orb #about-featured-badge-text {
          font-size: 0.60rem !important;
        }
        .about-floating-strip {
          bottom: 3px !important;
          left: 3px !important;
          right: 3px !important;
          padding: 3px 6px !important;
          border-radius: 5px !important;
        }
        .about-floating-strip-label {
          font-size: 0.50rem !important;
        }
        .about-floating-strip-val {
          font-size: 0.62rem !important;
        }
        .about-highlights-col {
          gap: 6px !important;
          padding: 4px calc(8% - 3px) 8px calc(8% - 3px) !important;
          margin: 0 -8px !important;
        }
        .about-highlights-col .about-interactive-card {
          flex: 0 0 84% !important;
          min-width: 84% !important;
          max-width: 84% !important;
          padding: 8px 6px !important;
          border-radius: 10px !important;
          gap: 3px !important;
        }
        .about-highlights-col .about-card-icon {
          width: 24px !important;
          height: 24px !important;
          min-width: 24px !important;
          border-radius: 6px !important;
        }
        .about-highlights-col .about-card-icon svg {
          width: 12px !important;
          height: 12px !important;
        }
        .about-highlights-col .about-card-title {
          font-size: 0.80rem !important;
        }
        .about-highlights-col .about-card-desc {
          font-size: 0.66rem !important;
          line-height: 1.30 !important;
        }
        .about-visual-frame img {
          height: 150px !important;
        }
        .about-step-card {
          flex: 0 0 76% !important;
          min-width: 76% !important;
          max-width: 76% !important;
          padding: 8px 6px !important;
          border-radius: 10px !important;
        }
        .about-step-num {
          font-size: 1.25rem !important;
        }
        .about-step-card h5 {
          font-size: 0.80rem !important;
        }
        .about-step-card p {
          font-size: 0.66rem !important;
        }
        .about-journey-card {
          margin-bottom: 26px !important;
        }
        .about-cta-box {
          margin-top: 32px !important;
          padding: 8px 6px !important;
          border-radius: 8px !important;
        }
        .about-cta-title {
          font-size: 0.80rem !important;
        }
        .about-cta-desc {
          font-size: 0.56rem !important;
          margin-bottom: 6px !important;
        }
        .about-cta-btn {
          padding: 3.5px 8px !important;
          font-size: 0.60rem !important;
        }
        .dev-easter-btn {
          padding: 1.5px 5px !important;
          gap: 2.5px !important;
        }
        .dev-easter-btn span {
          font-size: 0.44rem !important;
        }
        .dev-easter-btn .dev-pulse-icon {
          width: 6px !important;
          height: 6px !important;
        }
        .dev-easter-btn .dev-twinkle-sparkle {
          font-size: 0.46rem !important;
        }
      }
    </style>

    <div class="satin-backdrop about-page-backdrop" style="min-height: 100vh; padding: 110px 0 80px 0;">
      <div class="container about-container" style="max-width: 1120px; margin: 0 auto; padding: 0 20px;">
        
        <!-- 1. CLEAN HERO HEADER -->
        <div class="about-hero-header" style="text-align: center; max-width: 950px; width: 100%; margin: 0 auto 65px auto;">
          <h1 class="about-hero-title" style="font-family: var(--font-serif); font-size: clamp(2.4rem, 4.8vw, 3.8rem); color: #ffffff; line-height: 1.18; margin-bottom: 14px; letter-spacing: -0.01em; width: 100%;">
            Everyday Elegance. <span style="background: linear-gradient(135deg, #ECCFD0 0%, #FFFFFF 50%, #C99396 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Honest Luxury.</span>
          </h1>
          <p class="about-hero-desc" style="color: var(--color-text-secondary); font-size: clamp(1.05rem, 1.5vw, 1.22rem); line-height: 1.5; max-width: 680px; width: 100%; margin: 0 auto;">
            Exquisite everyday jewelry crafted with anti-fade shine and skin-safe comfort.
          </p>
        </div>

        <!-- 2. INTERACTIVE SPLIT: DYNAMIC PHOTO FRAME + 3 HOVER/CLICK BLOCKS -->
        <div class="about-split-section" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 32px; align-items: center; margin-bottom: 60px;">
          
          <!-- Left: Dynamic Photo Frame -->
          <div class="about-visual-col" style="position: relative;">
            <div class="about-visual-frame" style="position: relative; border-radius: 24px; overflow: hidden; border: 1.5px solid rgba(236, 207, 208, 0.25); background: #180208; box-shadow: 0 16px 40px rgba(0,0,0,0.55);">
              <img id="about-featured-img" src="${initial.img}" alt="${initial.title}" class="about-visual-img" style="width: 100%; height: 420px; object-fit: cover; display: block; filter: brightness(0.92);">
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(18,2,7,0.92) 0%, rgba(18,2,7,0.1) 60%, rgba(0,0,0,0) 100%);"></div>
              
              <!-- Floating Bottom Info Strip (Compact & Sleek) -->
              <div class="about-floating-strip" style="position: absolute; bottom: 12px; left: 12px; right: 12px; background: rgba(26, 3, 11, 0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(236, 207, 208, 0.2); border-radius: 12px; padding: 9px 16px; display: flex; align-items: center; justify-content: space-between; transition: all 0.3s ease;">
                <div>
                  <div id="about-featured-left-label" class="about-floating-strip-label" style="color: #ECCFD0; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; line-height: 1.15;">${initial.leftLabel}</div>
                  <div id="about-featured-left-val" class="about-floating-strip-val" style="color: #ffffff; font-size: 0.92rem; font-weight: 600; line-height: 1.25; margin-top: 2px;">${initial.leftVal}</div>
                </div>
                <div style="text-align: right;">
                  <div id="about-featured-right-label" class="about-floating-strip-label" style="color: #ECCFD0; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; line-height: 1.15;">${initial.rightLabel}</div>
                  <div id="about-featured-right-val" class="about-floating-strip-val" style="color: #ffffff; font-size: 0.92rem; font-weight: 600; line-height: 1.25; margin-top: 2px;">${initial.rightVal}</div>
                </div>
              </div>
            </div>

            <!-- Floating Dynamic Glow Badge -->
            <div class="about-floating-orb" style="position: absolute; top: -10px; right: 16px; background: linear-gradient(135deg, #7A0C2E, #380312); border: 1px solid rgba(236, 207, 208, 0.45); padding: 6px 16px; border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 7px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ECCFD0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span id="about-featured-badge-text" style="color: #ECCFD0; font-size: 0.85rem; font-weight: 600;">${initial.badge}</span>
            </div>
          </div>

          <!-- Right: Interactive Feature Blocks (Hover or Click to switch photo; seamless infinite circular mobile loop) -->
          <div class="about-highlights-col" style="display: flex; flex-direction: column; gap: 16px;" id="about-highlights-container">
            ${Array(10).fill(ABOUT_HIGHLIGHTS).flat().map((item, vIdx) => {
              const rIdx = vIdx % ABOUT_HIGHLIGHTS.length;
              const isClone = vIdx < 12 || vIdx >= 15;
              const isActive = vIdx === 12;
              return `
              <div 
                class="about-interactive-card about-highlight-trigger ${isActive ? 'active' : ''} ${isClone ? 'infinite-clone' : ''}" 
                data-virtual-index="${vIdx}"
                data-index="${rIdx}"
                style="background: rgba(45, 6, 19, 0.45); border: 1px solid rgba(236, 207, 208, 0.14); border-radius: 18px; padding: 22px 24px; display: flex; gap: 18px; align-items: center;"
              >
                <div class="about-card-icon" style="width: 48px; height: 48px; border-radius: 12px; background: rgba(236, 207, 208, 0.08); border: 1px solid rgba(236, 207, 208, 0.2); display: flex; align-items: center; justify-content: center; color: #ECCFD0; flex-shrink: 0;">
                  ${item.icon}
                </div>
                <div>
                  <h4 class="about-card-title" style="color: #ffffff; font-size: 1.15rem; font-weight: 600; margin-bottom: 4px;">${item.title}</h4>
                  <p class="about-card-desc" style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.5; margin: 0;">
                    ${item.desc}
                  </p>
                </div>
              </div>
            `;}).join('')}
          </div>
        </div>

        <!-- Luxury Partition Divider -->
        <div class="luxury-divider" style="margin: 85px auto 75px auto;"></div>

        <!-- 3. FOUR CRAFTSMANSHIP STEPS (DUSKY MATTE ROSE THEME) -->
        <div class="about-steps-section" style="margin-bottom: 85px;">
          <div class="about-steps-header" style="text-align: center; margin-bottom: 38px;">
            <h3 class="about-steps-title" style="font-family: var(--font-serif); font-size: clamp(2rem, 3.4vw, 2.6rem); color: #ffffff; margin-bottom: 8px;">
              Crafted in 4 Steps
            </h3>
            <p class="about-steps-desc" style="color: var(--color-text-muted); font-size: 1rem; margin: 0;">
              Our quality assurance process for everyday wear.
            </p>
          </div>

          <div class="about-steps-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
            
            <div class="about-step-card" style="background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%); border: 1.5px solid rgba(75, 12, 34, 0.15); border-radius: 18px; padding: 24px 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.18);">
              <div class="about-step-num" style="font-family: var(--font-sans); font-size: 2.1rem; font-weight: 800; color: #5A0E28; line-height: 1; margin-bottom: 10px;">01</div>
              <h5 style="color: #24040E; font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">Alloy Casting</h5>
              <p style="color: #4A1222; font-size: 0.94rem; line-height: 1.5; margin: 0; font-weight: 500;">
                Skin-safe, nickel-free lightweight bases for pain-free wear.
              </p>
            </div>

            <div class="about-step-card" style="background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%); border: 1.5px solid rgba(75, 12, 34, 0.15); border-radius: 18px; padding: 24px 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.18);">
              <div class="about-step-num" style="font-family: var(--font-sans); font-size: 2.1rem; font-weight: 800; color: #5A0E28; line-height: 1; margin-bottom: 10px;">02</div>
              <h5 style="color: #24040E; font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">Prong Setting</h5>
              <p style="color: #4A1222; font-size: 0.94rem; line-height: 1.5; margin: 0; font-weight: 500;">
                Hand-set crystals securely locked for maximum light brilliance.
              </p>
            </div>

            <div class="about-step-card" style="background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%); border: 1.5px solid rgba(75, 12, 34, 0.15); border-radius: 18px; padding: 24px 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.18);">
              <div class="about-step-num" style="font-family: var(--font-sans); font-size: 2.1rem; font-weight: 800; color: #5A0E28; line-height: 1; margin-bottom: 10px;">03</div>
              <h5 style="color: #24040E; font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">Triple Polish</h5>
              <p style="color: #4A1222; font-size: 0.94rem; line-height: 1.5; margin: 0; font-weight: 500;">
                Multi-pass gold plating with protective anti-fade nano seal.
              </p>
            </div>

            <div class="about-step-card" style="background: linear-gradient(145deg, #D6B8BE 0%, #C4A2A9 100%); border: 1.5px solid rgba(75, 12, 34, 0.15); border-radius: 18px; padding: 24px 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.18);">
              <div class="about-step-num" style="font-family: var(--font-sans); font-size: 2.1rem; font-weight: 800; color: #5A0E28; line-height: 1; margin-bottom: 10px;">04</div>
              <h5 style="color: #24040E; font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">Luxe Packaging</h5>
              <p style="color: #4A1222; font-size: 0.94rem; line-height: 1.5; margin: 0; font-weight: 500;">
                Sanitized, checked, and boxed for express all-India dispatch.
              </p>
            </div>

          </div>
        </div>

        <!-- Luxury Partition Divider -->
        <div class="luxury-divider" style="margin: 75px auto 75px auto;"></div>

        <!-- 4. THE STARTUP JOURNEY & FOUNDER'S NOTE -->
        <div class="about-journey-card about-interactive-card" style="background: linear-gradient(145deg, rgba(50, 7, 22, 0.65), rgba(18, 2, 8, 0.85)); border: 1.5px solid rgba(236, 207, 208, 0.2); border-radius: 24px; padding: 36px 30px; margin-bottom: 50px; position: relative; overflow: hidden; box-shadow: 0 14px 35px rgba(0,0,0,0.45);">
          
          <div class="about-journey-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; align-items: center;">
            <div class="about-journey-story-col">
              <span class="about-journey-tag" style="color: #ECCFD0; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; display: block; margin-bottom: 6px;">The Startup Journey</span>
              <h3 class="about-journey-title" style="font-family: var(--font-serif); font-size: clamp(1.6rem, 2.6vw, 2.1rem); color: #ffffff; margin-bottom: 12px; line-height: 1.25;">
                Born in Delhi. Built for India.
              </h3>
              <p class="about-journey-desc" style="color: var(--color-text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 12px;">
                Valeora started with a simple question: <em>why does everyday fashion jewelry either turn dark in a week or come with 10x showroom markups?</em>
              </p>
              <p class="about-journey-desc" style="color: var(--color-text-muted); font-size: 0.88rem; line-height: 1.55; margin: 0;">
                By partnering directly with precision alloy artisans and shipping straight to consumers, we created a homegrown brand where luxury shine meets honest pricing (₹249 – ₹999).
              </p>
            </div>

            <div class="about-quote-box" style="background: rgba(30, 4, 13, 0.7); border: 1px solid rgba(236, 207, 208, 0.15); border-radius: 18px; padding: 24px 22px; position: relative;">
              <blockquote class="about-quote-text" style="font-family: var(--font-serif); font-size: 1.05rem; color: #ffffff; line-height: 1.55; margin: 0 0 16px 0; font-style: italic;">
                “Everyday jewelry shouldn't be a delicate privilege you keep locked in a drawer. It should be your daily confidence.”
              </blockquote>
              <div style="display: flex; flex-direction: column; gap: 12px; border-top: 1px solid rgba(236, 207, 208, 0.14); padding-top: 14px;">
                <!-- Line 1: Founded by Dhruv Gupta & Apoorva Gupta -->
                <div class="about-founder-row" style="display: flex; align-items: center; gap: 12px;">
                  <div style="display: flex; align-items: center; flex-shrink: 0;">
                    <div class="about-founder-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #ECCFD0, #800020); display: flex; align-items: center; justify-content: center; color: #1c040d; font-weight: 700; font-size: 0.74rem; border: 1.5px solid rgba(26, 3, 11, 0.9); z-index: 2; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
                      DG
                    </div>
                    <div class="about-founder-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #FFD1DC, #4A0818); display: flex; align-items: center; justify-content: center; color: #1c040d; font-weight: 700; font-size: 0.74rem; margin-left: -10px; border: 1.5px solid rgba(26, 3, 11, 0.9); z-index: 1; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
                      AG
                    </div>
                  </div>
                  <div>
                    <span class="about-founder-text" style="color: #ECCFD0; font-size: 0.92rem; font-weight: 600;">Founded by Dhruv Gupta & Apoorva Gupta</span>
                  </div>
                </div>

                <!-- Line 2: Owned & Operated by Siddhanto Roy & Ankit Bhargav -->
                <div class="about-founder-row" style="display: flex; align-items: center; gap: 12px;">
                  <div style="display: flex; align-items: center; flex-shrink: 0;">
                    <div class="about-founder-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #F8E3E4, #660C24); display: flex; align-items: center; justify-content: center; color: #1c040d; font-weight: 700; font-size: 0.74rem; border: 1.5px solid rgba(26, 3, 11, 0.9); z-index: 2; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
                      SR
                    </div>
                    <div class="about-founder-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #E2B7B9, #330412); display: flex; align-items: center; justify-content: center; color: #1c040d; font-weight: 700; font-size: 0.74rem; margin-left: -10px; border: 1.5px solid rgba(26, 3, 11, 0.9); z-index: 1; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
                      AB
                    </div>
                  </div>
                  <div>
                    <span class="about-founder-text" style="color: #ECCFD0; font-size: 0.92rem; font-weight: 600;">Owned & Operated by Siddhanto Roy & Ankit Bhargav</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- 6. MINIMALIST CTA FOOTER -->
        <div class="about-cta-box" style="text-align: center; padding: 36px 20px; background: linear-gradient(145deg, rgba(60, 9, 27, 0.7) 0%, rgba(22, 3, 10, 0.9) 100%); border: 1.5px solid rgba(236, 207, 208, 0.22); border-radius: 24px; box-shadow: 0 16px 40px rgba(0,0,0,0.5);">
          <h3 class="about-cta-title" style="font-family: var(--font-serif); font-size: clamp(1.5rem, 2.5vw, 1.9rem); color: #ffffff; margin-bottom: 8px;">
            Ready to Adorn Your Everyday?
          </h3>
          <p class="about-cta-desc" style="color: var(--color-text-muted); font-size: 0.88rem; margin: 0 auto 20px auto; max-width: 440px;">
            Discover timeless, skin-friendly fashion jewelry starting at just ₹249.
          </p>
          <a href="#shop" class="btn btn-pill about-cta-btn" data-route="shop" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; font-size: 0.9rem; font-weight: 600;">
            <span>Shop Collection</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>

        <!-- 7. ATELIER DIGITAL DEV CREDIT (BOUNCING INTERACTIVE EASTER EGG) -->
        <div class="dev-credit-wrapper" style="text-align: center; margin-top: 32px; padding-bottom: 10px;">
          <button id="dev-credit-trigger" class="dev-easter-btn" style="position: relative; background: rgba(236, 207, 208, 0.08); border: 1.5px solid rgba(236, 207, 208, 0.35); border-radius: 24px; padding: 7px 18px; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; overflow: hidden;">
            <div class="dev-shimmer-sweep"></div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ECCFD0" stroke-width="2.5" class="dev-pulse-icon"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span style="color: var(--color-text-secondary); font-size: 0.76rem; font-weight: 500;">Dev: <strong style="color: #ECCFD0; font-weight: 700; letter-spacing: 0.02em;">Akash Sharma</strong></span>
          </button>
        </div>

      </div>
    </div>

    <style>
      .dev-easter-btn {
        animation: devBadgeBounce 2.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite,
                   devBadgeGlow 2.6s ease-in-out infinite;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    background 0.3s ease,
                    border-color 0.3s ease,
                    box-shadow 0.3s ease;
      }
      .dev-easter-btn:hover {
        animation-play-state: paused;
        transform: translateY(-6px) scale(1.06) !important;
        background: rgba(236, 207, 208, 0.22) !important;
        border-color: rgba(236, 207, 208, 0.8) !important;
        box-shadow: 0 10px 28px rgba(236, 207, 208, 0.35), 0 0 18px rgba(236, 207, 208, 0.25) !important;
      }
      .dev-twinkle-sparkle {
        animation: devSparkleTwinkle 1.8s ease-in-out infinite;
      }
      .dev-pulse-icon {
        transition: transform 0.3s ease;
      }
      .dev-easter-btn:hover .dev-pulse-icon {
        transform: rotate(20deg) scale(1.2);
      }
      .dev-shimmer-sweep {
        position: absolute;
        top: 0;
        left: -100%;
        width: 60%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
        transform: skewX(-25deg);
        animation: devShimmerSlide 3.2s infinite ease-in-out;
        pointer-events: none;
      }
      @keyframes devBadgeBounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-6px);
        }
      }
      @keyframes devBadgeGlow {
        0%, 100% {
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3), 0 0 0 rgba(236, 207, 208, 0);
          border-color: rgba(236, 207, 208, 0.3);
        }
        50% {
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.45), 0 0 16px rgba(236, 207, 208, 0.3);
          border-color: rgba(236, 207, 208, 0.7);
        }
      }
      @keyframes devSparkleTwinkle {
        0%, 100% {
          transform: scale(0.9) rotate(0deg);
          opacity: 0.75;
        }
        50% {
          transform: scale(1.3) rotate(15deg);
          opacity: 1;
        }
      }
      @keyframes devShimmerSlide {
        0% { left: -100%; }
        35%, 100% { left: 160%; }
      }
    </style>
  `;
}

// --- CONTINUOUS LUXURY SOUNDTRACK ENGINE (AKASH SHARMA) ---

let luxeAudioState = {
  ctx: null,
  intervalId: null,
  masterGain: null,
  isPlaying: false
};

function startContinuousLuxurySoundtrack() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!luxeAudioState.ctx) luxeAudioState.ctx = new AudioContext();
    const ctx = luxeAudioState.ctx;
    if (ctx.state === 'suspended') ctx.resume();

    // Master Output Gain with smooth fade-in
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.4);
    masterGain.connect(ctx.destination);
    luxeAudioState.masterGain = masterGain;

    const bpm = 120;
    const stepDuration = (60 / bpm) / 2; // 8th notes (0.25s)
    let step = 0;

    // Harmonic pentatonic scales in Eb Major 9th
    const harpNotes = [311.13, 392.00, 466.16, 587.33, 698.46, 932.33, 1174.66, 1396.91, 1174.66, 932.33, 698.46, 587.33, 466.16, 392.00];
    const bassRiff = [77.78, 77.78, 116.54, 98.00, 103.83, 103.83, 116.54, 77.78];

    luxeAudioState.isPlaying = true;
    luxeAudioState.intervalId = setInterval(() => {
      if (!luxeAudioState.isPlaying) return;
      const t = ctx.currentTime;

      // 1. Warm Analog Sub-Bass Note (every 2 steps / quarter note)
      if (step % 2 === 0) {
        const bassFreq = bassRiff[(step / 2) % bassRiff.length];
        const bOsc = ctx.createOscillator();
        const bGain = ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bassFreq, t);

        bGain.gain.setValueAtTime(0.001, t);
        bGain.gain.exponentialRampToValueAtTime(0.24, t + 0.03);
        bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        bOsc.connect(bGain);
        bGain.connect(masterGain);
        bOsc.start(t);
        bOsc.stop(t + 0.48);
      }

      // 2. Crystalline Shimmer Harp Chime (every step / 8th note)
      const noteFreq = harpNotes[step % harpNotes.length];
      const noteOsc = ctx.createOscillator();
      const noteChorus = ctx.createOscillator();
      const overtoneOsc = ctx.createOscillator();
      const nGain = ctx.createGain();
      const oGain = ctx.createGain();

      noteOsc.type = 'sine';
      noteOsc.frequency.setValueAtTime(noteFreq, t);

      noteChorus.type = 'sine';
      noteChorus.frequency.setValueAtTime(noteFreq, t);
      noteChorus.detune.setValueAtTime(4.0, t);

      overtoneOsc.type = 'sine';
      overtoneOsc.frequency.setValueAtTime(noteFreq * 2.002, t);

      nGain.gain.setValueAtTime(0.0001, t);
      nGain.gain.exponentialRampToValueAtTime(0.12, t + 0.015);
      nGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);

      oGain.gain.setValueAtTime(0.04, t);
      oGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      noteOsc.connect(nGain);
      noteChorus.connect(nGain);
      overtoneOsc.connect(oGain);
      oGain.connect(nGain);
      nGain.connect(masterGain);

      noteOsc.start(t);
      noteOsc.stop(t + 0.7);
      noteChorus.start(t);
      noteChorus.stop(t + 0.7);
      overtoneOsc.start(t);
      overtoneOsc.stop(t + 0.4);

      // 3. Ambient Velvet Pad Swell (every 8 steps / 2 beats)
      if (step % 8 === 0) {
        const padFreqs = [155.56, 233.08, 311.13, 392.00];
        padFreqs.forEach(pf => {
          const pOsc = ctx.createOscillator();
          const pGain = ctx.createGain();
          pOsc.type = 'triangle';
          pOsc.frequency.setValueAtTime(pf, t);

          pGain.gain.setValueAtTime(0.0001, t);
          pGain.gain.exponentialRampToValueAtTime(0.04, t + 0.4);
          pGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);

          pOsc.connect(pGain);
          pGain.connect(masterGain);
          pOsc.start(t);
          pOsc.stop(t + 1.9);
        });
      }

      step++;
    }, stepDuration * 1000);
  } catch (e) {
    // Web audio fallback
  }
}

function stopContinuousLuxurySoundtrack() {
  luxeAudioState.isPlaying = false;
  if (luxeAudioState.intervalId) {
    clearInterval(luxeAudioState.intervalId);
    luxeAudioState.intervalId = null;
  }
  if (luxeAudioState.masterGain && luxeAudioState.ctx) {
    try {
      const t = luxeAudioState.ctx.currentTime;
      luxeAudioState.masterGain.gain.setValueAtTime(luxeAudioState.masterGain.gain.value, t);
      luxeAudioState.masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    } catch (e) {}
  }
}

// Particle Explosion Function
function launchRaveConfetti(originX, originY) {
  const particleCount = 70;
  const emojis = ['💎', '⚡', '✨', '🔥', '🚀', '👑', '⭐', '🌈', '💫'];
  const colors = ['#ECCFD0', '#FF007F', '#00F0FF', '#FFD700', '#A6FF00', '#FFFFFF'];

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('div');
    const isEmoji = Math.random() > 0.4;
    
    if (isEmoji) {
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.fontSize = `${Math.floor(Math.random() * 18 + 14)}px`;
    } else {
      el.style.width = `${Math.floor(Math.random() * 10 + 6)}px`;
      el.style.height = `${Math.floor(Math.random() * 10 + 6)}px`;
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.boxShadow = `0 0 14px ${colors[Math.floor(Math.random() * colors.length)]}`;
    }

    el.style.position = 'fixed';
    el.style.left = `${originX || window.innerWidth / 2}px`;
    el.style.top = `${originY || window.innerHeight / 2}px`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '99999';
    el.style.userSelect = 'none';

    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 500 + 180;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 120;
    const rotSpeed = (Math.random() - 0.5) * 720;
    const duration = Math.random() * 1.3 + 0.9;

    el.animate([
      { transform: `translate(0, 0) rotate(0deg) scale(1)`, opacity: 1 },
      { transform: `translate(${vx}px, ${vy + 200}px) rotate(${rotSpeed}deg) scale(0)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }).onfinish = () => el.remove();
  }
}

// Full Luxe Cyberpunk Screen Rave Trigger
function triggerCyberpunkScreenRave() {
  const existingCanvas = document.getElementById('cyber-rave-canvas');
  if (existingCanvas) return; // already active

  // Start continuous, rich acoustic soundtrack throughout the entire effect
  startContinuousLuxurySoundtrack();

  // 1. Create Fullscreen Laser & Iridescent Orbs Canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'cyber-rave-canvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '99990';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 0.5s ease';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  setTimeout(() => { canvas.style.opacity = '1'; }, 20);

  // Iridescent Floating Orbs
  const orbs = Array.from({ length: 18 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 90 + 40,
    vx: (Math.random() - 0.5) * 4.5,
    vy: (Math.random() - 0.5) * 4.5,
    hue: Math.random() * 360,
    alpha: Math.random() * 0.35 + 0.2
  }));

  // Laser Beams
  let laserAngle = 0;
  let animId;

  const renderRave = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dynamic strobe tint background
    const bgHue = (Date.now() / 20) % 360;
    ctx.fillStyle = `hsla(${bgHue}, 80%, 10%, 0.18)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Iridescent Orbs
    orbs.forEach(orb => {
      orb.x += orb.vx;
      orb.y += orb.vy;
      if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
      if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
      if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;
      orb.hue = (orb.hue + 1.2) % 360;

      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      grad.addColorStop(0, `hsla(${orb.hue}, 100%, 75%, ${orb.alpha})`);
      grad.addColorStop(0.5, `hsla(${(orb.hue + 60) % 360}, 90%, 60%, ${orb.alpha * 0.6})`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Sweeping Laser Beams from corners
    laserAngle += 0.035;
    const origins = [
      { x: 0, y: 0, color: '#FF007F' },
      { x: canvas.width, y: 0, color: '#00F0FF' },
      { x: 0, y: canvas.height, color: '#FFD700' },
      { x: canvas.width, y: canvas.height, color: '#A6FF00' }
    ];

    origins.forEach((orig, i) => {
      const angle = laserAngle + (i * Math.PI) / 2;
      const targetX = canvas.width / 2 + Math.cos(angle) * (canvas.width * 0.75);
      const targetY = canvas.height / 2 + Math.sin(angle * 1.3) * (canvas.height * 0.75);

      ctx.save();
      ctx.strokeStyle = orig.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = orig.color;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(orig.x, orig.y);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      // Laser Core
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    });

    animId = requestAnimationFrame(renderRave);
  };
  renderRave();

  // 2. Interactive Sparkle Mouse Wand Handler
  const mouseTrailHandler = (e) => {
    if (Math.random() > 0.25) {
      const spark = document.createElement('div');
      const icons = ['✨', '💎', '⚡', '🌟', '🎉', '🔥'];
      spark.textContent = icons[Math.floor(Math.random() * icons.length)];
      spark.style.position = 'fixed';
      spark.style.left = `${e.clientX - 10}px`;
      spark.style.top = `${e.clientY - 10}px`;
      spark.style.pointerEvents = 'none';
      spark.style.zIndex = '99998';
      spark.style.fontSize = `${Math.floor(Math.random() * 14 + 14)}px`;
      spark.style.textShadow = '0 0 10px #FF007F, 0 0 20px #00F0FF';
      document.body.appendChild(spark);

      spark.animate([
        { transform: 'scale(1) translate(0, 0)', opacity: 1 },
        { transform: `scale(0.2) translate(${(Math.random() - 0.5) * 80}px, ${Math.random() * 80 + 20}px)`, opacity: 0 }
      ], {
        duration: 700,
        easing: 'ease-out'
      }).onfinish = () => spark.remove();
    }
  };
  window.addEventListener('mousemove', mouseTrailHandler);

  // 3. Multi-Cannon Confetti Blasts with Synchronized Waves
  launchRaveConfetti(window.innerWidth / 2, window.innerHeight / 2);
  launchRaveConfetti(window.innerWidth * 0.2, window.innerHeight * 0.4);
  launchRaveConfetti(window.innerWidth * 0.8, window.innerHeight * 0.4);

  const confettiWave1 = setTimeout(() => {
    launchRaveConfetti(window.innerWidth * 0.3, window.innerHeight * 0.6);
    launchRaveConfetti(window.innerWidth * 0.7, window.innerHeight * 0.6);
  }, 1200);

  const confettiWave2 = setTimeout(() => {
    launchRaveConfetti(window.innerWidth / 2, window.innerHeight * 0.3);
    launchRaveConfetti(window.innerWidth * 0.15, window.innerHeight * 0.5);
    launchRaveConfetti(window.innerWidth * 0.85, window.innerHeight * 0.5);
  }, 2500);

  const confettiWave3 = setTimeout(() => {
    launchRaveConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }, 4200);

  const confettiWave4 = setTimeout(() => {
    launchRaveConfetti(window.innerWidth * 0.35, window.innerHeight * 0.4);
    launchRaveConfetti(window.innerWidth * 0.65, window.innerHeight * 0.4);
  }, 6500);

  // Stop Rave Cleanup Function
  const stopRave = () => {
    stopContinuousLuxurySoundtrack();
    clearTimeout(confettiWave1);
    clearTimeout(confettiWave2);
    clearTimeout(confettiWave3);
    clearTimeout(confettiWave4);
    window.removeEventListener('mousemove', mouseTrailHandler);
    if (canvas) {
      canvas.style.opacity = '0';
      setTimeout(() => {
        cancelAnimationFrame(animId);
        canvas.remove();
      }, 500);
    }
  };

  // Auto-stop after 12 seconds
  setTimeout(() => {
    stopRave();
  }, 12000);
}

export function bindAboutPageEvents() {
  const triggers = Array.from(document.querySelectorAll('.about-highlight-trigger'));
  const imgEl = document.getElementById('about-featured-img');
  const badgeEl = document.getElementById('about-featured-badge-text');
  const leftLabelEl = document.getElementById('about-featured-left-label');
  const leftValEl = document.getElementById('about-featured-left-val');
  const rightLabelEl = document.getElementById('about-featured-right-label');
  const rightValEl = document.getElementById('about-featured-right-val');
  const highlightsContainer = document.getElementById('about-highlights-container');
  const visualFrame = document.querySelector('.about-visual-frame');

  let currentRealIndex = 0;
  let currentVirtualIndex = window.innerWidth <= 600 ? 12 : 0;
  let autoRotateInterval = null;

  function setActiveCard(vIdx, rIdx) {
    triggers.forEach((card) => {
      const cardVIdx = parseInt(card.getAttribute('data-virtual-index'), 10);
      const cardRIdx = parseInt(card.getAttribute('data-index'), 10);
      if (window.innerWidth <= 600) {
        if (cardVIdx === vIdx) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      } else {
        if (cardRIdx === rIdx) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      }
    });
  }

  function centerCardInstant(vIndex) {
    if (!highlightsContainer) return;
    const targetCard = triggers[vIndex];
    if (targetCard) {
      const containerWidth = highlightsContainer.clientWidth;
      const cardLeft = targetCard.offsetLeft;
      const cardWidth = targetCard.offsetWidth;
      highlightsContainer.scrollLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);
    }
  }

  function centerCardInCarousel(vIndex, smooth = true) {
    if (!highlightsContainer) return;
    const targetCard = triggers[vIndex];
    if (targetCard) {
      const containerWidth = highlightsContainer.clientWidth;
      const cardLeft = targetCard.offsetLeft;
      const cardWidth = targetCard.offsetWidth;
      const targetScrollLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);
      highlightsContainer.scrollTo({
        left: targetScrollLeft,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }

  // Preload all highlight photos for zero-blink instant transitions
  ABOUT_HIGHLIGHTS.forEach((h) => {
    const preImg = new Image();
    preImg.src = h.img;
  });

  function updateHighlight(realIndex, vIndex = null, fromScroll = false) {
    currentRealIndex = realIndex;
    if (vIndex !== null) currentVirtualIndex = vIndex;
    const item = ABOUT_HIGHLIGHTS[realIndex];
    if (!item) return;

    setActiveCard(currentVirtualIndex, currentRealIndex);

    if (window.innerWidth <= 600 && !fromScroll && vIndex !== null) {
      centerCardInCarousel(vIndex, true);
    }

    if (imgEl && imgEl.getAttribute('src') !== item.img) {
      if (window.innerWidth <= 600) {
        imgEl.style.opacity = '0.35';
        imgEl.style.transform = 'scale(0.985)';
        if (badgeEl) badgeEl.style.opacity = '0.35';
        if (leftValEl) leftValEl.style.opacity = '0.35';
        if (rightValEl) rightValEl.style.opacity = '0.35';
        setTimeout(() => {
          imgEl.src = item.img;
          imgEl.alt = item.title;
          if (badgeEl) { badgeEl.textContent = item.badge; badgeEl.style.opacity = '1'; }
          if (leftLabelEl) leftLabelEl.textContent = item.leftLabel;
          if (leftValEl) { leftValEl.textContent = item.leftVal; leftValEl.style.opacity = '1'; }
          if (rightLabelEl) rightLabelEl.textContent = item.rightLabel;
          if (rightValEl) { rightValEl.textContent = item.rightVal; rightValEl.style.opacity = '1'; }
          requestAnimationFrame(() => {
            imgEl.style.opacity = '1';
            imgEl.style.transform = 'scale(1)';
          });
        }, 90);
      } else {
        imgEl.src = item.img;
        imgEl.alt = item.title;
        if (badgeEl) badgeEl.textContent = item.badge;
        if (leftLabelEl) leftLabelEl.textContent = item.leftLabel;
        if (leftValEl) leftValEl.textContent = item.leftVal;
        if (rightLabelEl) rightLabelEl.textContent = item.rightLabel;
        if (rightValEl) rightValEl.textContent = item.rightVal;
      }
    } else {
      if (badgeEl) badgeEl.textContent = item.badge;
      if (leftLabelEl) leftLabelEl.textContent = item.leftLabel;
      if (leftValEl) leftValEl.textContent = item.leftVal;
      if (rightLabelEl) rightLabelEl.textContent = item.rightLabel;
      if (rightValEl) rightValEl.textContent = item.rightVal;
    }
  }

  function startAutoRotate() {
    stopAutoRotate();
    autoRotateInterval = setInterval(() => {
      if (!document.body.contains(imgEl)) {
        stopAutoRotate();
        return;
      }
      if (window.innerWidth <= 600) {
        currentVirtualIndex++;
        if (currentVirtualIndex >= triggers.length - 3) {
          currentVirtualIndex = 12;
          centerCardInstant(12);
        }
        const realIdx = currentVirtualIndex % ABOUT_HIGHLIGHTS.length;
        updateHighlight(realIdx, currentVirtualIndex, false);
      } else {
        currentRealIndex = (currentRealIndex + 1) % ABOUT_HIGHLIGHTS.length;
        updateHighlight(currentRealIndex, 0, false);
      }
    }, 3800);
  }

  function stopAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  }

  triggers.forEach((trigger) => {
    const rIdx = parseInt(trigger.getAttribute('data-index'), 10);
    const vIdx = parseInt(trigger.getAttribute('data-virtual-index'), 10);
    trigger.addEventListener('mouseenter', () => {
      if (window.innerWidth > 600) {
        updateHighlight(rIdx);
        startAutoRotate();
      }
    });
    trigger.addEventListener('click', () => {
      if (window.innerWidth <= 600) {
        updateHighlight(rIdx, vIdx, false);
      } else {
        updateHighlight(rIdx);
      }
      startAutoRotate();
    });
  });

  // Pause on hover/touch, resume on leave/touchend
  if (highlightsContainer) {
    highlightsContainer.addEventListener('mouseenter', stopAutoRotate);
    highlightsContainer.addEventListener('mouseleave', startAutoRotate);
    highlightsContainer.addEventListener('touchstart', stopAutoRotate, { passive: true });
    highlightsContainer.addEventListener('touchend', () => {
      stopAutoRotate();
      startAutoRotate();
    }, { passive: true });

    let scrollTicking = false;
    highlightsContainer.addEventListener('scroll', () => {
      if (window.innerWidth > 600) return;

      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          if (!highlightsContainer) {
            scrollTicking = false;
            return;
          }
          const containerCenter = highlightsContainer.scrollLeft + (highlightsContainer.clientWidth / 2);
          let closestVIdx = currentVirtualIndex;
          let minDistance = Infinity;

          triggers.forEach((trigger, vIdx) => {
            const cardCenter = trigger.offsetLeft + (trigger.offsetWidth / 2);
            const dist = Math.abs(containerCenter - cardCenter);
            if (dist < minDistance) {
              minDistance = dist;
              closestVIdx = vIdx;
            }
          });

          if (closestVIdx !== currentVirtualIndex) {
            const realIdx = closestVIdx % ABOUT_HIGHLIGHTS.length;
            currentVirtualIndex = closestVIdx;
            updateHighlight(realIdx, closestVIdx, true);
          }

          scrollTicking = false;
        });
        scrollTicking = true;
      }
    });
  }

  if (visualFrame) {
    visualFrame.addEventListener('mouseenter', stopAutoRotate);
    visualFrame.addEventListener('mouseleave', startAutoRotate);
  }

  // Initial instant center and continuous auto-rotation
  if (window.innerWidth <= 600) {
    currentVirtualIndex = 12;
    centerCardInstant(12);
    updateHighlight(0, 12, false);
    requestAnimationFrame(() => {
      centerCardInstant(12);
    });
    setTimeout(() => {
      centerCardInstant(12);
    }, 60);
  } else {
    updateHighlight(0, 0, false);
  }
  startAutoRotate();

  // Crazy Developer Easter Egg Trigger: Luxe Cyberpunk Screen Rave
  const devTrigger = document.getElementById('dev-credit-trigger');
  if (devTrigger) {
    devTrigger.addEventListener('click', () => {
      triggerCyberpunkScreenRave();
    });
  }
}
