import { Router } from 'express'
import multer from 'multer'
import analyzeLimiter from '../middleware/analyzeLimiter.js'
import { askGemini } from '../lib/askGemini.js'
import { readResume } from '../lib/readResume.js'
import { verdictFor } from '../lib/verdict.js'
import Result from '../models/Result.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
})
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

router.post('/api/analyze', analyzeLimiter, upload.single('resume'), async (request, response) => {
  const rawJobDescription = request.body?.jobDescription
  const jobDescription = typeof rawJobDescription === 'string' ? rawJobDescription.trim() : ''
  const userId = request.body?.userId

  if (typeof userId !== 'string' || !UUID_PATTERN.test(userId)) {
    return response.status(400).json({
      error: 'Missing or invalid userId. Refresh the page and try again.',
    })
  }

  if (!request.file || request.file.mimetype !== 'application/pdf' || !request.file.buffer.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    return response.status(400).json({ error: 'Please upload a valid PDF under 4 MiB.' })
  }

  if (typeof jobDescription !== 'string' || jobDescription.length < 30) {
    return response.status(400).json({ error: 'Paste a job description of at least 30 characters before comparing.' })
  }

  if (jobDescription.length > 20_000) {
    return response.status(413).json({ error: 'The job description must be 20,000 characters or fewer.' })
  }

  let text
  try {
    text = await readResume(request.file.buffer)
  } catch {
    return response.status(400).json({
      error: 'This PDF could not be read. Try exporting it again.',
    })
  }

  if (text.length < 100) {
    return response.status(422).json({
      error: 'We could not find any text in this PDF. Is it a scanned image?',
    })
  }

  if (text.length > 20_000) {
    return response.status(413).json({
      error: 'This resume is too long. Keep it to 3 pages.',
    })
  }

  let analysis = null
  let analysisError = null
  const startedAt = Date.now()

  try {
    const result = await askGemini(text, jobDescription)
    analysis = result.analysis
  } catch (error) {
    analysisError = error
    console.error(`[AI] Gemini error: ${error.message}`)
  }

  if (analysisError) {
    return response.status(500).json({
      error: "We couldn't complete the analysis. Please try again.",
    })
  }

  const score = analysis.score
  const verdict = verdictFor(score)

  await Result.create({
    userId,
    score,
    verdict,
    skillsFound: analysis.skillsFound,
    skillsMissing: analysis.skillsMissing,
    topFixes: analysis.topFixes,
    fallback: false,
  })

  console.log(`[AI] analysed ${text.length} chars in ${Date.now() - startedAt} ms`)

  return response.json({
    score,
    verdict,
    skillsFound: analysis.skillsFound,
    skillsMissing: analysis.skillsMissing,
    topFixes: analysis.topFixes,
    fallback: false,
  })
})

export default router
