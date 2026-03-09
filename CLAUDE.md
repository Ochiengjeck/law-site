# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
npm run seed     # Seed the SQLite database (run after db push)

# Database setup (first time or after schema changes)
npx prisma generate   # Regenerate Prisma client
npx prisma db push    # Sync schema to SQLite (creates dev.db)
npx prisma studio     # Browse database in browser UI
```

## Stack

- **Next.js 16** with App Router (no Pages Router). Route protection uses `proxy.ts` (renamed from `middleware.ts` in Next.js 16); the exported function must be named `proxy`, not `middleware`
- **React 19** — use `useActionState` from `"react"` (not react-dom) for form state
- **TypeScript** strict mode; path alias `@/*` maps to root
- **Tailwind CSS v4** — configured via `app/globals.css` using `@import "tailwindcss"` and `@theme inline` for CSS variable tokens
- **Prisma 6** + **SQLite** — database file at `prisma/dev.db`; schema at `prisma/schema.prisma`
- **`jose`** — JWT for admin sessions (edge-compatible); sessions stored in `admin_session` httpOnly cookie
- **`bcryptjs`** — password hashing for admin users
- **Geist** font family loaded via `next/font/google`; exposed as CSS variables

## Brand Design System

Defined in `app/globals.css` via `@theme inline`:

| Token | Value | Utility |
|-------|-------|---------|
| `--color-navy` | `#1B3A6B` | `bg-navy`, `text-navy` |
| `--color-navy-dark` | `#0f2548` | `bg-navy-dark`, `text-navy-dark` |
| `--color-gold` | `#C9A84C` | `bg-gold`, `text-gold` |
| `--color-gold-dark` | `#b8953e` | `bg-gold-dark`, `text-gold-dark` |
| `--color-light-gray` | `#F5F7FA` | `bg-light-gray` |

## Architecture

### Public Site (`app/`)
- `/` — Home (hero + services + partners preview + CTA)
- `/about` — Firm philosophy and Blue Economy focus
- `/services` — Five practice areas with anchor IDs (`#maritime`, `#esg`, `#corporate`, `#conveyancing`, `#other`)
- `/partners` — Static profiles for Faith Sulwe and Lillian Waweru
- `/blog` — Published posts fetched from DB
- `/blog/[slug]` — Individual post by slug
- `/contact` — Client inquiry form (saves to `Inquiry` table)

### Admin Panel (`app/admin/`)
- `/admin` — Login page (unauthenticated)
- `/admin/dashboard` — Stats overview (session-protected)
- `/admin/dashboard/inquiries` — View and update inquiry status
- `/admin/dashboard/blog` — Manage blog posts (list, delete)
- `/admin/dashboard/blog/new` — Create post
- `/admin/dashboard/blog/[id]/edit` — Edit existing post

Admin routes are protected at two layers:
1. `proxy.ts` — JWT verification in the proxy layer for `/admin/dashboard/:path*`
2. `app/admin/dashboard/layout.tsx` — Server-side `getSession()` check with redirect

### Key Files
- `lib/prisma.ts` — Singleton PrismaClient
- `lib/auth.ts` — `createSession()`, `getSession()`, `destroySession()` using `jose`
- `app/actions/inquiries.ts` — `submitInquiry` server action (contact form)
- `app/admin/actions.ts` — `login`, `logout` server actions
- `app/admin/dashboard/blog/actions.ts` — `createPost`, `updatePost`, `deletePost`, `updateInquiryStatus`

### Database Models
`AdminUser` · `Inquiry` · `BlogPost` · `Service`

### Default Admin Credentials (development seed)
- Email: `admin@swlaw.com`
- Password: `Admin1234!`

## Deployment
Configured for Railway. Set `DATABASE_URL` and `JWT_SECRET` as environment variables. Railway provides persistent volumes for the SQLite `dev.db` file.
