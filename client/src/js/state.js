import { PRODUCTS } from './productsData.js';
import {
  createOrder,
  getUserDoc,
  saveUserDoc,
  logoutUser,
  subscribeToOrders,
  subscribeToQueries,
  saveQueryToDb,
  updateQueryInDb,
  updateOrderStatusInDb,
  isAdminEmail,
  subscribeToProducts,
  saveProductToDb,
  deleteProductFromDb,
  seedProductsIfEmpty,
  subscribeToCoupons,
  saveCouponToDb,
  updateCouponInDb,
  deleteCouponFromDb,
  seedCouponsIfEmpty
} from './services/firebase.js';

export const DEFAULT_COUPONS = [
  {
    id: 'coupon-valeora10',
    code: 'VALEORA10',
    discountPercent: 10,
    minAmount: 499,
    description: '10% OFF on all luxury jewelry above ₹499',
    active: true,
    usesCount: 18,
    createdAt: '2026-09-20'
  },
  {
    id: 'coupon-royal20',
    code: 'ROYAL20',
    discountPercent: 20,
    minAmount: 999,
    description: '20% OFF on grand royal jewelry orders above ₹999',
    active: true,
    usesCount: 32,
    createdAt: '2026-09-21'
  },
  {
    id: 'coupon-festive15',
    code: 'FESTIVE15',
    discountPercent: 15,
    minAmount: 749,
    description: '15% OFF on 18K gold polish orders above ₹749',
    active: true,
    usesCount: 12,
    createdAt: '2026-09-22'
  }
];

