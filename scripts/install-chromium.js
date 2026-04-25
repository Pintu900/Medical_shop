/**
 * Download Chrome for Puppeteer (required for prerender). Puppeteer v24+ does not bundle it in the package.
 * Skips on Node < 18 so `npm install` still works on older local runtimes.
 */
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
