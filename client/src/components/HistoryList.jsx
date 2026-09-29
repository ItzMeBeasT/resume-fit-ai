import { useEffect, useState } from 'react'
import { getResults } from '../lib/api.js'

function formatDate(value) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function getResultLabel(result) {
  if (result.score === null || result.score === undefined) return 'Analysis failed'
  return `${result.score}/100`
}

function HistoryList({ userId, refreshKey }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getResults(userId)
      .then((nextResults) => {
        if (active) {
          setResults(nextResults)
          setError('')
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [refreshKey, userId])

  return (
    <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6" aria-labelledby="history-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="history-heading" className="text-lg font-bold tracking-tight text-slate-950">Recent analyses</h2>
        <span className="text-xs font-medium text-slate-500">Latest 10</span>
      </div>

      {loading && <p className="mt-4 text-sm text-slate-500" role="status">Loading your history…</p>}
      {!loading && error && <p className="mt-4 text-sm text-rose-700" role="alert">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p className="mt-4 text-sm leading-6 text-slate-500">Your completed resume reviews will appear here.</p>
      )}
      {!loading && !error && results.length > 0 && (
        <ol className="mt-4 divide-y divide-slate-100">
          {results.map((result, index) => (
            <li className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0" key={`${result.createdAt}-${index}`}>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">Resume comparison</p>
                <time className="mt-1 block text-xs text-slate-500" dateTime={result.createdAt}>
                  {formatDate(result.createdAt)}
                </time>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                {getResultLabel(result)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default HistoryList
