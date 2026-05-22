import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import pool from '../config/db.js'

const sign = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'dev_secret',
  { expiresIn: '7d' }
)

// Configure nodemailer transporter using environmental variables
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'yashisahay1204@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
})

export const register = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields required' })
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email])
    if (exists.rows.length) return res.status(409).json({ message: 'Email already registered' })

    const hash = await bcrypt.hash(password, 10)
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id,name,email,role',
      [name, email, hash]
    )
    res.status(201).json({ token: sign(rows[0]), user: rows[0] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email])
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, rows[0].password_hash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const { password_hash, ...user } = rows[0]
    res.json({ token: sign(user), user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMe = async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id,name,email,role,created_at FROM users WHERE id=$1', [req.user.id]
  )
  res.json(rows[0])
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body
  
  // 🚀 FORCED LOGGER SIGNALS:
  console.log("==========================================")
  console.log("📢 BACKEND HIT: forgotPassword route active!")
  console.log("Target email context:", email)
  console.log("Current SMTP Config User:", process.env.EMAIL_USER)

  try {
    const { rows } = await pool.query('SELECT id FROM users WHERE email=$1', [email])
    
    if (!rows.length) {
      console.log("⚠️ Database look-up completed: Email does not exist in records.");
      return res.json({ success: true, message: 'If that email exists, a reset link was sent.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + 1000 * 60 * 30// 30 Minute PostgreSQL Timestamp handler

    console.log("🔄 Querying Database: Updating reset token schemas...");
    await pool.query(
      'UPDATE users SET reset_token=$1, reset_token_expires=$2 WHERE email=$3',
      [token, expires, email]
    )
    console.log("✅ Database record synchronized perfectly.");

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const resetUrl = `${clientUrl}/reset-password?token=${token}`
    
    console.log("🔗 Generated absolute Reset URL direction:", resetUrl)
    console.log("✉️ Nodemailer handshaking with Google SMTP server...");

    await transporter.sendMail({
      from: `"ShopWave" <${process.env.EMAIL_USER || 'yashisahay1204@gmail.com'}>`,
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

    console.log("🎉 SMTP SUCCESS: Email safely deployed into the network loop.")
    res.json({ success: true, message: 'If that email exists, a reset link was sent.' })
  } catch (err) {
    console.error("❌ CRITICAL BACKEND EXCEPTION ENCOUNTERED:")
    console.error(err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

export const resetPassword = async (req, res) => {
  const { token, password } = req.body
  try {
    const { rows } = await pool.query(
      'SELECT id FROM users WHERE reset_token=$1 AND reset_token_expires > $2',
      [token, Date.now()]
    )
    if (!rows.length) return res.status(400).json({ message: 'Invalid or expired reset link.' })

    const hash = await bcrypt.hash(password, 10)
    await pool.query(
      'UPDATE users SET password_hash=$1, reset_token=NULL, reset_token_expires=NULL WHERE id=$2',
      [hash, rows[0].id]
    )
    res.json({ success: true, message: 'Password reset successfully.' })
  } catch (err) {
    console.error("RESET_PASSWORD_SERVER_ERROR:", err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}