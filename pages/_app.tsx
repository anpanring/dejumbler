import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { useEffect } from 'react';

import { QueryParamProvider } from 'use-query-params';
import { NextAdapter } from 'next-query-params';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const getLayout = Component.getLayout ?? ((page) => page);

  // runs on every page!!
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const accent = localStorage.getItem('accent');
    const font = localStorage.getItem('font');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.setProperty('--accent-color', accent);
      document.documentElement.style.setProperty('--secondary-font', font);
    }
  });

  return (
    <SessionProvider session={session}>
      <QueryParamProvider adapter={NextAdapter}>
        <Component {...pageProps} />
        <Analytics />
        <SpeedInsights />
      </QueryParamProvider>
    </SessionProvider>
  );
}
