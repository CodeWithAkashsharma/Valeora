export const SOCIAL_LINKS = [
  {
    id: "instagram",
    href: "https://www.instagram.com/shop.valeora?stkn=aDhxam8za2F0bHY%3D",
    ariaLabel: "Instagram",
    color: "#E1306C",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/share/1d2gbQ4w6B/?mibextid=wwXIfr",
    ariaLabel: "Facebook",
    color: "#1877F2",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
  },
  {
    id: "gmail",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=Valeora.shop@gmail.com&su=Inquiry%20-%20VALEORA%20Jewelry",
    ariaLabel: "Gmail",
    color: "#EA4335",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.28 24 3.434 24 5.457z"/></svg>`
  }
];

export function renderFooter() {
  return `
    <footer class="valeora-footer">
      <div class="container footer-content-wrap">
        
        <!-- Brand Logo & Title -->
        <div class="footer-brand-header">
          <img src="/images/valeora_logo.png" alt="VALEORA Logo" class="footer-logo-img">
          <span class="footer-brand-name">VALEORA</span>
        </div>

        <p class="footer-motto-text">
          “Adorn Your Story, Shine Your Way.”
        </p>

        <!-- Compliance & Payment Gateway Policy Links -->
        <div class="footer-policy-row">
          <a href="javascript:void(0)" data-policy="privacy" class="footer-policy-link">Privacy Policy</a>
          <span class="footer-dot-sep">•</span>
          <a href="javascript:void(0)" data-policy="terms" class="footer-policy-link">Terms & Conditions</a>
          <span class="footer-dot-sep">•</span>
          <a href="javascript:void(0)" data-policy="refund" class="footer-policy-link">Replacement Policy</a>
          <span class="footer-dot-sep">•</span>
          <a href="javascript:void(0)" data-policy="shipping" class="footer-policy-link">Shipping Policy</a>
        </div>

        <!-- Copyright & Social Media in Same Row -->
        <div class="footer-bottom-row">
          <span class="footer-copyright-text">© ${new Date().getFullYear()} VALEORA Jewelry</span>
          
          <ul class="social-tooltip-list">
            ${SOCIAL_LINKS.map(item => `
              <li class="social-tooltip-item" data-social="${item.id}">
                <a href="${item.href}" target="_blank" rel="noopener noreferrer" aria-label="${item.ariaLabel}" class="social-icon-btn">
                  <div class="social-liquid-fill" style="background-color: ${item.color};"></div>
                  <span class="social-svg-wrap">
                    ${item.svg}
                  </span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>

      </div>
    </footer>
  `;
}
