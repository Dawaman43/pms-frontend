import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import path from "path"
import { fileURLToPath } from "url"

import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from "./src/routes/user.routes.js"
import teamRoutes from "./src/routes/team.routes.js"
import evaluationRoutes from "./src/routes/evaluation.routes.js"
import reportRoutes from "./src/routes/report.routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env from server/.env first, then fallback to root .env
dotenv.config({ path: path.join(__dirname, ".env") })
dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static("server/uploads"))

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/teams", teamRoutes)
app.use("/api/evaluations", evaluationRoutes)
app.use("/api/reports", reportRoutes)

// DB
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.ATLAS_URI
if (!mongoUri) {
  console.error("MONGODB_URI is not set")
  process.exit(1)
}

mongoose
  .connect(mongoUri)
  .then(() => {
    const port = process.env.PORT || 5000
    app.listen(port, () => console.log(`API server listening on ${port}`))
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err)
    process.exit(1)
  })


