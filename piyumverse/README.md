# The Piyumverse

Permanent digital identity of Piyum Dakshina — built with Next.js 16 and [Payload CMS](https://payloadcms.com) (SQLite).

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — custom design system in `globals.css`
- **Payload 3 CMS** — SQLite, rich text (Lexical), admin panel at `/admin`
- Static pages + SSG detail pages with 1-minute revalidation

## Design

A dark, glassmorphic one-pager inspired by the Minfo layout and the hackX Jr aesthetic:

- **Palette** — deep teal-black background (`#010E13`), translucent glass cards, cyan accent (`#18A0C0` → `#72E5F8`) with soft glows
- **Typography** — Poppins (200–700), light 200-weight section titles with bold cyan gradient accents
- **Layout** — fixed left sidebar (avatar, rotating role words, meta, mini skill rings) + right icon nav rail with tooltips on desktop; slide-in drawer header on mobile
- **Effects** — pulsing glow + shimmer-sweep primary buttons, glassy outline buttons, shimmer-border hero card, pixel-grid patterns, glow stat cards, blur-fade reveals, custom cursor, preloader, marquee, word-rotate
- **PWA** — installable (manifest + service worker) and viewable offline once visited

## Pages

- `/` — one-page portfolio: intro hero, overview cards, about + stats, skills, philosophy, athletics, portfolio, blog, gallery, GitHub repos, testimonials, contact
- `/projects` + `/projects/[slug]` — project grid and detail pages (GitHub / live demo links, real cover images)
- `/blog` + `/blog/[slug]` — blog list and articles (covers + per-post OG images)
- `/about`, `/philosophy`, `/athletics` — personal pages (CMS globals)
- `/gallery` — photo gallery with category filter + lightbox (CMS global)
- `/resume` + `/resume.pdf` — printable resume
- `/contact` — contact form with messages stored in the CMS
- `/feed.xml` (RSS), `/llms.txt` (AI index), `sitemap.xml`, `robots.txt`
- `/admin` — Payload admin panel

## Getting Started

**One command** (installs dependencies, seeds an empty database, starts the dev server):

```bash
npm run start-all
```

**One click** (Windows): double-click `start.bat` in the **parent folder** (the folder that contains `piyumverse/`).

Or manually:

```bash
npm install
npm run seed   # only if the database is empty
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## CMS Admin

Everything on the site is editable from the CMS admin panel at **http://localhost:3000/admin**.

If the database is empty, seed it with the existing content:

```bash
npm run seed
```

Default admin user created by the seed:

```
Email:    admin@piyumdakshina.com
Password: Piyumverse@2026
```

> Change the password after first login. Override with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars.

Regenerate TypeScript types and the admin import map after changing collections/globals:

```bash
npm run types
```

## What's manageable

- **Projects** — add/edit/delete projects (cards + detail pages), tech stacks, status, links, cover images
- **Posts** — blog posts with a rich text editor, covers, drafts and published states (`/blog`)
- **Gallery** — upload photos with captions and categories (`/gallery`)
- **Testimonials** — quotes from mentors, teammates, and judges (homepage)
- **Contact Messages** — everything submitted through the contact form, with read tracking
- **Media** — image uploads (auto-resized)
- **Site Settings** (global) — site name, SEO metadata, navigation links, hero section, footer, social links, contact page text, home stats/skills/tools
- **About / Philosophy / Athletics pages** (globals) — every heading, paragraph, value, and achievement
- **Users** — additional admin accounts

## Database

SQLite — the database file (`piyumverse.db`) is created automatically in the `piyumverse/` folder. Copy it (or the whole project folder) to move the site; uploaded files live in the `media/` folder next to the app.

Environment variables (see `.env.example`):

- `DATABASE_URL` — SQLite connection string (default `file:./piyumverse.db`)
- `PAYLOAD_SECRET` — secret used for auth; generate one with `openssl rand -hex 32`
- `NEXT_PUBLIC_SERVER_URL` — your public URL
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — set to your domain to enable Plausible analytics (create a site at plausible.io first)

## Commands

- `npm run dev` — development server
- `npm run start-all` — one command: install → seed (if empty) → dev server
- `npm run build` / `npm start` — production
- `npm run seed` — seed the database with default content
- `npm run types` — regenerate Payload TypeScript types

## Structure

- `src/app/(my-app)/` — the public site (`globals.css` holds the design system: palette tokens, glass cards, buttons, effects)
- `src/app/(payload)/` — Payload admin panel
- `src/components/` — shared UI (Sidebar, NavRail, Header, HeroSection, ProjectCard, ContactForm, effects)
- `src/components/effects/` — Reveal, CountUp, Cursor, Preloader, ScrambleText, WordRotate
- `src/collections/` + `src/globals/` — CMS models (projects, posts, contact messages, media, users, settings, about/philosophy/athletics/gallery/testimonials globals)
- `scripts/` — `seed.ts` (default content), `generate-types.ts`, `start-all.mjs` (one-command runner)
- `media/` — uploaded files
- `public/sw.js` — offline service worker (registered in production builds)
