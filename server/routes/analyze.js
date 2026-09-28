import { Router } from 'express'
import multer from 'multer'
import analyzeLimiter from '../middleware/analyzeLimiter.js'
import { askClaude } from '../lib/askClaude.js'
import { costInr } from '../lib/cost.js'
import { readResume } from '../lib/readResume.js'
import { ROLES } from '../lib/roles.js'
import { spentTodayInr } from '../lib/spend.js'
import { verdictFor } from '../lib/verdict.js'
import Result from '../models/Result.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
})
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

router.post('/api/analyze', analyzeLimiter, upload.single('resume'), async (request, response) => {
  const targetRole = request.body?.targetRole
  const userId = request.body?.userId

  if (typeof userId !== 'string' || !UUID_PATTERN.test(userId)) {
    return response.status(400).json({
      error: 'Missing or invalid userId. Refresh the page and try again.',
    })
  }

  if (!request.file || request.file.mimetype !== 'application/pdf') {
    return response.status(400).json({ error: 'Upload your resume as a PDF.' })
  }

  if (!Object.hasOwn(ROLES, targetRole)) {
    return response.status(400).json({ error: 'Pick a role from the list.' })
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

  if (await spentTodayInr() >= Number(process.env.DAILY_CAP_INR)) {
    console.log('[Cost] daily cap reached')
    return response.status(503).json({
      error: "We've hit today's AI budget. Please try again tomorrow.",
    })
  }

  const startedAt = Date.now()
  let analysis = null
  let usage
  let analysisError
  try {
    const result = await askClaude(text, targetRole)
    analysis = result.analysis
    usage = result.usage
  } catch (error) {
    analysisError = error
    usage = error.usage
  }

  const requestCostInr = costInr({
    inputTokens: usage?.input_tokens ?? 0,
    outputTokens: usage?.output_tokens ?? 0,
  }, process.env.CLAUDE_MODEL)

  await Result.create({
    userId,
    targetRole,
    score: analysis?.score ?? null,
    verdict: analysis ? verdictFor(analysis.score) : null,
    skillsFound: analysis?.skillsFound ?? [],
    skillsMissing: analysis?.skillsMissing ?? [],
    topFixes: analysis?.topFixes ?? [],
    fallback: false,
    inputTokens: usage?.input_tokens ?? 0,
    outputTokens: usage?.output_tokens ?? 0,
    costInr: requestCostInr,
  })

  const totalSpendInr = await spentTodayInr()
  console.log(`[Cost] ₹${requestCostInr.toFixed(4)} for this request, ₹${totalSpendInr.toFixed(4)} today`)

  if (analysisError) {
    console.error(`[AI] analysis failed for ${targetRole}: ${analysisError.message}`)
    throw analysisError
  }

  console.log(`[AI] analysed ${text.length} chars for ${targetRole} in ${Date.now() - startedAt} ms`)

  return response.json({
    targetRole,
    ...analysis,
    verdict: verdictFor(analysis.score),
    fallback: false,
    costInr: requestCostInr,
  })
})

export default router
