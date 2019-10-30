sconst { resolve } = require('path');
const { writeFileSync } = require('./fs-extra');

const dirname = resolve( __dirname, '../../' );
const path = resolve( dirname, 'test/Lib/hu.js' );


module.exports = {
  name: 'copy to test',
  writeBundle( bundle ){
    writeFileSync( path, bundle['hu.js'].code, 'utf-8' );
  }
};