import jwt from "jsonwebtoken"

export const requireAuth = (req, res, next) => {
  console.log("Auth middleware - headers:", req.headers.authorization ? "Authorization header present" : "No authorization header");
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.substring(7) : null
  if (!token) {
    console.log("Auth middleware - No token found");
    return res.status(401).json({ message: "Unauthorized" })
  }
  try {
    console.log("Auth middleware - Verifying token...");
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Auth middleware - Token verified, user:", payload.id, payload.role);
    req.user = payload
    next()
  } catch (e) {
    console.log("Auth middleware - Token verification failed:", e.message);
    return res.status(401).json({ message: "Invalid token" })
  }
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" })
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" })
  next()
}


