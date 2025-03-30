module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './',
            '@components': './components',
            '@screens': './screens',
            '@design-system': './design-system',
            '@utils': './utils'
          },
        },
      ],
    ],
  };
}; 