<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4047c0c3-7e9f-4cbe-877b-5ed960e0976d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure env in `.env.local` (copy from `.env.local.example`):
   - `API_HOST` — backend base URL for the same-origin `/backend-api/*` proxy (default `http://localhost:3000`)
   - `NEXT_PUBLIC_FRONTEND_URL` — POS app URL (target for "Mở POS")
   - `NEXT_PUBLIC_AFFILIATE_URL` — affiliate app URL ("become an affiliate" entry)
   - `NEXT_PUBLIC_API_HOST` / `API_HOST` — Rails OAuth provider (browser / server origins)
   - `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET` / `OAUTH_REDIRECT_URI` / `OAUTH_SCOPES` — OAuth (Authorization Code + PKCE) client
3. Run the app:
   `npm run dev`
4. Open the URL printed by the dev server (port 3003 by default; 3004 under the docker compose dev stack).
