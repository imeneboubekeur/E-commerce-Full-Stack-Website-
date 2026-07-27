#UI UX Designer @bendali-ibtihal-layal
# Furniture E-Commerce System

An end-to-end, high-performance furniture e-commerce platform built with React 19, Node.js (Express 5), and PostgreSQL. The application features custom Server-Side Rendering (SSR) for fast initial loads and SEO optimization, paired with dynamic SPA interactivity, secure Stripe Checkout payments, Cloudinary media storage, and a comprehensive Admin Management Dashboard.

Live Demo: https://e-commerce-full-stack-website-09f9.onrender.com/

---

## Key Features

### Customer Experience (Guest & Authenticated)
* Catalog Browsing & Search: Filter items by category, price, or keywords with interactive multi-image product carousels.
* Reviews & Ratings: View customer reviews as a guest; submit star ratings and verified purchase feedback as an authenticated user.
* Real-time Cart & Wishlist: Manage active shopping sessions, adjust item quantities, calculate live price totals, and bookmark items.
* Stripe Checkout Integration: Seamless and secure card payment processing with automated dynamic shipping calculation.
* Order Tracking & History: Track order progression through statuses: pending, paid, shipped, and completed.
* User Profile & Avatar Upload: Manage account details and profile pictures hosted on Cloudinary CDN.

### Administrator Controls
* Store Analytics Dashboard: Track total revenue, order volume, customer sign-ups, and stock counts.
* Product & Category CRUD: Full management of products, inventory stock, SKUs, and category structures with image uploads.
* Order Fulfillment: Review order details, user information, and update live fulfillment statuses.
* Dynamic Store Settings (JSONB): Modify store details, shipping thresholds, toggle Stripe test modes, and media configurations dynamically without database migrations.

---

## Architecture Overview

```
                      +-----------------------------+
                      |       Client Browser        |
                      |   React 19 / Redux Toolkit  |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |     Node.js Express 5       |
                      |  Custom Webpack SSR Engine  |
                      +--------------+--------------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
         v                           v                           v
+------------------+       +------------------+       +------------------+
|  PostgreSQL DB   |       |    Stripe API    |       | Cloudinary Cloud |
| 9 Tables + JSONB |       | Payments & Hooks |       | Image Hosting/CDN|
+------------------+       +------------------+       +------------------+
```

---

## Tech Stack

* Frontend: React 19, React Router 7, Redux Toolkit, Lucide Icons, Webpack
* Server-Side Rendering: Custom Webpack SSR pipeline with HTML string stream injection
* Backend: Node.js, Express 5, JWT Authentication, Bcrypt Hashing
* Database: PostgreSQL (pg pool connection) with JSONB dynamic attributes
* External Services: Stripe Checkout API (with webhook signature verification), Cloudinary Media Storage

---

## Database Schema Summary

The database uses PostgreSQL with 9 relational entities:

* users: Auth, profiles, reset tokens, Cloudinary avatar references.
* categories & products: Foreign key constraints, pricing, SKUs, stock counts, and dynamic categories.
* cart & wishlist: Join tables configured with ON DELETE CASCADE for persistent session management.
* orders & order_items: Transactional histories and fulfillment tracking.
* reviews: User ratings (1–5 stars) and comments mapped to specific products.
* settings: Admin configuration stored as PostgreSQL JSONB for flexible settings.

---

## Key REST API Endpoints

### Auth & User Routes
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | /api/auth/signup | Register new account | Public |
| POST | /api/auth/login | Authenticate & get JWT | Public |
| GET | /api/auth/me | Get current user profile | User |
| PUT | /api/auth/profile | Update profile info & avatar | User |

### Shop & Orders
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | /api/products | Fetch filtered product catalog | Public |
| GET/POST/DEL | /api/cart | Manage shopping cart items | User |
| POST | /api/order/create-checkout-session | Create Stripe session | User |
| POST | /api/order/webhook | Stripe payment verification listener | Stripe Signature |

### Admin Routes
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | /api/products | Create product + Cloudinary upload | Admin |
| GET | /api/admin/stats | View sales and system stats | Admin |
| GET/PUT | /api/settings | Manage dynamic JSONB store rules | Admin |

---

## Folder Structure

```text
furnitures/
├── backend/
│   ├── controllers/      # API Controllers (auth, products, orders, admin)
│   ├── database/         # PostgreSQL client setup & initDB script
│   ├── middleware/       # JWT verification, rate limiting, multer
│   ├── routes/           # Express REST API endpoint declarations
│   └── server.js         # Entry point & Stripe webhook listener
├── furniture-react/      # React Frontend App
│   ├── src/
│   │   ├── client/       # Client hydration entry point
│   │   ├── shared/       # Components, Redux slices, services, hooks
│   │   └── ssr/          # SSR engine & server rendering logic
│   ├── webpack.client.js # Client Webpack config
│   └── webpack.server.js # Server SSR Webpack config
└── dist/                 # Compiled SSR & server bundle outputs
```

---

## Quick Start

### 1. Prerequisites
* Node.js (v18+)
* PostgreSQL Database instance

### 2. Environment Variables Setup
Create a .env file in the root directory and populate it with the following:

```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/furniture
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. Installation & Run

```bash
# 1. Install all dependencies
npm install

# 2. Initialize PostgreSQL tables & seed data
node backend/database/initDB.js

# 3. Launch Development Server (Client & Backend)
npm run dev
```

---

## Security & Performance

* Data Integrity: Passwords hashed using bcrypt with 10 salt rounds.
* Stateless Auth: JWT verification on protected administrative and client routes.
* DDoS & Webhooks: HTTP rate-limiting on sensitive auth routes and raw signature verification on Stripe Webhook entry points.