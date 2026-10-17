'use client';

import React from 'react';

export default function Community() {
  return (
    <section className="community-section" id="community">
      <div className="container">
        <div className="community-grid">
          <div className="community-content">
            <p className="section-label reveal">COMMUNITY</p>
            <h2 className="section-title reveal reveal-delay-1">
              More than just a coffee stop.
            </h2>
            <p className="community-text reveal reveal-delay-2">
              Located inside Lucan Community Centre, So Coffee is part of the
              everyday rhythm of the local community — a welcoming place to pause,
              catch up and enjoy something good.
            </p>
            <p className="community-text reveal reveal-delay-3">
              Whether you&apos;re here for a class, a meeting, or just passing through —
              there&apos;s always a warm cup and a friendly face waiting for you.
            </p>
            <div className="community-quote reveal reveal-delay-4">
              <div className="community-quote-icon">🌿</div>
              <p className="community-quote-text">
                &ldquo;Your little coffee stop in Lucan.&rdquo;
              </p>
            </div>
          </div>
          <div className="community-image-wrapper reveal">
            <img
              src="/images/community.jpg"
              alt="Community enjoying coffee together"
              loading="lazy"
            />
            <div className="community-location-tag">
              <span className="pin">📍</span> Lucan Community Centre
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
