import { useState } from 'react'

const MAX_FILE_SIZE = 4 * 1024 * 1024
const ROLES = [
  'Frontend developer',
  'Backend developer',
  'Full-stack developer',
  'AI engineer',
]

function getFileError(file) {
  if (!file) return ''
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return 'Please choose a PDF file.'
  }
  if (file.size >= MAX_FILE_SIZE) {
    return 'Your PDF must be smaller than 4 MB.'
  }
  return ''
}

function UploadForm({ onAnalyze }) {
  const [file, setFile] = useState(null)
  const [targetRole, setTargetRole] = useState('Full-stack developer')
  const [fileError, setFileError] = useState('')

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] ?? null
    setFile(nextFile)
    setFileError(getFileError(nextFile))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationMessage = getFileError(file)
    if (validationMessage) {
      setFileError(validationMessage)
      return
    }
    if (file) onAnalyze({ file, targetRole })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-slate-800"
          htmlFor="resume-file"
        >
          Your resume
        </label>
        <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center transition hover:border-slate-500 hover:bg-slate-100 focus-within:ring-4 focus-within:ring-lime-200">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v3.25A1.75 1.75 0 0 0 6.75 20h10.5A1.75 1.75 0 0 0 19 18.25V15" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {file ? file.name : 'Choose a PDF to upload'}
          </span>
          <span className="mt-1 text-xs text-slate-500">PDF only · under 4 MB</span>
          <input
            id="resume-file"
            className="sr-only"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="target-role">
          Target role
        </label>
        <select
          id="target-role"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
          value={targetRole}
          onChange={(event) => setTargetRole(event.target.value)}
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div>
        <button
          className="w-full rounded-xl bg-[#D4F34A] px-5 py-4 text-base font-bold text-slate-950 shadow-sm transition hover:bg-[#c9e83c] focus:outline-none focus:ring-4 focus:ring-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={!file}
        >
          Analyse my resume
        </button>
        <p className="mt-2 min-h-5 text-sm text-rose-700" role="alert" aria-live="polite">
          {fileError}
        </p>
      </div>
    </form>
  )
}

export default UploadForm
