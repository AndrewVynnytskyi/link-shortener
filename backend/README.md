# Backend (NestJS)

REST API for the link shortener: auth, URL shortening, redirects, click
analytics, and page-title lookup.

See the root [README](../README.md) for Docker/quick-start instructions.

## Modules

| Module | Responsibility |
| --- | --- |
| `auth/` | Signup/login/logout, JWT issued as an httpOnly cookie (`src/auth/auth.controller.ts`) |
| `urls/` | Create/list/delete short links, anonymous vs. authenticated split, custom slugs (`src/urls/url.controller.ts`) |
| `redirects/` | `GET /r/:code` — public redirect endpoint, records a click event |
| `analytics/` | Click event storage + owner-guarded summary endpoint |
| `information/` | Best-effort `<title>` scraping for a destination URL |
| `config/` | Boot-time-validated, typed environment config (`src/config/env.validation.ts`) |
| `common/` | Cross-cutting: exception filter, request logging, `@CurrentUser()`, `/health` |

## Running locally

```bash
cp .env.example .env   # set DATABASE_URL and JWT_SECRET
npm install
npm run start:dev
```

API listens on `http://localhost:3000` by default; interactive Swagger docs
are served at `/docs`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run start:dev` | Watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run the compiled build |
| `npm run lint` | ESLint (`--fix`) |
| `npm run format` / `format:check` | Prettier |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests (spins up the full `AppModule`) |
| `npm run test:cov` | Unit tests with coverage |

## Auth model

The JWT is signed with only `{ sub, username, email }` — never the password
hash — and delivered as an httpOnly, `SameSite=Lax` cookie set by
`POST /auth/login` (`Secure` when `NODE_ENV=production`). The frontend never
reads or stores the token directly; `withCredentials: true` on its HTTP
client lets the browser attach the cookie automatically.

Anonymous link ownership uses a separate, non-sensitive `anonId` value
supplied by the client (see `frontend/src/hooks/use-anon-id.ts`) — it is
never a substitute for authentication and only gates access to that
specific anonymous client's own links.
