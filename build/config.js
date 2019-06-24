module.exports = {
  buildPath: 'dist',
  developPath: 'src',
  historyPath: 'events_history',
  devServer: {
    port: 8080,
    startPath: 'pc/static/event1/index.html',
    apiPrefixes: [
      'activity'
    ],
    proxy: {
      target: 'http://webapi.eternalzzx.com', 
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        '^/': '/mock/'
      }
    }
  },
  htmlmin: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    minifyCSS: true,
    minifyJS: true
  },
  autoprefixer: {
    browsers: ['last 2 versions', 'Android >= 4.0'],
    cascade: false
  },
  pxtorem: {
    rootValue: 75,
    unitPrecision: 5,
    minPixelValue: 2,
    propList: ['*']
  }
};
