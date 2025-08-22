import { Router } from "express"
import Evaluation from "../models/Evaluation.js"
import User from "../models/User.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.get("/summary", requireAuth, async (req, res) => {
  const [employees, evaluations] = await Promise.all([User.countDocuments(), Evaluation.countDocuments()])
  res.json({ employees, evaluations })
})

export default router


