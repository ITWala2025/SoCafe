# Product Requirements Document (PRD) — So Coffee

**Product Name**: So Coffee Website & Digital Hub  
**Location**: Lucan Community Centre, Esker Lane, Lucan, Co. Dublin, Ireland  
**Version**: 1.0.0 (Next.js & Supabase Edition)  
**Target URL**: `https://socoffee.ie` (Production) / `http://localhost:3000` (Local)  
**Repository**: `https://github.com/ITWala2025/SoCafe`

---

## 1. Executive Summary & Vision

**So Coffee** is a community-first specialty café located inside the Lucan Community Centre. The website serves as the café's digital storefront, conveying its warm, cosy, and artisanal atmosphere. It enables local visitors, community members, and groups to browse the daily food and drink menu, discover the café's story, find location and operating hours, and request table or community room reservations.

---

## 2. Target Audience & Personas

1. **Local Residents & Families**: Seeking a welcoming morning coffee stop, fresh pastries, and a child-friendly atmosphere in Lucan.
2. **Community Centre Visitors**: Attendees of sports, fitness classes, workshops, and local clubs looking for a cosy meeting spot before or after activities.
3. **Remote Workers & Freelancers**: Looking for quiet corners with good coffee, wifi, and hearty lunch bites (soups, wraps, quiches).
4. **Community Organizers**: Needing group tables or meeting rooms reserved for gatherings, study circles, or book clubs.

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

## 4. Feature Specifications

### 4.1 Header & Navigation (`components/Navbar.tsx`)
- Fixed sticky navbar with glassmorphism blur upon scrolling down.
- Navigation links: Home, Menu, About, Visit Us, Book, and "View Menu" CTA button.
- Smooth scrolling with offset compensation to target sections.
- Mobile slide-out drawer menu with hamburger toggle button.
- Active-section scrollspy dynamically highlighting the current view.

### 4.2 Hero Section (`components/Hero.tsx`)
- High-impact visual banner with subtle parallax scroll effect.
- Location badge: `📍 LUCAN COMMUNITY CENTRE, IRELAND`.
- Display headline: *"Coffee, comfort & good food."*
- Explanatory subhead and dual CTAs: *"View Our Menu"* and *"Find Us"*.
- Animated vertical scroll indicator.

### 4.3 Our Story (`components/OurStory.tsx`)
- Two-column layout showcasing artisanal latte art photography with an *"Every cup, crafted."* badge.
- Brand story emphasizing warmth, simple quality drinks, and community roots.

### 4.4 Interactive Menu (`components/MenuSection.tsx`)
- Category tabs:
  - **Hot Drinks** (Espresso, Cappuccino, Latte, Americano, Flat White, Hot Chocolate, Barry's Tea).
  - **Cold Drinks** (Iced Latte, Iced Americano, Cold Brew, Iced Mocha, Smoothie, Fresh Juice).
  - **Food** (Toasted Sandwich, Soup of the Day, Sausage Roll, Wrap, Quiche, Salad Bowl).
  - **Sweet Treats** (Scone, Croissant, Muffin, Brownie, Cookie, Cake Slice).
- Animated card grid with item titles, descriptions, and counter pricing notes.
- Backed by Next.js API route `/api/menu` supporting live Supabase synchronization with local fallback.

### 4.5 Food & Drink Highlights (`components/FoodHighlights.tsx`)
- 4 photography cards: *Coffee & Pastries*, *Sweet Treats*, *Light Bites*, *Cold Drinks*.
- Interactive click triggers: switches the active menu tab and scrolls smoothly to the menu section.

### 4.6 Every Cup Atmospheric Banner (`components/EveryCup.tsx`)
- Full-width background image with dark overlay and typography: *"Made for slow moments"*.

### 4.7 Community Section (`components/Community.tsx`)
- Highlights the café's role inside Lucan Community Centre rhythm.
- Visual badge and quote: *"'Your little coffee stop in Lucan.'"*

### 4.8 Visit Us & Location (`components/VisitUs.tsx`)
- 4-item information grid:
  - Location: Lucan Community Centre, Esker Lane, Lucan, Co. Dublin, Ireland.
  - Hours: Mon–Fri 8:00 AM – 4:00 PM; Sat–Sun 9:00 AM – 3:00 PM.
  - Contact: Clickable email `hello@socoffee.ie`.
  - Social: Clickable Instagram `@socoffee.lucan`.
- Embedded Google Maps iframe pinpointing Lucan Community Centre.

### 4.9 Table & Space Booking Modal (`components/BookingModal.tsx`)
- Accessible dialog for table and group space reservations.
- Form inputs: Name, Email, Phone, Number of People, Date, Preferred Time, Special Notes.
- Form validation, loading states, and keyboard escape handling.
- API submission to `/api/reservations` backed by Supabase with live toast notification feedback.

### 4.10 Toast System & Back-to-Top
- Global toast notifications (`components/Toast.tsx`) triggered on user interactions.
- Floating back-to-top button (`components/BackToTop.tsx`) visible after scrolling 400px.

---

## 5. Supabase Backend Architecture & Database Schema

### 5.1 Tables

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

-- 4. Contact Messages (Optional Extension)
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 5.2 Row Level Security (RLS) Policies
- `menu_items` & `categories`: Public read access (`SELECT`) enabled for anon users.
- `reservations`: Public insert (`INSERT`) enabled for anon users; read/update restricted to authenticated café staff.

---

## 6. Non-Functional Requirements

- **Performance**: Lighthouse score 90+ on desktop and mobile. Zero cumulative layout shift.
- **Accessibility**: Semantic HTML5 landmark tags (`<nav>`, `<main>`, `<section>`, `<footer>`), ARIA attributes for modal and live toast regions.
- **SEO**: Dynamic metadata, OpenGraph tags, semantic headings, and favicon configured in `app/layout.tsx`.
- **Browser Compatibility**: Chrome, Safari, Firefox, Edge, iOS Safari, Android Chrome.
