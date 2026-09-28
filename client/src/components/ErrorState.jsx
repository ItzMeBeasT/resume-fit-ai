function ErrorState({ message, onRetry }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-5 py-12 text-center" role="alert">
      <span className="flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-700" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="size-7" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z" />
        </svg>
      </span>
      <h2 className="mt-5 text-xl font-bold text-slate-950">We couldn’t analyze this resume</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">{message}</p>
      <button
        className="mt-6 rounded-xl bg-[#D4F34A] px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c9e83c] focus:outline-none focus:ring-4 focus:ring-lime-200"
        type="button"
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  )
}

export default ErrorState
