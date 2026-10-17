'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/auth/admin';
import Link from 'next/link';
import type { Reservation } from '@/types/supabase';
import type { MenuCategoryKey } from '@/data/menu';

interface AdminMenuItem {
  id: string;
  category_slug?: string;
  name: string;
  desc?: string;
  description?: string;
  price?: string | null;
  available?: boolean;
  is_available?: boolean;
}

export default function AdminDashboardPage() {
  const { user, isLoading, logout } = useAdminAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'menu' | 'settings'>('overview');

  // Bookings state
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);

  // Menu state
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    category: 'hot',
    desc: '',
    price: '€3.50',
  });

  // Notice state
  const [announcement, setAnnouncement] = useState('Fresh batch of warm cinnamon swirls baked every morning at 8:30 AM.');
  const [noticeSaved, setNoticeSaved] = useState(false);

  // Status message
  const [adminNotice, setAdminNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setAdminNotice({ text, type });
    setTimeout(() => setAdminNotice(null), 4000);
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  // Load bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/reservations');
      const json = await res.json();
      if (json.data) {
        setReservations(json.data);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    }
  };

  // Load menu items
  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu?flat=true');
      const json = await res.json();
      if (json.data) {
        setMenuItems(json.data);
      }
    } catch (err) {
      console.error('Failed to load menu items:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchMenuItems();
    }
  }, [user]);

  // Booking actions
  const handleUpdateStatus = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        showNotice(`Reservation marked as ${newStatus}`);
        fetchBookings();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch {
      showNotice('Failed to update reservation', 'error');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;
    try {
      const res = await fetch(`/api/reservations?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotice('Reservation deleted');
        fetchBookings();
        if (selectedBooking?.id === id) setSelectedBooking(null);
      }
    } catch {
      showNotice('Failed to delete reservation', 'error');
    }
  };

  // Menu actions
  const handleToggleAvailability = async (item: AdminMenuItem) => {
    const currentStatus = item.is_available ?? item.available ?? true;
    const newStatus = !currentStatus;

    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, available: newStatus }),
      });
      if (res.ok) {
        showNotice(`${item.name} set to ${newStatus ? 'In Stock' : 'Sold Out'}`);
        fetchMenuItems();
      }
    } catch {
      showNotice('Failed to update availability', 'error');
    }
  };

  const handleDeleteMenuItem = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" from the menu?`)) return;
    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotice(`Removed ${name} from menu`);
        fetchMenuItems();
      }
    } catch {
      showNotice('Failed to delete item', 'error');
    }
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      // Edit
      try {
        const res = await fetch('/api/menu', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            category: menuFormData.category,
            name: menuFormData.name,
            desc: menuFormData.desc,
            price: menuFormData.price,
          }),
        });
        if (res.ok) {
          showNotice(`Updated ${menuFormData.name}`);
          setEditingItem(null);
          setIsAddMenuOpen(false);
          fetchMenuItems();
        }
      } catch {
        showNotice('Failed to update item', 'error');
      }
    } else {
      // Add
      try {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: menuFormData.category,
            name: menuFormData.name,
            desc: menuFormData.desc,
            price: menuFormData.price,
          }),
        });
        if (res.ok) {
          showNotice(`Added ${menuFormData.name} to menu`);
          setIsAddMenuOpen(false);
          setMenuFormData({ name: '', category: 'hot', desc: '', price: '€3.50' });
          fetchMenuItems();
        }
      } catch {
        showNotice('Failed to add item', 'error');
      }
    }
  };

  if (isLoading || !user) {
    return (
      <div className="admin-loading-screen">
        <div className="loading-spinner"></div>
        <p>Verifying manager authentication...</p>
      </div>
    );
  }

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesStatus = bookingFilter === 'all' || r.status === bookingFilter;
    const matchesSearch =
      bookingSearch === '' ||
      r.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered menu
  const filteredMenu = menuItems.filter((i) => {
    const cat = i.category_slug || (i.id.split('-')[0] as string);
    return selectedCategory === 'all' || cat === selectedCategory;
  });

  // Metric computations
  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = reservations.filter((r) => r.reservation_date === todayStr).length;

  return (
    <div className="admin-app">
      {/* Top Admin Bar */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <Link href="/" className="admin-brand-link">
            <span className="brand-title">So Coffee</span>
            <span className="brand-tag">ADMIN DASHBOARD</span>
          </Link>
        </div>

        <div className="admin-topbar-actions">
          <div className="admin-user-info">
            <span className="user-icon">👤</span>
            <div>
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>

          <Link href="/" target="_blank" className="btn-view-site">
            View Live Site ↗
          </Link>

          <button type="button" onClick={logout} className="btn-logout">
            Sign Out
          </button>
        </div>
      </header>

      {/* Global Admin Alert Notification */}
      {adminNotice && (
        <div className={`admin-notification-toast ${adminNotice.type}`}>
          {adminNotice.text}
        </div>
      )}

      {/* Main Admin Content */}
      <div className="admin-container">
        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            📅 Reservations & Bookings
            {pendingCount > 0 && <span className="tab-counter">{pendingCount}</span>}
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            ☕ Menu Management ({menuItems.length})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings & Announcements
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content">
            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Pending Bookings</span>
                <div className="stat-value pending-color">{pendingCount}</div>
                <span className="stat-hint">Requires confirmation</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Confirmed Bookings</span>
                <div className="stat-value confirmed-color">{confirmedCount}</div>
                <span className="stat-hint">Upcoming guests</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Today&apos;s Reservations</span>
                <div className="stat-value">{todayCount}</div>
                <span className="stat-hint">{todayStr}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Active Menu Items</span>
                <div className="stat-value">{menuItems.length}</div>
                <span className="stat-hint">Across 4 categories</span>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="overview-actions-banner">
              <div>
                <h3>Quick Management Shortcuts</h3>
                <p>Manage daily operations for So Coffee inside Lucan Community Centre.</p>
              </div>
              <div className="action-buttons-row">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setActiveTab('menu');
                    setIsAddMenuOpen(true);
                  }}
                >
                  + Add New Menu Item
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveTab('bookings')}
                >
                  Review Pending Bookings
                </button>
              </div>
            </div>

            {/* Recent Reservations Table */}
            <div className="admin-card">
              <div className="card-header-row">
                <h3>Recent Reservation Requests</h3>
                <button
                  type="button"
                  className="btn-text-link"
                  onClick={() => setActiveTab('bookings')}
                >
                  View All ({reservations.length}) →
                </button>
              </div>

              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Date & Time</th>
                      <th>Party Size</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.slice(0, 5).map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.name}</strong>
                          <span className="cell-sub">{r.email}</span>
                        </td>
                        <td>
                          {r.reservation_date} @ {r.reservation_time}
                        </td>
                        <td>{r.guests} guests</td>
                        <td>
                          <span className={`status-badge status-${r.status}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-button-group">
                            {r.status === 'pending' && (
                              <button
                                type="button"
                                className="btn-table-confirm"
                                onClick={() => handleUpdateStatus(r.id, 'confirmed')}
                              >
                                Confirm
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn-table-view"
                              onClick={() => {
                                setSelectedBooking(r);
                                setActiveTab('bookings');
                              }}
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reservations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="empty-cell">
                          No reservations logged yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="admin-tab-content">
            <div className="section-toolbar">
              <div className="filter-pill-group">
                {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`filter-pill ${bookingFilter === st ? 'active' : ''}`}
                    onClick={() => setBookingFilter(st)}
                  >
                    {st.charAt(0).toUpperCase() + st.slice(1)} (
                    {st === 'all'
                      ? reservations.length
                      : reservations.filter((r) => r.status === st).length}
                    )
                  </button>
                ))}
              </div>

              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search guest name or email..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="bookings-layout-grid">
              <div className="admin-card bookings-table-card">
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Guest Name</th>
                        <th>Contact</th>
                        <th>Date & Time</th>
                        <th>Guests</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((r) => (
                        <tr
                          key={r.id}
                          className={selectedBooking?.id === r.id ? 'row-selected' : ''}
                        >
                          <td>
                            <strong>{r.name}</strong>
                          </td>
                          <td>
                            <div>{r.email}</div>
                            {r.phone && <span className="cell-sub">{r.phone}</span>}
                          </td>
                          <td>
                            {r.reservation_date} @ {r.reservation_time}
                          </td>
                          <td>{r.guests}</td>
                          <td>
                            <span className={`status-badge status-${r.status}`}>
                              {r.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-button-group">
                              <button
                                type="button"
                                className="btn-table-view"
                                onClick={() => setSelectedBooking(r)}
                              >
                                View
                              </button>
                              {r.status !== 'confirmed' && (
                                <button
                                  type="button"
                                  className="btn-table-confirm"
                                  onClick={() => handleUpdateStatus(r.id, 'confirmed')}
                                >
                                  Confirm
                                </button>
                              )}
                              {r.status !== 'cancelled' && (
                                <button
                                  type="button"
                                  className="btn-table-cancel"
                                  onClick={() => handleUpdateStatus(r.id, 'cancelled')}
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn-table-delete"
                                onClick={() => handleDeleteBooking(r.id)}
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredReservations.length === 0 && (
                        <tr>
                          <td colSpan={6} className="empty-cell">
                            No reservations found matching current filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected Booking Detail Panel */}
              {selectedBooking && (
                <div className="booking-detail-card">
                  <div className="detail-header">
                    <h3>Booking Details</h3>
                    <button
                      type="button"
                      className="close-detail"
                      onClick={() => setSelectedBooking(null)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="detail-body">
                    <div className="detail-row">
                      <span className="detail-label">Status</span>
                      <span className={`status-badge status-${selectedBooking.status}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Guest Name</span>
                      <strong>{selectedBooking.name}</strong>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email</span>
                      <a href={`mailto:${selectedBooking.email}`} className="contact-link">
                        {selectedBooking.email}
                      </a>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone</span>
                      <span>{selectedBooking.phone || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date</span>
                      <span>{selectedBooking.reservation_date}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Time</span>
                      <span>{selectedBooking.reservation_time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Party Size</span>
                      <span>{selectedBooking.guests} People</span>
                    </div>
                    <div className="detail-notes-box">
                      <span className="detail-label">Special Requests / Notes:</span>
                      <p>{selectedBooking.notes || 'None provided.'}</p>
                    </div>

                    <div className="detail-action-footer">
                      {selectedBooking.status !== 'confirmed' && (
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                        >
                          Confirm Booking
                        </button>
                      )}
                      {selectedBooking.status !== 'cancelled' && (
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                        >
                          Mark as Cancelled
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="admin-tab-content">
            <div className="section-toolbar">
              <div className="filter-pill-group">
                {[
                  { key: 'all', label: 'All Items' },
                  { key: 'hot', label: 'Hot Drinks' },
                  { key: 'cold', label: 'Cold Drinks' },
                  { key: 'food', label: 'Food' },
                  { key: 'treats', label: 'Sweet Treats' },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`filter-pill ${selectedCategory === c.key ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(c.key)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setEditingItem(null);
                  setMenuFormData({
                    name: '',
                    category: selectedCategory === 'all' ? 'hot' : selectedCategory,
                    desc: '',
                    price: '€3.50',
                  });
                  setIsAddMenuOpen(true);
                }}
              >
                + Add New Item
              </button>
            </div>

            {/* Menu Items Grid */}
            <div className="admin-menu-grid">
              {filteredMenu.map((item) => {
                const cat = item.category_slug || item.id.split('-')[0];
                const isAvail = item.is_available ?? item.available ?? true;
                const desc = item.desc || item.description || '';

                return (
                  <div
                    key={item.id}
                    className={`admin-menu-card ${!isAvail ? 'item-sold-out' : ''}`}
                  >
                    <div className="menu-card-top">
                      <span className="card-cat-badge">{cat.toUpperCase()}</span>
                      <span className="menu-card-price">{item.price || 'Counter Price'}</span>
                    </div>

                    <h4 className="item-title">{item.name}</h4>
                    <p className="item-desc">{desc}</p>

                    <div className="menu-card-footer">
                      <button
                        type="button"
                        className={`btn-stock-toggle ${isAvail ? 'in-stock' : 'sold-out'}`}
                        onClick={() => handleToggleAvailability(item)}
                      >
                        {isAvail ? '● In Stock' : '○ Sold Out'}
                      </button>

                      <div className="edit-buttons">
                        <button
                          type="button"
                          className="btn-icon-edit"
                          onClick={() => {
                            setEditingItem(item);
                            setMenuFormData({
                              name: item.name,
                              category: cat,
                              desc: desc,
                              price: item.price || '€3.50',
                            });
                            setIsAddMenuOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-icon-delete"
                          onClick={() => handleDeleteMenuItem(item.id, item.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredMenu.length === 0 && (
              <div className="empty-state">
                <p>No menu items found in this category.</p>
              </div>
            )}

            {/* Add / Edit Menu Item Modal */}
            {isAddMenuOpen && (
              <div className="modal-backdrop open" role="dialog" aria-modal="true">
                <div className="modal-dialog">
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => setIsAddMenuOpen(false)}
                  >
                    &times;
                  </button>
                  <div className="modal-header">
                    <p className="modal-label">MENU ITEM MANAGER</p>
                    <h3 className="modal-title">
                      {editingItem ? `Edit "${editingItem.name}"` : 'Add New Menu Item'}
                    </h3>
                  </div>

                  <form className="modal-form" onSubmit={handleSaveMenuItem}>
                    <div className="form-group">
                      <label htmlFor="itemName">Item Name *</label>
                      <input
                        type="text"
                        id="itemName"
                        required
                        value={menuFormData.name}
                        onChange={(e) =>
                          setMenuFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="e.g. Pistachio Croissant"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="itemCategory">Category *</label>
                        <select
                          id="itemCategory"
                          value={menuFormData.category}
                          onChange={(e) =>
                            setMenuFormData((prev) => ({ ...prev, category: e.target.value }))
                          }
                        >
                          <option value="hot">Hot Drinks</option>
                          <option value="cold">Cold Drinks</option>
                          <option value="food">Food</option>
                          <option value="treats">Sweet Treats</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="itemPrice">Display Price</label>
                        <input
                          type="text"
                          id="itemPrice"
                          value={menuFormData.price}
                          onChange={(e) =>
                            setMenuFormData((prev) => ({ ...prev, price: e.target.value }))
                          }
                          placeholder="e.g. €3.80"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="itemDesc">Description *</label>
                      <textarea
                        id="itemDesc"
                        required
                        rows={3}
                        value={menuFormData.desc}
                        onChange={(e) =>
                          setMenuFormData((prev) => ({ ...prev, desc: e.target.value }))
                        }
                        placeholder="Short description highlighting flavors and ingredients..."
                      />
                    </div>

                    <div className="modal-actions">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setIsAddMenuOpen(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-submit">
                        {editingItem ? 'Save Changes' : 'Add to Live Menu'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS & ANNOUNCEMENTS */}
        {activeTab === 'settings' && (
          <div className="admin-tab-content">
            <div className="settings-grid">
              <div className="admin-card">
                <h3>Today&apos;s Café Notice / Announcement</h3>
                <p className="card-subhead">
                  Displays a banner or special update to visitors across the website.
                </p>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label htmlFor="announcementText">Notice Message</label>
                  <textarea
                    id="announcementText"
                    rows={3}
                    value={announcement}
                    onChange={(e) => {
                      setAnnouncement(e.target.value);
                      setNoticeSaved(false);
                    }}
                  />
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setNoticeSaved(true);
                      showNotice('Announcement notice updated!');
                    }}
                  >
                    Save Notice
                  </button>
                  {noticeSaved && <span className="saved-indicator">✓ Saved</span>}
                </div>
              </div>

              <div className="admin-card">
                <h3>Backend & Database Connection</h3>
                <p className="card-subhead">
                  Status of Supabase PostgreSQL and authentication integration.
                </p>

                <div className="supabase-status-box">
                  <div className="status-row">
                    <span>Database Engine:</span>
                    <strong>Supabase (PostgreSQL)</strong>
                  </div>
                  <div className="status-row">
                    <span>Runtime Mode:</span>
                    <span className="badge-runtime">Local Dev Fallback & Supabase Ready</span>
                  </div>
                  <div className="status-row">
                    <span>Auth Provider:</span>
                    <strong>Manager Session (Supabase Auth Hook Ready)</strong>
                  </div>
                </div>

                <p className="config-hint">
                  To connect your remote Supabase instance, configure{' '}
                  <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
                  <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
