const CONNECTION_ERROR = 'Could not reach the server. Check your connection and try again.'
const API = import.meta.env.VITE_API_URL ?? ''

export async function analyzeResume(file, jobDescription, userId) {
  const formData = new FormData()
  formData.append('resume', file)
  formData.append('jobDescription', jobDescription)
  formData.append('userId', userId)

  let response
  let data
  try {
    response = await fetch(`${API}/api/analyze`, {
      method: 'POST',
      body: formData,
    })
    data = await response.json()
  } catch {
    throw new Error(CONNECTION_ERROR)
  }

  if (!response.ok) {
    throw new Error(data.error ?? 'We couldn’t complete the analysis. Please try again.')
  }

  return data
}

export async function getResults(userId) {
  let response
  let data
  try {
    response = await fetch(`${API}/api/results?userId=${encodeURIComponent(userId)}`)
    data = await response.json()
  } catch {
    throw new Error(CONNECTION_ERROR)
  }

  if (!response.ok) {
    throw new Error(data.error ?? 'Could not load your analysis history.')
  }

  return data.results
}
