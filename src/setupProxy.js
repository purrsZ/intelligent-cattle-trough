const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 代理 /api 路径下的所有请求到远程服务器
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://bj01.fe.server.base.axisspace.cn:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: function(proxyReq, req, res) {
        console.log('🚀 代理请求:', req.method, req.url, '→', 'http://bj01.fe.server.base.axisspace.cn:8080' + req.url);
      },
      onProxyRes: function(proxyRes, req, res) {
        console.log('✅ 代理响应:', proxyRes.statusCode, req.url);
      },
      onError: function(err, req, res) {
        console.error('❌ 代理错误:', err.message);
      }
    })
  );
};
