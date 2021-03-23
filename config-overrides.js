const { ReactInspectorPlugin } = require('react-dev-inspector/plugins/webpack');
const { NormalModuleReplacementPlugin } = require('webpack');
const {
  override,
  addBabelPlugin,
  addWebpackPlugin,
} = require('customize-cra');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = override(
  addWebpackPlugin(
    new ReactInspectorPlugin(),
  ),
  // addWebpackPlugin(
  //   new BundleAnalyzerPlugin(),
  // ),
  isDevelopment ? addWebpackPlugin(
    new NormalModuleReplacementPlugin(
      /devInspector\/prod\.js/,
      './dev.js',
    ),
  ) : null,
  isDevelopment ? addBabelPlugin([
    'react-dev-inspector/plugins/babel',
    {},
  ]) : null,
);
