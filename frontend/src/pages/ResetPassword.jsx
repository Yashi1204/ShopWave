import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import API from '../api/axios'

export default function ResetPassword() {
  const [searchParams]        = useSearchParams()
  const token                 = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState('')
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 6)  return setError('Password must be at least 6 characters')
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/reset-password', { token, password })
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f8faff',
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: '#fff',
        borderRadius: 16, padding: 40,
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Password reset!</h2>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
              Redirecting you to login in 3 seconds…
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Set new password</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Choose a strong new password for your account.
            </p>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 10, padding: '10px 14px',
                fontSize: 13, color: '#dc2626', marginBottom: 20,
              }}>⚠️ {error}</div>
            )}

            {!token ? (
              <p style={{ color: '#dc2626', fontSize: 14 }}>
                Invalid reset link. <Link to="/forgot-password" style={{ color: '#1a6bcc' }}>Request a new one</Link>
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7 }}>
                  New password
                </label>
                <input
                  type="password" required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%', height: 48, borderRadius: 12,
                    border: '1.5px solid #e2e8f0', padding: '0 16px',
                    fontSize: 14, color: '#1e293b', background: '#fff',
                    outline: 'none', boxSizing: 'border-box', marginBottom: 16,
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
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7 }}>
                  Confirm password
                </label>
                <input
                  type="password" required
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={{
                    width: '100%', height: 48, borderRadius: 12,
                    border: '1.5px solid #e2e8f0', padding: '0 16px',
                    fontSize: 14, color: '#1e293b', background: '#fff',
                    outline: 'none', boxSizing: 'border-box', marginBottom: 24,
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
                  type="submit" disabled={loading}
                  style={{
                    width: '100%', height: 50, borderRadius: 12,
                    background: loading ? '#93c5fd' : '#1a6bcc',
                    border: 'none', color: '#fff',
                    fontSize: 15, fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Resetting…' : 'Reset password →'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}