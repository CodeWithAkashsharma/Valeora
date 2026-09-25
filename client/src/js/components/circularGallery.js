/**
 * CircularGallery - WebGL-powered interactive gallery using OGL.
 * Features:
 * - Immersive circular bending arc layout
 * - Automatic smooth luxury drift (auto-scroll)
 * - Refined, subtle card wave & spring-bounce on screen entry/exit
 * - Clean 3D depth pop, gentle scale bounce, and subtle edge tilt
 * - Extended off-screen wrapping buffer ensuring full visibility & symmetry
 * - Smooth inertia-based scrolling & drag gestures
 * - High-performance WebGL rendering with OGL
 * - Rounded corners SDF shader and custom typography labels
 * - Click to inspect & Quick-View integration
 */

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(gl, text, font = '600 32px "Playfair Display", serif', color = '#ECCFD0') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = getFontSize(font);
  const textHeight = Math.ceil(fontSize * 1.35);

  canvas.width = Math.max(textWidth + 40, 96);
  canvas.height = Math.max(textHeight + 24, 40);

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: true });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#ECCFD0', font = '600 32px "Playfair Display", serif' }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.05) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeightScaled = this.plane.scale.y * 0.13;
    const textWidthScaled = textHeightScaled * aspect;
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.1;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    id,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0.08,
    font
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.id = id;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.speed = 0;
    this.baseWidth = 0;
    this.baseHeight = 0;
    this.isBefore = false;
    this.isAfter = false;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true,
      minFilter: this.gl.LINEAR_MIPMAP_LINEAR,
      magFilter: this.gl.LINEAR,
      wrapS: this.gl.CLAMP_TO_EDGE,
      wrapT: this.gl.CLAMP_TO_EDGE
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uEdgeFactor;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          // Ultra-delicate, subtle wave flex for premium clarity & luxury feel
          float ambientWave = (sin(p.x * 2.5 + uTime * 1.2) * 0.035 + cos(p.y * 1.8 + uTime * 1.0) * 0.035);
          float speedWave = (sin(p.x * 2.8 + uTime) + cos(p.y * 1.8 + uTime)) * (uSpeed * 0.12);
          float edgeRipple = sin(p.x * 3.0 + uTime * 1.8) * (uEdgeFactor * 0.05);
          p.z = ambientWave + speedWave + edgeRipple;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        #extension GL_OES_standard_derivatives : enable
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = clamp(vUv * ratio + (1.0 - ratio) * 0.5, vec2(0.001), vec2(0.999));
          vec4 color = texture2D(tMap, uv);
          
          // Interior-inset SDF bounds to prevent mesh quad boundary aliasing/dashing
          vec2 p = (vUv - 0.5) * uPlaneSizes;
          vec2 halfSize = 0.5 * uPlaneSizes - vec2(0.08);
          float radius = uBorderRadius * min(uPlaneSizes.x, uPlaneSizes.y);
          vec2 b = halfSize - vec2(radius);
          float d = roundedBoxSDF(p, b, radius);
          
          // Ultra-smooth screen-space derivative antialiased edge
          #ifdef GL_OES_standard_derivatives
            float afwidth = length(vec2(dFdx(d), dFdy(d))) * 0.75;
          #else
            float afwidth = 0.035;
          #endif
          
          float alpha = 1.0 - smoothstep(-afwidth, afwidth, d);
          if (alpha <= 0.01) discard;
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uEdgeFactor: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const cardWidth = this.baseWidth || this.plane.scale.x;
    const wrapBuffer = cardWidth * 2.0;
    const viewportBound = (this.viewport.width / 2) + wrapBuffer;

    // Infinite cyclic wrapping with generous buffer to preserve smooth entry/exit animations
    while (this.plane.position.x < -viewportBound) {
      this.extra -= this.widthTotal;
      this.plane.position.x = this.x - scroll.current - this.extra;
    }
    while (this.plane.position.x > viewportBound) {
      this.extra += this.widthTotal;
      this.plane.position.x = this.x - scroll.current - this.extra;
    }

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    // ----------------------------------------------------
    // IN-SCREEN & OFF-SCREEN SUBTLE BOUNCE PHYSICS
    // ----------------------------------------------------
    const edgeU = Math.abs(x) / Math.max(H, 1.0); // 1.0 is exact viewport border
    // Smooth envelope focused around entering & exiting threshold (0.75 - 1.45)
    const edgeEnvelope = Math.exp(-Math.pow((edgeU - 1.02) / 0.35, 2.0));
    // Refined gentle spring oscillation
    const edgeSpringWave = Math.sin((edgeU - 0.72) * Math.PI * 3.0) * edgeEnvelope;
    
    // Gentle vertical dip & rebound when entering / leaving screen
    const edgeYBounce = edgeSpringWave * 0.18;
    // Subtle scale pop at viewport boundary
    const edgeScaleBounce = 1.0 + edgeSpringWave * 0.04;
    // Subtle 3D forward pop at screen perimeter
    const edgeZBounce = edgeEnvelope * 0.7 + edgeSpringWave * 0.35;
    // Gentle 3D card tilt
    const edgeRotY = Math.sign(x) * (edgeEnvelope * 0.06);

    // Circular Arc Bending with In/Off Screen Bounce addition
    if (this.bend === 0) {
      this.plane.position.y = edgeYBounce;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H * 1.35);
      const arc = R - Math.sqrt(Math.max(0, R * R - Math.min(effectiveX * effectiveX, R * R * 0.98)));
      if (this.bend > 0) {
        this.plane.position.y = -arc + edgeYBounce;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(Math.min(0.95, effectiveX / R));
      } else {
        this.plane.position.y = arc - edgeYBounce;
        this.plane.rotation.z = Math.sign(x) * Math.asin(Math.min(0.95, effectiveX / R));
      }
    }

    // Dynamic rotation tilt wobble on edge entry/exit
    this.plane.rotation.y = edgeRotY;
    this.plane.rotation.z += Math.sign(x) * edgeSpringWave * 0.025;

    // Center focal elevation & early broad wave
    const centerReach = H * 1.35;
    const normDist = Math.min(Math.abs(x) / Math.max(centerReach, 1.0), 1.0);
    const centerBounce = Math.cos(normDist * Math.PI * 0.5);
    const earlyWave = Math.sin(normDist * Math.PI) * 0.20;
    const isMobile = (this.screen?.width || (typeof window !== 'undefined' ? window.innerWidth : 1200)) <= 768;
    const zMultiplier = isMobile ? 0.45 : 1.8;
    const centerScalePop = isMobile ? 0.03 : 0.08;

    // Apply combined scale bounce
    if (this.baseWidth && this.baseHeight) {
      const totalScale = (1.0 + Math.pow(centerBounce, 1.3) * centerScalePop + earlyWave * 0.015) * edgeScaleBounce;
      this.plane.scale.set(this.baseWidth * totalScale, this.baseHeight * totalScale, 1);
    }
    
    // 3D forward projection depth: Center lift + Entry/Exit edge pop
    this.plane.position.z = Math.pow(centerBounce, 1.2) * zMultiplier + (earlyWave * (isMobile ? 0.2 : 1.0)) + (edgeZBounce * (isMobile ? 0.3 : 1.0));

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.018;
    this.program.uniforms.uSpeed.value = this.speed;
    this.program.uniforms.uEdgeFactor.value = edgeEnvelope;
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    const currentWidth = this.screen?.width || (typeof window !== 'undefined' ? window.innerWidth : 1200);
    const isSmallMobile = currentWidth <= 480;
    const isMobile = currentWidth <= 768;

    let cardH = 820;
    let cardW = 640;
    let padding = 2.4;

    if (isSmallMobile) {
      cardH = 680; // Slightly larger cards on small screen
      cardW = 530; // Slightly larger cards on small screen
      padding = 3.3; // Clean, balanced spacing
    } else if (isMobile) {
      cardH = 740;
      cardW = 580;
      padding = 3.0;
    }

    this.scale = this.screen.height / 1400;
    this.baseHeight = (this.viewport.height * (cardH * this.scale)) / this.screen.height;
    this.baseWidth = (this.viewport.width * (cardW * this.scale)) / this.screen.width;
    this.plane.scale.y = this.baseHeight;
    this.plane.scale.x = this.baseWidth;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = padding;
    this.width = this.baseWidth + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

