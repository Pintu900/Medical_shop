/**
 * Post-build prerender: snapshot each route with Puppeteer.
 *
 * - **Vercel:** `@sparticuz/chromium` + `puppeteer-core` (Chrome built for serverless; avoids missing libnspr4 etc.).
 * - **Local:** full `puppeteer` + Chrome from `npm run chromium:install` / postinstall.
 *
 * Requires Node.js 18+. On older Node, skips with exit 0 so `build` still passes.
 */
if (process.env.SKIP_PRERENDER === "1") {
  console.warn("[prerender] Skipped: SKIP_PRERENDER=1");
  process.exit(0);
}

const nodeMajor = parseInt(process.versions.node.split(".")[0], 10);
if (nodeMajor < 18) {
  console.warn(
    "[prerender] Skipped: Node 18+ required (found " +
      process.versions.node +
      "). Use Node 20 on Vercel (Project Settings → Node.js Version). Output is SPA-only until then."
  );
  process.exit(0);
}

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = Number(process.env.PRERENDER_PORT || 4173);
const dist = path.join(__dirname, "..", "dist");
const ROUTES = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
];

function resolveFile(pathname) {
  const clean = pathname.split("?")[0] || "/";
  if (clean === "/") {
    return path.join(dist, "index.html");
  }
  const rel = clean.replace(/^\//, "");
  const direct = path.join(dist, rel);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return direct;
  }
  const withIndex = path.join(dist, rel, "index.html");
  if (fs.existsSync(withIndex) && fs.statSync(withIndex).isFile()) {
    return withIndex;
  }
  return path.join(dist, "index.html");
}

function createStaticServer() {
  return http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    const filePath = resolveFile(pathname);
    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    const type =
      ext === ".js"
        ? "application/javascript"
        : ext === ".css"
          ? "text/css"
          : ext === ".json"
            ? "application/json"
            : "text/html";
    res.setHeader("Content-Type", type);
    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      res.statusCode = 500;
      res.end();
    });
    stream.pipe(res);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function launchBrowser() {
  const commonArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
  ];

  if (process.env.VERCEL === "1") {
    const chromium = require("@sparticuz/chromium");
    const puppeteer = require("puppeteer-core");
    const executablePath = await chromium.executablePath();
    return puppeteer.launch({
      args: [...chromium.args, ...commonArgs],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
  }

  const puppeteer = require("puppeteer");
  const launchOpts = {
    headless: true,
    args: commonArgs,
  };
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOpts.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  return puppeteer.launch(launchOpts);
}

async function main() {
  if (!fs.existsSync(path.join(dist, "index.html"))) {
    console.error("[prerender] dist/index.html missing. Run vue-cli-service build first.");
    process.exit(1);
  }

  const server = createStaticServer();
  await new Promise((resolve, reject) => {
    server.listen(PORT, (err) => (err ? reject(err) : resolve()));
  });
  console.log(`[prerender] static server http://127.0.0.1:${PORT}`);

  const browser = await launchBrowser().catch((err) => {
    console.error(err.message);
    if (process.env.VERCEL !== "1") {
      console.error(
        "\n[prerender] Chrome not found. Run: npm run chromium:install\n" +
          "(Puppeteer 24+ downloads the browser in a separate step; postinstall should do this after npm install.)\n"
      );
    }
    throw err;
  });

  try {
    for (const route of ROUTES) {
      const pageUrl = `http://127.0.0.1:${PORT}${route}`;
      console.log(`[prerender] ${pageUrl}`);
      const page = await browser.newPage();
      await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 120000 });
      // Vue mount + router + render-event (main.js ~200ms)
      await sleep(3500);
      const html = await page.content();
      await page.close();

      if (route === "/") {
        fs.writeFileSync(path.join(dist, "index.html"), html, "utf8");
      } else {
        const dir = path.join(dist, route.replace(/^\//, ""));
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
      }
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(() => resolve()));
  }

  console.log("[prerender] done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
