import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0e14" />
        <meta property="og:title" content="Constitutional AI Governance Platform" />
        <meta
          property="og:description"
          content="How failures cascade between AI-managed systems — and how five constitutional safeguards change the outcome."
        />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
