# Memory.md — Project Memory & Decision Record

This file documents key milestones, context, architecture choices, and the current state of **So Coffee** (`SoCafe`).

---

## 1. Project Genesis & Journey

1. **Initial Objective**:
   - Replicate the Figma concept design (`https://www.figma.com/make/7AUbPyXz5l9y8koZnZrQeD/SoCoffee-Website-Concept`) for So Coffee inside Lucan Community Centre, Ireland.
2. **Phase 1 (Design & Static Prototype)**:
   - Handcrafted CSS design system (`#2C2418` dark espresso, `#F5F0E8` cream foam, `#A67C3D` amber gold, *Playfair Display* & *Inter*).
   - Generated high-resolution imagery for all key sections.
3. **Phase 2 (Interactive Enhancements)**:
   - Added interactive booking modal, toast notifications, food highlights filtering, and Google Map.
4. **Phase 3 (Next.js & Supabase Backend Migration)**:
   - Migrated to Next.js App Router with TypeScript.
   - Decoupled into modular React components.
   - Installed `@supabase/supabase-js` and `@supabase/ssr`, created `types/supabase.ts`, `lib/supabase/client.ts`, and `lib/supabase/server.ts`.
5. **Phase 4 (Multi-Route Expansion & Admin Dashboard)**:
   - **Multi-Route Public Experience**:
     - `/` — Complete home landing page.
     - `/menu` — Dedicated menu page with live search, dietary notices, and category tabs.
     - `/about` — Dedicated about page with origin story, values grid, and photo gallery.
     - `/visit` — Dedicated visit us page with opening hours, transit directions, map, and visitor FAQ.
     - `/book` — Dedicated reservation page with full booking form, instant confirmation banner, and party guidelines.
   - **Admin Management Portal (`/admin`)**:
     - `/admin/login` — Manager sign-in workflow with one-click demo credentials (`admin@socoffee.ie` / `coffee123`) and Supabase Auth hook point.
     - `/admin` — Protected management dashboard with 4 core tabs:
       - **Overview**: Live stat metrics (Pending, Confirmed, Today's bookings, Active menu items), recent bookings table, quick action buttons.
       - **Reservations & Bookings**: Status filtering (All, Pending, Confirmed, Cancelled), search by guest name/email, quick Confirm/Cancel/Delete buttons, detail drawer.
       - **Menu Management**: Filter by category, Add Menu Item modal, Edit Menu Item modal, In-Stock/Sold-Out toggle button, delete confirmation.
       - **Settings & Announcements**: Today's announcement banner update, Supabase PostgreSQL runtime status monitor.
   - **API CRUD Operations**:
     - `/api/reservations` — GET, POST, PATCH, DELETE.
     - `/api/menu` — GET, POST, PUT, DELETE.
   - **Updated Documentation**: `Prd.md` and `Memory.md` updated to reflect the full feature set.

---

## 2. Core Architectural Decisions

- **Multi-Route Navigation**:
  - `Navbar.tsx` dynamically highlights the active route using `usePathname()` from `next/navigation`.
  - Footer provides direct navigation links to all public routes and a discreet Manager Portal link.
- **Admin Authentication**:
  - Managed via `lib/auth/admin.tsx` using `useAdminAuth` hook and session persistence.
  - Architecture is decoupled so café staff can immediately log in with demo credentials, and when Supabase Auth is enabled, swapping to `supabase.auth.signInWithPassword` requires zero UI changes.
- **Graceful Fallback Backend**:
  - Full CRUD operations work in local dev via in-memory stores if Supabase credentials are not provided in `.env.local`.
  - When Supabase credentials are provided, calls seamlessly persist to PostgreSQL tables (`menu_items`, `reservations`).

---

## 3. Remote Repository Details

- **GitHub Repository**: `https://github.com/ITWala2025/SoCafe`
- **Default Branch**: `main`

---

## 4. Current State & Verification

- [x] Multi-route pages operational (`/`, `/menu`, `/about`, `/visit`, `/book`)
- [x] Admin Login Portal operational (`/admin/login`)
- [x] Admin Dashboard operational (`/admin`) with Overview, Bookings, Menu, Settings tabs
- [x] Menu update options (Add, Edit, Delete, Stock toggle) live
- [x] Booking management (List, Filter, Confirm, Cancel, Delete, Detail view) live
- [x] Full CRUD API routes (`/api/reservations`, `/api/menu`)
- [x] Production build passes with 0 errors (`npm run build`)
- [x] `Prd.md` and `Memory.md` updated
