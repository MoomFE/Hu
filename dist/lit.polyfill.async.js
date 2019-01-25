(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Lit = factory());
}(this, function () { 'use strict';

  window.WebComponents = {
    root: 'https://unpkg.com/@webcomponents/webcomponentsjs@%5E2/'
  };

  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  (function () {
    /**
     * Basic flow of the loader process
     *
     * There are 4 flows the loader can take when booting up
     *
     * - Synchronous script, no polyfills needed
     *   - wait for `DOMContentLoaded`
     *   - run callbacks passed to `waitFor`
     *   - fire WCR event
     *
     * - Synchronous script, polyfills needed
     *   - document.write the polyfill bundle
     *   - wait on the `load` event of the bundle to batch Custom Element upgrades
     *   - wait for `DOMContentLoaded`
     *   - run callbacks passed to `waitFor`
     *   - fire WCR event
     *
     * - Asynchronous script, no polyfills needed
     *   - fire WCR event, as there could not be any callbacks passed to `waitFor`
     *
     * - Asynchronous script, polyfills needed
     *   - Append the polyfill bundle script
     *   - wait for `load` event of the bundle
     *   - batch Custom Element Upgrades
     *   - run callbacks pass to `waitFor`
     *   - fire WCR event
     */

    var polyfillsLoaded = false;
    var whenLoadedFns = [];
    var allowUpgrades = false;
    var flushFn;

    function fireEvent() {
      window.WebComponents.ready = true;
      document.dispatchEvent(new CustomEvent('WebComponentsReady', {
        bubbles: true
      }));
    }

    function batchCustomElements() {
      if (window.customElements && customElements.polyfillWrapFlushCallback) {
        customElements.polyfillWrapFlushCallback(function (flushCallback) {
          flushFn = flushCallback;

          if (allowUpgrades) {
            flushFn();
          }
        });
      }
    }

    function asyncReady() {
      batchCustomElements();
      ready();
    }

    function ready() {
      // bootstrap <template> elements before custom elements
      if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
        HTMLTemplateElement.bootstrap(window.document);
      }

      polyfillsLoaded = true;
      runWhenLoadedFns().then(fireEvent);
    }

    function runWhenLoadedFns() {
      allowUpgrades = false;

      var done = function () {
        allowUpgrades = true;
        whenLoadedFns.length = 0;
        flushFn && flushFn();
      };

      return Promise.all(whenLoadedFns.map(function (fn) {
        return fn instanceof Function ? fn() : fn;
      })).then(function () {
        done();
      }).catch(function (err) {
        console.error(err);
      });
    }

    window.WebComponents = window.WebComponents || {};
    window.WebComponents.ready = window.WebComponents.ready || false;

    window.WebComponents.waitFor = window.WebComponents.waitFor || function (waitFn) {
      if (!waitFn) {
        return;
      }

      whenLoadedFns.push(waitFn);

      if (polyfillsLoaded) {
        runWhenLoadedFns();
      }
    };

    window.WebComponents._batchCustomElements = batchCustomElements;
    var name = 'webcomponents-loader.js'; // Feature detect which polyfill needs to be imported.

    var polyfills = [];

    if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype) || window.ShadyDOM && window.ShadyDOM.force) {
      polyfills.push('sd');
    }

    if (!window.customElements || window.customElements.forcePolyfill) {
      polyfills.push('ce');
    }

    var needsTemplate = function () {
      // no real <template> because no `content` property (IE and older browsers)
      var t = document.createElement('template');

      if (!('content' in t)) {
        return true;
      } // broken doc fragment (older Edge)


      if (!(t.content.cloneNode() instanceof DocumentFragment)) {
        return true;
      } // broken <template> cloning (Edge up to at least version 17)


      var t2 = document.createElement('template');
      t2.content.appendChild(document.createElement('div'));
      t.content.appendChild(t2);
      var clone = t.cloneNode(true);
      return clone.content.childNodes.length === 0 || clone.content.firstChild.content.childNodes.length === 0;
    }(); // NOTE: any browser that does not have template or ES6 features
    // must load the full suite of polyfills.


    if (!window.Promise || !Array.from || !window.URL || !window.Symbol || needsTemplate) {
      polyfills = ['sd-ce-pf'];
    }

    if (polyfills.length) {
      var url;
      var polyfillFile = 'bundles/webcomponents-' + polyfills.join('-') + '.js'; // Load it from the right place.

      if (window.WebComponents.root) {
        url = window.WebComponents.root + polyfillFile;
      } else {
        var script = document.querySelector('script[src*="' + name + '"]'); // Load it from the right place.

        url = script.src.replace(name, polyfillFile);
      }

      var newScript = document.createElement('script');
      newScript.src = url; // if readyState is 'loading', this script is synchronous

      if (document.readyState === 'loading') {
        // make sure custom elements are batched whenever parser gets to the injected script
        newScript.setAttribute('onload', 'window.WebComponents._batchCustomElements()');
        document.write(newScript.outerHTML);
        document.addEventListener('DOMContentLoaded', ready);
      } else {
        newScript.addEventListener('load', function () {
          asyncReady();
        });
        newScript.addEventListener('error', function () {
          throw new Error('Could not load polyfill bundle' + url);
        });
        document.head.appendChild(newScript);
      }
    } else {
      polyfillsLoaded = true;

      if (document.readyState === 'complete') {
        fireEvent();
      } else {
        // this script may come between DCL and load, so listen for both, and cancel load listener if DCL fires
        window.addEventListener('load', ready);
        window.addEventListener('DOMContentLoaded', function () {
          window.removeEventListener('load', ready);
          ready();
        });
      }
    }
  })();

  function Lit() {}

  if (typeof window !== 'undefined') {
    window.Lit = Lit;
  }

  const isArray = Array.isArray;

  var isPlainObject = (obj => Object.prototype.toString.call(obj) === '[object Object]');

  var each = ((obj, cb) => {
    for (let name in obj) {
      cb(name, obj[name]);
    }
  });

  var isFunction = (obj => typeof obj === 'function');

  var fromBooleanAttribute = (value => value !== null);

  /**
   * 初始化组件 props 配置
   * @param {{}} userOptions 用户传入的组件配置
   * @param {{}} options 格式化后的组件配置
   */

  function initProps(userOptions, options) {
    /** 格式化后的 props 配置 */
    const props = options.props = {};
    /** 用户传入的 props 配置 */

    const userProps = userOptions.props;
    /** 用户传入的 props 配置是否是数组 */

    let propsIsArray = false; // 去除不合法参数

    if (userProps == null || !((propsIsArray = isArray(userProps)) || isPlainObject(userProps))) {
      return;
    } // 格式化数组参数


    if (propsIsArray) {
      if (!userProps.length) return;

      for (let name of userProps) {
        props[name] = {};
      }
    } // 格式化 JSON 参数
    else {
        each(userProps, (name, userProp) => {
          props[name] = userProp ? initProp(userProp, {}) : {};
        });
      }
  }

  function initProp(prop, options) {
    // 单纯设置变量类型
    if (isFunction(prop)) {
      options.from = prop;
    } // 高级用法
    else {
        // 变量类型
        if (prop.type != null) {
          const type = prop.type; // String || Number || Boolean || function( value ){ return value };

          if (isFunction(type)) {
            options.from = type;
          } // {
          //   from(){}
          //   to(){}
          // }
          else if (isPlainObject(type)) {
              if (isFunction(type.from)) options.from = type.from;
              if (isFunction(type.to)) options.to = type.to;
            }
        } // 默认值


        if ('default' in prop) {
          if (typeof prop.default !== 'object') {
            options.default = prop.default;
          }
        }
      } // 如果传入值是 Boolean 类型, 则需要另外处理


    if (options.from === Boolean) {
      options.from = fromBooleanAttribute;
    }

    return options;
  }

  /**
   * 初始化组件配置
   * @param {{}} userOptions 用户传入的组件配置
   */

  function initOptions(userOptions) {
    /** 格式化后的组件配置 */
    const options = {};
    initProps(userOptions, options);
    return options;
  }

  var returnArg = (value => value);

  /**
   * 初始化当前组件 props 属性
   * @param {HTMLElement} root 
   * @param {{}} options 
   * @param {{}} target 
   */

  function initProps$1(root, options, target, targetProxy) {
    const props = options.props;
    const propsTarget = {};
    each(props, (name, options) => {
      let value = root.getAttribute(name); // 定义了该属性

      if (value !== null) {
        propsTarget[name] = (options.from || returnArg)(value);
      } // 使用默认值
      else {
          propsTarget[name] = isFunction(options.default) ? options.default.call(targetProxy) : options.default;
        }
    });
    target.$props = new Proxy(propsTarget, {});
  }

  /**
   * 初始化当前组件属性
   * @param {HTMLElement} root 组件根节点
   * @param {{}} options 组件配置
   */

  function init(root, options) {
    /** 当前组件对象 */
    const target = {};
    /** 当前组件代理对象 */

    const targetProxy = new Proxy(target, {});
    target.$el = this.attachShadow({
      mode: 'open'
    });
    target.$root = this;
    initProps$1(root, options, target, targetProxy);
    return targetProxy;
  }

  /**
   * 定义自定义标签
   * @param {string} name 标签名
   * @param {{}} options 组件配置
   */

  function define(name, options) {
    // 初始化组件配置
    options = initOptions(options); // 创建组件

    const LitElement = class Lit$$1 extends HTMLElement {
      constructor() {
        super();
        this.$lit = init(this, options);
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
