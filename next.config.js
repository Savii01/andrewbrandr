/** @type {import('next').NextConfig} */
const nextConfig = {
    // firebase-admin is CommonJS — tell Next.js not to bundle it server-side
    serverExternalPackages: ['firebase-admin'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
