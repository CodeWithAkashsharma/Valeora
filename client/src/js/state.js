import { PRODUCTS } from './productsData.js';

// ============================================================
// AURITE CENTRAL REACTIVE STATE & ADMIN STORE
// ============================================================
class AppState {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('aurite_cart') || '[]');
    
    const rawUser = JSON.parse(localStorage.getItem('aurite_user') || 'null');
    this.user = rawUser ? {
      name: rawUser.name || 'Alex Mercer',
      email: rawUser.email || 'alex@example.com',
      phone: rawUser.phone || '+91 98765 43210',
      address: rawUser.address || 'Flat 402, Green Glen Heights, HSR Layout',
      city: rawUser.city || 'Mumbai',
      pincode: rawUser.pincode || '400001',
      country: rawUser.country || 'India',
      membership: 'Aurite Member',
      memberSince: rawUser.memberSince || '2026'
    } : null;

    this.isAdmin = JSON.parse(localStorage.getItem('aurite_is_admin') || 'false');

    // Products synced with local storage or initial PRODUCTS
    this.products = JSON.parse(localStorage.getItem('aurite_products') || 'null');
    if (!this.products || !Array.isArray(this.products) || this.products.length === 0) {
      this.products = [...PRODUCTS];
    }
    // Ensure every product has rich multiple gallery images
    this.products.forEach(p => {
      if (!p.images || !Array.isArray(p.images) || p.images.length <= 1) {
        if (p.id === 'omega-3-triple') {
          p.images = ["/images/omega3.jpg", "/images/science_capsule.jpg", "/images/hero_banner.jpg", "/images/greens.jpg"];
        } else if (p.id === 'magnesium-complex') {
          p.images = ["/images/magnesium.jpg", "/images/science_capsule.jpg", "/images/hero_banner.jpg", "/images/omega3.jpg"];
        } else if (p.id === 'daily-greens') {
          p.images = ["/images/greens.jpg", "/images/science_capsule.jpg", "/images/hero_banner.jpg", "/images/magnesium.jpg"];
        } else {
          p.images = [p.image || "/images/science_capsule.jpg", "/images/greens.jpg", "/images/hero_banner.jpg", "/images/omega3.jpg"];
        }
      }
      if (!p.highlights || !p.highlights.length) {
        p.highlights = ["100% Lab Tested & Verified", "Micro-Encapsulated Bio-Delivery", "Zero Artificial Additives", "Certified Pure & Heavy-Metal Free"];
      }
    });

    // Orders
    this.orders = JSON.parse(localStorage.getItem('aurite_orders') || JSON.stringify([
      {
        id: "AUR-9481-2026",
        customerName: "Alex Mercer",
        email: "alex@example.com",
        phone: "+91 98765 43210",
        address: "742 Evergreen Terrace, Mumbai, 400001",
        date: "2026-08-05",
        status: "Processing",
        items: [
          { id: "omega-3-triple", name: "Aurite Omega-3 Triple Strength", qty: 2, unitPrice: 3999, costPrice: 1200 },
          { id: "magnesium-complex", name: "Aurite Magnesium Complex", qty: 1, unitPrice: 2999, costPrice: 850 }
        ],
        total: 10997
      },
      {
        id: "AUR-8920-2026",
        customerName: "Dr. Marcus Vance",
        email: "marcus@cardiology.org",
        phone: "+91 98123 45678",
        address: "12 Healthcare Enclave, New Delhi, 110001",
        date: "2026-08-02",
        status: "Delivered",
        items: [
          { id: "omega-3-triple", name: "Aurite Omega-3 Triple Strength", qty: 5, unitPrice: 3999, costPrice: 1200 }
        ],
        total: 19995
      }
    ]));

    // Customer Support Queries / Live Chat System (Separated from Return/Refund)
    this.queries = JSON.parse(localStorage.getItem('aurite_queries') || JSON.stringify([
      {
        id: "QRY-101",
        customerName: "Siddharth Malhotra",
        email: "siddharth@gmail.com",
        subject: "Dosage query for Magnesium Bisglycinate",
        message: "Hi, I take this before sleep. Can I combine it with warm milk or should I take it with water?",
        date: "2026-08-06 14:20",
        status: "Answered",
        replies: [
          { sender: "Admin", text: "Hello Siddharth! You can safely take it with warm milk or water 30 minutes before sleep.", time: "2026-08-06 15:05" }
        ]
      },
      {
        id: "QRY-102",
        customerName: "Priya Sharma",
        email: "priya.s@techcorp.io",
        subject: "Order shipment tracking #AUR-9481",
        message: "When will my order arrive in Mumbai?",
        date: "2026-08-07 10:15",
        status: "Open",
        replies: []
      }
    ]));

    // Return & Refund System with dedicated Chat Thread
    this.returns = JSON.parse(localStorage.getItem('aurite_returns') || JSON.stringify([
      {
        id: "RET-701",
        orderId: "AUR-8920-2026",
        productId: "omega-3-triple",
        productName: "Aurite Omega-3 Triple Strength",
        customerName: "Dr. Marcus Vance",
        email: "marcus@cardiology.org",
        phone: "+91 98123 45678",
        reason: "Damaged Outer Packaging / Broken Seal",
        details: "Two bottles had compromised security seals on delivery. Requesting replacement or refund for ₹19,995.",
        amount: 19995,
        status: "Under Review",
        date: "2026-08-06",
        chat: [
          { sender: "Customer", text: "Two bottles had compromised security seals on delivery. Requesting replacement or refund for ₹19,995.", time: "2026-08-06 14:20" },
          { sender: "Admin", text: "Hello Dr. Vance! Thank you for informing us. We apologize for the courier transit issue. Our returns department is reviewing your request.", time: "2026-08-06 15:05" }
        ]
      }
    ]));

    // Customer Reviews
    this.reviews = JSON.parse(localStorage.getItem('aurite_reviews') || JSON.stringify([
      {
        id: "REV-001",
        productId: "omega-3-triple",
        orderId: "AUR-8920-2026",
        customerName: "Dr. Marcus Vance",
        rating: 5,
        text: "Outstanding formulation. The enteric shielding completely eliminates the fishy aftertaste common with other brands. My triglyceride levels have improved significantly.",
        date: "2026-08-04"
      },
      {
        id: "REV-002",
        productId: "magnesium-complex",
        orderId: "AUR-9481-2026",
        customerName: "Alex Mercer",
        rating: 4,
        text: "Very effective for muscle recovery after intense workouts. The capsules are a bit large but the bio-availability is definitely noticeable.",
        date: "2026-08-06"
      }
    ]));

    // Registered Users Management & Access Control
    this.users = JSON.parse(localStorage.getItem('aurite_users') || JSON.stringify([
      {
        id: "USR-101",
        name: "Alex Mercer",
        email: "alex@example.com",
        phone: "+91 98765 43210",
        address: "742 Evergreen Terrace, Mumbai, 400001",
        joinedDate: "2026-01-15",
        isBlocked: false,
        ordersCount: 3,
        totalSpent: 28494
      },
      {
        id: "USR-102",
        name: "Dr. Marcus Vance",
        email: "marcus@cardiology.org",
        phone: "+91 98123 45678",
        address: "12 Healthcare Enclave, New Delhi, 110001",
        joinedDate: "2026-03-22",
        isBlocked: false,
        ordersCount: 2,
        totalSpent: 39990
      },
      {
        id: "USR-103",
        name: "Priya Sharma",
        email: "priya.s@techcorp.io",
        phone: "+91 98450 11223",
        address: "88 Cyber City Heights, Bangalore, 560001",
        joinedDate: "2026-05-10",
        isBlocked: false,
        ordersCount: 1,
        totalSpent: 4499
      }
    ]));

    this.currentRoute = 'home';
    this.isCartOpen = false;
    this.isAuthOpen = false;
    this.isCheckoutOpen = false;
    this.quickViewProduct = null;
    this.couponCode = null;
    this.discountPercent = 0;

    this._changeFlags = {};
    this._listeners = new Set();
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

  _persist() {
    localStorage.setItem('aurite_cart', JSON.stringify(this.cart));
    localStorage.setItem('aurite_user', JSON.stringify(this.user));
    localStorage.setItem('aurite_is_admin', JSON.stringify(this.isAdmin));
    localStorage.setItem('aurite_products', JSON.stringify(this.products));
    localStorage.setItem('aurite_orders', JSON.stringify(this.orders));
    localStorage.setItem('aurite_queries', JSON.stringify(this.queries));
    localStorage.setItem('aurite_returns', JSON.stringify(this.returns));
    localStorage.setItem('aurite_reviews', JSON.stringify(this.reviews));
    localStorage.setItem('aurite_users', JSON.stringify(this.users));
  }

  updateUserAddress(address, city, pincode, country) {
    if (!this.user) return;
    this.user.address = address;
    this.user.city = city;
    this.user.pincode = pincode;
    this.user.country = country || 'India';
    const existing = (this.users || []).find(u => u.email === this.user.email);
    if (existing) {
      existing.address = `${address}, ${city} - ${pincode}, ${country || 'India'}`;
    }
    this._persist();
    this._notify({ user: true });
  }

  // ---- Registered Users & Access Management ----
  toggleBlockUser(userId) {
    const u = (this.users || []).find(item => item.id === userId);
    if (u) {
      u.isBlocked = !u.isBlocked;
      // If currently logged-in user is blocked, force logout
      if (this.user && this.user.email === u.email && u.isBlocked) {
        this.user = null;
      }
      this._notify({ users: true, user: true });
      return u;
    }
    return null;
  }

  // ---- Admin Methods ----
  loginAdmin(email, password) {
    if ((email === 'admin@aurite.com' || email === 'admin') && password === 'admin123') {
      this.isAdmin = true;
      this._notify({ admin: true, navbar: true });
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin Email or Password' };
  }

  logoutAdmin() {
    this.isAdmin = false;
    this._notify({ admin: true, navbar: true });
  }

  addProduct(newProd) {
    this.products.unshift(newProd);
    this._notify({ products: true });
  }

  updateProduct(id, updatedFields) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx > -1) {
      this.products[idx] = { ...this.products[idx], ...updatedFields };
      this._notify({ products: true });
    }
  }

  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this._notify({ products: true });
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this._notify({ orders: true });
    }
  }

  addCustomerQuery(customerName, email, subject, message) {
    const q = {
      id: `QRY-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      email,
      subject,
      message,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: "Open",
      replies: []
    };
    this.queries.unshift(q);
    this._notify({ queries: true });
  }

  replyToQuery(queryId, replyMessage) {
    const q = this.queries.find(item => item.id === queryId);
    if (q) {
      q.replies.push({
        sender: "Admin",
        text: replyMessage,
        time: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
      q.status = "Answered";
      this._notify({ queries: true });
    }
  }

  requestReturn(orderId, productId, productName, reason, details, amount, phone) {
    const retId = `RET-${Math.floor(100 + Math.random() * 900)}`;
    const custName = this.user ? this.user.name : "Valued Customer";
    const custEmail = this.user ? this.user.email : "customer@aurite.com";
    const custPhone = phone || (this.user ? this.user.phone : "+91 98765 43210");

    const newReturn = {
      id: retId,
      orderId,
      productId,
      productName,
      customerName: custName,
      email: custEmail,
      phone: custPhone,
      reason,
      details,
      amount: amount || 0,
      status: "Requested",
      date: new Date().toISOString().substring(0, 10),
      chat: [
        {
          sender: "Customer",
          text: `Return & Refund Request submitted for Order #${orderId} (${productName}).\nReason: ${reason}\nDetails: ${details}\nRefund Amount: ₹${Number(amount).toLocaleString('en-IN')}`,
          time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        },
        {
          sender: "Admin",
          text: `Your request #${retId} has been received. Our returns team will inspect the details and update the decision here. You can discuss the issue with us right here in this chat!`,
          time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]
    };

    if (!this.returns) this.returns = [];
    this.returns.unshift(newReturn);

    this._notify({ returns: true, orders: true });
    return { returnId: retId };
  }

  replyToReturnChat(returnId, text, sender = "Admin") {
    const ret = (this.returns || []).find(r => r.id === returnId);
    if (ret) {
      if (!ret.chat) ret.chat = [];
      ret.chat.push({
        sender,
        text,
        time: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
      this._notify({ returns: true });
    }
  }

  updateReturnStatus(returnId, newStatus, adminNote = "") {
    const ret = (this.returns || []).find(r => r.id === returnId);
    if (ret) {
      ret.status = newStatus;
      if (!ret.chat) ret.chat = [];
      ret.chat.push({
        sender: "Admin",
        text: `Status updated to "${newStatus}". ${adminNote ? adminNote : 'Action has been recorded by our returns department.'}`,
        time: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
      this._notify({ returns: true });
    }
  }

  updateUserPhone(newPhone) {
    if (!this.user) {
      this.user = { name: 'Alex Mercer', email: 'alex@example.com', membership: 'Aurite Member', memberSince: '2026' };
    }
    this.user.phone = newPhone;
    this._notify({ user: true });
  }

  addReview(productId, orderId, rating, text, customerName) {
    const review = {
      id: `REV-${Math.floor(100 + Math.random() * 900)}`,
      productId,
      orderId,
      customerName,
      rating,
      text,
      date: new Date().toISOString().substring(0, 10)
    };
    this.reviews.unshift(review);
    
    // Update product rating and reviewsCount
    const product = this.products.find(p => p.id === productId);
    if (product) {
      const pReviews = this.reviews.filter(r => r.productId === productId);
      const totalRating = pReviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = (totalRating / pReviews.length).toFixed(1);
      product.reviewsCount = pReviews.length;
    }
    this._notify({ reviews: true, products: true });
  }

  getAnalytics() {
    let totalRevenue = 0;
    let totalCost = 0;

    this.orders.forEach(order => {
      totalRevenue += (order.total || 0);
      (order.items || []).forEach(item => {
        const prod = this.products.find(p => p.id === item.id || p.name === item.name);
        const unitCost = (item.costPrice !== undefined && item.costPrice > 0) ? item.costPrice : (prod && prod.costPrice ? prod.costPrice : (item.unitPrice || 1000) * 0.35);
        totalCost += unitCost * (item.qty || 1);
      });
    });

    if (totalCost === 0 && totalRevenue > 0) {
      totalCost = Math.round(totalRevenue * 0.35);
    }

    const netProfit = Math.max(0, totalRevenue - totalCost);
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0';
    const lowStockCount = this.products.filter(p => (p.stockQty || 0) < 15).length;

    return {
      totalRevenue,
      totalCost,
      netProfit,
      profitMargin,
      totalOrders: this.orders.length,
      lowStockCount
    };
  }

  // ---- Cart ----
  addToCart(product, purchaseType = 'one-time', qty = 1) {
    const idx = this.cart.findIndex(i => i.id === product.id && i.purchaseType === purchaseType);
    const unitPrice = purchaseType === 'subscription' ? product.subscribePrice : product.price;
    if (idx > -1) {
      this.cart[idx].qty += qty;
    } else {
      this.cart.push({ id: product.id, name: product.name, tagline: product.tagline, image: product.image, unitPrice, costPrice: product.costPrice || unitPrice * 0.35, purchaseType, qty });
    }
    this.isCartOpen = true;
    this._notify({ cart: true });
  }

  updateCartQty(id, purchaseType, qty) {
    const idx = this.cart.findIndex(i => i.id === id && i.purchaseType === purchaseType);
    if (idx > -1) {
      if (qty <= 0) this.cart.splice(idx, 1);
      else this.cart[idx].qty = qty;
      this._notify({ cart: true });
    }
  }

  removeCartItem(id, purchaseType) {
    this.cart = this.cart.filter(i => !(i.id === id && i.purchaseType === purchaseType));
    this._notify({ cart: true });
  }

  clearCart() {
    this.cart = [];
    this._notify({ cart: true });
  }

  getCartSubtotal() {
    return this.cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  }

  getCartTotal() {
    const sub = this.getCartSubtotal();
    return Math.max(0, sub - (sub * this.discountPercent) / 100);
  }

  getCartCount() {
    return this.cart.reduce((s, i) => s + i.qty, 0);
  }

  toggleCart(open) {
    this.isCartOpen = open !== undefined ? open : !this.isCartOpen;
    this._notify({ cart: true });
  }

  setCartOpen(open) {
    this.toggleCart(open);
  }

  toggleAuthModal(open) {
    this.isAuthOpen = open !== undefined ? open : !this.isAuthOpen;
    this._notify({ auth: true });
  }

  toggleCheckout(open) {
    this.isCheckoutOpen = open !== undefined ? open : !this.isCheckoutOpen;
    this._notify({ checkout: true });
  }

  setQuickView(product) {
    this.quickViewProduct = product;
    this._notify({ quickview: true });
  }

  // ---- User Auth & Access Control ----
  login(email, name, password) {
    if ((email === 'admin@aurite.com' || email === 'admin') && (password === 'admin123' || !password)) {
      this.isAdmin = true;
      this.user = { email: 'admin@aurite.com', name: 'Admin Administrator', membership: 'Executive Admin', memberSince: '2026' };
      this.isAuthOpen = false;
      this._notify({ auth: true, admin: true, navbar: true });
      return { success: true, isAdmin: true };
    }

    // Check if account is suspended / blocked by Admin
    const existingAccount = (this.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingAccount && existingAccount.isBlocked) {
      return { success: false, blocked: true, message: 'Your account has been suspended by administration. Please contact support.' };
    }

    this.isAdmin = false;
    this.user = {
      email,
      name: (existingAccount && existingAccount.name) ? existingAccount.name : (name || 'Alex Mercer'),
      phone: (existingAccount && existingAccount.phone) ? existingAccount.phone : '+91 98765 43210',
      address: (existingAccount && existingAccount.address) ? existingAccount.address : '742 Evergreen Terrace, Mumbai',
      membership: 'Aurite Member',
      memberSince: '2026'
    };

    // If new user, add to directory
    if (!existingAccount) {
      if (!this.users) this.users = [];
      this.users.unshift({
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        address: this.user.address,
        joinedDate: new Date().toISOString().substring(0, 10),
        isBlocked: false,
        ordersCount: 0,
        totalSpent: 0
      });
    }

    this.isAuthOpen = false;
    this._notify({ auth: true, navbar: true, users: true });
    return { success: true, isAdmin: false };
  }

  register(name, email, phone, password) {
    const existingAccount = (this.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingAccount && existingAccount.isBlocked) {
      return { success: false, blocked: true, message: 'This email account is suspended. Please contact support.' };
    }

    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: name || 'Alex Mercer',
      email,
      phone: phone || '+91 98765 43210',
      address: '742 Evergreen Terrace, Mumbai, 400001',
      joinedDate: new Date().toISOString().substring(0, 10),
      isBlocked: false,
      ordersCount: 0,
      totalSpent: 0
    };

    if (!this.users) this.users = [];
    if (!existingAccount) this.users.unshift(newUser);

    this.user = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      membership: 'Aurite Member',
      memberSince: '2026'
    };

    this.isAdmin = false;
    this.isAuthOpen = false;
    this._notify({ auth: true, navbar: true, users: true });
    return { success: true };
  }

  logout() {
    this.user = null;
    this.isAdmin = false;
    localStorage.removeItem('aurite_user');
    localStorage.removeItem('aurite_is_admin');
    this._persist();
    this._notify({ auth: true, navbar: true, user: true, route: true });
  }
}

export const state = new AppState();
