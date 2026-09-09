import React from 'react';
import Head from 'next/head';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import Cascade from '@/components/sections/Cascade';
import ComicSection from '@/components/sections/ComicSection';
import SimulatorSection from '@/components/sections/SimulatorSection';
import StorySection from '@/components/sections/StorySection';
import Principles from '@/components/sections/Principles';
import CTA from '@/components/sections/CTA';

export default function Home() {
  return (
    <>
      <Head>
        <title>Constitutional AI Governance Platform</title>
        <meta
          name="description"
          content="An interactive model of how one failure spreads between AI-managed systems across finance, healthcare, manufacturing and infrastructure, and how five safeguards change what happens."
        />
      </Head>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-accent-on"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <ComicSection />
        <Cascade />
        <SimulatorSection />
        <StorySection />
        <Principles />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
