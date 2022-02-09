/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  },
  configureWebpack: {
    snapshot: {
      managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!autopreview)/],
    }
  }
}
