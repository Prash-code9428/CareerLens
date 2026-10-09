import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 group-hover:border-emerald-400 group-hover:bg-emerald-100 transition-all shadow-xs">
              <Compass className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              CareerLens
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600" aria-label="Main Navigation">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('why-careerlens')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Why CareerLens
            </button>
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/opportunities"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>Opportunities</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-white border border-stone-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 shadow-2xs transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-xs"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-stone-100 border border-stone-200"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-md">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-stone-50 hover:text-emerald-700"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-stone-50 hover:text-emerald-700"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('why-careerlens')}
              className="text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-stone-50 hover:text-emerald-700"
            >
              Why CareerLens
            </button>
          </div>
          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-rose-600 bg-white border border-stone-200 hover:bg-rose-50"
                >
                  Logout ({user?.name})
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-stone-50 border border-stone-200 hover:bg-stone-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
