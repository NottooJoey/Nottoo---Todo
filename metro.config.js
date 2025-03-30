const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

// Get the default Expo configuration
const config = getDefaultConfig(__dirname);

// iOS-focused optimizations
config.resolver.platforms = ['ios', 'web'];
config.resolver.sourceExts = ['ios.ts', 'ios.tsx', 'ios.js', 'ios.jsx', 'ts', 'tsx', 'js', 'jsx', 'json'];

// Add the mock resolver for react-native-gesture-handler
config.resolver.extraNodeModules = {
  'react-native-gesture-handler': path.resolve(__dirname, './react-native-gesture-handler-mock.js'),
};

// Make sure the mock file exists
const mockFilePath = path.resolve(__dirname, './react-native-gesture-handler-mock.js');
if (fs.existsSync(mockFilePath)) {
  // If mock file exists, include its directory (not the file itself)
  config.watchFolders = [__dirname];
}

// Add cacheVersion to force cache clearing when needed
config.cacheVersion = '1.0';

module.exports = config; 