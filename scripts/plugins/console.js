require('colors');
require('@moomfe/zenjs');

const { resolve } = require('path');
const { gzipSync } = require('zlib');

const dirname = resolve( __dirname, '../../' );

function getSize( size ){
  if( size < 1024 ) return size + 'B';
  else return ( size / 1024 ).toFixed( 2 ) + 'KB';
}

const result = {
  name: 'console',
  buildStart( inputOptions ){
    const input = resolve( dirname, inputOptions.input );

    this.startTime = +( new Date );

    console.log(`------------------------------------`);
    console.log(`- Input   : ${ input.green }`);
  },
  generateBundle( outputOptions, bundle ){
    const date = new Date();
    const dateFormat = date.$format('YYYY-MM-DD HH:mm:ss Z');
    const time = date.$valueOf() - this.startTime + 'ms';
    const [ name, options ] = Object.entries( bundle )[0];
    const output = resolve( dirname, `dist/${ name }` );
    const size = getSize( options.code.length );
    const gzipSize = getSize( gzipSync( options.code ).length );

    console.log(`- Output  : ${ output.green } - ( ${ size.green } / ${ gzipSize.green } )`);
    console.log(`- Built at: ${ dateFormat.green }`);
    console.log(`- Time    : ${ time.green }`);
    console.log(`------------------------------------\n`);
  }
};

module.exports = () => result;