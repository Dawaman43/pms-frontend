import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User, { USER_ROLES } from "../models/User.js"

const router = Router()

// Admin bootstrap login using ADMIN_EMAIL/ADMIN_PASSWORD
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: "Email and password required" })

  // Admin from env
  if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: "Invalid credentials" })
    const token = jwt.sign(
      { id: "admin", role: USER_ROLES.ADMIN, email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    )
    return res.json({ token, user: { id: "admin", email, role: USER_ROLES.ADMIN, firstName: "Admin", lastName: "User" } })
  }

  // Regular users
  console.log("Attempting login for email:", email)
  const user = await User.findOne({ email })
  if (!user) {
    console.log("User not found for email:", email)
    return res.status(401).json({ message: "Invalid credentials" })
  }
  console.log("User found:", user.email, user.role, "Password hash exists:", !!user.passwordHash)
  const valid = await bcrypt.compare(password, user.passwordHash)
  console.log("Password comparison result:", valid)
  if (!valid) return res.status(401).json({ message: "Invalid credentials" })

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  )
  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      team: user.team,
      profileImageId: user.profileImageId,
    },
  })
})

export default router


