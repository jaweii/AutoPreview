/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
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
