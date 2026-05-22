import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API from '../api/axios'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const DELIVERY_CHARGE = 49
  const isFreeDelivery = total >= 499
  const deliveryCharge = isFreeDelivery ? 0 : DELIVERY_CHARGE
  const finalTotal = total + deliveryCharge

  const loadRazorpayScript = () =>
    new Promise(resolve => {
      if (document.getElementById('razorpay-script')) return resolve(true)
      const script = document.createElement('script')
      script.id = 'razorpay-script'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const handleOrder = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return

    setLoading(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) return alert('Failed to load Razorpay. Check your internet.')

      const { data } = await API.post('/orders/create-razorpay-order', { total_amount: finalTotal })

      const shippingAddress = `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Sr8NomCnLsssZz',
        amount: data.amount,
        currency: data.currency,
        name: 'ShopWave',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await API.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price })),
              total_amount: finalTotal,
              shipping_address: shippingAddress,
            })
            clearCart()
            setSuccess(true)
            setTimeout(() => navigate('/orders'), 2500)
          } catch (err) {
            alert('Payment verified but order save failed. Contact support.')
          }
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#1a6bcc' },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => {
        alert('Payment failed: ' + resp.error.description)
      })
      rzp.open()
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', marginBottom: 8 }}>Payment Successful!</h2>
      <p style={{ color: '#64748b' }}>Your order has been placed. Redirecting to orders...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>Checkout</h1>

      <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Order Summary</h2>
        {cart.map(item => (
          <div key={item.product_id} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 14, padding: '10px 0',
            borderBottom: '1px solid #f1f5f9',
          }}>
            <span style={{ color: '#334155' }}>{item.name} × {item.quantity}</span>
            <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
          </div>
        ))}

        {/* Subtotal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b', marginTop: 14 }}>
          <span>Subtotal</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>

        {/* Delivery */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 8, alignItems: 'center' }}>
          <span style={{ color: '#64748b' }}>Delivery</span>
          {isFreeDelivery ? (
            <span style={{ color: '#16a34a', fontWeight: 700 }}>FREE</span>
          ) : (
            <span style={{ color: '#334155', fontWeight: 600 }}>₹{DELIVERY_CHARGE}</span>
          )}
        </div>

        {/* Free delivery nudge */}
        {!isFreeDelivery && (
          <div style={{
            marginTop: 10, padding: '8px 12px',
            background: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: 8, fontSize: 12, color: '#92400e',
          }}>
            🚚 Add ₹{(499 - total).toLocaleString('en-IN')} more for FREE delivery
          </div>
        )}

        {/* Final total */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 17, fontWeight: 800, marginTop: 14,
          paddingTop: 14, borderTop: '1.5px solid #e2e8f0',
        }}>
          <span>Total</span>
          <span style={{ color: '#1a6bcc' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <form onSubmit={handleOrder} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Shipping Address</h2>
        {[['street','Street Address'],['city','City'],['state','State'],['pincode','Pincode']].map(([field, label]) => (
          <div key={field} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>{label}</label>
            <input
              required
              value={address[field]}
              onChange={e => setAddress({ ...address, [field]: e.target.value })}
              style={{
                width: '100%', height: 42, borderRadius: 9,
                border: '1.5px solid #e2e8f0', padding: '0 12px',
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#1a6bcc'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading || cart.length === 0}
          style={{
            width: '100%', height: 48, background: loading ? '#93c5fd' : '#1a6bcc',
            color: '#fff', border: 'none', borderRadius: 11,
            fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: 8, transition: 'background 0.15s',
          }}
        >
          {loading ? 'Opening Payment...' : `Pay ₹${finalTotal.toLocaleString('en-IN')} →`}
        </button>
      </form>
    </div>
  )
}