import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  trailingSlash: false,
  serverExternalPackages: ["@remotion/lambda", "@remotion/lambda-client"],
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "my-horse-farm",
  project: "myhorsefarm-website",
});
