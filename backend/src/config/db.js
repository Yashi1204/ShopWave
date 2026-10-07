import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pkg

const connectionString = process.env.DATABASE_URL

// Use SSL only for remote databases (like Render). Local PostgreSQL has no SSL.
function isLocalDatabase(url) {
  if (!url) return false
  try {
    const host = new URL(url).hostname
    return host === 'localhost' || host === '127.0.0.1' || host === '::1'
  } catch {
    return false
  }
}

const pool = new Pool({
  connectionString,
  ssl: isLocalDatabase(connectionString) ? false : { rejectUnauthorized: false }
})

pool.on('connect', () => console.log('✅ PostgreSQL connected'))
pool.on('error', (err) => console.error('❌ DB error:', err))

export default pool