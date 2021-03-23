const { createProxyMiddleware } = require('http-proxy-middleware');
const dotEnvConfig = require('dotenv').config();
const devProxyConfig = require('../.devProxyConfig.json');

const envConfig = { ...(dotEnvConfig.parsed || {}), ...process.env };

module.exports = function setupProxy(app) {
  Object.keys(devProxyConfig).forEach((endpoint) => {
    const configKey = devProxyConfig[endpoint];
    const target = envConfig[configKey];
    app.use(
      endpoint,
      createProxyMiddleware({
        target: target || configKey,
        changeOrigin: true,
        secure: false,
        proxyTimeout: 60000,
        timeout: 60000,
      }),
    );
  });
};
