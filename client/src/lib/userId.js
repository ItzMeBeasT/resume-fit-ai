const USER_ID_STORAGE_KEY = 'resume-analyzer-user-id'

export function getUserId() {
  const storedUserId = window.localStorage.getItem(USER_ID_STORAGE_KEY)
  if (storedUserId) return storedUserId

  const userId = window.crypto.randomUUID()
  window.localStorage.setItem(USER_ID_STORAGE_KEY, userId)
  return userId
}
