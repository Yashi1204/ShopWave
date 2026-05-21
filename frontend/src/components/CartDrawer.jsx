import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { PRODUCT_IMAGES } from './ProductCard'
import { toast } from '../utils/toast'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart, total } = useCart()

  if (!cartOpen) return null

  const handleRemove = (item) => {
    removeFromCart(item.product_id)
    toast(`${item.name.slice(0,28)}... removed`, 'info')
  }

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
        onClick={() => setCartOpen(false)}
      />
      <div style={{
        position: 'fixed', right: 0, top: 0, height: '100%',
        width: '100%', maxWidth: 420, background: '#fff',
        boxShadow: '-4px 0 40px rgba(0,0,0,0.12)', zIndex: 50,
        display: 'flex', flexDirection: 'column',
        fontFamily: "'DM Sans', sans-serif",
        animation: 'drawerIn 0.25s ease',
      }}>
        <style>{`@keyframes drawerIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>Your Cart</h2>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            style={{ width: 34, height: 34, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p style={{ fontWeight: 600 }}>Your cart is empty</p>
            </div>
          ) : cart.map(item => (
            <div key={item.product_id} style={{
              display: 'flex', gap: 12, background: '#f8fafc',
              borderRadius: 14, padding: 12, border: '1px solid #f1f5f9',
            }}>
              <img
                src={PRODUCT_IMAGES[item.name] || item.image_url || `https://picsum.photos/seed/${item.product_id}/100/100`}
                alt={item.name}
                style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#1a6bcc', margin: '0 0 8px' }}>₹{Number(item.price).toLocaleString('en-IN')}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    style={{ width: 26, height: 26, borderRadius: '50%', background: '#e2e8f0', border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >−</button>
                  <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    style={{ width: 26, height: 26, borderRadius: '50%', background: '#e2e8f0', border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >+</button>
                  <button
                    onClick={() => handleRemove(item)}
                    style={{ marginLeft: 'auto', fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
              <span>Total</span>
              <span style={{ color: '#1a6bcc' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              style={{
                display: 'block', width: '100%', height: 48, background: '#1a6bcc',
                color: '#fff', textAlign: 'center', lineHeight: '48px',
                borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}
            >Proceed to Checkout →</Link>
          </div>
        )}
      </div>
    </>
  )
}