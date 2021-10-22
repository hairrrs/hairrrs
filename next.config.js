module.exports = {
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/products/all',
        permanent: true,
      },
      {
        source: '/product',
        destination: '/products/all',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
}
