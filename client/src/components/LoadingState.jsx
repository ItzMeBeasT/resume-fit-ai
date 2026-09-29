function LoadingState() {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-5 py-12 text-center" role="status" aria-live="polite">
      <span className="size-11 animate-spin rounded-full border-[3px] border-slate-200 border-t-emerald-900" aria-hidden="true" />
      <p className="mt-6 text-lg font-semibold leading-7 text-slate-950">Comparing your resume...</p>
      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">We’re checking your experience against the job description.</p>
    </div>
  )
}

export default LoadingState
