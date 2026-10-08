import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import ProblemSection from '../components/ProblemSection.jsx';
import HowItWorksSection from '../components/HowItWorksSection.jsx';
import FeaturesSection from '../components/FeaturesSection.jsx';
import WhySection from '../components/WhySection.jsx';
import CtaSection from '../components/CtaSection.jsx';
import Footer from '../components/Footer.jsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <WhySection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
