import React from 'react';
import Hero from '@/components/sections/Hero';
import Framework from '@/components/sections/Framework';
import Scenarios from '@/components/sections/Scenarios';
import Principles from '@/components/sections/Principles';
import Defense from '@/components/sections/Defense';
import CTA from '@/components/sections/CTA';
import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <Navigation />
      <Hero />
      <Framework />
      <Scenarios />
      <Principles />
      <Defense />
      <CTA />
    </main>
  );
}
