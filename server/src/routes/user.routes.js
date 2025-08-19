import { Router } from "express"
import bcrypt from "bcryptjs"
import multer from "multer"
import fs from "fs"
import path from "path"
import User, { USER_ROLES } from "../models/User.js"
import Team from "../models/Team.js"
import { requireAuth, requireRole } from "../middleware/auth.js"

const router = Router()

// Disk storage for profile images
const uploadsDir = path.resolve(process.cwd(), "server", "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = (file.originalname || "").split(".").pop()
    cb(null, `profile_${Date.now()}.${ext || "dat"}`)
  },
})
const upload = multer({ storage })

// Current user profile
router.get("/me", requireAuth, async (req, res) => {
  if (req.user.id === "admin") {
    return res.json({ id: "admin", email: process.env.ADMIN_EMAIL, role: USER_ROLES.ADMIN, firstName: "Admin", lastName: "User" })
  }
  const user = await User.findById(req.user.id).populate("team", "name members leader")
  if (!user) return res.status(404).json({ message: "Not found" })
  res.json(user)
})

// Create user (admin only)
router.post(
  "/",
  requireAuth,
  requireRole(USER_ROLES.ADMIN),
  async (req, res) => {
    const { firstName, lastName, email, password, role, teamId, phone, address, emergencyContact, salary, jobTitle, level, department } = req.body
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" })
    }
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: "User already exists" })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ firstName, lastName, email, passwordHash, role, team: teamId || null, phone, address, emergencyContact, salary, jobTitle, level, department })
    if (teamId) await Team.findByIdAndUpdate(teamId, { $addToSet: { members: user._id } })
    res.status(201).json(user)
  },
)

// Upload or change profile image
router.post("/:id/profile-image", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file?.filename) return res.status(400).json({ message: "Upload failed" })
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { profileImageId: req.file.filename },
    { new: true },
  )
  res.json({ profileImageId: user.profileImageId, url: `/uploads/${req.file.filename}` })
})

// Change password (self or admin)
router.post("/:id/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: "User not found" })
  if (req.user.role !== USER_ROLES.ADMIN) {
    const ok = await bcrypt.compare(currentPassword || "", user.passwordHash)
    if (!ok) return res.status(401).json({ message: "Current password incorrect" })
  }
  const passwordHash = await bcrypt.hash(newPassword, 10)
  await User.findByIdAndUpdate(user._id, { passwordHash })
  res.json({ message: "Password updated" })
})

// List, view, update, delete
router.get("/", requireAuth, requireRole(USER_ROLES.ADMIN), async (req, res) => {
  const users = await User.find().populate("team", "name")
  res.json(users)
})

router.get("/:id", requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id).populate("team", "name")
  if (!user) return res.status(404).json({ message: "Not found" })
  res.json(user)
})

router.put("/:id", requireAuth, requireRole(USER_ROLES.ADMIN), async (req, res) => {
  const { firstName, lastName, role, teamId, phone, address, emergencyContact, salary, jobTitle, level, department } = req.body
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { firstName, lastName, role, team: teamId || null, phone, address, emergencyContact, salary, jobTitle, level, department },
    { new: true },
  )
  res.json(user)
})

router.delete("/:id", requireAuth, requireRole(USER_ROLES.ADMIN), async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (user?.team) await Team.findByIdAndUpdate(user.team, { $pull: { members: user._id } })
  res.json({ message: "Deleted" })
})

export default router


