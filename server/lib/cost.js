export const PRICES_USD_PER_MILLION = {
  'claude-haiku-4-5': { input: 1, output: 5 },
}

export function costInr({ inputTokens, outputTokens }, model) {
  const prices = PRICES_USD_PER_MILLION[model]
  const usd = (inputTokens * prices.input + outputTokens * prices.output) / 1_000_000
  return Number((usd * Number(process.env.USD_INR)).toFixed(4))
}

export function checkCostConfig() {
  if (!Object.hasOwn(PRICES_USD_PER_MILLION, process.env.CLAUDE_MODEL)) {
    console.error(`[Cost] no pricing configured for CLAUDE_MODEL: ${process.env.CLAUDE_MODEL || '(missing)'}`)
    process.exit(1)
  }

  for (const name of ['USD_INR', 'DAILY_CAP_INR']) {
    const value = process.env[name]
    if (value === undefined || value.trim() === '' || !Number.isFinite(Number(value))) {
      console.error(`[Cost] ${name} must be set to a number`)
      process.exit(1)
    }
  }
}
