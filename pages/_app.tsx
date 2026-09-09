import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f8fa" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0e14" />
        <meta property="og:title" content="Constitutional AI Governance Platform" />
        <meta
          property="og:description"
          content="How failures spread between AI-managed systems, and how five safeguards change what happens."
        />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
