const webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');
const webpack = require('webpack');

const ENV = process.env.IONIC_ENV;
const envConfigFile = require(`./config-${ENV}.json`);
const googleConfig = require('./google-account.json');

const { useBugsnag } = envConfigFile;
const { scopes, webClientId } = googleConfig;

webpackConfig[ENV].plugins.push(
  new webpack.DefinePlugin({
    webpackGlobalVars: {
      useBugsnag,
      GOOGLE_SCOPES: JSON.stringify(scopes),
      GOOGLE_WEB_CLIENT_ID: JSON.stringify(webClientId),
    }
  })
);
