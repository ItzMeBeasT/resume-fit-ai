const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

import Result from '../models/Result.js'

export function todayKeyIst() {
  return new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10)
}

export async function spentTodayInr() {
  const istDate = todayKeyIst()
  const utcMidnight = Date.parse(`${istDate}T00:00:00.000Z`)
  const midnightIst = new Date(utcMidnight - IST_OFFSET_MS)

  const [spend] = await Result.aggregate([
    { $match: { createdAt: { $gte: midnightIst } } },
    { $group: { _id: null, total: { $sum: '$costInr' } } },
  ])

  return spend?.total ?? 0
}
