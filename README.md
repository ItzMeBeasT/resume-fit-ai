# resume-fit-ai

AI-powered resume analyzer that compares resumes with job descriptions to generate match scores, skill gaps, and actionable improvements using Gemini.

Compare a resume PDF with a real job description. The app returns a match score, strengths, gaps, and three practical improvements.

## Requirements

- Node.js 22.12 or newer
- MongoDB connection string
- Gemini API key

## Run locally

1. In `server/`, copy `.env.example` to `.env` and set `MONGODB_URI`, `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-3.5-flash-lite`, and `CLIENT_ORIGIN=http://localhost:5180`.
2. Install server dependencies with `npm ci`, then start the API with `npm run dev` (port 4000).
3. In another terminal, run `npm ci` in `client/`, then start Vite with `npm run dev` (port 5180).
4. Open http://localhost:5180.

The client sends PDF uploads and job descriptions to the Express API via the local `/api` proxy. The API extracts resume text in memory, sends both text inputs to Gemini, validates its response, and stores analysis results in MongoDB for recent-history display.

## Checks

- Client: `npm run lint` and `npm run build`
- Server: `npm test`
