/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.scdn.co',
                port: '',
                pathname: '/image/**',
            },
        ],
    },
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
    }
}

module.exports = nextConfig