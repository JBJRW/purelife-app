# PureLife Wellness Club

AI-powered wellness platform (dr.smoothie.ai) featuring Dr. Smoothie AI chatbot, nutrition recipes, healthy store locator, video agent, and a membership/subscription system.

## Run & Operate

- `pnpm --filter @workspace/purelife run dev` — run the frontend (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite (JSX/JS components), Framer Motion, Tailwind v4
- UI: inline CSS styles (original Vercel/v0 style) + shadcn/ui components in `/components/ui/`
- Auth: Supabase Auth
- DB: Supabase PostgreSQL (external) + Replit PostgreSQL (available via `@workspace/db`)
- API: Express 5 (`artifacts/api-server/`)
- Payments: Stripe (via `/api/stripe-checkout` endpoint)
- AI: Anthropic Claude (via `/api/chat` endpoint), via ANTHROPIC_API_KEY
- Maps: Leaflet (loaded via CDN in index.html)

## Where things live

- `artifacts/purelife/` — React + Vite frontend (main app)
- `artifacts/purelife/src/App.jsx` — Main app component with screen routing
- `artifacts/purelife/src/pages/` — Page components (Landing, MapScreen, RecipesScreen, VideoAgent, etc.)
- `artifacts/purelife/src/components/` — Shared components (DrSmoothieAI, OnboardingChat, etc.)
- `artifacts/purelife/src/hooks/useHermes.js` — HERMES orchestrator hook (membership/permissions)
- `artifacts/purelife/src/lib/supabase.js` — Supabase client
- `artifacts/purelife/src/i18n.js` — Internationalization (15 languages)
- `artifacts/purelife/src/context/AuthContext.jsx` — Auth context (Supabase)
- `artifacts/api-server/` — Express backend
- `lib/api-spec/openapi.yaml` — OpenAPI spec source of truth

## Architecture decisions

- App is migrated from Vercel/v0 (already was Vite+React, not Next.js)
- Frontend uses inline CSS styles + framer-motion (original design preserved)
- Supabase is the auth + data backend (external); Replit DB available for additional features
- Leaflet maps loaded via CDN (not npm) to avoid SSR issues
- HERMES = orchestrator agent that tracks user tier/permissions from Supabase
- App starts in "comingsoon" screen → wellness diagnostic → auth → main app

## Product

- Coming Soon + wellness diagnostic quiz
- Auth (Supabase email/password + social)
- Home dashboard with HERMES-powered personalization
- Dr. Smoothie AI chat (Claude-powered)
- Recipes + smart shopping list
- Healthy store locator (Leaflet + OpenStreetMap)
- Video Agent (AI-generated wellness videos)
- News section (Supabase-backed)
- Community Hub (placeholder)
- Plans/subscription (Stripe)
- 15-language i18n support

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `src/main.jsx` is the entry point (JSX, not TSX) — index.html points to it
- Supabase credentials are hardcoded as fallbacks in `lib/supabase.js` and `context/AuthContext.jsx` — set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as env vars for production
- Leaflet is loaded via CDN script tags in `index.html`, not via npm import
- MapScreen uses the global `window.L` Leaflet instance
- API routes in `.migration-backup/api/` need to be ported to `artifacts/api-server/src/` for full functionality

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
