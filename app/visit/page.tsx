'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import Link from 'next/link';

export default function VisitPage() {
  return (
    <>
      <ScrollRevealInit />
      <Navbar />
      <main className="page-wrapper">
        <section className="page-hero">
          <div className="container">
            <p className="section-label">HOW TO FIND US</p>
            <h1 className="page-hero-title">Come Say Hello</h1>
            <p className="page-hero-desc">
              We&apos;re located right inside Lucan Community Centre on Esker Lane.
              Whether you&apos;re arriving on foot, by bike, or by car, there&apos;s
              always easy parking, ramp access, and a warm cup waiting.
            </p>
          </div>
        </section>

        <section className="page-content-section">
          <div className="container">
            {/* Visit Grid */}
            <div className="visit-grid">
              <div className="visit-content">
                <p className="section-label reveal">KEY DETAILS</p>
                <h2 className="section-title reveal reveal-delay-1">
                  Opening Hours & Location
                </h2>
                <div className="visit-info-grid reveal reveal-delay-2">
                  <div className="visit-info-item">
                    <h4>📍 Location</h4>
                    <p>
                      Lucan Community Centre<br />
                      Esker Lane, Lucan<br />
                      Co. Dublin, Ireland<br />
                      K78 H3F6
                    </p>
                  </div>
                  <div className="visit-info-item">
                    <h4>🕐 Opening Hours</h4>
                    <p>
                      <strong>Monday – Friday</strong><br />
                      8:00 AM – 4:00 PM<br /><br />
                      <strong>Saturday – Sunday</strong><br />
                      9:00 AM – 3:00 PM
                    </p>
                  </div>
                  <div className="visit-info-item">
                    <h4>📞 Contact</h4>
                    <p>
                      <a href="mailto:hello@socoffee.ie" className="contact-link">
                        hello@socoffee.ie
                      </a>
                    </p>
                  </div>
                  <div className="visit-info-item">
                    <h4>🌐 Follow Us</h4>
                    <p>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        @socoffee.lucan
                      </a>
                    </p>
                  </div>
                </div>

                {/* Getting here details */}
                <div className="transit-info reveal reveal-delay-3">
                  <h4>Getting Here</h4>
                  <ul>
                    <li>
                      <strong>🚗 Parking:</strong> Free customer parking is
                      available directly in the Lucan Community Centre car park.
                    </li>
                    <li>
                      <strong>🚌 Dublin Bus:</strong> Conveniently accessible via
                      routes C1, C2, and L53 (Esker Lane / Lucan Road stops).
                    </li>
                    <li>
                      <strong>♿ Accessibility:</strong> Step-free entrance,
                      wide doors, and fully wheelchair-accessible facilities.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Map */}
              <div className="visit-map reveal reveal-delay-1">
                <iframe
                  src="https://maps.google.com/maps?q=Lucan+Community+Centre,+Esker+Lane,+Lucan,+Dublin,+Ireland&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="So Coffee Location Map"
                />
              </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="faq-section reveal">
              <div className="faq-header">
                <p className="section-label">FREQUENTLY ASKED QUESTIONS</p>
                <h2 className="section-title">Good to Know Before You Visit</h2>
              </div>
              <div className="faq-grid">
                <div className="faq-card">
                  <h4>Is high-speed Wi-Fi available?</h4>
                  <p>
                    Yes! We provide complimentary Wi-Fi for all visitors,
                    making it a comfortable spot for light work and reading.
                  </p>
                </div>
                <div className="faq-card">
                  <h4>Do you offer dairy-free milk alternatives?</h4>
                  <p>
                    We proudly serve premium Oat Milk and Almond Milk for all
                    specialty coffees and hot beverages at no fuss.
                  </p>
                </div>
                <div className="faq-card">
                  <h4>Can I book a table for our group?</h4>
                  <p>
                    Absolutely. For study groups, clubs, or committee meetups,
                    head to our <Link href="/book" className="contact-link">booking page</Link> to reserve a table ahead of time.
                  </p>
                </div>
                <div className="faq-card">
                  <h4>Are children and strollers welcome?</h4>
                  <p>
                    Very much so. With spacious seating, high chairs, and step-free
                    access, families and prams are always welcome.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="menu-page-cta reveal">
              <h3>Need to reserve a spot for your group?</h3>
              <p>Reserve a table in advance or drop us an email.</p>
              <div className="cta-buttons">
                <Link href="/book" className="btn-primary">
                  Book a Table / Space
                </Link>
                <Link href="/menu" className="btn-secondary">
                  Browse Menu
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
