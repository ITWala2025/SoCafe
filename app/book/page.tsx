'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import { useToast } from '@/components/Toast';
import Link from 'next/link';

export default function BookPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingMode, setBookingMode] = useState<'table' | 'event'>('table');
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    bookingType: 'table' | 'event';
    guests: string;
    date: string;
    time: string;
    eventType?: string;
    cateringPackage?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '3-4',
    date: '',
    time: '10:30',
    eventType: 'Community Gathering / Meetup',
    cateringPackage: 'Barista Coffee & Fresh Morning Pastries (€6.50/person)',
    avRequirements: 'None needed',
    notes: '',
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, date: prev.date || today }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleModeSwitch = (mode: 'table' | 'event') => {
    setBookingMode(mode);
    setFormData((prev) => ({
      ...prev,
      guests: mode === 'table' ? '3-4' : '16-30',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullNotes = bookingMode === 'event'
      ? `[AV/Setup: ${formData.avRequirements}] ${formData.notes}`
      : formData.notes;

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          booking_type: bookingMode,
          event_type: bookingMode === 'event' ? formData.eventType : null,
          catering_package: bookingMode === 'event' ? formData.cateringPackage : null,
          guests: formData.guests,
          reservation_date: formData.date,
          reservation_time: formData.time,
          notes: fullNotes,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmittedData({
          name: formData.name,
          bookingType: bookingMode,
          guests: formData.guests,
          date: formData.date,
          time: formData.time,
          eventType: bookingMode === 'event' ? formData.eventType : undefined,
          cateringPackage: bookingMode === 'event' ? formData.cateringPackage : undefined,
        });
        showToast(
          bookingMode === 'table'
            ? `Table request received for ${formData.name}! We look forward to seeing you.`
            : `Event inquiry received for ${formData.name}! Our events coordinator will contact you.`,
          '🌿'
        );
        window.scrollTo({ top: 200, behavior: 'smooth' });
      } else {
        showToast(result.error || 'Failed to submit reservation.', '⚠️');
      }
    } catch {
      showToast('Network error while booking. Please try again.', '⚠️');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ScrollRevealInit />
      <Navbar />
      <main className="page-wrapper">
        <section className="page-hero">
          <div className="container">
            <p className="section-label">RESERVATIONS & EVENT HOSTING</p>
            <h1 className="page-hero-title">Book a Space at So Coffee</h1>
            <p className="page-hero-desc">
              Whether you&apos;re catching up over morning flat whites, or hosting a community workshop,
              club meetup, or private celebration inside Lucan Community Centre — we have the cosy tables
              and versatile spaces to make it memorable.
            </p>
          </div>
        </section>

        <section className="page-content-section">
          <div className="container">
            <div className="booking-page-grid">
              {/* Form Container */}
              <div className="booking-form-card reveal">
                {/* Switcher */}
                <div className="booking-mode-selector" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={bookingMode === 'table'}
                    className={`booking-mode-btn ${bookingMode === 'table' ? 'active' : ''}`}
                    onClick={() => handleModeSwitch('table')}
                  >
                    <span>☕</span> Book a Table
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={bookingMode === 'event'}
                    className={`booking-mode-btn ${bookingMode === 'event' ? 'active' : ''}`}
                    onClick={() => handleModeSwitch('event')}
                  >
                    <span>🎉</span> Host an Event / Gathering
                  </button>
                </div>

                {submittedData ? (
                  <div className="booking-success-box">
                    <div className="success-icon">✓</div>
                    <h2>
                      {submittedData.bookingType === 'table'
                        ? 'Table Reservation Request Received!'
                        : 'Event Hosting Inquiry Received!'}
                    </h2>
                    <p className="success-lead">
                      Thank you, <strong>{submittedData.name}</strong>. We have logged your{' '}
                      {submittedData.bookingType === 'table' ? 'table booking' : 'event proposal'} for{' '}
                      <strong>{submittedData.guests} attendees</strong> on{' '}
                      <strong>{submittedData.date}</strong> at <strong>{submittedData.time}</strong>.
                    </p>
                    {submittedData.bookingType === 'event' && (
                      <div className="event-summary-badge" style={{ margin: '14px 0', padding: '12px', background: 'rgba(59,47,30,0.06)', borderRadius: '10px' }}>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                          <strong>Event:</strong> {submittedData.eventType}
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                          <strong>Catering:</strong> {submittedData.cateringPackage}
                        </p>
                      </div>
                    )}
                    <p className="success-sub">
                      {submittedData.bookingType === 'table'
                        ? 'Our café team will review your booking and send a confirmation note to your email.'
                        : 'Our café & Lucan Community Centre events manager will review room schedules and get back to you within 24 hours with room availability and bespoke catering details.'}
                    </p>
                    <div className="success-actions">
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          setSubmittedData(null);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            guests: bookingMode === 'table' ? '3-4' : '16-30',
                            date: new Date().toISOString().split('T')[0],
                            time: '10:30',
                            eventType: 'Community Gathering / Meetup',
                            cateringPackage: 'Barista Coffee & Fresh Morning Pastries (€6.50/person)',
                            avRequirements: 'None needed',
                            notes: '',
                          });
                        }}
                      >
                        Submit Another Booking
                      </button>
                      <Link href="/menu" className="btn-secondary">
                        Explore Our Menu While You Wait
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="form-card-header">
                      <h3>
                        {bookingMode === 'table'
                          ? 'Reserve Your Table'
                          : 'Host Your Community Event'}
                      </h3>
                      <p>
                        {bookingMode === 'table'
                          ? 'Perfect for casual dining, catch-ups, and study sessions (1 to 8 guests).'
                          : 'Host workshops, club meetings, committee debriefs, and private gatherings (8 to 50+ guests).'}
                      </p>
                    </div>

                    {bookingMode === 'event' && (
                      <div className="booking-event-banner">
                        <span className="icon">🏛️</span>
                        <div>
                          <strong>Community Spaces & Catering:</strong> We partner directly with Lucan Community Centre for flexible room configurations, audio/visual setups, and artisanal coffee and food catering.
                        </div>
                      </div>
                    )}

                    <form className="modal-form" onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="name">Primary Contact Name *</label>
                          <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Siobhan Murphy"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email Address *</label>
                          <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="siobhan@example.ie"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="phone">Contact Phone Number *</label>
                          <input
                            type="tel"
                            id="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+353 87 123 4567"
                          />
                        </div>

                        {bookingMode === 'table' ? (
                          <div className="form-group">
                            <label htmlFor="guests">Party Size *</label>
                            <select
                              id="guests"
                              required
                              value={formData.guests}
                              onChange={handleChange}
                            >
                              <option value="1-2">1 – 2 People (Cosy table)</option>
                              <option value="3-4">3 – 4 People (Standard table)</option>
                              <option value="5-8">5 – 8 People (Large communal table)</option>
                            </select>
                          </div>
                        ) : (
                          <div className="form-group">
                            <label htmlFor="guests">Expected Attendees *</label>
                            <select
                              id="guests"
                              required
                              value={formData.guests}
                              onChange={handleChange}
                            >
                              <option value="8-15">8 – 15 People (Café Reserved Zone)</option>
                              <option value="16-30">16 – 30 People (Multi-Purpose Suite)</option>
                              <option value="31-50">31 – 50 People (Community Hall)</option>
                              <option value="50+">50+ People (Large Event / Full Centre Hall)</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Event Specific Fields */}
                      {bookingMode === 'event' && (
                        <>
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="eventType">Event / Gathering Type *</label>
                              <select
                                id="eventType"
                                required
                                value={formData.eventType}
                                onChange={handleChange}
                              >
                                <option value="Community Gathering / Meetup">Community Group / Meetup</option>
                                <option value="Book Club or Discussion Circle">Book Club / Discussion Circle</option>
                                <option value="Workshop or Class">Workshop or Creative Class</option>
                                <option value="Sports / Committee Debrief">Sports Club / Committee Meeting</option>
                                <option value="Birthday or Family Celebration">Family Gathering or Birthday</option>
                                <option value="Corporate or Remote Team Sync">Remote Work Team Sync</option>
                              </select>
                            </div>

                            <div className="form-group">
                              <label htmlFor="cateringPackage">Catering Package *</label>
                              <select
                                id="cateringPackage"
                                required
                                value={formData.cateringPackage}
                                onChange={handleChange}
                              >
                                <option value="Barista Coffee & Fresh Morning Pastries (€6.50/person)">
                                  Coffee & Morning Pastries (€6.50 / person)
                                </option>
                                <option value="Artisanal Lunch Sandwiches & Warm Bites (€12.50/person)">
                                  Artisanal Lunch Sandwiches & Bites (€12.50 / person)
                                </option>
                                <option value="Sweet Treats & Coffee Grazing Board (€9.00/person)">
                                  Sweet Treats Grazing Board (€9.00 / person)
                                </option>
                                <option value="No Catering / Guests Order Individually">
                                  No Pre-Set Package (Guests Order Individually)
                                </option>
                              </select>
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="avRequirements">AV & Equipment Setup</label>
                            <select
                              id="avRequirements"
                              value={formData.avRequirements}
                              onChange={handleChange}
                            >
                              <option value="None needed">No AV needed (Casual seating)</option>
                              <option value="Projector & Display Screen">Projector & Display Screen</option>
                              <option value="Microphone & Sound System">Microphone & PA Sound System</option>
                              <option value="Flipchart & Whiteboard">Flipchart & Whiteboard</option>
                              <option value="Full Setup (Projector + PA + Whiteboard)">Full AV Suite (Projector + PA + Whiteboard)</option>
                            </select>
                          </div>
                        </>
                      )}

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="date">Date *</label>
                          <input
                            type="date"
                            id="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="time">
                            {bookingMode === 'table' ? 'Preferred Time *' : 'Event Start Time *'}
                          </label>
                          <select
                            id="time"
                            required
                            value={formData.time}
                            onChange={handleChange}
                          >
                            <option value="08:30">08:30 AM</option>
                            <option value="09:30">09:30 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="11:30">11:30 AM</option>
                            <option value="12:30">12:30 PM</option>
                            <option value="13:30">01:30 PM</option>
                            <option value="14:30">02:30 PM</option>
                            <option value="16:00">04:00 PM (Evening Event)</option>
                            <option value="18:00">06:00 PM (Evening Event)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="notes">
                          {bookingMode === 'table'
                            ? 'Special Requests or Seating Preferences'
                            : 'Additional Event Details & Setup Notes'}
                        </label>
                        <textarea
                          id="notes"
                          rows={3}
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder={
                            bookingMode === 'table'
                              ? 'High chair needed, power socket nearby, quiet window table, dietary notes...'
                              : 'Tell us about the schedule, table layout (theatre vs boardroom), dietary requirements...'
                          }
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-submit booking-submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? 'Submitting Request...'
                          : bookingMode === 'table'
                          ? 'Confirm Table Reservation Request'
                          : 'Submit Event Hosting Proposal'}
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Sidebar Guide */}
              <div className="booking-sidebar reveal reveal-delay-1">
                <div className="booking-info-box">
                  <h4>💡 Helpful Information</h4>
                  <ul>
                    <li>
                      <strong>Walk-ins Welcome:</strong> Even without a booking,
                      we always keep counter tables open for walk-in coffee breaks.
                    </li>
                    <li>
                      <strong>Community Groups:</strong> If you are planning a
                      recurring weekly meetup, let us know in the notes and we
                      can arrange reserved seating.
                    </li>
                    <li>
                      <strong>Large Events (10+ people):</strong> Lucan Community
                      Centre has additional event halls available which we can
                      cater with specialty coffee and food.
                    </li>
                    <li>
                      <strong>Questions?</strong> Email us anytime at{' '}
                      <a href="mailto:hello@socoffee.ie" className="contact-link">
                        hello@socoffee.ie
                      </a>.
                    </li>
                  </ul>
                </div>

                <div className="booking-location-box">
                  <h4>📍 Venue Location</h4>
                  <p>
                    So Coffee @ Lucan Community Centre<br />
                    Esker Lane, Lucan, Co. Dublin
                  </p>
                  <Link href="/visit" className="view-map-link">
                    View Map & Parking Info →
                  </Link>
                </div>
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