// ============================================================
// VALEORA CENTRAL REACTIVE STATE & STORE
// ============================================================
class AppState {
  constructor() {
    const rawUser = JSON.parse(localStorage.getItem('valeora_user') || 'null');
    const userEmail = (rawUser?.email || '').toLowerCase();
    const isStoredAdmin = JSON.parse(localStorage.getItem('valeora_is_admin') || 'false');
    const isAdminUser = isStoredAdmin || isAdminEmail(userEmail) || rawUser?.role === 'admin';

    this.user = rawUser ? {
      uid: rawUser.uid || null,
      name: rawUser.name || 'Valued Member',
      email: rawUser.email || '',
      phone: rawUser.phone || '',
      address: rawUser.address || '',
      city: rawUser.city || '',
      pincode: rawUser.pincode || '',
      country: rawUser.country || 'India',
      role: isAdminUser ? 'admin' : (rawUser.role || 'customer'),
      membership: isAdminUser ? 'Administrator' : (rawUser.membership || 'Valeora Member'),
      memberSince: rawUser.memberSince || '2026'
    } : null;

    this.isAdmin = isAdminUser;

    if (this.user && (this.user.email || '').toLowerCase() === 'pooja.sharma@example.com') {
      this.user = null;
      this.isAdmin = false;
      localStorage.removeItem('valeora_user');
      localStorage.removeItem('valeora_is_admin');
    }

    // User-specific Cart initialization
    const cartKey = this._getCartStorageKey();
    const savedCart = localStorage.getItem(cartKey);
    this.cart = savedCart ? JSON.parse(savedCart) : [];

    this._unsubscribeOrders = null;
    this._unsubscribeQueries = null;

    // Product catalog loaded from localStorage (filtering out any legacy sample/demo IDs)
    const sampleProductIds = [
      'imperial-ruby-choker-masterpiece',
      'editorial-heritage-necklace',
      'solitaire-pav-diamond-ring',
      'diamond-brilliance-bracelet',
      'grand-victorian-emerald-choker',
      'for-him-onyx-signet-cufflinks',
      'men-cuban-curb-chain',
      'rose-gold-celestial-drop-earrings',
      'for-her-solitaire-pendant',
      'men-figaro-hand-bracelet'
    ];
    const savedProducts = JSON.parse(localStorage.getItem('valeora_products') || '[]');
    this.products = Array.isArray(savedProducts)
      ? savedProducts.filter(p => p && p.id && !sampleProductIds.includes(p.id) && !p._sample && !p._demo)
      : [];
    localStorage.setItem('valeora_products', JSON.stringify(this.products));

    // Real-time Firestore Products Sync
    this._unsubscribeProducts = null;
    this.initProductsSync();

    // Live Orders: purge legacy sample/demo data so real database orders take over
    const rawOrders = JSON.parse(localStorage.getItem('valeora_orders') || '[]');
    this.orders = Array.isArray(rawOrders)
      ? rawOrders.filter(o => !o._demo && o.id !== 'VAL-9481-2026' && o.id !== 'VAL-2026-D01' && o.id !== 'VAL-2026-D02' && o.userId !== 'sample_pooja_uid' && (o.email || '').toLowerCase() !== 'pooja.sharma@example.com')
      : [];
    localStorage.setItem('valeora_orders', JSON.stringify(this.orders));

    // Live Queries: purge legacy sample inquiries so real customer inquiries take over
    const rawQueries = JSON.parse(localStorage.getItem('valeora_queries') || '[]');
    this.queries = Array.isArray(rawQueries)
      ? rawQueries.filter(q => q.id !== 'QRY-101' && q.id !== 'QRY-7102' && (q.email || '').toLowerCase() !== 'pooja.sharma@example.com')
      : [];
    localStorage.setItem('valeora_queries', JSON.stringify(this.queries));

    // Purge legacy sample registered users
    const rawRegUsers = JSON.parse(localStorage.getItem('valeora_registered_users') || '[]');
    if (Array.isArray(rawRegUsers)) {
      const cleanRegUsers = rawRegUsers.filter(u =>
        (u.email || '').toLowerCase() !== 'pooja.sharma@example.com' &&
        (u.email || '').toLowerCase() !== 'priya.s@techcorp.io' &&
        (u.email || '').toLowerCase() !== 'ananya.v@lifestyle.in'
      );
      localStorage.setItem('valeora_registered_users', JSON.stringify(cleanRegUsers));
    }

    // Purge legacy sample returns
    const rawReturns = JSON.parse(localStorage.getItem('valeora_returns') || '[]');
    if (Array.isArray(rawReturns)) {
      const cleanReturns = rawReturns.filter(r => r.id !== 'RET-101' && r.orderId !== 'VAL-9481-2026');
      localStorage.setItem('valeora_returns', JSON.stringify(cleanReturns));
    }

    this.cleanExpiredResolvedQueries();

    // Start Firestore listeners immediately if user session exists
    if (this.user) {
      this.startFirestoreListeners();
    }

    // Auto-sync un-synced queries to Firestore so other devices get them
    (this.queries || []).forEach(q => {
      if (!q.firestoreId && q.message) {
        saveQueryToDb(q).then(docId => {
          if (docId) {
            q.firestoreId = docId;
            this._persist();
          }
        }).catch(e => console.warn('Sync query to firestore:', e));
      }
    });

    // Auto-sync un-synced orders to Firestore so other devices get them
    (this.orders || []).forEach(o => {
      if (o._demo) return; // skip demo/sample orders — don't sync to Firestore
      if (!o.firestoreId && o.items && o.items.length > 0) {
        createOrder(o).then(docId => {
          if (docId) {
            o.firestoreId = docId;
            this._persist();
          }
        }).catch(e => console.warn('Sync order to firestore:', e));
      }
    });

    // Coupons and Promotions initialization
    const savedCoupons = localStorage.getItem('valeora_coupons');
    this.coupons = savedCoupons ? JSON.parse(savedCoupons) : DEFAULT_COUPONS;
    this.appliedCoupon = JSON.parse(localStorage.getItem('valeora_applied_coupon') || 'null');
    this.discountPercent = this.appliedCoupon ? this.appliedCoupon.discountPercent : 0;
    this.couponFeedback = null;

    this.currentRoute = 'home';
    this.isMobileMenuOpen = false;
    this.isCartOpen = false;
    this.isAuthOpen = false;
    this.isCheckoutOpen = false;
    this.policyModalType = null;
    this.quickViewProduct = null;

    // Delivery settings
    this.freeDeliveryThreshold = 999;
    this.standardShippingFee = 79;

    this._changeFlags = {};
    this._listeners = new Set();

    this.initCouponsSync();
  }

  subscribe(cb) {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }

  _notify(flags = {}) {
    this._changeFlags = flags;
    this._persist();
    this._listeners.forEach(cb => cb(this, flags));
  }

  _getCartStorageKey(uid = this.user?.uid) {
    return uid ? `valeora_cart_${uid}` : 'valeora_cart_guest';
  }

  _persist() {
    const cartKey = this._getCartStorageKey();
    localStorage.setItem(cartKey, JSON.stringify(this.cart));
    localStorage.setItem('valeora_user', JSON.stringify(this.user));
    localStorage.setItem('valeora_is_admin', JSON.stringify(this.isAdmin));
    localStorage.setItem('valeora_orders', JSON.stringify(this.orders));
    localStorage.setItem('valeora_queries', JSON.stringify(this.queries));
    localStorage.setItem('valeora_products', JSON.stringify(this.products));
    localStorage.setItem('valeora_coupons', JSON.stringify(this.coupons));
    localStorage.setItem('valeora_applied_coupon', JSON.stringify(this.appliedCoupon));

    // Cross-device cart cloud synchronization
    if (this.user?.uid) {
      saveUserDoc(this.user.uid, { cart: this.cart }).catch(e => console.warn('Firestore cart sync:', e));
    }
  }

