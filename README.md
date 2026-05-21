# 🛍️ ShopWave
A production-ready, full-stack e-commerce platform built with React, Node.js, Express, and PostgreSQL. Features JWT authentication, cart management, Razorpay payments, product reviews, wishlist, and a live admin dashboard.

> Built to demonstrate full-stack development, relational database design, REST API architecture, and modern React UI.

---

## 🌐 Live Features
- 🔐 **Auth System** — JWT login/register + forgot/reset password via Gmail SMTP
- 🛒 **Cart & Checkout** — Add, update, remove items with real-time total
- 💳 **Razorpay Payments** — Test mode payment gateway integration
- 📦 **Order Tracking** — Pending → Processing → Shipped → Delivered → Cancelled
- ❤️ **Wishlist** — Save products for later
- ⭐ **Reviews & Ratings** — Per-product user reviews
- 🔍 **Search & Filter** — By keyword and category (7 categories)
- 🔧 **Admin Dashboard** — Manage products, orders, users with live stats

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router DOM 6 |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL 15 (Docker) |
| Auth | JWT, bcryptjs |
| Email | Nodemailer + Gmail SMTP |
| Payment | Razorpay |
| Dev Tools | Nodemon, Docker Compose |

---

## ⚙️ Setup

### 1. Clone the repo
```bash
git clone https://github.com/Yashi1204/shopwave.git
cd shopwave
```

### 2. Start the database
```bash
docker-compose up -d
```

### 3. Backend
```bash
cd backend && npm install
```

Create `.env` in `/backend`:
```env
PORT=5000
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```
```bash
npm run dev
```

### 4. Frontend
```bash
cd frontend && npm install
```

Create `.env` in `/frontend`:
```env
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login with JWT | ❌ |
| POST | `/api/auth/forgot-password` | Send reset email | ❌ |
| POST | `/api/auth/reset-password` | Reset password | ❌ |
| GET | `/api/products` | Get all products | ❌ |
| GET | `/api/products/:id` | Get single product | ❌ |
| GET | `/api/cart` | Get user cart | ✅ |
| POST | `/api/cart` | Add to cart | ✅ |
| PUT | `/api/cart/:id` | Update quantity | ✅ |
| DELETE | `/api/cart/:id` | Remove item | ✅ |
| POST | `/api/orders` | Place order | ✅ |
| GET | `/api/orders` | Get order history | ✅ |
| GET | `/api/admin/dashboard` | Admin stats | 🔧 |
| POST | `/api/admin/products` | Add product | 🔧 |
| PUT | `/api/admin/products/:id` | Update product | 🔧 |
| DELETE | `/api/admin/products/:id` | Delete product | 🔧 |
| PUT | `/api/admin/orders/:id` | Update order status | 🔧 |

> ✅ Requires user JWT — 🔧 Requires admin role

---

## 🔑 Key Technical Highlights

### Role-Based Access Control
Two roles — `customer` and `admin` — enforced at both route middleware and DB constraint level. Admin routes are protected by a dedicated `adminOnly` middleware that verifies JWT and checks role.

### Password Reset Flow
Secure token-based reset — a crypto-generated token is hashed, stored in DB with a bigint expiry timestamp, and emailed via Nodemailer. Token is single-use and expires in 30 minutes.

### Relational Database Design
6 normalized tables with foreign key constraints and cascading deletes — users, products, orders, order_items, reviews, wishlist. Products have category and is_active indexes for fast filtering.

### Cart & Order System
Cart items are stored per user in DB (not localStorage). On checkout, cart is atomically converted to an order with individual order_items rows preserving price at time of purchase.

### Admin Dashboard
Live stats aggregated from DB — total revenue (SUM), order count, product count, user count. Order status updates flow through a CHECK constraint enforcing valid transitions.

---

## 🗄️ Database Schema

### Tables
- **users** — id, name, email, password_hash, role, reset_token, reset_token_expires
- **products** — id, name, description, price, stock, category, image_url, is_active
- **orders** — id, user_id, total, status, created_at
- **order_items** — id, order_id, product_id, quantity, price
- **reviews** — id, user_id, product_id, rating, comment, created_at
- **wishlist** — id, user_id, product_id

---

## 🧠 What I Learned
- Designing normalized relational schemas with foreign keys, indexes, and check constraints
- Building JWT auth from scratch including secure password reset with expiring tokens
- Implementing role-based middleware for protecting admin routes
- Managing cart state server-side to support multi-device sessions
- Integrating third-party payment gateway (Razorpay) in a full-stack flow
- Using Docker Compose to run PostgreSQL locally with persistent volumes
- Structuring a REST API with separation of routes, controllers, and middleware

---

## 👩‍💻 Author
**Yashi**
[GitHub](https://github.com/Yashi1204) • [LinkedIn](https://www.linkedin.com/in/yashi1204)

---

## 📄 License
MIT