# Decision document
## 1. Scope of version one
Decision: Build a small, no-login resume analyzer for final-year students applying to their first developer job.
Options considered: A full job-search platform; a resume analyzer with accounts and integrations; a focused single-resume analyzer.
Chosen: Upload one PDF, select one of four fixed developer roles, receive a role-specific score out of 100, skills found and missing, and exactly three plain-language fixes.
Why: This directly helps users understand why one resume may not fit a role, while keeping the work feasible in two 3-hour sessions.
Revisit when: Users validate the core analysis and request features that require saved history, integrations, or broader job-search support.

## 2. Architecture
Decision: Use a React client with serverless functions as the only backend; functions call Claude and MongoDB.
Options considered: React calling Claude directly from the browser; serverless functions without a long-running server; React calling a Node.js + Express server that connects to Claude and MongoDB.
Chosen: Serverless functions, with Claude and MongoDB credentials kept in server-side environment variables.
Why: This avoids exposing secrets and avoids managing a continuously running server, making a day-two deployment achievable while leaving a clear backend boundary.
Revisit when: Local function debugging or execution limits become a blocker, or the product needs long-running jobs, persistent connections, or more control over request handling.
