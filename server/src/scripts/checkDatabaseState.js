import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Team from '../models/Team.js'
import Evaluation from '../models/Evaluation.js'

// Load environment variables
dotenv.config({ path: './server/.env' })

async function checkDatabaseState() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.ATLAS_URI
    if (!mongoUri) {
      console.error('MONGODB_URI is not set')
      process.exit(1)
    }
    
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')
    
    // Check users
    console.log('\n=== USERS ===')
    const users = await User.find({})
    users.forEach(user => {
      console.log(`ID: ${user._id}`)
      console.log(`Name: ${user.firstName} ${user.lastName}`)
      console.log(`Email: ${user.email}`)
      console.log(`Role: ${user.role}`)
      console.log(`Team: ${user.team || 'None'}`)
      console.log('---')
    })
    
    // Check teams
    console.log('\n=== TEAMS ===')
    const teams = await Team.find({}).populate('leader', 'firstName lastName email')
    if (teams.length === 0) {
      console.log('No teams found in database')
    } else {
      teams.forEach(team => {
        console.log(`Team ID: ${team._id}`)
        console.log(`Name: ${team.name}`)
        console.log(`Leader: ${team.leader ? `${team.leader.firstName} ${team.leader.lastName} (${team.leader.email})` : 'None'}`)
        console.log(`Members: ${team.members.length}`)
        console.log(`Department: ${team.department || 'None'}`)
        console.log('---')
      })
    }
    
    // Check evaluations
    console.log('\n=== EVALUATIONS ===')
    const evaluations = await Evaluation.find({})
    if (evaluations.length === 0) {
      console.log('No evaluations found in database')
    } else {
      evaluations.forEach(eval => {
        console.log(`Evaluation ID: ${eval._id}`)
        console.log(`Type: ${eval.type}`)
        console.log(`Period: ${eval.evaluationPeriod}`)
        console.log(`Team Leader ID: ${eval.teamLeaderId}`)
        console.log(`Team ID: ${eval.teamId}`)
        console.log(`Status: ${eval.status}`)
        console.log('---')
      })
    }
    
    // Check specific user (Abenezer Abebe Arba)
    console.log('\n=== CHECKING SPECIFIC USER ===')
    const specificUser = await User.findOne({ firstName: 'Abenezer', lastName: 'Abebe Arba' })
    if (specificUser) {
      console.log(`User found: ${specificUser._id}`)
      console.log(`Role: ${specificUser.role}`)
      console.log(`Team: ${specificUser.team || 'None'}`)
      
      // Check if this user is a team leader
      const teamAsLeader = await Team.findOne({ leader: specificUser._id })
      console.log(`Team as leader: ${teamAsLeader ? teamAsLeader.name : 'None'}`)
      
      // Check if this user is a team member
      const teamAsMember = await Team.findOne({ members: specificUser._id })
      console.log(`Team as member: ${teamAsMember ? teamAsMember.name : 'None'}`)
    } else {
      console.log('User Abenezer Abebe Arba not found')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

checkDatabaseState()

