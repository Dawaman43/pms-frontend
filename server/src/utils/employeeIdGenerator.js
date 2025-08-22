import Counter from "../models/Counter.js"

export async function generateEmployeeId() {
  try {
    // Find and increment the employee counter
    const counter = await Counter.findOneAndUpdate(
      { name: "employeeId" },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    )
    
    // Format the ID as ASTU-IC-0001, ASTU-IC-0002, etc.
    const sequenceNumber = counter.sequence.toString().padStart(4, '0')
    return `ASTU-IC-${sequenceNumber}`
  } catch (error) {
    console.error("Error generating employee ID:", error)
    throw new Error("Failed to generate employee ID")
  }
}




