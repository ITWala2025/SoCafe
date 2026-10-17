'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavbarProps {
  onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      // Scrollspy
      const sections = ['home', 'about', 'menu', 'food', 'community', 'visit'];
      const scrollPos = window.scrollY + 140;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    if (href === '#book') {
      onOpenBooking();
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="nav-logo"
      >
        So Coffee
      </a>

      <div className={`nav-links ${mobileOpen ? 'open' : ''}`} id="navLinks">
        <a
          href="#home"
          className={activeSection === 'home' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#home');
          }}
        >
          Home
        </a>
        <a
          href="#menu"
          className={activeSection === 'menu' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#menu');
          }}
        >
          Menu
        </a>
        <a
          href="#about"
          className={activeSection === 'about' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#about');
          }}
        >
          About
        </a>
        <a
          href="#visit"
          className={activeSection === 'visit' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#visit');
          }}
        >
          Visit Us
        </a>
        <a
          href="#book"
          className="nav-book-link"
          id="navBookBtn"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#book');
          }}
        >
          Book
        </a>
        <a
          href="#menu"
          className="nav-cta"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#menu');
          }}
        >
          View Menu
        </a>
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
