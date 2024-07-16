import withPlaiceholder from "@plaiceholder/next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.amazonaws.com`,
      },
    ],
    minimumCacheTTL: 60,
  },
};

export default withPlaiceholder(nextConfig);
