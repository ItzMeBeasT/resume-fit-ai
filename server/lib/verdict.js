export function verdictFor(score) {
  if (score >= 75) return 'Strong match'
  if (score >= 50) return 'Partial match'
  return 'Needs work'
}
