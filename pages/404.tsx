import React from 'react';
import Head from 'next/head';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Section, LinkButton } from '@/components/ui/Primitives';
import { IconArrowRight } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found — CAIGP</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Navigation />
      <main id="main">
        <Section className="pt-40">
          <p className="eyebrow mb-4">Error 404</p>
          <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-ink-primary sm:text-[42px]">
            That page does not exist
          </h1>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-ink-secondary">
            The link may be out of date. Everything on this site is reachable from the home page.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <LinkButton href="/" size="md">
              Back to the home page
              <IconArrowRight size={15} />
            </LinkButton>
            <LinkButton href="/framework" variant="secondary" size="md">
              Framework reference
            </LinkButton>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
