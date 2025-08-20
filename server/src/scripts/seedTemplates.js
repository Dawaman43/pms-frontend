import mongoose from "mongoose";
import EvaluationTemplate from "../models/EvaluationTemplate.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const defaultTemplates = [
  {
    name: "Standard Work Rate Evaluation",
    type: "work_rate",
    description: "Comprehensive work rate evaluation covering key performance areas",
    isDefault: true,
    isPublic: true,
    workRateCriteria: [
      {
        name: "Quality of Work",
        description: "Accuracy, thoroughness, and attention to detail",
        weight: 25,
        maxScore: 10,
        examples: ["Produces error-free work", "Follows established procedures", "Maintains high standards"]
      },
      {
        name: "Productivity",
        description: "Efficiency and output in completing tasks",
        weight: 20,
        maxScore: 10,
        examples: ["Meets deadlines consistently", "Handles workload effectively", "Minimizes time waste"]
      },
      {
        name: "Technical Skills",
        description: "Proficiency in required technical competencies",
        weight: 20,
        maxScore: 10,
        examples: ["Demonstrates required expertise", "Keeps skills current", "Applies knowledge effectively"]
      },
      {
        name: "Problem Solving",
        description: "Ability to identify and resolve issues",
        weight: 15,
        maxScore: 10,
        examples: ["Analyzes problems effectively", "Develops practical solutions", "Shows initiative"]
      },
      {
        name: "Communication",
        description: "Effectiveness in written and verbal communication",
        weight: 10,
        maxScore: 10,
        examples: ["Expresses ideas clearly", "Listens actively", "Provides constructive feedback"]
      },
      {
        name: "Teamwork",
        description: "Collaboration and contribution to team goals",
        weight: 10,
        maxScore: 10,
        examples: ["Supports team members", "Shares knowledge", "Maintains positive relationships"]
      }
    ]
  },
  {
    name: "Standard Behavioral Evaluation",
    type: "behavioral",
    description: "Behavioral assessment covering key soft skills and competencies",
    isDefault: true,
    isPublic: true,
    behavioralCriteria: [
      {
        name: "Leadership",
        description: "Ability to guide and inspire others",
        maxScore: 5,
        examples: ["Takes initiative", "Mentors colleagues", "Leads by example"]
      },
      {
        name: "Adaptability",
        description: "Flexibility in handling change and new situations",
        maxScore: 5,
        examples: ["Embraces new challenges", "Adjusts to changing priorities", "Learns from experience"]
      },
      {
        name: "Professionalism",
        description: "Maintains professional conduct and ethics",
        maxScore: 5,
        examples: ["Demonstrates integrity", "Maintains confidentiality", "Shows respect for others"]
      },
      {
        name: "Innovation",
        description: "Creativity and continuous improvement mindset",
        maxScore: 5,
        examples: ["Suggests improvements", "Thinks outside the box", "Embraces new ideas"]
      },
      {
        name: "Customer Focus",
        description: "Understanding and meeting stakeholder needs",
        maxScore: 5,
        examples: ["Understands requirements", "Provides excellent service", "Builds relationships"]
      },
      {
        name: "Learning Agility",
        description: "Quick learning and knowledge application",
        maxScore: 5,
        examples: ["Learns new skills quickly", "Applies knowledge effectively", "Seeks feedback"]
      }
    ]
  },
  {
    name: "Software Development Work Rate",
    type: "work_rate",
    description: "Specialized evaluation for software development roles",
    isDefault: false,
    isPublic: true,
    workRateCriteria: [
      {
        name: "Code Quality",
        description: "Clean, maintainable, and well-documented code",
        weight: 30,
        maxScore: 10,
        examples: ["Follows coding standards", "Writes readable code", "Includes proper documentation"]
      },
      {
        name: "Problem Solving",
        description: "Analytical thinking and solution design",
        weight: 25,
        maxScore: 10,
        examples: ["Analyzes requirements", "Designs effective solutions", "Troubleshoots issues"]
      },
      {
        name: "Technical Knowledge",
        description: "Proficiency in relevant technologies and frameworks",
        weight: 20,
        maxScore: 10,
        examples: ["Mastery of core technologies", "Stays updated with trends", "Applies best practices"]
      },
      {
        name: "Testing & Quality Assurance",
        description: "Thorough testing and quality control",
        weight: 15,
        maxScore: 10,
        examples: ["Writes comprehensive tests", "Performs thorough testing", "Ensures quality standards"]
      },
      {
        name: "Collaboration",
        description: "Working effectively with team members",
        weight: 10,
        maxScore: 10,
        examples: ["Participates in code reviews", "Shares knowledge", "Supports team goals"]
      }
    ]
  },
  {
    name: "Project Management Behavioral",
    type: "behavioral",
    description: "Behavioral assessment for project management roles",
    isDefault: false,
    isPublic: true,
    behavioralCriteria: [
      {
        name: "Strategic Thinking",
        description: "Long-term planning and strategic perspective",
        maxScore: 5,
        examples: ["Sets clear objectives", "Plans for contingencies", "Aligns with organizational goals"]
      },
      {
        name: "Stakeholder Management",
        description: "Effective communication and relationship building",
        maxScore: 5,
        examples: ["Manages expectations", "Builds trust", "Handles conflicts professionally"]
      },
      {
        name: "Risk Management",
        description: "Identifying and mitigating project risks",
        maxScore: 5,
        examples: ["Assesses potential risks", "Develops mitigation strategies", "Monitors risk indicators"]
      },
      {
        name: "Team Leadership",
        description: "Guiding and motivating project teams",
        maxScore: 5,
        examples: ["Delegates effectively", "Provides clear direction", "Recognizes achievements"]
      },
      {
        name: "Decision Making",
        description: "Timely and effective decision making",
        maxScore: 5,
        examples: ["Gathers necessary information", "Considers alternatives", "Makes timely decisions"]
      },
      {
        name: "Continuous Improvement",
        description: "Learning from experience and improving processes",
        maxScore: 5,
        examples: ["Conducts retrospectives", "Implements lessons learned", "Optimizes workflows"]
      }
    ]
  }
];

async function seedTemplates() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.ATLAS_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not set");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing templates
    await EvaluationTemplate.deleteMany({});
    console.log("Cleared existing templates");

    // Insert default templates
    const templates = await EvaluationTemplate.insertMany(defaultTemplates);
    console.log(`Inserted ${templates.length} templates`);

    // Log the created templates
    templates.forEach(template => {
      console.log(`- ${template.name} (${template.type})`);
    });

    console.log("Template seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding templates:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedTemplates();

