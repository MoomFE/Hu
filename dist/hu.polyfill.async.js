/*!
 * Hu.js v1.0.0-bata.0
 * https://github.com/MoomFE/Hu
 * 
 * (c) 2018-present Wei Zhang
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Hu = factory());
}(this, function () { 'use strict';

  if (typeof window !== 'undefined') {
    window.WebComponents = Object.assign({
      root: 'https://unpkg.com/@webcomponents/webcomponentsjs@%5E2/'
    }, window.WebComponents);
  }

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
     *   - fire WCR event, as there could not be any callbacks passed to `waitFor`
     *
     * - Synchronous script, polyfills needed
     *   - document.write the polyfill bundle
     *   - wait on the `load` event of the bundle to batch Custom Element upgrades
     *   - wait for `DOMContentLoaded`
     *   - run callbacks passed to `waitFor`
     *   - fire WCR event
     *
     * - Asynchronous script, no polyfills needed
     *   - wait for `DOMContentLoaded`
     *   - run callbacks passed to `waitFor`
     *   - fire WCR event
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
      var fnsMap = whenLoadedFns.map(function (fn) {
        return fn instanceof Function ? fn() : fn;
      });
      whenLoadedFns = [];
      return Promise.all(fnsMap).then(function () {
        allowUpgrades = true;
        flushFn && flushFn();
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
      // if readyState is 'complete', script is loaded imperatively on a spec-compliant browser, so just fire WCR
      if (document.readyState === 'complete') {
        polyfillsLoaded = true;
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

  /**
   * 调用堆栈
   * - 存放当前正在计算依赖的方法的 dependentsOptions 依赖集合数组
   * - [ dependentsOptions, dependentsOptions, ... ]
   */
  const targetStack = [];

  var isObject = (
  /**
   * 判断传入对象是否是 Object 类型且不为 null
   * @param {any} value 需要判断的对象
   */
  value => value !== null && typeof value === 'object');

  var isEqual = (
  /**
   * 判断传入的两个值是否相等
   * @param {any} value 需要判断的对象
   * @param {any} value2 需要判断的对象
   */
  (value, value2) => {
    return !(value2 !== value && (value2 === value2 || value === value));
  });

  const {
    assign,
    create,
    keys
  } = Object;

  const {
    // apply,
    // construct,
    defineProperty,
    deleteProperty,
    // enumerate,
    // get,
    getOwnPropertyDescriptor,
    // getPrototypeOf,
    has,
    // isExtensible,
    ownKeys // preventExtensions,
    // set,
    // setPrototypeOf

  } = Reflect;

  /**
   * 存放原始对象和观察者对象及其选项参数的映射
   */

  const observeMap = new WeakMap();
  /**
   * 存放观察者对象和观察者对象选项参数的映射
   */

  const observeProxyMap = new WeakMap();
  /**
   * 为传入对象创建观察者
   */

  function observe(target, options) {
    // 如果创建过观察者
    // 则返回之前创建的观察者
    if (observeMap.has(target)) return observeMap.get(target).proxy; // 如果传入的就是观察者对象
    // 则直接返回

    if (observeProxyMap.has(target)) return target; // 否则立即创建观察者进行返回

    return createObserver(target, options);
  }

  function createObserver(target, options = {}) {
    /** 当前对象的观察者对象 */
    const proxy = new Proxy(target, {
      get: createObserverProxyGetter(options.get),
      set: createObserverProxySetter(options.set),
      ownKeys: observerProxyOwnKeys,
      deleteProperty: createObserverProxyDeleteProperty(options.deleteProperty)
    });
    /** 观察者对象选项参数 */

    const observeOptions = {
      // 可以使用观察者对象来获取原始对象
      target,
      // 可以使用原始对象来获取观察者对象
      proxy,
      // 当前对象的子级的被监听数据
      watches: create(null),
      // 当前对象的被深度监听数据
      deepWatches: new Set(),
      // 上次的值
      lastValue: create(null)
    }; // 存储观察者选项参数

    observeMap.set(target, observeOptions);
    observeProxyMap.set(proxy, observeOptions);
    return proxy;
  }
  /**
   * 创建依赖收集的响应方法
   */


  const createObserverProxyGetter = ({
    before
  } = {}) => (target, name, targetProxy) => {
    // @return 0: 从原始对象放行
    if (before) {
      const beforeResult = before(target, name, targetProxy);

      if (beforeResult === 0) {
        return target[name];
      }
    } // 需要获取的值是使用 Object.defineProperty 定义的属性


    if ((getOwnPropertyDescriptor(target, name) || {}).get) {
      return target[name];
    } // 获取当前在收集依赖的那个方法的参数


    const dependentsOptions = targetStack[targetStack.length - 1]; // 观察者选项参数

    const observeOptions = observeMap.get(target); // 当前有正在收集依赖的方法

    if (dependentsOptions) {
      const {
        watches
      } = observeOptions;
      let watch = watches[name]; // 当前参数没有被监听过, 初始化监听数组

      if (!watch) {
        watch = new Set();
        watches[name] = watch;
      } // 添加依赖方法信息到 watch
      // 当前值被改变时, 会调用依赖方法


      watch.add(dependentsOptions); // 添加 watch 的信息到依赖收集去
      // 当依赖方法被重新调用, 会移除依赖

      dependentsOptions.deps.add(watch);
    } // 存储本次值


    const value = observeOptions.lastValue[name] = target[name]; // 如果获取的值是对象类型
    // 则返回它的观察者对象

    return isObject(value) ? observe(value) : value;
  };
  /**
   * 创建响应更新方法
   */


  const createObserverProxySetter = ({
    before
  } = {}) => (target, name, value, targetProxy) => {
    // @return 0: 阻止设置值
    if (before) {
      const beforeResult = before(target, name, value, targetProxy);

      if (beforeResult === 0) {
        return false;
      }
    } // 需要修改的值是使用 Object.defineProperty 定义的属性


    if ((getOwnPropertyDescriptor(target, name) || {}).set) {
      target[name] = value;
      return true;
    } // 观察者选项参数


    const observeOptions = observeMap.get(target); // 旧值

    const oldValue = name in observeOptions.lastValue ? observeOptions.lastValue[name] : target[name]; // 值完全相等, 不进行修改

    if (isEqual(oldValue, value)) {
      return true;
    } // 改变值


    target[name] = value; // 获取子级监听数据

    const {
      watches,
      deepWatches
    } = observeMap.get(target); // 获取当前参数的被监听数据和父级对象深度监听数据的集合

    let watch = [...(watches[name] || []), ...deepWatches]; // 如果有方法依赖于当前值, 则运行那个方法以达到更新的目的

    if (watch.length) {
      let executes = [];

      for (let dependentsOptions of watch) {
        // 通知所有依赖于此值的计算属性, 下次被访问时要更新值
        if (dependentsOptions.isComputed) {
          dependentsOptions.shouldUpdate = true; // 需要更新有依赖的计算属性

          if (!dependentsOptions.lazy) {
            executes.push(dependentsOptions);
          }
        } // 其它需要更新的依赖
        else {
            executes.push(dependentsOptions);
          }
      }

      for (let dependentsOptions of executes) {
        //           不是计算属性                      需要更新的计算属性
        if (!dependentsOptions.isComputed || dependentsOptions.shouldUpdate) {
          dependentsOptions.update();
        }
      }
    }

    return true;
  };
  /**
   * 响应以下方式的依赖收集:
   *   - for ... in
   *   - Object.keys
   *   - Object.values
   *   - Object.entries
   *   - Object.getOwnPropertyNames
   *   - Object.getOwnPropertySymbols
   *   - Reflect.ownKeys
   */


  const observerProxyOwnKeys = target => {
    // 获取当前在收集依赖的那个方法的参数
    const dependentsOptions = targetStack[targetStack.length - 1]; // 当前有正在收集依赖的方法

    if (dependentsOptions) {
      // 深度监听数据
      const {
        deepWatches
      } = observeMap.get(target); // 标识深度监听

      deepWatches.add(dependentsOptions);
    }

    return ownKeys(target);
  };

  const createObserverProxyDeleteProperty = ({
    before
  } = {}) => (target, name) => {
    // @return 0: 禁止删除
    if (before) {
      const beforeResult = before(target, name);

      if (beforeResult === 0) {
        return false;
      }
    }

    return deleteProperty(target, name);
  };

  var isSymbol = (
  /**
   * 判断传入对象是否是 Symbol 类型
   * @param {any} value 需要判断的对象
   */
  value => typeof value === 'symbol');

  var cached = (
  /**
   * 创建一个可以缓存方法返回值的方法
   */
  fn => {
    const cache = create(null);
    return str => {
      if (str in cache) return cache[str];
      return cache[str] = fn(str);
    };
  });

  var isReserved = /**
   * 判断字符串首字母是否为 $
   * @param {String} value
   */
  cached(value => {
    const charCode = (value + '').charCodeAt(0);
    return charCode === 0x24;
  });

  var isSymbolOrNotReserved = (
  /**
   * 判断传入名称是否是 Symbol 类型或是首字母不为 $ 的字符串
   * @param { string | symbol } name 需要判断的名称
   */
  name => {
    return isSymbol(name) || !isReserved(name);
  });

  var isString = (
  /**
   * 判断传入对象是否是 String 类型
   * @param {any} value 需要判断的对象
   */
  value => typeof value === 'string');

  var observeHu = {
    set: {
      before: (target, name) => {
        return isSymbolOrNotReserved(name) ? null : 0;
      }
    },
    get: {
      before: (target, name) => {
        return isString(name) && isReserved(name) ? 0 : null;
      }
    },
    deleteProperty: {
      before: (target, name) => {
        return isString(name) && isReserved(name) ? 0 : null;
      }
    }
  };

  const {
    isArray
  } = Array;

  var isPlainObject = (
  /**
   * 判断传入对象是否是纯粹的对象
   * @param {any} value 需要判断的对象
   */
  value => Object.prototype.toString.call(value) === '[object Object]');

  var each = (
  /**
   * 对象遍历方法
   * @param {{}} obj 需要遍历的对象
   * @param {( key:string, value: any ) => {}} cb 遍历对象的方法
   */
  (obj, cb) => {
    if (obj) {
      const keys = ownKeys(obj);

      for (let key of keys) {
        cb(key, obj[key]);
      }
    }
  });

  var isFunction = (
  /**
   * 判断传入对象是否是 Function 类型
   * @param {any} value 需要判断的对象
   */
  value => typeof value === 'function');

  var fromBooleanAttribute = (
  /**
   * 序列化为 Boolean 属性
   */
  value => value !== null);

  var returnArg = (
  /**
   * 返回传入的首个参数
   * @param {any} value 需要返回的参数
   */
  value => value);

  var rHyphenate = /\B([A-Z])/g;

  var hyphenate = /**
   * 将驼峰转为以连字符号连接的小写名称
   */
  cached(name => {
    return name.replace(rHyphenate, '-$1').toLowerCase();
  });

  /**
   * 初始化组件 props 配置
   * @param {{}} userOptions 用户传入的组件配置
   * @param {{}} options 格式化后的组件配置
   */

  function initProps(userOptions, options) {
    /** 格式化后的 props 配置 */
    const props = options.props = {};
    /** 最终的 prop 与取值 attribute 的映射 */

    const propsMap = options.propsMap = {};
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
        props[name] = initProp(name, null);
      }
    } // 格式化 JSON 参数
    else {
        each(userProps, (name, prop) => {
          props[name] = initProp(name, prop);
        });
      } // 生成 propsMap


    each(props, (name, prop) => {
      const {
        attr
      } = prop;

      if (attr) {
        const map = propsMap[attr] || (propsMap[attr] = []);
        map.push({
          name,
          from: prop.from || returnArg
        });
      }
    });
  }
  /**
   * 格式化组件 prop 配置
   * @param { string | symbol } name prop 名称
   * @param { {} | null } prop 用户传入的 prop
   */

  function initProp(name, prop) {
    /** 格式化后的 props 配置 */
    const options = {};
    initPropAttribute(name, prop, options);

    if (prop) {
      // 单纯设置变量类型
      if (isFunction(prop)) {
        options.from = prop;
      } // 高级用法
      else {
          initPropType(prop, options);
          initPropDefault(prop, options);
        }
    } // 如果传入值是 Boolean 类型, 则需要另外处理


    if (options.from === Boolean) {
      options.from = fromBooleanAttribute;
    }

    return options;
  }
  /**
   * 初始化 options.attr
   */


  function initPropAttribute(name, prop, options) {
    // 当前 prop 是否是 Symbol 类型的
    options.isSymbol = isSymbol(name); // 当前 prop 的取值 attribute

    options.attr = prop && prop.attr || (options.isSymbol // 没有定义 attr 名称且是 symbol 类型的 attr 名称, 则不设置 attr 名称
    ? null // 驼峰转为以连字符号连接的小写 attr 名称
    : hyphenate(name));
  }
  /**
   * 初始化 options.type 变量类型
   */


  function initPropType(prop, options) {
    const type = prop.type;

    if (type != null) {
      // String || Number || Boolean || function( value ){ return value };
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
    }
  }
  /**
   * 初始化 options.default 默认值
   */


  function initPropDefault(prop, options) {
    if ('default' in prop) {
      const $default = prop.default;

      if (isFunction($default) || !isObject($default)) {
        options.default = $default;
      }
    }
  }

  var noop = (
  /**
   * 空方法
   */
  () => {});

  function initLifecycle(userOptions, options) {
    [
    /** 在实例初始化后立即调用, 但是 computed, watch 还未初始化 */
    'beforeCreate',
    /** 在实例创建完成后被立即调用, 但是挂载阶段还没开始 */
    'created',
    /** 在自定义元素挂载开始之前被调用 */
    'beforeMount',
    /** 在自定义元素挂载开始之后被调用, 组件 DOM 已挂载 */
    'mounted',
    /** 数据更新时调用, 还未更新组件 DOM */
    'beforeUpdate',
    /** 数据更新时调用, 已更新组件 DOM */
    'updated',
    /** 实例销毁之前调用。在这一步，实例仍然完全可用 */
    'beforeDestroy',
    /** 实例销毁后调用 */
    'destroyed'].forEach(name => {
      const lifecycle = userOptions[name];
      options[name] = isFunction(lifecycle) ? lifecycle : noop;
    });
  }

  function initState(isCustomElement, userOptions, options) {
    const {
      methods,
      data,
      computed,
      watch
    } = userOptions;

    if (methods) {
      initMethods(methods, options);
    }

    if (data) {
      initData(isCustomElement, data, options);
    }

    if (computed) {
      initComputed(computed, options);
    }

    if (watch) {
      initWatch(watch, options);
    }
  }

  function initMethods(userMethods, options) {
    const methods = options.methods = {};
    each(userMethods, (key, method) => {
      isFunction(method) && (methods[key] = method);
    });
  }

  function initData(isCustomElement, userData, options) {
    if (isFunction(userData) || !isCustomElement && isPlainObject(userData)) {
      options.data = userData;
    }
  }

  function initComputed(userComputed, options) {
    const computed = options.computed = {};
    each(userComputed, (key, userComputed) => {
      if (userComputed) {
        const isFn = isFunction(userComputed);
        const get = isFn ? userComputed : userComputed.get || noop;
        const set = isFn ? noop : userComputed.set || noop;
        computed[key] = {
          get,
          set
        };
      }
    });
  }

  function initWatch(userWatch, options) {
    const watch = options.watch = {};
    each(userWatch, (key, handler) => {
      if (isArray(handler)) {
        for (const handler of handler) {
          createWatcher(key, handler, watch);
        }
      } else {
        createWatcher(key, handler, watch);
      }
    });
  }

  function createWatcher(key, handler, watch) {
    watch[key] = isPlainObject(handler) ? handler : {
      handler
    };
  }

  const inBrowser = typeof window !== 'undefined';
  const UA = inBrowser && window.navigator.userAgent.toLowerCase();
  const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

  function initOther(isCustomElement, userOptions, options) {
    const {
      render
    } = userOptions; // 渲染方法

    options.render = isFunction(render) ? render : null;

    if (inBrowser && !isCustomElement) {
      // 挂载目标
      options.el = userOptions.el || undefined;
    }
  }

  const optionsMap = {};
  /**
   * 初始化组件配置
   * @param {boolean} isCustomElement 是否是初始化自定义元素
   * @param {string} name 自定义元素标签名
   * @param {{}} _userOptions 用户传入的组件配置
   */

  function initOptions(isCustomElement, name, _userOptions) {
    /** 克隆一份用户配置 */
    const userOptions = assign({}, _userOptions);
    /** 格式化后的组件配置 */

    const options = optionsMap[name] = {};
    initProps(userOptions, options);
    initState(isCustomElement, userOptions, options);
    initLifecycle(userOptions, options);
    initOther(isCustomElement, userOptions, options);
    return [userOptions, options];
  }

  let uid = 0;
  var uid$1 = (
  /**
   * 返回一个字符串 UID
   */
  () => '' + uid++);

  var define = (
  /**
   * 在传入对象上定义可枚举可删除的一个新属性
   * 
   * @param {any} 需要定义属性的对象
   * @param {string} attribute 需要定义的属性名称
   * @param {function} get 属性的 getter 方法
   * @param {function} set 属性的 setter 方法
   */
  (obj, attribute, get, set) => {
    defineProperty(obj, attribute, {
      enumerable: true,
      configurable: true,
      get,
      set
    });
  });

  const callbacks = [];
  let pending = false;

  function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;

    for (let copy of copies) copy();
  }

  const resolve = Promise.resolve();

  const timerFunc = () => {
    resolve.then(flushCallbacks);

    if (isIOS) {
      setTimeout(noop);
    }
  };

  function nextTick(callback, ctx) {
    let resolve;
    callbacks.push(() => {
      if (callback) {
        callback.call(ctx);
      } else {
        resolve(ctx);
      }
    });

    if (!pending) {
      pending = true;
      timerFunc();
    }

    if (!callback) {
      return new Promise(_resolve => {
        resolve = _resolve;
      });
    }
  }

  /** 异步更新队列 */

  const queue = new Set();
  /** 是否已经有一个队列正在执行了 */

  let waiting = false;
  /**
   * 将一个更新请求放入队列中
   */

  function queueUpdate(dependentsOptions) {
    if (queue.has(dependentsOptions)) {
      return;
    } else {
      queue.add(dependentsOptions);
    } // 如果当前没有异步更新队列在执行
    // 那么就执行当前的异步更新队列
    // 如果有的话
    // 当前的更新请求就会被当前的异步更新队列执行掉


    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
  /**
   * 执行异步更新队列
   */

  function flushSchedulerQueue() {
    for (let dependentsOptions of queue) {
      // 略过在等待队列执行的过程中就已经被更新了的计算属性
      if (dependentsOptions.isComputed && !dependentsOptions.shouldUpdate) {
        continue;
      }

      dependentsOptions.get();
    }

    queue.clear();
    waiting = false;
  }

  /**
   * 依赖集合
   * - 存放所有已收集到的依赖
   * - { id: dependentsOptions, ... }
   */

  const dependentsMap = create(null);
  /**
   * 返回一个方法为传入方法收集依赖
   */

  function createCollectingDependents() {
    const cd = new CollectingDependents(...arguments);
    const {
      get,
      id
    } = cd; // 存储当前方法的依赖
    // 可以在下次收集依赖的时候对这次收集的依赖进行清空

    dependentsMap[id] = cd; // 存储当前收集依赖的 ID 到方法
    // - 未被其它方法依赖的计算属性可以用它来获取依赖参数判断是否被更新

    get.id = id;
    return get;
  }

  class CollectingDependents {
    /**
     * @param {function} fn 需要收集依赖的方法
     * @param {boolean} isComputed 是否是计算属性
     * @param {boolean} isWatch 是否是用于创建监听方法
     * @param {boolean} isWatchDeep 是否是用于创建深度监听
     */
    constructor(fn, isComputed, isWatch, isWatchDeep, observeOptions, name) {
      // 当前方法收集依赖的 ID, 用于从 dependentsMap ( 存储 / 读取 ) 依赖项
      this.id = uid$1(); // 当前方法的依赖存储数组

      this.deps = new Set(); // 需要收集依赖的方法

      this.fn = fn; // 当其中一个依赖更新后, 会调用当前方法重新计算依赖

      this.get = CollectingDependents.get.bind(this); // 存储其他参数

      if (isComputed) {
        let shouldUpdate;
        this.isComputed = isComputed;
        this.observeOptions = observeOptions;
        this.name = name; // 依赖是否需要更新 ( 无依赖时可只在使用时进行更新 )

        define(this, 'shouldUpdate', () => shouldUpdate, value => {
          if (shouldUpdate = value) this.ssu();
        });
      }

      if (isWatch) {
        this.isWatch = isWatch;
        this.isWatchDeep = isWatchDeep;
      }
    }
    /** 传入方法的依赖收集包装 */


    static get(result) {
      // 清空依赖
      this.cleanDeps(); // 标记已初始化

      this.isInit = true; // 标记计算属性已无需更新

      if (this.isComputed) this.shouldUpdate = false; // 开始收集依赖

      targetStack.push(this); // 执行方法
      // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps

      result = this.fn(); // 需要进行深度监听

      if (this.isWatchDeep) this.wd(result); // 方法执行完成, 则依赖收集完成

      targetStack.pop(this);
      return result;
    }
    /** 依赖的重新收集 */


    update() {
      queueUpdate(this);
    }
    /** 清空之前收集的依赖 */


    cleanDeps() {
      // 对之前收集的依赖进行清空
      for (let watch of this.deps) watch.delete(this); // 清空依赖


      this.deps.clear();
    }
    /** 仅为监听方法时使用 -> 对依赖的最终返回值进行深度监听 ( watch deep ) */


    wd(result) {
      isObject(result) && observeProxyMap.get(result).deepWatches.add(this);
    }
    /** 仅为计算属性时使用 -> 遍历依赖于当前计算属性的依赖参数 ( each ) */


    ec(callback) {
      let {
        watches
      } = this.observeOptions;
      let watch;

      if (watches && (watch = watches[this.name]) && watch.size) {
        for (let cd of watch) if (callback(cd) === false) break;
      }
    }
    /** 仅为计算属性时使用 -> 递归设置当前计算属性的依赖计算属性需要更新 ( set should update ) */


    ssu() {
      this.ec(cd => {
        if (cd.isComputed && cd.lazy) {
          cd.shouldUpdate = true;
        }
      });
    }
    /** 仅为计算属性时使用 -> 判断当前计算属性是否没有依赖 */


    get lazy() {
      let lazy = true;
      this.ec(cd => {
        // 依赖是监听方法          依赖是 render 方法                依赖是计算属性且有依赖
        if (cd.isWatch || !cd.isComputed && !cd.isWatch || cd.isComputed && !cd.lazy) {
          return lazy = false;
        }
      });
      return lazy;
    }

  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const directives = new WeakMap();
  /**
   * Brands a function as a directive so that lit-html will call the function
   * during template rendering, rather than passing as a value.
   *
   * @param f The directive factory function. Must be a function that returns a
   * function of the signature `(part: Part) => void`. The returned function will
   * be called with the part object
   *
   * @example
   *
   * ```
   * import {directive, html} from 'lit-html';
   *
   * const immutable = directive((v) => (part) => {
   *   if (part.value !== v) {
   *     part.setValue(v)
   *   }
   * });
   * ```
   */
  // tslint:disable-next-line:no-any

  const directive = f => (...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
  };
  const isDirective = o => {
    return typeof o === 'function' && directives.has(o);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * True if the custom elements polyfill is in use.
   */
  const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
  /**
   * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
   * (exclusive), into another container (could be the same container), before
   * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
   * container.
   */

  const reparentNodes = (container, start, end = null, before = null) => {
    let node = start;

    while (node !== end) {
      const n = node.nextSibling;
      container.insertBefore(node, before);
      node = n;
    }
  };
  /**
   * Removes nodes, starting from `startNode` (inclusive) to `endNode`
   * (exclusive), from `container`.
   */

  const removeNodes = (container, startNode, endNode = null) => {
    let node = startNode;

    while (node !== endNode) {
      const n = node.nextSibling;
      container.removeChild(node);
      node = n;
    }
  };

  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */
  const noChange = {};
  /**
   * A sentinel value that signals a NodePart to fully clear its content.
   */

  const nothing = {};

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */
  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  /**
   * An expression marker used text-positions, multi-binding attributes, and
   * attributes with markup-like text values.
   */

  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  /**
   * Suffix appended to all bound attribute names.
   */

  const boundAttributeSuffix = '$lit$';
  /**
   * An updateable Template that tracks the location of dynamic parts.
   */

  class Template {
    constructor(result, element) {
      this.parts = [];
      this.element = element;
      let index = -1;
      let partIndex = 0;
      const nodesToRemove = [];

      const _prepareTemplate = template => {
        const content = template.content; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
        // null

        const walker = document.createTreeWalker(content, 133
        /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
        , null, false); // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.

        let lastPartIndex = 0;

        while (walker.nextNode()) {
          index++;
          const node = walker.currentNode;

          if (node.nodeType === 1
          /* Node.ELEMENT_NODE */
          ) {
              if (node.hasAttributes()) {
                const attributes = node.attributes; // Per
                // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                // attributes are not guaranteed to be returned in document order.
                // In particular, Edge/IE can return them out of order, so we cannot
                // assume a correspondance between part index and attribute index.

                let count = 0;

                for (let i = 0; i < attributes.length; i++) {
                  if (attributes[i].value.indexOf(marker) >= 0) {
                    count++;
                  }
                }

                while (count-- > 0) {
                  // Get the template literal section leading up to the first
                  // expression in this attribute
                  const stringForPart = result.strings[partIndex]; // Find the attribute name

                  const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                  // All bound attributes have had a suffix added in
                  // TemplateResult#getHTML to opt out of special attribute
                  // handling. To look up the attribute value we also need to add
                  // the suffix.

                  const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                  const attributeValue = node.getAttribute(attributeLookupName);
                  const strings = attributeValue.split(markerRegex);
                  this.parts.push({
                    type: 'attribute',
                    index,
                    name,
                    strings
                  });
                  node.removeAttribute(attributeLookupName);
                  partIndex += strings.length - 1;
                }
              }

              if (node.tagName === 'TEMPLATE') {
                _prepareTemplate(node);
              }
            } else if (node.nodeType === 3
          /* Node.TEXT_NODE */
          ) {
              const data = node.data;

              if (data.indexOf(marker) >= 0) {
                const parent = node.parentNode;
                const strings = data.split(markerRegex);
                const lastIndex = strings.length - 1; // Generate a new text node for each literal section
                // These nodes are also used as the markers for node parts

                for (let i = 0; i < lastIndex; i++) {
                  parent.insertBefore(strings[i] === '' ? createMarker() : document.createTextNode(strings[i]), node);
                  this.parts.push({
                    type: 'node',
                    index: ++index
                  });
                } // If there's no text, we must insert a comment to mark our place.
                // Else, we can trust it will stick around after cloning.


                if (strings[lastIndex] === '') {
                  parent.insertBefore(createMarker(), node);
                  nodesToRemove.push(node);
                } else {
                  node.data = strings[lastIndex];
                } // We have a part for each match found


                partIndex += lastIndex;
              }
            } else if (node.nodeType === 8
          /* Node.COMMENT_NODE */
          ) {
              if (node.data === marker) {
                const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
                // the following are true:
                //  * We don't have a previousSibling
                //  * The previousSibling is already the start of a previous part

                if (node.previousSibling === null || index === lastPartIndex) {
                  index++;
                  parent.insertBefore(createMarker(), node);
                }

                lastPartIndex = index;
                this.parts.push({
                  type: 'node',
                  index
                }); // If we don't have a nextSibling, keep this node so we have an end.
                // Else, we can remove it to save future costs.

                if (node.nextSibling === null) {
                  node.data = '';
                } else {
                  nodesToRemove.push(node);
                  index--;
                }

                partIndex++;
              } else {
                let i = -1;

                while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                  // Comment node has a binding marker inside, make an inactive part
                  // The binding won't work, but subsequent bindings will
                  // TODO (justinfagnani): consider whether it's even worth it to
                  // make bindings in comments work
                  this.parts.push({
                    type: 'node',
                    index: -1
                  });
                }
              }
            }
        }
      };

      _prepareTemplate(element); // Remove text binding nodes after the walk to not disturb the TreeWalker


      for (const n of nodesToRemove) {
        n.parentNode.removeChild(n);
      }
    }

  }
  const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
  // small manual size-savings.

  const createMarker = () => document.createComment('');
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#attributes-0
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-character
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */

  const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */

  class TemplateInstance {
    constructor(template, processor, options) {
      this._parts = [];
      this.template = template;
      this.processor = processor;
      this.options = options;
    }

    update(values) {
      let i = 0;

      for (const part of this._parts) {
        if (part !== undefined) {
          part.setValue(values[i]);
        }

        i++;
      }

      for (const part of this._parts) {
        if (part !== undefined) {
          part.commit();
        }
      }
    }

    _clone() {
      // When using the Custom Elements polyfill, clone the node, rather than
      // importing it, to keep the fragment in the template's document. This
      // leaves the fragment inert so custom elements won't upgrade and
      // potentially modify their contents by creating a polyfilled ShadowRoot
      // while we traverse the tree.
      const fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
      const parts = this.template.parts;
      let partIndex = 0;
      let nodeIndex = 0;

      const _prepareInstance = fragment => {
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
        // null
        const walker = document.createTreeWalker(fragment, 133
        /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
        , null, false);
        let node = walker.nextNode(); // Loop through all the nodes and parts of a template

        while (partIndex < parts.length && node !== null) {
          const part = parts[partIndex]; // Consecutive Parts may have the same node index, in the case of
          // multiple bound attributes on an element. So each iteration we either
          // increment the nodeIndex, if we aren't on a node with a part, or the
          // partIndex if we are. By not incrementing the nodeIndex when we find a
          // part, we allow for the next part to be associated with the current
          // node if neccessasry.

          if (!isTemplatePartActive(part)) {
            this._parts.push(undefined);

            partIndex++;
          } else if (nodeIndex === part.index) {
            if (part.type === 'node') {
              const part = this.processor.handleTextExpression(this.options);
              part.insertAfterNode(node.previousSibling);

              this._parts.push(part);
            } else {
              this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }

            partIndex++;
          } else {
            nodeIndex++;

            if (node.nodeName === 'TEMPLATE') {
              _prepareInstance(node.content);
            }

            node = walker.nextNode();
          }
        }
      };

      _prepareInstance(fragment);

      if (isCEPolyfill) {
        document.adoptNode(fragment);
        customElements.upgrade(fragment);
      }

      return fragment;
    }

  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */

  class TemplateResult {
    constructor(strings, values, type, processor) {
      this.strings = strings;
      this.values = values;
      this.type = type;
      this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */


    getHTML() {
      const endIndex = this.strings.length - 1;
      let html = '';

      for (let i = 0; i < endIndex; i++) {
        const s = this.strings[i]; // This exec() call does two things:
        // 1) Appends a suffix to the bound attribute name to opt out of special
        // attribute value parsing that IE11 and Edge do, like for style and
        // many SVG attributes. The Template class also appends the same suffix
        // when looking up attributes to create Parts.
        // 2) Adds an unquoted-attribute-safe marker for the first expression in
        // an attribute. Subsequent attribute expressions will use node markers,
        // and this is safe since attributes with multiple expressions are
        // guaranteed to be quoted.

        const match = lastAttributeNameRegex.exec(s);

        if (match) {
          // We're starting a new bound attribute.
          // Add the safe attribute suffix, and use unquoted-attribute-safe
          // marker.
          html += s.substr(0, match.index) + match[1] + match[2] + boundAttributeSuffix + match[3] + marker;
        } else {
          // We're either in a bound node, or trailing bound attribute.
          // Either way, nodeMarker is safe to use.
          html += s + nodeMarker;
        }
      }

      return html + this.strings[endIndex];
    }

    getTemplateElement() {
      const template = document.createElement('template');
      template.innerHTML = this.getHTML();
      return template;
    }

  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const isPrimitive = value => {
    return value === null || !(typeof value === 'object' || typeof value === 'function');
  };
  /**
   * Sets attribute values for AttributeParts, so that the value is only set once
   * even if there are multiple parts for an attribute.
   */

  class AttributeCommitter {
    constructor(element, name, strings) {
      this.dirty = true;
      this.element = element;
      this.name = name;
      this.strings = strings;
      this.parts = [];

      for (let i = 0; i < strings.length - 1; i++) {
        this.parts[i] = this._createPart();
      }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */


    _createPart() {
      return new AttributePart(this);
    }

    _getValue() {
      const strings = this.strings;
      const l = strings.length - 1;
      let text = '';

      for (let i = 0; i < l; i++) {
        text += strings[i];
        const part = this.parts[i];

        if (part !== undefined) {
          const v = part.value;

          if (v != null && (Array.isArray(v) || // tslint:disable-next-line:no-any
          typeof v !== 'string' && v[Symbol.iterator])) {
            for (const t of v) {
              text += typeof t === 'string' ? t : String(t);
            }
          } else {
            text += typeof v === 'string' ? v : String(v);
          }
        }
      }

      text += strings[l];
      return text;
    }

    commit() {
      if (this.dirty) {
        this.dirty = false;
        this.element.setAttribute(this.name, this._getValue());
      }
    }

  }
  class AttributePart {
    constructor(comitter) {
      this.value = undefined;
      this.committer = comitter;
    }

    setValue(value) {
      if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
        this.value = value; // If the value is a not a directive, dirty the committer so that it'll
        // call setAttribute. If the value is a directive, it'll dirty the
        // committer if it calls setValue().

        if (!isDirective(value)) {
          this.committer.dirty = true;
        }
      }
    }

    commit() {
      while (isDirective(this.value)) {
        const directive$$1 = this.value;
        this.value = noChange;
        directive$$1(this);
      }

      if (this.value === noChange) {
        return;
      }

      this.committer.commit();
    }

  }
  class NodePart {
    constructor(options) {
      this.value = undefined;
      this._pendingValue = undefined;
      this.options = options;
    }
    /**
     * Inserts this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    appendInto(container) {
      this.startNode = container.appendChild(createMarker());
      this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
     * its next sibling must be static, unchanging nodes such as those that appear
     * in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    insertAfterNode(ref) {
      this.startNode = ref;
      this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    appendIntoPart(part) {
      part._insert(this.startNode = createMarker());

      part._insert(this.endNode = createMarker());
    }
    /**
     * Appends this part after `ref`
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    insertAfterPart(ref) {
      ref._insert(this.startNode = createMarker());

      this.endNode = ref.endNode;
      ref.endNode = this.startNode;
    }

    setValue(value) {
      this._pendingValue = value;
    }

    commit() {
      while (isDirective(this._pendingValue)) {
        const directive$$1 = this._pendingValue;
        this._pendingValue = noChange;
        directive$$1(this);
      }

      const value = this._pendingValue;

      if (value === noChange) {
        return;
      }

      if (isPrimitive(value)) {
        if (value !== this.value) {
          this._commitText(value);
        }
      } else if (value instanceof TemplateResult) {
        this._commitTemplateResult(value);
      } else if (value instanceof Node) {
        this._commitNode(value);
      } else if (Array.isArray(value) || // tslint:disable-next-line:no-any
      value[Symbol.iterator]) {
        this._commitIterable(value);
      } else if (value === nothing) {
        this.value = nothing;
        this.clear();
      } else {
        // Fallback, will render the string representation
        this._commitText(value);
      }
    }

    _insert(node) {
      this.endNode.parentNode.insertBefore(node, this.endNode);
    }

    _commitNode(value) {
      if (this.value === value) {
        return;
      }

      this.clear();

      this._insert(value);

      this.value = value;
    }

    _commitText(value) {
      const node = this.startNode.nextSibling;
      value = value == null ? '' : value;

      if (node === this.endNode.previousSibling && node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          // If we only have a single text node between the markers, we can just
          // set its value, rather than replacing it.
          // TODO(justinfagnani): Can we just check if this.value is primitive?
          node.data = value;
        } else {
        this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
      }

      this.value = value;
    }

    _commitTemplateResult(value) {
      const template = this.options.templateFactory(value);

      if (this.value instanceof TemplateInstance && this.value.template === template) {
        this.value.update(value.values);
      } else {
        // Make sure we propagate the template processor from the TemplateResult
        // so that we use its syntax extension, etc. The template factory comes
        // from the render function options so that it can control template
        // caching and preprocessing.
        const instance = new TemplateInstance(template, value.processor, this.options);

        const fragment = instance._clone();

        instance.update(value.values);

        this._commitNode(fragment);

        this.value = instance;
      }
    }

    _commitIterable(value) {
      // For an Iterable, we create a new InstancePart per item, then set its
      // value to the item. This is a little bit of overhead for every item in
      // an Iterable, but it lets us recurse easily and efficiently update Arrays
      // of TemplateResults that will be commonly returned from expressions like:
      // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
      // If _value is an array, then the previous render was of an
      // iterable and _value will contain the NodeParts from the previous
      // render. If _value is not an array, clear this part and make a new
      // array for NodeParts.
      if (!Array.isArray(this.value)) {
        this.value = [];
        this.clear();
      } // Lets us keep track of how many items we stamped so we can clear leftover
      // items from a previous render


      const itemParts = this.value;
      let partIndex = 0;
      let itemPart;

      for (const item of value) {
        // Try to reuse an existing part
        itemPart = itemParts[partIndex]; // If no existing part, create a new one

        if (itemPart === undefined) {
          itemPart = new NodePart(this.options);
          itemParts.push(itemPart);

          if (partIndex === 0) {
            itemPart.appendIntoPart(this);
          } else {
            itemPart.insertAfterPart(itemParts[partIndex - 1]);
          }
        }

        itemPart.setValue(item);
        itemPart.commit();
        partIndex++;
      }

      if (partIndex < itemParts.length) {
        // Truncate the parts array so _value reflects the current state
        itemParts.length = partIndex;
        this.clear(itemPart && itemPart.endNode);
      }
    }

    clear(startNode = this.startNode) {
      removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }

  }
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */

  class BooleanAttributePart {
    constructor(element, name, strings) {
      this.value = undefined;
      this._pendingValue = undefined;

      if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
        throw new Error('Boolean attributes can only contain a single expression');
      }

      this.element = element;
      this.name = name;
      this.strings = strings;
    }

    setValue(value) {
      this._pendingValue = value;
    }

    commit() {
      while (isDirective(this._pendingValue)) {
        const directive$$1 = this._pendingValue;
        this._pendingValue = noChange;
        directive$$1(this);
      }

      if (this._pendingValue === noChange) {
        return;
      }

      const value = !!this._pendingValue;

      if (this.value !== value) {
        if (value) {
          this.element.setAttribute(this.name, '');
        } else {
          this.element.removeAttribute(this.name);
        }
      }

      this.value = value;
      this._pendingValue = noChange;
    }

  }
  /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */

  class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
      super(element, name, strings);
      this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
    }

    _createPart() {
      return new PropertyPart(this);
    }

    _getValue() {
      if (this.single) {
        return this.parts[0].value;
      }

      return super._getValue();
    }

    commit() {
      if (this.dirty) {
        this.dirty = false; // tslint:disable-next-line:no-any

        this.element[this.name] = this._getValue();
      }
    }

  }
  class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
  // from the options object, then options are supported. If not, then the thrid
  // argument to add/removeEventListener is interpreted as the boolean capture
  // value so we should only pass the `capture` property.

  let eventOptionsSupported = false;

  try {
    const options = {
      get capture() {
        eventOptionsSupported = true;
        return false;
      }

    }; // tslint:disable-next-line:no-any

    window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

    window.removeEventListener('test', options, options);
  } catch (_e) {}

  class EventPart {
    constructor(element, eventName, eventContext) {
      this.value = undefined;
      this._pendingValue = undefined;
      this.element = element;
      this.eventName = eventName;
      this.eventContext = eventContext;

      this._boundHandleEvent = e => this.handleEvent(e);
    }

    setValue(value) {
      this._pendingValue = value;
    }

    commit() {
      while (isDirective(this._pendingValue)) {
        const directive$$1 = this._pendingValue;
        this._pendingValue = noChange;
        directive$$1(this);
      }

      if (this._pendingValue === noChange) {
        return;
      }

      const newListener = this._pendingValue;
      const oldListener = this.value;
      const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
      const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

      if (shouldRemoveListener) {
        this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options);
      }

      if (shouldAddListener) {
        this._options = getOptions(newListener);
        this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options);
      }

      this.value = newListener;
      this._pendingValue = noChange;
    }

    handleEvent(event) {
      if (typeof this.value === 'function') {
        this.value.call(this.eventContext || this.element, event);
      } else {
        this.value.handleEvent(event);
      }
    }

  } // We copy options because of the inconsistent behavior of browsers when reading
  // the third argument of add/removeEventListener. IE11 doesn't support options
  // at all. Chrome 41 only reads `capture` if the argument is an object.

  const getOptions = o => o && (eventOptionsSupported ? {
    capture: o.capture,
    passive: o.passive,
    once: o.once
  } : o.capture);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The default TemplateFactory which caches Templates keyed on
   * result.type and result.strings.
   */

  function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);

    if (templateCache === undefined) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      };
      templateCaches.set(result.type, templateCache);
    }

    let template = templateCache.stringsArray.get(result.strings);

    if (template !== undefined) {
      return template;
    } // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content


    const key = result.strings.join(marker); // Check if we already have a Template for this key

    template = templateCache.keyString.get(key);

    if (template === undefined) {
      // If we have not seen this key before, create a new Template
      template = new Template(result, result.getTemplateElement()); // Cache the Template for this key

      templateCache.keyString.set(key, template);
    } // Cache all future queries for this TemplateStringsArray


    templateCache.stringsArray.set(result.strings, template);
    return template;
  }
  const templateCaches = new Map();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const parts = new WeakMap();
  /**
   * Renders a template to a container.
   *
   * To update a container with new values, reevaluate the template literal and
   * call `render` with the new result.
   *
   * @param result a TemplateResult created by evaluating a template tag like
   *     `html` or `svg`.
   * @param container A DOM parent to render to. The entire contents are either
   *     replaced, or efficiently updated if the same result type was previous
   *     rendered there.
   * @param options RenderOptions for the entire render tree rendered to this
   *     container. Render options must *not* change between renders to the same
   *     container, as those changes will not effect previously rendered DOM.
   */

  const render = (result, container, options) => {
    let part = parts.get(container);

    if (part === undefined) {
      removeNodes(container, container.firstChild);
      parts.set(container, part = new NodePart(Object.assign({
        templateFactory
      }, options)));
      part.appendInto(container);
    }

    part.setValue(result);
    part.commit();
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time

  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.0.0');

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // TODO(kschaaf): Refactor into Part API?

  const createAndInsertPart = (containerPart, beforePart) => {
    const container = containerPart.startNode.parentNode;
    const beforeNode = beforePart === undefined ? containerPart.endNode : beforePart.startNode;
    const startNode = container.insertBefore(createMarker(), beforeNode);
    container.insertBefore(createMarker(), beforeNode);
    const newPart = new NodePart(containerPart.options);
    newPart.insertAfterNode(startNode);
    return newPart;
  };

  const updatePart = (part, value) => {
    part.setValue(value);
    part.commit();
    return part;
  };

  const insertPartBefore = (containerPart, part, ref) => {
    const container = containerPart.startNode.parentNode;
    const beforeNode = ref ? ref.startNode : containerPart.endNode;
    const endNode = part.endNode.nextSibling;

    if (endNode !== beforeNode) {
      reparentNodes(container, part.startNode, endNode, beforeNode);
    }
  };

  const removePart = part => {
    removeNodes(part.startNode.parentNode, part.startNode, part.endNode.nextSibling);
  }; // Helper for generating a map of array item to its index over a subset
  // of an array (used to lazily generate `newKeyToIndexMap` and
  // `oldKeyToIndexMap`)


  const generateMap = (list, start, end) => {
    const map = new Map();

    for (let i = start; i <= end; i++) {
      map.set(list[i], i);
    }

    return map;
  }; // Stores previous ordered list of parts and map of key to index


  const partListCache = new WeakMap();
  const keyListCache = new WeakMap();
  /**
   * A directive that repeats a series of values (usually `TemplateResults`)
   * generated from an iterable, and updates those items efficiently when the
   * iterable changes based on user-provided `keys` associated with each item.
   *
   * Note that if a `keyFn` is provided, strict key-to-DOM mapping is maintained,
   * meaning previous DOM for a given key is moved into the new position if
   * needed, and DOM will never be reused with values for different keys (new DOM
   * will always be created for new keys). This is generally the most efficient
   * way to use `repeat` since it performs minimum unnecessary work for insertions
   * amd removals.
   *
   * IMPORTANT: If providing a `keyFn`, keys *must* be unique for all items in a
   * given call to `repeat`. The behavior when two or more items have the same key
   * is undefined.
   *
   * If no `keyFn` is provided, this directive will perform similar to mapping
   * items to values, and DOM will be reused against potentially different items.
   */

  const repeat = directive((items, keyFnOrTemplate, template) => {
    let keyFn;

    if (template === undefined) {
      template = keyFnOrTemplate;
    } else if (keyFnOrTemplate !== undefined) {
      keyFn = keyFnOrTemplate;
    }

    return containerPart => {
      if (!(containerPart instanceof NodePart)) {
        throw new Error('repeat can only be used in text bindings');
      } // Old part & key lists are retrieved from the last update
      // (associated with the part for this instance of the directive)


      const oldParts = partListCache.get(containerPart) || [];
      const oldKeys = keyListCache.get(containerPart) || []; // New part list will be built up as we go (either reused from
      // old parts or created for new keys in this update). This is
      // saved in the above cache at the end of the update.

      const newParts = []; // New value list is eagerly generated from items along with a
      // parallel array indicating its key.

      const newValues = [];
      const newKeys = [];
      let index = 0;

      for (const item of items) {
        newKeys[index] = keyFn ? keyFn(item, index) : index;
        newValues[index] = template(item, index);
        index++;
      } // Maps from key to index for current and previous update; these
      // are generated lazily only when needed as a performance
      // optimization, since they are only required for multiple
      // non-contiguous changes in the list, which are less common.


      let newKeyToIndexMap;
      let oldKeyToIndexMap; // Head and tail pointers to old parts and new values

      let oldHead = 0;
      let oldTail = oldParts.length - 1;
      let newHead = 0;
      let newTail = newValues.length - 1; // Overview of O(n) reconciliation algorithm (general approach
      // based on ideas found in ivi, vue, snabbdom, etc.):
      //
      // * We start with the list of old parts and new values (and
      // arrays of
      //   their respective keys), head/tail pointers into each, and
      //   we build up the new list of parts by updating (and when
      //   needed, moving) old parts or creating new ones. The initial
      //   scenario might look like this (for brevity of the diagrams,
      //   the numbers in the array reflect keys associated with the
      //   old parts or new values, although keys and parts/values are
      //   actually stored in parallel arrays indexed using the same
      //   head/tail pointers):
      //
      //      oldHead v                 v oldTail
      //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
      //   newParts: [ ,  ,  ,  ,  ,  ,  ]
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6] <- reflects the user's new
      //   item order
      //      newHead ^                 ^ newTail
      //
      // * Iterate old & new lists from both sides, updating,
      // swapping, or
      //   removing parts at the head/tail locations until neither
      //   head nor tail can move.
      //
      // * Example below: keys at head pointers match, so update old
      // part 0 in-
      //   place (no need to move it) and record part 0 in the
      //   `newParts` list. The last thing we do is advance the
      //   `oldHead` and `newHead` pointers (will be reflected in the
      //   next diagram).
      //
      //      oldHead v                 v oldTail
      //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
      //   newParts: [0,  ,  ,  ,  ,  ,  ] <- heads matched: update 0
      //   and newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance both oldHead
      //   & newHead
      //      newHead ^                 ^ newTail
      //
      // * Example below: head pointers don't match, but tail pointers
      // do, so
      //   update part 6 in place (no need to move it), and record
      //   part 6 in the `newParts` list. Last, advance the `oldTail`
      //   and `oldHead` pointers.
      //
      //         oldHead v              v oldTail
      //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
      //   newParts: [0,  ,  ,  ,  ,  , 6] <- tails matched: update 6
      //   and newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance both oldTail
      //   & newTail
      //         newHead ^              ^ newTail
      //
      // * If neither head nor tail match; next check if one of the
      // old head/tail
      //   items was removed. We first need to generate the reverse
      //   map of new keys to index (`newKeyToIndexMap`), which is
      //   done once lazily as a performance optimization, since we
      //   only hit this case if multiple non-contiguous changes were
      //   made. Note that for contiguous removal anywhere in the
      //   list, the head and tails would advance from either end and
      //   pass each other before we get to this case and removals
      //   would be handled in the final while loop without needing to
      //   generate the map.
      //
      // * Example below: The key at `oldTail` was removed (no longer
      // in the
      //   `newKeyToIndexMap`), so remove that part from the DOM and
      //   advance just the `oldTail` pointer.
      //
      //         oldHead v           v oldTail
      //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
      //   newParts: [0,  ,  ,  ,  ,  , 6] <- 5 not in new map; remove
      //   5 and newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance oldTail
      //         newHead ^           ^ newTail
      //
      // * Once head and tail cannot move, any mismatches are due to
      // either new or
      //   moved items; if a new key is in the previous "old key to
      //   old index" map, move the old part to the new location,
      //   otherwise create and insert a new part. Note that when
      //   moving an old part we null its position in the oldParts
      //   array if it lies between the head and tail so we know to
      //   skip it when the pointers get there.
      //
      // * Example below: neither head nor tail match, and neither
      // were removed;
      //   so find the `newHead` key in the `oldKeyToIndexMap`, and
      //   move that old part's DOM into the next head position
      //   (before `oldParts[oldHead]`). Last, null the part in the
      //   `oldPart` array since it was somewhere in the remaining
      //   oldParts still to be scanned (between the head and tail
      //   pointers) so that we know to skip that old part on future
      //   iterations.
      //
      //         oldHead v        v oldTail
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
      //   newParts: [0, 2,  ,  ,  ,  , 6] <- stuck; update & move 2
      //   into place newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance
      //   newHead
      //         newHead ^           ^ newTail
      //
      // * Note that for moves/insertions like the one above, a part
      // inserted at
      //   the head pointer is inserted before the current
      //   `oldParts[oldHead]`, and a part inserted at the tail
      //   pointer is inserted before `newParts[newTail+1]`. The
      //   seeming asymmetry lies in the fact that new parts are moved
      //   into place outside in, so to the right of the head pointer
      //   are old parts, and to the right of the tail pointer are new
      //   parts.
      //
      // * We always restart back from the top of the algorithm,
      // allowing matching
      //   and simple updates in place to continue...
      //
      // * Example below: the head pointers once again match, so
      // simply update
      //   part 1 and record it in the `newParts` array.  Last,
      //   advance both head pointers.
      //
      //         oldHead v        v oldTail
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
      //   newParts: [0, 2, 1,  ,  ,  , 6] <- heads matched; update 1
      //   and newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance both oldHead
      //   & newHead
      //            newHead ^        ^ newTail
      //
      // * As mentioned above, items that were moved as a result of
      // being stuck
      //   (the final else clause in the code below) are marked with
      //   null, so we always advance old pointers over these so we're
      //   comparing the next actual old value on either end.
      //
      // * Example below: `oldHead` is null (already placed in
      // newParts), so
      //   advance `oldHead`.
      //
      //            oldHead v     v oldTail
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6] // old head already used;
      //   advance newParts: [0, 2, 1,  ,  ,  , 6] // oldHead newKeys:
      //   [0, 2, 1, 4, 3, 7, 6]
      //               newHead ^     ^ newTail
      //
      // * Note it's not critical to mark old parts as null when they
      // are moved
      //   from head to tail or tail to head, since they will be
      //   outside the pointer range and never visited again.
      //
      // * Example below: Here the old tail key matches the new head
      // key, so
      //   the part at the `oldTail` position and move its DOM to the
      //   new head position (before `oldParts[oldHead]`). Last,
      //   advance `oldTail` and `newHead` pointers.
      //
      //               oldHead v  v oldTail
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
      //   newParts: [0, 2, 1, 4,  ,  , 6] <- old tail matches new
      //   head: update newKeys:  [0, 2, 1, 4, 3, 7, 6]   & move 4,
      //   advance oldTail & newHead
      //               newHead ^     ^ newTail
      //
      // * Example below: Old and new head keys match, so update the
      // old head
      //   part in place, and advance the `oldHead` and `newHead`
      //   pointers.
      //
      //               oldHead v oldTail
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
      //   newParts: [0, 2, 1, 4, 3,   ,6] <- heads match: update 3
      //   and advance newKeys:  [0, 2, 1, 4, 3, 7, 6]    oldHead &
      //   newHead
      //                  newHead ^  ^ newTail
      //
      // * Once the new or old pointers move past each other then all
      // we have
      //   left is additions (if old list exhausted) or removals (if
      //   new list exhausted). Those are handled in the final while
      //   loops at the end.
      //
      // * Example below: `oldHead` exceeded `oldTail`, so we're done
      // with the
      //   main loop.  Create the remaining part and insert it at the
      //   new head position, and the update is complete.
      //
      //                   (oldHead > oldTail)
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
      //   newParts: [0, 2, 1, 4, 3, 7 ,6] <- create and insert 7
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
      //                     newHead ^ newTail
      //
      // * Note that the order of the if/else clauses is not important
      // to the
      //   algorithm, as long as the null checks come first (to ensure
      //   we're always working on valid old parts) and that the final
      //   else clause comes last (since that's where the expensive
      //   moves occur). The order of remaining clauses is is just a
      //   simple guess at which cases will be most common.
      //
      // * TODO(kschaaf) Note, we could calculate the longest
      // increasing
      //   subsequence (LIS) of old items in new position, and only
      //   move those not in the LIS set. However that costs O(nlogn)
      //   time and adds a bit more code, and only helps make rare
      //   types of mutations require fewer moves. The above handles
      //   removes, adds, reversal, swaps, and single moves of
      //   contiguous items in linear time, in the minimum number of
      //   moves. As the number of multiple moves where LIS might help
      //   approaches a random shuffle, the LIS optimization becomes
      //   less helpful, so it seems not worth the code at this point.
      //   Could reconsider if a compelling case arises.

      while (oldHead <= oldTail && newHead <= newTail) {
        if (oldParts[oldHead] === null) {
          // `null` means old part at head has already been used
          // below; skip
          oldHead++;
        } else if (oldParts[oldTail] === null) {
          // `null` means old part at tail has already been used
          // below; skip
          oldTail--;
        } else if (oldKeys[oldHead] === newKeys[newHead]) {
          // Old head matches new head; update in place
          newParts[newHead] = updatePart(oldParts[oldHead], newValues[newHead]);
          oldHead++;
          newHead++;
        } else if (oldKeys[oldTail] === newKeys[newTail]) {
          // Old tail matches new tail; update in place
          newParts[newTail] = updatePart(oldParts[oldTail], newValues[newTail]);
          oldTail--;
          newTail--;
        } else if (oldKeys[oldHead] === newKeys[newTail]) {
          // Old head matches new tail; update and move to new tail
          newParts[newTail] = updatePart(oldParts[oldHead], newValues[newTail]);
          insertPartBefore(containerPart, oldParts[oldHead], newParts[newTail + 1]);
          oldHead++;
          newTail--;
        } else if (oldKeys[oldTail] === newKeys[newHead]) {
          // Old tail matches new head; update and move to new head
          newParts[newHead] = updatePart(oldParts[oldTail], newValues[newHead]);
          insertPartBefore(containerPart, oldParts[oldTail], oldParts[oldHead]);
          oldTail--;
          newHead++;
        } else {
          if (newKeyToIndexMap === undefined) {
            // Lazily generate key-to-index maps, used for removals &
            // moves below
            newKeyToIndexMap = generateMap(newKeys, newHead, newTail);
            oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail);
          }

          if (!newKeyToIndexMap.has(oldKeys[oldHead])) {
            // Old head is no longer in new list; remove
            removePart(oldParts[oldHead]);
            oldHead++;
          } else if (!newKeyToIndexMap.has(oldKeys[oldTail])) {
            // Old tail is no longer in new list; remove
            removePart(oldParts[oldTail]);
            oldTail--;
          } else {
            // Any mismatches at this point are due to additions or
            // moves; see if we have an old part we can reuse and move
            // into place
            const oldIndex = oldKeyToIndexMap.get(newKeys[newHead]);
            const oldPart = oldIndex !== undefined ? oldParts[oldIndex] : null;

            if (oldPart === null) {
              // No old part for this value; create a new one and
              // insert it
              const newPart = createAndInsertPart(containerPart, oldParts[oldHead]);
              updatePart(newPart, newValues[newHead]);
              newParts[newHead] = newPart;
            } else {
              // Reuse old part
              newParts[newHead] = updatePart(oldPart, newValues[newHead]);
              insertPartBefore(containerPart, oldPart, oldParts[oldHead]); // This marks the old part as having been used, so that
              // it will be skipped in the first two checks above

              oldParts[oldIndex] = null;
            }

            newHead++;
          }
        }
      } // Add parts for any remaining new values


      while (newHead <= newTail) {
        // For all remaining additions, we insert before last new
        // tail, since old pointers are no longer valid
        const newPart = createAndInsertPart(containerPart, newParts[newTail + 1]);
        updatePart(newPart, newValues[newHead]);
        newParts[newHead++] = newPart;
      } // Remove any remaining unused old parts


      while (oldHead <= oldTail) {
        const oldPart = oldParts[oldHead++];

        if (oldPart !== null) {
          removePart(oldPart);
        }
      } // Save order of new parts for next round


      partListCache.set(containerPart, newParts);
      keyListCache.set(containerPart, newKeys);
    };
  });

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // unsafeHTML directive, and the DocumentFragment that was last set as a value.
  // The DocumentFragment is used as a unique key to check if the last value
  // rendered to the part was with unsafeHTML. If not, we'll always re-render the
  // value passed to unsafeHTML.

  const previousValues = new WeakMap();
  /**
   * Renders the result as HTML, rather than text.
   *
   * Note, this is unsafe to use with any user-provided input that hasn't been
   * sanitized or escaped, as it may lead to cross-site-scripting
   * vulnerabilities.
   */

  const unsafeHTML = directive(value => part => {
    if (!(part instanceof NodePart)) {
      throw new Error('unsafeHTML can only be used in text bindings');
    }

    const previousValue = previousValues.get(part);

    if (previousValue !== undefined && isPrimitive(value) && value === previousValue.value && part.value === previousValue.fragment) {
      return;
    }

    const template = document.createElement('template');
    template.innerHTML = value; // innerHTML casts to string internally

    const fragment = document.importNode(template.content, true);
    part.setValue(fragment);
    previousValues.set(part, {
      value,
      fragment
    });
  });

  var rWhitespace = /\s+/;

  /**
   * 存放上次设置的 class 内容
   */

  const classesMap = new WeakMap();
  /**
   * 格式化用户传入的 class 内容
   */

  function parseClass(classes, value) {
    switch (typeof value) {
      case 'string':
        {
          value.split(rWhitespace).forEach(name => {
            return classes[name] = true;
          });
          break;
        }


      case 'object':
        {
          if (isArray(value)) {
            value.forEach(name => {
              return parseClass(classes, name);
            });
          } else {
            each(value, (name, truthy) => {
              return truthy ? parseClass(classes, name) : delete classes[name];
            });
          }
        }
    }
  }

  class ClassPart {
    constructor(element) {
      this.element = element;
    }

    setValue(value) {
      parseClass(this.value = {}, value);
    }

    commit() {
      const {
        value: classes,
        element: {
          classList
        }
      } = this; // 非首次运行

      if (classesMap.has(this)) {
        const oldClasses = classesMap.get(this); // 移除旧 class

        each(oldClasses, name => {
          name in classes || classList.remove(name);
        }); // 添加新 class

        each(classes, name => {
          name in oldClasses || classList.add(name);
        });
      } // 首次运行
      else {
          each(classes, name => {
            return classList.add(name);
          });
        } // 保存最新的 classes


      classesMap.set(this, classes);
    }

  }

  var rListDelimiter = /;(?![^(]*\))/g;

  var rPropertyDelimiter = /:(.+)/;

  var parseStyleText = /**
   * 解析 style 字符串, 转换为 JSON 格式
   * @param {String} value
   */
  cached(styleText => {
    const styles = {};
    styleText.split(rListDelimiter).forEach(item => {
      if (item) {
        const tmp = item.split(rPropertyDelimiter);

        if (tmp.length > 1) {
          styles[tmp[0].trim()] = tmp[1].trim();
        }
      }
    });
    return styles;
  });

  /**
   * 存放上次设置的 style 内容
   */

  const styleMap = new WeakMap();
  /**
   * 格式化用户传入的 style 内容
   */

  function parseStyle(styles, value) {
    switch (typeof value) {
      case 'string':
        {
          return parseStyle(styles, parseStyleText(value));
        }


      case 'object':
        {
          if (isArray(value)) {
            value.forEach(value => {
              return parseStyle(styles, value);
            });
          } else {
            each(value, (name, value) => {
              return styles[hyphenate(name)] = value;
            });
          }
        }
    }
  }

  class stylePart {
    constructor(element) {
      this.element = element;
    }

    setValue(value) {
      parseStyle(this.value = {}, value);
    }

    commit() {
      const {
        value: styles,
        element: {
          style
        }
      } = this;
      const oldStyles = styleMap.get(this); // 移除旧 style

      each(oldStyles, (name, value) => {
        name in styles || style.removeProperty(name);
      }); // 添加 style

      each(styles, (name, value) => {
        style.setProperty(name, value);
      }); // 保存最新的 styles

      styleMap.set(this, styles);
    }

  }

  class TemplateProcessor {
    handleAttributeExpressions(element, name, strings, options) {
      const prefix = name[0]; // 用于绑定 DOM 属性 ( property )

      if (prefix === '.') {
        const comitter = new PropertyCommitter(element, name.slice(1), strings);
        return comitter.parts;
      } // 事件绑定
      else if (prefix === '@') {
          return [new EventPart(element, name.slice(1), options.eventContext)];
        } // 若属性的值为真则保留 DOM 属性
        // 否则移除 DOM 属性
        else if (prefix === '?') {
            return [new BooleanAttributePart(element, name.slice(1), strings)];
          } // 扩展属性支持
          else if (prefix === ':') {
              const [currentName, ...options] = name.slice(1).split('.');

              if (currentName in attrHandler) {
                return [new attrHandler[currentName](element, currentName, strings, options)];
              }
            } // 正常属性
            else {
                const comitter = new AttributeCommitter(element, name, strings);
                return comitter.parts;
              }
    }

    handleTextExpression(options) {
      return new NodePart(options);
    }

  }

  var templateProcessor = new TemplateProcessor();
  /**
   * 存放指定属性的特殊处理
   */

  const attrHandler = {
    class: ClassPart,
    style: stylePart
  };

  function html$1(strings, ...values) {
    return new TemplateResult(strings, values, 'html', templateProcessor);
  }

  html$1.repeat = (items, userKey, template) => {
    const key = isString(userKey) ? item => item[userKey] : userKey;
    return repeat(items, key, template);
  };

  html$1.unsafeHTML = html$1.unsafe = unsafeHTML;

  /** 迫使 Hu 实例重新渲染 */

  var initForceUpdate = ((name, target, targetProxy) => {
    /** 当前实例的实例配置 */
    const userRender = optionsMap[name].render;

    if (userRender) {
      target.$forceUpdate = createCollectingDependents(() => {
        const $el = target.$el;

        if ($el) {
          render(userRender.call(targetProxy, html$1), $el);
          target.$refs = getRefs($el);
        }
      });
    } else {
      target.$forceUpdate = noop;
    }
  });

  function getRefs(root) {
    const refs = {};
    const elems = root.querySelectorAll('[ref]');

    if (elems.length) {
      Array.from(elems).forEach(elem => {
        const name = elem.getAttribute('ref');
        refs[name] = refs[name] ? [].concat(refs[name], elem) : elem;
      });
    }

    return Object.freeze(refs);
  }

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  const unicodeLetters = 'a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD';
  const bail = new RegExp(`[^${unicodeLetters}.$_\\d]`);
  /**
   * Transplant from Vue
   */

  function parsePath(path) {
    if (bail.test(path)) {
      return;
    }

    var segments = path.split('.');
    return function () {
      let obj = this;

      for (const segment of segments) {
        if (!obj) return;
        obj = obj[segment];
      }

      return obj;
    };
  }

  var returnFalse = (
  /**
   * 返回 false
   */
  () => false);

  var createComputed = (
  /**
   * @param {{}} computed
   * @param {any} self 计算属性的 this 指向
   * @param {boolean} isWatch 当前是否用于创建监听
   */
  (computed, self, isWatch) => {
    /** 当前计算属性容器的子级的一些参数 */
    const computedOptionsMap = new Map();
    /** 当前计算属性容器对象 */

    const computedTarget = create(null);
    /** 当前计算属性容器的观察者对象 */

    const computedTargetProxy = observe(computedTarget);
    /** 当前计算属性容器的获取与修改拦截器 */

    const computedTargetProxyInterceptor = new Proxy(computedTargetProxy, {
      get: computedTargetProxyInterceptorGet(computedOptionsMap),
      set: computedTargetProxyInterceptorSet(computedOptionsMap),
      deleteProperty: returnFalse
    });
    /** 给当前计算属性添加子级的方法 */

    const appendComputed = createAppendComputed.call(self, computedTarget, computedTargetProxy, computedOptionsMap, isWatch);
    /** 给当前计算属性移除子级的方法, 目前仅有监听需要使用 */

    let removeComputed = isWatch ? createRemoveComputed.call(self, computedOptionsMap) : void 0; // 添加计算属性

    each(computed, appendComputed);
    return [computedTarget, computedTargetProxyInterceptor, appendComputed, removeComputed];
  });
  /**
   * 返回添加单个计算属性的方法
   */

  function createAppendComputed(computedTarget, computedTargetProxy, computedOptionsMap, isWatch) {
    const isComputed = !isWatch;
    const observeOptions = isComputed && observeMap.get(computedTarget);
    /**
     * @param {string} name 计算属性存储的名称
     * @param {{}} computed 计算属性 getter / setter 对象
     * @param {boolean} isWatchDeep 当前计算属性是否是用于创建深度监听
     */

    return (name, computed, isWatchDeep) => {
      /** 计算属性的 setter */
      const set = (computed.set || noop).bind(this);
      /** 计算属性的 getter */

      const get = computed.get.bind(this);
      /** 计算属性的 getter 依赖收集包装 */

      const collectingDependentsGet = createCollectingDependents(() => computedTargetProxy[name] = get(), isComputed, isWatch, isWatchDeep, observeOptions, name); // 添加占位符

      computedTarget[name] = void 0; // 存储计算属性参数

      computedOptionsMap.set(name, {
        id: collectingDependentsGet.id,
        get: collectingDependentsGet,
        set
      });
    };
  }
  /**
   * 返回移除单个计算属性的方法
   */


  function createRemoveComputed(computedOptionsMap) {
    /**
     * @param name 需要移除的计算属性
     */
    return name => {
      // 获取计算属性的参数
      const computedOptions = computedOptionsMap.get(name); // 有这个计算属性

      if (computedOptions) {
        // 清空依赖
        dependentsMap[computedOptions.id].cleanDeps();
      }
    };
  }
  /**
   * 返回计算属性的获取拦截器
   */


  const computedTargetProxyInterceptorGet = computedOptionsMap => (target, name) => {
    // 获取计算属性的参数
    const computedOptions = computedOptionsMap.get(name); // 防止用户通过 $computed 获取不存在的计算属性

    if (computedOptions) {
      const dependentsOptions = dependentsMap[computedOptions.id]; // 计算属性未初始化或需要更新

      if (!dependentsOptions.isInit || dependentsOptions.shouldUpdate) {
        computedOptions.get();
      }
    }

    return target[name];
  };
  /**
   * 返回计算属性的设置拦截器
   */


  const computedTargetProxyInterceptorSet = computedOptionsMap => (target, name, value) => {
    const computedOptions = computedOptionsMap.get(name); // 防止用户通过 $computed 设置不存在的计算属性

    if (computedOptions) {
      return computedOptions.set(value), true;
    }

    return false;
  };

  /**
   * 存放每个实例的 watch 数据
   */

  const watcherMap = new WeakMap();
  /**
   * 监听 Hu 实例对象
   */

  function $watch(expOrFn, callback, options) {
    let watchFn; // 另一种写法

    if (isPlainObject(callback)) {
      return this.$watch(expOrFn, callback.handler, callback);
    } // 使用键路径表达式


    if (isString(expOrFn)) {
      watchFn = parsePath(expOrFn).bind(this);
    } // 使用计算属性函数
    else if (isFunction(expOrFn)) {
        watchFn = expOrFn.bind(this);
      } // 不支持其他写法
      else return;

    let watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed;

    if (watcherMap.has(this)) {
      [watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed] = watcherMap.get(this);
    } else {
      watcherMap.set(this, [watchTarget, watchTargetProxyInterceptor, appendComputed, removeComputed] = createComputed(null, null, true));
    } // 初始化选项参数


    options = options || {};
    /** 当前 watch 的存储名称 */

    const name = uid$1();
    /** 当前 watch 的回调函数 */

    const watchCallback = callback.bind(this);
    /** 监听对象内部值的变化 */

    const isWatchDeep = !!options.deep;
    /** 值改变是否运行回调 */

    let immediate,
        runCallback = immediate = !!options.immediate; // 添加监听

    appendComputed(name, {
      get: () => {
        const oldValue = watchTarget[name];
        const value = watchFn();

        if (runCallback) {
          //   首次运行             值不一样        值一样的话, 判断是否是深度监听
          if (immediate || !isEqual(value, oldValue) || isWatchDeep) {
            watchCallback(value, oldValue);
          }
        }

        return value;
      }
    }, isWatchDeep); // 首次运行, 以收集依赖

    watchTargetProxyInterceptor[name]; // 下次值改变时运行回调

    runCallback = true;
    immediate = false; // 返回取消监听的方法

    return () => {
      removeComputed(name);
    };
  }

  /**
   * 在下次 DOM 更新循环结束之后执行回调
   */

  function $nextTick (callback) {
    return nextTick(callback, this);
  }

  /**
   * 挂载实例
   */

  function $mount (selectors) {
    const {
      $info
    } = this; // 首次挂载

    if (!$info.isMounted) {
      // 使用 new 创建的实例
      if (!$info.isCustomElement) {
        const el = selectors && (isString(selectors) ? document.querySelector(selectors) : selectors);

        if (!el || el === document.body || el === document.documentElement) {
          return this;
        }

        observeProxyMap.get(this).target.$el = el;
      }
      /** 当前实例的实例配置 */


      const options = optionsMap[$info.name];
      /** 当前实例 $info 原始对象 */

      const infoTarget = observeProxyMap.get($info).target; // 运行 beforeMount 生命周期方法

      options.beforeMount.call(this); // 执行 render 方法, 进行渲染

      this.$forceUpdate(); // 标记首次实例挂载已完成

      infoTarget.isMounted = true; // 运行 mounted 生命周期方法

      options.mounted.call(this);
    }

    return this;
  }

  class HuConstructor {
    constructor(name) {
      /** 当前实例观察者对象 */
      const targetProxy = observe(this, observeHu); // 初始化 $forceUpdate 方法

      initForceUpdate(name, this, targetProxy);
    }

  }
  assign(HuConstructor.prototype, {
    $watch,
    $mount,
    $nextTick
  });

  /**
   * 初始化当前组件 props 属性
   * @param {boolean} isCustomElement 是否是初始化自定义元素
   * @param {HTMLElement} root 
   * @param {{}} options 
   * @param {{}} target 
   * @param {{}} targetProxy 
   */

  function initProps$1(isCustomElement, root, options, target, targetProxy) {
    const props = options.props;
    const propsTarget = create(null);
    const propsTargetProxy = target.$props = observe(propsTarget); // 尝试从标签上获取 props 属性, 否则取默认值

    each(props, (name, options) => {
      let value = null;

      if (isCustomElement && options.attr) {
        value = root.getAttribute(options.attr);
      } // 定义了该属性


      if (value !== null) {
        propsTarget[name] = (options.from || returnArg)(value);
      } // 使用默认值
      else {
          propsTarget[name] = isFunction(options.default) ? options.default.call(targetProxy) : options.default;
        }
    }); // 将 $props 上的属性在 $hu 上建立引用

    each(props, (name, options) => {
      if (options.isSymbol || !isReserved(name)) {
        define(target, name, () => propsTargetProxy[name], value => propsTargetProxy[name] = value);
      }
    });
  }

  var injectionToLit = (
  /**
   * 在 $hu 上建立对象的映射
   * 
   * @param {{}} litTarget $hu 实例
   * @param {string} key 对象名称
   * @param {any} value 对象值
   * @param {function} set 属性的 getter 方法, 若传值, 则视为使用 Object.defineProperty 对值进行定义
   * @param {function} get 属性的 setter 方法
   */
  (litTarget, key, value, set, get) => {
    // 首字母为 $ 则不允许映射到 $hu 实例中去
    if (!isSymbolOrNotReserved(key)) return; // 若在 $hu 下有同名变量, 则删除

    has(litTarget, key) && delete litTarget[key]; // 使用 Object.defineProperty 对值进行定义

    if (set) {
      define(litTarget, key, set, get);
    } // 直接写入到 $hu 上
    else {
        litTarget[key] = value;
      }
  });

  /**
   * 初始化当前组件 methods 属性
   * @param {{}} options 
   * @param {{}} target 
   * @param {{}} targetProxy 
   */

  function initMethods$1(options, target, targetProxy) {
    const methodsTarget = target.$methods = create(null);
    each(options.methods, (name, value) => {
      const method = methodsTarget[name] = value.bind(targetProxy);
      injectionToLit(target, name, method);
    });
  }

  /**
   * 初始化当前组件 data 属性
   * @param {{}} options 
   * @param {{}} target 
   * @param {{}} targetProxy 
   */

  function initData$1(options, target, targetProxy) {
    const dataTarget = create(null);
    const dataTargetProxy = target.$data = observe(dataTarget);
    const {
      data
    } = options;

    if (data) {
      const dataObj = isFunction(data) ? data.call(targetProxy) : data;
      each(dataObj, (name, value) => {
        dataTarget[name] = value;
        injectionToLit(target, name, 0, () => dataTargetProxy[name], value => dataTargetProxy[name] = value);
      });
    }
  }

  var isEmptyObject = (
  /**
   * 判断传入对象是否是一个空对象
   * @param {any} value 需要判断的对象
   */
  value => {
    for (let item in value) return false;

    return true;
  });

  /**
   * 使观察者对象只读 ( 不可删, 不可写 )
   */
  var observeReadonly = {
    set: {
      before: () => 0
    },
    deleteProperty: {
      before: () => 0
    }
  };

  let emptyComputed;
  function initComputed$1(options, target, targetProxy) {
    const computed = options.computed; // 如果定义当前实例时未定义 computed 属性
    // 则当前实例的 $computed 就是个普通的观察者对象

    if (isEmptyObject(computed)) {
      return target.$computed = emptyComputed || (emptyComputed = observe({}, observeReadonly));
    }

    const [computedTarget, computedTargetProxyInterceptor] = createComputed(options.computed, targetProxy);
    target.$computed = computedTargetProxyInterceptor; // 将拦截器伪造成观察者对象

    observeProxyMap.set(computedTargetProxyInterceptor, {});
    each(computed, (name, computed) => {
      injectionToLit(target, name, 0, () => computedTargetProxyInterceptor[name], value => computedTargetProxyInterceptor[name] = value);
    });
  }

  function initWatch$1(options, target, targetProxy) {
    // 添加监听方法
    each(options.watch, (expOrFn, options) => {
      return targetProxy.$watch(expOrFn, options);
    });
  }

  function initOptions$1(isCustomElement, name, target, userOptions) {
    // Hu 的初始化选项
    target.$options = observe(userOptions, observeReadonly); // Hu 实例信息选项

    target.$info = observe({
      name,
      isMounted: false,
      isCustomElement
    }, observeReadonly);
  }

  /**
   * 初始化当前组件属性
   * @param {boolean} isCustomElement 是否是初始化自定义元素
   * @param {HTMLElement} root 自定义元素组件节点
   * @param {string} name 组件名称
   * @param {{}} options 组件配置
   * @param {{}} userOptions 用户组件配置
   */

  function init(isCustomElement, root, name, options, userOptions) {
    /** 当前实例对象 */
    const target = new HuConstructor(name);
    /** 当前实例观察者对象 */

    const targetProxy = observeMap.get(target).proxy;

    if (isCustomElement) {
      target.$el = root.attachShadow({
        mode: 'open'
      });
      target.$customElement = root;
    }

    initOptions$1(isCustomElement, name, target, userOptions);
    initProps$1(isCustomElement, root, options, target, targetProxy);
    initMethods$1(options, target, targetProxy);
    initData$1(options, target, targetProxy);
    options.beforeCreate.call(targetProxy);
    initComputed$1(options, target, targetProxy);
    initWatch$1(options, target, targetProxy);
    options.created.call(targetProxy);

    if (!isCustomElement && options.el) {
      targetProxy.$mount(options.el);
    }

    return targetProxy;
  }

  const Hu = new Proxy(HuConstructor, {
    construct(HuConstructor$$1, [_userOptions]) {
      const name = 'anonymous-' + uid$1();
      const [userOptions, options] = initOptions(false, name, _userOptions);
      const targetProxy = init(false, void 0, name, options, userOptions);
      return targetProxy;
    }

  });
  Hu.version = '1.0.0-bata.0';

  var initAttributeChangedCallback = (propsMap => function (name, oldValue, value) {
    if (value === oldValue) return;
    const {
      $props: propsTargetProxy
    } = this.$hu;
    const {
      target: propsTarget
    } = observeProxyMap.get(propsTargetProxy);
    const props = propsMap[name];

    for (const {
      name,
      from
    } of props) {
      const fromValue = from(value);
      isEqual(propsTarget[name], fromValue) || (propsTargetProxy[name] = fromValue);
    }
  });

  var initDisconnectedCallback = (options => function () {});

  var initAdoptedCallback = (options => function () {});

  /**
   * 定义自定义元素
   * @param {string} name 标签名
   * @param {{}} _userOptions 组件配置
   */

  function define$1(name, _userOptions) {
    const [userOptions, options] = initOptions(true, name, _userOptions);

    class HuElement extends HTMLElement {
      constructor() {
        super();
        this.$hu = init(true, this, name, options, userOptions);
      }

    } // 定义需要监听的属性


    HuElement.observedAttributes = keys(options.propsMap);
    assign(HuElement.prototype, {
      // 自定义元素被添加到文档流
      connectedCallback,
      // 自定义元素被从文档流移除
      disconnectedCallback: initDisconnectedCallback(options),
      // 自定义元素位置被移动
      adoptedCallback: initAdoptedCallback(options),
      // 自定义元素属性被更改
      attributeChangedCallback: initAttributeChangedCallback(options.propsMap)
    }); // 注册组件

    customElements.define(name, HuElement);
  }

  function connectedCallback() {
    this.$hu.$mount();
  }

  Hu.define = define$1;

  const otherHu = window.Hu;

  Hu.noConflict = () => {
    if (window.Hu === Hu) window.Hu = otherHu;
    return Hu;
  };

  if (typeof window !== 'undefined') {
    window.Hu = Hu;
  }

  function render$1(result, container) {
    if (arguments.length > 1) {
      return render(result, container);
    }

    container = result;
    return function () {
      const result = html$1.apply(null, arguments);
      return render(result, container);
    };
  }

  Hu.html = html$1;
  Hu.render = render$1;

  Hu.observable = obj => {
    return isObject(obj) ? observe(obj) : obj;
  };

  Hu.nextTick = nextTick;

  return Hu;

}));
