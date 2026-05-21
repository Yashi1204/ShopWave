import Redis from 'ioredis'
import dotenv from 'dotenv'
dotenv.config()

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  lazyConnect: true,
})

redis.on('connect', () => console.log('✅ Redis connected'))
redis.on('error',   (err) => console.warn('⚠️  Redis error (cart will use memory):', err.message))

export default redis