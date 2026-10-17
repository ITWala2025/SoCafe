# Product Requirements Document (PRD) — So Coffee

**Product Name**: So Coffee Website & Digital Hub  
**Location**: Lucan Community Centre, Esker Lane, Lucan, Co. Dublin, Ireland  
**Version**: 2.0.0 (Multi-Route & Admin Dashboard Edition)  
**Target URL**: `https://socoffee.ie` (Production) / `http://localhost:3000` (Local)  
**Repository**: `https://github.com/ITWala2025/SoCafe`

---

## 1. Executive Summary & Vision

**So Coffee** is a community-first specialty café located inside the Lucan Community Centre. The website serves as the café's complete digital storefront and management platform. It enables local visitors, community members, and groups to browse the daily food and drink menu across dedicated routes, learn about the café's history and ethos, plan their visit with transit details, and book tables or community spaces.

In addition, it provides a protected **Admin Dashboard** (`/admin`) for café managers to review incoming bookings, confirm or cancel reservations, update live menu items (add, edit, delete, toggle stock), and post daily announcements.

---

## 2. Target Audience & Personas

1. **Local Residents & Families**: Seeking a welcoming morning coffee stop, fresh pastries, and child-friendly seating in Lucan.
2. **Community Centre Visitors**: Attendees of sports, fitness classes, workshops, and local clubs looking for a cosy meeting spot before or after activities.
3. **Remote Workers & Freelancers**: Looking for quiet corners with good coffee, complimentary Wi-Fi, and hearty lunch bites.
4. **Community Organizers**: Needing group tables or meeting rooms reserved for gatherings, study circles, or book clubs.
5. **Café Managers & Baristas**: Needing a fast, accessible Admin Dashboard on tablet, phone, or laptop to manage daily inventory, mark sold-out items, and confirm guest table requests.

---

## 3. Brand Identity & Visual Language

- **Aesthetic Tone**: Warm, earthy, artisanal, welcoming, unpretentious.
- **Color Palette**:
  - Espresso Black/Brown: `#2C2418` (Header, Dark Sections, Backgrounds)
  - Deep Mocha: `#3B2F1E` (Buttons, Cards, Accent Backgrounds)
  - Cream Foam: `#F5F0E8` (Primary Background, Light Sections)
  - Milk White: `#F8F4ED` (Cards, Panels)
  - Amber Gold: `#A67C3D` (Labels, Badges, Hover Accents)
- **Typography**:
  - Headlines & Display: *Playfair Display* (Editorial Serif, italic accents)
  - Body & UI: *Inter* (Clean, legible geometric sans-serif)

---

## 4. Route Architecture & Feature Specifications

### 4.1 Global Navigation (`components/Navbar.tsx`)
- Fixed sticky navbar with glassmorphism blur upon scroll.
- Active route highlighting based on `usePathname()`.
- Dedicated links:
  - **Home**: `/`
  - **Menu**: `/menu`
  - **About**: `/about`
  - **Visit Us**: `/visit`
  - **Book**: `/book`
  - **View Menu (CTA)**: `/menu`
- Mobile drawer menu with animated toggle button.

---

### 4.2 Route Pages

#### 1. Home Page (`/`)
- Full landing page experience with Hero banner, Our Story preview, interactive menu preview, food cards, atmospheric Every Cup banner, Community highlight, Visit section, and footer.

#### 2. Dedicated Menu Page (`/menu`)
- Hero header with *"What We Serve"* and daily preparation notes.
- **Live Search & Filter**: Instant search box filtering items by name or description.
- **Category Tabs**: Hot Drinks, Cold Drinks, Food, Sweet Treats with item count badges.
- **Item Cards**: Displays name, price, description, and "Sold Out Today" availability badges.
- **Dietary & Allergen Callout**: Details on Oat/Almond milk alternatives, vegetarian choices, and allergen safety.
- Direct booking CTA linking to `/book`.

#### 3. Dedicated About Page (`/about`)
- *"A Little Break Goes a Long Way"* narrative detailing the origin inside Lucan Community Centre.
- **Core Values Grid**:
  1. *Specialty Coffee & Honest Food*
  2. *A Genuinely Warm Welcome*
  3. *Community First*
- **Photography Gallery**: Highlights of interior seating, community members, and artisanal latte art.

#### 4. Dedicated Visit Us Page (`/visit`)
- Opening hours grid (Monday–Friday 8am–4pm, Saturday–Sunday 9am–3pm).
- Full address with postal code (Esker Lane, Lucan, Co. Dublin, K78 H3F6).
- **Getting Here & Transit**: Free customer car parking, Dublin Bus routes (C1, C2, L53), and wheelchair/stroller accessibility.
- Embedded interactive Google Map.
- **Visitor FAQ**: Answers regarding complimentary Wi-Fi, milk alternatives, stroller access, and group seating.

