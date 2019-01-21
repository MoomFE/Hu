(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Lit = factory());
}(this, function () { 'use strict';

  function Lit() {}

  if (typeof window !== 'undefined') {
    window.Lit = Lit;
  }

  const create = Object.create;

  const isArray = Array.isArray;

  /**
   * 传入一个键值对的列表, 并返回一个带有这些键值对的新对象 ( 是 Object.entries 的反转 )
   * Object.fromEntries polyfill
   * 
   * From @moomfe/zenjs
   */
  function fromEntries(iterable) {
    const result = {};
    const newIterable = Array.from(iterable);
    let item;
    let index = newIterable.length;

    while (index--) {
      item = newIterable[index];

      if (item && item.length) {
        result[item[0]] = item[1];
      }
    }

    return result;
  }

  function initOptions(_options) {
    const options = create(null);
    initProps(_options, options);
  }

  function initProps(_options, options) {
    let props = _options.props;
    let propsIsArray = false; // 去除不合法参数

    if (props == null && !(propsIsArray = isArray(props))) {
      return;
    } // 格式化数组参数


    if (propsIsArray) {
      if (!props.length) return;
      props = fromEntries(props.map(prop => [prop, {}]));
    }
  }

  function init(root, options) {
  }

  Lit.define = function (name, options) {
    // 初始化组件属性
    options = initOptions(options); // 创建组件

    const LitElement = class Lit$$1 extends HTMLElement {
      constructor() {
        super();
        this.$lit = init(this, options); // this.$lit = new Proxy({}, {
        // });
        // this.$lit.$el = this.attachShadow({ mode: 'open' });
        // this.$lit.$root = this;
        // this.$lit.$data = {};
        // this.$lit.$props = {};
        // this.$lit.$methods = {};
        // this.$lit.$computed = {};
      }

      attributeChangedCallback(name, value, oldValue) {}

      connectedCallback() {
        console.log('connectedCallback');
      }

      disconnectedCallback() {
        console.log('disconnectedCallback');
      }

      adoptedCallback() {
        console.log('adoptedCallback');
      }

    }; // 注册组件

    customElements.define(name, LitElement);
  };

  return Lit;

}));
