import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { compressDataUrlIfNeeded } from './imageOptimizer.js';

// Official Valeora Firebase Configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBNxtNcdxFhlEXl9wCzf973GZAITQZ8f6I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "valeora.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "valeora",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "valeora.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "242897256968",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:242897256968:web:cd3324f0f6e812e610c7bd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7FE7LG15TN"
};

// Initialize Firebase Core Services
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ==========================================
// 1. AUTHENTICATION SERVICES
// ==========================================

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

export function isAdminEmail(email) {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  return e === 'admin@valeora.com' || e === 'valeora.shop@gmail.com' || e.startsWith('admin@');
}

/**
 * Check if a user account exists in Firestore for a given email address
 */
export async function checkUserExistsByEmail(email) {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  try {
    const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
    const snap = await getDocs(q);
    if (!snap.empty) return true;
  } catch (err) {
    console.warn('Check user exists in Firestore error:', err);
  }
  return false;
}

/**
 * Register new user with Email, Password & details
 */
export async function registerWithEmail(email, password, name, phone = '') {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
  }
  // Store user profile in Firestore
  const isAdmin = isAdminEmail(email);
  try {
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      name: name || email.split('@')[0],
      email: email.trim(),
      phone: phone || '',
      role: isAdmin ? 'admin' : 'customer',
      membership: isAdmin ? 'Administrator' : 'Valeora Atelier Patron',
      memberSince: new Date().getFullYear().toString(),
      createdAt: serverTimestamp()
    }, { merge: true });
  } catch (firestoreErr) {
    console.warn('Firestore profile write warning (auth succeeded):', firestoreErr);
  }

  return cred.user;
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;
  const isAdmin = isAdminEmail(user.email);

  // Save or update user profile document
  try {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: user.displayName || 'Valued Patron',
      email: user.email,
      photoURL: user.photoURL || '',
      role: isAdmin ? 'admin' : 'customer',
      membership: isAdmin ? 'Administrator' : 'Valeora Atelier Patron',
      lastLogin: serverTimestamp()
    }, { merge: true });
  } catch (firestoreErr) {
    console.warn('Firestore Google user profile write warning (auth succeeded):', firestoreErr);
  }

  return user;
}

/**
 * Send password reset email
 */
export async function resetUserPassword(email) {
  return sendPasswordResetEmail(auth, email.trim());
}

/**
 * Setup invisible reCAPTCHA for Phone OTP
 */
export function setupRecaptcha(containerId = 'recaptcha-container') {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) { }
  }
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => { }
  });
  return window.recaptchaVerifier;
}

/**
 * Send Phone OTP via SMS
 */
export async function sendPhoneOtp(phoneNumber, appVerifier) {
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  return confirmationResult;
}

/**
 * Verify SMS OTP Code
 */
export async function verifyPhoneOtp(confirmationResult, verificationCode, name = '') {
  const cred = await confirmationResult.confirm(verificationCode);
  const user = cred.user;
  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      phone: user.phoneNumber,
      name: name || 'Valued Patron',
      role: 'customer',
      membership: 'Valeora Atelier Patron',
      memberSince: new Date().getFullYear().toString(),
      createdAt: serverTimestamp()
    });
  } else {
    await updateDoc(userRef, {
      lastLogin: serverTimestamp()
    });
  }
  return user;
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  return signOut(auth);
}

// ==========================================
// 2. FIRESTORE DATABASE SERVICES
// ==========================================

/**
 * Get User Document from Firestore
 */
export async function getUserDoc(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('Error reading user doc from Firestore:', err);
    return null;
  }
}

/**
 * Update User Document in Firestore
 */
export async function saveUserDoc(uid, data) {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error updating user doc in Firestore:', err);
    return false;
  }
}

/**
 * Save Customer Order to Firestore
 */
export async function createOrder(orderData) {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      status: orderData.status || 'Confirmed'
    });
    return docRef.id;
  } catch (err) {
    console.warn('Error writing order to Firestore:', err);
    return null;
  }
}

/**
 * Subscribe to Real-Time Orders
 * If userId is provided, listens to only that user's orders.
 * If userId is null, listens to all orders (Admin).
 */
