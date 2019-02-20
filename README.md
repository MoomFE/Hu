# Lit
Lit 是一个基于 Web Components 和 Proxy 的 MVVM 框架, 适合公用组件开发<br>
Lit 使用了和 Vue 相似的 API, 大大减少了学习成本

<br>

## 浏览器支持

| Chrome | Firefox | Safari | Edge | Internet Explorer |
| :-     | :-      | :-     | :-   | :-                |
| 49+    | 45+     | 10+    | 12+  | No                |

> 在目前支持的这些浏览器下, 已经支持大部分的 ES5 / ES6 等特性及方法了,<br>
> 在项目中就可以忽略对这些特性的 babel 转码和 polyfill 以达到更好的性能, 特在此罗列出来 ( 肯定不全 ): <br>
  > - [<font size="1">箭头函数表达式 ( Arrow Functions )</font>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
  > - [<font size="1">剩余参数 ( Rest Parameters )</font>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)
  > - [<font size="1">模板字面量 ( Template literals ) or 模板字符串 ( Template Strings )</font>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)
  > - [<font size="1">计算属性名 ( Computed property names )</font>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#计算属性名)
  > - [<font size="1">简短属性名 ( Shorthand property names )</font>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#属性定义)
  > - [<font size="1">简短方法名 ( Shorthand method names )</font>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#方法定义)
  > - [<font size="1">类 ( Classes )</font>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)
  > - [<font size="1">迭代循环 ( for...of )</font>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)
  > - [<font size="1">块级作用域 - 常量 ( Const )</font>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const)
  > - [<font size="1">块级作用域 - 变量 ( Let )</font>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)
<br>

## 大小 - 版本详解
|                           | Default | Gzip   | -   | Module | Use in | Description |
| :-                        | :-      | :-     | :-: | :-     | :-     | :-          |
| lit.js                    | 41.46KB | 10.97KB | \| | UMD | Browser | |
| lit.min.js                | 10.35KB | 3.80KB | \| | UMD | Browser | |
| lit.polyfill.async.js     | 47.98KB | 12.61KB | \| | UMD | Browser | |
| lit.polyfill.async.min.js | 12.63KB | 4.57KB | \| | UMD | Browser | |
| lit.polyfill.js           | 205.54KB | 48.08KB | \| | UMD | Browser | |
| lit.polyfill.min.js       | 108.62KB | 33.75KB | \| | UMD | Browser | |

<br>

## Include
  - [Lit-HTML](https://github.com/Polymer/lit-html) \- [LICENSE](https://github.com/Polymer/lit-html/blob/master/LICENSE)