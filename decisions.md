# Product and architecture decisions

## 1. Product scope

Decision: Help early-career developers compare one resume with the actual job they want.
Chosen flow: Upload one PDF, paste a job description, and receive a match score, strengths, gaps, and exactly three practical improvements.
Why: The job description is the source of truth; fixed role presets can miss the specific requirements of a real opening.

## 2. Architecture

Decision: Keep a React client and a Node.js + Express API.
Chosen flow: The client sends the PDF and job description to `/api/analyze`; Express extracts PDF text, calls Gemini, validates the response with Zod, and stores analysis results in MongoDB.
Security boundary: `GEMINI_API_KEY` stays on the server. Resume PDFs are processed in memory; resume text and job-description text are sent to Gemini. Scores and feedback are stored for recent-analysis history.
