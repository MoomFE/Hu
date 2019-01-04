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

    props: [ 'foo', 'bar' ],
    props: {
      foo: null,
      bar: {

      }
    },

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