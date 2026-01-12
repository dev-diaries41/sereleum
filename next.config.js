/** @type {import('next').NextConfig} */

const nextConfig = {
  turbopack:{},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
    ],
  },
  webpack: (config) => {
    // Ignore the missing 'supports-color' module
    config.resolve.alias['supports-color'] = false;

    // Ignore the missing ReactToastify CSS source map warnings
    config.ignoreWarnings = [
      (warning) => 
        warning.message.includes("Failed to parse source map") || 
        warning.message.includes("Module not found: Can't resolve 'supports-color'")
    ];

    return config;
  },
}

module.exports = nextConfig
