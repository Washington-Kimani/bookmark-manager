# Bookmarks Manager (Frontend)
## Demo Image


A modern, minimal bookmarks manager web app built with Next.js App Router. It lets you create, search, sort, and manage bookmarks with an authenticated experience. This repository contains the frontend; it talks to a REST API backend via Axios.

## Features

- Authentication (login/register) with token storage and session refresh
- Create, list, search, sort (recent/oldest/alphabetical), and delete bookmarks
- Responsive UI with Tailwind CSS and DaisyUI
- Toast notifications via Sonner
- Icons via Lucide React

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 + DaisyUI
- Axios, Sonner, Lucide React

## Prerequisites

- Node.js 18+ (LTS recommended)
- A running backend API that exposes endpoints under `/api/v1` (see API expectations below)

## Environment Variables

Create a `.env` file in the project root:

```
NEXT_PUBLIC_API_URL='http://localhost:5000'
# Or point to your hosted API
# NEXT_PUBLIC_API_URL='https://bookmarks-flask-api.onrender.com'
```

Notes:
- The app will call `${NEXT_PUBLIC_API_URL}/api/v1/...` (configured in `src/configs/api.ts`).
- Do not include the trailing `/api/v1` in `NEXT_PUBLIC_API_URL`; it is added automatically.

## Installation

```bash
# Install deps
npm install
# or
pnpm install
# or
yarn install
```

## Development

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Build & Production

```bash
# Build
npm run build

# Start production server (after build)
npm start
```

## Available Scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — build for production
- `npm start` — start the production server
- `npm run lint` — run ESLint

## Project Structure (high level)

```
src/
  app/
    (auth)/           # Auth routes (login, register)
    (protected)/      # Protected routes (bookmarks)
    globals.css       # Global styles (Tailwind)
    layout.tsx        # Root layout (AuthProvider, Toaster)
  components/         # UI components (auth forms, cards, layout)
  contexts/
    AuthContext.tsx   # Auth state, login/logout, token refresh, activity listener
  hooks/
    useBookmarks.ts   # CRUD & state management for bookmarks
  configs/
    api.ts            # Axios instance using NEXT_PUBLIC_API_URL
  utils/
    types.ts          # Shared TypeScript types
```

## Authentication Flow

- `AuthContext` stores `token` and `user` in `localStorage` and provides `login`, `logout`, and `refreshToken`.
- An activity listener can trigger token refresh on user activity (throttled).
- Protected pages (e.g., `/bookmarks`) rely on `useAuth()` and the presence of a valid token.

## Bookmarks UX

- Search across `body`, `url`, and `description` fields.
- Sort by recent, oldest, or alphabetical.
- Create and delete bookmarks inline with optimistic UI updates and toasts.

## API Expectations

The frontend expects a REST API under `${NEXT_PUBLIC_API_URL}/api/v1`. Common endpoints used:

- `POST /auth/login` — returns `{ token, user }`
- `POST /auth/register` — returns `{ token, user }` (or as defined by your backend)
- `POST /auth/refresh` — returns `{ token }` (new access token)
- `GET /bookmarks` — returns `{ data: Bookmark[] }`
- `POST /bookmarks` — returns `{ data: Bookmark }`
- `PUT /bookmarks/:id` — returns `{ data: Bookmark }`
- `DELETE /bookmarks/:id` — returns 204/200

Adjust shapes as needed to match your backend; see calls in `src/hooks/useBookmarks.ts` and `src/contexts/AuthContext.tsx`.

## Styling

- Tailwind CSS v4 with DaisyUI (see `postcss.config.mjs`, `globals.css`)
- Default theme is `nord` via `data-theme` on `<html>` in `app/layout.tsx`

## Troubleshooting

- 401/403 errors: ensure `NEXT_PUBLIC_API_URL` points to the correct backend and CORS is configured there.
- Network errors in development: verify your backend runs at the configured host/port and that it serves `/api/v1` routes.
- UI builds but data empty: check that the API returns `{ data: ... }` as expected by the hooks.

## License

MIT — see LICENSE if provided. Otherwise, you may adapt as needed for your project.
