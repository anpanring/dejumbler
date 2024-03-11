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
    useEffect(() => {
        // if (session) {
        const theme = localStorage.getItem('theme');
        const accent = localStorage.getItem('accent');
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.style.setProperty("--accent-color", accent);
        }
        // }
    })

    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
            <Analytics />
        </SessionProvider>
    )
}