export class CircularGallery {
  constructor(
    container,
    {
      items,
      bend = 3.5,
      textColor = '#ECCFD0',
      borderRadius = 0.08,
      font = '600 28px "Playfair Display", serif',
      scrollSpeed = 2.5,
      scrollEase = 0.048,
      autoSpeed = 0.038,
      autoScroll = true
    } = {}
  ) {
    this.container = container;
    if (!this.container) return;

    this.scrollSpeed = scrollSpeed;
    this.autoSpeed = autoSpeed;
    this.autoScroll = autoScroll;
    this.isHovered = false;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    // Responsive 60ms debounce for early bounce snap
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 60);
    this.medias = [];
    this.mediasImages = [];
    this.isDown = false;
    this.start = 0;
    this.hasMoved = false;

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 24.5;
  }

  createScene() {
    this.scene = new Transform();
    this.scene.position.y = 0.6;
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }

  createMedias(
    items,
    bend = 3.5,
    textColor = '#ECCFD0',
    borderRadius = 0.08,
    font = '600 24px "Playfair Display", serif'
  ) {
    const defaultItems = [
      { id: 'imperial-ruby-choker-masterpiece', image: '/images/imperial_necklace.jpg', text: 'Royal Ruby Choker' },
      { id: 'cascade-diamond-earrings', image: '/images/for_her.jpg', text: 'Cascade Chandelier Earrings' },
      { id: 'for-him-onyx-signet-cufflinks', image: '/images/for_him.jpg', text: 'Onyx Signet & Cufflinks' },
      { id: 'solitaire-pav-diamond-ring', image: '/images/featured_ring1.jpg', text: 'Solitaire Promise Ring' },
      { id: 'ruby-teardrop-halo-pendant', image: '/images/featured_pendant.jpg', text: 'Ruby Halo Pendant' },
      { id: 'diamond-brilliance-bracelet', image: '/images/diamond_bracelet.jpg', text: 'Crystal Tennis Bracelet' },
      { id: 'editorial-heritage-necklace', image: '/images/featured_necklace.jpg', text: 'Heritage Floral Collar' },
      { id: 'oval-ruby-pave-cocktail-ring', image: '/images/featured_ring2.jpg', text: 'Oval Ruby Statement Ring' }
    ];

    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        id: data.id,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      });
    });
  }

  onTouchDown(e) {
    this.isDown = true;
    this.hasMoved = false;
    this.scroll.position = this.scroll.current;
    const clientX = 'touches' in e && e.touches.length ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e && e.touches.length ? e.touches[0].clientY : e.clientY;
    this.start = clientX;
    this.startY = clientY;
    this.lastX = clientX;
    this.lastTime = performance.now();
    this.velocity = 0;
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const clientX = 'touches' in e && e.touches.length ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e && e.touches.length ? e.touches[0].clientY : e.clientY;
    
    const now = performance.now();
    const dt = Math.max(now - this.lastTime, 10);
    const dx = clientX - this.lastX;
    const currentVelocity = -(dx / dt);
    this.velocity = this.velocity * 0.4 + currentVelocity * 0.6;
    this.lastX = clientX;
    this.lastTime = now;

    const isTouch = ('touches' in e) || ('ontouchstart' in window) || (window.innerWidth <= 768);
    const dragMultiplier = isTouch 
      ? (this.viewport.width / Math.max(this.screen.width, 300)) * 1.35
      : (this.scrollSpeed * 0.025);

    const distance = (this.start - clientX) * dragMultiplier;
    if (Math.hypot(this.start - clientX, (this.startY || clientY) - clientY) > 5) {
      this.hasMoved = true;
    }
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  }

  onTouchUp(e) {
    if (!this.isDown) return;
    this.isDown = false;

    const isTouch = (e && e.changedTouches && e.changedTouches.length) || ('ontouchstart' in window) || (window.innerWidth <= 768);
    if (this.hasMoved && Math.abs(this.velocity) > 0.04) {
      const dragMultiplier = isTouch 
        ? (this.viewport.width / Math.max(this.screen.width, 300)) * 1.35
        : (this.scrollSpeed * 0.025);
      const momentum = this.velocity * 200 * dragMultiplier;
      this.scroll.target += momentum;
    }

    // Apply bounce effect early
    this.onCheckDebounce();

    // If user tapped without dragging, trigger quick view for clicked card
    if (!this.hasMoved && e) {
      const clickX = e.changedTouches && e.changedTouches.length ? e.changedTouches[0].clientX : e.clientX;
      const rect = this.container.getBoundingClientRect();
      const relativeX = clickX - rect.left;
      const ndcX = (relativeX / this.screen.width) * 2 - 1;

      // Find media card closest to click coordinates in viewport
      let closest = null;
      let minDiff = 9999;
      this.medias.forEach(media => {
        const halfWidthNDC = (media.plane.scale.x / this.viewport.width);
        const cardNDCX = media.plane.position.x / (this.viewport.width / 2);
        const diff = Math.abs(cardNDCX - ndcX);
        if (diff < minDiff && diff <= Math.max(halfWidthNDC * 1.25, 0.28)) {
          minDiff = diff;
          closest = media;
        }
      });

      if (closest && closest.id) {
        window.dispatchEvent(new CustomEvent('valeora:quick-view', { detail: { productId: closest.id } }));
      }
    }
  }

  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    if (!this.container) return;
    this.screen = {
      width: this.container.clientWidth || window.innerWidth,
      height: this.container.clientHeight || 500
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  update() {
    // Automatic smooth luxury drifting motion when not dragging
    if (this.autoScroll && !this.isDown) {
      const speedMultiplier = this.isHovered ? 0.35 : 1.0;
      this.scroll.target += this.autoSpeed * speedMultiplier;
    }

    const isTouch = (typeof window !== 'undefined' && window.innerWidth <= 768);
    const currentEase = this.isDown ? (isTouch ? 0.16 : 0.1) : (isTouch ? 0.075 : (this.scroll.ease || 0.048));
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, currentEase);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnMouseEnter = this.onMouseEnter.bind(this);
    this.boundOnMouseLeave = this.onMouseLeave.bind(this);

    window.addEventListener('resize', this.boundOnResize);
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: true });
    this.container.addEventListener('mousedown', this.boundOnTouchDown);
    this.container.addEventListener('mouseenter', this.boundOnMouseEnter);
    this.container.addEventListener('mouseleave', this.boundOnMouseLeave);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('touchend', this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    if (this.container) {
      this.container.removeEventListener('wheel', this.boundOnWheel);
      this.container.removeEventListener('mousedown', this.boundOnTouchDown);
      this.container.removeEventListener('mouseenter', this.boundOnMouseEnter);
      this.container.removeEventListener('mouseleave', this.boundOnMouseLeave);
      this.container.removeEventListener('touchstart', this.boundOnTouchDown);
    }
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export default CircularGallery;
