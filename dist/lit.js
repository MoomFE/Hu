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
    const keys = ownKeys(obj);

    for (let key of keys) {
      cb(key, obj[key]);
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

  function initLifecycle(userOptions, options) {
    [
    /** 在实例初始化之后 */
    'beforeCreate',
    /** 在实例创建完成后被立即调用, 挂载阶段还没开始 */
    'created',
    /** 在挂载开始之前被调用, 首次调用 render 函数 */
    'beforeMount',
    /** 组件 DOM 已挂载 */
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
      isFunction(lifecycle) && (options[name] = lifecycle);
    });
  }

  var noop = (
  /**
   * 空方法
   */
  () => {});

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
    isFunction(data) && (options.data = userData);
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
   * 初始化当前组件 props 属性
   * @param {HTMLElement} root 
   * @param {{}} options 
   * @param {{}} target 
   * @param {{}} targetProxy 
   */

  function initProps$1(root, options, target, targetProxy) {
    const props = options.props;
    const propsTarget = create(null);
    const propsTargetProxy = target.$props = new Proxy(propsTarget, {
      set: Set_Defined
    }); // 尝试从标签上获取 props 属性, 否则取默认值

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
    }); // 将 $props 上的属性在 $lit 上建立引用

    each(props, (name, options) => {
      canInjection(name, options.isSymbol) && define(target, name, () => propsTargetProxy[name], value => propsTargetProxy[name] = value);
    });
  }

  const has = Reflect.has;

  var injectionToLit = (
  /**
   * 在 $lit 上建立对象的映射
   * 
   * @param {{}} litTarget $lit 实例
   * @param {string} key 对象名称
   * @param {any} value 对象值
   * @param {function} set 属性的 getter 方法, 若传值, 则视为使用 Object.defineProperty 对值进行定义
   * @param {function} get 属性的 setter 方法
   */
  (litTarget, key, value, set, get) => {
    // 首字母为 $ 则不允许映射到 $lit 实例中去
    if (!canInjection(key)) return; // 若在 $lit 下有同名变量, 则删除

    has(litTarget, key) && delete litTarget[key]; // 使用 Object.defineProperty 对值进行定义

    if (set) {
      define(litTarget, key, set, get);
    } // 直接写入到 $lit 上
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
    options.methods && each(options.methods, (key, value) => {
      const method = methodsTarget[key] = value.bind(targetProxy);
      injectionToLit(target, key, method);
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
    target.$data = new Proxy(dataTarget, {
      set: Set_Defined
    });

    if (options.data) {
      const data = options.data.call(targetProxy);
      data && each(data, (key, value) => {
        dataTarget[key] = value;
        injectionToLit(target, key, value);
      });
    }
  }

  /**
   * 初始化当前组件属性
   * @param {HTMLElement} root 组件根节点
   * @param {{}} options 组件配置
   */

  function init(root, options) {
    /** 当前组件对象 */
    const target = create(null);
    /** 当前组件代理对象 */

    const targetProxy = new Proxy(target, {
      set(target, name, value) {
        if (isReserved(name)) return false;
        target[name] = value;
        return true;
      }

    });
    target.$el = root.attachShadow({
      mode: 'open'
    });
    target.$root = root;
    initProps$1(root, options, target, targetProxy);
    initMethods$1(root, options, target, targetProxy);
    initData$1(root, options, target, targetProxy);
    return targetProxy;
  }

  const keys = Object.keys;

  /**
   * 定义自定义标签
   * @param {string} name 标签名
   * @param {{}} options 组件配置
   */

  function define$1(name, options) {
    // 初始化组件配置
    options = initOptions(options);
    /**
     * 组件的 prop 与取值 attr 的映射
     */

    const propsMap = options.propsMap; // 创建组件

    const LitElement = class LitElement extends HTMLElement {
      constructor() {
        super();
        this.$lit = init(this, options);
      }

      attributeChangedCallback(name, oldValue, value) {
        if (value !== oldValue) {
          /** 当前组件 $props 对象 */
          const $props = this.$lit.$props;
          /** 当前属性被改动后需要修改的对应 prop */

          const props = propsMap[name];

          for (const _ref of props) {
            const name = _ref.name;
            const from = _ref.from;

            /** 格式转换后的 value */
            const fromValue = from(value);

            if ($props[name] !== fromValue) {
              $props[name] = fromValue;
            }
          }
        }
      }

      connectedCallback() {
        console.log('connectedCallback');
      }

      disconnectedCallback() {
        console.log('disconnectedCallback');
      }

      adoptedCallback() {
        console.log('adoptedCallback');
      }

    }; // 定义需要监听的属性

    LitElement.observedAttributes = keys(propsMap); // 注册组件

    customElements.define(name, LitElement);
  }
  Lit.define = define$1;

  return Lit;

}));
