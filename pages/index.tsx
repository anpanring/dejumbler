import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { siteTitle } from '../components/layout';
import Login from '../components/login';

import textLogo from '../public/images/dejumbler-text-logo.png';
import styles from '../styles/Home.module.css';

import { useSession } from 'next-auth/react';

export default function Home() {
    // check session (client-side)
    const session = useSession();

    const router = useRouter();

    // loading state
    if (session.status === 'loading') {
        return (
            <>
                <Head>
                    <title>{siteTitle}</title>
                    <meta name="description" content="Clean your brain out with the Dejumbler." />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="google-site-verification" content="n5dZdc1QljJ4k39BSCkZAbhnJS5CjIdAo6OHVqD_c-Y" />
                </Head>
                <div className={styles.loadingContainer}>
                    <svg className={styles.loadingLogo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 283.5">
                        <path
                            d="M0 0v283.5h283.5V0H0Zm221.55 108.55h-16v-40h16v40Z"
                            style={{
                                strokeWidth: 0,
                            }}
                        />
                    </svg>
                </div>
            </>
        );
    }

    // logged out page
    if (!session.data) {
        document.documentElement.setAttribute('data-theme', "light");
        document.documentElement.style.setProperty("--accent-color", "green");
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

    else {
        router.push('/all-lists');
        return (
            <>
                <Head>
                    <title>{siteTitle}</title>
                    <meta name="description" content="Clean your brain out with the Dejumbler." />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="google-site-verification" content="n5dZdc1QljJ4k39BSCkZAbhnJS5CjIdAo6OHVqD_c-Y" />
                </Head>
                <div className={styles.loadingContainer}>
                    <svg className={styles.loadingLogo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 283.5">
                        <path
                            d="M0 0v283.5h283.5V0H0Zm221.55 108.55h-16v-40h16v40Z"
                            style={{
                                strokeWidth: 0,
                            }}
                        />
                    </svg>
                    {/* <Image src={logo} className={styles.loadingLogo} alt='logo' /> */}
                    {/* <h3>Loading...</h3> */}
                </div>
            </>
            // <Layout>
            //     <Head>
            //         <title>Home - Dejumbler</title>
            //     </Head>
            //     <h2>Hi {session.data.user.name}!</h2>
            //     <h3>Your Recent Lists</h3>
            // </Layout>
        );
    }

    // logged in page
    // return (
    //     <Layout>
    //         <Head>
    //             <title>Home - Dejumbler</title>
    //         </Head>
    //         <h2>Hi {session.data.user.name}!</h2>
    //         <h3>Your Recent Lists</h3>
    //     </Layout>
    // );
}

// check login server-side to prevent flashing login page
// export async function getServerSideProps(context) {
//     const session = await getServerSession(context.req, context.res, authOptions);
//     if (session) {
//         return {
//             redirect: {
//                 destination: '/all-lists',
//                 permanent: true,
//             },
//         }
//     }
//     return {
//         props: {
//             session: session
//         }
//     }
// }

// export async function getServerSideProps(context) {
//     return {
//         props: {
//             csrfToken: await getCsrfToken(context),
//         },
//     }
// }