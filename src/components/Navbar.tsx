import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, LogOut, Menu, X, GraduationCap } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = isAuthenticated
    ? user?.role === 'admin'
      ? [
          { to: '/admin', label: 'Dashboard' },
          { to: '/events', label: 'Events' },
          { to: '/admin/create', label: 'Create Event' },
          { to: '/analytics', label: 'Analytics' },
        ]
      : [
          { to: '/student', label: 'Dashboard' },
          { to: '/events', label: 'Browse Events' },
        ]
    : [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 gradient-primary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground font-bold text-xl">
            <GraduationCap className="h-7 w-7" />
            <span>CampusEvents</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-primary-foreground/80">{user?.name}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleLogout}
                  className="gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => navigate('/login')}>Login</Button>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate('/signup')}>Sign Up</Button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-primary-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.to)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-primary-foreground/80 hover:bg-primary-foreground/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 mt-3 px-3">
              <button onClick={toggleTheme} className="p-2 rounded-md text-primary-foreground/80 hover:bg-primary-foreground/10">
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              {isAuthenticated ? (
                <Button size="sm" variant="secondary" onClick={handleLogout} className="gap-1">
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="secondary" onClick={() => { navigate('/login'); setMobileOpen(false); }}>Login</Button>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { navigate('/signup'); setMobileOpen(false); }}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
