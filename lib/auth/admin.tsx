'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  email: string;
  role: string;
  name: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check saved session
    try {
      const stored = localStorage.getItem('socoffee_admin_session');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Demo credentials / Mock check (Supabase Auth swap point)
    // Later: const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (
      (email.trim().toLowerCase() === 'admin@socoffee.ie' && pass === 'coffee123') ||
      (email.trim() && pass.length >= 6) // allows custom admin testing
    ) {
      const adminUser: AdminUser = {
        email: email.trim(),
        role: 'manager',
        name: 'Café Manager',
      };
      setUser(adminUser);
      localStorage.setItem('socoffee_admin_session', JSON.stringify(adminUser));
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Demo login: admin@socoffee.ie / coffee123',
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('socoffee_admin_session');
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
