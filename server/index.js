import express from 'express'
import cors from 'cors'
import analyzeRouter from './routes/analyze.js'
import { handleErrors } from './middleware/errors.js'
import { checkCostConfig } from './lib/cost.js'
import { connectDb } from './db.js'
import resultsRouter from './routes/results.js'

checkCostConfig()

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.set('trust proxy', 1)
app.use(cors({ origin: process.env.CLIENT_ORIGIN }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.get('/api/whoami', (request, response) => {
  response.json({ ip: request.ip })
})

app.use(analyzeRouter)
app.use(resultsRouter)
app.use(handleErrors)

await connectDb()

app.listen(port, () => {
  console.log('[Server] listening on http://localhost:4000')
})
