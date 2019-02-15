const path = require('path');
const fs = require('fs-extra');


const READMEPATH = path.resolve( __dirname, 'README.md' );
const REPLACE_PRODUCTION = {
  'process.env.NODE_ENV': JSON.stringify('production')
};


module.exports = {

  group: {

    watch: [
      {
        from: 'src/build/index.js',
        to: 'dist/lit.js'
      },
      {
        from: 'src/build/polyfill.js',
        to: 'dist/lit.polyfill.js'
      },
      {
        from: 'src/build/polyfill.async.js',
        to: 'dist/lit.polyfill.async.js'
      }
    ],

    build: [
      {
        mode: true,
        from: 'src/build/index.js',
        to: 'dist/lit.min.js',
        replace: REPLACE_PRODUCTION
      },
      {
        mode: true,
        from: 'src/build/polyfill.js',
        to: 'dist/lit.polyfill.min.js',
        replace: REPLACE_PRODUCTION
      },
      {
        mode: true,
        from: 'src/build/polyfill.async.js',
        to: 'dist/lit.polyfill.async.min.js',
        replace: REPLACE_PRODUCTION
      }
    ]

  },

  pipe: [
    {
      from: 'src/html/src/index.js',
      to: 'src/html/index.js',
      name: undefined,
      format: 'es',
      babel: false
    }
  ],

  config: {
    name: 'Lit',
    format: 'umd',

    rollup: true,

    babel: true,
    babelrc: {
      plugins: [
        /**
         * 展开运算符
         * 
         * [ 'a', ...array ] -> [ 'a' ].concat( array );
         * fn( ...args )     -> fn.call( void 0, args );
         */
        "@babel/plugin-transform-spread",
        /**
         * 赋值解构
         * 
         * [ a, b ] = arr;   -> a = arr[0]; b = arr[1];
         * { a: 1, ...obj }; -> Object.assign( { a: 1 }, obj );
         */
        [
          "@babel/plugin-transform-destructuring", {
            "loose": true,
            "useBuiltIns": true
          }
        ]
      ]
    },

    terserOptions: {
      ecma: 6,
      compress: {
        /**
         * 压缩代码次数
         */
        passes: 3,
        /**
         * 不安全的转换
         * 
         * new Array( 1, 2, 3 )                         -> [ 1, 2, 3 ]
         * Array( 1, 2, 3 )                             -> [ 1, 2, 3 ]
         * new Object()                                 -> {}
         * String( exp )                                -> "" + exp
         * exp.toString()                               -> "" + exp
         * new Object/RegExp/Function/Error/Array (...) -> Object/RegExp/Function/Error/Array (...)
         * "foo bar".substr( 4 )                        -> "bar"
         */
        unsafe: true,
        /**
         * 优化表达式
         * 
         * Array.prototype.slice.call( a )              ->  [].slice.call(a)
         */
        unsafe_proto: true,
        /**
         * 优化匿名函数
         * 
         * (function(){})()                             -> (() => {})()
         */
        unsafe_arrows: true,
        /**
         * 简短写法
         * 
         * { a: function(){} }                          -> { a(){} }
         */
        unsafe_methods: true
      }
    },

    replace: {
      'process.env.NODE_ENV': JSON.stringify('development')
    },

    on: {
      ConfigCreated( rollup, config ){
        if( config.name === 'Lit' && config.format === 'umd' ){
          rollup.inputOptions.context = 'window';
        }
      },
      WriteFile( rollup, config, path, size, gzipSize ){
        const name = path.split('\\').$get( -1 );
        const rSearch = new RegExp(`(\\|\\s${ name }\\s+\\|\\s)[0-9\\.]+(KB\\s\\|\\s)[0-9\\.]+(KB\\s\\|)`);
        const readmeContent = fs.readFileSync( READMEPATH, 'utf-8' );

        if( rSearch.test( readmeContent ) ){
          fs.writeFileSync(
            READMEPATH,
            readmeContent.replace(
              rSearch,
              `$1${ ( size / 1024 ).toFixed( 2 ) }$2${ ( gzipSize / 1024 ).toFixed( 2 ) }$3`
            )
          );
        }
      }
    }
  }

};