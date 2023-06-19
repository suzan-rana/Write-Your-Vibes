/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "tx.shadcn.com",
      },
      {
        hostname: "pbs.twimg.com",
      },
      {
        hostname: 'write-your-vibes.s3.ap-south-1.amazonaws.com'
      },
      {
        hostname: "s3.ap-south-1.amazonaws.com"
      },
      {
        hostname: 'api.dicebear.com'
      },
      {
        hostname: 's3.'
      }
    ],
  },
  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
