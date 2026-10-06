import { state } from '../state.js';
import { PRODUCTS } from '../productsData.js';
import { renderProductCard, bindProductCardEvents } from '../components/productCard.js';
import { CircularGallery } from '../components/circularGallery.js';
import { bindAllJellyButtons } from '../components/jellyButton.js';
import { bindAllCreepyButtons } from '../components/creepyButton.js';

export function renderHomePage() {
  const allProducts = state.products || [];
  const featuredArrivals = allProducts.slice(0, 4);

  return `
    <!-- ==========================================
         1. FULLSCREEN HERO SECTION (VIDEO LAYER + LEFT TEXT)
         ========================================== -->
    <section class="hero-fullscreen" id="hero-section">
      <!-- Background Hero Media Layer (Responsive: Mobile Portrait & Desktop Landscape) -->
      <div class="hero-video-layer">
        <picture style="width: 100%; height: 100%; display: block;">
          <source media="(max-width: 768px)" srcset="/images/hero_necklace_mobile.jpg?v=20260924_v3">
          <img 
            src="/images/hero_necklace.jpg?v=20260924_v3" 
            alt="Valeora Haute Joaillerie Hero Necklace" 
            class="hero-video-media"
            style="width: 100%; height: 100%; object-fit: cover;"
          >
        </picture>
        <div class="hero-gradient-overlay"></div>
      </div>

      <!-- Left-Aligned Hero Content -->
      <div class="container hero-content-container">
        <div class="hero-left-box">
          <!-- Hero Title -->
          <h1 class="hero-left-title">
            Everyday Luxury.<br>Honest Prices.
          </h1>

          <!-- Motto -->
          <p class="hero-motto-text">
            “Adorn Your Story, Shine Your Way.”
          </p>

          <!-- Descriptive Subtitle (Precise & Accurate) -->
          <p class="hero-left-desc">
            Jewelry that tells your story—<br class="hero-desc-mobile-br">designed with lasting brilliance,<br class="hero-desc-mobile-br">gentle comfort, and accessible luxury.
          </p>

          <!-- CTA Buttons: Interactive Creepy Eye-Tracking Shop Button -->
          <div class="hero-btn-group">
            <a href="#shop" class="creepy-btn" data-route="shop" id="hero-btn-shop" aria-label="Shop Collection">
              <span class="creepy-btn__eyes">
                <span class="creepy-btn__eye">
                  <span class="creepy-btn__pupil"></span>
                </span>
                <span class="creepy-btn__eye">
                  <span class="creepy-btn__pupil"></span>
                </span>
              </span>
              <span class="creepy-btn__cover">
                <span class="btn-sheen"></span>
                <span class="btn-text">Shop Collection</span>
              </span>
            </a>
            <a href="#about" class="valeora-tactile-btn valeora-btn-secondary" data-route="about" id="hero-btn-about" aria-label="Our Story">
              <span class="btn-sheen"></span>
              <span class="btn-text">Our Story</span>
            </a>
          </div>

          <!-- Features Strip -->
          <div class="hero-features-strip">
            <div class="hero-feature-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Pan-India Fast Delivery</span>
            </div>
            <div class="hero-feature-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Long-Lasting Shine</span>
            </div>
            <div class="hero-feature-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>100% Skin-Safe & Hypoallergenic</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Down Indicator -->
      <div class="hero-scroll-cue">
        <span>Scroll to explore</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </div>
    </section>


    <!-- ==========================================
         REST OF PAGE — LUXURY DARK THEME
         ========================================== -->
    <div class="satin-backdrop">
      <div class="container satin-home-container">
        
        <!-- ==========================================
             2. CURATED SPOTLIGHT GALLERY & LIQUID WATER BUBBLE
             Non-repeating architectural curves matching reference screenshots
             ========================================== -->
        <section class="spotlight-section">
          
          <!-- Top Feature: Editorial Heritage Banner with Liquid Water Bubble -->
          <div class="spotlight-editorial-banner">
            <!-- The Organic Morphing Liquid Water Bubble -->
            <div class="water-bubble-wrapper">
              <div class="water-bubble-droplet" data-action="quick-view" data-product-id="solitaire-pav-diamond-ring" title="Click to view Solitaire Diamond Ring">
                <img src="/images/featured_ring1.jpg?v=20260924_v3" alt="Solitaire Crystal Diamond" class="water-bubble-img">
                <!-- 4-Point Sparkling Star Flare -->
                <svg class="bubble-sparkle-star" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
                </svg>
                <svg class="bubble-sparkle-star-2" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
                </svg>
              </div>
            </div>

            <!-- Editorial Typography & Brand Promise -->
            <div class="spotlight-editorial-text">
              <span class="spotlight-editorial-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Editorial Heritage
              </span>
              <h2 class="spotlight-editorial-title">
                Crafted for Generations.<br>Explore the Collection.
              </h2>
              <p class="spotlight-editorial-sub">
                Everyday elegance designed with brilliant diamond luster.
              </p>
              <div class="spotlight-editorial-chips">
                <!-- Desktop Only: Price & Delivery -->
                <span class="editorial-chip chip-desktop-only">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ₹249 – ₹999
                </span>
                <span class="editorial-chip chip-desktop-only">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Free Delivery
                </span>
                <!-- Mobile Only: Anti-Tarnish Feature -->
                <span class="editorial-chip chip-mobile-only">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Anti-Tarnish
                </span>
                <!-- Both: Lasting Shine -->
                <span class="editorial-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Lasting Shine
                </span>
              </div>
            </div>
          </div>

          <!-- Curated Category Sculpted Shapes Gallery -->
          <div class="spotlight-shapes-gallery">
            <div class="spotlight-shapes-grid">
              <!-- Shape 1: Left Cathedral Vault Arch Dome Card (The Imperial Collection) -->
              <div class="shape-card shape-arch-dome" data-route="shop" data-shop-filter="Necklaces" style="cursor:pointer;" title="Explore Signature Masterpiece Collection">
                <div class="shape-arch-img-wrap">
                  <img src="/images/imperial_necklace.jpg?v=20260924_v3" alt="The Imperial Necklace" class="shape-arch-img">
                  <div class="shape-arch-glow"></div>
                  <span class="shape-floating-badge">Signature</span>
                </div>
                <div class="shape-arch-content">
                  <span class="shape-micro-badge">Masterpiece Highlight</span>
                  <h3 class="shape-arch-title">The Imperial Royal Choker</h3>
                  <p class="shape-arch-desc">Royal ruby centerpiece handset with 18k diamond luster accents.</p>
                </div>
              </div>

              <!-- Right Side Column: Multi-Shape Arrangement -->
              <div class="spotlight-right-column">
                <!-- Top Row: Symmetrical Duo (Sculpted Marquise Leaf for Her + Circular Liquid Orb for Him) -->
                <div class="spotlight-dual-shapes-row">
                  <!-- Shape 2: For Her -->
                  <div class="shape-card shape-simple-card" data-route="shop" data-shop-filter="For Her" style="cursor:pointer; border-radius:18px; overflow:hidden; height:100%; position:relative; border:1.5px solid rgba(214,184,190,0.3); transition:transform 0.35s ease, box-shadow 0.35s ease;" title="Explore For Her Collection">
                    <div class="shape-teardrop-img-wrap">
                      <img src="/images/for_her.jpg?v=20260924_v3" alt="For Her Jewelry Collection" style="width:100%;height:100%;object-fit:cover;object-position:center center;transition:transform 0.6s ease;">
                      <div class="shape-clean-label-overlay">
                        <h4 class="shape-clean-label-text">For Her</h4>
                      </div>
                    </div>
                  </div>

                  <!-- Shape 3: For Him -->
                  <div class="shape-card shape-simple-card" data-route="shop" data-shop-filter="For Him" style="cursor:pointer; border-radius:18px; overflow:hidden; height:100%; position:relative; border:1.5px solid rgba(214,184,190,0.3); transition:transform 0.35s ease, box-shadow 0.35s ease;" title="Explore For Him Collection">
                    <div class="shape-orb-img-wrap" style="width:100%;height:100%;">
                      <img src="/images/for_him.jpg?v=20260924_v3" alt="For Him Accessories Collection" style="width:100%;height:100%;object-fit:cover;object-position:center center;transition:transform 0.6s ease;">
                      <div class="shape-clean-label-overlay">
                        <h4 class="shape-clean-label-text">For Him</h4>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Shape 4 (Bottom): For Everyone -->
                <div class="shape-card shape-for-everyone-card" data-route="shop" data-shop-filter="For Everyone" style="cursor:pointer; overflow:hidden; flex-shrink:0; position:relative; border:1.5px solid rgba(214,184,190,0.3); transition:transform 0.35s ease, box-shadow 0.35s ease;" title="Explore For Everyone Collection">
                  <div class="shape-stadium-img-wrap" style="width:100%;height:100%;">
                    <img src="/images/for_everyone.jpg?v=20260924_v3" alt="For Everyone Unisex Jewelry Collection" style="width:100%;height:100%;object-fit:cover;object-position:center center;transition:transform 0.6s ease;">
                    <div class="shape-clean-label-overlay">
                      <h4 class="shape-clean-label-text">For Everyone</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <!-- Luxury Partition Divider -->
        <div class="luxury-divider"></div>


        <!-- ==========================================
             3. FEATURED ARRIVALS SECTION (4 CARDS)
             ========================================== -->
        <section class="featured-arrivals-section">
          <div class="featured-header">
            <h3>Featured Jewelry</h3>
          </div>

          <div class="featured-arrivals-grid" id="home-featured-grid">
            ${featuredArrivals.length > 0
      ? featuredArrivals.map(product => product ? renderProductCard(product) : '').join('')
      : `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(214,184,190,0.2); border-radius: 16px; color: #ECCFD0; font-size: 0.88rem;">
                  ✨ New signature jewelry pieces are being added to the catalog.
                </div>
              `
    }
          </div>
        </section>


        <!-- Luxury Partition Divider -->
        <div class="luxury-divider"></div>


        <!-- ==========================================
             4. THE VALEORA WEBGL CIRCULAR GALLERY
             ========================================== -->
        <section class="circular-gallery-section" id="circular-gallery-section">
          <div class="circular-gallery-header">
            <h2 class="circular-gallery-title">Endless Options for Everyday Luxury</h2>
            <p class="circular-gallery-desc">
              Swipe through our signature pieces and discover versatile jewelry designed for every occasion.
            </p>
          </div>

          <!-- Full-Width WebGL Canvas Stage -->
          <div class="circular-gallery-canvas-wrap">
            <div class="circular-gallery-stage" id="circular-webgl-stage"></div>
            <div class="circular-drag-hint">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8L22 12L18 16"/><path d="M6 8L2 12L6 16"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
              <span>Drag to explore our collection</span>
            </div>
          </div>
        </section>


        <!-- Luxury Partition Divider -->
        <div class="luxury-divider"></div>


        <!-- ==========================================
             5. LUXURY ASSURANCE PILLARS (BEFORE FOOTER)
             ========================================== -->
        <section class="trust-pillars-row">
          <div class="trust-pillar-card">
            <div class="trust-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h4 class="trust-pillar-title">Color Shine Guarantee</h4>
            <p class="trust-pillar-desc">High quality gold polish crafted for lasting everyday brightness.</p>
          </div>

          <div class="trust-pillar-card">
            <div class="trust-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <h4 class="trust-pillar-title">Free Shipping > ₹999</h4>
            <p class="trust-pillar-desc">Express delivery across all pin codes in India with live tracking.</p>
          </div>

          <div class="trust-pillar-card">
            <div class="trust-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <h4 class="trust-pillar-title">Honest Prices</h4>
            <p class="trust-pillar-desc">All jewelry priced between ₹249 to ₹999 with zero hidden fees.</p>
          </div>

          <div class="trust-pillar-card">
            <div class="trust-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h4 class="trust-pillar-title">Skin-Safe & Safe</h4>
            <p class="trust-pillar-desc">100% lead and nickel-free, safe for daily wear.</p>
          </div>
        </section>

      </div>
    </div>
  `;
}