export function subscribeToOrders(callback, userId = null, userEmail = null) {
  try {
    if (!userId && !userEmail) {
      // Admin view: listen to all orders
      const q = query(collection(db, 'orders'));
      return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            firestoreId: doc.id,
            id: data.id || `VAL-${doc.id.slice(0, 6).toUpperCase()}-2026`,
            ...data
          };
        });

        orders.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.date ? new Date(a.date).getTime() : 0);
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.date ? new Date(b.date).getTime() : 0);
          return timeB - timeA;
        });

        callback(orders);
      }, (error) => {
        console.warn('Admin orders subscription error:', error);
      });
    }

    // Customer view: Listen to orders matching userId OR email
    const cleanEmail = (userEmail || '').toLowerCase().trim();
    let ordersByUid = [];
    let ordersByEmail = [];

    const mergeAndCallback = () => {
      const mergedMap = new Map();
      [...ordersByUid, ...ordersByEmail].forEach(o => {
        const key = o.firestoreId || o.id;
        if (!mergedMap.has(key)) {
          mergedMap.set(key, o);
        }
      });

      const orders = Array.from(mergedMap.values());
      orders.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.date ? new Date(a.date).getTime() : 0);
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.date ? new Date(b.date).getTime() : 0);
        return timeB - timeA;
      });

      callback(orders);
    };

    const unsubs = [];

    if (userId) {
      const qUid = query(collection(db, 'orders'), where('userId', '==', userId));
      const unsubUid = onSnapshot(qUid, (snap) => {
        ordersByUid = snap.docs.map(doc => {
          const data = doc.data();
          return {
            firestoreId: doc.id,
            id: data.id || `VAL-${doc.id.slice(0, 6).toUpperCase()}-2026`,
            ...data
          };
        });
        mergeAndCallback();
      }, (e) => console.warn('Orders by uid error:', e));
      unsubs.push(unsubUid);
    }

    if (cleanEmail) {
      const qEmail = query(collection(db, 'orders'), where('email', '==', cleanEmail));
      const unsubEmail = onSnapshot(qEmail, (snap) => {
        ordersByEmail = snap.docs.map(doc => {
          const data = doc.data();
          return {
            firestoreId: doc.id,
            id: data.id || `VAL-${doc.id.slice(0, 6).toUpperCase()}-2026`,
            ...data
          };
        });
        mergeAndCallback();
      }, (e) => console.warn('Orders by email error:', e));
      unsubs.push(unsubEmail);
    }

    return () => {
      unsubs.forEach(u => typeof u === 'function' && u());
    };
  } catch (e) {
    console.warn('Failed to attach orders listener:', e);
    return () => { };
  }
}

/**
 * Fetch Customer's Own Orders
 */
export async function fetchCustomerOrders(userId) {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn('Error fetching customer orders:', err);
    return [];
  }
}

/**
 * Fetch All Orders (Admin only)
 */
export async function fetchAllOrders() {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn('Error fetching all orders:', err);
    return [];
  }
}

/**
 * Update Order Status (Admin)
 */
export async function updateOrderStatusInDb(orderFirestoreIdOrCustomId, status, trackingId = '') {
  try {
    // Check if order exists by doc ID
    const directRef = doc(db, 'orders', orderFirestoreIdOrCustomId);
    const directSnap = await getDoc(directRef);

    if (directSnap.exists()) {
      await updateDoc(directRef, {
        status,
        trackingId: trackingId || '',
        updatedAt: serverTimestamp()
      });
      return true;
    }

    // Otherwise search by custom ID (e.g. VAL-9481-2026)
    const q = query(collection(db, 'orders'), where('id', '==', orderFirestoreIdOrCustomId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const targetDoc = snap.docs[0];
      await updateDoc(doc(db, 'orders', targetDoc.id), {
        status,
        trackingId: trackingId || '',
        updatedAt: serverTimestamp()
      });
      return true;
    }
  } catch (err) {
    console.warn('Error updating order status in Firestore:', err);
  }
  return false;
}

/**
 * Save / Send Support Query to Firestore
 */
export async function saveQueryToDb(queryData) {
  try {
    const queriesRef = collection(db, 'queries');
    const docRef = await addDoc(queriesRef, {
      ...queryData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.warn('Error saving query to Firestore:', err);
    return null;
  }
}

/**
 * Subscribe to Support Queries Real-Time
 */
export function subscribeToQueries(callback, userId = null, email = null) {
  try {
    let q;
    if (userId) {
      q = query(collection(db, 'queries'), where('userId', '==', userId));
    } else if (email) {
      q = query(collection(db, 'queries'), where('email', '==', email));
    } else {
      q = query(collection(db, 'queries'));
    }
    return onSnapshot(q, (snapshot) => {
      const queries = snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        id: doc.data().id || `QRY-${doc.id.slice(0, 5).toUpperCase()}`,
        ...doc.data()
      }));

      queries.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.date ? new Date(a.date).getTime() : 0);
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.date ? new Date(b.date).getTime() : 0);
        return timeB - timeA;
      });

      callback(queries);
    }, (error) => {
      console.warn('Queries subscription error:', error);
    });
  } catch (e) {
    console.warn('Failed to subscribe queries:', e);
    return () => { };
  }
}