  setRoute(route) {
    let normalized = route || 'home';
    if (normalized === 'admin/login') normalized = 'admin-login';
    this.currentRoute = normalized;
    this.isMobileMenuOpen = false;

    if (typeof window !== 'undefined') {
      let targetUrl = '/';
      if (this.currentRoute === 'admin-login') {
        targetUrl = '/admin/login';
      } else if (this.currentRoute === 'admin') {
        targetUrl = '/admin';
      } else if (this.currentRoute === 'home') {
        targetUrl = '/';
      } else if (this.currentRoute === '404') {
        targetUrl = window.location.pathname || '/404';
      } else {
        targetUrl = `/${this.currentRoute}`;
      }

      if (window.location.hash || window.location.pathname !== targetUrl) {
        history.replaceState(null, '', targetUrl);
      }
    }
    this._notify({ route: true, navbar: true, mobileMenu: true });
  }

  initProductsSync() {
    try {
      this._unsubscribeProducts = subscribeToProducts((liveProds) => {
        if (Array.isArray(liveProds)) {
          const sampleProductIds = [
            'imperial-ruby-choker-masterpiece',
            'editorial-heritage-necklace',
            'solitaire-pav-diamond-ring',
            'diamond-brilliance-bracelet',
            'grand-victorian-emerald-choker',
            'for-him-onyx-signet-cufflinks',
            'men-cuban-curb-chain',
            'rose-gold-celestial-drop-earrings',
            'for-her-solitaire-pendant',
            'men-figaro-hand-bracelet'
          ];
          this.products = liveProds.filter(p => p && p.id && !sampleProductIds.includes(p.id) && !p._sample && !p._demo);
          this._persist();
          this._notify({ products: true });
        }
      });
    } catch (err) {
      console.warn('Failed to sync products with Firestore:', err);
    }
  }

