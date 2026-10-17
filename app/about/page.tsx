'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <ScrollRevealInit />
      <Navbar />
      <main className="page-wrapper">
        <section className="page-hero">
          <div className="container">
            <p className="section-label">OUR STORY & VALUES</p>
            <h1 className="page-hero-title">A Little Break Goes a Long Way</h1>
            <p className="page-hero-desc">
              Inside the bustling heartbeat of Lucan Community Centre, So Coffee
              was born out of a simple belief: everyone deserves a warm place to
              pause, chat, and drink exceptional coffee.
            </p>
          </div>
        </section>

        {/* Main Story Narrative */}
        <section className="page-content-section">
          <div className="container">
            <div className="story-grid">
              <div className="story-image-wrapper reveal">
                <img
                  src="/images/latte-art.jpg"
                  alt="Specialty latte art crafted at So Coffee"
                  loading="lazy"
                />
                <span className="story-image-label">Every cup, crafted.</span>
              </div>
              <div className="story-content">
                <p className="section-label reveal">HOW WE STARTED</p>
                <h2 className="section-title reveal reveal-delay-1">
                  At home in Lucan Community Centre.
                </h2>
                <p className="story-text reveal reveal-delay-2">
                  When you step inside Lucan Community Centre, you feel the
                  vitality of our local neighborhood — parents bringing children
                  to sports, friends gathering for classes, and neighbors catching up.
                </p>
                <p className="story-text reveal reveal-delay-3">
                  We built So Coffee to be the natural center of that warmth.
                  Whether you have five minutes before your next class or an
                  hour to catch up with an old friend, we make sure your cup is
                  rich, hot, and poured with genuine care.
                </p>
              </div>
            </div>

            {/* Core Values 3-column Grid */}
            <div className="values-section reveal">
              <div className="values-header">
                <p className="section-label">OUR ETHOS</p>
                <h2 className="section-title">What Matters to Us</h2>
              </div>
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">☕</div>
                  <h3>Specialty Coffee & Honest Food</h3>
                  <p>
                    We select balanced, smooth roasts that taste wonderful as an
                    espresso, flat white, or over ice. Our pastries, soups, and
                    sandwiches are fresh, hearty, and simple.
                  </p>
                </div>
                <div className="value-card">
                  <div className="value-icon">💛</div>
                  <h3>A Genuinely Warm Welcome</h3>
                  <p>
                    No pretense or fuss. Just friendly smiles, baristas who
                    remember your drink, and a place where everyone feels
                    comfortable taking their time.
                  </p>
                </div>
                <div className="value-card">
                  <div className="value-icon">🏡</div>
                  <h3>Community First</h3>
                  <p>
                    From book clubs to student study groups and community debriefs,
                    our space is made to support Lucan’s everyday community life.
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Collage Section */}
            <div className="photo-highlight-section reveal">
              <div className="photo-grid">
                <div className="photo-card">
                  <img src="/images/hero-bg.jpg" alt="Cosy cafe seating" />
                  <span>Cosy corners for conversations</span>
                </div>
                <div className="photo-card">
                  <img src="/images/community.jpg" alt="Community members enjoying coffee" />
                  <span>Shared moments with neighbours</span>
                </div>
                <div className="photo-card">
                  <img src="/images/slow-moments.jpg" alt="Artisanal coffee experience" />
                  <span>Made for slow moments</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="menu-page-cta reveal">
              <h3>Come share a cup with us</h3>
              <p>We&apos;re open Monday to Friday from 8am, and weekends from 9am.</p>
              <div className="cta-buttons">
                <Link href="/visit" className="btn-primary">
                  Visit Us Today
                </Link>
                <Link href="/menu" className="btn-secondary">
                  Explore Our Menu
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer onOpenBooking={() => {}} />
      <BackToTop />
    </>
  );
}
