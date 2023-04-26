import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout, { siteTitle } from '../components/layout'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import textLogo from '../public/dejumbler-text-logo.png';
import Login from '../components/login'

export default function Home() {
    const session = useSession();

    if (!session.data) {
        return (
            <div className={styles.container}>
                <Image className={styles.textLogo} src={textLogo} alt="Dejumbler text logo" />
                <h2 className={styles.description}>The Dejumbler is a platform that helps you use lists to manage the media you consume.</h2>
                <Login />
            </div>
        )
    }

    return (
        <Layout>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <h2>Hi {session.data.user.name}. Make lists.</h2>
        </Layout>
    );
}