let circularGalleryInstance = null;

export function updateCircularGallery() {
  const stageEl = document.getElementById('circular-webgl-stage');
  if (!stageEl) return;

  if (circularGalleryInstance) {
    try {
      circularGalleryInstance.destroy();
    } catch (e) {
      console.warn('Error destroying circular gallery:', e);
    }
    circularGalleryInstance = null;
  }
  stageEl.innerHTML = '';

  const isMobile = window.innerWidth <= 768;
  const liveProducts = state.products || [];
  const validProducts = liveProducts.filter(p => p && p.image);

  if (validProducts.length > 0) {
    // Build dynamic items from admin product catalog
    let dynamicItems = validProducts.map(p => ({
      id: p.id,
      image: p.image,
      text: p.name || 'Fine Jewelry'
    }));

    // Ensure minimum 6 planes for continuous 3D circular loop
    let itemsToUse = dynamicItems;
    while (itemsToUse.length < 6) {
      itemsToUse = itemsToUse.concat(dynamicItems);
    }

    try {
      circularGalleryInstance = new CircularGallery(stageEl, {
        items: itemsToUse,
        bend: isMobile ? 2.5 : 3.5,
        textColor: '#ECCFD0',
        borderRadius: 0.08,
        scrollEase: 0.048,
        scrollSpeed: 2.5,
        autoSpeed: 0.038,
        autoScroll: true,
        font: '600 24px "Playfair Display", serif'
      });
    } catch (e) {
      console.warn('Error creating CircularGallery:', e);
    }
  } else {
    stageEl.innerHTML = `
      <div style="height: 100%; min-height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #ECCFD0; padding: 40px 20px;">
        <span style="font-size: 2.2rem; margin-bottom: 8px;">💎</span>
        <h4 style="font-family: var(--font-serif); font-size: 1.3rem; color: #FFFFFF; margin: 0 0 6px 0;">3D Infinity Gallery</h4>
        <p style="font-size: 0.85rem; opacity: 0.85; max-width: 380px; margin: 0; line-height: 1.4;">Products published via the Admin Panel will automatically appear here in 3D perspective.</p>
      </div>
    `;
  }
}

