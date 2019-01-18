

module.exports = {

  group: {

    watch: [
      {
        from: 'src/build/index.js',
        to: 'dist/lit.js'
      }
    ],

    build: [
      
    ]

  },

  pipe: [
    {
      from: 'src/html/src/index.js',
      to: 'src/html/index.js',
      format: 'es',
      babel: false
    }
  ],

  config: {
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
    }
  }

};