import redis from '../config/redis.js'

const key = (userId) => `cart:${userId}`

const getCart = async (userId) => {
  try {
    const data = await redis.get(key(userId))
    return data ? JSON.parse(data) : { items: [] }
  } catch { return { items: [] } }
}

const saveCart = async (userId, cart) => {
  try { await redis.set(key(userId), JSON.stringify(cart), 'EX', 86400) } catch {}
}

export const fetchCart = async (req, res) => {
  res.json(await getCart(req.user.id))
}

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body
  // Get product details from DB to store name/price in cart
  const { default: pool } = await import('../config/db.js')
  const { rows } = await pool.query('SELECT id,name,price,image_url,stock FROM products WHERE id=$1', [productId])
  if (!rows.length) return res.status(404).json({ message: 'Product not found' })
  if (rows[0].stock < quantity) return res.status(400).json({ message: 'Insufficient stock' })

  const cart = await getCart(req.user.id)
  const existing = cart.items.find(i => i.product_id === productId)
  if (existing) existing.quantity += quantity
  else cart.items.push({ product_id: rows[0].id, name: rows[0].name, price: rows[0].price, image_url: rows[0].image_url, quantity })

  await saveCart(req.user.id, cart)
  res.json(cart)
}

export const updateCart = async (req, res) => {
  const { productId, quantity } = req.body
  const cart = await getCart(req.user.id)
  if (quantity <= 0) cart.items = cart.items.filter(i => i.product_id !== productId)
  else {
    const item = cart.items.find(i => i.product_id === productId)
    if (item) item.quantity = quantity
  }
  await saveCart(req.user.id, cart)
  res.json(cart)
}

export const removeFromCart = async (req, res) => {
  const cart = await getCart(req.user.id)
  cart.items = cart.items.filter(i => i.product_id !== parseInt(req.params.productId))
  await saveCart(req.user.id, cart)
  res.json(cart)
}

export const clearUserCart = async (userId) => {
  try { await redis.del(key(userId)) } catch {}
}