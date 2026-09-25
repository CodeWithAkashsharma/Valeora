# VALEORA Backend API Server

A lightweight, modular Express.js backend server supporting the VALEORA Luxury Fashion Jewelry platform.

## 📁 Directory Structure

```
server/
├── routes/
│   ├── auth.routes.js       # Admin authentication & user management
│   ├── products.routes.js   # Products catalog and CRUD endpoints
│   ├── orders.routes.js     # Order placement & order status updates
│   ├── queries.routes.js    # Customer support queries & communication
│   └── returns.routes.js    # Returns, refunds, exchanges & dispute chat
├── server.js                # Main Express server entry point
├── package.json             # Backend dependencies & npm scripts
└── .env.example             # Environment variable template
```

## 🚀 Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure your environment variables in `.env`.
3. Install dependencies and start the server:
   ```bash
   npm install
   npm run dev
   ```

The backend API will run on `http://localhost:5000`.
