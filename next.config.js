/** @type {import('next').NextConfig} */
const nextConfig = {
experimental: {
    ppr: true,
  },
	images: {
		domains: [] // Add your domain here
	}
};

module.exports = nextConfig;
