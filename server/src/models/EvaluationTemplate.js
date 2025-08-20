import mongoose from "mongoose";

const evaluationTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
  type: {
    type: String,
    enum: ["work_rate", "behavioral"],
    required: true
  },
  
  description: String,
  
  // For work rate evaluations
  workRateCriteria: [{
    name: String,
    description: String,
    weight: Number,
    maxScore: {
      type: Number,
      default: 10
    },
    examples: [String]
  }],
  
  // For behavioral evaluations
  behavioralCriteria: [{
    name: String,
    description: String,
    maxScore: {
      type: Number,
      default: 5
    },
    examples: [String]
  }],
  
  // Template settings
  isDefault: {
    type: Boolean,
    default: false
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update timestamps
evaluationTemplateSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

const EvaluationTemplate = mongoose.model("EvaluationTemplate", evaluationTemplateSchema);

export default EvaluationTemplate;

