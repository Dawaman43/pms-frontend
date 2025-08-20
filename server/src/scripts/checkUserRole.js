import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"

// Load environment variables
dotenv.config({ path: "../.env" })

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.ATLAS_URI

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set")
  process.exit(1)
}

async function checkAndFixUserRole() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Find the user "Abenezer Abebe Arba"
    const user = await User.findOne({
      $or: [
        { firstName: "Abenezer", lastName: "Abebe Arba" },
        { firstName: "Abenezer", lastName: "Abebe" },
        { firstName: "Abenezer" }
      ]
    })

    if (!user) {
      console.log("User 'Abenezer Abebe Arba' not found")
      console.log("Available users:")
      const allUsers = await User.find({}, "firstName lastName email role")
      allUsers.forEach(u => console.log(`- ${u.firstName} ${u.lastName} (${u.email}) - Role: ${u.role}`))
      return
    }

    console.log("Found user:", {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      currentRole: user.role,
      team: user.team
    })

    // Check if role needs to be updated
    if (user.role !== "team_leader") {
      console.log(`Updating user role from '${user.role}' to 'team_leader'`)
      user.role = "team_leader"
      await user.save()
      console.log("Role updated successfully")
    } else {
      console.log("User already has correct role: team_leader")
    }

    // Check if user has a team
    if (!user.team) {
      console.log("User does not have a team assigned")
    } else {
      console.log("User has team assigned:", user.team)
    }

    console.log("User role check completed")

  } catch (error) {
    console.error("Error:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

checkAndFixUserRole()




