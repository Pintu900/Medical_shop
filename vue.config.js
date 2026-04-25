const path = require("path");

/**
 * HTML title (used in noscript fallback and default index).
 * Prerender runs after build via scripts/prerender.js (modern Puppeteer — works on Vercel).
 */
module.exports = {
  chainWebpack(config) {
    config.plugin("html").tap((args) => {
      args[0].title = "New Shivam Medicos";
      return args;
    });
  },
};
