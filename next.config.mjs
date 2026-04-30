// Fix: Node 22+ creates broken localStorage global without valid --localstorage-file
if (typeof globalThis.localStorage !== 'undefined' && typeof globalThis.localStorage.getItem !== 'function') {
  delete globalThis.localStorage;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    swcMinify: true,
  }
export default nextConfig;
