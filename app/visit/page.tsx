'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import Link from 'next/link';

interface CompactScheduleItem {
  days: string;
  hours: string;
  isToday: boolean;
  dayType: 'weekday' | 'weekend' | 'holiday';
}

const FAQS = [
  {
    question: 'Do I need to book a table before arriving?',
    answer:
      'Walk-ins are always warmly welcomed! Most visitors drop in casually for counter service and choose any open table. If you are gathering with a group of 4 or more for a book club, parent meetup, or team catch-up, we encourage you to book ahead through our dedicated booking page.',
    linkUrl: '/book',
    linkText: 'Book a space here',
  },
  {
    question: 'Can I work on my laptop or study at So Coffee?',
    answer:
      'Yes, absolutely! We offer high-speed complimentary Wi-Fi and designated perimeter tables equipped with convenient power outlets. We only ask remote workers and students to practice polite table sharing during our busy weekday lunch rush (12:30 PM – 2:00 PM).',
  },
  {
    question: 'Where exactly are you located inside Lucan Community Centre?',
    answer:
      "When you enter through the main sliding glass doors of Lucan Community Centre on Esker Lane, turn immediately to your left. We are located right on the ground floor foyer next to the sports hall and community reception desk. Just follow the aroma of freshly ground espresso!",
  },
  {
    question: 'Is parking free, and are disabled bays available?',
    answer:
      'Yes, 100% free! Lucan Community Centre has an expansive on-site car park with over 50 spaces reserved for centre and café visitors. Marked accessible parking bays and a smooth ramp leading straight to the automatic double entrance doors are located directly beside the building.',
  },
  {
    question: 'What dairy-free, vegan, and gluten-aware options do you offer?',
    answer:
      'We proudly prepare all specialty coffees and hot drinks with your choice of premium Oat Milk or Almond Milk at no hassle. Our counter features freshly baked vegan treats, gluten-free baked brownies, artisan toasties, and wholesome daily soups.',
    linkUrl: '/menu',
    linkText: 'Explore our full menu',
  },
  {
    question: 'Can we reserve a corner or table for our local club or committee?',
    answer:
      'We would love to host you! From sports team debriefs to community craft groups and committee discussions, you can reserve table clusters in advance on our website or email us directly at hello@socoffee.ie for tailored arrangements.',
    linkUrl: '/book',
    linkText: 'Reserve group seating',
  },
];

