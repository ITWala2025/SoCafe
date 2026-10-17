'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import Link from 'next/link';
import {
  MENU_CATEGORIES,
  INITIAL_MENU_DATA,
  type MenuCategoryKey,
  type MenuItemData,
} from '@/data/menu';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<MenuCategoryKey>('hot');
  const [menuData, setMenuData] =
    useState<Record<MenuCategoryKey, (MenuItemData & { available?: boolean })[]>>(INITIAL_MENU_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setMenuData(json.data);
        }
      })
      .catch((err) => console.log('Loaded static menu:', err));
  }, []);

  const currentCategoryItems = menuData[activeTab] || [];

  const filteredItems = searchQuery
    ? Object.values(menuData)
        .flat()
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : currentCategoryItems;

  return (
    <>
      <ScrollRevealInit />
      <Navbar />
      <main className="page-wrapper">
        <section className="page-hero">
          <div className="container">
            <p className="section-label">FRESHLY CRAFTED EVERY DAY</p>
            <h1 className="page-hero-title">What We Serve</h1>
            <p className="page-hero-desc">
              From locally roasted espresso blends to artisanal lunch bites and
              warm baked pastries — explore everything prepared at our counter
              inside Lucan Community Centre.
            </p>
          </div>
        </section>

        <section className="page-content-section">
          <div className="container">
            {/* Search & Tabs */}
            <div className="menu-controls">
              <div className="menu-search-wrapper">
                <input
                  type="text"
                  className="menu-search-input"
                  placeholder="Search coffee, tea, pastries, wraps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="menu-search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>

              {!searchQuery && (
                <div className="menu-tabs">
                  {MENU_CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      className={`menu-tab ${activeTab === cat.key ? 'active' : ''}`}
                      onClick={() => setActiveTab(cat.key)}
                    >
                      {cat.label} ({menuData[cat.key]?.length || 0})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {searchQuery && (
              <p className="search-status-text">
                Showing results for &ldquo;{searchQuery}&rdquo; ({filteredItems.length} items found)
              </p>
            )}

            {/* Menu Cards */}
            <div className="menu-grid" id="menuGrid">
              {filteredItems.map((item, index) => (
                <div key={`${item.name}-${index}`} className="menu-card">
                  <div className="menu-card-header">
                    <h3 className="menu-card-name">{item.name}</h3>
                    {item.price ? (
                      <span className="menu-item-price-tag">{item.price}</span>
                    ) : (
                      <span className="menu-card-icon"></span>
                    )}
                  </div>
                  <p className="menu-card-desc">{item.desc}</p>
                  {item.available === false && (
                    <span className="sold-out-badge">Sold Out Today</span>
                  )}
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="empty-state">
                <p>No menu items matched your search query.</p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Allergen & Dietary Information */}
            <div className="dietary-callout reveal">
              <div className="callout-icon">🌱</div>
              <div className="callout-content">
                <h4>Allergen & Milk Alternatives Notice</h4>
                <p>
                  We offer Oat Milk and Almond Milk upon request. Gluten-free
                  pastry options and vegetarian savory bites are regularly in
                  stock. Please inform our baristas of any dietary restrictions
                  or allergies prior to ordering.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="menu-page-cta reveal">
              <h3>Planning a visit with friends or a group?</h3>
              <p>Reserve a table or ask about space for your club meetup.</p>
              <div className="cta-buttons">
                <Link href="/book" className="btn-primary">
                  Reserve a Space
                </Link>
                <Link href="/visit" className="btn-secondary">
                  Get Directions
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
