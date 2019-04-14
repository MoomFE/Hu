

module.exports = function( config ){
  config.set({
    singleRun: true,
    browsers: [
      'Chrome', 'Firefox', 'Safari'
    ],
    frameworks: [
      'mocha',
      'chai'
    ],
    preprocessors: {
      'test/Lib/hu.js': 'coverage'
    },
    reporters: [
      'progress',
      'coverage'
    ],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    files: [
      // Lib
      'test/Lib/zen.fat.js',
      'test/Lib/vue.js',
      'test/Lib/webcomponents-loader-karma-config.js',
      'test/Lib/webcomponents-loader.js',
      'test/Lib/hu.js',
      // Test
      'test/Hu/start.js',
      'test/Hu/*.test.js'
    ]
  });
};