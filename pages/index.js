import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>
      <h2>Login or Register to dejumble your brain.</h2>
    </Layout>
  )
}