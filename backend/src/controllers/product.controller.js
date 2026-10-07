import pool from '../config/db.js'

export const getProducts = async (req, res) => {
  try {
    const { search = '', category = '' } = req.query
    let q = 'SELECT * FROM products WHERE is_active=true'
    const params = []

    if (search) {
      params.push(`%${search}%`)
      q += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`
    }
    if (category) {
      params.push(category)
      q += ` AND category=$${params.length}`
    }
    q += ' ORDER BY created_at DESC'

    const { rows } = await pool.query(q, params)
    const cats = await pool.query(
      'SELECT DISTINCT category FROM products WHERE is_active=true ORDER BY category'
    )
    res.json({ products: rows, categories: cats.rows.map(r => r.category) })
  } catch (err) {
    console.error('getProducts error:', err)
    res.status(500).json({ message: 'Could not load products' })
  }
}

export const getProduct = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE id=$1 AND is_active=true',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Product not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('getProduct error:', err)
    res.status(500).json({ message: 'Could not load product' })
  }
}