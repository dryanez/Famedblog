/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['famedtestprep.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/anamnese',
        destination: 'https://famedtestprep.com/anamnese',
        permanent: true,
      },
      {
        source: '/aufklaerung',
        destination: 'https://famedtestprep.com/aufklaerung',
        permanent: true,
      },
      {
        source: '/medicalcases',
        destination: 'https://famedtestprep.com/medicalcases',
        permanent: true,
      },
      {
        source: '/brief',
        destination: 'https://famedtestprep.com/brief',
        permanent: true,
      },
      {
        source: '/exam',
        destination: 'https://famedtestprep.com/exam',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
