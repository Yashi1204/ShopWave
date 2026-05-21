import 'dotenv/config'
import app from './src/app.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 ShopWave server running on http://localhost:${PORT}`)
})