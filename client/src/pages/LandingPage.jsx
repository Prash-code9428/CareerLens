import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import HowItWorksSection from '../components/HowItWorksSection.jsx';
import FeaturesSection from '../components/FeaturesSection.jsx';
import WhySection from '../components/WhySection.jsx';
import CtaSection from '../components/CtaSection.jsx';
import Footer from '../components/Footer.jsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans antialiased">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorksSection />
        <FeaturesSection />
        <WhySection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

