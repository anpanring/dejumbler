import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import Router from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Layout from '../components/layout';
import Loading from '../components/loading';

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    const [loading, setLoading] = useState(false);
    // const { data, status } = useSession();
    useEffect(() => {
        const start = () => {
            console.log("start");
            setLoading(true);
        };
        const end = () => {
            console.log("findished");
            setLoading(false);
        };
        Router.events.on("routeChangeStart", start);
        Router.events.on("routeChangeComplete", end);
        Router.events.on("routeChangeError", end);
        return () => {
            Router.events.off("routeChangeStart", start);
            Router.events.off("routeChangeComplete", end);
            Router.events.off("routeChangeError", end);
        };
    }, []);

    return (
        <SessionProvider session={session}>
            {loading ? <h1>Loading...</h1> :
                <Component {...pageProps} />}
            <Analytics />
        </SessionProvider>
    )
}
