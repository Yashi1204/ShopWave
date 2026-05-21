import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from '../utils/toast'

export const PRODUCT_IMAGES = {
  'iPhone 15 Pro':              'https://images.unsplash.com/photo-1574755393849-623942496936?w=400',
  'Samsung Galaxy S24':         'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400',
  'Sony WH-1000XM5':            'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
  'MacBook Air M3':             'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
  'iPad Pro 12.9"':             'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
  'Nike Air Max 270':           'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  "Levi's 511 Slim Jeans":      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
  'Allen Solly Formal Shirt':   'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
  'Adidas Ultraboost 22':       'https://images.unsplash.com/photo-1580980379270-cf860f6db3c2?w=400',
  'H&M Hoodie':                 'https://images.unsplash.com/photo-1738486260590-23c954cf29b8?w=400',
  'Instant Pot Duo 7-in-1':     'https://images.unsplash.com/photo-1593759608142-e976b3b60e5d?w=400',
  'Philips Air Fryer HD9252':   'https://images.unsplash.com/photo-1695089028114-ce28248f0ab9?w=400',
  'IKEA KALLAX Shelf':          'https://images.unsplash.com/photo-1768430309142-632889e10e86?w=400',
  'Dyson V12 Detect Slim':      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400',
  'Prestige Induction Cooktop': 'https://plus.unsplash.com/premium_photo-1661301169162-b16262262d17?w=400',
  'Clean Code by Robert Martin':'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
  'System Design Interview':    'https://covers.openlibrary.org/b/isbn/9798664653403-L.jpg',
  'Atomic Habits':              'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
  'The Pragmatic Programmer':   'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg',
  'Yonex Arcsaber 11 Badminton':'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400',
  'Decathlon Fitness Mat':      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
  'Nivia Storm Football':       'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400',
  'Maybelline Fit Me Foundation':'https://plus.unsplash.com/premium_photo-1673628167571-532a6c5f5d16?w=400',
  'Lakme Eyeconic Kajal':       'https://plus.unsplash.com/premium_photo-1661768065574-c2a463343342?w=400',
  'LOreal Paris Serum':         'https://plus.unsplash.com/premium_photo-1674739375749-7efe56fc8bbb?w=400',
  'Neutrogena Face Wash':       'https://images.unsplash.com/photo-1594332322527-08753d4473c1?w=400',
  'Nescafe Classic Coffee':     'https://images.unsplash.com/photo-1632054010678-7f2e5a1a7355?w=400',
  'Tata Salt 1kg':              'https://images.unsplash.com/photo-1580342583494-9fbf0fd15d5c?w=400',
  'Amul Butter 500g':           'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
  'Maggi Noodles Pack of 12':   'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
  'boAt Airdopes 141':          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
  'Noise ColorFit Pro 4':       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
}

export const CATEGORY_IMAGES = {
  'Electronics':    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
  'Fashion':        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
  'Books':          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
  'Sports':         'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
}

export function ProductCardSkeleton() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{
        height: 192, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)',
        backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
      }} />
      <div style={{ padding: 16 }}>
        <div style={{ height: 9, width: '40%', borderRadius: 6, background: '#f1f5f9', marginBottom: 10 }} />
        <div style={{ height: 13, borderRadius: 6, background: '#f1f5f9', marginBottom: 6 }} />
        <div style={{ height: 13, width: '70%', borderRadius: 6, background: '#f1f5f9', marginBottom: 14 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ height: 20, width: '35%', borderRadius: 6, background: '#f1f5f9' }} />
          <div style={{ height: 20, width: '30%', borderRadius: 6, background: '#f1f5f9' }} />
        </div>
        <div style={{ height: 36, borderRadius: 9, background: '#f1f5f9' }} />
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addToCart }   = useCart()
  const { user }        = useAuth()
  const navigate        = useNavigate()
  const [adding, setAdding] = useState(false)

  const image = PRODUCT_IMAGES[product.name]
    || product.image_url
    || CATEGORY_IMAGES[product.category]
    || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'

  const handleAdd = async () => {
    if (!user) return navigate('/login')
    if (product.stock === 0) return
    setAdding(true)
    try {
      await addToCart(product.id)
      toast(`${product.name.slice(0, 28)}... added to cart`, 'cart')
    } catch {
      toast('Failed to add to cart', 'error')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 14,
      border: '1.5px solid #e2e8f0', overflow: 'hidden',
      transition: 'box-shadow 0.2s, transform 0.2s',
      fontFamily: "'DM Sans', sans-serif",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <Link to={`/products/${product.id}`}>
        <div style={{ height: 192, background: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
          <img
            src={image}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: product.category === 'Books' ? 'contain' : 'cover',
              padding: product.category === 'Books' ? 8 : 0,
              transition: 'transform 0.3s',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            onError={e => { e.target.onerror = null; e.target.src = CATEGORY_IMAGES[product.category] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }}
          />
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', background: '#fff', padding: '4px 12px', borderRadius: 20, border: '1.5px solid #fca5a5' }}>Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div style={{ padding: 14 }}>
        <span style={{ fontSize: 11, color: '#1a6bcc', background: '#eff6ff', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
          {product.category}
        </span>
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            marginTop: 8, fontSize: 14, fontWeight: 700, color: '#0f172a',
            lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
            background: product.stock > 0 ? '#f0fdf4' : '#fef2f2',
            color: product.stock > 0 ? '#15803d' : '#b91c1c',
          }}>
            {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
          </span>
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0 || adding}
          style={{
            width: '100%', height: 38,
            background: product.stock === 0 ? '#f1f5f9' : adding ? '#93c5fd' : '#1a6bcc',
            color: product.stock === 0 ? '#94a3b8' : '#fff',
            border: 'none', borderRadius: 9,
            fontSize: 13, fontWeight: 700,
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : !user ? 'Login to Buy' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}