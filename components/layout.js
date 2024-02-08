import { Suspense } from 'react';

import Head from 'next/head';

import Loading from './loading';
import Login from './login';
import Navbar from './navbar';

import styles from './layout.module.css';

export const siteTitle = 'Dejumbler';
export default function Layout({ children }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.flexContainer}>
                <Head>
                    <meta name="description" content="Clean your brain out with the Dejumbler." />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="google-site-verification" content="n5dZdc1QljJ4k39BSCkZAbhnJS5CjIdAo6OHVqD_c-Y" />
                </Head>
                <div className={styles.statusBar}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 283.5" className={styles.smallLogo}>
                        <path
                            d="M0 0v283.5h283.5V0H0Zm221.55 108.55h-16v-40h16v40Z"
                            style={{
                                strokeWidth: 0,
                            }}
                        />
                    </svg>
                    <Login />
                </div>
                <Navbar />
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
            </div>
            {/* <Footer className={styles.footer} /> */}
        </div>
    );
}