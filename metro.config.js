const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolution enhancements for Windows / Deep nesting
config.resolver.nodeModulesPaths = [
    path.resolve(__dirname, 'node_modules'),
];
config.resolver.extraNodeModules = {
    'react-native-worklets': path.resolve(__dirname, 'node_modules/react-native-worklets'),
};
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'ts', 'tsx', 'js', 'jsx', 'json', 'wasm'];
config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];

module.exports = config;
