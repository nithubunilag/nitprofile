/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: "standalone",
    webpack: (config, { webpack }) => {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        }
        config.externals.push({
            canvas: "commonjs canvas",
        })
        return config
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.cloudinary.com",
            },
        ],
    },
}
// export default MillionLint.next({
//   rsc: true
// })(nextConfig);

export default nextConfig
