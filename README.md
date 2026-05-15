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
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. (Optional) Enable dynamic pricing sync from backend in `.env.local`:
   - `LANDING_BACKEND_BASE_URL` (example: `http://localhost:3001`)
   - `LANDING_PRICING_TENANT` (tenant name for backend header; example: `waitee`)
   - `LANDING_PRICING_BEARER_TOKEN` (bearer token for protected endpoint or leave empty if API is public)
   - App sẽ proxy request backend qua endpoint nội bộ: `/backend-api/*`
   - If pricing API is not configured or unavailable, landing page falls back to local pricing data.
4. Configure captcha for signup page in `.env.local` (Cloudflare Turnstile - free):
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`
   - If you do not set these keys in local development, the app automatically uses Turnstile test keys.
   - In production, you must set real keys.
5. Run the app:
   `npm run dev`
6. Open landing page at `http://localhost:3002`
