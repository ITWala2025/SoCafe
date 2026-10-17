# So Coffee — Website & Digital Platform

A modern web application for **So Coffee**, located inside **Lucan Community Centre**, Co. Dublin, Ireland. Built with **Next.js (App Router)**, **TypeScript**, custom CSS design system, and **Supabase** backend integration.

- **GitHub Repository**: [https://github.com/ITWala2025/SoCafe](https://github.com/ITWala2025/SoCafe)
- **Figma Design Concept**: [SoCoffee Website Concept](https://www.figma.com/make/7AUbPyXz5l9y8koZnZrQeD/SoCoffee-Website-Concept?code-node-id=0-6&p=f&fullscreen=1)

---

## ☕ Key Features

- **App Router & TypeScript**: Built with Next.js 16+, React 19, and full static typing.
- **Visual Aesthetics & Typography**: Artisanal palette (espresso browns `#2C2418`, cream foam `#F5F0E8`, amber `#A67C3D`) paired with *Playfair Display* and *Inter*.
- **Interactive Menu**: Tabbed navigation (*Hot Drinks*, *Cold Drinks*, *Food*, *Sweet Treats*) supporting dynamic fetching from Supabase (`/api/menu`) with instant static fallbacks.
- **Food & Drink Highlights**: 4 interactive photography cards that automatically filter and navigate to corresponding menu categories.
- **Table & Event Reservations**: Built-in booking modal for tables or community rooms with live feedback and Supabase database persistence (`/api/reservations`).
- **Community Focus**: Dedicated section highlighting local Lucan Community Centre vibe with location badges and quotes.
- **Location & Google Maps**: Clean map embed, contact email links, and Instagram integration.
- **UX Delights**: Glassmorphism navbar with scrollspy, parallax hero banner, toast notification system, and floating back-to-top button.

---

## 📂 Documentation

- [**`Agent.md`**](./Agent.md) — Comprehensive guide for AI agents and developers: architecture, conventions, and rules.
- [**`Memory.md`**](./Memory.md) — Project history, design decisions, and status tracking.
- [**`Prd.md`**](./Prd.md) — Complete Product Requirements Document with Supabase database schema and SQL definitions.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup (Supabase)

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> **Note**: The app includes full dev fallback mode. If Supabase credentials are not yet configured, the website will run smoothly with local menu data and simulated booking feedback!

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🗄️ Supabase Database Setup

When you are ready to connect your live Supabase project, execute the SQL schema in the Supabase SQL Editor (detailed in [`Prd.md`](./Prd.md)):

```sql
-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Menu items table
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

-- Reservations table
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
```

---

## 📜 License & Copyright

© 2026 So Coffee. All rights reserved. Lucan Community Centre, Co. Dublin, Ireland.
