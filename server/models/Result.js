import mongoose from 'mongoose'

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  targetRole: String,
  score: { type: Number, default: null },
  verdict: String,
  skillsFound: [String],
  skillsMissing: [String],
  topFixes: [String],
  fallback: Boolean,
  inputTokens: Number,
  outputTokens: Number,
  costInr: Number,
}, { timestamps: true })

const Result = mongoose.model('Result', resultSchema)

export default Result
