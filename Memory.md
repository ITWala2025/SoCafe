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

5. **Phase 5 (Dual Booking Workflows & Menu Page Styling Fix)**:
   - **Menu Page Visibility Fix**:
     - Identified that `.menu-card` had cream text and translucent borders which had poor contrast inside `.page-content-section`'s default light background.
     - Resolved by introducing `.menu-page-wrapper` (`background: var(--color-dark-bg)`), ensuring consistent dark espresso theming matching the Figma prototype.
     - Verified via Chrome DevTools that all 25 menu items across 4 categories (Hot Drinks 7, Cold Drinks 6, Food 6, Sweet Treats 6) and search filtering render crisply.
   - **Dual Booking Workflows (Book a Table vs Host an Event)**:
     - Implemented an intuitive segmented switcher on `/book` and in `components/BookingModal.tsx`.

6. **Phase 6 (Admin Left Sidebar & Event Booking Refinements)**:
   - **1. Admin Left-Sidebar Menu (`app/admin/page.tsx`, `app/globals.css`)**:
     - Restructured `/admin` from top horizontal tabs into a persistent left-hand sidebar layout (`.admin-layout-with-sidebar` & `.admin-sidebar`).
     - Features brand header, vertical tab navigation with active accent indicators, live count badges (`Overview`, `Reservations & Bookings`, `Menu Management`, `Settings & Broadcast`), manager profile card, "View Site ↗" link, and "Sign Out" button.
     - Responsive mobile sticky navigation bar for screens under 900px.
   - **2. Label Simplification ("Host an Event")**:
     - Updated tab switcher and button labels on `/book` and in `components/BookingModal.tsx` from "Host an event / Gathering" to clean **"Host an Event"** (`🎉 Host an Event`).
   - **3. Expected Attendees Clean Display**:
     - Refactored `Expected Attendees *` dropdown options to display clean headcount numbers only:
       - `8 – 15 People`
       - `16 – 30 People`
       - `31 – 50 People`
       - `50+ People`
       - (Table party sizes similarly streamlined to `1 – 2 People`, `3 – 4 People`, `5 – 8 People`).
   - **4. Corporate Event Support**:
     - Added `Corporate Event` to the `Event / Gathering Type *` options in both `/book` and `components/BookingModal.tsx`.
   - **5. Location Selector & Outside Venue Support (AV Removal)**:
     - Removed the "AV & Equipment Setup" field.
     - Added a dedicated Event Location selector:
       - `So Coffee @ Lucan Community Centre (In-House)`
       - `Outside Location / Off-Site Venue`
     - When "Outside Location / Off-Site Venue" is selected, a conditional text field `Outside Venue Address / Location Details *` appears for the user to specify venue details.
     - Updated `types/supabase.ts` with `event_location: string | null`.
     - Updated `/api/reservations` POST handler to store `event_location` in Supabase and mock fallback store.
     - Updated admin reservation tables and detail drawer to display location badges and full outside venue addresses.
   - **Updated Documentation**:
     - `Prd.md` updated with the left-sidebar admin architecture, simplified event booking specifications, corporate event taxonomy, and outside venue logistics.
     - `Agent.md` updated with mandatory requirement for reviewing and updating `Memory.md` and `Prd.md` after every feature implementation.

7. **Phase 7 (Home Page Hero CTA Route Mapping)**:
   - **Hero CTAs Route Mapping (`components/Hero.tsx`)**:
     - Converted in-page scroll buttons into dedicated Next.js `<Link>` components:
       - *"View Our Menu"* (`.btn-primary`) now routes directly to `/menu`.
       - *"Find Us"* (`.btn-secondary`) now routes directly to `/visit`.
     - Removed obsolete in-page `scrollTo` logic to ensure clean client-side navigation.

8. **Phase 8 (/book Route Converted to Auto-Opening Booking Modal)**:
   - **Converted `/book` Page to Modal Route (`app/book/page.tsx`)**:
     - Converted `/book` from a separate standalone page form into an auto-opening modal experience.
     - Navigating to `/book` mounts the page with `BookingModal isOpen={true}` over the backdrop.
     - Closing the modal (via close button, Escape key, or backdrop click) smoothly navigates back to `/` or the previous view (`router.back()` / `router.push('/')`).
     - Submitting a booking or event proposal triggers the success toast notification and returns the guest to the homepage.
     - Updated `Navbar.tsx` and `Footer.tsx` navigation links so clicking 'Book' / 'Book a Space' routes to `/book` and launches the modal.