  addProduct(productData) {
    const slug = (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `${slug}-${Date.now()}`;
    const newProduct = {
      id,
      name: productData.name,
      tagline: productData.tagline || '18K Gold Finish · Sparkling Crystal Gemstones',
      category: productData.category || 'Necklaces',
      subcategory: productData.subcategory || 'Necklace',
      audience: productData.audience || 'her',
      price: Number(productData.price) || 299,
      originalPrice: Number(productData.originalPrice) || ((Number(productData.price) || 299) * 2),
      costPrice: Number(productData.costPrice) || Math.round((Number(productData.price) || 299) * 0.35),
      stockQty: Number(productData.stockQty) || 30,
      rating: Number(productData.rating) || 4.98,
      reviewsCount: Number(productData.reviewsCount) || Math.floor(25 + Math.random() * 80),
      badge: productData.badge || 'New Arrival',
      image: productData.image || '/images/imperial_necklace.jpg',
      galleryImages: productData.galleryImages || [productData.image || '/images/imperial_necklace.jpg'],
      servings: productData.servings || 'Adjustable Comfort Fit',
      description: productData.description || 'A stunning statement jewelry piece handcrafted with anti-fade mirror polish and sparkling simulated crystal stones.',
      highlights: Array.isArray(productData.highlights) ? productData.highlights : (
        productData.highlights ? productData.highlights.split(',').map(s => s.trim()).filter(Boolean) : [
          'Long-lasting mirror polish that will not fade',
          'Premium 18K gold / silver rhodium coat',
          'Hypoallergenic, lead-free and nickel-free (skin safe)',
          'Free luxury gift box included with every order'
        ]
      ),
      supplementFacts: {
        servingSize: 'Standard Adjustable Fit',
        servingsPerContainer: 'Daily & Festive Wear',
        ingredients: [
          { name: 'Base Metal', amount: 'Skin-Safe Hypoallergenic Alloy', dv: 'Safe' },
          { name: 'Plating', amount: 'Premium 18K Polish Coat', dv: 'Anti-Fade' },
          { name: 'Gems', amount: 'Brilliant Cut Crystal Stones', dv: 'Diamond Shine' }
        ]
      }
    };

    this.products.unshift(newProduct);
    this._persist();
    this._notify({ products: true });
    saveProductToDb(newProduct).catch(e => console.warn('Firestore add product:', e));
    return newProduct;
  }

  updateProduct(productId, updatedData) {
    const idx = this.products.findIndex(item => item.id === productId);
    if (idx > -1) {
      const parsedHighlights = Array.isArray(updatedData.highlights)
        ? updatedData.highlights
        : (updatedData.highlights ? updatedData.highlights.split(',').map(s => s.trim()).filter(Boolean) : this.products[idx].highlights);

      this.products[idx] = {
        ...this.products[idx],
        ...updatedData,
        subcategory: updatedData.subcategory || this.products[idx].subcategory || this.products[idx].category,
        highlights: parsedHighlights,
        image: updatedData.image || this.products[idx].image,
        galleryImages: Array.isArray(updatedData.galleryImages) && updatedData.galleryImages.length > 0
          ? updatedData.galleryImages
          : (updatedData.image ? [updatedData.image] : this.products[idx].galleryImages),
        price: Number(updatedData.price) || this.products[idx].price,
        originalPrice: Number(updatedData.originalPrice) || this.products[idx].originalPrice,
        costPrice: Number(updatedData.costPrice) || this.products[idx].costPrice,
        stockQty: updatedData.stockQty !== undefined ? Math.max(0, Number(updatedData.stockQty) || 0) : this.products[idx].stockQty
      };
      this._persist();
      this._notify({ products: true });
      saveProductToDb(this.products[idx]).catch(e => console.warn('Firestore update product:', e));
      return this.products[idx];
    }
  }

  updateProductStock(productId, newQty) {
    const p = this.products.find(item => item.id === productId);
    if (p) {
      p.stockQty = Math.max(0, Number(newQty) || 0);
      this._persist();
      this._notify({ products: true });
      saveProductToDb(p).catch(e => console.warn('Firestore update stock:', e));
      return p;
    }
  }

  deleteProduct(productId) {
    this.products = this.products.filter(item => item.id !== productId);
    this._persist();
    this._notify({ products: true });
    deleteProductFromDb(productId).catch(e => console.warn('Firestore delete product:', e));
  }

  toggleMobileMenu(open) {
    this.isMobileMenuOpen = open !== undefined ? open : !this.isMobileMenuOpen;
    this._notify({ mobileMenu: true, navbar: true });
  }

  setFirebaseUser(firebaseUser, firestoreData = null) {
    if (!firebaseUser) {
      this.user = null;
      this.isAdmin = false;
      if (this._unsubscribeOrders) { this._unsubscribeOrders(); this._unsubscribeOrders = null; }
      if (this._unsubscribeQueries) { this._unsubscribeQueries(); this._unsubscribeQueries = null; }
      localStorage.removeItem('valeora_user');
      localStorage.removeItem('valeora_is_admin');

      // Switch back to guest cart
      const guestCart = localStorage.getItem('valeora_cart_guest');
      this.cart = guestCart ? JSON.parse(guestCart) : [];
      this._persist();
      this._notify({ user: true, auth: true, navbar: true, cart: true });
      return;
    }

    const email = (firebaseUser.email || firestoreData?.email || '').toLowerCase();
    const isAdminUser = isAdminEmail(email) || firestoreData?.role === 'admin';
    this.isAdmin = isAdminUser;

    const rawName = firestoreData?.name || firebaseUser.displayName || (email ? email.split('@')[0] : 'Valued Patron');
    const displayName = isAdminUser ? 'Valeora Administrator' : rawName;
    const phone = firestoreData?.phone || firebaseUser.phoneNumber || '';
    const address = firestoreData?.address || '';
    const city = firestoreData?.city || '';
    const pincode = firestoreData?.pincode || '';
    const country = firestoreData?.country || 'India';

    this.user = {
      uid: firebaseUser.uid,
      name: displayName,
      email: email || 'patron@valeora.com',
      phone: phone,
      address: address,
      city: city,
      pincode: pincode,
      country: country,
      role: isAdminUser ? 'admin' : 'customer',
      membership: isAdminUser ? 'Administrator' : (firestoreData?.membership || 'Valeora Member'),
      memberSince: firestoreData?.memberSince || new Date().getFullYear().toString()
    };

    // Load user-specific cart from Firestore (for seamless cross-device syncing) or local fallback
    const userCartKey = `valeora_cart_${firebaseUser.uid}`;
    const savedUserCart = localStorage.getItem(userCartKey);
    if (firestoreData && Array.isArray(firestoreData.cart) && firestoreData.cart.length > 0) {
      this.cart = firestoreData.cart;
    } else if (savedUserCart) {
      this.cart = JSON.parse(savedUserCart);
    } else {
      this.cart = [];
    }

    this._persist();
    this.startFirestoreListeners();
    this._notify({ user: true, auth: true, navbar: true, cart: true });
  }

  startFirestoreListeners() {
    if (this._unsubscribeOrders) { this._unsubscribeOrders(); this._unsubscribeOrders = null; }
    if (this._unsubscribeQueries) { this._unsubscribeQueries(); this._unsubscribeQueries = null; }

    const targetUserId = this.isAdmin ? null : (this.user?.uid || null);
    const targetEmail = this.isAdmin ? null : (this.user?.email || null);

    // Live Order synchronization directly from Cloud Firestore (cross-device)
    this._unsubscribeOrders = subscribeToOrders((liveOrders) => {
      if (Array.isArray(liveOrders)) {
        this.orders = liveOrders;
        this._persist();
        this._notify({ orders: true });
      }
    }, targetUserId, targetEmail);

    // Live Customer Query synchronization directly from Cloud Firestore
    this._unsubscribeQueries = subscribeToQueries((liveQueries) => {
      if (Array.isArray(liveQueries)) {
        this.queries = liveQueries;
        this._persist();
        this._notify({ queries: true });
      }
    });
  }

  updateUserProfile(updates) {
    if (!this.user) return;
    this.user = {
      ...this.user,
      ...updates
    };

    // Update in registered users list as well
    const registered = JSON.parse(localStorage.getItem('valeora_registered_users') || '[]');
    const idx = registered.findIndex(u => u.email?.toLowerCase() === this.user.email?.toLowerCase());
    if (idx > -1) {
      registered[idx] = { ...registered[idx], ...this.user };
      localStorage.setItem('valeora_registered_users', JSON.stringify(registered));
    }

    if (this.user.uid) {
      saveUserDoc(this.user.uid, this.user);
    }

    this._persist();
    this._notify({ user: true });
    return this.user;
  }

  updateUserAddress(address, city, pincode, country) {
    if (!this.user) return;
    this.user.address = address;
    this.user.city = city;
    this.user.pincode = pincode;
    this.user.country = country || 'India';

    if (this.user.uid) {
      saveUserDoc(this.user.uid, {
        address,
        city,
        pincode,
        country: country || 'India'
      });
    }

    this._persist();
    this._notify({ user: true });
  }

  submitQuery({ subject, category, orderId, message, customerName, email }) {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const newQuery = {
      id: `QRY-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: this.user?.uid || null,
      customerName: customerName || this.user?.name || 'Valued Patron',
      email: email || this.user?.email || '',
      subject: subject || 'General Query',
      category: category || 'Order Assistance',
      orderId: orderId || null,
      message,
      date: formattedDate,
      status: "In Review",
      response: "",
      messages: [
        { sender: 'You', text: message, time: `${formattedDate} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}` }
      ]
    };

    this.queries.unshift(newQuery);
    this._persist();
    this._notify({ queries: true });

    saveQueryToDb(newQuery).then(docId => {
      if (docId) newQuery.firestoreId = docId;
    }).catch(e => console.warn('Firestore query save:', e));

    return newQuery;
  }

  addQueryMessage(queryId, text, sender = 'You') {
    const q = (this.queries || []).find(item => item.id === queryId || item.firestoreId === queryId);
    if (!q) return null;
    const now = new Date();
    const timeFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (!q.messages || !Array.isArray(q.messages)) {
      q.messages = [];
      if (q.message) {
        q.messages.push({ sender: 'You', text: q.message, time: q.date ? `${q.date} 10:00` : timeFormatted });
      }
      if (q.response) {
        q.messages.push({ sender: 'Valeora Concierge', text: q.response, time: timeFormatted });
      }
    }

    q.messages.push({ sender, text, time: timeFormatted });
    if (sender === 'You') {
      q.status = 'In Review';
    } else {
      q.status = 'Answered';
      q.response = text;
    }
    this._persist();
    this._notify({ queries: true });

    // Sync to Firestore
    updateQueryInDb(q.firestoreId || q.id, {
      messages: q.messages,
      status: q.status,
      response: q.response || ''
    }).catch(e => console.warn('Firestore update message:', e));

    return q;
  }

  deleteQuery(queryId) {
    this.queries = (this.queries || []).filter(q => q.id !== queryId && q.firestoreId !== queryId);
    this._persist();
    this._notify({ queries: true });
  }

  updateQueryStatus(queryId, newStatus) {
    const q = (this.queries || []).find(item => item.id === queryId || item.firestoreId === queryId);
    if (!q) return null;
    q.status = newStatus;
    const statusLower = (newStatus || '').toLowerCase();
    if (statusLower === 'resolved' || statusLower === 'closed') {
      q.resolvedAt = q.resolvedAt || Date.now();
    } else {
      delete q.resolvedAt;
    }
    this._persist();
    this._notify({ queries: true });

    updateQueryInDb(q.firestoreId || q.id, {
      status: newStatus,
      resolvedAt: q.resolvedAt || null
    }).catch(e => console.warn('Firestore update status:', e));

    return q;
  }

  cleanExpiredResolvedQueries() {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const initialLen = (this.queries || []).length;

    this.queries = (this.queries || []).filter(q => {
      const statusLower = (q.status || '').toLowerCase();
      const isResolved = statusLower === 'resolved' || statusLower === 'closed';
      if (!isResolved) return true;

      // 1. If explicit resolvedAt timestamp is saved
      if (q.resolvedAt) {
        const elapsed = now - Number(q.resolvedAt);
        return elapsed < ONE_DAY_MS;
      }

      // 2. If query date exists in DD/MM/YYYY format
      if (q.date) {
        try {
          const parts = q.date.split('/');
          if (parts.length === 3) {
            const qDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
            if (!isNaN(qDate.getTime())) {
              const elapsed = now - qDate.getTime();
              // If older than 1 day (24 hours), auto delete
              return elapsed < ONE_DAY_MS;
            }
          }
        } catch (e) { }
      }

      return true;
    });

    if (this.queries.length !== initialLen) {
      this._persist();
    }
  }

  addToCart(product, purchaseType = 'standard', qty = 1) {
    const idx = this.cart.findIndex(i => i.id === product.id);
    const unitPrice = product.price;
    if (idx > -1) {
      this.cart[idx].qty += qty;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        tagline: product.tagline,
        image: product.image,
        unitPrice,
        costPrice: product.costPrice || unitPrice * 0.4,
        purchaseType,
        qty
      });
    }
    this.isCartOpen = true;
    this._notify({ cart: true });
  }

  updateCartQty(id, purchaseType, qty) {
    const idx = this.cart.findIndex(i => i.id === id);
    if (idx > -1) {
      if (qty <= 0) this.cart.splice(idx, 1);
      else this.cart[idx].qty = qty;
      this._notify({ cart: true });
    }
  }

  removeCartItem(id, purchaseType) {
    this.cart = this.cart.filter(i => i.id !== id);
    this._notify({ cart: true });
  }

  clearCart() {
    this.cart = [];
    this._notify({ cart: true });
  }

  getCartSubtotal() {
    return this.cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  }

  getCartDiscount() {
    if (!this.appliedCoupon) return 0;
    const subtotal = this.getCartSubtotal();
    const minReq = Number(this.appliedCoupon.minAmount) || 0;
    if (subtotal < minReq) return 0;
    const percent = Number(this.appliedCoupon.discountPercent) || 0;
    return Math.round((subtotal * percent) / 100);
  }

  getCartShipping() {
    const sub = this.getCartSubtotal();
    if (sub === 0) return 0;
    return sub >= this.freeDeliveryThreshold ? 0 : this.standardShippingFee;
  }

  getCartTotal() {
    const sub = this.getCartSubtotal();
    if (sub === 0) return 0;
    const discount = this.getCartDiscount();
    const netSubtotal = Math.max(0, sub - discount);
    return netSubtotal + this.getCartShipping();
  }

  initCouponsSync() {
    try {
      this._unsubscribeCoupons = subscribeToCoupons((liveCoupons) => {
        if (Array.isArray(liveCoupons) && liveCoupons.length > 0) {
          this.coupons = liveCoupons;
          if (this.appliedCoupon) {
            const matched = this.coupons.find(c => c.code === this.appliedCoupon.code && c.active);
            if (!matched) {
              this.appliedCoupon = null;
              this.discountPercent = 0;
            } else {
              this.appliedCoupon = matched;
              this.discountPercent = matched.discountPercent;
            }
          }
          this._persist();
          this._notify({ coupons: true, cart: true });
        }
      });
      seedCouponsIfEmpty(DEFAULT_COUPONS);
    } catch (err) {
      console.warn('Coupons sync initialization error:', err);
    }
  }

  addCoupon(couponData) {
    const code = (couponData.code || '').trim().toUpperCase();
    if (!code) return { success: false, message: 'Coupon code is required.' };
    const id = `coupon-${code.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
    const newCoupon = {
      id,
      code,
      discountPercent: Math.min(100, Math.max(1, Number(couponData.discountPercent) || 10)),
      minAmount: Math.max(0, Number(couponData.minAmount) || 0),
      description: couponData.description || `${couponData.discountPercent}% OFF on orders above ₹${couponData.minAmount}`,
      active: couponData.active !== undefined ? couponData.active : true,
      usesCount: Number(couponData.usesCount) || 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const existingIdx = this.coupons.findIndex(c => (c.code || '').toUpperCase() === code);
    if (existingIdx >= 0) {
      this.coupons[existingIdx] = { ...this.coupons[existingIdx], ...newCoupon };
    } else {
      this.coupons.unshift(newCoupon);
    }

    this._persist();
    this._notify({ coupons: true, cart: true });

    saveCouponToDb(newCoupon).catch(e => console.warn('Firestore coupon write:', e));
    return { success: true, coupon: newCoupon };
  }

  updateCoupon(couponId, updates) {
    const idx = this.coupons.findIndex(c => c.id === couponId);
    if (idx >= 0) {
      this.coupons[idx] = { ...this.coupons[idx], ...updates };
      if (this.appliedCoupon && this.appliedCoupon.id === couponId) {
        if (updates.active === false) {
          this.appliedCoupon = null;
          this.discountPercent = 0;
        } else {
          this.appliedCoupon = { ...this.appliedCoupon, ...updates };
          this.discountPercent = this.appliedCoupon.discountPercent || 0;
        }
      }
      this._persist();
      this._notify({ coupons: true, cart: true });
      updateCouponInDb(couponId, updates).catch(e => console.warn('Firestore coupon update:', e));
      return true;
    }
    return false;
  }

  deleteCoupon(couponId) {
    this.coupons = this.coupons.filter(c => c.id !== couponId);
    if (this.appliedCoupon && this.appliedCoupon.id === couponId) {
      this.appliedCoupon = null;
      this.discountPercent = 0;
      this.couponFeedback = null;
    }
    this._persist();
    this._notify({ coupons: true, cart: true });
    deleteCouponFromDb(couponId).catch(e => console.warn('Firestore coupon delete:', e));
    return true;
  }

  applyCoupon(rawCode) {
    const code = (rawCode || '').trim().toUpperCase();
    if (!code) {
      this.couponFeedback = { type: 'error', message: 'Please enter a coupon code.' };
      this._notify({ cart: true });
      return { success: false, message: 'Please enter a coupon code.' };
    }

    const coupon = (this.coupons || []).find(c => (c.code || '').toUpperCase() === code);
    if (!coupon || coupon.active === false) {
      this.couponFeedback = { type: 'error', message: `Coupon "${code}" is invalid or expired.` };
      this._notify({ cart: true });
      return { success: false, message: `Coupon "${code}" is invalid or expired.` };
    }

    const subtotal = this.getCartSubtotal();
    const minRequired = Number(coupon.minAmount) || 0;

    if (subtotal < minRequired) {
      const shortfall = minRequired - subtotal;
      this.couponFeedback = {
        type: 'shortfall',
        code: coupon.code,
        shortfall,
        minAmount: minRequired,
        discountPercent: coupon.discountPercent,
        message: `Add ₹${shortfall} more to apply ${coupon.code} (${coupon.discountPercent}% OFF · Min order ₹${minRequired})`
      };
      this._notify({ cart: true });
      return {
        success: false,
        isShortfall: true,
        shortfall,
        minAmount: minRequired,
        code: coupon.code,
        message: this.couponFeedback.message
      };
    }

    // Success: Apply coupon
    this.appliedCoupon = coupon;
    this.discountPercent = Number(coupon.discountPercent) || 0;
    const discountAmount = Math.round((subtotal * this.discountPercent) / 100);
    this.couponFeedback = {
      type: 'success',
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount,
      message: `🎉 Coupon ${coupon.code} applied! You save ₹${discountAmount} (${coupon.discountPercent}% OFF)`
    };

    this._persist();
    this._notify({ cart: true, checkout: true });
    return { success: true, coupon, discountAmount, message: this.couponFeedback.message };
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.discountPercent = 0;
    this.couponFeedback = null;
    this._persist();
    this._notify({ cart: true, checkout: true });
  }

  getCartCount() {
    return this.cart.reduce((s, i) => s + i.qty, 0);
  }

  toggleCart(open) {
    this.isCartOpen = open !== undefined ? open : !this.isCartOpen;
    this._notify({ cart: true });
  }

  toggleAuthModal(open) {
    this.isAuthOpen = open !== undefined ? open : !this.isAuthOpen;
    this._notify({ auth: true });
  }

  toggleCheckoutModal(open) {
    this.isCheckoutOpen = open !== undefined ? open : !this.isCheckoutOpen;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isCheckoutOpen ? 'hidden' : '';
    }
    this._notify({ checkout: true });
  }

  openPolicyModal(policyType) {
    this.policyModalType = policyType;
    this._notify({ policy: true });
  }

  closePolicyModal() {
    this.policyModalType = null;
    this._notify({ policy: true });
  }

  setQuickViewProduct(product) {
    this.quickViewProduct = product;
    this._notify({ quickview: true });
  }

  checkout(customerDetails) {
    if (this.cart.length === 0) return null;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const discountAmount = this.getCartDiscount();
    const newOrder = {
      id: `VAL-${Math.floor(1000 + Math.random() * 9000)}-2026`,
      userId: this.user?.uid || null,
      customerName: customerDetails.customerName,
      email: customerDetails.email,
      phone: customerDetails.phone,
      address: customerDetails.address,
      date: formattedDate,
      status: "Confirmed",
      paymentMethod: customerDetails.paymentMethod || 'Razorpay Online',
      paidAmount: customerDetails.paidAmount !== undefined ? customerDetails.paidAmount : this.getCartTotal(),
      codAmount: customerDetails.codAmount !== undefined ? customerDetails.codAmount : 0,
      razorpayPaymentId: customerDetails.razorpayPaymentId || null,
      items: [...this.cart],
      couponCode: this.appliedCoupon?.code || null,
      discountAmount,
      shipping: this.getCartShipping(),
      total: this.getCartTotal()
    };

    // Increment coupon uses count if used
    if (this.appliedCoupon && this.appliedCoupon.id) {
      this.updateCoupon(this.appliedCoupon.id, {
        usesCount: (this.appliedCoupon.usesCount || 0) + 1
      });
    }

    this.orders.unshift(newOrder);
    this.clearCart();
    this.removeCoupon();
    this.isCheckoutOpen = false;
    this._notify({ orders: true, cart: true });

    // Persist order to Cloud Firestore
    createOrder(newOrder).then(firestoreId => {
      if (firestoreId) {
        newOrder.firestoreId = firestoreId;
        this._persist();
      }
    }).catch(err => {
      console.warn('Firestore order write error:', err);
    });

    return newOrder;
  }

  updateOrderStatus(orderId, newStatus, trackingId = '') {
    const ord = (this.orders || []).find(o => o.id === orderId || o.firestoreId === orderId);
    if (ord) {
      ord.status = newStatus;
      if (trackingId) ord.trackingId = trackingId;
      this._persist();
      this._notify({ orders: true });
    }
    // Update live in Cloud Firestore
    updateOrderStatusInDb(orderId, newStatus, trackingId).catch(err => {
      console.warn('Firestore update order status error:', err);
    });
  }

  register(name, email, phone, password) {
    const newUser = {
      name: name || 'Valued Member',
      email: email,
      phone: phone || '',
      address: '',
      city: '',
      pincode: '',
      country: 'India',
      membership: 'Valeora Atelier Patron',
      memberSince: new Date().getFullYear().toString()
    };

    // Save to user store
    const registered = JSON.parse(localStorage.getItem('valeora_registered_users') || '[]');
    const existingIndex = registered.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingIndex > -1) {
      registered[existingIndex] = { ...registered[existingIndex], ...newUser, password };
    } else {
      registered.push({ ...newUser, password });
    }
    localStorage.setItem('valeora_registered_users', JSON.stringify(registered));

    this.user = newUser;
    this.isAuthOpen = false;
    this._persist();
    this._notify({ auth: true, navbar: true, user: true });
    return { success: true, user: newUser };
  }

  login(email, password, fallbackName = null) {
    const cleanEmail = (email || '').toLowerCase();
    const isAdminUser = isAdminEmail(cleanEmail);
    this.isAdmin = isAdminUser;

    const registered = JSON.parse(localStorage.getItem('valeora_registered_users') || '[]');
    const found = registered.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

    const displayName = isAdminUser ? 'Valeora Administrator' : (found?.name || fallbackName || (email ? email.split('@')[0] : 'Valued Patron'));

    this.user = {
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email: email || 'patron@valeora.com',
      phone: found?.phone || '',
      address: found?.address || '',
      city: found?.city || '',
      pincode: found?.pincode || '',
      country: found?.country || 'India',
      membership: isAdminUser ? 'Administrator' : 'Valeora Atelier Patron',
      memberSince: found?.memberSince || new Date().getFullYear().toString()
    };

    this.isAuthOpen = false;
    this._persist();
    this._notify({ auth: true, navbar: true, user: true });
    return { success: true, user: this.user, isAdmin: this.isAdmin };
  }

  forgotPassword(email) {
    return { success: true, message: `Password reset instructions have been sent to ${email}` };
  }

  async logout() {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Firebase logout error:', e);
    }
    this.user = null;
    this.isAdmin = false;
    if (this._unsubscribeOrders) { this._unsubscribeOrders(); this._unsubscribeOrders = null; }
    if (this._unsubscribeQueries) { this._unsubscribeQueries(); this._unsubscribeQueries = null; }
    localStorage.removeItem('valeora_user');
    localStorage.removeItem('valeora_is_admin');

    // Switch to clean guest cart and route to home
    const guestCart = localStorage.getItem('valeora_cart_guest');
    this.cart = guestCart ? JSON.parse(guestCart) : [];
    this.setRoute('home');
    this._persist();
    this._notify({ auth: true, navbar: true, user: true, route: true, cart: true });
  }
}

export const state = new AppState();
