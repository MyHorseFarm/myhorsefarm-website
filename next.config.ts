import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  serverExternalPackages: ["@remotion/lambda", "@remotion/lambda-client"],
};

export default nextConfig;
