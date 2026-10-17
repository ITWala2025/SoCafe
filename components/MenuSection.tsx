'use client';

import React, { useState, useEffect } from 'react';
import {
  MENU_CATEGORIES,
  INITIAL_MENU_DATA,
  type MenuCategoryKey,
  type MenuItemData,
} from '@/data/menu';

interface MenuSectionProps {
  activeTab: MenuCategoryKey;
  onTabChange: (tab: MenuCategoryKey) => void;
}

export default function MenuSection({
  activeTab,
  onTabChange,
}: MenuSectionProps) {
  const [menuData, setMenuData] =
    useState<Record<MenuCategoryKey, MenuItemData[]>>(INITIAL_MENU_DATA);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Optionally fetch live menu data from Supabase backend API
    fetch('/api/menu')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setMenuData(json.data);
        }
      })
      .catch((err) => {
        console.log('Using default static menu items:', err);
      });
  }, []);

  const handleTabClick = (tab: MenuCategoryKey) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      onTabChange(tab);
      setIsTransitioning(false);
    }, 180);
  };

  const currentItems = menuData[activeTab] || [];

  return (
    <section className="menu-section" id="menu">
      <div className="container">
        <div className="menu-header">
          <p className="section-label reveal">WHAT WE SERVE</p>
          <h2 className="section-title reveal reveal-delay-1">
            Find your favourite.
          </h2>
          <p className="menu-subtitle reveal reveal-delay-2">
            Prices will be listed at the counter. Items may vary — ask our team for today&apos;s selection.
          </p>
        </div>

        <div className="menu-tabs reveal reveal-delay-2">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`menu-tab ${activeTab === cat.key ? 'active' : ''}`}
              onClick={() => handleTabClick(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div
          className="menu-grid"
          id="menuGrid"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          {currentItems.map((item, index) => (
            <div key={`${item.name}-${index}`} className="menu-card">
              <div className="menu-card-header">
                <h3 className="menu-card-name">{item.name}</h3>
                <span className="menu-card-icon"></span>
              </div>
              <p className="menu-card-desc">{item.desc}</p>
              {item.price && <span className="menu-card-price">{item.price}</span>}
            </div>
          ))}
        </div>

        <p className="menu-note reveal">
          Menu is subject to availability. Please ask our friendly team about allergens.
        </p>
      </div>
    </section>
  );
}
