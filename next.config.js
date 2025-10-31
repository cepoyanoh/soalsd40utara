/** @type {import('next').NextConfig} */
const nextConfig = {
  // Menonaktifkan pengoptimal gambar karena kita tidak menggunakannya
  images: {
    unoptimized: true
  },
  // Konfigurasi untuk menghindari masalah dengan modul ES
  experimental: {
    esmExternals: true
  }
};

export default nextConfig;