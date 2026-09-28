import multer from 'multer'

export function handleErrors(error, _request, response, _next) {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return response.status(413).json({ error: 'Keep the PDF under 4 MB.' })
  }

  console.error(`[Server] request failed: ${error.message}`)
  return response.status(500).json({ error: 'Something went wrong on our side.' })
}
