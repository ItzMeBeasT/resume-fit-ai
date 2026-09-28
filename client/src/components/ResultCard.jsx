function ResultCard({ result, onReset }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex size-36 items-center justify-center rounded-full border-10 border-[#D4F34A] bg-lime-50">
          <span className="text-4xl font-extrabold tracking-tight text-slate-950">
            {result.score}
          </span>
          <span className="absolute -bottom-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
            out of 100
          </span>
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          {result.targetRole} match
        </p>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">
          {result.verdict}
        </h2>
      </div>

      <section aria-labelledby="skills-found-heading">
        <h3 id="skills-found-heading" className="text-base font-bold text-slate-900">Skills found</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {result.skillsFound.map((skill) => (
            <li key={skill} className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="skills-missing-heading">
        <h3 id="skills-missing-heading" className="text-base font-bold text-slate-900">Skills missing</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {result.skillsMissing.map((skill) => (
            <li key={skill} className="rounded-full bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-800 ring-1 ring-rose-200">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="top-fixes-heading">
        <h3 id="top-fixes-heading" className="text-base font-bold text-slate-900">Top 3 fixes</h3>
        <ol className="mt-3 space-y-3">
          {result.topFixes.map((fix, index) => (
            <li key={fix} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900 ring-1 ring-slate-200">
                {index + 1}
              </span>
              <span>{fix}</span>
            </li>
          ))}
        </ol>
      </section>

      <button
        className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
        type="button"
        onClick={onReset}
      >
        Analyse another
      </button>
    </div>
  )
}

export default ResultCard
