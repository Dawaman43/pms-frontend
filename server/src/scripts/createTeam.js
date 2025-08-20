import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Team from '../models/Team.js'

// Load environment variables
dotenv.config({ path: '../.env' })

async function createTeam() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.ATLAS_URI
    if (!mongoUri) {
      console.error('MONGODB_URI is not set')
      process.exit(1)
    }
    
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')
    
    // Find the team leader user
    const teamLeader = await User.findOne({ firstName: 'Abenezer', lastName: 'Abebe Arba' })
    if (!teamLeader) {
      console.error('Team leader user not found')
      process.exit(1)
    }
    
    console.log('Found team leader:', teamLeader.firstName, teamLeader.lastName, 'ID:', teamLeader._id)
    
    // Check if team already exists
    const existingTeam = await Team.findOne({ leader: teamLeader._id })
    if (existingTeam) {
      console.log('Team already exists:', existingTeam.name)
      console.log('Team ID:', existingTeam._id)
      return
    }
    
    // Create a new team
    const team = new Team({
      name: 'Development Team',
      leader: teamLeader._id,
      department: 'Information Communication Technology',
      description: 'Software development team',
      members: [teamLeader._id] // Add leader as first member
    })
    
    await team.save()
    console.log('Team created successfully:')
    console.log('Team ID:', team._id)
    console.log('Team Name:', team.name)
    console.log('Leader:', teamLeader.firstName, teamLeader.lastName)
    
    // Update user's team reference
    await User.findByIdAndUpdate(teamLeader._id, { team: team._id })
    console.log('User team reference updated')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

createTeam()
