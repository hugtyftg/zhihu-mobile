const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    // createProxyMiddleware('/api', {
    //   target: 'https://www.jianshu.com/asimov',
    //   changeOrigin: true,
    //   ws: true,
    //   pathRewrite: {'^/api': ''}
    // }),
    // createProxyMiddleware('/api2', {
    //   target: 'https://news-at.zhihu.com/api/4 ',
    //   changeOrigin: true,
    //   ws: true,
    //   pathRewrite: {'^/api2': ''}
    // }),
    // createProxyMiddleware("/api", {
    //   target: "http://127.0.0.1:9000",
    //   changeOrigin: true,
    //   ws: true,
    //   pathRewrite: { "^/api": "" }
    // })
    createProxyMiddleware('/api', {
      target: 'http://127.0.0.1:7100',
      changeOrigin: true,
      ws: true,
      pathRewrite: {'^/api': ''}
    })
  )
}