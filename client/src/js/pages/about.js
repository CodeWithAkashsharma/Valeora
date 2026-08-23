export function renderAboutPage() {
  return `
    <div class="container section-padding">
      <div style="text-align:center; max-width:720px; margin:0 auto 60px auto;">
        <span class="badge badge-gold" style="margin-bottom:12px;">Purity & Purpose</span>
        <h1 style="font-family:var(--font-serif); font-size:3rem; color:var(--color-forest-dark); margin-bottom:16px;">
          Empowering Human Longevity Through Science
        </h1>
        <p style="color:var(--color-text-muted); font-size:1.1rem; line-height:1.7;">
          Aurite was founded with a singular directive: eliminate marketing fluff and engineer supplement formulations that deliver measurable biological results.
        </p>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:32px; margin-bottom:80px;">
        <div style="background:var(--color-white); border:1px solid var(--color-sand-border); border-radius:var(--radius-lg); padding:32px; text-align:center;">
          <div style="width:60px; height:60px; background:var(--color-sand); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px auto; color:var(--color-forest);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3 style="font-family:var(--font-serif); margin-bottom:12px;">Radical Purity</h3>
          <p style="font-size:0.9rem; color:var(--color-text-muted); line-height:1.6;">
            Every batch undergoes quadruple mass spectrometry testing to ensure zero heavy metals, microplastics, or pesticides.
          </p>
        </div>

        <div style="background:var(--color-white); border:1px solid var(--color-sand-border); border-radius:var(--radius-lg); padding:32px; text-align:center;">
          <div style="width:60px; height:60px; background:var(--color-sand); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px auto; color:var(--color-forest);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 style="font-family:var(--font-serif); margin-bottom:12px;">Light-Shield Glass</h3>
          <p style="font-size:0.9rem; color:var(--color-text-muted); line-height:1.6;">
            Our signature dark forest glass jars block harmful UV light spectra, preserving ingredient potency without synthetic preservatives.
          </p>
        </div>

        <div style="background:var(--color-white); border:1px solid var(--color-sand-border); border-radius:var(--radius-lg); padding:32px; text-align:center;">
          <div style="width:60px; height:60px; background:var(--color-sand); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px auto; color:var(--color-forest);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <h3 style="font-family:var(--font-serif); margin-bottom:12px;">Sustainable Sourcing</h3>
          <p style="font-size:0.9rem; color:var(--color-text-muted); line-height:1.6;">
            Sourced exclusively from wild Icelandic fisheries and certified organic regenerative farms in Oregon and New Zealand.
          </p>
        </div>
      </div>
    </div>
  `;
}
