import Head from 'next/head';
import Image from 'next/image';

import Layout, { siteTitle } from '../components/layout';
import Login from '../components/login';

import textLogo from '../public/dejumbler-text-logo.png';
import styles from '../styles/Home.module.css';

import { useSession } from 'next-auth/react';


export default function Home() {
    const session = useSession();

    if (!session.data) {
        return (
            <>
                <Head>
                    <title>{siteTitle}</title>
                    <meta name="description" content="Clean your brain out with the Dejumbler." />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="google-site-verification" content="n5dZdc1QljJ4k39BSCkZAbhnJS5CjIdAo6OHVqD_c-Y" />
                </Head>
                <div className={styles.container}>
                    <Image className={styles.textLogo} src={textLogo} alt="Dejumbler text logo" />
                    <h2 className={styles.description}>The Dejumbler is a platform that helps you use lists to manage the media you consume.</h2>
                    <Login />
                </div>
            </>
        )
    }

    return (
        <Layout>
            <h2>Hi {session.data.user.name}. Make lists.</h2>
        </Layout>
    );
}