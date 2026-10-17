# Agent.md — Developer & AI Agent Guide for So Coffee

Welcome to **So Coffee** (`SoCafe`). This document provides operational guidelines, architecture details, conventions, and workflows for AI agents and developers contributing to this repository.

---

## 1. Project Overview & Philosophy

- **Application**: Website and digital hub for **So Coffee**, a warm, community-driven café operating inside the **Lucan Community Centre** in Lucan, Co. Dublin, Ireland.
- **Design DNA**: High-fidelity reproduction of the official Figma concept design. Warm, earthy, artisanal café aesthetic: rich espresso browns (`#2C2418`, `#3B2F1E`), soft cream foam tones (`#F5F0E8`, `#F8F4ED`), and warm amber accents (`#A67C3D`).
- **Tech Stack**:
  - **Framework**: Next.js (App Router, React 19 / 18, TypeScript).
  - **Styling**: Handcrafted CSS Design System (`app/globals.css`) with CSS custom properties, responsive clamp scaling, glassmorphism, and micro-animations.
  - **Backend / Database**: Supabase (PostgreSQL, Row Level Security, Auth, RESTful SDK).
  - **Typography**: Google Fonts via `next/font/google` (*Playfair Display* for high-contrast serif headers and *Inter* for crisp body typography).
  - **Deployment Target**: Vercel / Node.js container.

---

## 2. Directory Structure

```
SoCafe/
├── app/
│   ├── about/page.tsx               # Dedicated /about route page
│   ├── admin/
│   │   ├── layout.tsx               # Admin shell layout with AdminAuthProvider
│   │   ├── login/page.tsx           # Manager login portal with demo credentials
│   │   └── page.tsx                 # Full Admin Dashboard (Overview, Bookings, Menu, Settings)
│   ├── api/
│   │   ├── menu/route.ts            # CRUD /api/menu (GET, POST, PUT, DELETE)
│   │   └── reservations/route.ts    # CRUD /api/reservations (GET, POST, PATCH, DELETE)
│   ├── book/page.tsx                # Dedicated /book route page with reservation form
│   ├── menu/page.tsx                # Dedicated /menu route page with search & filters
│   ├── visit/page.tsx               # Dedicated /visit route page with transit & FAQ
│   ├── globals.css                  # Core CSS design system & component styles
│   ├── layout.tsx                   # Root layout, fonts, meta & ToastProvider
│   └── page.tsx                     # Main landing page composing sections
├── components/
│   ├── BackToTop.tsx                # Floating smooth-scroll button
│   ├── BookingModal.tsx             # Interactive reservation dialog
│   ├── Community.tsx                # Community section with Lucan tag & quote
│   ├── EveryCup.tsx                 # Full-width atmospheric banner
│   ├── FoodHighlights.tsx           # 4 visual cards that filter menu
│   ├── Footer.tsx                   # Footer navigation & social channels
│   ├── Hero.tsx                     # Hero banner with parallax & CTAs
│   ├── MenuSection.tsx              # Tabbed menu (Hot, Cold, Food, Treats)
│   ├── Navbar.tsx                   # Fixed glassmorphism navbar & mobile drawer
│   ├── OurStory.tsx                 # Story section with latte art photography
│   ├── ScrollRevealInit.tsx         # Intersection observer for scroll animations
│   ├── Toast.tsx                    # Toast notification context & provider
│   └── VisitUs.tsx                  # Location, opening hours, map & contact
├── data/
│   └── menu.ts                      # Menu constants & fallback items
├── lib/
│   └── supabase/
│       ├── client.ts                # Browser Supabase client singleton
│       └── server.ts                # Server Supabase client
├── public/
│   └── images/                      # Optimized image assets (hero, food, community)
├── types/
│   └── supabase.ts                  # Database schema types & row interfaces
├── .env.example                     # Supabase environment variables template
├── .env.local                       # Local environment variables
├── Agent.md                         # Guidelines for AI agents (this file)
├── Memory.md                        # Context, history & decision record
├── Prd.md                           # Product Requirements Document
├── package.json                     # Scripts & dependencies
└── tsconfig.json                    # TypeScript compiler configuration
```

---

## 3. Essential Workflows & Commands

### Development Server
```bash
npm run dev
# Starts local Next.js server on http://localhost:3000 (or next open port)
```

### Production Build & Verification
```bash
npm run build
# Compiles App Router, checks types, optimizes assets
```

### Starting Production Server
```bash
npm run start
```

### Linting
```bash
npm run lint
```

---

## 4. Supabase Backend Architecture & Fallback Behavior

The app is engineered with a **zero-downtime, graceful-fallback architecture**:
1. When `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided in `.env.local`, the app connects directly to live PostgreSQL tables:
   - `menu_items`: Dynamic menu prices and descriptions.
   - `reservations`: Table and space booking submissions.
   - `categories`: Menu category taxonomy.
2. When environment variables are missing or set to placeholders:
   - The application **does not crash**.
   - Menu items load instantly from `data/menu.ts`.
   - Reservation submissions return simulated success and log the payload, allowing full end-to-end UI testing without an active database connection.

---

## 5. Coding Standards for AI Agents

1. **Preserve Visual Excellence**: Do not replace custom design system tokens in `app/globals.css` with generic styles. The site's warm palette and serif typography are central to the brand.
2. **Client vs Server Components**:
   - Keep page-level and static marketing sections server-friendly or lightweight.
   - Interactive components (`BookingModal`, `Navbar`, `MenuSection`, `Toast`) must have `'use client'`.
3. **TypeScript Strictness**: Always import or declare types from `@/types/supabase` or `@/data/menu`. Never use `any` unless strictly unavoidable.
4. **Git Discipline**:
   - Remote repository: `https://github.com/ITWala2025/SoCafe.git`
   - Keep `.gitignore` updated (ignore `.next/`, `node_modules/`, `.env*.local`).
   - Use conventional commit messages (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`).
