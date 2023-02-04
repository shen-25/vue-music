const { defineConfig } = require("@vue/cli-service");
const registerRouter = require("./backend/router");

module.exports = defineConfig({
  // transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `,
      },
    },
  },
  devServer: {
    /**
     * 官网
     * https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md
     */
    onBeforeSetupMiddleware: (devServer) => {
      registerRouter(devServer.app);
    },
  },
});
