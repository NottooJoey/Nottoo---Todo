#!/bin/bash

# This script will reset all caches related to the Expo/React Native project

echo "Stopping any running Metro processes..."
killall -9 node 2>/dev/null

echo "Cleaning Expo caches..."
rm -rf .expo
rm -rf ios/Pods
rm -rf node_modules/.cache

echo "Cleaning Watchman caches..."
watchman watch-del-all 2>/dev/null || echo "Watchman not installed"

echo "Cleaning Metro bundler cache..."
rm -rf $TMPDIR/metro-* 2>/dev/null
rm -rf $TMPDIR/haste-map-* 2>/dev/null
rm -rf $TMPDIR/react-* 2>/dev/null

echo "Cleaning NPM cache..."
npm cache clean --force

echo "All caches cleaned, ready for a fresh start!"
echo "Run 'npm run ios-go' to restart your development server." 