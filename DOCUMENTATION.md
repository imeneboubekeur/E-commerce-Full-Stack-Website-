# Furniture E-Commerce Project Documentation

## 1. Project Overview
This project is a full-stack, production-ready e-commerce application designed to browse and purchase furniture. It features a modern frontend powered by React with Server-Side Rendering (SSR), a robust Node.js/Express RESTful backend, and a PostgreSQL database. It seamlessly integrates with Stripe for secure payments and Cloudinary for optimized image delivery.

---

## 2. Technology Stack

### Frontend (Client-Side & SSR)
- **Framework:** React 19, React Router 7
- **State Management:** Redux Toolkit (`react-redux`)
- **Styling:** CSS-in-JS / Custom CSS modules
- **UI Components:** Lucide-React (icons), Slick-Carousel / Embla Carousel for galleries
- **Bundler:** Webpack (`webpack.client.js`, `webpack.server.js`)
- **Server-Side Rendering (SSR):** Custom implementation rendering static markup on initial load from `backend/server.js`.

### Backend (Server API)
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (using `pg` driver)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **File Uploads:** Multer & Cloudinary (`multer-storage-cloudinary`)
- **Payments:** Stripe SDK (`stripe`)

---

## 3. Database Schema
The database uses PostgreSQL with relational integrity. Below is the Entity-Relationship breakdown:

| Table | Description | Key Relationships |
| :--- | :--- | :--- |
| **`users`** | Stores customer and admin accounts, including passwords, and addresses. | 1:M with `orders`, `cart`, `reviews`, `wishlist` |
| **`categories`** | Organizes products into categories (with image URLs). | 1:M with `products` |
| **`products`** | Stores item details (name, price, stock, category). | M:1 with `categories` |
| **`cart`** | Acts as a join table linking Users and Products for shopping sessions. | M:1 with `users`, `products` |
| **`wishlist`** | Similar to cart, but for saving products for later. | M:1 with `users`, `products` |
| **`orders`** | Stores finalized checkout transactions. | 1:M with `order_items` |
| **`order_items`**| Stores exact quantities and historic prices of products at checkout. | M:1 with `orders`, `products` |
| **`reviews`** | Stores user ratings and comments on products. | M:1 with `users`, `products` |
| **`settings`** | Global admin settings stored as JSONB for dynamic adjustments. | Configuration key-values |

---

## 4. Use Cases & Roles

### 4.1 Guest (Unauthenticated User)
* **Product Discovery:** Can browse products, view detailed item pages, and scroll through categories using carousels.
* **Search:** Can use text search to find specific items.
* **Account Creation:** Sign up as a new user with an email and password.

### 4.2 Customer (Authenticated User)
* **Everything a Guest can do.**
* **Shopping Cart Management:** Add items to cart, remove items, update quantities.
* **Wishlist Management:** Save favorite furniture pieces for future sessions.
* **Order Checkout:** Securely process payments via Stripe, utilizing shipping calculators.
* **Order History:** View past orders and current tracking statuses.
* **Profile Management:** Update personal information, delivery addresses, profile images (uploaded to Cloudinary), and passwords.
* **Reviews:** Leave ratings and comments on purchased items.

### 4.3 Administrator
* **Dashboard Analytics:** View store, product, order, and customer statistics.
* **Catalog Management:** Create, read, update, and delete (CRUD) products and categories. Upload product images directly via the dashboard to Cloudinary.
* **Order Fulfillment:** View incoming orders and update their fulfillment status.
* **Customer Management:** View user accounts.
* **Store Settings:** Overwrite dynamic settings like store info, shipping rules, payment rules, and media configuration (stored as JSON in `settings`).

---

## 5. Security & Authentication
* **Protected Routes:** Both React Router (via `verifyToken`) and Express Router employ authorization checks preventing Guests from entering customer pages, and Customers from entering Admin dashboards.
* **Stripe Webhooks:** Ensures server validates when a payment actually succeeds before fulfilling an order.
* **CORS Policies:** Strict rules allowing only specific frontend IP addresses for external interactions.
* **Local Storage Storage:** JWT tokens and temporary cart IDs allow session continuity without aggressive DB polling.

---

## 6. Directory Structure

> [!NOTE]
> The repository is deployed as a monolithic structure. Both frontend and backend scripts are launched simultaneously during development via `concurrently`.

```text
c:\Users\HP\furnitures\
├── backend/
│   ├── controllers/   # Business logic (products, users, orders)
│   ├── database/      # PostgreSQL connection & Schema Init
│   ├── middleware/    # Auth (JWT) & Error handling
│   ├── routes/        # Express REST API Routes
│   └── server.js      # Main Express App & Webhook Entry point
├── dist/              # Compiled SSR Server Logic
├── furniture-react/   
│   └── src/
│       ├── client/    # React Browser Entry (`main.jsx`)
│       └── shared/    # Main Frontend Code
│           ├── components/ # UIs (Admin, Checkout, Home, Settings)
│           ├── contexts/   # React Context Providers
│           ├── hooks/      # Custom React Hooks
│           ├── services/   # Frontend Axios/Fetch APIs
│           └── slices/     # Redux State Management
├── public/            # Static Assets
├── ssr/               # Server-Side Rendering implementation
├── webpack.client.js  # Build config for React bundle
└── webpack.server.js  # Build config for SSR bundle
```
