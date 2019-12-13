const { resolve } = require('path');


module.exports = {
  inputDir: __dirname,
  outputDir: resolve( __dirname, '../' ),
  externals: {
    chai: 'chai'
  }
}