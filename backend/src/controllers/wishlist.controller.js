import pool from '../config/db.js'

export const getWishlist = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT w.id, w.product_id, p.name, p.price, p.category, p.image_url
       FROM wishlist w JOIN products p ON p.id = w.product_id
       WHERE w.user_id = $1 ORDER BY w.id DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    console.error('getWishlist error:', err)
    res.status(500).json({ message: 'Could not load wishlist' })
  }
}

export const toggleWishlist = async (req, res) => {
  try {
    const { product_id } = req.body

    if (!product_id) {
      return res.status(400).json({ message: 'product_id is required' })
    }

    const { rows: [exists] } = await pool.query(
      'SELECT id FROM wishlist WHERE user_id=$1 AND product_id=$2',
      [req.user.id, product_id]
    )

    if (exists) {
      await pool.query('DELETE FROM wishlist WHERE id=$1', [exists.id])
      return res.json({ wishlisted: false })
    }

    await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1,$2)',
      [req.user.id, product_id]
    )
    res.json({ wishlisted: true })
  } catch (err) {
    console.error('toggleWishlist error:', err)
    res.status(500).json({ message: 'Could not update wishlist' })
  }
}