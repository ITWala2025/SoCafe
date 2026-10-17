'use client';

import React, { useEffect, useRef } from 'react';

interface CoffeeSteamProps {
  className?: string;
}

export default function CoffeeSteam({ className = '' }: CoffeeSteamProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Handle high DPI
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Pause when offscreen
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    io.observe(container);

    // Particle system for volumetric smoke puffs
    interface SmokeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      maxAlpha: number;
      life: number;
      maxLife: number;
      spin: number;
      angle: number;
      driftPhase: number;
      driftSpeed: number;
      curlAmp: number;
    }

    const particles: SmokeParticle[] = [];
    const maxParticles = 38;

    const createParticle = (): SmokeParticle => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Coffee cup center is roughly x: 49%, y: 50%
      // Coffee surface radius: ~22% of width
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (w * 0.20);
      const startX = w * 0.49 + Math.cos(angle) * dist;
      const startY = h * 0.51 + Math.sin(angle) * dist * 0.85;

      const maxLife = 140 + Math.random() * 80;

      return {
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.55 + Math.random() * 0.65),
        radius: 10 + Math.random() * 12,
        maxRadius: 45 + Math.random() * 40,
        alpha: 0,
        maxAlpha: 0.12 + Math.random() * 0.10,
        life: 0,
        maxLife,
        spin: (Math.random() - 0.5) * 0.015,
        angle: Math.random() * Math.PI * 2,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.018 + Math.random() * 0.02,
        curlAmp: 0.4 + Math.random() * 0.6,
      };
    };

    // Pre-populate particles with varying life
    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      // Advance position
      const progress = p.life / p.maxLife;
      p.y += p.vy * p.life;
      p.radius += (p.maxRadius - p.radius) * progress;
      particles.push(p);
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Spawn new particles if below limit
      if (particles.length < maxParticles && Math.random() < 0.6 * dt) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;

        if (p.life >= p.maxLife || p.y < -p.radius * 2) {
          particles[i] = createParticle();
          continue;
        }

        const progress = p.life / p.maxLife;

        // Alpha envelope: fade in quickly, sustain, then fade out smoothly
        if (progress < 0.2) {
          p.alpha = (progress / 0.2) * p.maxAlpha;
        } else {
          p.alpha = (1 - (progress - 0.2) / 0.8) * p.maxAlpha;
        }

        // Rising & curling movement
        p.driftPhase += p.driftSpeed * dt;
        p.x += (Math.sin(p.driftPhase) * p.curlAmp + p.vx) * dt;
        p.y += p.vy * dt;
        p.angle += p.spin * dt;

        // Gradual expansion
        const currentRadius = p.radius + (p.maxRadius - p.radius) * Math.pow(progress, 0.7);

        // Draw soft misty smoke puff
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
        // Warm white / delicate steam hue
        grad.addColorStop(0, `rgba(255, 250, 242, ${p.alpha * 1.2})`);
        grad.addColorStop(0.35, `rgba(255, 248, 240, ${p.alpha * 0.75})`);
        grad.addColorStop(0.7, `rgba(250, 245, 238, ${p.alpha * 0.28})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`coffee-steam-container ${className}`}
      aria-hidden="true"
    >
      {/* Canvas for volumetric organic smoke puffs */}
      <canvas ref={canvasRef} className="coffee-steam-canvas" />

      {/* SVG for fine rising wisps and tendrils */}
      <svg
        className="coffee-steam-svg"
        viewBox="0 0 400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="steamGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="65%" stopColor="#fff8f0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="steamGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="30%" stopColor="#fff9f2" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="steamBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="steamBlurSoft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* Wisp 1: Center-left curling stream */}
        <path
          className="steam-wisp steam-wisp-1"
          d="M 185 340 Q 170 280 195 220 T 180 140 T 195 60"
          stroke="url(#steamGrad1)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#steamBlur)"
        />

        {/* Wisp 2: Main central upward spiral */}
        <path
          className="steam-wisp steam-wisp-2"
          d="M 200 350 Q 225 290 195 210 T 215 120 T 190 40"
          stroke="url(#steamGrad2)"
          strokeWidth="18"
          strokeLinecap="round"
          filter="url(#steamBlurSoft)"
        />

        {/* Wisp 3: Right curling tendril */}
        <path
          className="steam-wisp steam-wisp-3"
          d="M 220 345 Q 240 270 215 190 T 235 110 T 210 30"
          stroke="url(#steamGrad1)"
          strokeWidth="12"
          strokeLinecap="round"
          filter="url(#steamBlur)"
        />

        {/* Wisp 4: Left outer delicate curl */}
        <path
          className="steam-wisp steam-wisp-4"
          d="M 165 355 Q 140 295 170 230 T 150 150 T 175 70"
          stroke="url(#steamGrad2)"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#steamBlur)"
        />

        {/* Wisp 5: Secondary right gentle breeze */}
        <path
          className="steam-wisp steam-wisp-5"
          d="M 235 360 Q 260 300 230 235 T 250 145 T 225 65"
          stroke="url(#steamGrad1)"
          strokeWidth="11"
          strokeLinecap="round"
          filter="url(#steamBlur)"
        />
      </svg>
    </div>
  );
}
