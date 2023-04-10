import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'
import { useSession } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const session = useSession();

    const homeMessage = session.data
        ? <h2>Hi {session.data.user.name}. Make lists.</h2>
        : <h2>Login or Register to dejumble your brain.</h2>

    return (
        <Layout>
            <Head>
                <title>Home</title>
            </Head>
            {homeMessage}
        </Layout>
    );
}