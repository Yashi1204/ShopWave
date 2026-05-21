const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost', port: 5432,
  database: 'shopwave', user: 'postgres', password: 'shopwave123'
})

const updates = [
  ['https://fakestoreapi.com/img/81fAn9e5nl.jpg', 'iPhone 15 Pro'],
  ['https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg', 'Samsung Galaxy S24'],
  ['https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', 'Sony WH-1000XM5'],
  ['https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg', 'MacBook Air M3'],
  ['https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', 'iPad Pro 12.9'],
  ['https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', 'Nike Air Max 270'],
  ['https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', 'Levis 511 Slim Jeans'],
  ['https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg', 'Allen Solly Formal Shirt'],
  ['https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg', 'Adidas Ultraboost 22'],
  ['https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg', 'HM Hoodie'],
  ['https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg', 'Instant Pot Duo 7-in-1'],
  ['https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg', 'Philips Air Fryer HD9252'],
  ['https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_FMwebp_QL65_.jpg', 'IKEA KALLAX Shelf'],
  ['https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg', 'Dyson V12 Detect Slim'],
  ['https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg', 'Prestige Induction Cooktop'],
  ['https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg', 'Clean Code by Robert Martin'],
  ['https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg', 'System Design Interview'],
  ['https://fakestoreapi.com/img/71kEqp3aZaL._AC_SX679_.jpg', 'Atomic Habits'],
  ['https://fakestoreapi.com/img/51UDEzMJVpL._AC_SX679_.jpg', 'The Pragmatic Programmer'],
  ['https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg', 'Yonex Arcsaber 11 Badminton'],
  ['https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', 'Decathlon Fitness Mat'],
  ['https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', 'Nivia Storm Football'],
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