import { Router } from 'express'
import Result from '../models/Result.js'

const router = Router()
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

router.get('/api/results', async (request, response) => {
  const { userId } = request.query
  if (typeof userId !== 'string' || !UUID_PATTERN.test(userId)) {
    return response.status(400).json({
      error: 'Missing or invalid userId. Refresh the page and try again.',
    })
  }

  const results = await Result.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select({ _id: 0, targetRole: 1, score: 1, fallback: 1, createdAt: 1 })
    .lean()

  return response.json({ results })
})

export default router
