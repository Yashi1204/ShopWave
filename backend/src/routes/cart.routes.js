import { Router } from 'express'
import { fetchCart, addToCart, updateCart, removeFromCart } from '../controllers/cart.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()
router.use(verifyToken)
router.get('/',                fetchCart)
router.post('/',               addToCart)
router.put('/',                updateCart)
router.delete('/:productId',   removeFromCart)
export default router