/**
 * Update Query in Firestore (Reply or Status change)
 */
export async function updateQueryInDb(queryId, data) {
  try {
    const directRef = doc(db, 'queries', queryId);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
      await updateDoc(directRef, { ...data, updatedAt: serverTimestamp() });
      return true;
    }

    const q = query(collection(db, 'queries'), where('id', '==', queryId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, 'queries', snap.docs[0].id), { ...data, updatedAt: serverTimestamp() });
      return true;
    }
  } catch (err) {
    console.warn('Error updating query in Firestore:', err);
  }
  return false;
}

/**
 * Upload Product Image to Firebase Storage (for Blaze plan if enabled)
 */
export async function uploadProductImage(file, filename) {
  const storageRef = ref(storage, `products/${Date.now()}_${filename || file.name}`);
  const snap = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snap.ref);
  return downloadUrl;
}

/**
 * Fetch All Registered Users from Firestore (Admin)
 */
export async function fetchUsersFromDb() {
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => {
      const data = d.data() || {};
      return {
        uid: d.id,
        id: data.id || `USR-${d.id.slice(0, 5).toUpperCase()}`,
        name: data.name || data.displayName || (data.email ? data.email.split('@')[0] : 'Patron'),
        email: data.email || '',
        phone: data.phone || data.phoneNumber || '',
        city: data.city || (data.address ? data.address.city : ''),
        pincode: data.pincode || (data.address ? data.address.pincode : ''),
        membership: data.membership || (data.role === 'admin' ? 'Administrator' : 'Valeora Atelier Patron'),
        memberSince: data.memberSince || (data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '2026') : '2026'),
        status: data.status || 'active',
        role: data.role || 'customer',
        ...data
      };
    });
  } catch (err) {
    console.warn('Error fetching users from Firestore:', err);
    return [];
  }
}

/**
 * Subscribe to Live Registered Users Real-Time
 */
export function subscribeToUsers(callback) {
  try {
    const colRef = collection(db, 'users');
    return onSnapshot(colRef, (snapshot) => {
      const users = snapshot.docs.map(d => {
        const data = d.data() || {};
        return {
          uid: d.id,
          id: data.id || `USR-${d.id.slice(0, 5).toUpperCase()}`,
          name: data.name || data.displayName || (data.email ? data.email.split('@')[0] : 'Patron'),
          email: data.email || '',
          phone: data.phone || data.phoneNumber || '',
          city: data.city || (data.address ? data.address.city : ''),
          pincode: data.pincode || (data.address ? data.address.pincode : ''),
          membership: data.membership || (data.role === 'admin' ? 'Administrator' : 'Valeora Atelier Patron'),
          memberSince: data.memberSince || (data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '2026') : '2026'),
          status: data.status || 'active',
          role: data.role || 'customer',
          ...data
        };
      });
      users.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.lastLogin?.seconds ? a.lastLogin.seconds * 1000 : 0);
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.lastLogin?.seconds ? b.lastLogin.seconds * 1000 : 0);
        return timeB - timeA;
      });
      callback(users);
    }, (err) => {
      console.warn('Users realtime subscription error:', err);
    });
  } catch (e) {
    console.warn('Failed to subscribe to users:', e);
    return () => { };
  }
}

