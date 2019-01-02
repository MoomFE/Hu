

module.exports = {

  group: {

    watch: [
      {
        from: 'src/build/index',
        to: 'dist/lit.js'
      }
    ]

  },

  config: {
    mode: true,
    rollup: true,
    babel: false,
    autoPolyfill: false
  }
  
};