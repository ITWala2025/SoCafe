'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/auth/admin';
import Link from 'next/link';

export default function AdminLoginPage() {
  const { user, login } = useAdminAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push('/admin');
    } else {
      setErrorMsg(res.error || 'Authentication failed');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@socoffee.ie');
    setPassword('coffee123');
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <Link href="/" className="nav-logo admin-logo">
            So Coffee
          </Link>
          <span className="admin-badge">MANAGER PORTAL</span>
          <h2>Café Administration</h2>
          <p>Sign in to manage the daily menu, bookings, and customer reservations.</p>
        </div>

        {errorMsg && (
          <div className="admin-alert-error" role="alert">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="adminEmail">Manager Email</label>
            <input
              type="email"
              id="adminEmail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@socoffee.ie"
            />
          </div>

          <div className="form-group">
            <label htmlFor="adminPassword">Password</label>
            <input
              type="password"
              id="adminPassword"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="demo-credentials-banner">
            <div>
              <strong>Demo Credentials:</strong>
              <p>Email: admin@socoffee.ie | Pass: coffee123</p>
            </div>
            <button
              type="button"
              className="btn-fill-demo"
              onClick={handleFillDemo}
            >
              Fill Demo
            </button>
          </div>

          <button
            type="submit"
            className="btn-submit admin-btn-login"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In to Dashboard →'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link href="/" className="back-link">
            ← Return to So Coffee Website
          </Link>
          <p className="note-text">
            Ready for Supabase Auth integration via <code>supabase.auth.signInWithPassword</code>
          </p>
        </div>
      </div>
    </div>
  );
}
