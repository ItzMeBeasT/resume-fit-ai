import { useState } from 'react'
import ErrorState from './components/ErrorState.jsx'
import HistoryList from './components/HistoryList.jsx'
import LoadingState from './components/LoadingState.jsx'
import ResultCard from './components/ResultCard.jsx'
import UploadForm from './components/UploadForm.jsx'
import { analyzeResume } from './lib/api.js'
import { getUserId } from './lib/userId.js'

function App() {
  const [userId] = useState(getUserId)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

  function resetToIdle() {
    setStatus('idle')
    setResult(null)
    setErrorMessage('')
  }

  async function handleAnalyze({ file, jobDescription }) {
    setResult(null)
    setErrorMessage('')
    setStatus('loading')

    try {
      const analysis = await analyzeResume(file, jobDescription, userId)
      setResult(analysis)
      setStatus('done')
    } catch (error) {
      setErrorMessage(error.message || 'We couldn’t complete the analysis. Please try again.')
      setStatus('error')
    } finally {
      setHistoryRefreshKey((currentKey) => currentKey + 1)
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f7f2] px-4 pb-10 text-slate-900 sm:px-7 sm:pb-14">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200/80" aria-label="Main navigation">
          <a className="flex shrink-0 items-center gap-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-900/10" href="#top" aria-label="Resume Analyzer home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#cde96a] text-slate-950" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7l4.25 4.5v11A1.75 1.75 0 0 1 16.5 21h-9A1.75 1.75 0 0 1 5.75 19.25v-13A2.5 2.5 0 0 1 8.25 3.75Zm6.5.5v4.5h4.25M8.5 13h7m-7 3.5h7" />
              </svg>
            </span>
            <span className="text-sm font-bold tracking-tight text-slate-950 sm:text-base">Resume Analyzer</span>
          </a>
          <span className="hidden rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-medium text-slate-600 sm:inline-flex">
            A clearer next step starts here
          </span>
          <a
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-950 focus:outline-none focus:ring-4 focus:ring-emerald-900/15 sm:px-5 sm:text-sm"
            href="#analysis"
          >
            Get started <span aria-hidden="true">↗</span>
          </a>
        </header>

        <section id="top" className="grid items-center gap-9 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-16">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-900">
              <span className="size-1.5 rounded-full bg-[#91ad33]" aria-hidden="true" />
              Resume to opportunity
            </p>
            <h1 className="mt-5 text-[2.85rem] font-semibold leading-[1.04] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.3rem]">
              Hey, let’s get you <span className="font-serif font-medium italic text-emerald-900">noticed.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              See how your resume lines up with the job you want. Get a clear match score and practical ways to strengthen your application.
            </p>
            <ul className="mt-7 space-y-3.5">
              {[
                'Compare your experience with the job using AI',
                'Get strengths, gaps, and practical next steps',
                'Your PDF is processed in memory',
              ].map((item) => (
                <li className="flex items-start gap-3 text-sm leading-6 text-slate-700 sm:text-[15px]" key={item}>
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e7efce] text-[11px] font-bold text-emerald-900" aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9 hidden items-center gap-3 border-t border-slate-200 pt-5 lg:flex">
              <span className="flex -space-x-2" aria-hidden="true">
                <span className="size-7 rounded-full border-2 border-[#f6f7f2] bg-[#d4dfbc]" />
                <span className="size-7 rounded-full border-2 border-[#f6f7f2] bg-[#e8cbb8]" />
                <span className="size-7 rounded-full border-2 border-[#f6f7f2] bg-[#bacac3]" />
              </span>
              <p className="text-xs leading-5 text-slate-500">A thoughtful check before your next application.</p>
            </div>
          </div>

          <section id="analysis" className="scroll-mt-6 rounded-[26px] border border-slate-200/90 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] sm:rounded-[30px] sm:p-8 lg:p-9" aria-labelledby="analysis-heading">
            {status === 'idle' ? (
              <>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-900">Your resume + the role</p>
                    <h2 id="analysis-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]">Find your fit.</h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">Add a PDF and paste the job description for an AI-assisted comparison.</p>
                  </div>
                </div>
                <UploadForm onAnalyze={handleAnalyze} />
              </>
            ) : status === 'loading' ? (
              <LoadingState />
            ) : status === 'done' && result ? (
              <ResultCard result={result} onReset={resetToIdle} />
            ) : (
              <ErrorState message={errorMessage} onRetry={resetToIdle} />
            )}
          </section>
        </section>

        <HistoryList userId={userId} refreshKey={historyRefreshKey} />

        <footer className="pt-8 text-center text-xs leading-5 text-slate-500">
          Built to help early-career developers move forward with confidence.
        </footer>
      </div>
    </main>
  )
}

export default App