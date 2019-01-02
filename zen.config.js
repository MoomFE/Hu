

module.exports = {

  group: {

    watch: [
      {
        from: 'src/build/slim.js',
        to: 'dist/lit.js'
      },
      {
        from: 'src/build/fat.js',
        to: 'dist/lit.fat.js'
      }
    ],

    build: [
      {
        mode: true,
        from: 'src/build/slim.js',
        to: 'dist/lit.min.js'
      },
      {
        mode: true,
        from: 'src/build/fat.js',
        to: 'dist/lit.fat.min.js'
      }
    ]

  },

  config: {
    rollup: true,

    babel: true,
    babelrc: {
      plugins: [
        [
          "@babel/plugin-transform-block-scoping", {
            "throwIfClosureRequired": true
          }
        ],
        "@babel/plugin-transform-block-scoped-functions",
        "@babel/plugin-transform-arrow-functions",
        "@babel/plugin-transform-shorthand-properties",
        [
          "@babel/plugin-transform-template-literals", {
            "loose": true
          }
        ]
      ]
    },

    on: {
      ConfigCreated( rollup ){
        rollup.inputOptions.context = 'window';
      }
    }
  }

};