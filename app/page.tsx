'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import OurStory from '@/components/OurStory';
import MenuSection from '@/components/MenuSection';
import FoodHighlights from '@/components/FoodHighlights';
import EveryCup from '@/components/EveryCup';
import Community from '@/components/Community';
import VisitUs from '@/components/VisitUs';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import BackToTop from '@/components/BackToTop';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import type { MenuCategoryKey } from '@/data/menu';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey>('hot');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <ScrollRevealInit />
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
      <main>
        <Hero />
        <OurStory />
        <MenuSection
          activeTab={activeCategory}
          onTabChange={(tab) => setActiveCategory(tab)}
        />
        <FoodHighlights
          onSelectCategory={(tab) => setActiveCategory(tab)}
        />
        <EveryCup />
        <Community />
        <VisitUs />
      </main>
      <Footer onOpenBooking={() => setIsBookingOpen(true)} />
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <BackToTop />
    </>
  );
}
