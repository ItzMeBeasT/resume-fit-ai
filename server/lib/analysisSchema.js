import { z } from 'zod'

export const AnalysisSchema = z.object({
  score: z.number(),
  skillsFound: z.array(z.string()),
  skillsMissing: z.array(z.string()),
  topFixes: z.array(z.string()).length(3),
})
