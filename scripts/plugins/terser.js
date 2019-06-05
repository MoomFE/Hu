const { terser } = require('rollup-plugin-terser');

const result = terser({
  ecma: 6,
  warnings: true,
  compress: {
    /** 压缩代码次数 */
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
});

module.exports = () => result;