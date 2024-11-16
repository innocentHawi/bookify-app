module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: ['nativewind/babel'], // Include any other plugins you need
    };
  };
  