export default function VisitPage() {
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [status, setStatus] = useState<{
    isOpen: boolean;
    text: string;
    subtext: string;
    isWeekendToday: boolean;
  }>({
    isOpen: true,
    text: 'Open Today',
    subtext: '8:00 AM – 4:00 PM',
    isWeekendToday: false,
  });

  useEffect(() => {
    try {
      const now = new Date();
      // Format to Europe/Dublin local time
      const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Dublin',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
      const dayStr = now.toLocaleDateString('en-GB', {
        timeZone: 'Europe/Dublin',
        weekday: 'short',
      });

      const [hour, minute] = timeStr.split(':').map(Number);
      const currentMinutes = hour * 60 + minute;

      const isWeekend = dayStr === 'Sat' || dayStr === 'Sun';
      const openMin = isWeekend ? 9 * 60 : 8 * 60;
      const closeMin = isWeekend ? 15 * 60 : 16 * 60;

      const isOpen = currentMinutes >= openMin && currentMinutes < closeMin;

      if (isOpen) {
        const closeHourStr = isWeekend ? '3:00 PM' : '4:00 PM';
        setStatus({
          isOpen: true,
          text: 'Open Now',
          subtext: `Closes today at ${closeHourStr}`,
          isWeekendToday: isWeekend,
        });
      } else {
        const nextOpenStr = isWeekend
          ? 'Opens at 9:00 AM'
          : 'Opens at 8:00 AM';
        setStatus({
          isOpen: false,
          text: 'Currently Closed',
          subtext: `${nextOpenStr} · Lucan Community Centre`,
          isWeekendToday: isWeekend,
        });
      }
    } catch (e) {
      // Fallback
      setStatus({
        isOpen: true,
        text: 'Open Today',
        subtext: '8:00 AM – 4:00 PM',
        isWeekendToday: false,
      });
    }
  }, []);

  const handleCopyAddress = () => {
    const fullAddress =
      'So Coffee, Lucan Community Centre, Esker Lane, Lucan, Co. Dublin, K78 H3F6';
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const compactSchedule: CompactScheduleItem[] = [
    {
      days: 'Monday – Friday',
      hours: '8:00 AM – 4:00 PM',
      isToday: !status.isWeekendToday,
      dayType: 'weekday',
    },
    {
      days: 'Saturday – Sunday',
      hours: '9:00 AM – 3:00 PM',
      isToday: status.isWeekendToday,
      dayType: 'weekend',
    },
    {
      days: 'Bank Holidays',
      hours: '9:00 AM – 2:00 PM',
      isToday: false,
      dayType: 'holiday',
    },
  ];

  return (
    <>
      <ScrollRevealInit />
      <Navbar />

      <main className="page-wrapper visit-page-theme">
        {/* ===== HERO SECTION ===== */}
        <section className="visit-page-hero">
          <div className="container">
            <div className="visit-hero-top-row reveal">
              <div className="visit-hero-badge">
                <span>📍</span> LUCAN COMMUNITY CENTRE · ESKER LANE
              </div>
              <div className="visit-live-status">
                <span
                  className={`live-dot ${status.isOpen ? 'open' : 'closed'}`}
                />
                <span>
                  <strong>{status.text}</strong> &mdash; {status.subtext}
                </span>
              </div>
            </div>

            <h1 className="reveal reveal-delay-1">Come Say Hello.</h1>
            <p className="visit-page-hero-desc reveal reveal-delay-2">
              Your neighbourhood table is set inside Lucan Community Centre.
              Whether you&apos;re popping in for a morning espresso, catching up with
              friends after class, or looking for a peaceful corner with free
              Wi-Fi, there&apos;s always a warm cup waiting for you.
            </p>

            {/* Quick Hero Feature Chips */}
            <div className="visit-quick-chips reveal reveal-delay-3">
              <div className="visit-chip">
                <span className="visit-chip-icon">☕</span>
                <div className="visit-chip-content">
                  <h4>Specialty Coffee & Bakes</h4>
                  <p>Freshly pulled espresso & warm treats</p>
                </div>
              </div>
              <div className="visit-chip">
                <span className="visit-chip-icon">🚗</span>
                <div className="visit-chip-content">
                  <h4>50+ Free Parking Spaces</h4>
                  <p>Dedicated on-site car park on Esker Lane</p>
                </div>
              </div>
              <div className="visit-chip">
                <span className="visit-chip-icon">🚌</span>
                <div className="visit-chip-content">
                  <h4>Dublin Bus C1, C2 & L53</h4>
                  <p>Direct routes stopping 3 minutes away</p>
                </div>
              </div>
              <div className="visit-chip">
                <span className="visit-chip-icon">♿</span>
                <div className="visit-chip-content">
                  <h4>100% Step-Free Access</h4>
                  <p>Ramps, automatic doors & accessible seating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MAIN EXPERIENCE SECTION ===== */}
        <section className="visit-main-section">
          <div className="container">
            {/* ROW 1: Location & Wayfinding (Left) + Interactive Map (Right) */}
            <div className="visit-top-grid">
              {/* Location Card */}
              <div className="visit-card reveal">
                <div className="visit-card-header">
                  <div className="visit-card-title-wrap">
                    <div className="visit-card-icon">📍</div>
                    <div>
                      <h3>Location & Venue</h3>
                    </div>
                  </div>
                </div>

                <div className="visit-address-body">
                  <p className="address-highlight">Lucan Community Centre</p>
                  <p className="address-lines">
                    Esker Lane, Lucan<br />
                    Co. Dublin, Ireland
                  </p>
                  <span className="address-eircode">Eircode: K78 H3F6</span>
                </div>

                <div className="visit-address-actions">
                  <button
                    type="button"
                    className={`btn-copy-address ${copied ? 'copied' : ''}`}
                    onClick={handleCopyAddress}
                  >
                    {copied ? '✓ Copied to Clipboard!' : '📋 Copy Address'}
                  </button>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Lucan+Community+Centre,+Esker+Lane,+Lucan,+Co.+Dublin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-map-ext"
                  >
                    Google Maps ↗
                  </a>
                  <a
                    href="https://maps.apple.com/?daddr=Lucan+Community+Centre,+Esker+Lane,+Lucan,+Co.+Dublin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-map-ext"
                  >
                    Apple Maps ↗
                  </a>
                </div>

                <div className="visit-wayfinding-box">
                  <span className="wf-icon">🚪</span>
                  <p>
                    <strong>Finding us inside:</strong> Walk through the
                    automatic double glass doors of Lucan Community Centre. So
                    Coffee is on the ground floor to your left, next to the
                    community reception desk.
                  </p>
                </div>
              </div>

              {/* Map Card */}
              <div className="visit-map-container reveal reveal-delay-1">
                <div className="visit-map-topbar">
                  <div className="map-topbar-title">
                    <h4>Lucan Community Centre</h4>
                    <p>Esker Lane, Lucan, Co. Dublin · K78 H3F6</p>
                  </div>
                </div>

                <div className="visit-map-frame">
                  <iframe
                    src="https://maps.google.com/maps?q=Lucan+Community+Centre,+Esker+Lane,+Lucan,+Dublin,+Ireland&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="So Coffee Location at Lucan Community Centre"
                  />
                </div>

                <div className="map-action-bar">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Lucan+Community+Centre,+Esker+Lane,+Lucan,+Co.+Dublin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-action-link"
                  >
                    <span>🚗</span> Get Driving Directions
                  </a>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Lucan+Community+Centre,+Esker+Lane,+Lucan,+Co.+Dublin&travelmode=transit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-action-link"
                  >
                    <span>🚌</span> Transit Options
                  </a>
                </div>
              </div>
            </div>

            {/* ROW 2: SIDE-BY-SIDE DESIGN — Opening Hours (Left) & Contact & Enquiries (Right) */}
            <div className="visit-hours-contact-grid">
              {/* Compact Opening Hours Card */}
              <div className="visit-card reveal">
                <div className="visit-card-header">
                  <div className="visit-card-title-wrap">
                    <div className="visit-card-icon">🕐</div>
                    <div>
                      <h3>Opening Hours</h3>
                    </div>
                  </div>
                  <span className="today-tag">
                    {status.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>

                <div className="hours-compact-list">
                  {compactSchedule.map((item) => (
                    <div
                      key={item.days}
                      className={`hours-compact-item ${item.isToday ? 'current-day' : ''}`}
                    >
                      <div className="hours-compact-label">
                        <span className="hours-day-name">{item.days}</span>
                        {item.isToday && (
                          <span className="today-tag">Today</span>
                        )}
                      </div>
                      <span className="hours-compact-time">{item.hours}</span>
                    </div>
                  ))}
                </div>

                <div className="hours-compact-note">
                  <p>
                    <strong>Kitchen & Order Notes:</strong> Hot sandwiches, toasties, and
                    fresh soups are served until 30 minutes before close. Espresso coffee,
                    pastries, and cold drinks are served all day.
                  </p>
                </div>
              </div>

              {/* Contact & Enquiries Card (Side-by-Side) */}
              <div className="visit-card reveal reveal-delay-1">
                <div className="visit-card-header">
                  <div className="visit-card-title-wrap">
                    <div className="visit-card-icon">📞</div>
                    <div>
                      <h3>Contact & Enquiries</h3>
                    </div>
                  </div>
                </div>

                <div className="contact-grid-compact">
                  <div className="contact-compact-item">
                    <span className="c-icon">✉️</span>
                    <div>
                      <h5>Email Us</h5>
                      <a href="mailto:hello@socoffee.ie">hello@socoffee.ie</a>
                    </div>
                  </div>
                  <div className="contact-compact-item">
                    <span className="c-icon">📸</span>
                    <div>
                      <h5>Instagram</h5>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @socoffee.lucan
                      </a>
                    </div>
                  </div>
                  <div className="contact-compact-item">
                    <span className="c-icon">🏢</span>
                    <div>
                      <h5>Venue Desk</h5>
                      <p>Centre Reception Foyer</p>
                    </div>
                  </div>
                  <div className="contact-compact-item">
                    <span className="c-icon">☕</span>
                    <div>
                      <h5>Walk-Ins</h5>
                      <p>Welcome at the counter</p>
                    </div>
                  </div>
                </div>

                <div className="contact-book-cta">
                  <p>Planning a group meetup or club gathering?</p>
                  <Link href="/book" className="btn-book-sm">
                    Reserve Space ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRANSIT & ARRIVAL SECTION ===== */}
        <section className="visit-transit-section">
          <div className="container">
            <div className="transit-header reveal">
              <p className="section-label">GETTING HERE</p>
              <h2 className="section-title">Directions & Transport Links</h2>
              <p>
                Easy to reach whether you are arriving on foot from Lucan Village,
                traveling by Dublin Bus, or driving from anywhere across West
                Dublin.
              </p>
            </div>

            <div className="transit-grid-4">
              {/* Car */}
              <div className="transit-card reveal">
                <div className="transit-card-top">
                  <div className="transit-icon">🚗</div>
                  <span className="transit-tag">Free Parking</span>
                </div>
                <h4>By Car</h4>
                <p>
                  Lucan Community Centre features a generous on-site car park with
                  over 50 complimentary bays for visitors. Ample accessible bays
                  are situated directly beside the front entrance.
                </p>
                <div className="transit-card-footer">
                  <span>✓</span> No parking meters or ticketing required
                </div>
              </div>

              {/* Dublin Bus */}
              <div className="transit-card reveal reveal-delay-1">
                <div className="transit-card-top">
                  <div className="transit-icon">🚌</div>
                  <span className="transit-tag">Routes C1, C2, L53</span>
                </div>
                <h4>By Dublin Bus</h4>
                <p>
                  High-frequency connections from Dublin City Centre (Aston Quay)
                  and Maynooth via spine routes <strong>C1</strong> and{' '}
                  <strong>C2</strong> (alight at Lucan Road). Route{' '}
                  <strong>L53</strong> stops directly on Esker Lane.
                </p>
                <div className="transit-card-footer">
                  <span>✓</span> 2 to 3-minute flat walk from bus stops
                </div>
              </div>

              {/* Cycling & Walking */}
              <div className="transit-card reveal reveal-delay-2">
                <div className="transit-card-top">
                  <div className="transit-icon">🚲</div>
                  <span className="transit-tag">Bicycle Racks</span>
                </div>
                <h4>Cycling & Walking</h4>
                <p>
                  Just a scenic 10-minute stroll from Lucan Village green. Sturdy
                  stainless steel bicycle locking hoops are installed right
                  beside the community centre entrance doors.
                </p>
                <div className="transit-card-footer">
                  <span>✓</span> Secure bike lock hoops outside the door
                </div>
              </div>

              {/* Accessibility */}
              <div className="transit-card reveal reveal-delay-3">
                <div className="transit-card-top">
                  <div className="transit-icon">♿</div>
                  <span className="transit-tag">100% Step-Free</span>
                </div>
                <h4>Full Accessibility</h4>
                <p>
                  Completely step-free from the car park into the café. Wide
                  automatic entrance doors, generous aisle spacing between tables
                  for wheelchairs and double prams, and accessible toilets.
                </p>
                <div className="transit-card-footer">
                  <span>✓</span> Wheelchair & buggy friendly throughout
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CAFE AMENITIES ===== */}
        <section className="visit-amenities-section">
          <div className="container">
            <div className="amenities-header reveal">
              <p className="section-label">COMFORT & CONVENIENCE</p>
              <h2 className="section-title">Designed for Everyday Life</h2>
              <p>
                Everything in our space is thoughtfully designed to make your
                pause comfortable, productive, and enjoyable.
              </p>
            </div>

            <div className="amenities-grid-6">
              <div className="amenity-card reveal">
                <div className="amenity-icon-box">⚡</div>
                <div className="amenity-content">
                  <h4>High-Speed Fibre Wi-Fi</h4>
                  <p>
                    Complimentary fast internet for study, light work, and browsing.
                    Password displayed at the counter.
                  </p>
                </div>
              </div>

              <div className="amenity-card reveal reveal-delay-1">
                <div className="amenity-icon-box">🔌</div>
                <div className="amenity-content">
                  <h4>Laptop & Power Outlets</h4>
                  <p>
                    Perimeter seating areas with accessible wall sockets so you
                    can keep your devices fully charged.
                  </p>
                </div>
              </div>

              <div className="amenity-card reveal reveal-delay-2">
                <div className="amenity-icon-box">🍼</div>
                <div className="amenity-content">
                  <h4>Family & Pram Friendly</h4>
                  <p>
                    Spacious floor plan with plenty of buggy parking, baby
                    changing stations, and high chairs available.
                  </p>
                </div>
              </div>

              <div className="amenity-card reveal">
                <div className="amenity-icon-box">🌿</div>
                <div className="amenity-content">
                  <h4>Dairy-Free Milk Options</h4>
                  <p>
                    Barista-grade Oatly Oat Milk and Almond Milk for all coffees
                    and hot chocolate beverages.
                  </p>
                </div>
              </div>

              <div className="amenity-card reveal reveal-delay-1">
                <div className="amenity-icon-box">🐾</div>
                <div className="amenity-content">
                  <h4>Assistance Animals Welcome</h4>
                  <p>
                    Certified guide dogs and service animals are warmly welcomed
                    inside the centre with water bowls on request.
                  </p>
                </div>
              </div>

              <div className="amenity-card reveal reveal-delay-2">
                <div className="amenity-icon-box">♻️</div>
                <div className="amenity-content">
                  <h4>KeepCup Friendly Discount</h4>
                  <p>
                    Bring your own reusable travel mug or tumbler and enjoy a
                    20c green discount on any hot beverage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMMUNITY SPOTLIGHT BANNER ===== */}
        <section className="container">
          <div className="visit-community-spotlight reveal">
            <div className="spotlight-text">
              <p className="section-label">AT HOME IN LUCAN</p>
              <h2>The Social Living Room of Lucan Community Centre</h2>
              <p>
                We are more than just a place to get coffee — we are proud to be
                an integral part of Lucan&apos;s daily rhythm. From parents waiting
                during children&apos;s dance and gymnastics classes to friends
                reconnecting after a community workshop, our tables are built for
                warmth, comfort, and real connection.
              </p>
              <div className="spotlight-tags">
                <span className="spotlight-tag-item">☕ Specialty Coffee</span>
                <span className="spotlight-tag-item">👥 Club Meetups</span>
                <span className="spotlight-tag-item">🥪 Fresh Lunch Bites</span>
                <span className="spotlight-tag-item">💛 Genuine Lucan Hospitality</span>
              </div>
            </div>

            <div className="spotlight-image-wrap">
              <img
                src="/images/slow-moments.jpg"
                alt="Community members enjoying coffee at So Coffee"
                loading="lazy"
              />
              <div className="spotlight-quote-badge">
                &ldquo;Where good coffee meets genuine community care.&rdquo;
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section className="visit-faq-section">
          <div className="container faq-container-narrow">
            <div className="faq-header reveal">
              <p className="section-label">HELPFUL DETAILS</p>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p>Everything you might want to know before dropping in.</p>
            </div>

            <div className="faq-accordion-list">
              {FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={faq.question}
                    className={`faq-accordion-item reveal ${isOpen ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-accordion-btn"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <span className="faq-toggle-icon">{isOpen ? '✕' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-accordion-content">
                        <p>
                          {faq.answer}{' '}
                          {faq.linkUrl && (
                            <Link href={faq.linkUrl}>{faq.linkText} &rarr;</Link>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== BOTTOM CTA CARD ===== */}
        <section className="container">
          <div className="visit-cta-card reveal">
            <p className="section-label">WE LOOK FORWARD TO MEETING YOU</p>
            <h3>Ready for a Good Cup of Coffee?</h3>
            <p>
              Drop in during opening hours, or reserve a table ahead of time if
              you&apos;re bringing a group. We can&apos;t wait to pour your favourite
              roast.
            </p>
            <div className="visit-cta-actions">
              <Link href="/book" className="btn-primary">
                Book a Table / Space
              </Link>
              <Link href="/menu" className="btn-secondary">
                Explore Full Menu
              </Link>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Lucan+Community+Centre,+Esker+Lane,+Lucan,+Co.+Dublin"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-directions-cta"
              >
                Get Directions ↗
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Copy Feedback Toast */}
      <div className={`copy-toast ${copied ? 'visible' : ''}`}>
        <span>✓</span> Address copied to clipboard!
      </div>

      <Footer onOpenBooking={() => {}} />
      <BackToTop />
    </>
  );
}
