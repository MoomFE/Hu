const resolve = require('rollup-plugin-node-resolve');
const fix = require('./plugins/Fix-SyntaxError-error-in-Firefox-51-and-below');
const console = require('./plugins/console');
const updateReadme = require('./plugins/update-readme');


const packages = require('../package.json');
const banner = `/*!
 * ${ packages.title } v${ packages.version }
 * ${ packages.homepage }
 * 
 * (c) 2018-present ${ packages.author }
 * Released under the MIT License.
 */
`;


module.exports = {
  input: 'src/build/index.js',
  output: {
    file: 'dist/hu.js',
    format: 'umd',
    name: 'Hu',
    banner
  },
  plugins: [
    fix,
    resolve(),
    console,
    updateReadme
  ]
};