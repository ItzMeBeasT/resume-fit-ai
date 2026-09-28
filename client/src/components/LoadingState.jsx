import { useEffect, useState } from 'react'

function LoadingState() {
  const [stillWorking, setStillWorking] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setStillWorking(true), 10_000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-5 py-12 text-center" role="status" aria-live="polite">
      <span className="size-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" aria-hidden="true" />
      <p className="mt-6 max-w-sm text-lg font-semibold leading-7 text-slate-900">
        Reading your resume like a recruiter would...
      </p>
      <p className="mt-2 text-sm text-slate-500">
        {stillWorking ? 'Still working, the AI is thinking hard...' : 'Matching your experience to the role you chose.'}
      </p>
    </div>
  )
}

export default LoadingState
