import Head from 'next/head';
import Image from 'next/image';

import { siteTitle } from '@/components/layout';
import Login from '@/components/login';

import textLogo from '@/public/images/dejumbler-text-logo.png';
import dynamic from 'next/dynamic';

const DynamicThreeScene = dynamic(() => import('@/components/ThreeScene'), {
  ssr: false,
  loading: () => <p>Loading 3D scene...</p>,
});

export default function Home() {
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
      <div className="flex flex-col items-center justify-center h-screen gap-2 bg-[var(--background)]">
        {/* <DynamicThreeScene /> */}
        <Image
          src={textLogo}
          className="w-1/2 h-20 fill-[var(--foreground)]"
          alt="Dejumbler text logo"
        />
        <h2 className="text-base text-center text-[var(--foreground)]">
          The Dejumbler is a platform that helps you use lists to manage the
          media you consume.
        </h2>
        <Login />
      </div>
    </>
  );
}
