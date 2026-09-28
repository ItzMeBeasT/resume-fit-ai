const CONNECTION_ERROR = 'Could not reach the server. Check your connection and try again.'
const API = import.meta.env.VITE_API_URL ?? ''

export async function analyzeResume(file, targetRole, userId) {
  const formData = new FormData()
  formData.append('resume', file)
  formData.append('targetRole', targetRole)
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
    throw new Error(data.error)
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
