import { PRODUCTS, REVIEWS } from '../productsData.js';
import { renderProductCard, bindProductCardEvents } from '../components/productCard.js';

export function renderHomePage() {
  const featuredProducts = PRODUCTS.slice(0, 3);

  return `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-subtitle">
            <span class="badge badge-gold">Cellular Bio-Availability</span>
          </div>
          
          <h1 class="hero-title">
            Start Your Journey To <span>Better Health.</span>
          </h1>

          <p class="hero-description">
            Daily synbiotic supplements and high-absorption nutraceuticals backed by clinical bio-science to empower your whole-body longevity.
          </p>

          <div class="hero-actions">
            <a href="#shop" class="btn btn-primary btn-lg" data-route="shop">
              Shop Formulations
            </a>
            <a href="#science" class="btn btn-outline btn-lg" data-route="science">
              Explore Our Science
            </a>
          </div>

          <div class="hero-trust-row">
            <div class="trust-item">
              <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>GMP Certified Purity</span>
            </div>

            <div class="trust-item">
              <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>100% 3rd-Party Lab Tested</span>
            </div>
          </div>
        </div>

        <!-- Scroll Animation Canvas Viewer Container -->
        <div class="hero-visual-wrap">
          <div class="canvas-scroll-container">
            <span class="canvas-badge-tag">Interactive 360 Scroll Visualizer</span>
            <canvas id="scroll-canvas"></canvas>
            <div class="scroll-hint-overlay">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M19 12l-7 7-7-7"></path>
              </svg>
              <span>Scroll down to inspect</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Daily Essentials Product Showcase -->
    <section class="section-padding">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-forest" style="margin-bottom:12px;">Daily Essentials</span>
          <h2>Daily essentials to support gut, brain, and immune health.</h2>
          <p>Science-backed synbiotics, minerals, and lipid nutrients target cellular bio-available pathways to benefit your entire body.</p>
        </div>

        <div class="products-grid" id="home-featured-products-grid">
          ${featuredProducts.map(product => renderProductCard(product)).join('')}
        </div>
      </div>
    </section>

    <!-- Science & Gut Bio-Availability Banner -->
    <section class="section-padding" style="background:var(--color-sand);">
      <div class="container">
        <div class="science-banner">
          <div class="science-content">
            <span class="badge badge-gold" style="align-self:flex-start; margin-bottom:16px;">Targeted Delivery</span>
            <h2>Most supplements fail to survive digestion. Aurite does.</h2>
            <p style="color:var(--color-text-light); line-height:1.7; margin-bottom:28px;">
              Standard gel caps and tablets dissolve in acidic stomach conditions, destroying up to 84% of active nutrients. Aurite's nested capsule shield withstands stomach acidity, releasing 100% active compounds safely into the small intestine.
            </p>
            <a href="#science" class="btn btn-gold btn-lg" style="align-self:flex-start;" data-route="science">
              Learn Bio-Shield Tech
            </a>
          </div>

          <div class="science-image-wrap">
            <img src="/images/science_capsule.jpg" alt="Aurite Science Capsule">
          </div>
        </div>

        <!-- Metrics Impact Row -->
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-value">500k+</div>
            <div class="metric-label">Health Transformations</div>
          </div>

          <div class="metric-item">
            <div class="metric-value">99.4%</div>
            <div class="metric-label">Stomach Acid Survival Rate</div>
          </div>

          <div class="metric-item">
            <div class="metric-value">100%</div>
            <div class="metric-label">Third-Party Tested</div>
          </div>

          <div class="metric-item">
            <div class="metric-value">4.9/5</div>
            <div class="metric-label">Verified Customer Score</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials / Community Impact -->
    <section class="section-padding">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-purity" style="margin-bottom:12px;">Verified Results</span>
          <h2>See the impact for yourself</h2>
          <p>Real stories and testimonials from physicians, innovators, and Aurite community members.</p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
          ${REVIEWS.map(rev => `
            <div style="background:var(--color-white); border:1px solid var(--color-sand-border); border-radius:var(--radius-lg); padding:32px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-space-between;">
              <div>
                <div style="color:var(--color-gold); font-size:1.1rem; margin-bottom:12px;">★★★★★</div>
                <h4 style="font-family:var(--font-serif); margin-bottom:8px; color:var(--color-forest-dark);">${rev.title}</h4>
                <p style="font-size:0.9rem; color:var(--color-text-muted); line-height:1.6; margin-bottom:20px;">"${rev.comment}"</p>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-sand-border); padding-top:16px;">
                <div>
                  <div style="font-weight:700; font-size:0.9rem; color:var(--color-forest-dark);">${rev.author}</div>
                  <div style="font-size:0.78rem; color:var(--color-gold); font-weight:600;">Verified Customer • ${rev.product}</div>
                </div>
                <span class="badge badge-gold" style="font-size:0.65rem;">Verified</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function bindHomePageEvents() {
  const gridEl = document.getElementById('home-featured-products-grid');
  if (gridEl) {
    bindProductCardEvents(gridEl, PRODUCTS);
  }
}
