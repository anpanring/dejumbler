import Head from 'next/head';
import Image from 'next/image';

import Layout, { siteTitle } from '../components/layout';
import Login from '../components/login';

import textLogo from '../public/images/dejumbler-text-logo.png';
import styles from '../styles/Home.module.css';

import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from "./api/auth/[...nextauth]";


export default function Home() {
    // check session (client-side)
    const session = useSession();

    // logged out page
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
                    <Image src={textLogo} className={styles.textLogo} alt="Dejumbler text logo" />
                    <h2 className={styles.description}>The Dejumbler is a platform that helps you use lists to manage the media you consume.</h2>
                    <Login />
                </div>
            </>
        )
    }

    // logged in page
    return (
        <Layout>
            <Head>
                <title>Home - Dejumbler</title>
            </Head>
            <h2>Hi {session.data.user.name}. Make lists.</h2>
        </Layout>
    );
}

// check login server-side to prevent flashing login page
export async function getServerSideProps(context) {
    return {
        props: {
            session: await getServerSession(
                context.req,
                context.res,
                authOptions
            )
        }
    }
}