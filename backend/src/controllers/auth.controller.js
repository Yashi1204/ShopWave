import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Resend } from 'resend'
import pool from '../config/db.js'

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: JWT_SECRET is not set. Set it in your environment settings.')
}

const sign = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'dev_secret',
  { expiresIn: '7d' }
)

// The email client is created only when an email is actually sent,
// so a missing key can never stop the server from starting.
let resendClient = null
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set')
  }
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY)
  return resendClient
}

export const register = async (req, res) => {
  const { name, email, password } = req.body || {}
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' })
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email])
    if (exists.rows.length) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const hash = await bcrypt.hash(password, 10)
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id,name,email,role',
      [name, email, hash]
    )
    res.status(201).json({ token: sign(rows[0]), user: rows[0] })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already registered' })
    }
    console.error('register error:', err)
    res.status(500).json({ message: 'Could not create account' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  try {
    const { rows } = await pool.query(
      'SELECT id,name,email,role,created_at,password_hash FROM users WHERE email=$1',
      [email]
    )
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, rows[0].password_hash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const { password_hash, ...user } = rows[0]
    res.json({ token: sign(user), user })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ message: 'Could not log in' })
  }
}

export const getMe = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id,name,email,role,created_at FROM users WHERE id=$1',
      [req.user.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'User not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('getMe error:', err)
    res.status(500).json({ message: 'Could not load profile' })
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body || {}
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' })
  }

  try {
    const { rows } = await pool.query('SELECT id FROM users WHERE email=$1', [email])

    if (!rows.length) {
      return res.json({ success: true, message: 'If that email exists, a reset link was sent.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + 1000 * 60 * 30

    await pool.query(
      'UPDATE users SET reset_token=$1, reset_token_expires=$2 WHERE email=$3',
      [token, expires, email]
    )

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const resetUrl = `${clientUrl}/reset-password?token=${token}`

    const result = await getResend().emails.send({
      from: 'ShopWave <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your ShopWave password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8faff;border-radius:12px">
          <h2 style="color:#1a6bcc;margin-bottom:8px">Reset your password</h2>
          <p style="color:#64748b">Click the button below to reset your password. This link expires in <strong>30 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#1a6bcc;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:12px">If you didn't request this, ignore this email.</p>
        </div>
      `,
    })

    if (result && result.error) {
      throw new Error(result.error.message || 'Email provider rejected the message')
    }

    res.json({ success: true, message: 'If that email exists, a reset link was sent.' })
  } catch (err) {
    console.error('forgotPassword error:', err.message)
    res.status(500).json({ success: false, message: 'Could not send the reset email' })
  }
}

export const resetPassword = async (req, res) => {
  const { token, password } = req.body || {}
  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Token and new password required' })
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
  }

  try {
    const { rows } = await pool.query(
      'SELECT id FROM users WHERE reset_token=$1 AND reset_token_expires > $2',
      [token, Date.now()]
    )
    if (!rows.length) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' })
    }

    const hash = await bcrypt.hash(password, 10)
    await pool.query(
      'UPDATE users SET password_hash=$1, reset_token=NULL, reset_token_expires=NULL WHERE id=$2',
      [hash, rows[0].id]
    )
    res.json({ success: true, message: 'Password reset successfully.' })
  } catch (err) {
    console.error('resetPassword error:', err)
    res.status(500).json({ success: false, message: 'Could not reset password' })
  }
}