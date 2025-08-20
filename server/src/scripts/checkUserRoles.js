import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User, { USER_ROLES } from '../models/User.js'

// Load environment variables
dotenv.config({ path: './server/.env' })

async function checkAndFixUserRoles() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.ATLAS_URI
    if (!mongoUri) {
      console.error('MONGODB_URI is not set')
      process.exit(1)
    }
    
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')
    
    // Check all users and their roles
    const users = await User.find({})
    console.log('\n=== Current Users and Roles ===')
    
    users.forEach(user => {
      console.log(`ID: ${user._id}`)
      console.log(`Name: ${user.firstName} ${user.lastName}`)
      console.log(`Email: ${user.email}`)
      console.log(`Role: ${user.role}`)
      console.log(`Team: ${user.team || 'None'}`)
      console.log('---')
    })
    
    // Check for users that should be team leaders but aren't
    const potentialTeamLeaders = users.filter(user => 
      user.email.includes('leader') || 
      user.email.includes('manager') ||
      user.firstName.toLowerCase().includes('leader') ||
      user.lastName.toLowerCase().includes('leader')
    )
    
    if (potentialTeamLeaders.length > 0) {
      console.log('\n=== Potential Team Leaders ===')
      potentialTeamLeaders.forEach(user => {
        console.log(`${user.firstName} ${user.lastName} (${user.email}) - Current role: ${user.role}`)
      })
      
      // Ask if you want to update any roles
      console.log('\nTo fix a user role, run this command:')
      console.log('await User.findByIdAndUpdate("USER_ID", { role: "team_leader" })')
    }
    
    // Check if there are any team leaders at all
    const teamLeaders = users.filter(user => user.role === USER_ROLES.TEAM_LEADER)
    console.log(`\nTotal team leaders: ${teamLeaders.length}`)
    
    if (teamLeaders.length === 0) {
      console.log('\n⚠️  No team leaders found! This is why evaluations are failing.')
      console.log('You need at least one user with role "team_leader"')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

checkAndFixUserRoles()

