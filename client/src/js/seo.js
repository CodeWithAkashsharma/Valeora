/**
 * VALEORA Technical SEO & Dynamic Meta Tag Manager
 * Optimizes titles, meta tags, OpenGraph, Twitter Cards, and canonical URLs for Google Search Console & Social Sharing
 */

const BASE_URL = 'https://valeora.in';

const SEO_CONFIG = {
  home: {
    title: 'VALEORA | Everyday Luxury Fashion Jewelry — ₹249 to ₹999',
    description: 'Shop VALEORA for luxury daily-wear fashion jewelry. 18K gold polish, anti-tarnish mirror finish, and skin-safe hypoallergenic comfort. Free delivery over ₹999 across India.',
    keywords: 'valeora jewelry, fashion jewelry india, 18k gold polish jewelry, anti tarnish necklace, daily wear earrings, rings for women, men cuban chain, figaro bracelet, affordable luxury jewelry',
    canonical: `${BASE_URL}/`
  },
  shop: {
    title: 'Jewelry Collection | Rings, Necklaces, Earrings, Bracelets & Chains | VALEORA',
    description: 'Explore VALEORA’s premium collection of necklaces, solitaire rings, chandelier earrings, curb chains, and Figaro bracelets. Every item ₹249 – ₹999 with guaranteed long-lasting shine.',
    keywords: 'shop jewelry online, buy gold polish necklace, artificial rings india, men chain online, bracelets for women, wedding fashion jewelry, bridal choker necklace',
    canonical: `${BASE_URL}/#shop`
  },
  about: {
    title: 'Our Story & Craftsmanship | Anti-Fade Daily Wear Jewelry | VALEORA',
    description: 'Discover how VALEORA makes high-end jewelry design accessible. Crafted with multi-layer 18K gold electroplating, scratch resistance, and honest direct-to-consumer pricing.',
    keywords: 'about valeora, anti tarnish jewelry brand, affordable luxury india, hypoallergenic jewelry manufacturer, ethical fashion jewelry',
    canonical: `${BASE_URL}/#about`
  },
  science: {
    title: 'Jewelry Care & Quality Standards | Anti-Tarnish Assurance | VALEORA',
    description: 'Learn how VALEORA delivers waterproof, sweat-resistant, and skin-friendly jewelry built for everyday wear in all Indian climates.',
    keywords: 'jewelry care guide, anti tarnish plating science, skin safe brass jewelry, long lasting gold coating',
    canonical: `${BASE_URL}/#science`
  },
  contact: {
    title: 'Contact Us & Customer Support | Janakpuri, New Delhi | VALEORA Jewelry',
    description: 'Reach VALEORA Customer Care for instant order assistance, shipment tracking, or bespoke inquiries. Janakpuri, New Delhi, India. Email: Valeora.shop@gmail.com',
    keywords: 'contact valeora, jewelry customer service delhi, valeora store janakpuri, order support jewelry',
    canonical: `${BASE_URL}/#contact`
  },
  profile: {
    title: 'My Account & Live Order Tracking | VALEORA Jewelry',
    description: 'Track your jewelry deliveries across India, view order history, download invoices, and manage your shipping address with VALEORA.',
    keywords: 'track valeora order, jewelry delivery tracking india, my orders valeora',
    canonical: `${BASE_URL}/#profile`
  },
  admin: {
    title: 'Admin Management Portal | VALEORA',
    description: 'VALEORA Store Admin & Inventory Management Dashboard.',
    keywords: 'valeora admin',
    canonical: `${BASE_URL}/#admin`,
    noindex: true
  },
  'admin-login': {
    title: 'Admin Portal Authentication | VALEORA',
    description: 'Executive Administrative Login for VALEORA Atelier.',
    keywords: 'valeora admin login',
    canonical: `${BASE_URL}/#admin/login`,
    noindex: true
  },
  '404': {
    title: '404 Page Not Found | VALEORA Luxury Jewelry',
    description: 'The page you requested could not be found on VALEORA.',
    keywords: 'valeora 404',
    canonical: `${BASE_URL}/`,
    noindex: true
  }
};

function setMetaTag(attributeName, attributeValue, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function updateSEO(route = 'home', product = null) {
  if (typeof document === 'undefined') return;

  if (product) {
    const title = `${product.name} — ₹${product.price} | VALEORA Jewelry`;
    const desc = `${product.tagline || product.description || 'Exclusive fashion jewelry'} from VALEORA. 18K gold polish, anti-fade guarantee, free gift box. Just ₹${product.price}.`;
    const url = `${BASE_URL}/#product/${product.id}`;

    document.title = title;
    setMetaTag('name', 'description', desc);
    setMetaTag('name', 'keywords', `${product.name}, ${product.category}, ${product.subcategory || ''}, buy ${product.name} online india, valeora jewelry`);
    setCanonical(url);

    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:url', url);
    if (product.image) {
      setMetaTag('property', 'og:image', product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`);
    }

    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', desc);
    return;
  }

  const config = SEO_CONFIG[route] || SEO_CONFIG.home;

  document.title = config.title;
  setMetaTag('name', 'description', config.description);
  setMetaTag('name', 'keywords', config.keywords);
  setCanonical(config.canonical);

  if (config.noindex) {
    setMetaTag('name', 'robots', 'noindex, nofollow');
  } else {
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }

  // Open Graph
  setMetaTag('property', 'og:title', config.title);
  setMetaTag('property', 'og:description', config.description);
  setMetaTag('property', 'og:url', config.canonical);

  // Twitter Cards
  setMetaTag('name', 'twitter:title', config.title);
  setMetaTag('name', 'twitter:description', config.description);
}
