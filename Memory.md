# Memory.md — Project Memory & Decision Record

This file documents key milestones, context, architecture choices, and the current state of **So Coffee** (`SoCafe`).

---

## 1. Project Genesis & Journey

1. **Initial Objective**:
   - The user requested a complete website for **So Coffee** located at Lucan Community Centre, Ireland, replicating the Figma concept design (`https://www.figma.com/make/7AUbPyXz5l9y8koZnZrQeD/SoCoffee-Website-Concept`).
2. **Phase 1 (Design & Static Prototype)**:
   - Extracted visual tokens, typography, and section structure from Figma captures.
   - Generated high-resolution imagery for all key sections (interior cafe, latte art, coffee & pastries, sweet treats, light bites, cold drinks, slow moments, community).
   - Built semantic HTML, handcrafted CSS design system, and vanilla JS interactions.
3. **Phase 2 (Interactive Polish)**:
   - Added interactive booking modal for tables/events.
   - Wired Food & Drink highlight cards to automatically switch tabs and navigate to the menu.
   - Integrated reliable Google Maps iframe embed for Lucan Community Centre.
   - Added toast notification system and back-to-top floating button.
4. **Phase 3 (Next.js & Supabase Migration)**:
   - Migrated codebase to **Next.js App Router with TypeScript**.
   - Modularized UI into decoupled React components (`Navbar`, `Hero`, `OurStory`, `MenuSection`, `FoodHighlights`, `EveryCup`, `Community`, `VisitUs`, `Footer`, `BookingModal`, `BackToTop`, `Toast`).
   - Integrated Supabase client scaffolding, TypeScript database definitions (`types/supabase.ts`), and Next.js API routes (`/api/reservations`, `/api/menu`).
   - Prepared `Agent.md`, `Memory.md`, `Prd.md`.
   - Initialized Git repository targeting remote `https://github.com/ITWala2025/SoCafe.git`.

---

## 2. Core Architectural Decisions

- **Framework Choice**: Next.js App Router (React 19 / 18, TypeScript) providing first-class SEO, server-side data fetching, API route endpoints, and production performance.
- **Styling Architecture**: Custom CSS Design System (`app/globals.css`) instead of utility libraries to maintain exact pixel-fidelity with the Figma prototype and artisanal typography.
- **Typography Strategy**: `next/font/google` loading *Playfair Display* and *Inter* with `swap` display and zero layout shift.
- **Supabase Backend Strategy**:
  - Typed Supabase client (`Database` interface matching PostgreSQL tables).
  - Graceful dev/fallback mode: when Supabase environment variables are missing, the app operates without error using static menu data and simulated reservation handling.
  - Server-side route handler `/api/reservations` handles reservation insertion and database persistence securely.

---

## 3. Remote Repository Details

- **GitHub Repository**: `https://github.com/ITWala2025/SoCafe`
- **Default Branch**: `main`

---

## 4. Current State & What's Next

- [x] Next.js App Router migration completed
- [x] TypeScript database definitions (`types/supabase.ts`)
- [x] Client & Server Supabase helpers (`lib/supabase/`)
- [x] API route handlers (`/api/reservations`, `/api/menu`)
- [x] Components modularized & interactive
- [x] Google Maps & location details verified
- [x] Documentation (`Agent.md`, `Memory.md`, `Prd.md`)
- [ ] Connect live Supabase project by updating `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Run Supabase database migration scripts (table schemas provided in `Prd.md`)
- [ ] Push commits to `https://github.com/ITWala2025/SoCafe`
