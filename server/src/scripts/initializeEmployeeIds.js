import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"
import Counter from "../models/Counter.js"

// Load environment variables
dotenv.config({ path: "../.env" })

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.ATLAS_URI

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set")
  process.exit(1)
}

async function initializeEmployeeIds() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Check if counter already exists
    let counter = await Counter.findOne({ name: "employeeId" })
    
    if (!counter) {
      // Initialize counter starting from 1
      counter = await Counter.create({ name: "employeeId", sequence: 1 })
      console.log("Created new employee ID counter starting from 1")
    } else {
      console.log("Employee ID counter already exists with sequence:", counter.sequence)
    }

    // Find all users without employee IDs
    const usersWithoutEmployeeId = await User.find({ employeeId: { $exists: false } })
    console.log(`Found ${usersWithoutEmployeeId.length} users without employee IDs`)

    if (usersWithoutEmployeeId.length > 0) {
      // Update existing users with sequential employee IDs
      for (const user of usersWithoutEmployeeId) {
        const sequenceNumber = counter.sequence.toString().padStart(4, '0')
        const employeeId = `ASTU-IC-${sequenceNumber}`
        
        await User.findByIdAndUpdate(user._id, { employeeId })
        console.log(`Updated user ${user.firstName} ${user.lastName} with employee ID: ${employeeId}`)
        
        // Increment counter
        counter.sequence += 1
        await counter.save()
      }
      
      console.log("All existing users have been updated with employee IDs")
    } else {
      console.log("All users already have employee IDs")
    }

    // Show current counter value
    const finalCounter = await Counter.findOne({ name: "employeeId" })
    console.log("Final employee ID counter sequence:", finalCounter.sequence)
    console.log("Next employee ID will be: ASTU-IC-" + finalCounter.sequence.toString().padStart(4, '0'))

    // Show all users with their employee IDs
    const allUsers = await User.find({}, "employeeId firstName lastName email role")
    console.log("\nAll users with employee IDs:")
    allUsers.forEach(u => {
      console.log(`- ${u.employeeId}: ${u.firstName} ${u.lastName} (${u.email}) - Role: ${u.role}`)
    })

  } catch (error) {
    console.error("Error:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

initializeEmployeeIds()




