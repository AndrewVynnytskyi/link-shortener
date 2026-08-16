# Frontend (Next.js)

The link shortener's UI: shorten/manage links, auth, dark mode, per-link
analytics and QR codes.

See the root [README](../README.md) for Docker/quick-start instructions.

## Structure

```
src/
  app/              routes (App Router) — thin; delegate to components/hooks
  components/
    ui/             dumb, reusable primitives (Button, Input, Card, Dialog, ...)
    forms/          @tanstack/react-form forms built from ui/ primitives
    links/          link list/card, QR studio, analytics drawer
    layout/         Header, Footer, ThemeToggle
    icons/          hand-rolled SVG icon components
  services/         all HTTP calls (axios) — the only files that import axios
  hooks/            react-query hooks + small client-side hooks (clipboard, anon id)
  store/            AuthProvider/useAuth — session state only, delegates to services/
  types/            shared TS types mirroring the backend's DTOs
  utils/            pure helpers (env access, class-name merging, formatting)
```

## Running locally

```bash
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at the backend
npm install
npm run dev
```

Runs on `http://localhost:3000` by default (or whatever port you configure);
in the Docker Compose stack it's served on `3001` to avoid colliding with
the API.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build (`output: "standalone"`) |
| `npm start` | Run the production build |
| `npm run lint` | `next lint` |
| `npm run format` / `format:check` | Prettier (with Tailwind class sorting) |

## Notable choices

- **Dark mode**: `next-themes`, driven by CSS custom properties in
  `app/globals.css` — components use semantic tokens (`bg-surface`,
  `text-muted`, ...) rather than hardcoded light/dark Tailwind classes.
- **Data fetching/caching**: `@tanstack/react-query` for all server state;
  mutations invalidate the relevant query keys instead of manual
  `setState` splicing.
- **Auth**: the JWT lives in an httpOnly cookie set by the API — this app
  never reads it. `useAuth()` just asks `GET /auth/status`.
- **Short links**: point directly at the backend's `GET /r/:code`, which
  issues a real HTTP redirect — there's no client-side redirect page.
