import pool from '../config/db.js'

export const getProductReviews = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT r.*, u.name as user_name FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = $1 ORDER BY r.created_at DESC`,
    [req.params.id]
  )
  res.json(rows)
}

export const addReview = async (req, res) => {
  const { rating, comment } = req.body
  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: 'Rating must be 1-5' })
  try {
    const { rows: [review] } = await pool.query(
      `INSERT INTO reviews (user_id, product_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET rating=$3, comment=$4, created_at=NOW()
       RETURNING *`,
      [req.user.id, req.params.id, rating, comment]
    )
    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteReview = async (req, res) => {
  await pool.query(
    'DELETE FROM reviews WHERE id=$1 AND user_id=$2',
    [req.params.reviewId, req.user.id]
  )
  res.json({ message: 'Deleted' })
}