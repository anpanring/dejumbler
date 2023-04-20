import Footer from './footer';
import styles from './layout.module.css';
import Link from 'next/link';
import Login from './login';
import Head from 'next/head';

export const siteTitle = 'Dejumbler';

export default function Layout({ children }) {
    return (
        <div className={styles.wrapper}>
            <Head>
                <meta name="description" content={siteTitle} />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="google-site-verification" content="n5dZdc1QljJ4k39BSCkZAbhnJS5CjIdAo6OHVqD_c-Y" />
            </Head>
            <div className={styles.statusBar}>
                <h1 className={styles.dejumblerTitle}>DEJUMBLER</h1>
                <Login />
            </div>
            {/* <div id="hd"> */}
            {/* <img src="/dejumbler-text-logo.png" className={styles.dejumblerTitle}></img> */}
            {/* </div> */}
            <div className={styles.navbar}>
                <Link href="/">Home</Link> |
                <Link href="/all-lists">All Lists</Link> |
                <Link href="/create-list">Create a New List</Link>
            </div>
            <div>
                {children}
            </div>
            {/* <Footer /> */}
        </div>
    );
}