import { state } from '../state.js';
import { showToast } from './toast.js';

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div style="display:flex; align-items:center; gap:10px;">
              <svg width="32" height="32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#c5a059" stroke-width="2.5"/>
                <path d="M50 22 L72 58 L28 58 Z" fill="none" stroke="#FAF7F2" stroke-width="3"/>
                <path d="M50 58 Q30 75 50 82 Q70 75 50 58 Z" fill="#c5a059"/>
              </svg>
              <span style="font-family:var(--font-serif); font-size:1.8rem; color:var(--color-sand-light); font-weight:600;">Aurite</span>
            </div>
            <p>Science-backed dietary nutraceuticals engineered for maximum human bio-availability, purity, and cellular longevity.</p>
            <div style="display:flex; gap:12px;">
              <span class="badge badge-gold">GMP Certified</span>
              <span class="badge badge-gold">Third-Party Lab Tested</span>
            </div>
          </div>

          <div class="footer-col">
            <h4>Formulations</h4>
            <ul class="footer-links">
              <li><a href="#shop" data-route="shop">Omega-3 Triple Strength</a></li>
              <li><a href="#shop" data-route="shop">Magnesium Complex</a></li>
              <li><a href="#shop" data-route="shop">Daily Wellness Greens</a></li>
              <li><a href="#shop" data-route="shop">Synbiotic Gut Restore</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Company & Science</h4>
            <ul class="footer-links">
              <li><a href="#science" data-route="science">Micro-Encapsulation</a></li>
              <li><a href="#about" data-route="about">Our Purity Standard</a></li>
              <li><a href="#science" data-route="science">Clinical Research</a></li>
              <li><a href="#contact" data-route="contact">Contact Support</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Stay Connected</h4>
            <p style="font-size:0.85rem; color:var(--color-text-light); margin-bottom:16px;">Subscribe for 10% off your first order and VIP access to new scientific formulations.</p>
            <form id="footer-newsletter-form" style="display:flex; gap:8px;">
              <input type="email" placeholder="Enter your email" required class="form-input" style="padding:10px 14px; font-size:0.85rem; background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.15); color:white;">
              <button type="submit" class="btn btn-gold btn-sm">Join</button>
            </form>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 Aurite Nutraceutical Laboratories Inc. All rights reserved.</p>
          <div style="display:flex; gap:20px;">
            <a href="#" style="color:var(--color-text-light);">Privacy Policy</a>
            <a href="#" style="color:var(--color-text-light);">Terms of Service</a>
            <a href="#" style="color:var(--color-text-light);">FDA Compliance Statement</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function bindFooterEvents() {
  const newsletterForm = document.getElementById('footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing! Your 10% discount code is AURITE10', 'success');
      newsletterForm.reset();
    });
  }

  document.querySelectorAll('.footer [data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      state.setRoute(route);
    });
  });
}
