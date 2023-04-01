const path = require('path')


/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  pages: {
    index: {
      entry: "src/index.js",
      template: "public/index.html",
      filename: "index.html"
    }
  },
  devServer: {
    hot: true,
    static: {
      directory: path.resolve(__dirname, "dist"),
      watch: {
        ignored: /node_modules/,
        usePolling: false,
      },
      publicPath: "/"
    },
    compress: true,
    open: true,
    client: {
      logging: "warn",
      overlay: { warnings: false, errors: true },
    },
  },
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        return {
          ...options,
        }
      });
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/assets/css/sass/_mixins.scss";
          @import "@/assets/css/sass/_horizontalStepper.scss";
          @import "@/assets/css/sass/_bootstrap.scss";
          @import "@/assets/css/sass/themes/piaf.light.blue.scss";
          @import "@/assets/css/sass/_piaf.style.scss";
        `
      }
    }
  }
};
