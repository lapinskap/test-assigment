const express = require('express');
const dotEnvConfig = require('dotenv').config();
const helmet = require('helmet');
const compression = require('compression');
const proxyMiddleware = require('./src/setupProxy');

const app = express();
app.use(compression());
const envConfig = { ...(dotEnvConfig.parsed || {}), ...process.env };
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.ckeditor.com', 'maps.google.com', 'maps.googleapis.com'],
        'img-src': ["'self'", 'https:', 'data:'],
        'script-src-attr': ["'self'", 'https:', 'data:', "'unsafe-inline'"],
      },
    },
  }),
);
proxyMiddleware(app);

const cacheStaticTime = 60 * 60 * 24 * 7;
app.use((req, res, next) => {
  if (req.path.match(/^\/(static|data|mockData)\/.+/)) {
    res.set('Cache-control', `public, max-age=${cacheStaticTime}`);
  }
  next();
});

app.use(express.static('build'));

app.get('/health_check', (req, res) => {
  res.json({
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  });
});

const PORT = envConfig.PORT || 5000;

// start express server on port 5000
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`server started on port ${PORT}`);
});
