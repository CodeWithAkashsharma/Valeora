export function renderSciencePage() {
  return `
    <div class="satin-backdrop" style="min-height: calc(100vh - 72px); padding: 40px 0 80px 0;">
      <div class="container">
        <!-- Header -->
        <div style="text-align:center; max-width:760px; margin:0 auto 50px auto;">
          <span class="badge-pill badge-rose" style="margin-bottom:12px;">Bespoke Atelier</span>
          <h1 style="font-family:var(--font-serif); font-size:3rem; color:#ffffff; margin-bottom:16px;">
            Gemology & Bespoke Artistry
          </h1>
          <p style="color:var(--color-text-secondary); font-size:1.1rem; line-height:1.7;">
            From rare stone procurement to bespoke bridal commissions, explore how our gemologists and master jewelers bring singular visions to life.
          </p>
        </div>

        <!-- Spotlight Showcase -->
        <div class="spotlight-card-main" style="margin-bottom: 40px; padding: 36px;">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; align-items:center;">
            <div>
              <span class="badge-pill badge-ruby" style="margin-bottom:12px;">The Valeora 4Cs+ Standard</span>
              <h2 style="font-family:var(--font-serif); font-size:2.2rem; color:#ffffff; margin-bottom:14px;">Triple Excellent Diamond Fire</h2>
              <p style="color:var(--color-text-secondary); line-height:1.7; margin-bottom:20px;">
                We accept fewer than 0.5% of the world's diamonds. Each stone must demonstrate Triple Excellent cut symmetry, D-F colorless grades, and VVS clarity under 40x binocular microscopy.
              </p>
              <a href="#contact" class="btn btn-pill btn-pill-lg" data-route="contact">
                Commission Bespoke Creation
              </a>
            </div>
            <div style="border-radius:var(--radius-lg); overflow:hidden; background:#180309;">
              <img src="/images/category_diamond.jpg" alt="Diamond Gemology">
            </div>
          </div>
        </div>

        <!-- 4 Step Bespoke Commission Lifecycle -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:20px;">
          <div class="trust-pillar-card">
            <div style="font-family:var(--font-sans); font-weight:800; font-size:1.8rem; color:var(--color-rose-pill); margin-bottom:8px;">01</div>
            <h4 class="trust-pillar-title">Private Consultation</h4>
            <p class="trust-pillar-desc">Meet with our head gemologist to select rare stones, design motifs, and precious metals.</p>
          </div>

          <div class="trust-pillar-card">
            <div style="font-family:var(--font-sans); font-weight:800; font-size:1.8rem; color:var(--color-rose-pill); margin-bottom:8px;">02</div>
            <h4 class="trust-pillar-title">Gouache & 3D Render</h4>
            <p class="trust-pillar-desc">Custom watercolor sketches and sub-millimeter 3D wax molds sculpted for your approval.</p>
          </div>

          <div class="trust-pillar-card">
            <div style="font-family:var(--font-sans); font-weight:800; font-size:1.8rem; color:var(--color-rose-pill); margin-bottom:8px;">03</div>
            <h4 class="trust-pillar-title">Atelier Forging</h4>
            <p class="trust-pillar-desc">180+ hours of hand setting, milgrain contouring, and mirror-grade polish by master craftsmen.</p>
          </div>

          <div class="trust-pillar-card">
            <div style="font-family:var(--font-sans); font-weight:800; font-size:1.8rem; color:var(--color-rose-pill); margin-bottom:8px;">04</div>
            <h4 class="trust-pillar-title">Armored Handover</h4>
            <p class="trust-pillar-desc">Delivered in an engraved cedar-lined velvet chest with full GIA/IGI certification archives.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
