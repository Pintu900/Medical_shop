/** Default document title for the HTML shell (noscript / pre-mount). */
module.exports = {
  chainWebpack(config) {
    config.plugin("html").tap((args) => {
      args[0].title = "New Shivam Medicos";
      return args;
    });
  },
};
