import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getUsers, initializeData } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (name: string, email: string, password: string, role: 'student' | 'admin') => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeData();
    const saved = localStorage.getItem('ems_current_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('ems_current_user', JSON.stringify(found));
      return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = (name: string, email: string, password: string, role: 'student' | 'admin') => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      password,
      role,
    };
    users.push(newUser);
    localStorage.setItem('ems_users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('ems_current_user', JSON.stringify(newUser));
    return { success: true, message: 'Account created!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ems_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
