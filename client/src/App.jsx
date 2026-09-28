import { useState } from 'react'
import ErrorState from './components/ErrorState.jsx'
import HistoryList from './components/HistoryList.jsx'
import LoadingState from './components/LoadingState.jsx'
import ResultCard from './components/ResultCard.jsx'
import UploadForm from './components/UploadForm.jsx'
import { analyzeResume } from './lib/api.js'
import { getUserId } from './lib/userId.js'

const PREVIEW_STATES = ['idle', 'loading', 'done', 'error']

function App() {
  const [userId] = useState(getUserId)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

  function resetToIdle() {
    setStatus('idle')
    setResult(null)
    setErrorMessage('')
  }

  async function handleAnalyze({ file, targetRole }) {
    setResult(null)
    setErrorMessage('')
    setStatus('loading')

    try {
      const analysis = await analyzeResume(file, targetRole, userId)
      setResult(analysis)
      setLastResult(analysis)
      setStatus('done')
    } catch (error) {
      setErrorMessage(error.message)
      setStatus('error')
    } finally {
      setHistoryRefreshKey((currentKey) => currentKey + 1)
    }
  }

  function previewState(nextStatus) {
    if (nextStatus === 'done' && !lastResult) return

    if (nextStatus === 'done') setResult(lastResult)
    else if (nextStatus !== 'error') setResult(null)
    setErrorMessage(nextStatus === 'error' ? 'Something went wrong. Please try your resume again.' : '')
    setStatus(nextStatus)
  }

  return (
    <main className="min-h-screen bg-[#f4f5f1] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-160">
        <header className="mb-7 flex items-center gap-3 sm:mb-8">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#D4F34A] text-slate-950 shadow-sm" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7l4.25 4.5v11A1.75 1.75 0 0 1 16.5 21h-9A1.75 1.75 0 0 1 5.75 19.25v-13A2.5 2.5 0 0 1 8.25 3.75Zm6.5.5v4.5h4.25M8.5 13h7m-7 3.5h7" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-950">Resume Analyzer</p>
            <p className="text-xs font-medium text-slate-500">Make your next application stronger</p>
          </div>
        </header>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/70 sm:p-9">
          {status === 'idle' && (
            <>
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Your next step starts here</p>
                <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                  Find out how your resume fits.
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
                  Choose a role and get a clear, practical review of the skills your resume shows.
                </p>
              </div>
              <UploadForm onAnalyze={handleAnalyze} />
              <p className="mt-1 text-center text-xs leading-5 text-slate-500">
                Your resume is only used for this analysis.
              </p>
            </>
          )}
          {status === 'loading' && <LoadingState />}
          {status === 'done' && result && <ResultCard result={result} onReset={resetToIdle} />}
          {status === 'error' && <ErrorState message={errorMessage} onRetry={resetToIdle} />}
        </section>

        <HistoryList userId={userId} refreshKey={historyRefreshKey} />

        {import.meta.env.DEV && (
          <nav className="mt-5 flex flex-wrap items-center justify-center gap-2" aria-label="Preview app states">
            <span className="mr-1 text-xs font-semibold text-slate-500">Preview:</span>
            {PREVIEW_STATES.map((preview) => (
              <button
                key={preview}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition focus:outline-none focus:ring-4 focus:ring-slate-200 ${status === preview ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'}`}
                type="button"
                aria-pressed={status === preview}
                disabled={preview === 'done' && !lastResult}
                onClick={() => previewState(preview)}
              >
                {preview}
              </button>
            ))}
          </nav>
        )}

        <footer className="mt-7 text-center text-xs leading-5 text-slate-500">
          Built to help early-career developers move forward with confidence.
        </footer>
      </div>
    </main>
  )
}

export default App
