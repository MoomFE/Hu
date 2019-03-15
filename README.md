# Hu
Hu 是一个基于 Web Components 和 Proxy 的 MVVM 框架, 适合公用组件开发<br>
Hu 使用了和 Vue 相似的 API, 大大减少了学习成本

<br>

## 浏览器支持

|              | Chrome | Firefox | Safari | Edge | IE |
| :-           | :-     | :-      | :-     | :-   | :- |
| Use Polyfill | 49+    | 45+     | 10+    | 14+  | ×  |
| No Polyfill  | 54+    | 63+     | 10.1+  | ×    | ×  |

> 在目前支持的这些浏览器下, 已经支持大部分的 ES5 / ES6 等特性及方法了,<br>
> 在项目中就可以忽略对这些特性的 babel 转码和 polyfill 以达到更好的性能, 特在此罗列出来 ( 包括但不限于 ): <br>
  > - [箭头函数表达式 ( Arrow Functions )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
  > - [函数默认参数 ( Default parameters )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Default_parameters)
  > - [剩余参数 ( Rest Parameters )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)
  > - [模板字面量 ( Template literals ) or 模板字符串 ( Template Strings )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)
  > - [计算属性名 ( Computed property names )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#计算属性名) / [简短属性名 ( Shorthand property names )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#属性定义) / [简短方法名 ( Shorthand method names )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#方法定义)
  > - [展开语法 ( Spread syntax )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
  > - [解构赋值 ( Destructuring assignment )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
  > - [类 ( Classes )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)
  > - [迭代循环 ( for...of )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)
  > - [块级作用域 - 常量 ( Const )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const) / [块级作用域 - 变量 ( Let )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)

<br>

## 大小 - 版本详解
| Description | UMD | CommonJS | ES Module |
| :- | :- | :- | :- |
| 正常版 | **hu.js**<br><small>92.25KB / 24.49KB</small> | **hu.common.js**<br><small>86.86KB / 24.10KB</small> | **hu.esm.js**<br><small>86.84KB / 24.09KB</small> |
| 正常版 ( 生产环境 ) | **hu.min.js**<br><small>18.91KB / 7.03KB</small> | **hu.common.min.js**<br><small>23.44KB / 7.70KB</small> | **hu.esm.min.js**<br><small>18.74KB / 6.96KB</small> |
| 正常版 + Polyfill | **hu.polyfill.js**<br><small>239.49KB / 57.49KB</small> | **hu.polyfill.common.js**<br><small>232.37KB / 57.02KB</small> | **hu.polyfill.esm.js**<br><small>232.36KB / 57.00KB</small> |
| 正常版 + Polyfill ( 生产环境 ) | **hu.polyfill.min.js**<br><small>107.60KB / 34.14KB</small> | **hu.polyfill.common.min.js**<br><small>112.13KB / 34.84KB</small> | **hu.polyfill.esm.min.js**<br><small>107.43KB / 34.08KB</small> |
| 正常版 + Polyfill ( 按需加载 ) | **hu.polyfill.async.js**<br><small>98.85KB / 26.47KB</small> | **hu.polyfill.async.common.js**<br><small>93.13KB / 26.06KB</small> | **hu.polyfill.async.esm.js**<br><small>93.11KB / 26.05KB</small> |
| 正常版 + Polyfill ( 按需加载 ) ( 生产环境 ) | **hu.polyfill.async.min.js**<br><small>21.26KB / 7.80KB</small> | **hu.polyfill.async.common.min.js**<br><small>25.79KB / 8.49KB</small> | **hu.polyfill.async.esm.min.js**<br><small>21.09KB / 7.73KB</small> |

<br>

## Include
  - [Lit-HTML](https://github.com/Polymer/lit-html) \- [LICENSE](https://github.com/Polymer/lit-html/blob/master/LICENSE)