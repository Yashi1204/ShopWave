# 🛍️ ShopWave — Full Stack E-Commerce Platform

A production-ready e-commerce app built with React, Node.js, and PostgreSQL featuring JWT auth, cart, orders, admin dashboard, and Razorpay payments.

## 🚀 Live Demo
> Coming soon

## 🛠️ Tech Stack
React 18 · Vite · Tailwind CSS · Node.js · Express · PostgreSQL · Docker · JWT · Razorpay · Nodemailer

## ✨ Features
- 🔐 JWT Authentication + Forgot/Reset Password via Email
- 🛒 Cart, Checkout & Order History
- 💳 Razorpay Payment Integration
- ❤️ Wishlist & Product Reviews
- 📦 Order Tracking (Pending → Shipped → Delivered)
- 🔍 Search & Category Filtering (7 categories)
- 🔧 Admin Dashboard — manage products, orders, users

## ⚙️ Setup

```bash
# Start DB
docker-compose up -d

# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

**Backend `.env`**
```env
PORT=5000
JWT_SECRET=your_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

**Frontend `.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

## 👨‍💻 Author
**Yashi**
- GitHub: [@Yashi1204](https://github.com/Yashi1204)
- LinkedIn: [yashi1204](https://www.linkedin.com/in/yashi1204)