import Footer from './footer';
import styles from './layout.module.css';
import Link from 'next/link';
import Login from './login';
import Loading from './loading';
import Head from 'next/head';
import Image from 'next/image';
import textLogo from '../public/images/dejumbler-text-logo.png';
import smallLogo from '../public/images/dejumbler-logo.png';
import { Suspense } from 'react';
import Navbar from './navbar';
import svgLogo from '../public/images/dejumbler-logo.svg';

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
                    {/* <h1 className={styles.dejumblerTitle}>DEJUMBLER</h1> */}
                    {/* <Image className={styles.smallLogo} src={svgLogo} alt="Dejumbler logo" width={50} height={50} /> */}
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