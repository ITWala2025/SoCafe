'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className={`navbar ${scrolled || pathname !== '/' ? 'scrolled' : ''}`} id="navbar">
      <Link href="/" className="nav-logo" onClick={handleLinkClick}>
        So Coffee
      </Link>

      <div className={`nav-links ${mobileOpen ? 'open' : ''}`} id="navLinks">
        <Link
          href="/"
          className={isLinkActive('/') ? 'active' : ''}
          onClick={handleLinkClick}
        >
          Home
        </Link>
        <Link
          href="/menu"
          className={isLinkActive('/menu') ? 'active' : ''}
          onClick={handleLinkClick}
        >
          Menu
        </Link>
        <Link
          href="/about"
          className={isLinkActive('/about') ? 'active' : ''}
          onClick={handleLinkClick}
        >
          About
        </Link>
        <Link
          href="/visit"
          className={isLinkActive('/visit') ? 'active' : ''}
          onClick={handleLinkClick}
        >
          Visit Us
        </Link>
        <Link
          href="/book"
          className={`nav-book-link ${isLinkActive('/book') ? 'active' : ''}`}
          onClick={(e) => {
            handleLinkClick();
            if (onOpenBooking) {
              e.preventDefault();
              onOpenBooking();
            }
          }}
        >
          Book
        </Link>
        <Link
          href="/menu"
          className="nav-cta"
          onClick={handleLinkClick}
        >
          View Menu
        </Link>
      </div>

      <div
        className={`menu-toggle ${mobileOpen ? 'active' : ''}`}
        id="menuToggle"
        aria-label="Toggle menu"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
