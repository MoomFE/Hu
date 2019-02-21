# Lit
Lit 是一个基于 Web Components 和 Proxy 的 MVVM 框架, 适合公用组件开发<br>
Lit 使用了和 Vue 相似的 API, 大大减少了学习成本

<br>

## 浏览器支持

| Chrome | Firefox | Safari | Edge | Internet Explorer |
| :-     | :-      | :-     | :-   | :-                |
| 49+    | 45+     | 10+    | 12+  | No                |

> 在目前支持的这些浏览器下, 已经支持大部分的 ES5 / ES6 等特性及方法了,<br>
> 在项目中就可以忽略对这些特性的 babel 转码和 polyfill 以达到更好的性能, 特在此罗列出来 ( 包括但不限于 ): <br>
  > - [箭头函数表达式 ( Arrow Functions )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
  > - [剩余参数 ( Rest Parameters )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)
  > - [模板字面量 ( Template literals ) or 模板字符串 ( Template Strings )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)
  > - [计算属性名 ( Computed property names )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#计算属性名) / [简短属性名 ( Shorthand property names )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#属性定义) / [简短方法名 ( Shorthand method names )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#方法定义)
  > - [类 ( Classes )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)
  > - [迭代循环 ( for...of )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)
  > - [块级作用域 - 常量 ( Const )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const) / [块级作用域 - 变量 ( Let )](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)

<br>

## 大小 - 版本详解
|                           | Default | Gzip   | -   | Module | Use in | Description |
| :-                        | :-      | :-     | :-: | :-     | :-     | :-          |
| lit.js                    | 51.25KB | 13.27KB | \| | UMD | Browser | |
| lit.min.js                | 12.15KB | 4.43KB | \| | UMD | Browser | |
| lit.polyfill.async.js     | 57.80KB | 14.94KB | \| | UMD | Browser | |
| lit.polyfill.async.min.js | 14.47KB | 5.21KB | \| | UMD | Browser | |
| lit.polyfill.js           | 215.33KB | 50.37KB | \| | UMD | Browser | |
| lit.polyfill.min.js       | 110.43KB | 34.36KB | \| | UMD | Browser | |

<br>

## Include
  - [Lit-HTML](https://github.com/Polymer/lit-html) \- [LICENSE](https://github.com/Polymer/lit-html/blob/master/LICENSE)