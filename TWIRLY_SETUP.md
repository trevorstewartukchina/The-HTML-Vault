# Twirly Product Photo Corrector — environment setup

Your uploaded code is an **Express server**, so it will not run on pure static hosting (like plain GitHub Pages) by itself.

## 1) Local run

```bash
npm install
cp .env.example .env
# fill GEMINI_API_KEY in .env
npm start
```

Then open `http://localhost:3000`.

## 2) Deploy in a server environment

Use a Node-friendly host (Render, Railway, Fly.io, VPS, etc):

- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `GEMINI_API_KEY` (required)
  - `GEMINI_MODEL` (optional)
  - `PORT` (usually provided by platform)

## 3) If you must keep GitHub Pages

GitHub Pages cannot execute `/generate` because it is static-only.

Use one of these patterns:

- Host this Node server separately and point the frontend `fetch` call at that API URL.
- Move backend logic into a serverless platform (e.g. Cloudflare Workers, Netlify Functions, Vercel Functions) and call that endpoint from your static page.

## 4) Issues fixed from the pasted script

- Removed accidental duplicated full file content that causes syntax/runtime confusion.
- Switched API key handling to environment variables (safer than hardcoding).
- Added standard npm scripts and dependency manifest for reproducible setup.
