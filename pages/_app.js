import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';

import { Analytics } from '@vercel/analytics/react';

// import { useSession } from 'next-auth/react';

import Script from 'next/script';
import { useEffect } from 'react';

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    // const { data: authSession, status } = useSession();

    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
            <Analytics />
        </SessionProvider>
    )
}
