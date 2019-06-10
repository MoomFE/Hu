require('@moomfe/zenjs');
require('./extras/copy-polyfill');

const basic = require('./basic.config');
const fix = require('./plugins/Fix-webcomponentsjs-window-is-not-defined');
const copy = require('./plugins/copy-to-test');
const terser = require('./plugins/terser');
const replace = require('./plugins/replace');


const configs = [];

// UMD
configs.$concat([
  basic,
  Object.$assign( null, basic, {
    context: 'window',
    input: 'src/build/polyfill.js',
    output: {
      file: 'dist/hu.polyfill.js'
    }
  }),
  Object.$assign( null, basic, {
    input: 'src/build/polyfill.async.js',
    output: {
      file: 'dist/hu.polyfill.async.js'
    }
  })
]);

// UMD Minify
configs.$each( config => {
  const newConfig = Object.$assign( null, config, {
    output: {
      file: config.output.file.replace( /\.js$/, '.min.js' )
    }
  });

  newConfig.plugins.push(
    terser
  );

  configs.push( newConfig );
});

[ ...configs ]
  // CommonJS + CommonJS Minify
  .$each( config => {
    const isMinify = /\.min\.js$/.test( config.output.file );
    const newConfig = Object.$assign( null, config, {
      output: {
        format: 'cjs',
        file: isMinify ? config.output.file.replace( /\.min\.js$/, '.common.min.js' )
                       : config.output.file.replace( /\.js$/, '.common.js' )
      }
    });

    configs.push( newConfig );
  })
  // ES Module + ES Module Minify
  .$each( config => {
    const isMinify = /\.min\.js$/.test( config.output.file );
    const newConfig = Object.$assign( null, config, {
      output: {
        format: 'es',
        file: isMinify ? config.output.file.replace( /\.min\.js$/, '.esm.min.js' )
                       : config.output.file.replace( /\.js$/, '.esm.js' )
      }
    });

    configs.push( newConfig );
  });


// 修复 webcomponentsjs polyfill 的 "window is not defined" 错误
configs.$each( config => {
  /\.polyfill\./.test( config.output.file ) && config.plugins.push(
    fix
  );
});

// 字符串替换
configs.$each( config => {
  const isProduction = /\.min\.js$/.test( config.output.file );

  config.plugins.push(
    replace( isProduction )
  );
});

// 复制到测试文件夹
configs.filter( config => config.output.file === basic.output.file ).forEach( config => {
  config.plugins.push( copy );
});


module.exports = configs;