'use client';

import React from 'react';
import CoffeeSteam from './CoffeeSteam';

export default function OurStory() {
  return (
    <section className="story-section" id="about">
      <div className="container">
        <div className="story-grid">
          <div className="story-image-wrapper reveal">
            <img
              src="/images/latte-art.jpg"
              alt="Beautifully crafted latte art"
              loading="lazy"
            />
            <CoffeeSteam />
            <span className="story-image-label">Every cup, crafted.</span>
          </div>
          <div className="story-content">
            <p className="section-label reveal">OUR STORY</p>
            <h2 className="section-title reveal reveal-delay-1">
              A little break goes a long way.
            </h2>
            <p className="story-text reveal reveal-delay-2">
              Whether you&apos;re grabbing your morning coffee, meeting someone for a chat,
              or treating yourself to something tasty — So Coffee is here for the little
              moments that make the day better.
            </p>
            <p className="story-text reveal reveal-delay-3">
              We keep it simple: great drinks, honest food, and a genuinely warm welcome.
              No fuss. Just good coffee and good company.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
