import { useState, useEffect } from 'react'
import API from '../api/axios'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'

const CATEGORY_COLORS = {
  'Electronics': { color: '#1a6bcc', bg: '#eff6ff', border: '#bfdbfe' },
  'Fashion':     { color: '#9333ea', bg: '#fdf4ff', border: '#e9d5ff' },
  'Home & Kitchen': { color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
  'Books':       { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  'Sports':      { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  'Beauty':      { color: '#db2777', bg: '#fdf2f8', border: '#fbcfe8' },
  'Groceries':   { color: '#65a30d', bg: '#f7fee7', border: '#d9f99d' },
}

const CATEGORY_ICONS = {
  'Electronics': '💻',
  'Fashion':     '👗',
  'Home & Kitchen': '🏠',
  'Books':       '📚',
  'Sports':      '⚽',
  'Beauty':      '💄',
  'Groceries':   '🛒',
}

export default function Home() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy]         = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/products', {
        params: {
          search,
          category,
          minPrice: priceRange.min || undefined,
          maxPrice: priceRange.max || undefined,
        }
      })
      let results = data.products || []
      if (sortBy === 'price_asc')  results = [...results].sort((a, b) => a.price - b.price)
      if (sortBy === 'price_desc') results = [...results].sort((a, b) => b.price - a.price)
      if (sortBy === 'name')       results = [...results].sort((a, b) => a.name.localeCompare(b.name))
      setProducts(results)
      setCategories(data.categories || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [category, sortBy])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a6bcc 0%, #1e40af 100%)',
        borderRadius: 20, padding: '48px 40px', marginBottom: 32,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: 80,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 8px', position: 'relative' }}>
          Welcome to ShopWave 🛍️
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: '0 0 28px', position: 'relative' }}>
          Discover thousands of products at unbeatable prices
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', maxWidth: 520 }}>
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: 50, borderRadius: 14,
              border: 'none', outline: 'none',
              paddingLeft: 48, paddingRight: 110,
              fontSize: 14, fontWeight: 500, color: '#0f172a',
              background: '#fff', boxSizing: 'border-box',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <span style={{
            position: 'absolute', left: 16, top: '50%',
            transform: 'translateY(-50%)', fontSize: 18,
          }}>🔍</span>
          <button
            type="submit"
            style={{
              position: 'absolute', right: 6, top: 6,
              height: 38, padding: '0 20px',
              background: '#1a6bcc', color: '#fff',
              border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >Search</button>
        </form>
      </div>

      {/* ── FILTERS BAR ── */}
      <div id="products-section" style={{ marginBottom: 18 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14, flexWrap: 'wrap', gap: 10,
        }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
              {category ? category : search ? 'Search Results' : 'All Products'}
            </h2>
            {search && (
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                Results for "<span style={{ color: '#1a6bcc', fontWeight: 700 }}>{search}</span>"
                {' '}— {products.length} found
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Price range */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#fff', border: '1.5px solid #e2e8f0',
              borderRadius: 10, padding: '6px 12px',
            }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>₹</span>
              <input
                type="number" placeholder="Min"
                value={priceRange.min}
                onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && fetchProducts()}
                style={{
                  width: 60, border: 'none', outline: 'none',
                  fontSize: 13, color: '#0f172a', background: 'transparent',
                }}
              />
              <span style={{ color: '#cbd5e1' }}>—</span>
              <input
                type="number" placeholder="Max"
                value={priceRange.max}
                onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && fetchProducts()}
                style={{
                  width: 60, border: 'none', outline: 'none',
                  fontSize: 13, color: '#0f172a', background: 'transparent',
                }}
              />
              <button
                onClick={fetchProducts}
                style={{
                  background: '#1a6bcc', color: '#fff', border: 'none',
                  borderRadius: 6, padding: '3px 10px',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
              >Go</button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                border: '1.5px solid #e2e8f0', borderRadius: 10,
                padding: '8px 12px', fontSize: 13, color: '#0f172a',
                background: '#fff', outline: 'none', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <option value="">Sort: Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>

            {(category || search || priceRange.min || priceRange.max || sortBy) && (
              <button
                onClick={() => {
                  setCategory('')
                  setSearch('')
                  setPriceRange({ min: '', max: '' })
                  setSortBy('')
                }}
                style={{
                  background: '#fff', border: '1.5px solid #e2e8f0',
                  borderRadius: 10, padding: '8px 14px',
                  fontSize: 12, color: '#64748b', cursor: 'pointer', fontWeight: 600,
                }}
              >✕ Clear all</button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {['All', ...categories].map(cat => {
            const active = cat === 'All' ? category === '' : category === cat
            const c = CATEGORY_COLORS[cat]
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                style={{
                  padding: '7px 18px', borderRadius: 20,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6,
                  border: active ? 'none' : '1.5px solid #e2e8f0',
                  background: active ? (c ? c.color : '#1a6bcc') : '#fff',
                  color: active ? '#fff' : '#64748b',
                  boxShadow: active ? `0 4px 12px ${c ? c.color : '#1a6bcc'}33` : 'none',
                  transform: active ? 'translateY(-1px)' : 'none',
                }}
              >
                {cat !== 'All' && CATEGORY_ICONS[cat] && <span>{CATEGORY_ICONS[cat]}</span>}
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '5rem 2rem',
          background: '#fff', borderRadius: 18, border: '1.5px solid #e2e8f0',
        }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            No products found
          </h3>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px' }}>
            Try adjusting your filters
          </p>
          <button
            onClick={() => {
              setSearch('')
              setCategory('')
              setPriceRange({ min: '', max: '' })
              setSortBy('')
            }}
            style={{
              background: '#1a6bcc', border: 'none', borderRadius: 9,
              padding: '10px 26px', fontSize: 13, color: '#fff',
              fontWeight: 700, cursor: 'pointer',
            }}
          >Browse all products</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}