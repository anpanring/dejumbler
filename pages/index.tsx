import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { siteTitle } from '@/components/layout';
import Login from '@/components/login';

import textLogo from '@/public/images/dejumbler-text-logo.png';
import styles from '@/styles/Home.module.css';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default function Home() {
  const router = useRouter();

  // document.documentElement.setAttribute('data-theme', 'light');
  // document.documentElement.style.setProperty('--accent-color', 'green');
  // document.documentElement.style.setProperty('--secondary-font', 'Epilogue');
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta
          name="description"
          content="Clean your brain out with the Dejumbler."
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="google-site-verification"
          content="n5dZdc1QljJ4k39BSCkZAbhnJS5CjIdAo6OHVqD_c-Y"
        />
      </Head>
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <Image
          src={textLogo}
          className={styles.textLogo}
          alt="Dejumbler text logo"
        />
        <h2 className="text-base text-center">
          The Dejumbler is a platform that helps you use lists to manage the
          media you consume.
        </h2>
        <Login />
      </div>
    </>
  );
}

// check login server-side to prevent flashing login page
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: '/all-lists',
        permanent: true,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
}
