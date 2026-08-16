# Link Shortener

A full-stack URL shortener: NestJS + MongoDB API, Next.js 15 frontend. Anonymous
or authenticated link creation, custom back-halves, per-link click analytics,
QR code generation, and dark mode.

## Stack

- **Backend** (`backend/`): NestJS, MongoDB/Mongoose, JWT auth (httpOnly cookie),
  class-validator, Swagger, rate limiting. See `backend/README.md` for
  module-by-module detail — start at `backend/src/app.module.ts`.
- **Frontend** (`frontend/`): Next.js (App Router), TypeScript, Tailwind CSS v4,
  @tanstack/react-form + react-query, next-themes, recharts.

## Quick start

### Docker Compose (recommended)

```bash
cp .env.example .env   # fill in JWT_SECRET at minimum
docker compose up --build
```

- Frontend: http://localhost:3001
- API + Swagger docs: http://localhost:3000/docs

### Running locally without Docker

Requires Node 20+ and a local/remote MongoDB instance.

```bash
npm run install:all

cp backend/.env.example backend/.env    # set DATABASE_URL and JWT_SECRET
cp frontend/.env.example frontend/.env.local

npm run dev:backend    # in one terminal
npm run dev:frontend   # in another
```

## Scripts (root)

| Script | Description |
| --- | --- |
| `npm run install:all` | Install both apps' dependencies |
| `npm run dev:backend` / `dev:frontend` | Run either app in watch mode |
| `npm run build` | Build both apps |
| `npm run lint` | Lint both apps |
| `npm run test` | Run backend unit tests |
| `npm run docker:up` / `docker:down` | Manage the Compose stack |

## Architecture notes

- **Auth**: the JWT lives in an httpOnly, Secure (in production), SameSite
  cookie set by the API — the frontend never reads or stores it directly.
- **Anonymous links**: identified by a long-lived, non-sensitive `anonId`
  cookie generated client-side, separate from the auth cookie.
- **Redirects**: `GET /r/:code` on the API issues a real HTTP 302 and records
  a click event; the frontend never renders a client-side redirect page.
- **Ownership**: every read/delete/analytics route on a link is checked
  against the requester (JWT subject or anon id) server-side.

See `backend/.env.example` and `frontend/.env.example` for the full list of
configuration variables.
