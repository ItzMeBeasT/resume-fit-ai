import { useRef, useState } from 'react'

const MAX_FILE_SIZE = 4 * 1024 * 1024
const MAX_DESCRIPTION_LENGTH = 20_000
const MIN_DESCRIPTION_LENGTH = 30

function validateFile(file) {
  if (!file) return ''
  if (!file.name.toLowerCase().endsWith('.pdf') || (file.type && file.type !== 'application/pdf')) {
    return 'Please upload a valid PDF under 4 MiB.'
  }
  if (file.size > MAX_FILE_SIZE) return 'Please upload a valid PDF under 4 MiB.'
  return ''
}

function formatFileSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function UploadForm({ onAnalyze, disabled = false }) {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [fileError, setFileError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  function chooseFile(nextFile) {
    const validationMessage = validateFile(nextFile)
    setFileError(validationMessage)
    setFile(validationMessage ? null : nextFile)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationMessage = validateFile(file)
    const trimmedDescription = jobDescription.trim()
    setFileError(validationMessage)
    setDescriptionError(trimmedDescription.length < MIN_DESCRIPTION_LENGTH
      ? 'Paste the job description before comparing.'
      : '')

    if (!file || validationMessage || trimmedDescription.length < MIN_DESCRIPTION_LENGTH || disabled) return
    onAnalyze({ file, jobDescription: trimmedDescription })
  }

  const canCompare = Boolean(file)
    && jobDescription.trim().length >= MIN_DESCRIPTION_LENGTH
    && !disabled

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-sm font-semibold text-slate-800" htmlFor="resume-file">Resume PDF</label>
          <span className="text-[11px] font-medium text-slate-500">PDF · 4 MiB max</span>
        </div>
        <div
          className={`relative rounded-2xl border border-dashed p-5 transition focus-within:ring-4 focus-within:ring-emerald-900/10 sm:p-6 ${isDragging ? 'border-emerald-700 bg-emerald-50' : 'border-slate-300 bg-[#fafbf8] hover:border-slate-400'} ${disabled ? 'opacity-60' : ''}`}
          onDragOver={(event) => {
            event.preventDefault()
            if (!disabled) setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            if (!disabled) chooseFile(event.dataTransfer.files?.[0] ?? null)
          }}
        >
          <input
            ref={inputRef}
            id="resume-file"
            className="sr-only"
            type="file"
            accept="application/pdf,.pdf"
            disabled={disabled}
            onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
          />
          {file ? (
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:cursor-not-allowed"
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
              >
                Replace
              </button>
            </div>
          ) : (
            <label className={`flex cursor-pointer flex-col items-center text-center ${disabled ? 'pointer-events-none' : ''}`} htmlFor="resume-file">
              <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v3.25A1.75 1.75 0 0 0 6.75 20h10.5A1.75 1.75 0 0 0 19 18.25V15" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-slate-900">Drop your PDF resume here</span>
              <span className="mt-1 text-xs text-slate-500">or <span className="font-semibold text-emerald-800 underline underline-offset-2">browse files</span></span>
              <span className="sr-only">Choose a PDF resume</span>
            </label>
          )}
        </div>
        {fileError && <p className="mt-2 text-xs text-rose-700" role="alert">{fileError}</p>}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-sm font-semibold text-slate-800" htmlFor="job-description">Job description</label>
          <span className="text-xs tabular-nums text-slate-500">{jobDescription.length.toLocaleString()} / 20,000</span>
        </div>
        <textarea
          id="job-description"
          className="min-h-44 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/10 disabled:bg-slate-50"
          placeholder="Paste the job description here — include responsibilities, skills, and qualifications for a more useful comparison."
          value={jobDescription}
          maxLength={MAX_DESCRIPTION_LENGTH}
          disabled={disabled}
          aria-describedby="job-description-hint job-description-error"
          onChange={(event) => {
            setJobDescription(event.target.value)
            if (event.target.value.trim().length >= MIN_DESCRIPTION_LENGTH) setDescriptionError('')
          }}
        />
        <div className="mt-2 flex min-h-5 items-start justify-between gap-3">
          <p id="job-description-hint" className="text-xs text-slate-500">At least 30 characters</p>
          {descriptionError && <p id="job-description-error" className="text-right text-xs text-rose-700" role="alert">{descriptionError}</p>}
        </div>
      </div>

      <div>
        <button
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#cde96a] px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-[#c2df5d] focus:outline-none focus:ring-4 focus:ring-lime-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          type="submit"
          disabled={!canCompare}
        >
          Analyze my resume <span aria-hidden="true">↗</span>
        </button>
        <p className="mt-3 text-center text-xs leading-5 text-slate-500">
          Your PDF is processed in memory and the resume text is compared against your job description for a fit check.
        </p>
      </div>
    </form>
  )
}

export default UploadForm