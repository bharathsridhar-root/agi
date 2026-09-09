import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <>
      <Head>
        <title>Constitutional AI Governance Platform</title>
        <meta name="description" content="Interactive governance framework for safe, coordinated AI development" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Constitutional AI Platform" />
        <meta property="og:description" content="Transparent, distributed governance for AI systems" />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
