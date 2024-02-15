import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    // const { data: authSession, status } = useSession();

    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
            <Analytics />
            <Script id={'set-theme'}>
                {`
                    const theme = localStorage.getItem('theme');
                    if(theme) {
                        document.documentElement.setAttribute('data-theme', theme);
                    }
                `}
            </Script>
        </SessionProvider>
    )
}