/**
 * Save Return / Claim to Firestore
 */
export async function createReturnInDb(claimData) {
  try {
    const colRef = collection(db, 'returns');
    const docRef = await addDoc(colRef, {
      ...claimData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.warn('Error saving claim to Firestore:', err);
    return null;
  }
}

/**
 * Subscribe to Live Returns / Claims Real-Time
 */
export function subscribeToReturns(callback) {
  try {
    const q = query(collection(db, 'returns'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const returns = snapshot.docs.map(d => ({
        firestoreId: d.id,
        id: d.data().id || `RET-${d.id.slice(0, 5).toUpperCase()}`,
        ...d.data()
      }));
      callback(returns);
    }, (error) => {
      console.warn('Returns subscription error:', error);
    });
  } catch (e) {
    console.warn('Failed to subscribe to returns:', e);
    return () => { };
  }
}

/**
 * Update Return Status or Details in Firestore
 */
export async function updateReturnInDb(claimId, data) {
  try {
    const directRef = doc(db, 'returns', claimId);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
      await updateDoc(directRef, { ...data, updatedAt: serverTimestamp() });
      return true;
    }
    const q = query(collection(db, 'returns'), where('id', '==', claimId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, 'returns', snap.docs[0].id), { ...data, updatedAt: serverTimestamp() });
      return true;
    }
  } catch (err) {
    console.warn('Error updating claim in Firestore:', err);
  }
  return false;
}

/**
 * Sanitize an object for Firestore by removing any undefined keys
 */
export function sanitizeFirestoreDoc(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeFirestoreDoc).filter(v => v !== undefined);
  }
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = sanitizeFirestoreDoc(value);
    }
  }
  return clean;
}

/**
 * Fetch All Products from Firestore Database
 */
export async function fetchProductsFromDb() {
  try {
    const q = query(collection(db, 'products'), limit(100));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
    }
    return [];
  } catch (err) {
    console.warn('Error fetching products from Firestore:', err);
    return [];
  }
}

/**
 * Save or Update Product in Firestore Database
 * Automatically compresses large image payloads to guarantee payload stays <150KB
 * and sanitizes undefined values so setDoc never fails.
 */
export async function saveProductToDb(product) {
  try {
    if (!product || !product.id) return false;

    // 1. Sanitize to prevent "Unsupported field value: undefined"
    const cleanProduct = sanitizeFirestoreDoc({ ...product });

    // 2. Safeguard: compress main image if larger than 150KB
    if (cleanProduct.image && cleanProduct.image.startsWith('data:image/') && cleanProduct.image.length > 150000) {
      try {
        cleanProduct.image = await compressDataUrlIfNeeded(cleanProduct.image);
      } catch (e) {
        console.warn('Image compression warning in saveProductToDb:', e);
      }
    }

    // 3. Safeguard: compress gallery images if larger than 150KB
    if (Array.isArray(cleanProduct.galleryImages)) {
      cleanProduct.galleryImages = await Promise.all(
        cleanProduct.galleryImages.map(async (img) => {
          if (img && typeof img === 'string' && img.startsWith('data:image/') && img.length > 150000) {
            try {
              return await compressDataUrlIfNeeded(img);
            } catch (e) {
              return img;
            }
          }
          return img;
        })
      );
    }

    const prodRef = doc(db, 'products', cleanProduct.id);
    await setDoc(prodRef, {
      ...cleanProduct,
      createdAt: cleanProduct.createdAt || Date.now(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    return true;
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
    return false;
  }
}

/**
 * Delete Product from Firestore Database
 */
export async function deleteProductFromDb(productId) {
  try {
    if (!productId) return false;
    const prodRef = doc(db, 'products', productId);
    await deleteDoc(prodRef);
    return true;
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
    return false;
  }
}

/**
 * Subscribe to Real-Time Products Catalog
 */
export function subscribeToProducts(callback) {
  try {
    const q = query(collection(db, 'products'));
    return onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
      prods.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (Number(a.createdAt) || (a.id && a.id.split('-').pop() && !isNaN(Number(a.id.split('-').pop())) ? Number(a.id.split('-').pop()) : 0));
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (Number(b.createdAt) || (b.id && b.id.split('-').pop() && !isNaN(Number(b.id.split('-').pop())) ? Number(b.id.split('-').pop()) : 0));
        return timeB - timeA;
      });
      callback(prods);
    }, (error) => {
      console.warn('Products real-time subscription error (may be Firestore rules):', error.code, error.message);
      // On permission error, fallback to a one-time getDocs read
      if (error.code === 'permission-denied' || error.code === 'unavailable') {
        fetchProductsFromDb().then(prods => {
          if (Array.isArray(prods)) {
            callback(prods);
          }
        }).catch(e => console.warn('Products fallback fetch error:', e));
      }
    });
  } catch (e) {
    console.warn('Failed to subscribe to products:', e);
    return () => { };
  }
}


