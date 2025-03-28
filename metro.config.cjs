// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure resolver exists before modifying it
if (config.resolver) {
  config.resolver.sourceExts.push('jsx', 'ts', 'tsx');
}

// Metro enhancements (optional, for custom setups)
config.server = {
  enhanceMiddleware: (middleware, server) => {
    return middleware;
  },
};

module.exports = config;
