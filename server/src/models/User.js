import mongoose from "mongoose"

export const USER_ROLES = {
  ADMIN: "admin",
  TEAM_LEADER: "team_leader",
  TEAM_MEMBER: "team_member",
}

const UserSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(USER_ROLES), required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    profileImageId: { type: String },
    jobTitle: { type: String },
    level: { type: String },
    department: { type: String },
    phone: { type: String },
    address: { type: String },
    emergencyContact: { type: String },
    salary: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.model("User", UserSchema)


