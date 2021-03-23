const fs = require('fs');

if (!fs.existsSync('./src/.appConfig.json')) {
  fs.copyFileSync('./src/.appConfig.json.dist', './src/.appConfig.json');
}
if (!fs.existsSync('.devProxyConfig.json')) {
  fs.copyFileSync('.devProxyConfig.json.dist', '.devProxyConfig.json');
}
if (!fs.existsSync('.env')) {
  fs.copyFileSync('.env.dist', '.env');
}

const config = require('dotenv').config();
const configureHost = require('./devServer/configureHost');

// if (process.argv[2] !== 'prod' && config.parsed.HOST) {
//   configureHost({ exactDomain: config.parsed.HOST }).then((res) => {
//     const envFileContent = fs.readFileSync('.env', { encoding: 'utf8' });
//     if (!envFileContent.includes('SSL_CRT_FILE')) {
//       fs.appendFileSync('.env', `SSL_CRT_FILE=${res.ssl.cert}\n`);
//     }
//     if (!envFileContent.includes('SSL_KEY_FILE')) {
//       fs.appendFileSync('.env', `SSL_KEY_FILE=${res.ssl.key}\n`);
//     }
//   });
// }
