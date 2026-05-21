import pool from '../config/db.js'

export const getStats = async (req, res) => {
  const [revenue, orders, products, users] = await Promise.all([
    pool.query(`SELECT COALESCE(SUM(total_amount),0) as revenue FROM orders WHERE status != 'cancelled'`),
    pool.query('SELECT COUNT(*) as total_orders FROM orders'),
    pool.query('SELECT COUNT(*) as total_products FROM products WHERE is_active=true'),
    pool.query('SELECT COUNT(*) as total_users FROM users'),
  ])
  res.json({
    revenue:        revenue.rows[0].revenue,
    total_orders:   orders.rows[0].total_orders,
    total_products: products.rows[0].total_products,
    total_users:    users.rows[0].total_users,
  })
}

export const getAllOrders = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT o.*, u.name as user_name FROM orders o
     JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC`
  )
  res.json(rows)
}

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body
  const { rows } = await pool.query(
    'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
    [status, req.params.id]
  )
  res.json(rows[0])
}

export const createProduct = async (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body
  const { rows } = await pool.query(
    'INSERT INTO products (name,description,price,stock,category,image_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [name, description, price, stock, category, image_url || null]
  )
  res.status(201).json(rows[0])
}

export const updateProduct = async (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body
  const { rows } = await pool.query(
    'UPDATE products SET name=$1,description=$2,price=$3,stock=$4,category=$5,image_url=$6 WHERE id=$7 RETURNING *',
    [name, description, price, stock, category, image_url || null, req.params.id]
  )
  res.json(rows[0])
}

export const deleteProduct = async (req, res) => {
  await pool.query('UPDATE products SET is_active=false WHERE id=$1', [req.params.id])
  res.json({ message: 'Product deleted' })
}