export function bindHomePageEvents() {
  const gridEl = document.getElementById('home-featured-grid');
  if (gridEl) {
    bindProductCardEvents(gridEl, state.products || PRODUCTS);
  }

  // Global Quick View listeners inside spotlight cards
  const clickableCards = document.querySelectorAll('[data-action="quick-view"]');
  clickableCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const productId = card.getAttribute('data-product-id');
      if (productId) {
        const catalog = state.products?.length ? state.products : PRODUCTS;
        const product = catalog.find(p => p.id === productId) || PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
        if (product) {
          state.setQuickViewProduct(product);
        }
      }
    });
  });

  // ========================================================
  // INITIALIZE WEBGL CIRCULAR GALLERY (OGL)
  // Dynamically uses real product images added by admin
  // ========================================================
  try {
    updateCircularGallery();
  } catch (err) {
    console.warn('updateCircularGallery failed:', err);
  }

  // Initialize Jelly Squeeze physics on hero buttons
  try {
    bindAllJellyButtons();
  } catch (err) {}

  // Initialize Creepy Eye-Tracking button
  try {
    bindAllCreepyButtons();
  } catch (err) {}

  // Initialize Interactive Stretchy Water Bubble
  try {
    initInteractiveWaterBubble();
  } catch (err) {}
}

