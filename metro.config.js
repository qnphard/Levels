const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const os = require('os');

const config = getDefaultConfig(__dirname);

// Windows: single node_modules root (avoids duplicate resolution work)
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// Reanimated / worklets — keep explicit resolution
config.resolver.extraNodeModules = {
  'react-native-worklets': path.resolve(__dirname, 'node_modules/react-native-worklets'),
};

// Do not override resolverMainFields — Expo already sets ['react-native','browser','main'].

// Previously this spread duplicated ts/js/json/wasm already in Expo's list, which can slow
// resolution on Windows. Dedupe; keep wasm only as an asset (binary), not a source transform.
config.resolver.sourceExts = [...new Set(config.resolver.sourceExts)];
config.resolver.assetExts = [...new Set([...config.resolver.assetExts, 'wasm', 'riv'])];

// Cap parallel workers to reduce memory thrashing (feels like "stuck at 100%" on large graphs).
const cpus = os.cpus()?.length ?? 4;
config.maxWorkers = Math.max(1, Math.min(4, cpus - 1));

module.exports = config;
