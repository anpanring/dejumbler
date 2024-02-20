import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';

import { Analytics } from '@vercel/analytics/react';

import Script from 'next/script';
import { useEffect } from 'react';

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    // const { data: authSession, status } = useSession();
    // useEffect(() => {
    //     if(session) {
    //         const theme = localStorage.getItem('theme');
    //         console.log("BEEEP ", theme);
    //         if (theme) {
    //             document.documentElement.setAttribute('data-theme', theme);
    //         }
    //     }
    // })

    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
            <Analytics />
            {session && <Script id={'set-theme'}>
                {`
                    const theme = localStorage.getItem('theme');
                    console.log("BEEEP ", theme);
                    if(theme) {
                        document.documentElement.setAttribute('data-theme', theme);
                    }
                `}
            </Script>}
        </SessionProvider>
    )
}
