import { Suspense, useState } from 'react';

import Head from 'next/head';

import Loading from './loading';
import Login from './login';
import Navbar from './navbar';
import Modal from './modal';

import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

import styles from './layout.module.css';

export const siteTitle = 'Dejumbler';
export default function Layout({ children }) {
    const { data, status } = useSession();
    const [showProfile, setShowProfile] = useState(false);

    function changeMode() {
        const color = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', color);
        localStorage.setItem('theme', color);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.flexContainer}>
                <Head>
                    <meta name="description" content="Clean your brain out with the Dejumbler." />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="google-site-verification" content="n5dZdc1QljJ4k39BSCkZAbhnJS5CjIdAo6OHVqD_c-Y" />
                </Head>
                {/* <div className={styles.statusBar}>
                    
                    {/* <Login /> */}
                {/* </div> */}
                {showProfile && data &&
                    <Modal toggleModal={() => setShowProfile(!showProfile)}>
                        <div className={styles.loggedInWrapper}>
                            <p>Signed in as: <u><strong>{data.user.name}</strong></u></p>
                            <button href="#" onClick={() => signOut()} className={styles.signoutButton}>Sign out</button>
                        </div>
                    </Modal>}
                <Navbar changeMode={changeMode} showProfile={showProfile} setShowProfile={setShowProfile}/>
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
            </div>
            {/* <Footer className={styles.footer} /> */}
        </div>
    );
}