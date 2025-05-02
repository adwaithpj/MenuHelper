/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {

        config.module.rules.push({
            test: /\.worker\.js$/,
            use: { loader: "worker-loader" },
        });

        config.module.rules.push({
            test: /tesseract\.js-core/,
            use: {
                loader: "null-loader",
            },
        });

        return config;
    },
};

module.exports = nextConfig;
