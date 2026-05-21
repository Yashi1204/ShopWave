import { Router } from 'express'
import {
  createRazorpayOrder,
  verifyAndCreateOrder,
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/order.controller.js'
import { verifyToken, isAdmin } from '../middleware/auth.js'

const router = Router()
router.use(verifyToken)
router.post('/create-razorpay-order', createRazorpayOrder)
router.post('/verify-payment', verifyAndCreateOrder)
router.post('/', createOrder)
router.get('/', getUserOrders)
router.get('/admin/all', isAdmin, getAllOrders)
router.patch('/admin/:id/status', isAdmin, updateOrderStatus)
export default router