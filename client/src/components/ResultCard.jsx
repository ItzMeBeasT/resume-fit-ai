function ResultCard({ result, onReset }) {
  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-900">Your comparison</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Here’s your fit.</h2>
        </div>
      </div>

      <div className="flex items-center gap-5 rounded-2xl bg-[#f6f7f2] p-5 sm:p-6">
        <div className="relative flex size-24 shrink-0 items-center justify-center rounded-full border-[7px] border-[#cde96a] bg-white sm:size-28">
          <span className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{result.score}</span>
          <span className="absolute -bottom-2 rounded-full bg-slate-950 px-2.5 py-1 text-[9px] font-semibold text-white">/ 100</span>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Match score</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{result.verdict}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">Based on the resume and job description you shared.</p>
        </div>
      </div>

      <section aria-labelledby="strengths-heading">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-600" aria-hidden="true" />
          <h3 id="strengths-heading" className="text-sm font-bold text-slate-900">Strengths</h3>
        </div>
        {result.skillsFound.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {result.skillsFound.map((skill) => (
              <li key={skill} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">{skill}</li>
            ))}
          </ul>
        ) : <p className="mt-2 text-sm leading-6 text-slate-500">No direct strengths were identified.</p>}
      </section>

      <section aria-labelledby="gaps-heading">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-amber-500" aria-hidden="true" />
          <h3 id="gaps-heading" className="text-sm font-bold text-slate-900">Gaps to consider</h3>
        </div>
        {result.skillsMissing.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {result.skillsMissing.map((skill) => (
              <li key={skill} className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">{skill}</li>
            ))}
          </ul>
        ) : <p className="mt-2 text-sm leading-6 text-slate-500">No notable gaps were identified against this job description.</p>}
      </section>

      <section aria-labelledby="top-fixes-heading">
        <h3 id="top-fixes-heading" className="text-sm font-bold text-slate-900">Three practical next steps</h3>
        <ol className="mt-3 space-y-2.5">
          {result.topFixes.map((fix, index) => (
            <li key={`${index}-${fix}`} className="flex gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 text-sm leading-6 text-slate-700">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#edf3d8] text-xs font-bold text-emerald-950">{index + 1}</span>
              <span>{fix}</span>
            </li>
          ))}
        </ol>
      </section>

      <button
        className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-emerald-900/10"
        type="button"
        onClick={onReset}
      >
        Analyze another resume
      </button>
    </div>
  )
}

export default ResultCard