import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  trailingSlash: false,
  serverExternalPackages: ["@remotion/lambda", "@remotion/lambda-client"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "my-horse-farm",
  project: "myhorsefarm-website",
});
