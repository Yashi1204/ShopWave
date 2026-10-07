import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import authRoutes     from './routes/auth.routes.js'
import productRoutes  from './routes/product.routes.js'
import cartRoutes     from './routes/cart.routes.js'
import orderRoutes    from './routes/order.routes.js'
import adminRoutes    from './routes/admin.routes.js'
import reviewRoutes   from './routes/reviews.js'
import wishlistRoutes from './routes/wishlist.js'

// Safety nets: log the real cause instead of dying silently.
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err)
  process.exit(1) // let Render restart the process cleanly
})

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://shop-wave-ivory.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    name: 'ShopWave API',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      admin: '/api/admin',
      reviews: '/api/products/:id/reviews',
      wishlist: '/api/wishlist',
      health: '/api/health'
    }
  })
})

app.use('/api/auth',                  authRoutes)
app.use('/api/products',              productRoutes)
app.use('/api/cart',                  cartRoutes)
app.use('/api/orders',                orderRoutes)
app.use('/api/admin',                 adminRoutes)
app.use('/api/products/:id/reviews',  reviewRoutes)
app.use('/api/wishlist',              wishlistRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Unknown API routes return JSON instead of an HTML error page.
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler: any route that throws returns a response instead of crashing.
app.use((err, req, res, next) => {
  console.error('ROUTE ERROR:', req.method, req.originalUrl, err)
  if (res.headersSent) return next(err)

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }

  const status = err.status && err.status < 500 ? err.status : 500
  res.status(status).json({
    message: status < 500 ? 'Bad request' : 'Something went wrong'
  })
})

export default app