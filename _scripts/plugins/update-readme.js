const { resolve } = require('path');
const { gzipSync } = require('zlib');
const { readFileSync, writeFileSync } = require('./fs-extra');

const dirname = resolve( __dirname, '../../' );
const readmePath = resolve( dirname, 'README.md' );


module.exports = {
  name: 'update readme',
  writeBundle( bundle ){
    Object.entries( bundle ).$each(([ name, { code } ]) => {
      const size = ( code.length / 1024 ).toFixed( 2 );
      const gzipSize = ( gzipSync( code ).length / 1024 ).toFixed();
      const searchValue = new RegExp(`(\\|\\s+\\*\\*${ name }\\*\\*<br>\\*)[0-9\\.]+(KB\\s+/\\s+)[0-9\\.]+(KB\\*\\s+\\|)`);
      const readmeContent = readFileSync( readmePath, 'utf-8' );

      searchValue.test( readmeContent ) && writeFileSync(
        readmePath,
        readmeContent.replace(
          searchValue,
          `$1${ size }$2${ gzipSize }$3`
        )
      );
    });
  }
};