9. **Phase 9 (Single-Click Instant Modal Opening & Dev Cache-Bypass Fix)**:
   - **Issue Resolved**:
     - Previously, clicking "Book" on `/` attempted a full route navigation to `/book`, triggering Next.js dev server on-the-fly component compilation (`Route /book is rendering with server caches disabled... cache-bypass-in-dev`), which caused a noticeable latency where users felt they had to click twice.
   - **Solution Implemented**:
     - **Navbar & Footer**: On click, `e.preventDefault()` intercepts the click when `onOpenBooking` is active, immediately opening `BookingModal` in **zero milliseconds** on the very first click.
     - **URL Synchronization**: Updates the address bar to `/book` via `window.history.pushState(null, '', '/book')`, keeping the `/book` route intact.
     - **Return on Close**: When the modal closes, URL reverts to `/` via `window.history.pushState(null, '', '/')` or browser `popstate`.
     - **Direct /book Navigation**: `app/book/page.tsx` renders `<HomePage initialBookingOpen={true} />`, instantly opening the modal if a user visits `/book` directly or refreshes.
   - **Documentation & Verification**:
     - Updated `Prd.md` and `Memory.md` per mandatory instructions in `Agent.md`.

10. **Phase 10 (`/visit` Route Redesign & Alignment)**:
   - **Aesthetic & Brand Harmony**: Redesigned `/visit` to impeccably honor So Coffee's warm espresso, cream foam, and artisanal amber palette without deviating from the design system.
   - **Hero & Live Hours Status**: Added hero banner with real-time Dublin time calculation badge (`🟢 Open Now` / `🕒 Closed Now`), breadcrumbs, and 4 quick chips (Specialty Coffee & Bakes, 50+ Free Parking Spaces, Dublin Bus C1/C2/L53, 100% Step-Free Access).
   - **Balanced 2x2 Experience Grid**:
     - **Top Row**: Location & Entrance Wayfinding Card (Address, Eircode `K78 H3F6`, one-click Copy Address with toast notification, Google/Apple Map buttons, and inside-centre direction guide) alongside an interactive Google Maps card.
     - **Second Row (Side by Side)**: Compact Opening Hours Card (Mon–Fri 8am–4pm, Sat–Sun 9am–3pm, Bank Holidays 9am–2pm with active "Today" badge and kitchen notes) side by side with Contact & Enquiries Card (Email, Instagram, Venue Desk, Walk-ins, and "Reserve Space ↗" link).
   - **Standard Document Flow (No Sticky Overlap)**: Removed sticky positioning from the map container, ensuring smooth, natural page scrolling with zero image or card collision.
   - **Transit & Amenities**: Added 4 transit cards (Car, Bus, Cycle/Walk, Step-Free Accessibility) and 6 visitor amenities cards (Wi-Fi, Power outlets, Family friendly, Plant-based milks, Assistance dogs, KeepCup discounts).
   - **Community Synergy & Interactive FAQ**: Integrated "The Social Living Room of Lucan Community Centre" spotlight and an interactive expandable FAQ accordion.

---

## 2. Core Architectural Decisions

- **Multi-Route Navigation**:
  - `Navbar.tsx` dynamically highlights the active route using `usePathname()` from `next/navigation`.
  - Hero section CTA buttons on `/` seamlessly route to `/menu` and `/visit`.
  - `/book` route serves as the interactive modal route that immediately displays the dual-mode Booking Modal with zero compilation pause.
  - Footer provides direct navigation links to all public routes and a discreet Manager Portal link.
- **Admin Left-Sidebar Layout**:
  - Fixed left navigation (`260px` width) for administrative clarity, with instant tab switching, live badges, and quick links.
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
- [x] Single-click instant modal opening (0ms latency, no 2-click lag or cache bypass delay)
- [x] `/book` route converted to auto-opening Booking Modal with backdrop blur and return routing
- [x] Home page Hero section CTAs mapped to `/menu` ("View Our Menu") and `/visit` ("Find Us")
- [x] `/menu` page items & categories 100% visible with espresso dark mode & live search
- [x] Dual booking workflow live in `BookingModal.tsx` ("Book a Table" vs "Host an Event")
- [x] Clean attendee counts (`8 – 15 People`, `16 – 30 People`, `31 – 50 People`, `50+ People`)
- [x] Corporate Event included in event types dropdown
- [x] AV & Equipment removed; replaced with on-site vs outside event location selector + outside address field
- [x] Admin Left Sidebar layout live on `/admin` with vertical navigation, counters, and quick actions
- [x] Admin Overview & Bookings tables display Table vs Event badges, catering package, and event location
- [x] Menu update options (Add, Edit, Delete, Stock toggle) live
- [x] Booking management (List, Filter, Confirm, Cancel, Delete, Detail view) live
- [x] Full CRUD API routes (`/api/reservations`, `/api/menu`) supporting `event_location`
- [x] `Prd.md`, `Memory.md`, and `Agent.md` updated and in lockstep with codebase




