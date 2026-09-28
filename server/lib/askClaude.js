import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { AnalysisSchema } from './analysisSchema.js'
import { rules } from './analyzerRules.js'
import { ROLES } from './roles.js'

export async function askClaude(text, targetRole) {
  let usage

  try {
    const client = new Anthropic({ timeout: 30_000, maxRetries: 1 })
    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL,
      max_tokens: 1500,
      system: rules,
      messages: [{
        role: 'user',
        content: `Target role: ${targetRole}\nCore skills for this role: ${ROLES[targetRole].join(', ')}\n\n<resume>\n${text}\n</resume>`,
      }],
      output_config: { format: zodOutputFormat(AnalysisSchema) },
    })
    usage = response.usage

    if (response.stop_reason !== 'end_turn') {
      throw new Error(`Claude stopped with reason: ${response.stop_reason}`)
    }

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock) {
      throw new Error('Claude response did not contain a text block.')
    }

    let output
    try {
      output = JSON.parse(textBlock.text)
    } catch {
      throw new Error('Claude returned invalid JSON.')
    }

    const parsed = AnalysisSchema.safeParse(output)
    if (!parsed.success) {
      throw new Error(`Invalid Claude analysis: ${parsed.error.issues[0]?.message ?? 'unknown schema error'}`)
    }

    const analysis = {
      ...parsed.data,
      score: Math.round(Math.min(100, Math.max(0, parsed.data.score))),
    }

    return { analysis, usage }
  } catch (error) {
    error.usage = usage ?? error.usage
    throw error
  }
}