/**
 * World-Class Auto-Advancing Luxury Atelier Showcase Engine
 * Handles smooth auto-sliding, radial progress animation, 3D perspective tilt, and touch gestures
 */
function initAtelierAutoShowcase() {
  const stageCard = document.getElementById('atelier-main-stage');
  if (!stageCard) return;

  const slides = stageCard.querySelectorAll('.atelier-slide');
  const navPills = stageCard.querySelectorAll('.atelier-nav-pill');
  if (!slides.length || !navPills.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  const slideDuration = 4500; // ms
  let timerId = null;
  let isPaused = false;

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;

    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    navPills.forEach((pill, idx) => {
      const fill = pill.querySelector('.nav-pill-fill');
      if (idx === currentIndex) {
        pill.classList.add('active');
        if (fill) {
          fill.style.transition = 'none';
          fill.style.width = '0%';
          void fill.offsetWidth; // Trigger reflow
          fill.style.transition = `width ${slideDuration}ms linear`;
          fill.style.width = '100%';
        }
      } else {
        pill.classList.remove('active');
        if (fill) {
          fill.style.transition = 'none';
          fill.style.width = '0%';
        }
      }
    });
  }

  function startAutoCycle() {
    stopAutoCycle();
    goToSlide(currentIndex);
    timerId = setInterval(() => {
      if (!isPaused) {
        goToSlide(currentIndex + 1);
      }
    }, slideDuration);
  }

  function stopAutoCycle() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // Bind nav pills
  navPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetIndex = parseInt(pill.getAttribute('data-slide-target') || '0', 10);
      goToSlide(targetIndex);
      startAutoCycle();
    });
  });

  // Pause on hover
  stageCard.addEventListener('mouseenter', () => { isPaused = true; });
  stageCard.addEventListener('mouseleave', () => { isPaused = false; });

  // Touch swipe support
  let touchStartX = 0;
  stageCard.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    isPaused = true;
  }, { passive: true });

  stageCard.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
    isPaused = false;
    startAutoCycle();
  }, { passive: true });

  // Subtle 3D Perspective Tilt on Desktop
  stageCard.addEventListener('mousemove', (e) => {
    const rect = stageCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stageCard.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });

  stageCard.addEventListener('mouseleave', () => {
    stageCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });

  // Start initial auto-cycle
  startAutoCycle();
}

