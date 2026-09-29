import assert from 'node:assert/strict'
import express from 'express'
import { handleErrors } from '../middleware/errors.js'
import analyzeRouter from '../routes/analyze.js'
import test from 'node:test'
import { AnalysisSchema } from '../lib/analysisSchema.js'
import ai from '../lib/geminiClient.js'
import { askGemini } from '../lib/askGemini.js'

test('analysis schema requires three practical fixes and bounded text', () => {
  const validAnalysis = {
    score: 82,
    skillsFound: ['React'],
    skillsMissing: ['Accessibility'],
    topFixes: ['Add a project outcome.', 'Describe your testing approach.', 'Highlight collaboration.'],
  }

  assert.equal(AnalysisSchema.safeParse(validAnalysis).success, true)
  assert.equal(AnalysisSchema.safeParse({ ...validAnalysis, topFixes: ['Only one fix'] }).success, false)
  assert.equal(AnalysisSchema.safeParse({ ...validAnalysis, skillsMissing: 'Not an array' }).success, false)
})

test('Gemini receives both documents and its score is rounded and clamped', async () => {
  const originalGenerateContent = ai.models.generateContent
  const originalApiKey = process.env.GEMINI_API_KEY
  process.env.GEMINI_API_KEY = 'test-key'

  ai.models.generateContent = async ({ model, contents, config }) => {
    assert.equal(model, 'gemini-3.5-flash-lite')
    assert.match(contents, /Resume text with React experience\./)
    assert.match(contents, /A role requiring React and accessibility\./)
    assert.equal(config.responseMimeType, 'application/json')
    assert.equal(config.responseSchema.type, 'object')

    return {
      text: JSON.stringify({
        score: 112.4,
        skillsFound: ['React'],
        skillsMissing: ['Accessibility'],
        topFixes: ['Add a project outcome.', 'Describe your testing approach.', 'Highlight collaboration.'],
      }),
    }
  }

  try {
    const result = await askGemini('Resume text with React experience.', 'A role requiring React and accessibility.')
    assert.equal(result.analysis.score, 100)
    assert.equal(result.analysis.topFixes.length, 3)
  } finally {
    ai.models.generateContent = originalGenerateContent
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalApiKey
  }
})

test('analysis endpoint accepts the multipart jobDescription field without a fixed role', async () => {
  const app = express()
  app.use(analyzeRouter)
  app.use(handleErrors)
  const server = app.listen(0, '127.0.0.1')

  try {
    await new Promise((resolve) => server.once('listening', resolve))
    const formData = new FormData()
    formData.append('resume', new Blob(['%PDF-test'], { type: 'application/pdf' }), 'resume.pdf')
    formData.append('jobDescription', 'Too short')
    formData.append('userId', '123e4567-e89b-42d3-a456-426614174000')

    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/analyze`, {
      method: 'POST',
      body: formData,
    })
    const body = await response.json()

    assert.equal(response.status, 400)
    assert.match(body.error, /at least 30 characters/)
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})
