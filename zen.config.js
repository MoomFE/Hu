

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
         * let 和 const 块级作用域
         */
        [
          "@babel/plugin-transform-block-scoping", {
            "throwIfClosureRequired": true
          }
        ],
        /**
         * 函数块级作用域
         */
        "@babel/plugin-transform-block-scoped-functions",
        /**
         * 箭头函数
         * 
         * () => {} -> function(){};
         */
        "@babel/plugin-transform-arrow-functions",
        /**
         * 展开运算符
         * 
         * [ 'a', ...array ] -> [ 'a' ].concat( array );
         * fn( ...args )     -> fn.call( void 0, args );
         */
        "@babel/plugin-transform-spread",
        /**
         * 对象属性的快捷定义
         * 
         * { a, b, c } -> { a: a, b: b, c: c };
         * { fn(){} }  -> { fn: function(){} };
         */
        "@babel/plugin-transform-shorthand-properties",
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
        ],
        /**
         * 模板字符串
         * `foo${bar}` -> "foo" + bar
         */
        [
          "@babel/plugin-transform-template-literals", {
            "loose": true
          }
        ]
      ]
    }
  }

};