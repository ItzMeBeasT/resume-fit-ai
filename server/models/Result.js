import mongoose from 'mongoose'

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  score: { type: Number, default: null },
  verdict: String,
  skillsFound: [String],
  skillsMissing: [String],
  topFixes: [String],
  fallback: Boolean,
}, { timestamps: true })

const Result = mongoose.model('Result', resultSchema)

export default Result