#### 5. Dedicated Reservation & Event Hosting Page (`/book`)
The booking interface features a dual-mode segmented workflow allowing customers and community groups to effortlessly choose between table reservations and full event hosting proposals.

##### Workflow A: Book a Table (Casual Dining & Catch-Ups)
- **Target Audience**: Individuals, couples, families, remote workers, and small casual groups (1 to 8 guests).
- **Primary Use Cases**: Morning coffee dates, leisurely brunch, remote laptop sessions, informal one-on-ones.
- **Data Capture**:
  - Primary Contact: Full Name, Email Address, Contact Phone Number.
  - Party Size: `1-2 People (Cosy table)`, `3-4 People (Standard table)`, `5-8 People (Large communal table)`.
  - Date & Time Slot: Date picker (minimum date = today), Time selector (08:30 to 14:30 in 1-hour increments).
  - Seating Preferences & Notes: High chair requirements, stroller space, quiet corner, wheelchair accessibility.
- **Workflow & Lifecycle**:
  1. *Submission*: Guest submits request via `/book` or global `BookingModal`. Payload is posted to `/api/reservations` with `booking_type = 'table'` and initial `status = 'pending'`.
  2. *Automated Acknowledgment*: Real-time toast confirmation and success screen rendered displaying summary.
  3. *Café Review & Triage*: Manager reviews table allocation in `/admin` dashboard.
  4. *Confirmation / Decline*: Manager confirms request; guest receives confirmation email.
  5. *Walk-in Buffer*: A minimum of 3 walk-in counter and bar tables are always held unreserved.

##### Workflow B: Host an Event (Groups 8 to 50+)
- **Target Audience**: Local community clubs, book clubs, charities, sports teams, workshop instructors, corporate team gatherings, private celebrations.
- **Primary Use Cases**: Weekly club meetups, creative workshops, corporate offsites & team syncs, sports committee debriefs, anniversary / birthday morning teas.
- **Data Capture**:
  - Primary Organizer: Full Name, Email, Phone Number.
  - Expected Attendees: `8 – 15 People`, `16 – 30 People`, `31 – 50 People`, `50+ People`.
  - Event / Gathering Type:
    - *Community Gathering / Meetup*
    - *Book Club or Discussion Circle*
    - *Workshop or Creative Class*
    - *Sports / Committee Debrief*
    - *Birthday or Family Celebration*
    - *Corporate Event*
  - Event Location:
    - *So Coffee @ Lucan Community Centre (In-House)*
    - *Outside Location / Off-Site Venue* (captures outside venue name & street address)
  - Catering Packages:
    - **Package 1**: *Barista Coffee & Fresh Morning Pastries* (€6.50 / person) — Specialty batch brew or barista espresso with warm croissants, pain au chocolat, and scones with Irish butter & jam.
    - **Package 2**: *Artisanal Lunch Sandwiches & Warm Bites* (€12.50 / person) — Sourdough toasties, artisan chicken & pesto wraps, goat cheese tartlets, and fresh salads.
    - **Package 3**: *Sweet Treats & Coffee Grazing Board* (€9.00 / person) — Artisan brownie bites, lemon drizzle loaf, raspberry almond frangipanes, and unlimited filter coffee / Barry's tea.
    - **Package 4**: *No Set Package* — Individual pay-as-you-go counter ordering.
  - Schedule & Timeslot: Supports daytime and evening slots (`08:30` to `18:00`).
  - Layout & Setup Notes: Theatre style vs boardroom table layout, dietary allergens, custom timeline.
- **Workflow & Lifecycle**:
  1. *Submission*: Proposal submitted with `booking_type = 'event'`.
  2. *SLA Protocol*: Acknowledged instantly on screen; flagged with priority badge in Admin Dashboard.
  3. *Location & Resource Coordination*: For on-site events, café manager checks Lucan Community Centre room availability. For outside events, manager evaluates catering logistics and delivery schedule.
  4. *Custom Quote & Proposal*: Within 24 hours, manager contacts the organizer via email/phone with booking confirmation, bespoke catering schedule, and deposit terms (if applicable).
  5. *Admin State Transition*: Manager updates booking state to `confirmed` in Admin Dashboard.

---

### 4.3 Admin Portal & Dashboard (`/admin`)

#### 1. Admin Authentication (`/admin/login`)
- Dedicated manager login screen styled with So Coffee branding.
- Form inputs for Manager Email and Password.
- **One-Click Demo Button**: Instantly fills credentials (`admin@socoffee.ie` / `coffee123`) for effortless review.
- Error banner handling for invalid credentials.
- **Supabase Auth Migration Ready**: Structured with `useAdminAuth` hook ready for `supabase.auth.signInWithPassword`.
- Automatic redirect to `/admin` upon successful sign in, and redirect to `/admin/login` if unauthenticated.

