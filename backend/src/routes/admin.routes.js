import { Router } from 'express'
import { verifyToken } from '../middleware/auth.js'
import { isAdmin } from '../middleware/isAdmin.js'
import {
  getStats, getAllOrders, updateOrderStatus,
  createProduct, updateProduct, deleteProduct
} from '../controllers/admin.controller.js'

const router = Router()
router.use(verifyToken, isAdmin)

router.get('/stats',               getStats)
router.get('/orders',              getAllOrders)
router.put('/orders/:id',          updateOrderStatus)
router.post('/products',           createProduct)
router.put('/products/:id',        updateProduct)
router.delete('/products/:id',     deleteProduct)

export default router