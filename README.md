# Atlas — Academic OS

An AI-powered academic companion. Monorepo with a **FastAPI** backend and a
**Next.js 14 (App Router) + TypeScript + Tailwind** frontend, backed by
**Supabase** (Auth + Postgres).

```
atlas-academic-os-main/
├── backend/                 FastAPI service (auth + onboarding)
│   ├── app/
│   │   ├── routers/         auth.py, onboarding.py
│   │   ├── utils/           supabase_client.py, auth.py (JWT dependency)
│   │   ├── config.py
│   │   └── main.py
│   ├── db/schema.sql        Run this in Supabase SQL editor
│   ├── requirements.txt
│   └── .env.example
└── frontend/                Next.js app
    ├── src/
    │   ├── app/             pages (onboarding, auth, dashboard, …)
    │   ├── components/
    │   └── lib/             api.ts, onboarding.ts, supabase.ts
    └── .env.example
```

## 1. Database setup

In the Supabase dashboard open **SQL → New query**, paste the contents of
[`backend/db/schema.sql`](backend/db/schema.sql) and run it. This creates the
`users` and `onboarding` tables (with row-level security) and the triggers.

In **Authentication → Settings**, turn **"Enable email confirmations" OFF**
during development so signups don't hit the free-tier email rate limit and can
log in immediately.

For Google sign-in, add `http://localhost:3000/auth/callback` under
**Authentication → URL Configuration → Redirect URLs**.

## 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # optional
pip install -r requirements.txt
cp .env.example .env        # then fill in SUPABASE_URL + SUPABASE_SERVICE_KEY
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Endpoints

| Method | Path                      | Auth | Purpose                                  |
|--------|---------------------------|------|------------------------------------------|
| POST   | `/api/auth/signup`        | —    | Create account + profile row            |
| POST   | `/api/auth/login`         | —    | Sign in; returns tokens + `onboarding_completed` |
| GET    | `/api/onboarding`         | ✅   | Fetch saved onboarding data             |
| PUT    | `/api/onboarding?complete=` | ✅ | Upsert onboarding data (optionally finish) |
| POST   | `/api/onboarding/complete`| ✅   | Mark onboarding complete (used by Skip) |

Authenticated routes expect `Authorization: Bearer <supabase-access-token>`.

## 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # fill in API URL + Supabase public keys
npm run dev
```

App: http://localhost:3000

## Onboarding flow

1. **Signup / Login** → tokens stored in `localStorage`; the app routes to
   `/onboarding` for new users or `/dashboard` for users who already finished.
2. **Steps 1–4** write into a shared React context (`OnboardingContext`).
   Pressing **Continue** saves the current data to the backend via
   `PUT /api/onboarding`. Leaving **step 4** sends `?complete=true`.
3. **Step 5** confirms completion and links to the dashboard.
4. **Skip for now** calls `POST /api/onboarding/complete` and jumps to `/dashboard`.

On return visits, the context loads any previously-saved answers from
`GET /api/onboarding`, so the wizard is pre-filled.
