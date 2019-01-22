(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Lit = factory());
}(this, function () { 'use strict';

  function Lit() {}

  if (typeof window !== 'undefined') {
    window.Lit = Lit;
  }

  const isArray = Array.isArray;

  /**
   * 初始化组件 props 属性
   * @param {{}} userOptions 用户传入的组件属性
   * @param {{}} options 格式化后的组件属性
   */

  function initProps(userOptions, options) {
    /** 格式化后的 props 属性 */
    const props = options.props = {};
    /** 用户传入的 props 属性 */

    const userProps = userOptions.props;
    /** 用户传入的 props 属性是否是数组 */

    let propsIsArray = false; // 去除不合法参数

    if (userProps == null || !(propsIsArray = isArray(userProps))) {
      return;
    } // 格式化数组参数


    if (propsIsArray) {
      if (!userProps.length) return;

      for (let name of userProps) {
        props[name] = {};
      }
    }
  }

  /**
   * 初始化组件属性
   * @param {{}} userOptions 用户传入的组件属性
   */

  function initOptions(userOptions) {
    /** 格式化后的组件属性 */
    const options = {};
    initProps(userOptions, options);
    return options;
  }

  const create = Object.create;

  function initProps$1(root, options, target) {
    const $props = target.$props = create(null);
    const props = options.props;

    for (let name in props) {
      let item = props[name];
      console.log(name, options);
    }
  }

  function init(root, options) {
    const target = {};
    initProps$1(root, options, target);
  }

  /**
   * 定义自定义标签
   * @param {string} name 标签名
   * @param {{}} options 组件属性
   */

  function define(name, options) {
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
  }
  Lit.define = define;

  return Lit;

}));
