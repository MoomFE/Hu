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
| 正常版 | **hu.js**<br>*96.09KB / 25.92KB* | **hu.common.js**<br>*90.43KB / 25.54KB* | **hu.esm.js**<br>*90.42KB / 25.52KB* |
| 正常版 ( 生产环境 ) | **hu.min.js**<br>*20.24KB / 7.68KB* | **hu.common.min.js**<br>*25.09KB / 8.46KB* | **hu.esm.min.js**<br>*20.07KB / 7.61KB* |
| 正常版 + Polyfill | **hu.polyfill.js**<br>*243.22KB / 58.93KB* | **hu.polyfill.common.js**<br>*235.97KB / 58.50KB* | **hu.polyfill.esm.js**<br>*235.96KB / 58.48KB* |
| 正常版 + Polyfill ( 生产环境 ) | **hu.polyfill.min.js**<br>*108.93KB / 34.77KB* | **hu.polyfill.common.min.js**<br>*113.78KB / 35.56KB* | **hu.polyfill.esm.min.js**<br>*108.76KB / 34.70KB* |
| 正常版 + Polyfill ( 按需加载 ) | **hu.polyfill.async.js**<br>*102.69KB / 27.60KB* | **hu.polyfill.async.common.js**<br>*96.70KB / 27.20KB* | **hu.polyfill.async.esm.js**<br>*96.69KB / 27.18KB* |
| 正常版 + Polyfill ( 按需加载 ) ( 生产环境 ) | **hu.polyfill.async.min.js**<br>*22.59KB / 8.42KB* | **hu.polyfill.async.common.min.js**<br>*27.44KB / 9.21KB* | **hu.polyfill.async.esm.min.js**<br>*22.42KB / 8.34KB* |

<br>

## Include
  - [Lit-HTML](https://github.com/Polymer/lit-html) \- [LICENSE](https://github.com/Polymer/lit-html/blob/master/LICENSE)