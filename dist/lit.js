(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function Lit() {}

  if (typeof window !== 'undefined') {
    window.Lit = Lit;
  }

  Lit.define = function (name, options) {
    // 创建组件
    const LitElement = class Lit$$1 extends HTMLElement {
      constructor() {
        super();
        console.log('constructor');
        this.$lit = new Proxy({}, {});
        this.$lit.$el = this.attachShadow({
          mode: 'open'
        });
        this.$lit.$root = this;
        this.$lit.$data = {};
        this.$lit.$props = {};
        this.$lit.$methods = {};
        this.$lit.$computed = {};
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

}));
