import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import { PRODUCT_IMAGES, CATEGORY_IMAGES } from '../components/ProductCard'
import { useCart } from '../context/CartContext'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    API.get('/wishlist').then(({ data }) => setItems(data)).finally(() => setLoading(false))
  }, [])

  const remove = async (productId) => {
    await API.post('/wishlist/toggle', { product_id: productId })
    setItems(prev => prev.filter(i => i.product_id !== productId))
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#1a6bcc', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>❤️ My Wishlist</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: 18, border: '1.5px solid #e2e8f0' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🤍</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Your wishlist is empty</h3>
          <p style={{ color: '#94a3b8', marginBottom: 20 }}>Save products you love and buy them later</p>
          <Link to="/" style={{ background: '#1a6bcc', color: '#fff', padding: '10px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {items.map(item => {
            const image = PRODUCT_IMAGES[item.name] || item.image_url || CATEGORY_IMAGES[item.category] || `https://picsum.photos/seed/${item.product_id}/400/300`
            return (
              <div key={item.id} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
                <Link to={`/products/${item.product_id}`}>
                  <div style={{ height: 160, background: '#f8fafc', overflow: 'hidden' }}>
                    <img src={image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.src = CATEGORY_IMAGES[item.category] }} />
                  </div>
                </Link>
                <div style={{ padding: 14 }}>
                  <Link to={`/products/${item.product_id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                  </Link>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1a6bcc', marginBottom: 12 }}>₹{Number(item.price).toLocaleString('en-IN')}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => addToCart(item.product_id)}
                      style={{ flex: 1, height: 36, background: '#1a6bcc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >Add to Cart</button>
                    <button
                      onClick={() => remove(item.product_id)}
                      style={{ width: 36, height: 36, background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}
                    >🗑</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}