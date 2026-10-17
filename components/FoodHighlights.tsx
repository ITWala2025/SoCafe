'use client';

import React from 'react';
import type { MenuCategoryKey } from '@/data/menu';

interface FoodHighlightsProps {
  onSelectCategory: (cat: MenuCategoryKey) => void;
}

const HIGHLIGHTS: {
  title: string;
  subtitle: string;
  img: string;
  category: MenuCategoryKey;
  delayClass: string;
}[] = [
  {
    title: 'Coffee & Pastries',
    subtitle: 'Start the day right.',
    img: '/images/coffee-pastries.jpg',
    category: 'hot',
    delayClass: 'reveal',
  },
  {
    title: 'Sweet Treats',
    subtitle: 'Because you deserve it.',
    img: '/images/sweet-treats.jpg',
    category: 'treats',
    delayClass: 'reveal reveal-delay-1',
  },
  {
    title: 'Light Bites',
    subtitle: 'Fresh, simple, satisfying.',
    img: '/images/light-bites.jpg',
    category: 'food',
    delayClass: 'reveal reveal-delay-2',
  },
  {
    title: 'Cold Drinks',
    subtitle: 'Refresh & recharge.',
    img: '/images/cold-drinks.jpg',
    category: 'cold',
    delayClass: 'reveal reveal-delay-3',
  },
];

export default function FoodHighlights({ onSelectCategory }: FoodHighlightsProps) {
  const handleClick = (cat: MenuCategoryKey) => {
    onSelectCategory(cat);
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      const offset = 80;
      const targetPosition =
        menuEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="food-section" id="food">
      <div className="container">
        <div className="food-header">
          <p className="section-label reveal">FOOD & DRINK</p>
          <h2 className="section-title reveal reveal-delay-1">
            Something tasty, whenever you need it.
          </h2>
        </div>
        <div className="food-grid">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className={`food-card ${item.delayClass}`}
              onClick={() => handleClick(item.category)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(item.category);
                }
              }}
            >
              <div className="food-card-image">
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                />
              </div>
              <h3 className="food-card-title">{item.title}</h3>
              <p className="food-card-subtitle">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
