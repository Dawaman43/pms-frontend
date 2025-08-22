import mongoose from "mongoose"

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    department: { type: String },
    description: { type: String },
  },
  { timestamps: true },
)

export default mongoose.model("Team", TeamSchema)


