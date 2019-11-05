require('./scripts/extras/copy-polyfill');
const pluginFixErrorInFirefox = require('./scripts/plugins/Fix-SyntaxError-error-in-Firefox-51-and-below');
const pluginFixWebcomponentsjs = require('./scripts/plugins/Fix-webcomponentsjs-window-is-not-defined');
const pluginCopyToTest = require('./scripts/plugins/copy-to-test');
const HU_RUNNING_COMMAND = process.env.HU_RUNNING_COMMAND;
const packages = require('./package.json');
const banner = `${ packages.title } v${ packages.version }\n${ packages.homepage }\n\n(c) 2018-present ${ packages.author }\nReleased under the MIT License.`;
const pipe = [
  { output: 'hu.js' }
];


if( HU_RUNNING_COMMAND === 'build' ){
  // UMD
  pipe.$concat([
    { input: 'build/polyfill.js', output: 'hu.polyfill.js', configureRollup( rollupConfig){
      rollupConfig.input.context = 'window';
    }},
    { input: 'build/polyfill.async.js', output: 'hu.polyfill.async.js' }
  ]);
  // UMD Minify
  pipe.$each( config => {
    pipe.push(
      Object.$assign( null, config, {
        mode: true,
        output: config.output.replace( /\.js$/, '.min.js' )
      })
    );
  });
  // Other
  pipe.$each( config => {
    // CommonJS + CommonJS Minify
    pipe.push(
      Object.$assign( null, config, {
        format: 'cjs',
        output: config.mode ? config.output.replace( /\.min\.js$/, '.common.min.js' )
                            : config.output.replace( /\.js$/, '.common.js' )
      })
    );
    // ES Module + ES Module Minify
    pipe.push(
      Object.$assign( null, config, {
        format: 'esm',
        output: config.mode ? config.output.replace( /\.min\.js$/, '.esm.min.js' )
                            : config.output.replace( /\.js$/, '.esm.js' )
      })
    );
  });
}


module.exports = {
  mode: false,
  input: 'build/index.js',
  format: 'umd',
  name: 'Hu',
  banner,
  replace: {
    'process.env.NODE_ENV': JSON.stringify( HU_RUNNING_COMMAND === 'build' ? 'production' : 'development' ),
    '__VERSION__': packages.version
  },
  plugins: ( config ) => [
    pluginFixErrorInFirefox,
    pluginCopyToTest,
    /\.polyfill\./.test( config.output ) && pluginFixWebcomponentsjs
  ],
  pluginOptions: {
    terser: {
      compress: { passes: 3 }
    }
  },

  pipe
};