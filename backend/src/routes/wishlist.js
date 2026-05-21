import { Router } from 'express'
import { getWishlist, toggleWishlist } from '../controllers/wishlist.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()
router.use(verifyToken)
router.get('/', getWishlist)
router.post('/toggle', toggleWishlist)
export default router