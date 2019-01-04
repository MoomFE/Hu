# Lit
Lit 是一个基于 Web Components 的 MVVM 框架, 适合公用组件开发

<br>

## 版本详解
| name        | description |
| :-          | :-          |
| lit.js      | 核心代码 |
| lit.lazy.js | 核心代码, 根据当前浏览器支持自动加载需要的 polyfill |
| lit.fat.js  | 核心代码, 需要的 polyfill |

<br>

## 实例
```html
  <custom-element></custom-element>
```
```js
  Lit.define( 'custom-element', {

    /* ------ 接收参数 ------ */

    // 基础用法
    //   - 从同名的小写属性上使用字符串的方式获取值
    props: [ 'foo', 'bar', 'fooBar' ],
    props: {
      foo: null,
      bar: null
    }

    // 高级用法
    //   - 可以设置变量类型及转义方法
    //   - 设定默认值
    props: {
      foo: {
        // 设定从属性转为变量时, 变量的类型
        type: String || Number || Boolean,
        // 自定义从属性转为变量的方法
        type( value ){
          return value;
        },
        type: {
          // 自定义从属性转为变量的方法
          from( value ){ return value },
          // 自定义从变量转为属性的方法 ( reflect 选项为 true 时可用 )
          to( value ){ return value }
        },
        // 可以设定从什么属性上获取值
        attr: 'bar',
        attr: 'foo-bar',
        // 值转义后, 如果在对象内发生变动, 是否将变动显示到属性上
        reflect: false
      }
    },

    /* ------ 接收参数 ------ */

    /* ------ 声明渲染方法 ------ */

    // 渲染方法
    //   - 优先级第一
    //   - 可访问 this 对象
    //   - 需使用带标签的模板字符串
    render( html ){
      return html`
        <style>
          div {
            color: #FFF;
            background-color: #000;
          }
        </style>

        <div>Define custom element for "render" option .</div>
      `;
    },

    // 模板语法
    //   - 优先级第二
    //   - 不可访问 this 对象 / 适合渲染一次不再更新的组件
    //   - 使用字符串或者模板字符串进行编辑
    template: `
      <style>
        div {
          color: #FFF;
          background-color: #000;
        }
      </style>

      <div>Define custom element for "template" option .</div>
    `,

    /* ------ 声明渲染方法 ------ */

    // 生命周期 -> 组件挂载并渲染完成
    mounted(){

    }

  });
```

<br>

## Include
  - [ZenJS](https://github.com/MoomFE/ZenJS) \- [LICENSE](https://github.com/MoomFE/ZenJS/blob/master/LICENSE)
  - [Lit-Element](https://github.com/Polymer/lit-element) \- [LICENSE](https://github.com/Polymer/lit-element/blob/master/LICENSE)
  - [Lit-HTML](https://github.com/Polymer/lit-html) \- [LICENSE](https://github.com/Polymer/lit-html/blob/master/LICENSE)