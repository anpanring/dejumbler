import Footer from './footer';
import styles from './layout.module.css';
import Link from 'next/link';
import Login from './login';
import Loading from './loading';
import Head from 'next/head';
import Image from 'next/image';
import textLogo from '../public/dejumbler-text-logo.png';
import { Suspense } from 'react';
import Navbar from './navbar';
import svgLogo from '../public/logo.svg';

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
                    <h1 className={styles.dejumblerTitle}>DEJUMBLER</h1>
                    {/* <Image className={styles.textLogo} src={textLogo} alt="Dejumbler text logo" /> */}
                    <Login />
                </div>
                {/* <div id="hd"> */}
                {/* <img src="/dejumbler-text-logo.png" className={styles.dejumblerTitle}></img> */}
                {/* </div> */}
                <Navbar />
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
            </div>
            {/* <Footer className={styles.footer} /> */}
        </div>
    );
}