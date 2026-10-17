'use client';

import React from 'react';

export default function EveryCup() {
  return (
    <section className="every-cup-section">
      <div className="every-cup-bg">
        <img
          src="/images/slow-moments.jpg"
          alt="Cosy café atmosphere"
          loading="lazy"
        />
      </div>
      <div className="every-cup-content">
        <p className="every-cup-label reveal">EVERY CUP</p>
        <h2 className="every-cup-title reveal reveal-delay-1">
          Made for<br />
          <em>slow moments</em>
        </h2>
        <p className="every-cup-text reveal reveal-delay-2">
          From your first coffee of the morning to an afternoon pick-me-up — find
          your favourite drink and make yourself comfortable.
        </p>
      </div>
    </section>
  );
}
