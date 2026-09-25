import gsap from 'gsap';

/**
 * Initializes interactive luxury tactile spring & squeeze physics on hero buttons
 * - Subtle magnetic pull on cursor approach
 * - Elastic tactile squash on press / drag
 * - Ultra-smooth spring inertia bounceback on release
 */
export function initJellyButton(buttonEl) {
  if (!buttonEl || buttonEl._hasJelly) return;
  buttonEl._hasJelly = true;

  let isPressed = false;
  let startX = 0;
  let startY = 0;

  // Set transform origins
  buttonEl.style.transformOrigin = 'center center';
  buttonEl.style.willChange = 'transform';

  function onPointerDown(e) {
    isPressed = true;
    startX = e.clientX;
    startY = e.clientY;

    // Tactile press squash
    gsap.to(buttonEl, {
      scaleX: 1.08,
      scaleY: 0.92,
      y: 2,
      duration: 0.12,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  function onPointerMove(e) {
    if (!isPressed) {
      // Magnetic cursor tracking when hovering
      const rect = buttonEl.getBoundingClientRect();
      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      const pullDistance = Math.hypot(relX, relY);
      if (pullDistance < 1.3) {
        gsap.to(buttonEl, {
          x: relX * 5,
          y: relY * 4,
          scaleX: 1 + Math.abs(relX) * 0.03 - Math.abs(relY) * 0.02,
          scaleY: 1 + Math.abs(relY) * 0.03 - Math.abs(relX) * 0.02,
          rotateZ: relX * 1.5,
          duration: 0.22,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      }
      return;
    }

    // Drag vertical / horizontal squeeze
    const deltaY = e.clientY - startY;
    const deltaX = e.clientX - startX;
    const squeezeFactorY = Math.min(Math.max(deltaY * 0.003, -0.2), 0.2);
    const squeezeFactorX = Math.min(Math.max(deltaX * 0.003, -0.15), 0.15);

    gsap.to(buttonEl, {
      x: deltaX * 0.2,
      y: deltaY * 0.25,
      scaleX: 1 - squeezeFactorY * 0.6 + Math.abs(squeezeFactorX) * 0.25,
      scaleY: 1 + squeezeFactorY * 0.6 - Math.abs(squeezeFactorX) * 0.25,
      rotateZ: deltaX * 0.03,
      duration: 0.1,
      ease: 'none',
      overwrite: 'auto'
    });
  }

  function onPointerUp() {
    if (!isPressed) return;
    isPressed = false;

    // Realistic refined spring bounce
    gsap.timeline()
      .to(buttonEl, {
        x: 0,
        y: 0,
        rotateZ: 0,
        scaleX: 0.94,
        scaleY: 1.08,
        duration: 0.14,
        ease: 'power2.out'
      })
      .to(buttonEl, {
        scaleX: 1.04,
        scaleY: 0.97,
        duration: 0.16,
        ease: 'power1.out'
      })
      .to(buttonEl, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.35,
        ease: 'elastic.out(1.2, 0.35)'
      });
  }

  function onPointerLeave() {
    if (isPressed) {
      onPointerUp();
    } else {
      gsap.to(buttonEl, {
        x: 0,
        y: 0,
        rotateZ: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.4,
        ease: 'elastic.out(1.2, 0.35)',
        overwrite: 'auto'
      });
    }
  }

  buttonEl.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);
  buttonEl.addEventListener('pointerleave', onPointerLeave);
}

export function bindAllJellyButtons() {
  const heroButtons = document.querySelectorAll('.valeora-tactile-btn, .jelly-3d-button, .hero-btn-group .btn');
  heroButtons.forEach(btn => initJellyButton(btn));
}


