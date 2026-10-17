'use client';

import React, { useState, useEffect } from 'react';
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

interface HomePageProps {
  initialBookingOpen?: boolean;
}

export default function HomePage({ initialBookingOpen = false }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey>('hot');
  const [isBookingOpen, setIsBookingOpen] = useState(initialBookingOpen);

  const handleOpenBooking = () => {
    setIsBookingOpen(true);
    if (typeof window !== 'undefined' && window.location.pathname !== '/book') {
      window.history.pushState(null, '', '/book');
    }
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname === '/book') {
      window.history.pushState(null, '', '/');
    }
  };

  // Keep state in sync with browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        setIsBookingOpen(window.location.pathname === '/book');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      <ScrollRevealInit />
      <Navbar onOpenBooking={handleOpenBooking} />
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
      <Footer onOpenBooking={handleOpenBooking} />
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
      />
      <BackToTop />
    </>
  );
}
