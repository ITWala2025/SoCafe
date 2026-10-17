'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  onOpenBooking?: () => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              So Coffee
            </Link>
            <p>
              A cosy little café inside Lucan Community Centre, serving great
              coffee and warm welcomes.
            </p>
          </div>
          <div className="footer-nav">
            <div className="footer-nav-col">
              <h4>Menu</h4>
              <Link href="/menu">Full Menu</Link>
              <Link href="/menu">Hot Drinks</Link>
              <Link href="/menu">Cold Drinks</Link>
              <Link href="/menu">Food & Treats</Link>
            </div>
            <div className="footer-nav-col">
              <h4>Visit</h4>
              <Link href="/about">Our Story</Link>
              <Link href="/visit">Location & Map</Link>
              <Link href="/visit">Opening Hours</Link>
              <Link
                href="/book"
                className="footer-book-link"
                onClick={(e) => {
                  if (onOpenBooking) {
                    e.preventDefault();
                    onOpenBooking();
                  }
                }}
              >
                Book a Space
              </Link>
            </div>
            <div className="footer-nav-col">
              <h4>Connect</h4>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a href="mailto:hello@socoffee.ie">Email Us</a>
              <Link href="/admin" style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                Manager Portal ↗
              </Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 So Coffee. All rights reserved.</p>
          <div className="footer-social">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="mailto:hello@socoffee.ie" aria-label="Email">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
