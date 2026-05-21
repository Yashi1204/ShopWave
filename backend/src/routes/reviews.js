import { Router } from 'express'
import { getProductReviews, addReview, deleteReview } from '../controllers/review.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router({ mergeParams: true })
router.get('/', getProductReviews)
router.post('/', verifyToken, addReview)
router.delete('/:reviewId', verifyToken, deleteReview)
export default router