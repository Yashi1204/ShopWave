import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total } = useCart()

  if (cart.length === 0) return (
    <div className="text-center py-24">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
      <Link to="/" className="text-blue-600 hover:underline text-sm">Continue shopping</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-4 mb-6">
        {cart.map(item => (
          <div key={item.product_id} className="bg-white rounded-xl border p-4 flex gap-4">
            <img
              src={item.image_url || `https://picsum.photos/seed/${item.product_id}/100`}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{item.name}</h3>
              <p className="text-blue-600 font-semibold mt-1">₹{Number(item.price).toLocaleString('en-IN')}</p>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">−</button>
                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">+</button>
                <button onClick={() => removeFromCart(item.product_id)} className="ml-4 text-red-400 hover:text-red-600 text-sm">Remove</button>
              </div>
            </div>
            <div className="font-bold text-gray-900">
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>
        <Link to="/checkout" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-medium transition">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}