const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost', port: 5432,
  database: 'shopwave', user: 'postgres', password: 'shopwave123'
})

const updates = [
  ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 'iPhone 15 Pro'],
  ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 'Samsung Galaxy S24'],
  ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'Sony WH-1000XM5'],
  ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'MacBook Air M3'],
  ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 'iPad Pro 12.9'],
  ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Nike Air Max 270'],
  ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 'Levis 511 Slim Jeans'],
  ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400', 'Allen Solly Formal Shirt'],
  ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400', 'Adidas Ultraboost 22'],
  ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400', 'HM Hoodie'],
  ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=400', 'Instant Pot Duo 7-in-1'],
  ['https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400', 'Philips Air Fryer HD9252'],
  ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', 'IKEA KALLAX Shelf'],
  ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', 'Dyson V12 Detect Slim'],
  ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400', 'Prestige Induction Cooktop'],
  ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 'Clean Code by Robert Martin'],
  ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400', 'System Design Interview'],
  ['https://images.unsplash.com/photo-1598618443855-232ee0f819f6?w=400', 'Atomic Habits'],
  ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', 'The Pragmatic Programmer'],
  ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400', 'Nivia Storm Football'],
  ['https://images.unsplash.com/photo-1601925228008-8b1f5b2b4f1a?w=400', 'Decathlon Fitness Mat'],
  ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400', 'Yonex Arcsaber 11 Badminton'],
]

async function run() {
  for (const [url, name] of updates) {
    await pool.query('UPDATE products SET image_url=$1 WHERE name=$2', [url, name])
    console.log('Updated:', name)
  }
  console.log('All done!')
  await pool.end()
}

run().catch(console.error)