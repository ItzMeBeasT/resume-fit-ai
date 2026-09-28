import express from 'express'

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.listen(port, () => {
  console.log('[Server] listening on http://localhost:4000')
})
