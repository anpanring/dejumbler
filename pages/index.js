import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout, { siteTitle } from '../components/layout'
import { useSession } from 'next-auth/react'


export default function Home() {
    const session = useSession();

    const homeMessage = session.data
        ? <h2>Hi {session.data.user.name}. Make lists.</h2>
        : <h2>The Dejumbler is a platform that helps you use lists to manage the media you consume. Login or Register to dejumble your brain.</h2>

    return (
        <Layout>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            {homeMessage}
        </Layout>
    );
}