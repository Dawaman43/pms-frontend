import { Router } from "express"
import Evaluation from "../models/Evaluation.js"
import User, { USER_ROLES } from "../models/User.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

// Create evaluation (leader for members; self or peer submissions allowed)
router.post("/", requireAuth, async (req, res) => {
  const { formType, evaluatorType, weight, evaluateeId, sections } = req.body
  const evaluation = await Evaluation.create({
    formType,
    evaluatorType,
    weight,
    evaluatee: evaluateeId,
    evaluator: req.user.id !== "admin" ? req.user.id : undefined,
    sections,
    status: "submitted",
  })
  res.status(201).json(evaluation)
})

// List evaluations (admin sees all, leader sees team, member sees own)
router.get("/", requireAuth, async (req, res) => {
  const me = await User.findById(req.user.id).populate("team")
  let query = {}
  if (req.user.role === USER_ROLES.ADMIN) {
    query = {}
  } else if (req.user.role === USER_ROLES.TEAM_LEADER && me?.team) {
    query = { evaluatee: { $in: me.team.members } }
  } else {
    query = { evaluatee: req.user.id }
  }
  const list = await Evaluation.find(query).sort({ createdAt: -1 })
  res.json(list)
})

export default router


