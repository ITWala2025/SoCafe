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
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    guests: string;
    date: string;
    time: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '3-4',
    date: '',
    time: '10:30',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          guests: formData.guests,
          reservation_date: formData.date,
          reservation_time: formData.time,
          notes: formData.notes,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmittedData({
          name: formData.name,
          guests: formData.guests,
          date: formData.date,
          time: formData.time,
        });
        showToast(
          `Reservation request received for ${formData.name}! We look forward to seeing you.`,
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
            <p className="section-label">TABLE & COMMUNITY BOOKINGS</p>
            <h1 className="page-hero-title">Book a Space at So Coffee</h1>
            <p className="page-hero-desc">
              Whether you&apos;re organizing a book club, bringing together a
              volunteer group, or just securing a cosy table for coffee with friends —
              let us know when you&apos;re coming and we&apos;ll have space ready.
            </p>
          </div>
        </section>

        <section className="page-content-section">
          <div className="container">
            <div className="booking-page-grid">
              {/* Form Container */}
              <div className="booking-form-card reveal">
                {submittedData ? (
                  <div className="booking-success-box">
                    <div className="success-icon">✓</div>
                    <h2>Reservation Request Sent!</h2>
                    <p className="success-lead">
                      Thank you, <strong>{submittedData.name}</strong>. We have
                      logged your request for <strong>{submittedData.guests} people</strong> on{' '}
                      <strong>{submittedData.date}</strong> at <strong>{submittedData.time}</strong>.
                    </p>
                    <p className="success-sub">
                      Our café team at Lucan Community Centre will review your booking
                      and send a confirmation to your email.
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
                            guests: '3-4',
                            date: new Date().toISOString().split('T')[0],
                            time: '10:30',
                            notes: '',
                          });
                        }}
                      >
                        Make Another Reservation
                      </button>
                      <Link href="/menu" className="btn-secondary">
                        View Menu While You Wait
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="form-card-header">
                      <h3>Reservation Details</h3>
                      <p>Fill out the details below. We reply within 24 hours.</p>
                    </div>

                    <form className="modal-form" onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="name">Full Name *</label>
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
                          <label htmlFor="phone">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+353 87 123 4567"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="guests">Number of Guests *</label>
                          <select
                            id="guests"
                            required
                            value={formData.guests}
                            onChange={handleChange}
                          >
                            <option value="1-2">1 – 2 People (Cosy corner table)</option>
                            <option value="3-4">3 – 4 People (Standard table)</option>
                            <option value="5-8">5 – 8 People (Large communal table)</option>
                            <option value="9+">9+ People (Community room inquiry)</option>
                          </select>
                        </div>
                      </div>

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
                          <label htmlFor="time">Preferred Time *</label>
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
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="notes">Special Requests or Notes</label>
                        <textarea
                          id="notes"
                          rows={4}
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="High chair needed, power outlet nearby, club topic, pre-ordered pastries, etc..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-submit booking-submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending Request...' : 'Confirm Reservation Request'}
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
