import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { PRODUCT_IMAGES, CATEGORY_IMAGES } from '../components/ProductCard'

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            fontSize: readonly ? 14 : 22,
            cursor: readonly ? 'default' : 'pointer',
           color: star <= (hovered || value) ? '#f59e0b' : '#94a3b8',
            transition: 'color 0.1s',
          }}
        >★</span>
      ))}
    </div>
  )
}

export default function ProductDetail() {
  const { id }                      = useParams()
  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [qty, setQty]               = useState(1)
  const [reviews, setReviews]       = useState([])
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistIds, setWishlistIds] = useState([])
  const [myRating, setMyRating]     = useState(0)
  const [myComment, setMyComment]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { addToCart }               = useCart()
  const { user }                    = useAuth()
  const navigate                    = useNavigate()

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
    API.get(`/products/${id}/reviews`).then(({ data }) => setReviews(data))
    if (user) {
      API.get('/wishlist').then(({ data }) => {
        const ids = data.map(w => w.product_id)
        setWishlistIds(ids)
        setWishlisted(ids.includes(Number(id)))
      })
    }
  }, [id, user])

  const toggleWishlist = async () => {
    if (!user) return navigate('/login')
    const { data } = await API.post('/wishlist/toggle', { product_id: Number(id) })
    setWishlisted(data.wishlisted)
  }

  const submitReview = async () => {
    if (!myRating) return alert('Please select a rating')
    setSubmitting(true)
    try {
      await API.post(`/products/${id}/reviews`, { rating: myRating, comment: myComment })
      const { data } = await API.get(`/products/${id}/reviews`)
      setReviews(data)
      setMyRating(0)
      setMyComment('')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteReview = async (reviewId) => {
    await API.delete(`/products/${id}/reviews/${reviewId}`)
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
      <div style={{ width: 48, height: 48, border: '3px solid #e2e8f0', borderTopColor: '#1a6bcc', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const image = PRODUCT_IMAGES[product.name]
    || product.image_url
    || CATEGORY_IMAGES[product.category]
    || `https://picsum.photos/seed/${product.id}/600/500`

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <button onClick={() => navigate(-1)} style={{ fontSize: 14, color: '#1a6bcc', marginBottom: 20, background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>

      {/* Product card */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e2e8f0', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div style={{ height: 420, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img
            src={image} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: product.category === 'Books' ? 'contain' : 'cover', padding: product.category === 'Books' ? 24 : 0 }}
            onError={e => { e.target.onerror = null; e.target.src = CATEGORY_IMAGES[product.category] || `https://picsum.photos/seed/${product.id}/600/500` }}
          />
        </div>

        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#1a6bcc', background: '#eff6ff', padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>
                {product.category}
              </span>
              <button
                onClick={toggleWishlist}
                style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: wishlisted ? '#ef4444' : '#cbd5e1', transition: 'color 0.2s' }}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >{wishlisted ? '❤️' : '🤍'}</button>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{product.name}</h1>

            {avgRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <StarRating value={Math.round(avgRating)} readonly />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>{avgRating}</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>({reviews.length} reviews)</span>
              </div>
            )}

            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, marginBottom: 20 }}>{product.description}</p>
          </div>

          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Qty:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                <span style={{ padding: '8px 14px', fontWeight: 700, fontSize: 14 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} style={{ padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
              </div>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{product.stock} available</span>
            </div>
            <button
              disabled={product.stock === 0}
              onClick={() => user ? addToCart(product.id, qty) : navigate('/login')}
              style={{
                width: '100%', height: 48, background: product.stock === 0 ? '#f1f5f9' : '#1a6bcc',
                color: product.stock === 0 ? '#94a3b8' : '#fff', border: 'none',
                borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              }}
            >{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</button>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>
          Reviews {reviews.length > 0 && <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>({reviews.length})</span>}
        </h2>

        {/* Write review */}
        {user && (
          <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 16, padding: 20, marginBottom: 20 }}>
         <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Write a Review</div>
            <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: '#1e293b', marginBottom: 6, fontWeight: 600 }}>Your rating</div>
              <StarRating value={myRating} onChange={setMyRating} />
            </div>
            <textarea
              value={myComment}
              onChange={e => setMyComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              style={{
                width: '100%', borderRadius: 10,border: '1.5px solid #cbd5e1',
                padding: '10px 14px', fontSize: 14, resize: 'vertical',
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = '#1a6bcc'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              onClick={submitReview}
              disabled={submitting || !myRating}
              style={{
                marginTop: 10, padding: '8px 24px',background: submitting ? '#93c5fd' : '#1a6bcc',
color: '#fff',
opacity: !myRating ? 0.5 : 1,
                border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >{submitting ? 'Submitting...' : 'Submit Review'}</button>
          </div>
        )}

        {/* Review list */}
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 16, border: '1.5px solid #e2e8f0', color: '#94a3b8' }}>
            No reviews yet. Be the first to review!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map(r => (
              <div key={r.id} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#1a6bcc' }}>
                      {r.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{r.user_name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StarRating value={r.rating} readonly />
                    {user?.id === r.user_id && (
                      <button onClick={() => deleteReview(r.id)} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                    )}
                  </div>
                </div>
                {r.comment && <p style={{ fontSize: 14, color: '#475569', margin: 0, lineHeight: 1.6 }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}