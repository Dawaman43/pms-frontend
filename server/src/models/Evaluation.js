import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
  // Basic evaluation info
  type: {
    type: String,
    enum: ["work_rate", "behavioral"],
    required: true
  },
  
  // Evaluation period
  evaluationPeriod: {
    type: String,
    required: true,
    default: () => {
      const now = new Date();
      const year = now.getFullYear();
      const quarter = Math.ceil((now.getMonth() + 1) / 3);
      return `Q${quarter} ${year}`;
    }
  },
  
  // Team and leader info
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  
  teamLeaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // For Work Rate evaluations
  workRateEvaluations: [{
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    memberName: String,
    criteria: [{
      name: String,
      weight: Number,
      score: Number,
      maxScore: {
        type: Number,
        default: 10
      },
      remarks: String
    }],
    totalScore: Number,
    weightedScore: Number,
    overallRemarks: String,
    evaluatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // For Behavioral evaluations
  behavioralEvaluations: [{
    evaluatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    evaluatorName: String,
    evaluatorType: {
      type: String,
      enum: ["self", "peer", "leader"],
      required: true
    },
    evaluateeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    evaluateeName: String,
    criteria: [{
      name: String,
      score: Number,
      maxScore: {
        type: Number,
        default: 5
      },
      remarks: String
    }],
    totalScore: Number,
    overallRemarks: String,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Evaluation status
  status: {
    type: String,
    enum: ["draft", "active", "completed", "archived"],
    default: "draft"
  },
  
  // Dates
  startDate: {
    type: Date,
    required: true
  },
  
  endDate: {
    type: Date,
    required: true
  },
  
  // Settings
  allowSelfEvaluation: {
    type: Boolean,
    default: true
  },
  
  allowPeerEvaluation: {
    type: Boolean,
    default: true
  },
  
  requireLeaderApproval: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
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
evaluationSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate total scores for work rate evaluations
evaluationSchema.methods.calculateWorkRateScores = function() {
  this.workRateEvaluations.forEach(evaluationItem => {
    let totalScore = 0;
    let totalWeight = 0;
    
    evaluationItem.criteria.forEach(criterion => {
      totalScore += (criterion.score || 0) * (criterion.weight || 1);
      totalWeight += criterion.weight || 1;
    });
    
    evaluationItem.totalScore = evaluationItem.criteria.reduce((sum, c) => sum + (c.score || 0), 0);
    evaluationItem.weightedScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  });
};

// Calculate total scores for behavioral evaluations
evaluationSchema.methods.calculateBehavioralScores = function() {
  this.behavioralEvaluations.forEach(evaluationItem => {
    evaluationItem.totalScore = evaluationItem.criteria.reduce((sum, c) => sum + (c.score || 0), 0);
  });
};

// Get evaluation summary for dashboard
evaluationSchema.methods.getSummary = function() {
  const summary = {
    totalMembers: 0,
    completedEvaluations: 0,
    pendingEvaluations: 0,
    averageScore: 0
  };
  
  if (this.type === "work_rate") {
    summary.totalMembers = this.workRateEvaluations.length;
    summary.completedEvaluations = this.workRateEvaluations.filter(e => e.evaluatedAt).length;
    summary.pendingEvaluations = summary.totalMembers - summary.completedEvaluations;
    
    const completedEvals = this.workRateEvaluations.filter(e => e.evaluatedAt);
    if (completedEvals.length > 0) {
      summary.averageScore = completedEvals.reduce((sum, e) => sum + e.weightedScore, 0) / completedEvals.length;
    }
  } else if (this.type === "behavioral") {
    const uniqueMembers = new Set(this.behavioralEvaluations.map(e => e.evaluateeId.toString()));
    summary.totalMembers = uniqueMembers.size;
    summary.completedEvaluations = this.behavioralEvaluations.filter(e => e.submittedAt).length;
    summary.pendingEvaluations = summary.totalMembers - summary.completedEvaluations;
    
    const completedEvals = this.behavioralEvaluations.filter(e => e.submittedAt);
    if (completedEvals.length > 0) {
      summary.averageScore = completedEvals.reduce((sum, e) => sum + e.totalScore, 0) / completedEvals.length;
    }
  }
  
  return summary;
};

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

export default Evaluation;


