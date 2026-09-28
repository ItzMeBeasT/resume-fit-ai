import rateLimit from 'express-rate-limit'

const analyzeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  message: { error: 'Five analyses per 10 minutes. Please try again soon.' },
})

export default analyzeLimiter
