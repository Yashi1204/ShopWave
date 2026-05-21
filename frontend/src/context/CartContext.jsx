import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart]         = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const { token }               = useAuth()

  useEffect(() => { if (token) fetchCart() }, [token])

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/cart')
      setCart(data.items || [])
    } catch {}
  }

  const addToCart = async (productId, quantity = 1) => {
    // Optimistic update
    setCart(prev => {
      const exists = prev.find(i => i.product_id === productId)
      if (exists) return prev.map(i => i.product_id === productId ? { ...i, quantity: i.quantity + quantity } : i)
      return [...prev, { product_id: productId, quantity, price: 0, name: '...', _optimistic: true }]
    })
    setCartOpen(true)
    try {
      const { data } = await API.post('/cart', { productId, quantity })
      setCart(data.items)
    } catch {
      fetchCart() // rollback on error
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId)
    // Optimistic update
    setCart(prev => prev.map(i => i.product_id === productId ? { ...i, quantity } : i))
    try {
      const { data } = await API.put('/cart', { productId, quantity })
      setCart(data.items)
    } catch {
      fetchCart()
    }
  }

  const removeFromCart = async (productId) => {
    // Optimistic update
    setCart(prev => prev.filter(i => i.product_id !== productId))
    try {
      const { data } = await API.delete(`/cart/${productId}`)
      setCart(data.items)
    } catch {
      fetchCart()
    }
  }

  const clearCart = () => setCart([])

  const total     = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)