const path = require("path");

/**
 * HTML title (used in noscript fallback and default index).
 * Production: prerender main routes so crawlers receive real HTML, not an empty #app shell.
 */
module.exports = {
  chainWebpack(config) {
    config.plugin("html").tap((args) => {
      args[0].title = "New Shivam Medicos";
      return args;
    });
  },
  configureWebpack() {
    if (process.env.NODE_ENV !== "production") {
      return {};
    }
    const PrerenderSPAPlugin = require("prerender-spa-plugin");
    const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
    return {
      plugins: [
        new PrerenderSPAPlugin({
          staticDir: path.join(__dirname, "dist"),
          routes: [
            "/",
            "/about",
            "/services",
            "/contact",
            "/privacy-policy",
            "/terms-of-service",
          ],
          renderer: new Renderer({
            renderAfterDocumentEvent: "render-event",
            headless: true,
            maxConcurrentRoutes: 2,
            renderAfterTime: 15000,
          }),
        }),
      ],
    };
  },
};
