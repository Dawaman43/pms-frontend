import { Router } from "express"
import Team from "../models/Team.js"
import User, { USER_ROLES } from "../models/User.js"
import { requireAuth, requireRole } from "../middleware/auth.js"

const router = Router()

// Create team
router.post("/", requireAuth, requireRole(USER_ROLES.ADMIN), async (req, res) => {
  const { name, department, description, leaderId } = req.body
  const team = await Team.create({ name, department, description, leader: leaderId || null, members: [] })
  if (leaderId) await User.findByIdAndUpdate(leaderId, { role: USER_ROLES.TEAM_LEADER, team: team._id })
  res.status(201).json(team)
})

// List teams
router.get("/", requireAuth, async (req, res) => {
  const teams = await Team.find().populate("leader", "firstName lastName").populate("members", "firstName lastName")
  res.json(teams)
})

// Update team and handle leader reassignment
router.put("/:id", requireAuth, requireRole(USER_ROLES.ADMIN), async (req, res) => {
  const { name, department, description, leaderId } = req.body
  const prev = await Team.findById(req.params.id)
  const team = await Team.findByIdAndUpdate(
    req.params.id,
    { name, department, description, leader: leaderId || null },
    { new: true },
  )
  if (leaderId && (!prev.leader || prev.leader.toString() !== leaderId)) {
    await User.updateMany({ team: team._id, role: USER_ROLES.TEAM_LEADER, _id: { $ne: leaderId } }, { role: USER_ROLES.TEAM_MEMBER })
    await User.findByIdAndUpdate(leaderId, { role: USER_ROLES.TEAM_LEADER, team: team._id })
  }
  res.json(team)
})

// Delete team
router.delete("/:id", requireAuth, requireRole(USER_ROLES.ADMIN), async (req, res) => {
  const team = await Team.findByIdAndDelete(req.params.id)
  if (team) await User.updateMany({ team: team._id }, { $unset: { team: 1 } })
  res.json({ message: "Deleted" })
})

// Assign member to team
router.post("/:id/assign", requireAuth, requireRole(USER_ROLES.ADMIN), async (req, res) => {
  const { userId } = req.body
  const team = await Team.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { members: userId } },
    { new: true },
  )
  await User.findByIdAndUpdate(userId, { team: req.params.id, role: USER_ROLES.TEAM_MEMBER })
  res.json(team)
})

export default router


