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
        showToast(
          `Thank you, ${formData.name}! Your reservation request for ${formData.guests} people at ${formData.time} has been received.`,
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
          <p className="modal-label">TABLE & COMMUNITY BOOKINGS</p>
          <h3 className="modal-title" id="modalTitle">
            Book a Space at So Coffee
          </h3>
          <p className="modal-subtitle">
            Reserve a spot for a community meetup, study session, or group
            catch-up inside Lucan Community Centre.
          </p>
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
              <label htmlFor="guests">Number of People *</label>
              <select
                id="guests"
                required
                value={formData.guests}
                onChange={handleChange}
              >
                <option value="1-2">1 – 2 People (Cosy table)</option>
                <option value="3-4">3 – 4 People (Standard table)</option>
                <option value="5-8">5 – 8 People (Group table)</option>
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
            <label htmlFor="notes">Special Notes or Requirements</label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tell us about your visit (high chair needed, quiet corner, meetup topic, etc.)..."
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
              {isSubmitting ? 'Submitting...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
