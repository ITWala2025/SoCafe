'use client';

import React, { useEffect, useRef } from 'react';

export default function Hero() {
  const bgImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (bgImgRef.current && scrollY < window.innerHeight) {
        bgImgRef.current.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const targetPosition =
        el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <img
          ref={bgImgRef}
          src="/images/hero-bg.jpg"
          alt="So Coffee café interior"
          loading="eager"
        />
      </div>
      <div className="hero-content">
        <p className="hero-label">
          <span className="pin">📍</span> LUCAN COMMUNITY CENTRE, IRELAND
        </p>
        <h1 className="hero-title">
          Coffee,<br />
          <em>comfort</em><br />
          <span className="ampersand">&</span> good food.
        </h1>
        <p className="hero-description">
          A cosy little café inside Lucan Community Centre — serving great coffee,
          tasty bites and something for every kind of coffee break.
        </p>
        <div className="hero-buttons">
          <button
            type="button"
            className="btn-primary"
            onClick={() => scrollTo('menu')}
          >
            View Our Menu
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => scrollTo('visit')}
          >
            Find Us
          </button>
        </div>
      </div>
      <div className="scroll-indicator">
        <span className="line"></span>
        <span className="text">SCROLL</span>
      </div>
    </section>
  );
}
