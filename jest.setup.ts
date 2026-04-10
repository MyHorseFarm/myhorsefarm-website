// Jest global test environment setup
// Sets env vars required by production code paths exercised in tests

process.env.ADMIN_SECRET = "test-admin-secret";
process.env.URL_SIGNING_SECRET = "test-signing-secret";
process.env.CRON_SECRET = "test-cron-secret";
process.env.NEXT_PUBLIC_SITE_URL = "https://myhorsefarm.com";
