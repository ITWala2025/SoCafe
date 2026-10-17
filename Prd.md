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

#### 5. Dedicated Reservation Page (`/book`)
- Dedicated full-width booking card with complete reservation form:
  - Full Name, Email, Phone Number, Party Size (1-2, 3-4, 5-8, 9+ community room inquiry).
  - Date Picker with minimum date validation, Time Slot selector.
  - Special requests & notes (high chairs, quiet table, pre-ordered food).
- **Instant Confirmation Banner**: Replaces form with booking summary upon submission.
- **Sidebar Guide**: Helpful walk-in tips, recurring club info, and Lucan Community Centre catering details.

---

### 4.3 Admin Portal & Dashboard (`/admin`)

#### 1. Admin Authentication (`/admin/login`)
- Dedicated manager login screen styled with So Coffee branding.
- Form inputs for Manager Email and Password.
- **One-Click Demo Button**: Instantly fills credentials (`admin@socoffee.ie` / `coffee123`) for effortless review.
- Error banner handling for invalid credentials.
- **Supabase Auth Migration Ready**: Structured with `useAdminAuth` hook ready for `supabase.auth.signInWithPassword`.
- Automatic redirect to `/admin` upon successful sign in, and redirect to `/admin/login` if unauthenticated.

#### 2. Dashboard Shell & Top Bar
- Brand badge: *"So Coffee ADMIN DASHBOARD"*.
- Active manager identity display (Name, Email).
- "View Live Site" quick link and "Sign Out" button.
- Global toast notification banner for actions.

#### 3. Dashboard Tabs:
- **📊 Overview**:
  - Live metric stat cards: *Pending Bookings*, *Confirmed Bookings*, *Today's Reservations*, *Active Menu Items*.
  - Management shortcuts (+ Add Menu Item, Review Bookings).
  - Recent reservation requests table with quick Confirm and View buttons.
- **📅 Reservations & Bookings**:
  - Status filter pills: *All*, *Pending*, *Confirmed*, *Cancelled* with live count counters.
  - Search box filtering bookings by guest name or email.
  - Comprehensive data table displaying guest name, contact, date, time, party size, and status badge.
  - Quick actions: **Confirm**, **Cancel**, **Delete**.
  - **Slide-out Detail Drawer**: Displays full booking details, notes, phone, and direct email link.
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
- **GET**: Returns all reservations (Admin view).
- **POST**: Creates a new reservation (Guest submission).
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

-- 3. Reservations
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
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