#### 2. Dashboard Shell & Left Sidebar Navigation
- **Left Sidebar Menu**:
  - Brand header: *"So Coffee — MANAGER PORTAL"*.
  - Vertical menu items:
    - 📊 **Overview**
    - 📅 **Reservations & Bookings** (with live pending count badge)
    - ☕ **Menu Management** (with live active item counter)
    - ⚙️ **Settings & Broadcast**
  - Persistent bottom user card with manager avatar, name, email, quick link to "View Site ↗", and "Sign Out" button.
- **Right Main Workspace**:
  - Workspace header displaying active view title, operational sub-text, and system live status indicator.
  - Global toast notification banner for actions.

#### 3. Dashboard Views:
- **📊 Overview**:
  - Live metric stat cards: *Pending Bookings*, *Confirmed Bookings*, *Today's Reservations*, *Active Menu Items*.
  - Management shortcuts (+ Add Menu Item, Review Bookings).
  - Recent reservation requests table with dual badges (`☕ Table` vs `🎉 Event`), event location, party size, date/time, and quick Confirm and Details actions.
- **📅 Reservations & Bookings Management**:
  - Status filter pills: *All*, *Pending*, *Confirmed*, *Cancelled* with live count counters.
  - Search box filtering bookings by guest name, email, or event title.
  - Table columns: **Type & Guest** (with badge, event title, and location), **Contact** (email + phone), **Date & Time**, **Party Size / Attendees**, **Status Badge**, **Actions**.
  - Quick actions: **Confirm** (one-click state update), **Cancel**, **Delete** (with confirmation safeguard).
  - **Slide-out Detail Drawer**:
    - Displays booking type badge (`☕ Table Reservation` or `🎉 Community Event`).
    - Event focus / title, venue location (In-House vs Outside address), and selected catering package.
    - Full contact info with direct `mailto:` and `tel:` links.
    - Formatted reservation date and time.
    - Special notes and dietary requirements.
    - Contextual action buttons (Confirm Booking / Mark as Cancelled).
- **☕ Menu Management**:
  - Category filter pills: *All Items*, *Hot Drinks*, *Cold Drinks*, *Food*, *Sweet Treats*.
  - **Add Menu Item Modal**: Name, Category, Description, and Display Price.
  - **Edit Menu Item Modal**: Pre-filled form to update names, prices, or descriptions.
  - **Availability Toggle Button**: One-click toggle between *● In Stock* and *○ Sold Out*.
  - **Delete Action**: Removes item with confirmation modal.
- **⚙️ Settings & Announcements**:
  - Today's announcement banner editor (updates broadcast notice).
  - Database status monitor (Supabase PostgreSQL runtime & fallback status).

---

## 5. API Route Specifications

### 5.1 `/api/reservations`
- **GET**: Returns all reservations ordered by `created_at DESC` (Admin view).
- **POST**: Creates a new reservation (Guest submission). Accepts `name`, `email`, `phone`, `booking_type` (`'table' | 'event'`), `event_type`, `event_location`, `catering_package`, `guests`, `reservation_date`, `reservation_time`, and `notes`. Sets `status = 'pending'`.
- **PATCH**: Updates reservation status (`status: 'confirmed' | 'cancelled'`) by `id`.
- **DELETE**: Deletes a reservation by `id`.
- *Supports Supabase `reservations` table with in-memory fallback for local dev.*

### 5.2 `/api/menu`
- **GET**: Returns menu items grouped by category, or flat list when `?flat=true`.
- **POST**: Adds a new menu item to Supabase `menu_items` table or in-memory store.
- **PUT**: Updates existing menu item name, desc, price, or `is_available` flag.
- **DELETE**: Deletes a menu item by `id`.

---

## 6. Supabase Backend Architecture & Database Schema

```sql
-- 1. Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT REFERENCES categories(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Reservations (Supports Tables & Events, On-Site & Outside Venues)
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  booking_type TEXT NOT NULL DEFAULT 'table' CHECK (booking_type IN ('table', 'event')),
  event_type TEXT,
  event_location TEXT,
  catering_package TEXT,
  guests TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Admin Users (Managed via Supabase Auth)
-- Uses auth.users table with app metadata role = 'manager'
```

---

## 7. Non-Functional Requirements

- **Performance**: Zero-bundle font loading with `next/font/google`, static generation for public pages.
- **Accessibility**: Semantic landmark elements, ARIA dialog roles, accessible keyboard navigation for tabs and modals.
- **SEO**: Metadata, OpenGraph cards, and keywords configured for Lucan Community Centre and So Coffee.
