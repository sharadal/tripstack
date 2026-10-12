# TripStack

A calm, friendly travel planner: track upcoming trips, budgets, activities and packing lists in one place, and take a two-minute quiz to find out what kind of trip you're due for.

**Live site:** https://tripstack-mauve.vercel.app

## Features

- **Trips** — browse featured trips, search by destination, filter by trip type, and see a countdown to each departure.
- **Plan your own trip** — add dates, budget, activities, packing list and notes, then track spending against the budget.
- **Travel-style quiz** — a short quiz that suggests what kind of trip suits you.
- **Google sign-in** — one-click login with your Google account.
- **Profiles** — edit your name, bio, location, links and avatar.
- **My Travel Essentials** — reusable packing lists that only you can see.
- **Newsletter** — sign up for monthly travel ideas.
- **Admin area** — allowlisted admins can add, edit and remove newsletter subscribers.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions) with React 19 and TypeScript
- [Supabase](https://supabase.com) for Postgres, Google auth, Row Level Security and avatar storage
- [Tailwind CSS 4](https://tailwindcss.com) for styling, including dark mode
- [Sonner](https://sonner.emilkowal.ski) for toast notifications
- Google Analytics 4 via `@next/third-parties`
- Deployed on [Vercel](https://vercel.com)

## Project requirements

| Requirement | How TripStack meets it |
|---|---|
| Full-stack Next.js + Supabase (3+ tables) | 4 tables: `trips`, `profiles`, `essentials_lists`, `subscribers` (see `supabase/`) |
| Google login with profiles and roles | Google OAuth through Supabase; a profile per user; admin role from a server-side email allowlist (`ADMIN_EMAILS`), checked on the admin page and in every admin Server Action |
| User-generated content | Profiles, avatars and essentials lists, each protected by RLS so users only see their own |
| Search | Search destinations on the home page, plus trip-type filters |
| Dark mode, animations | Theme toggle that remembers your choice (defaults to your OS setting); fade-in, scroll-reveal and hover animations that respect reduced motion |
| SEO meta tags, OG images | Per-page metadata, Open Graph and Twitter cards, generated OG images per trip, `sitemap.xml` and `robots.txt` |
| Custom 404/500, loading states, toasts | `not-found.tsx`, `error.tsx`, `global-error.tsx`, loading skeletons, and Sonner toasts for save/delete results |
| Analytics | **Google Analytics 4** (used in place of Umami), loaded in production only |
| Responsive + accessible | Mobile-first layout, skip link, visible focus rings, labelled controls and live regions; Lighthouse accessibility score 100 |
| Deployed to Vercel | https://tripstack-mauve.vercel.app |

## Running locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` with:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server only, never NEXT_PUBLIC_
   ADMIN_EMAILS=you@gmail.com                        # comma-separated admin emails
   # Optional
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_CONTACT_EMAIL=hello@example.com
   ```

3. In the Supabase SQL Editor, run the scripts in `supabase/`: `schema.sql`, `trips.sql`, `profiles.sql` and `essentials.sql`. Enable the Google provider under Authentication.

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Then open http://localhost:3000.
