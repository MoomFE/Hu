const { resolve } = require('path');
const { copy } = require('fs-extra');

const dirname = resolve( __dirname, '../../' );
const from = resolve( dirname, 'dist/hu.js' );
const to = resolve( dirname, 'test/Lib/hu.js' );


module.exports = {
  name: 'copy to test',
  writeBundle: async () => {
    await copy( from, to );
  }
};