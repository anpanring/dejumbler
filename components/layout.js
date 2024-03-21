import { createContext, Suspense, useState } from 'react';

import Head from 'next/head';

import Loading from './loading';
import Login from './login';
import Navbar from './navbar';
import Modal from './modal';

import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

import styles from './layout.module.css';

import useWindowSize from '../lib/useWindowSize';
export const WindowSizeContext = createContext(null);

export const siteTitle = 'Dejumbler';
export default function Layout({ children }) {
    const [width, height] = useWindowSize();

    function changeMode() {
        const color = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', color);
        localStorage.setItem('theme', color);
    }

    return (
        <WindowSizeContext.Provider value={{ width, height }}>
            <div className={styles.wrapper}>
                <div className={styles.flexContainer}>
                    <Head>
                        <meta name="description" content="Clean your brain out with the Dejumbler." />
                        <meta name="og:title" content={siteTitle} />
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="google-site-verification" content="n5dZdc1QljJ4k39BSCkZAbhnJS5CjIdAo6OHVqD_c-Y" />
                    </Head>

                    <Navbar changeMode={changeMode} />
                    <Suspense fallback={<Loading />}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </WindowSizeContext.Provider>
    );
}