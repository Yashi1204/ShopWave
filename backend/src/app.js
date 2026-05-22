import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import authRoutes    from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes    from './routes/cart.routes.js'
import orderRoutes   from './routes/order.routes.js'
import adminRoutes   from './routes/admin.routes.js'
import reviewRoutes  from './routes/reviews.js'
import wishlistRoutes from './routes/wishlist.js'

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://shopwave-delta.vercel.app'],
  credentials: true
}))
app.use(express.json())

app.use('/api/auth',                    authRoutes)
app.use('/api/products',               productRoutes)
app.use('/api/cart',                   cartRoutes)
app.use('/api/orders',                 orderRoutes)
app.use('/api/admin',                  adminRoutes)
app.use('/api/products/:id/reviews',   reviewRoutes)
app.use('/api/wishlist',               wishlistRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

export default app