/**
 * High-performance real elastic liquid bubble physics & stretching cursor interaction
 */
function initInteractiveWaterBubble() {
  const wrapper = document.querySelector('.water-bubble-wrapper');
  const droplet = document.querySelector('.water-bubble-droplet');
  const banner = document.querySelector('.spotlight-editorial-banner');
  if (!droplet || !wrapper) return;

  let targetX = 0, targetY = 0;
  let targetRotX = 0, targetRotY = 0, targetRotZ = 0;
  let targetScaleX = 1, targetScaleY = 1;
  let targetSkewX = 0, targetSkewY = 0;
  let targetGlareX = 0, targetGlareY = 0;

  let currX = 0, currY = 0;
  let currRotX = 0, currRotY = 0, currRotZ = 0;
  let currScaleX = 1, currScaleY = 1;
  let currSkewX = 0, currSkewY = 0;
  let currGlareX = 0, currGlareY = 0;

  let isHovering = false;
  let animFrameId = null;

  function onPointerMove(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = droplet.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = clientX - centerX;
    const distY = clientY - centerY;
    const distance = Math.hypot(distX, distY);
    const maxRadius = 450; // magnetic influence radius

    isHovering = true;
    const pull = Math.max(0, 1 - distance / maxRadius);
    const intensity = pull * 1.15;

    // Translation movement following cursor
    targetX = Math.max(-44, Math.min(44, distX * 0.22 * intensity));
    targetY = Math.max(-44, Math.min(44, distY * 0.22 * intensity));

    // 3D tilt
    targetRotY = Math.max(-18, Math.min(18, (distX / (rect.width / 2)) * 14 * intensity));
    targetRotX = Math.max(-18, Math.min(18, (-distY / (rect.height / 2)) * 14 * intensity));
    targetRotZ = Math.max(-8, Math.min(8, (distX / (rect.width / 2)) * 6 * intensity));

    // Real bubble elastic stretching & squashing flexibility
    const normX = Math.max(-1, Math.min(1, distX / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, distY / (rect.height / 2)));

    // Dynamic stretch along cursor pull direction
    const stretchFactor = 0.26 * intensity;
    targetScaleX = Math.max(0.78, Math.min(1.28, 1 + (Math.abs(normX) - Math.abs(normY) * 0.6) * stretchFactor));
    targetScaleY = Math.max(0.78, Math.min(1.28, 1 + (Math.abs(normY) - Math.abs(normX) * 0.6) * stretchFactor));

    // Elastic liquid skew
    targetSkewX = Math.max(-12, Math.min(12, normX * 8 * intensity));
    targetSkewY = Math.max(-12, Math.min(12, normY * 8 * intensity));

    // Specular light glare
    targetGlareX = Math.max(-25, Math.min(25, normX * 24));
    targetGlareY = Math.max(-25, Math.min(25, normY * 24));

    // Dynamic surface tension corner morphing based on drag direction
    const rTL = Math.round(54 - normX * 10 - normY * 10);
    const rTR = Math.round(46 + normX * 12 - normY * 8);
    const rBR = Math.round(58 + normX * 10 + normY * 10);
    const rBL = Math.round(42 - normX * 12 + normY * 8);
    const rVTL = Math.round(46 - normY * 12);
    const rVTR = Math.round(54 - normY * 8);
    const rVBR = Math.round(46 + normY * 12);
    const rVBL = Math.round(54 + normY * 8);
    droplet.style.setProperty('--bubble-radius', `${rTL}% ${rTR}% ${rBR}% ${rBL}% / ${rVTL}% ${rVTR}% ${rVBR}% ${rVBL}%`);

    startAnimLoop();
  }

  function onPointerLeave() {
    isHovering = false;
    targetX = 0;
    targetY = 0;
    targetRotX = 0;
    targetRotY = 0;
    targetRotZ = 0;
    targetScaleX = 1;
    targetScaleY = 1;
    targetSkewX = 0;
    targetSkewY = 0;
    targetGlareX = 0;
    targetGlareY = 0;
    droplet.style.removeProperty('--bubble-radius');
    startAnimLoop();
  }

  function tick() {
    if (!document.body.contains(droplet)) {
      cancelAnimationFrame(animFrameId);
      return;
    }

    const ease = 0.14; // responsive liquid jelly spring
    currX += (targetX - currX) * ease;
    currY += (targetY - currY) * ease;
    currRotX += (targetRotX - currRotX) * ease;
    currRotY += (targetRotY - currRotY) * ease;
    currRotZ += (targetRotZ - currRotZ) * ease;
    currScaleX += (targetScaleX - currScaleX) * ease;
    currScaleY += (targetScaleY - currScaleY) * ease;
    currSkewX += (targetSkewX - currSkewX) * ease;
    currSkewY += (targetSkewY - currSkewY) * ease;
    currGlareX += (targetGlareX - currGlareX) * ease;
    currGlareY += (targetGlareY - currGlareY) * ease;

    droplet.style.setProperty('--bubble-x', `${currX.toFixed(2)}px`);
    droplet.style.setProperty('--bubble-y', `${currY.toFixed(2)}px`);
    droplet.style.setProperty('--bubble-rot-x', `${currRotX.toFixed(2)}deg`);
    droplet.style.setProperty('--bubble-rot-y', `${currRotY.toFixed(2)}deg`);
    droplet.style.setProperty('--bubble-rot-z', `${currRotZ.toFixed(2)}deg`);
    droplet.style.setProperty('--bubble-scale-x', currScaleX.toFixed(3));
    droplet.style.setProperty('--bubble-scale-y', currScaleY.toFixed(3));
    droplet.style.setProperty('--bubble-skew-x', `${currSkewX.toFixed(2)}deg`);
    droplet.style.setProperty('--bubble-skew-y', `${currSkewY.toFixed(2)}deg`);
    droplet.style.setProperty('--glare-x', `${currGlareX.toFixed(1)}%`);
    droplet.style.setProperty('--glare-y', `${currGlareY.toFixed(1)}%`);

    const isSettled = !isHovering &&
      Math.abs(targetX - currX) < 0.05 &&
      Math.abs(targetY - currY) < 0.05 &&
      Math.abs(targetScaleX - currScaleX) < 0.002 &&
      Math.abs(targetScaleY - currScaleY) < 0.002 &&
      Math.abs(targetSkewX - currSkewX) < 0.05 &&
      Math.abs(targetRotX - currRotX) < 0.05;

    if (!isSettled) {
      animFrameId = requestAnimationFrame(tick);
    } else {
      animFrameId = null;
    }
  }

  function startAnimLoop() {
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(tick);
    }
  }

  // Bind mouse and touch events
  const interactiveTarget = banner || wrapper;
  interactiveTarget.addEventListener('pointermove', onPointerMove, { passive: true });
  interactiveTarget.addEventListener('pointerleave', onPointerLeave, { passive: true });
  interactiveTarget.addEventListener('touchmove', onPointerMove, { passive: true });
  interactiveTarget.addEventListener('touchend', onPointerLeave, { passive: true });
}

