# ✨ VALEORA — Everyday Luxury Fashion Jewelry

VALEORA is an e-commerce platform crafted for modern fashion jewelry (₹249 – ₹999). Designed with high-performance animations, fluid typography, and dynamic 3D visuals, it delivers a high-end shopping experience backed by Firebase and Node.js.

---

## 🌟 Key Features

- **Dynamic Visuals & 3D Effects**: Built with GSAP, OGL, and Three.js for smooth canvas animations and interactive product galleries.
- **Real-Time Catalog & Firestore Integration**: Live catalog updates, stock tracking, and coupon management powered by Firebase Firestore.
- **Flexible Checkout Flow**: Supports full online payments and split-advance payments (30% advance via Razorpay + 70% Cash on Delivery).
- **Comprehensive Admin Suite**: Admin portal for real-time inventory management, order processing, coupon creation, and customer query resolution.
- **Customer Account & Support Hub**: Profile management, order tracking, returns & refunds handling with direct query chat.
- **Production-Ready SEO & Schema**: Pre-configured JSON-LD structured data (`JewelryStore`, `Product`, `OfferCatalog`), OpenGraph tags, sitemap, and robots.txt.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Vanilla JavaScript (ES Modules), HTML5, Custom CSS3 Design System, Vite |
| **Animations & 3D** | GSAP, Three.js, OGL |
| **Cloud Services** | Firebase Authentication, Cloud Firestore, Cloud Storage, Firebase Hosting |
| **Payments** | Razorpay Payment Gateway integration |
| **Backend API** | Node.js, Express.js, CORS, Dotenv |

---

## 📂 Project Structure

```
valeora/
├── client/                     # Frontend client application
│   ├── public/                 # Static assets (images, logos, favicon, robots.txt, sitemap.xml)
│   ├── src/
│   │   ├── js/
│   │   │   ├── components/     # UI components (navbar, footer, modals, cart, checkout, toast)
│   │   │   ├── pages/          # Page views (home, shop, about, contact, profile, admin, science)
│   │   │   ├── services/       # Firebase service layer (auth, firestore, storage)
│   │   │   ├── app.js          # Main frontend entry point & initialization
│   │   │   ├── productsData.js # Static category & audience taxonomy
│   │   │   ├── router.js       # Client-side hash-based SPA routing
│   │   │   ├── seo.js          # Dynamic meta tag & JSON-LD updates
│   │   │   └── state.js        # Central reactive state manager
│   │   └── styles/             # Modular CSS stylesheets (main.css, components.css, pages.css)
│   ├── index.html              # HTML entry point with semantic markup and SEO tags
│   ├── vite.config.js          # Vite configuration
│   ├── package.json            # Client dependencies
│   └── .env.example            # Client environment variable template
├── server/                     # Backend Express server
│   ├── routes/
│   │   ├── auth.routes.js      # Admin authentication endpoints
│   │   ├── products.routes.js  # Product management endpoints
│   │   ├── orders.routes.js    # Order lifecycle & status endpoints
│   │   ├── queries.routes.js   # Customer queries & messaging endpoints
│   │   └── returns.routes.js   # Return claims & resolution chat
│   ├── server.js               # Express server entry point
│   ├── package.json            # Server dependencies
│   └── .env.example            # Server environment variable template
├── .firebaserc                 # Firebase project configuration
├── firebase.json               # Firebase hosting configuration
├── .gitignore                  # Git ignore rules
├── package.json                # Root orchestration & unified scripts
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (v9.x or later)

### 1. Installation

Clone the repository and install dependencies for all workspaces:

```bash
git clone https://github.com/your-username/valeora.git
cd valeora
npm run install:all
```

Or install them individually:

```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install && cd ..

# Server dependencies
cd server && npm install && cd ..
```

---

### 2. Environment Configuration

#### Frontend (`client/.env`)

Copy `client/.env.example` to `client/.env` and fill in your Firebase and Razorpay credentials:

```bash
cp client/.env.example client/.env
```

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

#### Backend (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173

# Admin Account
ADMIN_EMAIL=admin@valeora.com
ADMIN_PASSWORD=your_secure_admin_password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

### 3. Running Locally

Start both the client and server concurrently with a single command:

```bash
npm run dev
```

- **Frontend**: Accessible at `http://localhost:5173`
- **Backend API**: Accessible at `http://localhost:5000`

#### Running Independently

```bash
# Start frontend only
npm run client

# Start backend only
npm run server
```

---

## 📦 Build & Deployment

### Production Build

Build the optimized client bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Deploy to Firebase Hosting

Ensure you have the Firebase CLI installed and logged in:

```bash
npm run deploy
```

---

## 🔒 Security Best Practices

- Never commit `.env` or files containing secret API keys to version control.
- Keep `RAZORPAY_KEY_SECRET` restricted exclusively to the backend server environment.
- Configure proper Firestore and Firebase Storage Security Rules before deploying to production.

---

## 📄 License

This project is proprietary and confidential. All rights reserved.
