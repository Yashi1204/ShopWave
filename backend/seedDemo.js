import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedDemoUsers() {
  const hash = await bcrypt.hash('Demo@1234', 10);

  await pool.query(`
    INSERT INTO users (name, email, password_hash, role)
    VALUES
      ('Demo Customer', 'customer@shopwave.com', $1, 'customer'),
      ('Demo Admin',    'admin@shopwave.com',    $1, 'admin')
    ON CONFLICT (email) DO NOTHING;
  `, [hash]);

  console.log('Demo users created successfully');
  console.log('customer@shopwave.com / Demo@1234');
  console.log('admin@shopwave.com    / Demo@1234');
  await pool.end();
}

seedDemoUsers().catch(console.error);