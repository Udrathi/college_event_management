import { ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="gradient-primary py-6 text-center text-primary-foreground/70 text-sm">
        © 2026 CampusEvents. College Event Management System.
      </footer>
    </div>
  );
}
