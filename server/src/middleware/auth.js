import jwt from "jsonwebtoken"

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.substring(7) : null
  if (!token) return res.status(401).json({ message: "Unauthorized" })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" })
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" })
  next()
}


