import pool from '../config/db.js'
import { clearUserCart } from './cart.controller.js'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const createRazorpayOrder = async (req, res) => {
  const { total_amount } = req.body
  if (!total_amount) return res.status(400).json({ message: 'Amount required' })
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(total_amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    })
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const verifyAndCreateOrder = async (req, res) => {
  const {
    razorpay_order_id, razorpay_payment_id, razorpay_signature,
    items, total_amount, shipping_address,
  } = req.body

  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification failed' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows: [order] } = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, payment_id, payment_status)
       VALUES ($1,$2,$3,$4,'paid') RETURNING *`,
      [req.user.id, total_amount, shipping_address, razorpay_payment_id]
    )
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)',
        [order.id, item.product_id, item.quantity, item.price]
      )
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id=$2',
        [item.quantity, item.product_id]
      )
    }
    await client.query('COMMIT')
    await clearUserCart(req.user.id)
    res.status(201).json(order)
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ message: err.message })
  } finally {
    client.release()
  }
}

export const createOrder = async (req, res) => {
  const { items, total_amount, shipping_address } = req.body
  if (!items?.length) return res.status(400).json({ message: 'No items in order' })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows: [order] } = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, payment_status)
       VALUES ($1,$2,$3,'pending') RETURNING *`,
      [req.user.id, total_amount, shipping_address]
    )
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)',
        [order.id, item.product_id, item.quantity, item.price]
      )
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id=$2',
        [item.quantity, item.product_id]
      )
    }
    await client.query('COMMIT')
    await clearUserCart(req.user.id)
    res.status(201).json(order)
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ message: err.message })
  } finally {
    client.release()
  }
}

export const getUserOrders = async (req, res) => {
  const { rows: orders } = await pool.query(
    'SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC',
    [req.user.id]
  )
  for (const order of orders) {
    const { rows } = await pool.query(
      `SELECT oi.*, p.name as product_name FROM order_items oi
       JOIN products p ON p.id=oi.product_id WHERE oi.order_id=$1`,
      [order.id]
    )
    order.items = rows
  }
  res.json(orders)
}

export const getAllOrders = async (req, res) => {
  try {
    const { rows: orders } = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    )
    for (const order of orders) {
      const { rows } = await pool.query(
        `SELECT oi.*, p.name as product_name FROM order_items oi
         JOIN products p ON p.id = oi.product_id WHERE oi.order_id = $1`,
        [order.id]
      )
      order.items = rows
    }
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body
  const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' })
  try {
    const { rows: [order] } = await pool.query(
      'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    )
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}