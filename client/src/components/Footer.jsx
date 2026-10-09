import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-stone-100 border-t border-stone-200/90 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100/80 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900">CareerLens</span>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Intelligent job and internship discovery designed for students. Find opportunities that fit your background with clear match insights.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('why-careerlens')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Why CareerLens
                </button>
              </li>
            </ul>
          </div>

          {/* Platform / Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Account
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="hover:text-emerald-700 transition-colors font-medium text-emerald-700">
                  Get Started →
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-700 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CareerLens. All rights reserved.</p>
          <p>Designed for student placement preparation & career discovery.</p>
        </div>
      </div>
    </footer>
  );
}

