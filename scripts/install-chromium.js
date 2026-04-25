/**
 * Download Chrome for Puppeteer (required for prerender on Mac/Windows/Linux with full deps).
 * Puppeteer v24+ does not bundle Chrome in the package.
 *
 * Skips on Node < 18. Skips on Vercel — prerender uses @sparticuz/chromium there (no system libnspr4 etc.).
 */
if (process.env.VERCEL === "1") {
  console.log("[install-chromium] Skipped on Vercel (using @sparticuz/chromium during prerender).");
  process.exit(0);
}

const major = parseInt(process.versions.node.split(".")[0], 10);
if (major < 18) {
  console.warn(
    "[install-chromium] Skipped (Node 18+ required). Use Node 20 locally and on Vercel, then run: npm run chromium:install"
  );
  process.exit(0);
}

const { execSync } = require("child_process");
const path = require("path");

try {
  execSync("npx puppeteer browsers install chrome", {
    stdio: "inherit",
    shell: true,
    cwd: path.join(__dirname, ".."),
    env: process.env,
  });
} catch {
  process.exit(1);
}
