import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await API.post('/auth/forgot-password', { email })
      if (response.status === 200) {
        setMessage('A password reset link has been sent to your email.')
        setEmail('')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot Password</h2>
        <p className="text-sm text-gray-500 mt-2">
          Enter your registered email and we'll send you a link to reset your password.
        </p>
      </div>

      {message && (
        <div className="mb-4 p-4 text-sm text-green-700 bg-green-50 rounded-xl border border-green-200">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 disabled:bg-gray-100"
            placeholder="name@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all duration-150 flex justify-center items-center ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="text-center mt-6 border-t border-gray-100 pt-4">
        <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Back to Login
        </Link>
      </div>
    </div>
  )
}