(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Hu = factory());
}(this, function () { 'use strict';

  function Hu() {}

  const isArray = Array.isArray;

  var isPlainObject = (
  /**
   * 判断传入对象是否是纯粹的对象
   * @param {any} value 需要判断的对象
   */
  value => Object.prototype.toString.call(value) === '[object Object]');

  const ownKeys = Reflect.ownKeys;

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

  var isObject = (
  /**
   * 判断传入对象是否是 Object 类型且不为 null
   * @param {any} value 需要判断的对象
   */
  value => value !== null && typeof value === 'object');

  var rHyphenate = /\B([A-Z])/g;

  var isSymbol = (
  /**
   * 判断传入对象是否是 Symbol 类型
   * @param {any} value 需要判断的对象
   */
  value => typeof value === 'symbol');

  var returnArg = (
  /**
   * 返回传入的首个参数
   * @param {any} value 需要返回的参数
   */
  value => value);

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
      const attr = prop.attr;

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

    options.attr = prop && prop.attr || (options.isSymbol //[ 没有定义 attr 名称且是 symbol 类型的 attr 名称, 则不设置 attr 名称
    ? null // 驼峰转为以连字符号连接的小写 attr 名称
    : name.replace(rHyphenate, '-$1').toLowerCase());
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
    /** 在实例初始化后立即调用, computed, watch 还未初始化 */
    'beforeCreate',
    /** 在实例创建完成后被立即调用, 挂载阶段还没开始 */
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

  function initState(userOptions, options) {
    const methods = userOptions.methods,
          data = userOptions.data,
          computed = userOptions.computed,
          watch = userOptions.watch;

    if (methods) {
      initMethods(methods, options);
    }

    if (data) {
      initData(data, options);
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

  function initData(userData, options) {
    isFunction(userData) && (options.data = userData);
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

  function initOther(userOptions, options) {
    const render = userOptions.render; // 渲染方法

    options.render = isFunction(render) ? render : noop;
  }

  /**
   * 初始化组件配置
   * @param {{}} userOptions 用户传入的组件配置
   */

  function initOptions(userOptions) {
    /** 格式化后的组件配置 */
    const options = {};
    initProps(userOptions, options);
    initState(userOptions, options);
    initLifecycle(userOptions, options);
    initOther(userOptions, options);
    return options;
  }

  const create = Object.create;

  var isReserved = (
  /**
   * 判断字符串首字母是否为 $
   * @param {String} value
   */
  value => {
    const charCode = (value + '').charCodeAt(0);
    return charCode === 0x24;
  });

  var canInjection = (
  /**
   * 判断传入名称是否是 Symbol 类型或是首字母不为 $ 的字符串
   * @param { string | symbol } name 需要判断的名称
   * @param { boolean? } isSymbolName name 是否是 symbol 类型
   */
  (name, isSymbolName) => {
    return (isSymbolName !== undefined ? isSymbolName : isSymbol(name)) || !isReserved(name);
  });

  const defineProperty = Object.defineProperty;

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

  /**
   * 调用堆栈
   * - 存放当前正在计算依赖的方法的 dependentsOptions 依赖集合数组
   * - [ dependentsOptions, dependentsOptions, ... ]
   */
  const targetStack = [];

  var isEqual = (
  /**
   * 判断传入的两个值是否相等
   * @param {any} value 需要判断的对象
   * @param {any} value2 需要判断的对象
   */
  (value, value2) => {
    return !(value2 !== value && (value2 === value2 || value === value));
  });

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

  function observe(target) {
    // 如果创建过观察者
    // 则返回之前创建的观察者
    if (observeMap.has(target)) return observeMap.get(target).proxy; // 如果传入的就是观察者对象
    // 则直接返回

    if (observeProxyMap.has(target)) return target; // 否则立即创建观察者进行返回

    return createObserver(target);
  }

  function createObserver(target) {
    /** 当前对象的观察者对象 */
    const proxy = new Proxy(target, {
      get: createObserverProxyGetter,
      set: createObserverProxySetter
    });
    /** 观察者对象选项参数 */

    const observeOptions = {
      // 可以使用 observeMap 来获取观察者对象
      proxy,
      // 当前对象的子级的被监听数据
      watches: new Map(),
      // 当前对象的被深度监听数据
      deepWatches: new Set()
    }; // 存储观察者选项参数

    observeMap.set(target, observeOptions);
    observeProxyMap.set(proxy, observeOptions);
    return proxy;
  }
  /**
   * 创建依赖收集的响应方法
   */


  const createObserverProxyGetter = (target, name, targetProxy) => {
    // 获取当前在收集依赖的那个方法的参数
    const dependentsOptions = targetStack[targetStack.length - 1]; // 当前有正在收集依赖的方法

    if (dependentsOptions) {
      const watches = observeMap.get(target).watches;
      let watch = watches.get(name); // 当前参数没有被监听过, 初始化监听数组

      if (!watch) {
        watch = new Set();
        watches.set(name, watch);
      } // 添加依赖方法信息到 watch
      // 当前值被改变时, 会调用依赖方法


      watch.add(dependentsOptions); // 添加 watch 的信息到依赖收集去
      // 当依赖方法被重新调用, 会移除依赖

      dependentsOptions.deps.add(watch);
    }

    const value = target[name]; // 如果获取的值是对象类型
    // 则返回它的观察者对象

    return isObject(value) ? observe(value) : value;
  };
  /**
   * 创建响应更新方法
   */


  const createObserverProxySetter = (target, name, value, targetProxy) => {
    // 值完全相等, 不进行修改
    if (isEqual(target[name], value)) {
      return true;
    } // 获取子级监听数据


    const _observeMap$get = observeMap.get(target),
          watches = _observeMap$get.watches,
          deepWatches = _observeMap$get.deepWatches; // 获取当前参数的被监听数据


    let watch = watches.get(name); // 改变值

    target[name] = value; // 如果有方法依赖于当前值, 则运行那个方法以达到更新的目的

    if (watch && watch.size) {
      for (const dependentsOptions of watch) {
        // 那个方法是没有被其它方法依赖的计算属性
        // 通知它在下次获取时更新值
        if (dependentsOptions.notBeingCollected) {
          recursionSetShouldUpdate(dependentsOptions);
        } else {
          dependentsOptions.fn();
        }
      }
    } // 响应深度监听


    if (deepWatches.size) {
      for (const dependentsOptions of deepWatches) {
        dependentsOptions.fn();
      }
    }

    return true;
  };
  /**
   * 递归提醒
   */


  function recursionSetShouldUpdate(dependentsOptions) {
    dependentsOptions.shouldUpdate = true;

    if (dependentsOptions.relier) {
      recursionSetShouldUpdate(dependentsOptions.relier);
    }
  }

  /**
   * 初始化当前组件 props 属性
   * @param {HTMLElement} root 
   * @param {{}} options 
   * @param {{}} target 
   * @param {{}} targetProxy 
   */

  function initProps$1(root, options, target, targetProxy) {
    const props = options.props;
    const propsTarget = create(null);
    const propsTargetProxy = target.$props = observe(propsTarget); // 尝试从标签上获取 props 属性, 否则取默认值

    each(props, (name, options) => {
      let value = null;

      if (options.attr) {
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
      canInjection(name, options.isSymbol) && define(target, name, () => propsTargetProxy[name], value => propsTargetProxy[name] = value);
    });
  }

  var Set_Defined = (
  /**
   * 只允许修改已定义过的变量
   */
  (target, name, value) => {
    if (name in target) {
      return target[name] = value, true;
    }

    return false;
  });

  const has = Reflect.has;

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
    if (!canInjection(key)) return; // 若在 $hu 下有同名变量, 则删除

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
   * @param {HTMLElement} root 
   * @param {{}} options 
   * @param {{}} target 
   * @param {{}} targetProxy 
   */

  function initMethods$1(root, options, target, targetProxy) {
    const methodsTarget = create(null);
    target.$methods = new Proxy(methodsTarget, {
      set: Set_Defined
    });
    each(options.methods, (name, value) => {
      const method = methodsTarget[name] = value.bind(targetProxy);
      injectionToLit(target, name, method);
    });
  }

  /**
   * 初始化当前组件 data 属性
   * @param {HTMLElement} root 
   * @param {{}} options 
   * @param {{}} target 
   * @param {{}} targetProxy 
   */

  function initData$1(root, options, target, targetProxy) {
    const dataTarget = create(null);
    const dataTargetProxy = target.$data = observe(dataTarget);

    if (options.data) {
      const data = options.data.call(targetProxy);
      each(data, (name, value) => {
        dataTarget[name] = value;
        injectionToLit(target, name, 0, () => dataTargetProxy[name], value => dataTargetProxy[name] = value);
      });
    }
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
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
              var _this$_parts;

              (_this$_parts = this._parts).push.apply(_this$_parts, _toConsumableArray(this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options)));
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
   * Creates Parts when a template is instantiated.
   */


  class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
      const prefix = name[0];

      if (prefix === '.') {
        const comitter = new PropertyCommitter(element, name.slice(1), strings);
        return comitter.parts;
      }

      if (prefix === '@') {
        return [new EventPart(element, name.slice(1), options.eventContext)];
      }

      if (prefix === '?') {
        return [new BooleanAttributePart(element, name.slice(1), strings)];
      }

      const comitter = new AttributeCommitter(element, name, strings);
      return comitter.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */


    handleTextExpression(options) {
      return new NodePart(options);
    }

  }

  const defaultTemplateProcessor = new DefaultTemplateProcessor();
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

  const html$1 = function (strings, ...values) {
    return new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
  };

  let uid = 0;
  var uid$1 = (
  /**
   * 返回一个字符串 UID
   */
  () => '' + uid++);

  /**
   * 依赖集合
   * - 存放所有已收集到的依赖
   * - { id: dependentsOptions, ... }
   */

  const dependentsMap = {};
  /**
   * 为传入方法收集依赖
   * @param {function} fn 需要收集依赖的方法
   * @param {boolean} isComputed ↓
   *   - 是否是计算属性, 计算属性如果如果未被其它方法依赖, 则无需立即更新
   *   - 否则是用于创建监听方法
   * @param {boolean} isWatchDeep 当前计算属性是否是用于创建深度监听
   */

  function createCollectingDependents(fn, isComputed, isWatchDeep) {
    // 当前方法收集依赖的 ID, 用于从 watcherMap ( 存储 / 读取 ) 依赖项
    const id = uid$1(); // 当前收集依赖的方法的一些参数

    const dependentsOptions = {
      // 当前方法的依赖存储数组
      deps: new Set(),
      // 对之前收集的依赖进行清空
      cleanDeps,
      // 当其中一个依赖更新后, 会调用当前方法重新计算依赖
      fn: collectingDependentsGet // 是否初始化
      // isInit: false
      // 判断当前计算属性是否被没有被其它方法收集了依赖 ( 当 isComputed 为 true 时可用 )
      // notBeingCollected: false,
      // 依赖于当前计算属性的那个计算属性 ( 当 isComputed 为 true 时可用 )
      // relier: null,
      // 依赖是否需要更新 ( 当 notBeingCollected 为 true 时可用 )
      // shouldUpdate: false

    }; // 需要进行深度监听

    if (isWatchDeep) {
      dependentsOptions.watchDeep = watchDeep;
    } // 存储当前收集依赖的 ID 到方法
    // - 未被其它方法依赖的计算属性可以用它来获取依赖参数判断是否被更新


    collectingDependentsGet.id = id; // 存储当前方法的依赖
    // 可以在下次收集依赖的时候对这次收集的依赖进行清空

    dependentsMap[id] = dependentsOptions;
    /**
     * 方法的依赖收集包装
     */

    function collectingDependentsGet() {
      // 清空依赖
      dependentsOptions.cleanDeps(); // 已初始化

      dependentsOptions.isInit = true; // 是否被收集依赖

      if (isComputed) {
        const targetStackLength = targetStack.length;
        let relier; // 判断是否被收集依赖
        // 被无依赖的计算属性收集依赖也算没有被收集依赖

        dependentsOptions.notBeingCollected = // 调用堆栈为空, 说明完全无依赖
        !targetStackLength || // 收集依赖的是无依赖的计算属性
        (relier = targetStack[targetStackLength - 1]).notBeingCollected; // 保存依赖者

        dependentsOptions.relier = targetStackLength && relier;
      } // 开始收集依赖


      targetStack.push(dependentsOptions); // 执行方法
      // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps

      const result = fn(); // 需要进行深度监听

      if (isWatchDeep) {
        dependentsOptions.watchDeep(result);
      } // 方法执行完成, 则依赖收集完成


      targetStack.pop();
      return result;
    }
    return collectingDependentsGet;
  }
  /**
   * 清空收集的依赖
   */

  function cleanDeps() {
    // 对之前收集的依赖进行清空
    for (const watch of this.deps) watch.delete(this); // 清空依赖


    this.deps.clear();
  }
  /**
   * 对依赖的最终返回值进行深度监听
   */


  function watchDeep(result) {
    if (isObject(result) && !isArray(result)) {
      observeProxyMap.get(result).deepWatches.add(this);
    }
  }

  function initRender(root, options, target, targetProxy) {
    const userRender = options.render.bind(targetProxy);
    const $el = target.$el;
    /**
     * 迫使 Hu 实例重新渲染
     */

    target.$forceUpdate = createCollectingDependents(() => {
      const templateResult = userRender(html$1);

      if (templateResult instanceof TemplateResult) {
        render(templateResult, $el);
      }
    });
  }

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
      set: computedTargetProxyInterceptorSet(computedOptionsMap)
    });
    /** 给当前计算属性添加子级的方法 */

    const appendComputed = createAppendComputed.call(self, computedTarget, computedTargetProxy, computedOptionsMap, isWatch);
    /** 给当前计算属性移除子级的方法, 目前仅有监听需要使用 */

    let removeComputed = isWatch ? createRemoveComputed.call(self, computedOptionsMap) : void 0;
    each(computed, (name, computed) => {
      appendComputed(name, computed);
    });
    return [computedTarget, computedTargetProxyInterceptor, appendComputed, removeComputed];
  });
  /**
   * 返回添加单个计算属性的方法
   */

  function createAppendComputed(computedTarget, computedTargetProxy, computedOptionsMap, isWatch) {
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

      const collectingDependentsGet = createCollectingDependents(() => {
        return computedTargetProxy[name] = get();
      }, !isWatch, isWatchDeep); // 添加占位符

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
        dependentsOptions.shouldUpdate = false;
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

  function initComputed$1(root, options, target, targetProxy) {
    const _createComputed = createComputed(options.computed, targetProxy),
          computedTargetProxyInterceptor = _createComputed[1];

    target.$computed = computedTargetProxyInterceptor; // 将拦截器伪造成观察者对象

    observeProxyMap.set(computedTargetProxyInterceptor, {});
    each(options.computed, (name, computed) => {
      injectionToLit(target, name, 0, () => computedTargetProxyInterceptor[name], value => computedTargetProxyInterceptor[name] = value);
    });
  }

  var isString = (
  /**
   * 判断传入对象是否是 String 类型
   * @param {any} value 需要判断的对象
   */
  value => value !== null && typeof value === 'string');

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

  function initWatch$1(root, options, target, targetProxy) {
    const _createComputed = createComputed(null, targetProxy, true),
          watchTarget = _createComputed[0],
          watchTargetProxyInterceptor = _createComputed[1],
          appendComputed = _createComputed[2],
          removeComputed = _createComputed[3];

    const watch = target.$watch = (expOrFn, callback, options) => {
      let watchFn;

      if (isPlainObject(callback)) {
        return watch(expOrFn, callback.handler, callback);
      } // 使用键路径表达式


      if (isString(expOrFn)) {
        watchFn = parsePath(expOrFn).bind(targetProxy);
      } // 使用计算属性函数
      else if (isFunction(expOrFn)) {
          watchFn = expOrFn.bind(targetProxy);
        } else {
          return;
        }

      options = options || {};
      /** 当前 watch 的存储名称 */

      const name = uid$1();
      /** 当前 watch 的回调函数 */

      const watchCallback = callback.bind(targetProxy);
      /** 监听对象内部值的变化 */

      const isWatchDeep = !!options.deep;
      /** 值改变是否运行回调 */

      let runCallback = !!options.immediate; // 添加监听

      appendComputed(name, {
        get() {
          const oldValue = watchTarget[name];
          const value = watchFn();

          if (runCallback) {
            watchCallback(value, oldValue);
          }

          return value;
        }

      }, isWatchDeep); // 首次运行, 以收集依赖

      watchTargetProxyInterceptor[name]; // 下次值改变时运行回调

      runCallback = true;
      return () => {
        removeComputed(name);
      };
    };

    each(options.watch, watch);
  }

  function initRootTarget() {
    /** 当前组件对象 */
    const target = create(null);
    /** 当前组件观察者对象 */

    const targetProxy = observe(target);
    /** 当前组件观察者对象拦截器 */

    const targetProxyInterceptor = new Proxy(targetProxy, {
      set(target, name, value) {
        if (canInjection(name)) {
          return target[name] = value, true;
        }

        return false;
      },

      get(_, name) {
        if (isSymbol(name) || !isReserved(name)) {
          return targetProxy[name];
        }

        return target[name];
      }

    }); // 将拦截器伪造成观察者对象

    observeProxyMap.set(targetProxyInterceptor, {});
    return [target, targetProxy, targetProxyInterceptor];
  }

  /**
   * 初始化当前组件属性
   * @param {HTMLElement} root 自定义元素组件节点
   * @param {{}} options 组件配置
   */

  function init(root, options) {
    const _initRootTarget = initRootTarget(),
          target = _initRootTarget[0],
          targetProxy = _initRootTarget[1],
          targetProxyInterceptor = _initRootTarget[2];

    target.$el = root.attachShadow({
      mode: 'open'
    });
    target.$customElement = root;
    initProps$1(root, options, target, targetProxyInterceptor);
    initMethods$1(root, options, target, targetProxyInterceptor);
    initData$1(root, options, target, targetProxyInterceptor);
    initRender(root, options, target, targetProxyInterceptor);
    options.beforeCreate.call(targetProxyInterceptor);
    initComputed$1(root, options, target, targetProxyInterceptor);
    initWatch$1(root, options, target, targetProxyInterceptor);
    options.created.call(targetProxyInterceptor);
    return targetProxyInterceptor;
  }

  const keys = Object.keys;

  /**
   * 定义自定义标签
   * @param {string} name 标签名
   * @param {{}} options 组件配置
   */

  function define$1(name, options) {
    // 初始化组件配置
    options = initOptions(options || {});
    /**
     * 组件的 prop 与取值 attr 的映射
     */

    const propsMap = options.propsMap; // 创建组件

    const LitElement = class LitElement extends HTMLElement {
      constructor() {
        super();
        this.$hu = init(this, options);
      }

      attributeChangedCallback(name, oldValue, value) {
        if (value !== oldValue) {
          /** 当前组件 $props 对象 */
          const $props = this.$hu.$props;
          /** 当前属性被改动后需要修改的对应 prop */

          const props = propsMap[name];

          for (const _ref of props) {
            const name = _ref.name;
            const from = _ref.from;

            /** 格式转换后的 value */
            const fromValue = from(value);

            if (!isEqual($props[name], fromValue)) {
              $props[name] = fromValue;
            }
          }
        }
      }

      connectedCallback() {
        const $hu = this.$hu;
        options.beforeMount.call($hu);
        $hu.$forceUpdate();
        options.mounted.call($hu);
      }

      disconnectedCallback() {}

      adoptedCallback() {}

    }; // 定义需要监听的属性

    LitElement.observedAttributes = keys(propsMap); // 注册组件

    customElements.define(name, LitElement);
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

  Hu.html = html$1;
  Hu.render = render;

  Hu.observable = obj => {
    return isObject(obj) ? observe(obj) : obj;
  };

  return Hu;

}));
