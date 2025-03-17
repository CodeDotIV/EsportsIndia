// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('jsx', 'ts', 'tsx');

module.exports = config;
