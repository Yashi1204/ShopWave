import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' })

  const token = header.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Admin access required' })
  next()
}