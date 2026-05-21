import pool from '../config/db.js'

export const getWishlist = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT w.id, w.product_id, p.name, p.price, p.category, p.image_url
     FROM wishlist w JOIN products p ON p.id = w.product_id
     WHERE w.user_id = $1 ORDER BY w.created_at DESC`,
    [req.user.id]
  )
  res.json(rows)
}

export const toggleWishlist = async (req, res) => {
  const { product_id } = req.body
  const { rows: [exists] } = await pool.query(
    'SELECT id FROM wishlist WHERE user_id=$1 AND product_id=$2',
    [req.user.id, product_id]
  )
  if (exists) {
    await pool.query('DELETE FROM wishlist WHERE id=$1', [exists.id])
    res.json({ wishlisted: false })
  } else {
    await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1,$2)',
      [req.user.id, product_id]
    )
    res.json({ wishlisted: true })
  }
}