/**
 * Seed initial catalog to Firestore if empty
 */
export async function seedProductsIfEmpty(initialProducts) {
  try {
    if (!Array.isArray(initialProducts) || initialProducts.length === 0) return;
    const existing = await fetchProductsFromDb();
    if (!existing || existing.length === 0) {
      for (const prod of initialProducts) {
        if (prod && prod.id) {
          await setDoc(doc(db, 'products', prod.id), {
            ...prod,
            createdAt: serverTimestamp()
          });
        }
      }
    }
  } catch (err) {
    console.warn('Error seeding products to Firestore:', err);
  }
}

// ==========================================
// 6. COUPON & PROMOTION SERVICES
// ==========================================

/**
 * Fetch all coupons from Firestore
 */
export async function fetchCouponsFromDb() {
  try {
    const q = query(collection(db, 'coupons'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Error fetching coupons from Firestore:', err);
    return [];
  }
}

/**
 * Save or update a coupon in Firestore
 */
export async function saveCouponToDb(couponData) {
  try {
    const id = couponData.id || `coupon-${(couponData.code || '').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const couponRef = doc(db, 'coupons', id);
    await setDoc(couponRef, {
      ...couponData,
      id,
      code: (couponData.code || '').toUpperCase().trim(),
      discountPercent: Number(couponData.discountPercent) || 0,
      minAmount: Number(couponData.minAmount) || 0,
      active: couponData.active !== undefined ? couponData.active : true,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return id;
  } catch (err) {
    console.warn('Error saving coupon to Firestore:', err);
    return null;
  }
}

/**
 * Update specific coupon fields in Firestore
 */
export async function updateCouponInDb(couponId, updates) {
  try {
    const couponRef = doc(db, 'coupons', couponId);
    await updateDoc(couponRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (err) {
    console.warn('Error updating coupon in Firestore:', err);
    return false;
  }
}

/**
 * Delete a coupon from Firestore
 */
export async function deleteCouponFromDb(couponId) {
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
    return true;
  } catch (err) {
    console.warn('Error deleting coupon from Firestore:', err);
    return false;
  }
}

/**
 * Real-time subscription to Coupons collection
 */
export function subscribeToCoupons(callback) {
  try {
    const q = query(collection(db, 'coupons'));
    return onSnapshot(q, (snapshot) => {
      const coupons = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
      coupons.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return timeB - timeA;
      });
      callback(coupons);
    }, (error) => {
      console.warn('Coupons subscription error:', error);
      if (error.code === 'permission-denied' || error.code === 'unavailable') {
        fetchCouponsFromDb().then(coupons => {
          if (Array.isArray(coupons) && coupons.length > 0) {
            callback(coupons);
          }
        }).catch(e => console.warn('Coupons fallback fetch error:', e));
      }
    });
  } catch (e) {
    console.warn('Failed to subscribe to coupons:', e);
    return () => { };
  }
}

/**
 * Seed default initial coupons if Firestore coupons collection is empty
 */
export async function seedCouponsIfEmpty(defaultCoupons) {
  try {
    if (!Array.isArray(defaultCoupons) || defaultCoupons.length === 0) return;
    const existing = await fetchCouponsFromDb();
    if (!existing || existing.length === 0) {
      for (const cp of defaultCoupons) {
        if (cp && cp.id) {
          await setDoc(doc(db, 'coupons', cp.id), {
            ...cp,
            createdAt: serverTimestamp()
          });
        }
      }
    }
  } catch (err) {
    console.warn('Error seeding default coupons to Firestore:', err);
  }
}

