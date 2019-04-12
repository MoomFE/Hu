

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
      'dist/hu.js': 'coverage'
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
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
      'dist/hu.js',
      // Test
      'test/Hu/start.js',
      'test/Hu/*.test.js'
    ]
  });
};