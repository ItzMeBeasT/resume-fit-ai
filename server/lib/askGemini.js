import ai from './geminiClient.js'
import { AnalysisSchema } from './analysisSchema.js'
import { rules } from './analyzerRules.js'

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    score: {
      type: 'number',
      description: 'Resume to job-description match score from 0 to 100.',
    },
    skillsFound: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    skillsMissing: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    topFixes: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 3,
      maxItems: 3,
    },
  },
  required: ['score', 'skillsFound', 'skillsMissing', 'topFixes'],
}

function buildPrompt(resumeText, jobDescription) {
  return `${rules}

<job_description>
${jobDescription}
</job_description>

<resume>
${resumeText}
</resume>`
}

export async function askGemini(resumeText, jobDescription) {
  const prompt = buildPrompt(resumeText, jobDescription)
  const startedAt = Date.now()
  let lastError

  console.log('[AI] Gemini request started')

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      })

      const parsed = JSON.parse(response.text)
      const result = AnalysisSchema.safeParse(parsed)

      if (!result.success) {
        throw new Error(`Invalid Gemini analysis: ${result.error.issues[0]?.message}`)
      }

      const score = Math.round(Math.min(100, Math.max(0, result.data.score)))
      const analysis = {
        ...result.data,
        score,
      }

      console.log('[AI] Gemini analysis validated')
      console.log(`[AI] analysed ${resumeText.length + jobDescription.length} chars in ${Date.now() - startedAt} ms`)

      return { analysis }
    } catch (error) {
      lastError = error
      const message = error instanceof Error ? error.message : 'Unknown Gemini error'

      if (attempt === 0) {
        console.error(`[AI] Gemini request failed; retrying once: ${message}`)
        continue
      }

      console.error(`[AI] Gemini request failed: ${message}`)
      throw new Error("We couldn't complete the analysis. Please try again.")
    }
  }

  if (lastError instanceof Error) {
    console.error(`[AI] Gemini request failed: ${lastError.message}`)
  }

  throw new Error("We couldn't complete the analysis. Please try again.")
}
