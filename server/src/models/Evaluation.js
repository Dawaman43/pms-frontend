import mongoose from "mongoose"

const CriterionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    score: { type: Number },
    remarks: { type: String },
  },
  { _id: false },
)

const SectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    criteria: [CriterionSchema],
  },
  { _id: false },
)

const EvaluationSchema = new mongoose.Schema(
  {
    formType: { type: String, enum: ["workrate", "behavioral"], required: true },
    evaluatorType: { type: String, enum: ["admin", "peer", "self"], required: true },
    weight: { type: Number, required: true },
    evaluatee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    evaluator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sections: [SectionSchema],
    status: { type: String, enum: ["draft", "submitted"], default: "draft" },
    totalScore: { type: Number },
  },
  { timestamps: true },
)

export default mongoose.model("Evaluation", EvaluationSchema)


