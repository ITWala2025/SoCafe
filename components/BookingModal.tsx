'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingMode, setBookingMode] = useState<'table' | 'event'>('table');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '3-4',
    date: '',
    time: '10:30',
    eventType: 'Community Gathering / Meetup',
    cateringPackage: 'Barista Coffee & Fresh Morning Pastries (€6.50/person)',
    notes: '',
  });

  useEffect(() => {
    // Set today as minimum date
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, date: prev.date || today }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
          notes: formData.notes,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        showToast(
          bookingMode === 'table'
            ? `Thank you, ${formData.name}! Your table request for ${formData.guests} people on ${formData.date} has been received.`
            : `Thank you, ${formData.name}! Your event hosting proposal for ${formData.guests} attendees has been received.`,
          '🌿'
        );
        onClose();
        setFormData({
          name: '',
          email: '',
          phone: '',
          guests: '3-4',
          date: new Date().toISOString().split('T')[0],
          time: '10:30',
          eventType: 'Community Gathering / Meetup',
          cateringPackage: 'Barista Coffee & Fresh Morning Pastries (€6.50/person)',
          notes: '',
        });
      } else {
        showToast(result.error || 'Could not complete reservation.', '⚠️');
      }
    } catch {
      showToast('Network error while booking. Please try again.', '⚠️');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-backdrop ${isOpen ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="modal-dialog">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          &times;
        </button>
        <div className="modal-header">
          <p className="modal-label">RESERVATIONS & EVENT HOSTING</p>
          <h3 className="modal-title" id="modalTitle">
            {bookingMode === 'table' ? 'Book a Table' : 'Host a Community Event'}
          </h3>
          <p className="modal-subtitle">
            {bookingMode === 'table'
              ? 'Reserve a cosy table for coffee, lunch, or catching up inside Lucan Community Centre.'
              : 'Partner with So Coffee & Lucan Community Centre for meetings, workshops, and gatherings.'}
          </p>
        </div>

        {/* Dual Mode Switcher */}
        <div className="booking-mode-selector" style={{ marginBottom: '20px' }}>
          <button
            type="button"
            className={`booking-mode-btn ${bookingMode === 'table' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('table')}
          >
            <span>☕</span> Book a Table
          </button>
          <button
            type="button"
            className={`booking-mode-btn ${bookingMode === 'event' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('event')}
          >
            <span>🎉</span> Host an Event
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
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
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+353 87 123 4567"
              />
            </div>
            <div className="form-group">
              <label htmlFor="guests">
                {bookingMode === 'table' ? 'Number of People *' : 'Expected Attendees *'}
              </label>
              {bookingMode === 'table' ? (
                <select
                  id="guests"
                  required
                  value={formData.guests}
                  onChange={handleChange}
                >
                  <option value="1-2">1 – 2 People (Cosy table)</option>
                  <option value="3-4">3 – 4 People (Standard table)</option>
                  <option value="5-8">5 – 8 People (Group table)</option>
                </select>
              ) : (
                <select
                  id="guests"
                  required
                  value={formData.guests}
                  onChange={handleChange}
                >
                  <option value="8-15">8 – 15 People (Café Reserved Zone)</option>
                  <option value="16-30">16 – 30 People (Multi-Purpose Suite)</option>
                  <option value="31-50">31 – 50 People (Community Hall)</option>
                  <option value="50+">50+ People (Full Centre Hall)</option>
                </select>
              )}
            </div>
          </div>

          {bookingMode === 'event' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventType">Event Type</label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                >
                  <option value="Community Gathering / Meetup">Community Group / Meetup</option>
                  <option value="Book Club or Discussion Circle">Book Club / Discussion Circle</option>
                  <option value="Workshop or Class">Workshop or Creative Class</option>
                  <option value="Sports / Committee Debrief">Sports Club / Committee Meeting</option>
                  <option value="Birthday or Family Celebration">Family Gathering or Birthday</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="cateringPackage">Catering Package</label>
                <select
                  id="cateringPackage"
                  value={formData.cateringPackage}
                  onChange={handleChange}
                >
                  <option value="Barista Coffee & Fresh Morning Pastries (€6.50/person)">
                    Coffee & Pastries (€6.50/p)
                  </option>
                  <option value="Artisanal Lunch Sandwiches & Warm Bites (€12.50/person)">
                    Lunch Sandwiches & Bites (€12.50/p)
                  </option>
                  <option value="Sweet Treats & Coffee Grazing Board (€9.00/person)">
                    Sweet Treats Board (€9.00/p)
                  </option>
                  <option value="No Catering / Guests Order Individually">
                    No Package (Individual Orders)
                  </option>
                </select>
              </div>
            </div>
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
                <option value="16:00">04:00 PM (Evening)</option>
                <option value="18:00">06:00 PM (Evening)</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="notes">
              {bookingMode === 'table' ? 'Special Requests' : 'Event Setup & Details'}
            </label>
            <textarea
              id="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder={
                bookingMode === 'table'
                  ? 'High chair needed, quiet corner, pre-ordered pastries, etc...'
                  : 'Room layout, AV needs, projector, timeline...'
              }
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting...'
                : bookingMode === 'table'
                ? 'Confirm Table Reservation'
                : 'Submit Event Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
