# Aurite Backend API Server

A clean, modular Express.js backend server for Aurite E-Commerce.

## 📁 Directory Structure
```
server/
├── routes/
│   ├── auth.routes.js       # Login, register, OTP verification, block/unblock users
│   ├── products.routes.js   # Products catalog, highlights, reviews, CRUD
│   ├── orders.routes.js     # Order placement, status updates, history
│   ├── queries.routes.js    # Customer support queries, replies, resolution
│   └── returns.routes.js    # Returns, refunds, exchanges, claim chat & decisions
├── server.js                # Main Express server entry point
├── package.json             # Backend dependencies & npm scripts
└── .env.example             # Environment variable template
```

## 🚀 Quick Start
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.
