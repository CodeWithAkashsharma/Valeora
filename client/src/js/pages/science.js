export function renderSciencePage() {
  return `
    <div class="container section-padding">
      <div style="text-align:center; max-width:720px; margin:0 auto 60px auto;">
        <span class="badge badge-forest" style="margin-bottom:12px;">Molecular Innovation</span>
        <h1 style="font-family:var(--font-serif); font-size:3rem; color:var(--color-forest-dark); margin-bottom:16px;">
          The Science of Bio-Availability
        </h1>
        <p style="color:var(--color-text-muted); font-size:1.1rem; line-height:1.7;">
          Why standard supplements fail, and how Aurite's patent-pending delivery system guarantees cellular absorption.
        </p>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:40px; align-items:center; margin-bottom:80px;">
        <div>
          <span class="badge badge-gold" style="margin-bottom:12px;">Enteric Shield Tech</span>
          <h2 style="font-family:var(--font-serif); font-size:2.2rem; color:var(--color-forest-dark); margin-bottom:16px;">
            Acid-Resistant Micro-Encapsulation
          </h2>
          <p style="color:var(--color-text-muted); line-height:1.7; margin-bottom:20px;">
            The human stomach secretes hydrochloric acid at a pH of 1.5 to 2.0. Standard gelatin capsules disintegrate within 15 minutes, exposing sensitive probiotics, enzymes, and delicate lipids to destruction.
          </p>
          <p style="color:var(--color-text-muted); line-height:1.7;">
            Aurite utilizes a natural alginate-derived matrix that remains completely intact through stomach passage, dissolving smoothly only when exposed to the alkaline pH 7.4 environment of the lower GI tract.
          </p>
        </div>

        <div>
          <img src="/images/science_capsule.jpg" alt="Science Bio Capsule" style="width:100%; border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--color-gold);">
        </div>
      </div>

      <!-- Comparison Table -->
      <div style="background:var(--color-white); border:1px solid var(--color-sand-border); border-radius:var(--radius-lg); padding:40px; box-shadow:var(--shadow-md);">
        <h3 style="font-family:var(--font-serif); text-align:center; font-size:2rem; margin-bottom:32px;">Clinical Standards Comparison</h3>
        
        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.95rem;">
          <thead>
            <tr style="border-bottom:2px solid var(--color-forest-dark);">
              <th style="padding:16px;">Quality Metric</th>
              <th style="padding:16px; color:var(--color-forest); font-weight:700;">Aurite Standards</th>
              <th style="padding:16px; color:var(--color-text-light);">Generic Store Brands</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--color-sand-border);">
              <td style="padding:16px; font-weight:600;">Stomach Acid Survival</td>
              <td style="padding:16px; color:var(--color-forest); font-weight:700;">✓ 99.4% Survival Guaranteed</td>
              <td style="padding:16px; color:var(--color-error);">✗ < 16% Active Compound Survival</td>
            </tr>
            <tr style="border-bottom:1px solid var(--color-sand-border);">
              <td style="padding:16px; font-weight:600;">Heavy Metal Screening</td>
              <td style="padding:16px; color:var(--color-forest); font-weight:700;">✓ Quadruple ICP-MS Tested</td>
              <td style="padding:16px; color:var(--color-text-light);">Basic Batch Testing</td>
            </tr>
            <tr style="border-bottom:1px solid var(--color-sand-border);">
              <td style="padding:16px; font-weight:600;">Fish Oil Oxidation (TOTOX)</td>
              <td style="padding:16px; color:var(--color-forest); font-weight:700;">✓ Ultra-fresh TOTOX < 5</td>
              <td style="padding:16px; color:var(--color-error);">TOTOX > 26 (Rancid Smell)</td>
            </tr>
            <tr>
              <td style="padding:16px; font-weight:600;">Synthetic Binders / Fillers</td>
              <td style="padding:16px; color:var(--color-forest); font-weight:700;">✓ Zero Artificial Fillers</td>
              <td style="padding:16px; color:var(--color-text-light);">Magnesium Stearate & Silicon Dioxide</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
