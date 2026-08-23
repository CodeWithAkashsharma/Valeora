// ============================================================
// AURITE FULL-PAGE BACKGROUND SCROLL ANIMATION ENGINE
// 216 frames: ezgif-frame-001.jpg → ezgif-frame-216.jpg
// Canvas covers the ENTIRE hero section with High-DPR Rendering
// ============================================================

const TOTAL_FRAMES = 216;
const FRAME_PREFIX = '/frames/ezgif-frame-';
const FRAME_SUFFIX = '.jpg';

function framePath(n) {
  return FRAME_PREFIX + String(n).padStart(3, '0') + FRAME_SUFFIX;
}

export class ScrollCanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    this.frames = new Array(TOTAL_FRAMES).fill(null);
    this.currentFrame = 0;
    this.loadedCount = 0;
    this.isReady = false;
    this.rafPending = false;

    // Scroll-jack state
    this.scrollProgress = 0;         // 0 → 1
    this.scrollDeltaAcc = 0;         // accumulated scroll px
    this.SCROLL_TRAVEL = 2400;       // px of scroll — luxurious, slow & smooth feel
    this.animDone = false;
    this.wheelHandler = null;
    this.touchHandler = null;
    this._lastTouchY = 0;

    this._setup();
  }

  _setup() {
    this._resize();
    window.addEventListener('resize', () => this._resize(), { passive: true });

    // Load all frames with priority
    this._loadFrames();
    this._setupScrollJack();
  }

  _resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(window.innerWidth * dpr);
    this.canvas.height = Math.round(window.innerHeight * dpr);
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this._logicalW = window.innerWidth;
    this._logicalH = window.innerHeight;
    this._dpr = dpr;

    if (this.isReady) this._drawFrame(this.currentFrame);
  }

  _loadFrames() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i + 1);
      const idx = i;
      img.onload = () => {
        this.frames[idx] = img;
        this.loadedCount++;
        
        if (!this.isReady && this.loadedCount >= 8) {
          this.isReady = true;
          this._drawFrame(0);
        }
        
        const bar = document.getElementById('frame-load-bar');
        if (bar) bar.style.width = (this.loadedCount / TOTAL_FRAMES * 100) + '%';
        if (this.loadedCount === TOTAL_FRAMES) {
          const loader = document.getElementById('frame-loader');
          if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 500); }
        }
      };
      img.onerror = () => { this.loadedCount++; };
    }
  }

  _setupScrollJack() {
    this.wheelHandler = (e) => {
      if (this.animDone) return;
      const heroEl = document.getElementById('hero-section');
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      if (rect.top > 80 || rect.bottom < 0) return;
      e.preventDefault();
      this._advance(e.deltaY);
    };

    this.touchStartHandler = (e) => {
      if (e.touches.length) this._lastTouchY = e.touches[0].clientY;
    };
    this.touchHandler = (e) => {
      if (this.animDone) return;
      const heroEl = document.getElementById('hero-section');
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      if (rect.top > 80 || rect.bottom < 0) return;
      e.preventDefault();
      const dy = this._lastTouchY - e.touches[0].clientY;
      this._lastTouchY = e.touches[0].clientY;
      this._advance(dy * 2.2);
    };

    window.addEventListener('wheel', this.wheelHandler, { passive: false });
    window.addEventListener('touchstart', this.touchStartHandler, { passive: true });
    window.addEventListener('touchmove', this.touchHandler, { passive: false });
  }

  _advance(delta) {
    if (delta > 0) {
      this.scrollDeltaAcc = Math.min(this.scrollDeltaAcc + Math.abs(delta), this.SCROLL_TRAVEL);
    } else {
      this.scrollDeltaAcc = Math.max(0, this.scrollDeltaAcc - Math.abs(delta));
    }

    this.scrollProgress = this.scrollDeltaAcc / this.SCROLL_TRAVEL;
    const targetFrame = Math.min(Math.floor(this.scrollProgress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

    if (targetFrame !== this.currentFrame) {
      this.currentFrame = targetFrame;
      this._scheduleDrawFrame(this.currentFrame);
    }

    const hint = document.getElementById('scroll-hint');
    if (hint) {
      const pct = Math.round(this.scrollProgress * 100);
      if (pct > 0) hint.querySelector('span').textContent = `${pct}%`;
      if (pct >= 100) { hint.style.opacity = '0'; }
    }

    if (this.scrollProgress >= 1 && !this.animDone) {
      this.animDone = true;
      window.removeEventListener('wheel', this.wheelHandler, { passive: false });
      window.removeEventListener('touchmove', this.touchHandler, { passive: false });
      
      const badge = document.querySelector('.canvas-badge-tag');
      if (badge) badge.textContent = '360° Complete ✓';

      setTimeout(() => {
        const hero = document.getElementById('hero-section');
        if (hero) {
          const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
          window.scrollTo({ top: heroBottom, behavior: 'smooth' });
        }
      }, 300);
    }
  }

  destroy() {
    if (this.wheelHandler) window.removeEventListener('wheel', this.wheelHandler, { passive: false });
    if (this.touchHandler) window.removeEventListener('touchmove', this.touchHandler, { passive: false });
    if (this.touchStartHandler) window.removeEventListener('touchstart', this.touchStartHandler, { passive: true });
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler, { passive: true });
  }

  _scheduleDrawFrame(idx) {
    if (this.rafPending) return;
    this.rafPending = true;
    requestAnimationFrame(() => {
      this.rafPending = false;
      this._drawFrame(idx);
    });
  }

  _drawFrame(idx) {
    const img = this.frames[idx];
    const ctx = this.ctx;
    const w = this._logicalW;
    const h = this._logicalH;
    const dpr = this._dpr || (window.devicePixelRatio || 1);
    if (!ctx || !w || !h) return;

    // Reset matrix & enable high-quality smoothing
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.fillStyle = '#080d08';
    ctx.fillRect(0, 0, w, h);

    if (!img) {
      this._drawPlaceholder(ctx, w, h);
      return;
    }

    // Cover-fit: covers the ENTIRE view without any extra space or letterboxing
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = w / h;

    let drawW, drawH, offsetX, offsetY;
    if (imgAspect > canvasAspect) {
      drawH = h;
      drawW = h * imgAspect;
      offsetX = (w - drawW) / 2;
      offsetY = 0;
    } else {
      drawW = w;
      drawH = w / imgAspect;
      offsetX = 0;
      offsetY = (h - drawH) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    // ============================================================
    // CORNER & EDGE DARKNESS FOR PERFECT TEXT CONTRAST
    // (Center 3D bottle remains 100% crisp & unshaded)
    // ============================================================

    // Top edge gradient for navbar contrast
    const topG = ctx.createLinearGradient(0, 0, 0, h * 0.25);
    topG.addColorStop(0, 'rgba(0,0,0,0.65)');
    topG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topG;
    ctx.fillRect(0, 0, w, h * 0.25);

    // Left side corner & radial vignette (behind hero text)
    if (w > 900) {
      const leftG = ctx.createRadialGradient(0, h * 0.5, 0, 0, h * 0.5, w * 0.55);
      leftG.addColorStop(0, 'rgba(0,0,0,0.72)');
      leftG.addColorStop(0.5, 'rgba(0,0,0,0.35)');
      leftG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = leftG;
      ctx.fillRect(0, 0, w * 0.6, h);
    } else {
      // Mobile: overall subtle dark vignette
      const mobileG = ctx.createRadialGradient(w/2, h/2, h*0.2, w/2, h/2, h*0.8);
      mobileG.addColorStop(0, 'rgba(0,0,0,0.15)');
      mobileG.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = mobileG;
      ctx.fillRect(0, 0, w, h);
    }

    // Bottom edge for trust strip & scroll hint
    const botG = ctx.createLinearGradient(0, h * 0.7, 0, h);
    botG.addColorStop(0, 'rgba(0,0,0,0)');
    botG.addColorStop(1, 'rgba(0,0,0,0.78)');
    ctx.fillStyle = botG;
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
  }

  _drawPlaceholder(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0f281e');
    grad.addColorStop(1, '#061410');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const loaded = this.loadedCount;
    const pct = Math.round(loaded / TOTAL_FRAMES * 100);
    ctx.fillStyle = 'rgba(197,160,89,0.85)';
    ctx.font = `bold ${Math.max(14, w * 0.012)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Loading 3D Experience… ${pct}%`, w / 2, h / 2);
  }

  isDone() { return this.animDone; }
}
