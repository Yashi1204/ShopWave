import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm]         = useState({ email: '', password: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
    }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        background: 'linear-gradient(145deg, #1a3a6b 0%, #1a6bcc 60%, #0d7a5f 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -80, left: -80,
          width: 320, height: 320, borderRadius: '50%',
          border: '50px solid rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, right: -60,
          width: 400, height: 400, borderRadius: '50%',
          border: '60px solid rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: -40,
          width: 200, height: 200, borderRadius: '50%',
          border: '30px solid rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 340 }}>
          <div style={{
            fontSize: 32, fontWeight: 900, color: '#fff',
            letterSpacing: -1, marginBottom: 8,
          }}>
            🛍️ ShopWave
          </div>
          <div style={{
            width: 40, height: 3, background: 'rgba(255,255,255,0.4)',
            borderRadius: 2, margin: '0 auto 32px',
          }} />

          <h2 style={{
            fontSize: 28, fontWeight: 800, color: '#fff',
            margin: '0 0 14px', letterSpacing: -0.8, lineHeight: 1.15,
          }}>
            Your favourite<br />store, online.
          </h2>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7, margin: '0 0 48px',
          }}>
            Thousands of products across electronics, fashion, home & more — all in one place.
          </p>

          {[
            { icon: '🚚', text: 'Free delivery over ₹499' },
            { icon: '🔒', text: '100% secure payments'   },
            { icon: '↩️', text: '30-day easy returns'    },
          ].map(f => (
            <div key={f.text} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12, padding: '10px 16px',
              marginBottom: 10, textAlign: 'left',
            }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                {f.text}
              </span>
            </div>
          ))}

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: 12, marginTop: 32,
          }}>
            {[
              { val: '50K+', label: 'Customers' },
              { val: '1.2K+', label: 'Products'  },
              { val: '4.9★', label: 'Rating'    },
            ].map(s => (
              <div key={s.val} style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, padding: '12px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        background: '#f8faff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              fontSize: 28, fontWeight: 900, color: '#0f172a',
              margin: '0 0 8px', letterSpacing: -0.8,
            }}>Welcome back 👋</h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
              Sign in to continue to your account
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '10px 14px',
              fontSize: 13, color: '#dc2626',
              marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 600,
                color: '#374151', marginBottom: 7,
              }}>Email address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{
                  width: '100%', height: 48, borderRadius: 12,
                  border: '1.5px solid #e2e8f0',
                  padding: '0 16px', fontSize: 14,
                  color: '#1e293b', background: '#fff',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'all 0.15s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#1a6bcc'
                  e.target.style.boxShadow = '0 0 0 3px rgba(26,107,204,0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 32 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 7,
              }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{
                  fontSize: 12, color: '#1a6bcc',
                  fontWeight: 500, textDecoration: 'none',
                }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%', height: 48, borderRadius: 12,
                    border: '1.5px solid #e2e8f0',
                    padding: '0 46px 0 16px', fontSize: 14,
                    color: '#1e293b', background: '#fff',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'all 0.15s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#1a6bcc'
                    e.target.style.boxShadow = '0 0 0 3px rgba(26,107,204,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 17,
                    color: '#94a3b8', padding: 0, lineHeight: 1,
                  }}
                >{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 50, borderRadius: 12,
                background: loading ? '#93c5fd' : '#1a6bcc',
                border: 'none', color: '#fff',
                fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s', letterSpacing: 0.2,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1558a8' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1a6bcc' }}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
              new to shopwave?
            </span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <Link
            to="/register"
            style={{
              display: 'block', width: '100%', height: 50,
              borderRadius: 12, border: '1.5px solid #e2e8f0',
              background: '#fff', color: '#1a6bcc',
              fontSize: 15, fontWeight: 700,
              textDecoration: 'none', textAlign: 'center',
              lineHeight: '50px', transition: 'all 0.15s',
              boxSizing: 'border-box',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#1a6bcc'
              e.currentTarget.style.background = '#f0f7ff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e2e8f0'
              e.currentTarget.style.background = '#fff'
            }}
          >
            Create an account →
          </Link>

        </div>
      </div>
    </div>
  )
}