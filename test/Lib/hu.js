/*!
 * Hu.js v1.0.0-bata.16
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

  const {
    prototype,

    assign,
    create,
    keys,
    freeze
  } = Object;

  /**
   * 调用堆栈
   * - 存放当前正在计算依赖的方法的 watcher 依赖集合数组
   * - [ watcher, watcher, ... ]
   */
  const targetStack = [];

  function pushTarget( target ){
    targetStack.push( target);
    targetStack.target = target;
  }

  function popTarget(){
    targetStack.pop();
    targetStack.target = targetStack[ targetStack.length - 1 ];
  }

  var isNotEqual = /**
   * 判断传入的两个值是否不相等
   * @param {any} value 需要判断的对象
   * @param {any} value2 需要判断的对象
   */
  ( value, value2 ) => {
    return value2 !== value && ( value2 === value2 || value === value );
  };

  var isEqual = /**
   * 判断传入的两个值是否相等
   * @param {any} value 需要判断的对象
   * @param {any} value2 需要判断的对象
   */
  ( value, value2 ) => {
    return !isNotEqual( value, value2 );
  };

  const {
    apply,
    // construct,
    defineProperty,
    deleteProperty,
    // enumerate,
    // get,
    getOwnPropertyDescriptor,
    // getPrototypeOf,
    has,
    // isExtensible,
    ownKeys,
    // preventExtensions,
    set,
    // setPrototypeOf
  } = Reflect;

  var emptyObject = freeze({});

  var isFunction = /**
   * 判断传入对象是否是 Function 类型
   * @param {any} value 需要判断的对象
   */
  value => typeof value === 'function';

  const {
    hasOwnProperty,
    toString
  } = prototype;

  var isPlainObject = /**
   * 判断传入对象是否是纯粹的对象
   * @param {any} value 需要判断的对象
   */
  value => toString.call( value ) === '[object Object]';

  const {
    isArray,
    prototype: prototype$1
  } = Array;

  /**
   * 存放原始对象和观察者对象及其选项参数的映射
   */
  const observeMap = new WeakMap();

  /**
   * 存放观察者对象和观察者对象选项参数的映射
   */
  const observeProxyMap = new WeakMap();

  /**
   * 创建无参数观察对象
   */
  function observable( obj ){
    return isPlainObject( obj ) || isArray( obj ) ? observe( obj )
                                                  : obj;
  }

  /**
   * 为传入对象创建观察者
   */
  function observe( target, options ){
    // 如果创建过观察者
    // 则返回之前创建的观察者
    if( observeMap.has( target ) ) return observeMap.get( target ).proxy;
    // 如果传入的就是观察者对象
    // 则直接返回
    if( observeProxyMap.has( target ) ) return target;
    // 否则立即创建观察者进行返回
    return createObserver( target, options );
  }

  function createObserver(
    target,
    options = {}
  ){
    /** 观察者对象选项参数 */
    const observeOptions = {
      // 可以使用观察者对象来获取原始对象
      target,
      // 订阅了当前观察者子集对象更新的 watcher 集合
      subs: create( null ),
      // 订阅了当前观察者对象深度监听的 watcher 集合
      deepSubs: new Set(),
      // 上次访问及设置的值缓存
      lastValue: create( null ),
      // 是否是数组
      isArray: isArray( target )
    };

    /**
     * 当前对象的观察者对象
     * - 存储进观察者对象选项内, 可以使用原始对象来获取观察者对象
     */
    const proxy = observeOptions.proxy = new Proxy( target, {
      get: createObserverProxyGetter( options.get, observeOptions ),
      set: createObserverProxySetter( options.set, observeOptions ),
      ownKeys: createObserverProxyOwnKeys( observeOptions ),
      deleteProperty: createObserverProxyDeleteProperty( options.deleteProperty, observeOptions )
    });

    // 存储观察者选项参数
    observeMap.set( target, observeOptions );
    observeProxyMap.set( proxy, observeOptions );

    return proxy;
  }

  /**
   * 创建依赖收集的响应方法
   */
  const createObserverProxyGetter = ({ before } = emptyObject, { subs, lastValue }) => ( target, name, targetProxy ) => {

    // @return 0: 从原始对象放行
    if( before ){
      const beforeResult = before( target, name, targetProxy );

      if( beforeResult === 0 ){
        return target[ name ];
      }
    }

    // 需要获取的值是使用 Object.defineProperty 定义的属性
    if( ( getOwnPropertyDescriptor( target, name ) || emptyObject ).get ){
      return target[ name ];
    }

    // 获取当前值
    const value = target[ name ];

    // 如果获取的是原型上的方法
    if( isFunction( value ) && !hasOwnProperty.call( target, name ) && has( target, name ) ){
      return value;
    }

    // 获取当前正在收集依赖的 watcher
    const watcher = targetStack.target;

    // 当前有正在收集依赖的 watcher
    if( watcher ){
      // 标记订阅信息
      watcher.add( subs, name );
      // 存储本次值
      lastValue[ name ] = value;
    }

    // 如果获取的值是对象类型
    // 则返回它的观察者对象
    return observable( value );
  };

  /**
   * 创建响应更新方法
   */
  const createObserverProxySetter = ({ before } = emptyObject, { subs, deepSubs, lastValue, isArray }) => ( target, name, value, targetProxy ) => {

    // @return 0: 阻止设置值
    if( before ){
      const beforeResult = before( target, name, value, targetProxy );

      if( beforeResult === 0 ){
        return false;
      }
    }

    // 需要修改的值是使用 Object.defineProperty 定义的属性
    if( ( getOwnPropertyDescriptor( target, name ) || emptyObject ).set ){
      target[ name ] = value;
      return true;
    }

    // 旧值
    const oldValue = has( lastValue, name ) ? lastValue[ name ] : target[ name ];

    // 值完全相等, 不进行修改
    if( isEqual( oldValue, value ) ){
      return true;
    }

    // 改变值
    target[ name ] = value;

    if( isArray && name === 'length' ){
      value = target[ name ];
      arrayLengthHook( targetProxy, value, oldValue );
    }

    // 触发更新
    if( !isArray || value !== oldValue ){
      triggerUpdate( subs, deepSubs, lastValue, set, name, value );
    }

    return true;
  };

  /**
   * 响应以下方式的依赖收集:
   *   - for ... in ( 低版本浏览器不支持, 请避免使用 )
   *   - Object.keys
   *   - Object.values
   *   - Object.entries
   *   - Object.getOwnPropertyNames
   *   - Object.getOwnPropertySymbols
   *   - Reflect.ownKeys
   */
  const createObserverProxyOwnKeys = ({ deepSubs }) => ( target ) => {

    // 获取当前正在收集依赖的 watcher
    const watcher = targetStack.target;

    // 当前有正在收集依赖的 watcher
    if( watcher ){
      // 标记深度监听订阅信息
      deepSubs.add( watcher );
    }

    return ownKeys( target );
  };

  /**
   * 创建响应从观察者对象删除值的方法
   */
  const createObserverProxyDeleteProperty = ({ before } = emptyObject, { subs, deepSubs, lastValue }) => ( target, name ) => {

    // @return 0: 禁止删除
    if( before ){
      const beforeResult = before( target, name );

      if( beforeResult === 0 ){
        return false;
      }
    }

    const isDelete = deleteProperty( target, name );

    // 删除成功触发更新
    if( isDelete ){
      triggerUpdate( subs, deepSubs, lastValue, deleteProperty, name );
    }

    return isDelete;
  };

  /**
   * 存储值的改变
   * 触发值的更新操作
   */
  function triggerUpdate( subs, deepSubs, lastValue, handler, name, value ){
    // 订阅了当前参数更新的 watcher 集合
    const sub = subs[ name ];

    // 存储本次值改变
    if( sub && sub.size ){
      handler( lastValue, name, value );
    }

    // 遍历当前参数的订阅及父级对象的深度监听数据
    for( let watcher of [ ...sub || [], ...deepSubs ] ){
      watcher.update();
    }
  }

  /**
   * 修复使用 arr.length = 0 等方式删除数组的值时
   * 无法触发 Watcher 的更新的问题
   */
  function arrayLengthHook( targetProxy, length, oldLength ){
    while( length < oldLength ){
      deleteProperty( targetProxy, length++ );
    }
  }

  var isString = /**
   * 判断传入对象是否是 String 类型
   * @param {any} value 需要判断的对象
   */
  value => typeof value === 'string';

  var cached = /**
   * 创建一个可以缓存方法返回值的方法
   */
  ( fn ) => {
    const cache = create( null );

    return str => {
      if( has( cache, str ) ) return cache[ str ];
      return cache[ str ] = fn( str );
    }
  };

  var isReserved = /**
   * 判断字符串首字母是否为 $
   * @param {String} value
   */
  cached( value => {
    const charCode = ( value + '' ).charCodeAt(0);
    return charCode === 0x24;
  });

  const options = {
    before: ( target, name ) => isString( name ) && isReserved( name ) ? 0 : null
  };

  var observeHu = {
    set: options,
    get: options,
    deleteProperty: options
  };

  var each = /**
   * 对象遍历方法
   * @param {{}} obj 需要遍历的对象
   * @param {( key:string, value: any ) => {}} cb 遍历对象的方法
   */
  ( obj, cb ) => {
    if( obj ){
      const keys = ownKeys( obj );

      for( let key of keys ){
        cb( key, obj[ key ] );
      }
    }
  };

  var fromBooleanAttribute = /**
   * 序列化为 Boolean 属性
   */
  value => {
    return value === 'false' ? false
                             : value !== null;
  };

  var isObject = /**
   * 判断传入对象是否是 Object 类型且不为 null
   * @param {any} value 需要判断的对象
   */
  value => value !== null && typeof value === 'object';

  var isSymbol = /**
   * 判断传入对象是否是 Symbol 类型
   * @param {any} value 需要判断的对象
   */
  value => typeof value === 'symbol';

  var returnArg = /**
   * 返回传入的首个参数
   * @param {any} value 需要返回的参数
   */
  value => value;

  var rHyphenate = /\B([A-Z])/g;

  var hyphenate = /**
   * 将驼峰转为以连字符号连接的小写名称
   */
  cached( name => {
    return name.replace( rHyphenate, '-$1' ).toLowerCase();
  });

  /**
   * 初始化组件 props 配置
   * @param {{}} userOptions 用户传入的组件配置
   * @param {{}} options 格式化后的组件配置
   * @param {any[]} mixins 混入对象
   * @param {boolean} isMixin 是否是处理混入对象
   */
  function initProps( userOptions, options, mixins, isMixin ){

    /** 格式化后的 props 配置 */
    const props = isMixin ? options.props : options.props = {};
    /** 用户传入的 props 配置 */
    const userProps = userOptions.props;

    // 格式化数组参数
    if( isArray( userProps ) ){
      if( !userProps.length ) return;

      for( let name of userProps ){
        props[ name ] = props[ name ] || initProp( name, null );
      }
    }
    // 格式化 JSON 参数
    else if( isPlainObject( userProps ) ){
      each( userProps, ( name, prop ) => {
        props[ name ] = props[ name ] || initProp( name, prop );
      });
    }

    if( !isMixin ){
      if( mixins ){
        for( let mixin of mixins ){
          initProps( mixin, options, null, true );
        }
      }
    }else{
      return;
    }

    /** 最终的 prop 与取值 attribute 的映射 */
    const propsMap = options.propsMap = {};

    // 生成 propsMap
    each( props, ( name, prop ) => {
      const { attr } = prop;

      if( attr ){
        const map = propsMap[ attr ] || (
          propsMap[ attr ] = []
        );

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
  function initProp( name, prop ){
    /** 格式化后的 props 配置 */
    const options = {};

    initPropAttribute( name, prop, options );

    if( prop ){
      // 单纯设置变量类型
      if( isFunction( prop ) ){
        options.from = prop;
      }
      // 高级用法
      else{
        initPropType( prop, options );
        initPropDefault( prop, options );
      }
    }

    // 如果传入值是 Boolean 类型, 则需要另外处理
    if( options.from === Boolean ){
      options.from = fromBooleanAttribute;
    }

    return options;
  }

  /**
   * 初始化 options.attr
   */
  function initPropAttribute( name, prop, options ){
    // 当前 prop 是否是 Symbol 类型的
    options.isSymbol = isSymbol( name );
    // 当前 prop 的取值 attribute
    options.attr = prop && prop.attr || (
      options.isSymbol
        // 没有定义 attr 名称且是 symbol 类型的 attr 名称, 则不设置 attr 名称
        ? null
        // 驼峰转为以连字符号连接的小写 attr 名称
        : hyphenate( name )
    );
  }

  /**
   * 初始化 options.type 变量类型
   */
  function initPropType( prop, options ){
    const type = prop.type;

    if( type != null ){
      // String || Number || Boolean || function( value ){ return value };
      if( isFunction( type ) ){
        options.from = type;
      }
      // {
      //   from(){}
      //   to(){}
      // }
      else if( isPlainObject( type ) ){
        if( isFunction( type.from ) ) options.from = type.from;
        if( isFunction( type.to ) ) options.to = type.to;
      }
    }
  }

  /**
   * 初始化 options.default 默认值
   */
  function initPropDefault( prop, options ){
    if( has( prop, 'default' ) ){
      const $default = prop.default;

      if( isFunction( $default ) || !isObject( $default ) ){
        options.default = $default;
      }
    }
  }

  function initLifecycle( userOptions, options, mixins, isMixin ){
    [
      /**
       * 实例初始化后被调用
       *  - 计算属性 computed 和数据监听 watch 还未初始化
       */
      'beforeCreate',
      /**
       * 实例创建完成后被调用
       *  - 但是挂载还未开始
       */
      'created',
      /**
       * 首次挂载开始之前被调用
       *  - 对于自定义元素, 会在被添加到文档流时调用
       *  - 对于自定义元素, 会在 mounted 及 connected 钩子之前执行
       */
      'beforeMount',
      /**
       * 首次挂载之后被调用
       *  - 对于自定义元素, 会在被添加到文档流时调用
       *  - 对于自定义元素, 会在 connected 钩子之前执行
       */
      'mounted',
      /**
       * 实例销毁之前调用
       *  - 此时实例完全可用
       */
      'beforeDestroy',
      /**
       * 实例销毁后调用
       */
      'destroyed',
      /**
       * 自定义元素被添加到文档流 ( 自定义元素独有 )
       *  - 此时实例完全可用
       */
      'connected',
      /**
       * 自定义元素被移动到新文档时调用 ( 自定义元素独有 )
       *  - 只在无需 polyfill 的环境下可用
       *  - 此时实例完全可用
       */
      'adopted',
      /**
       * 自定义元素被从文档流移除 ( 自定义元素独有 )
       *  - 此时实例完全可用
       */
      'disconnected'
    ].forEach( name => {
      const lifecycle = userOptions[ name ];

      if( isFunction( lifecycle ) ){
        const lifecycles = options[ name ] || ( options[ name ] = [] );

        lifecycles.splice( 0, 0, lifecycle );
      }
    });

    if( !isMixin && mixins ){
      for( let mixin of mixins ){
        initLifecycle( mixin, options, null, true );
      }
    }
  }

  // 'beforeUpdate', 'updated',
  // 'activated', 'deactivated',
  // 'errorCaptured'

  var noop = /**
   * 空方法
   */
  () => {};

  function initState( isCustomElement, userOptions, options, mixins, isMixin ){

    const {
      methods,
      data,
      computed,
      watch
    } = userOptions;

    initMethods( methods, options );
    initData( isCustomElement, data, options );
    initComputed( computed, options );
    initWatch( watch, options );
    initStyles( userOptions.styles, options );

    if( !isMixin ){
      // 处理 Mixins
      if( mixins ){
        for( let mixin of mixins ){
          initState( isCustomElement, mixin, options, null, true );
        }
      }
      // 处理自定义元素的样式
      if( options.styles ){
        const style = document.createElement('style');

        style.textContent = options.styles.join('');
        options.styles = style;
      }
    }
  }


  function initMethods( userMethods, options ){
    if( userMethods ){
      const methods = options.methods || ( options.methods = {} );

      each( userMethods, ( key, method ) => {
        if( !methods[ key ] && isFunction( method ) ){
          methods[ key ] = method;
        }
      });
    }
  }

  function initData( isCustomElement, userData, options ){
    if( isFunction( userData ) || !isCustomElement && isPlainObject( userData ) ){
      const dataList = options.dataList || ( options.dataList = [] );

      dataList.push( userData );
    }
  }

  function initComputed( userComputed, options ){
    if( userComputed ){
      const computed = options.computed || ( options.computed = {} );

      each( userComputed, ( key, userComputed ) => {
        if( !computed[ key ] && userComputed ){
          const isFn = isFunction( userComputed );
          const get = isFn ? userComputed : ( userComputed.get || noop );
          const set = isFn ? noop : ( userComputed.set || noop );

          computed[ key ] = {
            get,
            set
          };
        }
      });
    }
  }

  function initWatch( userWatch, options ){
    // 保证 watch 始终被初始化
    // 防止其他地方使用 watch 时且在 Firefox 57 版本之前读取到 Object.prototype.watch
    const watches = options.watch || (
      options.watch = {}
    );

    // 同上, 防止用户未定义 watch 时读取到的是 Object.prototype.watch
    if( isObject( userWatch ) ){
      each( userWatch, ( key, value ) => {
        const watch = watches[ key ] || ( watches[ key ] = [] );

        watch.splice( 0, 0, value );
      });
    }
  }

  function initStyles( userStyles, options ){
    let stylesIsString = isString( userStyles );

    if( stylesIsString || isArray( userStyles ) ){
      const styles = options.styles || ( options.styles = [] );

      if( stylesIsString ) styles.splice( 0, 0, userStyles );
      else styles.splice( 0, 0, ...userStyles );
    }
  }

  const inBrowser = typeof window !== 'undefined';
  const UA = inBrowser && window.navigator.userAgent.toLowerCase();
  const isIOS = UA && /iphone|ipad|ipod|ios/.test( UA );


  let supportsPassive = false;

  try{

    const options = {};

    defineProperty( options, 'passive', {
      get: () => {
        return supportsPassive = true;
      }
    });

    window.addEventListener( 'test-passive', null, options );

  }catch(e){}


  const hasShadyCss = inBrowser
                          && window.ShadyCSS !== void 0
                          && !window.ShadyCSS.nativeShadow;

  const isCEPolyfill = inBrowser
                           && window.customElements !== void 0
                           && window.customElements.polyfillWrapFlushCallback !== void 0;

  function initOther( isCustomElement, userOptions, options, mixins, isMixin ){

    const { render } = userOptions;

    // 渲染方法
    options.render = isFunction( render ) ? render : null;

    if( inBrowser && !isCustomElement ){
      // 挂载目标
      options.el = userOptions.el || void 0;
    }

  }

  const optionsMap = {};

  /**
   * 初始化组件配置
   * @param {boolean} isCustomElement 是否是初始化自定义元素
   * @param {string} name 自定义元素标签名
   * @param {{}} _userOptions 用户传入的组件配置
   */
  function initOptions( isCustomElement, name, _userOptions ){
    /** 克隆一份用户配置 */
    const userOptions = assign( {}, _userOptions );
    /** 格式化后的组件配置 */
    const options = optionsMap[ name ] = create( null );
    /** 混入选项 */
    let mixins = userOptions.mixins;
        mixins = mixins && mixins.length ? mixins.reverse() : null;

    initProps( userOptions, options, mixins );
    initState( isCustomElement, userOptions, options, mixins );
    initLifecycle( userOptions, options, mixins );
    initOther( isCustomElement, userOptions, options);

    return [
      userOptions,
      options
    ];
  }

  let uid = 0;

  var uid$1 = /**
   * 返回一个字符串 UID
   */
  () => '' + uid++;

  var defineProperty$1 = /**
   * 在传入对象上定义可枚举可删除的一个新属性
   * 
   * @param {any} 需要定义属性的对象
   * @param {string} key 需要定义的属性名称
   */
  ( obj, key, attributes ) => {
    defineProperty(
      obj, key,
      assign(
        { enumerable: true, configurable: true },
        attributes
      )
    );
  };

  const callbacks = [];
  let pending = false;

  function flushCallbacks(){
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for( let copy of copies ) copy();
  }


  const resolve = Promise.resolve();
  const timerFunc = () => {
    resolve.then( flushCallbacks );

    if( isIOS ){
      setTimeout( noop );
    }
  };


  function nextTick( callback, ctx ){
    let resolve;

    callbacks.push(() => {
      if( callback ){
        callback.call( ctx );
      }else{
        resolve( ctx );
      }
    });

    if( !pending ){
      pending = true;
      timerFunc();
    }

    if( !callback ){
      return new Promise( _resolve => {
        resolve = _resolve;
      });
    }
  }

  /** 异步更新队列 */
  const queue = [];
  /** 判断异步更新队列中是否有一个更新请求 */
  const queueMap = new Map();
  /** 是否已经有一个队列正在等待执行或正在执行了 */
  let waiting = false;
  /** 是否已经有一个队列正在执行了 */
  let flushing = false;
  /** 队列执行到哪了 */
  let index = 0;


  /**
   * 将一个更新请求放入队列中
   */
  function queueUpdate( watcher ){
    // 当前异步更新队列中没有当前更新请求
    // 或者上一个当前更新请求已经执行完毕了
    if( !queueMap.has( watcher ) ){
      // 标识当前更新请求已经添加了
      queueMap.set( watcher, true );

      // 如果当前异步更新队列还未启动
      // 那么直接直接将当前更新请求添加进去
      if( !flushing ){
        queue.push( watcher );
      }
      // 当前异步更新队列已经启动
      // 则将当前更新请求按照 id 排列好
      else{
        let i = queue.length - 1;
        while( i > index && queue[ i ].id > watcher.id ){
          i--;
        }
        queue.splice( i + 1, 0, watcher );
      }

      // 如果当前没有异步更新队列在执行或等待执行
      // 那么就执行当前的异步更新队列
      if( !waiting ){
        waiting = true;
        nextTick( flushSchedulerQueue );
      }
    }
  }

  /**
   * 执行异步更新队列
   */
  function flushSchedulerQueue(){
    flushing = true;
    index = 0;

    // 保证执行顺序
    queue.sort(( watcherA, watcherB ) => {
      return watcherA.id - watcherB.id;
    });

    for( let watcher; index < queue.length; index++ ){
      watcher = queue[ index ];

      // 标识当前更新请求已经执行完毕了
      queueMap.delete( watcher );

      // 略过在等待队列执行的过程中就已经被更新了的计算属性
      if( watcher.isComputed && !watcher.shouldUpdate ){
        continue;
      }

      // 执行更新
      watcher.get();
    }

    // 标识当前异步更新队列已经执行完毕了
    // 下一个更新请求会进入下一个 tick 进行更新
    waiting = flushing = false;
    index = queue.length = 0;
    queueMap.clear();
  }

  class Watcher{
    /**
     * 
     * @param {function} fn 需要收集依赖的方法
     * @param {boolean} isComputed true:  计算属性
     *                             false: 监听方法
     * @param {boolean} isWatchDeep 是否是用于创建深度监听
     * @param {*} observeOptions 计算属性的观察者对象选项参数
     * @param {*} name 计算属性的名称
     */
    constructor( fn, isComputed, isWatchDeep, observeOptions, name ){
      // 当前方法收集依赖的 ID, 用于从 dependentsMap ( 存储 / 读取 ) 依赖项
      this.id = uid$1();
      // 当前 watcher 在运行时收集的依赖集合
      this.deps = new Set();
      // 需要收集依赖的方法
      this.fn = fn;
      // 当订阅的依赖更新后, 会调用当前方法重新计算依赖
      this.get = Watcher.get.bind( this );
      // 存储其他参数
      if( isComputed ){
        let shouldUpdate;

        this.isComputed = isComputed;
        this.observeOptions = observeOptions;
        this.name = name;
        // 依赖是否需要更新 ( 无依赖时可只在使用时进行更新 )
        defineProperty$1( this, 'shouldUpdate', {
          get: () => shouldUpdate,
          set: value => {
            if( shouldUpdate = value ) this.ssu();
          }
        });
      }else if( isComputed === false ){
        this.isWatch = true;
        this.isWatchDeep = isWatchDeep;
      }
    }
    /** 传入方法的依赖收集包装 */
    static get( result ){
      // 清空依赖
      this.clean();
      // 标记已初始化
      this.isInit = true;
      // 标记计算属性已无需更新
      if( this.isComputed ) this.shouldUpdate = false;

      // 开始收集依赖
      pushTarget( this );

      // 执行方法
      // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps
      result = this.fn();

      // 需要进行深度监听
      if( this.isWatchDeep ) this.wd( result );

      // 方法执行完成, 则依赖收集完成
      popTarget();

      return result;
    }
    /** 标记订阅信息 */
    add( subs, name ){
      let sub = subs[ name ] || (
        subs[ name ] = new Set
      );

      // 添加当前 watcher 信息到 sub
      // 当前值被改变时, 会调用 update 方法进入更新队列
      sub.add( this );
      // 添加 sub 的信息到当前 watcher 去
      // 当依赖方法被重新调用, 会移除订阅的依赖
      this.deps.add( sub );
    }
    /** 依赖的重新收集 */
    update(){
      if( this.isComputed ){
        // 下次被访问时就要立即更新哟
        this.shouldUpdate = true;
        // 没有依赖
        // 无需加入更新队列
        if( this.lazy ) return;
      }

      queueUpdate( this );
    }
    /** 清空之前收集的依赖 */
    clean(){
      // 对之前收集的依赖进行清空
      for( let watch of this.deps ) watch.delete( this );
      // 清空依赖
      this.deps.clear();
    }
    /** 仅为监听方法时使用 -> 对依赖的最终返回值进行深度监听 ( watch deep ) */
    wd( result ){
      const observeOptions = observeProxyMap.get( result );

      if( observeOptions ){
        observeOptions.deepSubs.add( this );
      }
    }
    /** 仅为计算属性时使用 -> 遍历依赖于当前计算属性的依赖参数 ( each ) */
    ec( callback ){
      let { subs } = this.observeOptions;
      let sub;

      if( subs && ( sub = subs[ this.name ] ) && sub.size ){
        for( let cd of sub )
          if( callback( cd ) === false ) break;
      }
    }
    /** 仅为计算属性时使用 -> 递归设置当前计算属性的依赖计算属性需要更新 ( set should update ) */
    ssu(){
      this.ec( cd => {
        if( cd.isComputed && cd.lazy ){
          cd.shouldUpdate = true;
        }
      });
    }
    /** 仅为计算属性时使用 -> 判断当前计算属性是否没有依赖 */
    get lazy(){
      let lazy = true;

      this.ec( cd => {
        // 依赖是监听方法          依赖是 render 方法                依赖是计算属性且有依赖
        if( cd.isWatch || ( !cd.isComputed && !cd.isWatch ) || ( cd.isComputed && !cd.lazy ) ){
          return lazy = false;
        }
      });

      return lazy;
    }
  }

  /**
   * 渲染函数的 Watcher 缓存
   */
  const renderWatcherCache = new WeakMap();

  /**
   * Render 渲染方法调用堆栈
   */
  const renderStack = [];

  /**
   * Render 渲染方法的 NodePart 缓存
   */
  const renderParts = new WeakMap();

  /**
   * 判断传入对象是否是原始对象
   */
  var isPrimitive = value => {
    return value === null || !(
      isObject( value ) || isFunction( value )
    );
  };

  /**
   * 判断传入对象是否可迭代
   */
  var isIterable = value => {
    return isString( value ) || !!(
      value && value[ Symbol.iterator ]
    );
  };

  var removeNodes = /**
   * 移除某个元素下的所有子元素
   * @param {Element} container
   * @param {Node} startNode
   * @param {Node} endNode
   */
  ( container, startNode, endNode = null ) => {
    let node = startNode;

    while( node != endNode ){
      const next = node.nextSibling;

      container.removeChild( node );
      node = next;
    }
  };

  var createMarker = () => {
    return document.createComment('');
  };

  var isSingleBind = /**
   * 判断是否使用的是单插值绑定
   * @param {stirngs[]} strings
   */
  strings => {
    return strings.length === 2 && strings[0] === '' && strings[1] === '';
  };

  var rWhitespace = /\s+/;

  /**
   * 存放上次设置的 class 内容
   */
  const classesMap = new WeakMap();


  class ClassDirective{

    constructor( element, strings, modifiers ){
      if( !isSingleBind( strings ) ){
        throw new Error(':class 指令的传值只允许包含单个表达式 !');
      }

      this.elem = element;
    }

    commit( value, isDirectiveFn ){
      // 用户传递的是指令方法
      // 交给指令方法处理
      if( isDirectiveFn ) return value( this );

      /** 转为对象形式的 class */
      const classes = this.parse( value );
      /** 当前元素的 classList 对象 */
      const classList = this.elem.classList;

      // 非首次运行
      if( classesMap.has( this ) ){
        const oldClasses = classesMap.get( this );

        // 移除旧 class
        each( oldClasses, name => {
          has( classes, name ) || classList.remove( name );
        });
        // 添加新 class
        each( classes, name => {
          has( oldClasses, name ) || classList.add( name );
        });
      }
      // 首次运行
      else{
        each( classes, name => {
          return classList.add( name );
        });
      }

      // 保存最新的 classes
      classesMap.set( this, classes );
    }

    /**
     * 格式化用户传入的 class 内容
     */
    parse( value, classes = {} ){
    
      // 处理不同类型的 class 内容
      switch( typeof value ){
        case 'string': {
          value.split( rWhitespace ).forEach( name => {
            return classes[ name ] = true;
          });
          break;
        }
        case 'object': {
          if( isArray( value ) ){
            value.forEach( name => {
              return this.parse( name, classes );
            });
          }else{
            each( value, ( name, truthy ) => {
              return truthy ? this.parse( name, classes )
                            : delete classes[ name ];
            });
          }
        }
      }

      return classes;
    }

  }

  var rListDelimiter = /;(?![^(]*\))/g;

  var rPropertyDelimiter = /:(.+)/;

  var parseStyleText = /**
   * 解析 style 字符串, 转换为 JSON 格式
   * @param {String} value
   */
  cached( styleText => {
    const styles = {};

    styleText.split( rListDelimiter ).forEach( item => {
      if( item ){
        const tmp = item.split( rPropertyDelimiter );

        if( tmp.length > 1 ){
          styles[ tmp[0].trim() ] = tmp[1].trim();
        }
      }
    });

    return styles;
  });

  /**
   * 存放上次设置的 style 内容
   */
  const styleMap = new WeakMap();


  class StyleDirective{

    constructor( element, strings, modifiers ){
      if( !isSingleBind( strings ) ){
        throw new Error(':style 指令的传值只允许包含单个表达式 !');
      }

      this.elem = element;
    }

    commit( value, isDirectiveFn ){
      // 用户传递的是指令方法
      // 交给指令方法处理
      if( isDirectiveFn ) return value( this );

      /** 转为对象形式的 styles */
      const styles = this.parse( value );
      /** 当前元素的 style 对象 */
      const style = this.elem.style;
      /** 上次设置的 styles */
      const oldStyles = styleMap.get( this );

      // 移除旧 style
      //  - 如果没有上次设置的 styles, each 方法内回调是不会被执行的
      each( oldStyles, ( name, value ) => {
        has( styles, name ) || style.removeProperty( name );
      });
      // 添加 style
      each( styles, ( name, value ) => {
        style.setProperty( name, value );
      });

      // 保存最新的 styles
      styleMap.set( this, styles );
    }

    /**
     * 格式化用户传入的 style 内容
     */
    parse( value, styles = {} ){

      // 处理不同类型的 styles 内容
      switch( typeof value ){
        case 'string': return this.parse(
          parseStyleText( value ),
          styles
        );
        case 'object': {
          if( isArray( value  ) ){
            value.forEach( value => {
              return this.parse( value, styles );
            });
          }else{
            each( value, ( name, value ) => {
              return styles[ hyphenate( name ) ] = value;
            });
          }
        }
      }

      return styles;
    }

  }

  /**
   * 事件绑定方法
   */
  const addEventListener = HTMLElement.prototype.addEventListener;


  var addEventListener$1 = /**
   * 绑定事件
   * @param {Element} elem
   * @param {string} type
   * @param {function} listener
   * @param {boolean|{}} options
   */
  ( elem, type, listener, options ) => {
    addEventListener.call( elem, type, listener, options );
  };

  const {
    filter,
    slice
  } = prototype$1;

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  const unicodeLetters = 'a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD';
  const bail = new RegExp(`[^${ unicodeLetters }.$_\\d]`);

  /**
   * Transplant from Vue
   */
  function parsePath( path ){
    if( bail.test( path ) ){
      return;
    }

    var segments = path.split('.');

    return function(){
      let obj = this;

      for( let segment of segments ){
        if( !obj ) return;
        obj = obj[ segment ];
      }
      return obj;
    }
  }

  var returnFalse = /**
   * 返回 false
   */
  () => false;

  /**
   * @param {any} self 计算属性的 this 指向
   * @param {boolean} isWatch 当前是否用于创建监听
   */
  var createComputed = ( self, isWatch ) => {

    /** 当前计算属性容器的子级的一些参数 */
    const computedOptionsMap = new Map();
    /** 当前计算属性容器对象 */
    const computedTarget = create( null );
    /** 当前计算属性容器的观察者对象 */
    const computedTargetProxy = observe( computedTarget );
    /** 当前计算属性容器的获取与修改拦截器 */
    const computedTargetProxyInterceptor = new Proxy( computedTargetProxy, {
      get: computedTargetProxyInterceptorGet( computedOptionsMap ),
      set: computedTargetProxyInterceptorSet( computedOptionsMap ),
      deleteProperty: returnFalse
    });

    /** 给当前计算属性添加子级的方法 */
    const appendComputed = createAppendComputed.call( self, computedTarget, computedTargetProxy, computedOptionsMap, isWatch );
    /** 给当前计算属性移除子级的方法 */
    let removeComputed = createRemoveComputed.call( self, computedOptionsMap );

    return [
      computedOptionsMap,
      removeComputed,
      appendComputed,
      computedTarget,
      computedTargetProxyInterceptor
    ];
  };


  /**
   * 返回添加单个计算属性的方法
   */
  function createAppendComputed( computedTarget, computedTargetProxy, computedOptionsMap, isWatch ){

    const isComputed = !isWatch;
    const observeOptions = isComputed && observeMap.get( computedTarget );

    /**
     * @param {string} name 计算属性存储的名称
     * @param {{}} computed 计算属性 getter / setter 对象
     * @param {boolean} isWatchDeep 当前计算属性是否是用于创建深度监听
     */
    return ( name, computed, isWatchDeep ) => {
      /** 计算属性的 setter */
      const set = ( computed.set || noop ).bind( this );
      /** 计算属性的 getter */
      const get = computed.get.bind( this );
      /** 计算属性的 watcher */
      const watcher = new Watcher(
        () => {
          if( isWatch ) return computedTarget[ name ] = get();
          return computedTargetProxy[ name ] = get( this );
        },
        isComputed, isWatchDeep,
        observeOptions, name
      );

      // 添加占位符
      computedTarget[ name ] = void 0;
      // 存储计算属性参数
      computedOptionsMap.set( name, {
        watcher,
        set
      });
    };
  }

  /**
   * 返回移除单个计算属性的方法
   */
  function createRemoveComputed( computedOptionsMap ){
    /**
     * @param name 需要移除的计算属性
     */
    return name => {
      // 获取计算属性的参数
      const computedOptions = computedOptionsMap.get( name );

      // 有这个计算属性
      if( computedOptions ){
        const watcher = computedOptions.watcher;

        // 清空依赖
        watcher.clean();
        // 删除计算属性
        computedOptionsMap.delete( name );
        // 如果当前 ( 计算属性 / watch ) 在异步更新队列中, 则进行删除
        if( queueMap.has( watcher ) ){
          // 从异步更新队列标记中删除
          queueMap.delete( watcher );
          // 从异步更新队列中删除
          for( let i = index, len = queue.length; i < len; i++ ){
            if( queue[ i ] === watcher ){
              queue.splice( i, 1 );
              break;
            }
          }
        }
      }
    };
  }

  /**
   * 返回计算属性的获取拦截器
   */
  const computedTargetProxyInterceptorGet = computedOptionsMap => ( target, name ) => {
    // 获取计算属性的参数
    const computedOptions = computedOptionsMap.get( name );

    // 防止用户通过 $computed 获取不存在的计算属性
    if( computedOptions ){
      const watcher = computedOptions.watcher;

      // 计算属性未初始化或需要更新
      if( !watcher.isInit || watcher.shouldUpdate ){
        watcher.get();
      }
    }

    return target[ name ];
  };

  /**
   * 返回计算属性的设置拦截器
   */
  const computedTargetProxyInterceptorSet = computedOptionsMap => ( target, name, value ) => {
    const computedOptions = computedOptionsMap.get( name );

    // 防止用户通过 $computed 设置不存在的计算属性
    if( computedOptions ){
      return computedOptions.set( value ), true;
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
  function $watch( expOrFn, callback, options ){
    // 另一种写法
    if( isPlainObject( callback ) ){
      return this.$watch( expOrFn, callback.handler, callback );
    }

    const self = this || emptyObject;
    let watchFn;

    // 使用键路径表达式
    if( isString( expOrFn ) ){
      watchFn = parsePath( expOrFn ).bind( self );
    }
    // 使用计算属性函数
    else if( isFunction( expOrFn ) ){
      watchFn = expOrFn.bind( self );
    }
    // 不支持其他写法
    else return;

    let removeWatch, appendWatch, watchTarget, watchTargetProxyInterceptor;
    let watchOptions;

    if( watcherMap.has( self ) ){
      watchOptions = watcherMap.get( self );
    }else{
      watchOptions = createComputed( null, true );
      // 存储当前实例 watch 相关数据
      watcherMap.set( self, watchOptions );
    }

    [ , removeWatch, appendWatch, watchTarget, watchTargetProxyInterceptor ] = watchOptions;

    // 初始化选项参数
    options = options || {};

    /** 当前 watch 的存储名称 */
    const name = uid$1();
    /** 当前 watch 的回调函数 */
    const watchCallback = callback.bind( self );
    /** 监听对象内部值的变化 */
    const isWatchDeep = !!options.deep;
    /** 值改变是否运行回调 */
    let immediate, runCallback = immediate = !!options.immediate;

    // 添加监听
    appendWatch( name, {
      get: () => {
        const oldValue = watchTarget[ name ];
        const value = watchFn();

        if( runCallback ){
          //   首次运行             值不一样        值一样的话, 判断是否是深度监听
          if( immediate || !isEqual( value, oldValue ) || isWatchDeep ){
            watchCallback( value, oldValue );
          }
        }

        return value;
      }
    }, isWatchDeep );

    // 首次运行, 以收集依赖
    watchTargetProxyInterceptor[ name ];
    // 下次值改变时运行回调
    runCallback = true;
    immediate = false;

    // 返回取消监听的方法
    return () => {
      removeWatch( name );
    }
  }

  var getAttribute = /**
   * 获取元素属性
   * @param {Element} elem
   * @param {string} attr
   */
  ( elem, attr ) => {
    return elem.getAttribute( attr );
  };

  /**
   * 事件移除方法
   */
  const removeEventListener = HTMLElement.prototype.removeEventListener;


  var removeEventListener$1 = /**
   * 移除事件
   * @param {Element} elem
   * @param {string} type
   * @param {function} listener
   * @param {boolean|{}} options
   */
  ( elem, type, listener, options ) => {
    removeEventListener.call( elem, type, listener, options );
  };

  class ModelDirective{

    constructor( element, strings, modifiers ){
      if( !isSingleBind( strings ) ){
        throw new Error(':model 指令的传值只允许包含单个表达式 !');
      }

      const tag = element.nodeName.toLowerCase();
      const type = element.type;
      let handler;

      // 选择框
      if( tag === 'select' ){
        handler = handlerSelect;
      }
      // 复选框
      else if( tag === 'input' && type === 'checkbox' ){
        handler = handlerCheckbox;
      }
      // 单选框
      else if( tag === 'input' && type === 'radio' ){
        handler = handlerRadio;
      }
      // 普通文本框
      else if( tag === 'input' || tag === 'textarea' ){
        handler = handlerDefault;
      }

      this.elem = element;
      this.handler = handler;
      this.events = [];
    }

    commit( value, isDirectiveFn ){
      if( isDirectiveFn || !( isArray( value ) && value.length > 1 ) ){
        throw new Error(':model 指令的参数出错, 不支持此种传参 !');
      }

      let init;
      let handler;
      let options;

      // 有双向绑定处理函数
      // 说明在可处理的元素范围内
      if( handler = this.handler ){

        // 需要处理观察者对象, 为了避免被 render 函数捕获
        // 需要添加一个空的占位符到调用堆栈中
        pushTarget();

        options = this.options || (
          this.options = observe([])
        );

        options.splice( 0, 2, ...value );

        if( init = this.init ){
          this.set( value[ 0 ][ value[ 1 ] ] );
        }

        // 处理观察者对象完成
        // 移除占位符
        popTarget();

        // 若未初始化过监听, 则进行初始化
        if( !init ){
          this.init = true;
          handler( this, this.elem, options );
        }
      }
    }

    destroy(){
      // 解绑值监听绑定值
      if( this.init ){
        // 清除值绑定
        this.unWatch();
        // 清除事件绑定
        this.events.forEach( args => {
          apply( removeEventListener$1, null, args );
        });
      }
    }

  }


  function watch( model, options, element, prop ){
    /**
     * 监听到绑定的值被更改后
     * 给绑定的对象赋值的方法
     */
    const set = isFunction( prop ) ? prop : value => element[ prop ] = value;

    // 若后续绑定对象发生更改, 需要调用方法立即更新
    model.set = set;
    // 监听绑定的值
    model.unWatch = $watch(
      // 监听绑定的值
      () => options[ 0 ][ options[ 1 ] ],
      // 响应绑定值更改
      value => set( value ),
      // 立即响应
      { immediate: true }
    );
  }

  function addEvent( model, ...args ){
    // 存储事件
    model.events.push( args );
    // 绑定事件
    apply( addEventListener$1, null, args );
  }




  /**
   * 对 select 元素进行双向绑定
   * @param {ModelDirective} model 
   * @param {Element} element 
   * @param {[ {}, string ]} options 
   */
  function handlerSelect( model, element, options ){
    // 监听绑定值改变
    watch( model, options, element, 'value' );
    // 监听控件值改变
    addEvent( model, element, 'change', event => {
      const value = filter.call( element.options, option => option.selected ).map( option => option.value );
      options[ 0 ][ options[ 1 ] ] = element.multiple ? value : value[0];
    });
  }

  /**
   * 对 input[ type = "checkbox" ] 元素进行双向绑定
   * @param {ModelDirective} model 
   * @param {Element} element 
   * @param {[ {}, string ]} options 
   */
  function handlerCheckbox( model, element, options ){
    // 监听绑定值改变
    watch( model, options, element, 'checked' );
    // 监听控件值改变
    addEvent( model, element, 'change', event => {
      options[ 0 ][ options[ 1 ] ] = element.checked;
    });
  }

  /**
   * 对 input[ type = "radio" ] 元素进行双向绑定
   * @param {ModelDirective} model 
   * @param {Element} element 
   * @param {[ {}, string ]} options 
   */
  function handlerRadio( model, element, options ){
    // 监听绑定值改变
    watch( model, options, element, value => {
      element.checked = value === ( getAttribute( element, 'value' ) || null );
    });
    // 监听控件值改变
    addEvent( model, element, 'change', event => {
      options[ 0 ][ options[ 1 ] ] = getAttribute( element, 'value' ) || null;
    });
  }

  /**
   * 对 input, textarea 元素进行双向绑定
   * @param {ModelDirective} model 
   * @param {Element} element 
   * @param {[ {}, string ]} options 
   */
  function handlerDefault( model, element, options, input ){
    // 监听绑定值改变
    watch( model, options, element, 'value' );
    // 监听控件值改变
    addEvent( model, element, 'compositionstart', () => {
      element.composing = true;
    });
    addEvent( model, element, 'compositionend', () => {
      if( !element.composing ) return;

      element.composing = false;
      input();
    });
    addEvent( model, element, 'input', input = () => {
      if( element.composing || !options.length ) return;

      options[ 0 ][ options[ 1 ] ] = element.value;
    });
  }

  var toString$1 = /**
   * 将值转为字符串形式
   * @param {any} value
   */
  value => {
    // null -> ''
    // undefined -> ''
    if( value == null ) return '';
    // '' -> ''
    if( isString( value ) ) return value;
    // [] -> '[]'
    // {} -> '{}'
    if( isArray( value ) || ( isPlainObject( value ) && value.toString === emptyObject.toString ) ){
      return JSON.stringify( value, null, 2 );
    }
    // true -> 'true'
    // false -> 'false'
    // 123 -> '123'
    // ...
    return String( value );
  };

  class TextDirective{

    constructor( element, strings, modifiers ){
      if( !isSingleBind( strings ) ){
        throw new Error(':text 指令的传值只允许包含单个表达式 !');
      }

      this.elem = element;
    }

    commit( value, isDirectiveFn ){
      // 用户传递的是指令方法
      // 交给指令方法处理
      if( isDirectiveFn ) return value( this );
      // 两次传入的值不同
      if( !has( this, 'value' ) || isNotEqual( value, this.value ) ){
        this.elem.textContent = toString$1( this.value = value );
      }
    }

  }

  class HtmlDirective{

    constructor( element, strings, modifiers ){
      if( !isSingleBind( strings ) ){
        throw new Error(':html 指令的传值只允许包含单个表达式 !');
      }

      this.elem = element;
    }

    commit( value, isDirectiveFn ){
      // 用户传递的是指令方法
      // 交给指令方法处理
      if( isDirectiveFn ) return value( this );
      // 两次传入的值不同
      if( !has( this, 'value' ) || isNotEqual( value, this.value ) ){
        this.elem.innerHTML = toString$1( this.value = value );
      }
    }

  }

  class ShowDirective{

    constructor( element, strings, modifiers ){
      if( !isSingleBind( strings ) ){
        throw new Error(':text 指令的传值只允许包含单个表达式 !');
      }

      this.elem = element;
    }

    commit( value, isDirectiveFn ){
      // 用户传递的是指令方法
      // 交给指令方法处理
      if( isDirectiveFn ) return value( this );
      // 首次设置值或两次传入的值不同
      if( !has( this, 'value' ) || isNotEqual( value, this.value ) ){
        this.value = value;
        this.elem.style.display = value ? '' : 'none';
      }
    }

  }

  /**
   * 创建一个干净的目标对象
   * 并把传入方法的对象全部浅拷贝到目标对象并返回目标对象
   */
  var create$1 = ( ...args ) => {
    return apply( assign, null, [
      create( null ), ...args
    ]);
  };

  const {
    random
  } = Math;

  /**
   * 内置指令
   */
  const directives = create$1({
    class: ClassDirective,
    style: StyleDirective,
    model: ModelDirective,
    text: TextDirective,
    html: HtmlDirective,
    show: ShowDirective
  });

  /**
   * 用户定义指令
   */
  const userDirectives = create$1({

  });

  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#elements-attributes
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-characters
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
   * space character except " ".
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
  const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  const boundAttributeSuffix = '$hu$';
  const boundAttributeSuffixLength = boundAttributeSuffix.length;
  const boundAttributeSuffixRegex = /\$hu\$/g;

  const marker = `{{hu-${ String( random() ).slice(2) }}}`;
  const nodeMarker = `<!--${ marker }-->`;
  const markerRegex = new RegExp(`${ marker }|${ nodeMarker }`);

  const commentMarker = ` ${ marker } `;
  const commentMarkerRegex = new RegExp( commentMarker, 'g' );

  class Template{

    constructor( result, element ){
      this.element = element;
      this.parts = [];

      if( result.values.length ){
        // 最后一个参数那样传值没有别的原因, 就是满足下自己的强迫症而已
        // 啥强迫症 ?
        // 看 init 方法接收值的地方
        this.init( result, element, this );
      }
    }

    init(
      { strings, values: { length } },
      { content },
      { parts }
    ){
      const walker = document.createTreeWalker( content, 133, null, false );
      const nodesToRemove = [];
      const templateStack = [];
      let partIndex = 0;
      let lastPartIndex = 0;
      let index = -1;

      while( partIndex < length ){
        const node = walker.nextNode();

        // 当前解析的节点是 template 元素的子节点
        // 如果 template 元素的子节点解析完成后, 会从堆栈中取出最后解析的 template 元素, 然后继续解析下面的内容
        if( node === null ){
          walker.currentNode = templateStack.pop();
          continue;
        }

        index++;

        switch( node.nodeType ){

          // ElementNode
          case 1: {
            if( node.hasAttributes() ){
              const attributes = node.attributes;
              const length = attributes.length;
    
              // 遍历当前元素节点的所有属性 ( attribute )
              // 得到当前元素节点的所有属性绑定总和
              let count = 0;
              for( let index = 0; index < length; index++ ){
                endsWith( attributes[ index ].name, boundAttributeSuffix ) && (
                  count++
                );
              }

              // 将当前元素节点上所有以插值绑定写入的属性按照顺序取出
              while( count-- > 0 ){
                /** 当前属性插值绑定片段 */
                const stringForPart = strings[ partIndex ];
                /** 属性名称 */
                const name = lastAttributeNameRegex.exec( stringForPart )[2];
                /** 实际属性名称 */
                const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                /** 属性值 */
                const attributeValue = getAttribute( node, attributeLookupName );
                /** 属性值的静态内容合集 */
                const statics = attributeValue.split( markerRegex );

                node.removeAttribute( attributeLookupName );
                partIndex += statics.length - 1;
                parts.push({
                  type: 'attribute',
                  index,
                  name,
                  strings: statics
                });
              }
            }
            // 当前解析的节点是 template 元素
            // 因为 TreeWalker 不会主动解析 template 元素的子节点
            // 所以将当前节点保存到堆栈, 然后手动将当前节点重定向至 template 的内容根节点, 开始解析 template 元素的子节点
            // 如果在当前 template 元素的子节点中又遇到了新的 template 元素, 那么重复上述两个操作
            // 如果 template 元素的子节点解析完成后, 会从堆栈中取出最后解析的 template 元素, 然后继续解析下面的内容
            if( node.tagName === 'TEMPLATE' ){
              templateStack.push( node );
              walker.currentNode = node.content;
            }
            break;
          }

          // TextNode
          case 3: {
            const data = node.data;

            // 解析类似元素属性绑定的绑定
            if( data.indexOf( marker ) >= 0 ){
              const parent = node.parentNode;
              const strings = data.split( markerRegex );
              const lastIndex = strings.length - 1;

              // 解析当前文本节点中所有的类似元素属性绑定的绑定
              // 将单个文本节点根据插值绑定分割成多个文本节点
              for( let i = 0; i < lastIndex; i++ ){
                let string = strings[ i ];
                const match = lastAttributeNameRegex.exec( string );

                if( match !== null && endsWith( match[2], boundAttributeSuffix ) ){
                  string = string.slice( 0, match.index )
                         + match[ 1 ]
                         + match[ 2 ].slice( 0, -boundAttributeSuffixLength )
                         + match[ 3 ];
                }

                parent.insertBefore(
                  document.createTextNode( string ),
                  node
                );
                parts.push({
                  type: 'node',
                  index: ++index
                });
              }

              // 如果当前节点末尾除了插值绑定还有其他内容
              // 那么可以将当前文本节点作为结束标记
              if( strings[ lastIndex ] !== '' ) node.data = strings[ lastIndex ];
              // 如果当前节点不可作为结束标记
              // 那么需要添加一个空注释节点作为结束标记
              else{
                nodesToRemove.push( node );
                parent.insertBefore(
                  createMarker(),
                  node
                );
              }

              partIndex += lastIndex;
            }
            break;
          }

          // CommentNode
          case 8: {
            // 当前注释是插值绑定生成的注释标记
            if( node.data === marker ){
              // 如果没有可以作为开始标记的节点
              // 或者上一个节点已经被上一个插值绑定作为开始节点了
              // 那么需要添加一个空注释节点作为开始标记
              if( node.previousSibling === null || index === lastPartIndex ){
                index++;
                node.parentNode.insertBefore(
                  createMarker(),
                  node
                );
              }

              lastPartIndex = index;
              parts.push({
                type: 'node',
                index
              });

              // 如果没有可以作为结束标记的节点
              // 那么将当前注释本身清空作为结束标记
              if( node.nextSibling === null ) node.data = '';
              // 如果有可以作为结束标记的节点
              // 那么可以删除掉当前注释节点
              else{
                nodesToRemove.push( node );
                index--;
              }

              partIndex++;
            }
            // 正常注释
            else{
              const data = node.data = node.data.replace( commentMarkerRegex, marker ).replace( boundAttributeSuffixRegex, '' );
              let markerIndex = -1;

              // 查找注释中所有插值绑定
              while( ( markerIndex = data.indexOf( marker, markerIndex + 1 ) ) !== -1 ){
                partIndex++;
                parts.push({
                  type: 'node',
                  index: -1
                });
              }
            }
            break;
          }

        }
      }

      // 将收集到的可移除的节点进行删除
      for( let node of nodesToRemove ){
        node.parentNode.removeChild( node );
      }
    }
  }


  function endsWith( str, suffix ){
    const index = str.length - suffix.length;
    return index >= 0 && str.slice( index ) === suffix;
  }

  /**
   * 所有模板类型的缓存对象
   */
  const templateCaches = create( null );

  var templateFactory = result => {
    /**
     * 当前模板类型的缓存对象
     *  - 'html'
     *  - 'svg'
     */
    let templateCache = templateCaches[ result.type ];

    // 如果没有获取到当前模板类型的缓存对象
    // 则进行创建并进行缓存
    if( !templateCache ){
      templateCaches[ result.type ] = templateCache = {
        stringsArray: new WeakMap(),
        keyString: create( null )
      };
    }

    /**
     * 当前模板字面量对应的处理模板
     */
    let template = templateCache.stringsArray.get( result.strings );

    // 获取到了值, 说明之前处理过该模板字面量, 直接返回对应模板
    if( template ){
      return template;
    }

    /**
     * 使用随机的密钥连接模板字面量, 连接后完全相同的模板字面量字符串会公用同一个模板
     */
    const key = result.strings.join( marker );

    // 尝试获取当前模板字面量字符串对应的模板
    template = templateCache.keyString[ key ];

    // 如果没有获取到当前模板字面量字符串对应的模板
    // 则进行创建并进行缓存
    if( !template ){
      templateCache.keyString[ key ] = template = new Template(
        result,
        result.getTemplateElement()
      );
    }

    // 缓存当前模板
    templateCache.stringsArray.set( result.strings, template );

    // 返回对应模板
    return template;
  };

  class AttributeCommitter{

    constructor( element, name, strings, modifiers ){
      this.elem = element;
      this.name = name;
      this.strings = strings;
      this.parts = Array.apply( null, { length: this.length = strings.length - 1 } ).map(() => {
        return new AttributePart( this );
      });
    }

    getValue(){
      const { strings, parts, length } = this;
      let index = 0;
      let result = '';

      for( let { value } of parts ){
        result += strings[ index++ ];

        if( value != null && isIterable( value ) && !isString( value ) ){
          for( let item of value ){
            result += toString$1( item );
          }
          continue;
        }

        result += toString$1( value );
      }

      return result + strings[ length ];
    }

    commit(){
      this.elem.setAttribute(
        this.name,
        this.getValue()
      );
    }

  }

  class AttributePart{

    constructor( committer ){
      this.committer = committer;
    }

    commit( value, isDirectiveFn ){
      // 用户传递的是指令方法
      // 交给指令方法处理
      if( isDirectiveFn ) return value( this );
      // 两次传入的值不同
      if( isNotEqual( value, this.value ) ){
        // 存储当前值
        this.value = value;
        // 更新属性值
        this.committer.commit( value );
      }
    }

  }

  /**
   * 包含了使用 Hu 注册的组件合集
   */
  const definedCustomElement = new Set();

  /**
   * 当前正在运行的自定义元素和对应实例的引用
   *  - 使用自定义元素获取对应实例时使用, 避免有可能 root.$hu 被删除的问题
   */
  const activeCustomElement = new WeakMap();

  /**
   * 当前正在运行的实例的 $el 选项与实例本身的引用
   */
  const activeHu = new WeakMap();

  class BasicEventDirective{

    constructor( element, type, strings, modifiers ){
      if( !isSingleBind( strings ) ){
        throw new Error('@event 指令的传值只允许包含单个表达式 !');
      }

      this.elem = element;
      this.type = type;
      const options = this.opts = this.init( modifiers );
      const isCE = this.isCE = definedCustomElement.has(
        element.nodeName.toLowerCase()
      );

      this.addEvent( element, type, options, isCE, this );
    }

    commit( value, isDirectiveFn ){
      // 用户传递的是指令方法
      // 交给指令方法处理
      if( isDirectiveFn ) return value( this );
      // 保存传入的事件
      this.value = value;
    }

    /**
     * 事件绑定
     * @param {Element} element 需要绑定事件的 DOM 元素
     * @param {String} type 需要绑定的事件名称
     * @param {{}} options 事件参数
     * @param {Boolean} isCE 绑定事件的 DOM 元素是否是自定义元素组件
     * @param {BasicEventDirective} self 当前指令对想
     */
    addEvent( element, type, { once, native, options, modifiers }, isCE, self ){
      // 绑定的对象是注册的自定义元素
      if( isCE && !native ){
        const instance = activeCustomElement.get( element );
        const fn = once ? '$once' : '$on';

        instance[ fn ]( type, this.listener = function( ...args ){
          isFunction( self.value ) && apply( self.value, this, args );
        });
      }
      // 绑定的对象是正常 DOM 元素
      else addEventListener$1(
        element, type,
        this.listener = function listener( event ){
          // 修饰符检测
          for( let modifier of modifiers ){
            if( modifier( element, event, modifiers ) === false ) return;
          }
          // 只执行一次
          if( once ){
            removeEventListener$1( element, type, listener, options );
          }
          // 修饰符全部检测通过, 执行用户传入方法
          isFunction( self.value ) && apply( self.value, this, arguments );
        },
        options
      );
    }

    /**
     * 初始化用户传入的修饰符
     * @param {{}} modifiers 用户传入的所有修饰符
     */
    init( modifiers ){
      /** 使用的事件可选参数 */
      const usingEventOptions = {};
      /** 使用的修饰符处理方法 */
      const usingModifiers = [];
      /** 使用的按键码修饰符 */
      const usingKeys = [];
      /** 所有修饰符的数组 */
      const modifierKeys = usingModifiers.keys = keys( modifiers );

      // 寻找相应的修饰符处理方法
      modifierKeys.forEach( name => {
        // 事件可选参数
        if( eventOptions[ name ] ) usingEventOptions[ name ] = true;
        // 功能性事件修饰符
        else if( eventModifiers[ name ] ){
          usingModifiers.push( eventModifiers[ name ] );

          // left / right
          if( keyNames[ name ] ){
            usingKeys.push( name );
          }
        }
        // 按键码修饰符
        else if( keyNames[ name ] ){
          usingKeys.push( name );
        }
      });

      // 处理按键码修饰符
      if( usingKeys.length ) usingModifiers.push(
        keysCheck( usingKeys)
      );

      const { once, capture, passive, native } = usingEventOptions;

      return {
        once,
        native,
        options: passive ? { passive, capture } : capture,
        modifiers: usingModifiers
      };
    }

  }


  /**
   * 事件可选参数
   */
  const eventOptions = {
    once: true,
    capture: true,
    passive: supportsPassive,
    native: true
  };

  /**
   * 功能性事件修饰符
   */
  const eventModifiers = {
    /**
     * 阻止事件冒泡
     */
    stop( elem, event ){
      event.stopPropagation();
    },

    /**
     * 阻止浏览器默认事件
     */
    prevent( elem, event ){
      event.preventDefault();
    },

    /**
     * 只在当前元素自身时触发事件时
     */
    self( elem, event ){
      return event.target === elem;
    },

    /**
     * 系统修饰键限定符
     */
    exact( elem, event, { keys } ){
      const modifierKey = [ 'ctrl', 'alt', 'shift', 'meta' ].filter( key => {
        return keys.indexOf( key ) < 0;
      });

      for( let key of modifierKey ){
        if( event[ key + 'Key' ] ) return false;
      }
      return true;
    }
  };


  /**
   * 功能性事件修饰符 - 鼠标按钮
   */
  [ 'left', 'middle', 'right' ].forEach(( button, index ) => {
    eventModifiers[ button ] = ( elem, event ) => {
      if( has( event, 'button' ) ){
        if( event.button !== index ) return false;
      }
    };
  });

  /**
   * 功能性事件修饰符 - 系统修饰键
   */
  [ 'ctrl', 'alt', 'shift', 'meta' ].forEach( key => {
    eventModifiers[ key ] = ( elem, event ) => {
      return !!event[ key + 'Key' ];
    };
  });

  /**
   * 按键码
   */
  const keyNames = {
    esc: 'Escape',
    tab: 'Tab',
    enter: 'Enter',
    space: ' ',
    up: 'Up',
    left: 'Left',
    right: 'Right',
    down: 'Down',
    delete: [ 'Backspace', 'Delete' ]
  };

  /**
   * 按键码处理
   * @param {string[]} keys 
   */
  function keysCheck( keys ){
    return ( elem, event ) => {
      if( !event.type.indexOf('key') ) for( let key of keys ){
        const value = keyNames[ key ];

        if( isArray( value ) ? value.indexOf( event.key ) === -1 : value !== event.key ){
          return false;
        }
      }
    };
  }

  class BasicBooleanDirective{

    constructor( element, name, strings, modifiers ){
      if( !isSingleBind( strings ) ){
        throw new Error('?attr 指令的传值只允许包含单个表达式 !');
      }

      this.elem = element;
      this.name = name;
    }

    commit( value, isDirectiveFn ){
      // 用户传递的是指令方法
      // 交给指令方法处理
      if( isDirectiveFn ) return value( this );
      // 两次传入的值不同
      if( isNotEqual( value, this.value ) ){
        // 存储当前值
        this.value = value;
        // 更新属性值
        if( value ){
          this.elem.setAttribute( this.name, '' );
        }else{
          this.elem.removeAttribute( this.name );
        }
      }
    }

  }

  class BasicPropertyDirective{

    constructor( element, name, strings, modifiers ){
      if( !isSingleBind( strings ) ){
        throw new Error('.prop 指令的传值只允许包含单个表达式 !');
      }

      this.elem = element;
      this.name = name;
    }

    commit( value, isDirectiveFn ){
      // 用户传递的是指令方法
      // 交给指令方法处理
      if( isDirectiveFn ) return value( this );
      // 两次传入的值不同
      if( isNotEqual( value, this.value ) ){
        // 存储当前值
        this.value = value;
        // 更新属性值
        this.elem[ this.name ] = value;
      }
    }

  }

  var templateProcessor = {

    attr( element, name, strings ){
      /** 修饰符对象 */
      const modifiers = create( null );
      /** 修饰符键集合 */
      let modifierKeys;
      /** 属性名称起始分隔位置 */
      let sliceNum = 0;
      /** 属性对应的处理指令 */
      let directive;
      /** 属性对应的处理指令实例 */
      let directiveInstance;
      /** 指令前缀 */
      const prefix = name[ 0 ];

      // 处理基础指令
      switch( prefix ){
        // 用于绑定 DOM 属性 ( property )
        case '.': directive = BasicPropertyDirective; sliceNum = 1; break;
        // 事件绑定
        case '@': directive = BasicEventDirective; sliceNum = 1; break;
        // 若属性值为 Truthy 则保留 DOM 属性
        // 否则移除 DOM 属性
        // - Truthy: https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy
        case '?': directive = BasicBooleanDirective; sliceNum = 1; break;
        // 功能指令
        case ':': {
          const [ attr, ...keys ] = name.slice(1).split('.');
          
          // 指令存在则使用截取出的名称及修饰符
          // 指令不存在则不做任何更改视为普通属性
          if( directive = userDirectives[ attr ] || directives[ attr ] ){
            name = attr;
            modifierKeys = keys;
          }
        }
      }

      // 属性名称可能是包含修饰符的, 所以需要对属性名称进行分隔
      if( !modifierKeys ){
        [ name, ...modifierKeys ] = name.slice( sliceNum ).split('.');
      }
      // 将数组格式的指令名称转为对象格式
      for( let modifier of modifierKeys ){
        modifiers[ modifier ] = true;
      }

      /** 实例化指令时的传值 */
      const args = [ element, name, strings, modifiers ];

      // 用户注册的指令无需传入名称
      if( directive && prefix === ':' ){
        args.splice( 1, 1 );
      }

      // 实例化指令
      directiveInstance = new ( directive || AttributeCommitter )( ...args );

      // 单个属性使用了多个插值绑定的情况下
      // 需要返回多个指令类
      return directiveInstance.parts || [
        directiveInstance
      ];
    }

  };

  /**
   * 指令方法合集
   */
  const directiveFns = new WeakMap();

  /**
   * 当前已经被指令激活的指令方法
   */
  const activeDirectiveFns = new WeakMap();

  var commitPart = /**
   * 给指令提交更改所用方法
   * @param {{}} part 需要提交更改的指令
   * @param {any} value 提交更改的值
   */
  ( part, value ) => {
    /**
     * 尝试从指令方法合集中获取传入值的信息
     * 如果获取到了
     * 那么提交的值就是指令方法
     */
    let options = directiveFns.get( value );
    /**
     * 尝试从已激活的指令方法合集中获取当前指令的相关信息
     * 如果可以获取到信息
     * 那么说明上次提交值时使用的也是指令方法
     */
    let activeOptions = activeDirectiveFns.get( part );

    // 如果上次提交的是指令方法, 那么需要进一步处理
    if( activeOptions ){
      // 1. 如果这次提交的值不是指令方法, 那么需要将上次的指令方法销毁
      // 2. 如果这次提交的值是指令方法, 但不是同一个指令方法, 那么需要将上次的指令方法销毁
      if( !options || options && options.id !== activeOptions.opts.id ){
        // 那么将上一次提交的指令方法进行销毁
        activeOptions.ins && activeOptions.ins.destroy && activeOptions.ins.destroy();
        // 删除缓存信息
        activeDirectiveFns.delete( part );
        activeOptions = void 0;
      }
      // 如果上次的指令方法和这次的指令方法相同, 那么将本次指令方法的参数进行转移
      // 继续使用上次的指令方法实例
      if( options && activeOptions ){
        activeOptions.args = options.args;
      }
    }

    // 如果上次提交的值缓存信息
    // 说明上次的不是指令方法或不是同一个指令方法
    // 那么需要存储相关信息
    // 相关指令注销时, 同时也要注销指令方法
    if( options && !activeOptions ){
      activeDirectiveFns.set( part, {
        opts: options,
        args: options.args
      });
    }

    // 提交更改
    part.commit( value, !!options );
  };

  var destroyPart = /**
   * 注销指令调用的方法
   * @param {{}} part 需要注销的指令
   */
  part => {
    /**
     * 尝试从已激活的指令方法合集中获取当前指令的相关信息
     * 如果可以获取到信息
     * 那么说明上次提交值时使用的是指令方法
     */
    const activeOptions = activeDirectiveFns.get( part );

    // 是指令方法, 需要将指令方法销毁
    if( activeOptions ){
      const instance = activeOptions.ins;

      // 那么将上一次提交的指令方法进行销毁
      instance && instance.destroy && instance.destroy();
      // 删除缓存信息
      activeDirectiveFns.delete( part );
    }

    // 将指令销毁
    part.destroy && part.destroy();
  };

  class TemplateInstance{

    constructor( template ){
      this.parts = [];
      this.template = template;
    }

    /**
     * 更新模板片段中插值绑定中的值
     */
    update( values ){
      let index = 0;

      this.parts.forEach( part => {
        if( part ){
          commitPart( part, values[ index ] );
        }
        index++;
      });
    }

    /**
     * 初始化模板片段
     */
    init(){
      const template = this.template;
      const templateParts = template.parts;
      const templatePartsLength = templateParts.length;
      const templateContent = template.element.content;
      const fragment = document.importNode( templateContent, true );
      const walker = document.createTreeWalker( fragment, 133, null, false );
      const templateStack = [];
      let partIndex = 0;
      let nodeIndex = 0;
      let node = walker.nextNode();

      // 遍历模板上的所有插值绑定
      while( partIndex < templatePartsLength ){
        /** 插值绑定参数 */
        let part = templateParts[ partIndex ];

        // 注释节点中的插值绑定将被忽略
        if( part.index === -1 ){
          this.parts.push( void 0 );
          partIndex++;
          continue;
        }

        // 如果插值绑定的目标节点 index 小于当前节点 index
        // 那么使用循环快速定位到目标节点
        while( nodeIndex < part.index ){
          nodeIndex++;

          // 当前解析的节点是 template 元素
          // 因为 TreeWalker 不会主动解析 template 元素的子节点
          // 所以将当前节点保存到堆栈, 然后手动将当前节点重定向至 template 的内容根节点, 开始解析 template 元素的子节点
          // 如果在当前 template 元素的子节点中又遇到了新的 template 元素, 那么重复上述两个操作
          // 如果 template 元素的子节点解析完成后, 会从堆栈中取出最后解析的 template 元素, 然后继续解析下面的内容
          if( node.nodeName === 'TEMPLATE' ){
            templateStack.push( node );
            walker.currentNode = node.content;
          }

          node = walker.nextNode();

          // 当前解析的节点是 template 元素的子节点
          // 如果 template 元素的子节点解析完成后, 会从堆栈中取出最后解析的 template 元素, 然后继续解析下面的内容
          if( node === null ){
            walker.currentNode = templateStack.pop();
            node = walker.nextNode();
          }
        }

        // 如果是文本区域的插值绑定
        // 创建 NodePart 对当前插值绑定进行管理
        if( part.type === 'node' ){
          const part = new NodePart();
                part.insertAfterNode( node.previousSibling );
          this.parts.push( part );
        }
        // 如果不是文本区域的插值绑定, 那么就是元素属性的插值绑定
        // 使用元素属性处理方法判断该如何处理当前插值绑定
        else{
          this.parts.push(
            ...templateProcessor.attr( node, part.name, part.strings )
          );
        }

        partIndex++;
      }

      if( isCEPolyfill ){
        document.adoptNode( fragment );
        customElements.upgrade( fragment );
      }

      return fragment;
    }

    /**
     * 
     * @param {boolean} onlyDirective 是否只注销指令
     */
    destroy( onlyDirective ){
      this.parts.forEach( part => {
        if( part ){
          if( onlyDirective && part instanceof NodePart ){
            part.destroyPart( onlyDirective );
          }else{
            destroyPart( part );
          }
        }
      });
    }

  }

  var moveChildNodes = ( container, start, end = null, before = null ) => {
    while( start !== end ){
      const node = start.nextSibling;

      container.insertBefore( start, before );
      start = node;
    }
  };

  class TemplateResult{

    constructor( strings, values, type ){
      this.strings = strings;
      this.values = values;
      this.type = type;
    }

    getHTML(){
      const strings = this.strings;
      const length = strings.length - 1;
      let html = '';
      let isCommentBinding;

      for( let index = 0; index < length; index++ ){
        /** 当前解析的片段 */
        const string = strings[ index ];
        /** 是否在当前解析的片段中查找到了新的文档注释开始标记 */
        const commentOpen = string.lastIndexOf('<!--');
        /** 是否在当前解析的片段中查找到了元素属性绑定 */
        const attributeMatch = lastAttributeNameRegex.exec( string );

        // 当前解析的片段是否正处在文档注释中
        // 1. commentOpen > -1 && string.indexOf( '-->', commentOpen + 1 ) === -1
        //    从当前解析的片段末尾开始查找到了文档注释开始标记,
        //    从这个位置开始, 若找到了文档注释结束标记, 那么就算文档注释结束了,
        //    当前解析的片段就不是文档注释中的绑定了
        // 2. isCommentBinding && string.indexOf( '-->', commentOpen + 1 ) === -1
        //    如果之前解析的片段没有查找到文档注释结束标记, 那么现在就是处于文档注释中
        //    如果这时候在当前解析的片段中查找到了文档注释结束标记, 那么就算文档注释结束了,
        //    当前解析的片段就不是文档注释中的绑定了
        // 3. ( commentOpen > -1 || isCommentBinding ) && string.indexOf( '-->', commentOpen + 1 ) === -1;
        //    如果之前解析的片段没有查找到文档注释结束标记, 又从当前解析的片段末尾开始又查找到了文档注释开始标记,
        //    相当于是这样的结构: html`<!-- ${ something } <!-- -->`,
        //    那么之前解析的片段中的注释开始标记, 就会和现在的片段中的文档注释结束标记结合成为一个完整的文档注释,
        //    那么依旧算文档注释结束了, 当前解析的片段就不是文档注释中的绑定了
        isCommentBinding = ( commentOpen > -1 || isCommentBinding ) && string.indexOf( '-->', commentOpen + 1 ) === -1;

        // 将文本绑定和元素属性绑定转为指定格式
        // 1. 普通内容绑定
        //    示　例: html`123${ something }456`
        //    转换后: `123<!--{{hu-666}}-->456`
        // 2. 注释中的内容绑定
        //    示　例: html`<!--${ something }-->`
        //    转换后: `<!-- {{hu-666}} -->`
        //    提　示: 注释中的内容绑定会在标记左右各加一个空格,
        // 　　       防止注释中的绑定在转换完后变成 `<!--{{hu-666}}-->`, 在最终解析的时候就会被解析成普通内容绑定
        // 3. 元素属性绑定
        //    示　例: html`<div class=${ something }></div>`
        //    转换后: `<div class$hu$={{hu-666}}></div>`
        // 3. 类似元素属性绑定的绑定
        //    示　例: html`<div> class=${ something } </div>`
        // 　　　     html`<!-- class=${ something } -->`
        //    转换后: `<div> class$hu$={{hu-666}} </div>`
        // 　　　     `<!-- class$hu$={{hu-666}} -->`
        //    提　示: 文本节点中的类元素属性绑定最终会被解析为普通内容绑定
        // 　　       注释节点中的类元素属性绑定最终不会被解析
        if( attributeMatch === null ){
          html += string + ( isCommentBinding ? commentMarker : nodeMarker );
        }else{
          html += string.substr( 0, attributeMatch.index )
                + attributeMatch[ 1 ]
                + attributeMatch[ 2 ]
                + boundAttributeSuffix
                + attributeMatch[ 3 ]
                + marker;
        }
      }

      return html + strings[ length ];
    }

    getTemplateElement(){
      const template = document.createElement('template');
            template.innerHTML = this.getHTML();

      return template;
    }

  }

  class SVGTemplateResult extends TemplateResult{

    getHTML(){
      return `<svg>${ super.getHTML() }</svg>`;
    }

    getTemplateElement(){
      const template = super.getTemplateElement();
      const content = template.content;
      const elem = content.firstChild;

      content.removeChild( elem );
      moveChildNodes( content, elem.firstChild );

      return template;
    }

  }

  /**
   * 文本区域的插值绑定节点管理对象
   */
  class NodePart{

    commit( value, isDirectiveFn ){
      let oldValue;

      // 用户传递的是指令方法
      // 交给指令方法处理
      if( isDirectiveFn ) return value( this );

      // 两次传入的值不同
      // 更新节点内容
      if( isNotEqual( value, oldValue = this.value ) ){
        // 传入的是原始类型
        if( isPrimitive( value ) ){
          commitText( this, value );
        }
        // 传入的是新的模板
        else if( value instanceof TemplateResult ){
          // console.log( value.strings, value.values )
          commitTemplateResult( this, value );
        }
        // 传入的是元素节点
        else if( value instanceof Node ){
          commitNode( this, value );
          // 存储新值
          this.value = value;
        }
        // 传入的是类数组对象
        else if( isIterable( value ) ){
          commitIterable( this, value, oldValue );
        }
        // 其它类型
        else{
          commitText( this, value );
        }
      }
    }

    /** 销毁当前插值绑定内的所有内容 */
    destroy(){
      this.clear();
    }
    /**
     * 销毁当前插值绑定内的所有指令及 NodePart
     * @param {boolean} onlyDirective 是否只注销指令
     */
    destroyPart( onlyDirective ){
      // 注销模板片段对象 ( 如果有 )
      if( this.instance ){
        this.instance.destroy( onlyDirective );
        this.instance = void 0;
      }
      // 注销数组类型的写入值
      else if( isArray( this.value ) ){
        for( let part of this.value ){
          if( part ){
            if( onlyDirective && part instanceof NodePart ) part.destroyPart( onlyDirective );
            else destroyPart( part );
          }
        }
      }
    }
    /**
     * 清空当前插值绑定内的所有内容
     * @param {Node} startNode 
     */
    clear( ...args ){
      const hasStartNode = args.length > 0;
      const startNode = hasStartNode ? args[0] : this.startNode;

      // 若未指定起始位置, 那么需要清除 parts 指令片段
      // 若指定了起始位置, 那么 parts 的回收必须手动完成
      if( !hasStartNode ){
        this.destroyPart();
      }

      // 清除节点
      removeNodes( this.startNode.parentNode, startNode.nextSibling, this.endNode );
    }

    /**
     * 将当前插值绑定节点添加开始结尾标记并且将开始结尾标记添加到父节点
     * @param {NodePart} part 
     */
    appendIntoPart( part ){
      part.insert( this.startNode = createMarker() );
      part.insert( this.endNode = createMarker() );
    }
    /**
     * 将当前插值绑定节点添加到另一个插值绑定节点后
     * @param {NodePart} part 
     */
    insertAfterPart( part ){
      part.insert( this.startNode = createMarker() );
      this.endNode = part.endNode;
      part.endNode = this.startNode;
    }
    /**
     * 将当前插值绑定节点添加到指定节点中
     * @param {Element} container 
     */
    appendInto( container ){
      this.startNode = container.appendChild( createMarker() );
      this.endNode = container.appendChild( createMarker() );
    }
    /**
     * 将当前插值绑定节点添加到指定节点后
     * @param {NodePart} part 
     */
    insertAfterNode( part ){
      this.startNode = part;
      this.endNode = part.nextSibling;
    }
    /**
     * 插入节点到当前插值绑定节点末尾
     * @param {Node} node 
     */
    insert( node ){
      const endNode = this.endNode;
      endNode.parentNode.insertBefore( node, endNode );
    }

  }

  /**
   * 向插值绑定的位置插入文本节点
   * @param {NodePart} nodePart 
   * @param {any} value 
   */
  function commitText( nodePart, value ){
    const node = nodePart.startNode.nextSibling;
    const valueAsString = toString$1( value );

    // 如果当前插值绑定内仅有一个节点并且是文本节点
    // 那么直接写入值到文本节点中
    if( node === nodePart.endNode.previousSibling && node.nodeType === 3 ){
      node.data = valueAsString;
    }
    // 否则需要将原插值绑定内的所有东西进行清除
    // 插入创建的文本节点
    else{
      commitNode(
        nodePart,
        document.createTextNode( valueAsString )
      );
    }

    // 存储新值
    nodePart.value = value;
  }

  /**
   * 向插值绑定的位置插入元素节点
   * @param {NodePart} nodePart 
   * @param {any} value 
   */
  function commitNode( nodePart, value ){
    // 清除原插值绑定中的内容
    nodePart.clear();
    // 插入元素节点到插值绑定中
    nodePart.insert( value );
  }

  /**
   * 向插值绑定的位置插入模板片段对象
   * @param {NodePart} nodePart 
   * @param {any} value 
   */
  function commitTemplateResult( nodePart, value ){
    const template = templateFactory( value );
    const instance = nodePart.instance;

    // 新模板和旧模板一致, 可以复用之前的模板
    if( instance instanceof TemplateInstance && instance.template === template ){
      instance.update( value.values );
    }
    // 新模板和旧模板不一致
    else{
      // 删除插值绑定之前的内容
      nodePart.clear();

      // 创建新的模板实例
      const newInstance = nodePart.instance = new TemplateInstance( template );
      // 初始化元素节点
      const fragment = newInstance.init();

      // 给模板片段写入值
      newInstance.update( value.values );
      // 插入元素节点到插值绑定中
      nodePart.insert( fragment );
      // 存储新值
      nodePart.value = value;
    }
  }

  /**
   * 向插值绑定的位置插入数组对象
   * @param {NodePart} nodePart 
   * @param {any} value 
   * @param {any} oldValue 
   */
  function commitIterable( nodePart, value, oldValue ){
    // 旧值不是数组类型, 需要清除原插值绑定中的内容
    if( !isArray( oldValue ) ){
      oldValue = [];
      nodePart.clear();
    }

    const parts = oldValue;
    let partIndex = 0;
    let part;

    // 遍历数组内容
    // 数组的每个元素都使用一个新的 NodePart 管理起来
    for( let item of value ){
      // 获取到旧的 NodePart
      part = parts[ partIndex ];

      // 旧的当前元素位置没有创建 NodePart
      if( part === void 0 ){
        // 创建新的 NodePart 管理当前元素
        parts.push(
          part = new NodePart()
        );

        // 将新创建的 NodePart 添加到父级去
        if( partIndex === 0 ){
          part.appendIntoPart( nodePart );
        }else{
          part.insertAfterPart( parts[ partIndex - 1 ] );
        }
      }

      // 给 NodePart 设置值
      commitPart( part, item );
      partIndex++;
    }

    // 如果旧数组的的组件数量大于当前数组的组件数量
    if( partIndex < parts.length ){
      // 弃用旧数组多余出来的部分
      while( partIndex < parts.length ){
        const part = parts.splice( partIndex, 1 )[0];
        part.destroy && part.destroy();
      }
      // 弃用无用节点
      nodePart.clear( part && part.endNode );
    }

    nodePart.value = parts;
  }

  function basicRender( result, container ){
    // 尝试获取上次创建的节点对象
    let part = renderParts.get( container );

    // 首次在该目标对象下进行渲染, 对节点对象进行创建
    if( !part ){
      // 移除需要渲染的目标对象下的所有内容
      removeNodes( container, container.firstChild );

      // 创建节点对象
      renderParts.set(
        container,
        part = new NodePart()
      );
      // 将节点对象添加至目标元素
      part.appendInto( container );
    }

    commitPart( part, result );
  }


  /**
   * 对外渲染方法
   */
  function render( result, container ){
    renderStack.push( container );
    basicRender( result, container );
    renderStack.pop();
  }

  /**
   * 注册指令方法
   */
  function directiveFn( directive ){
    /** 当前指令方法的 ID */
    const id = uid$1();

    // 注册指令方法后
    // 返回方法等待用户调用并传参
    return ( ...args ) => {
      // 用户调用并传参后
      // 返回方法等待渲染时被调用
      function directiveFn( part ){
        const options = activeDirectiveFns.get( part );
        const instance = options.ins || (
          options.ins = new directive( part )
        );

        instance.commit( ...options.args );
      }

      // 将指令方法相关的信息存储起来
      directiveFns.set( directiveFn, {
        id,
        args
      });

      // 返回方法
      // 等待下一步调用
      return directiveFn;
    };
  }

  /**
   * lit-html
   * directives/repeat
   * Licensed under the MIT License
   * http://polymer.github.io/LICENSE.txt
   *
   * modified by Wei Zhang (@Zhang-Wei-666)
   */


  var repeat = directiveFn(

    class repeat{
      constructor( part ){
        if( !( part instanceof NodePart ) ){
          throw new Error('Hu.html.repeat 指令方法只能在文本区域中使用 !');
        }

        this.part = part;
      }
      commit( items, key, template ){
        const containerPart = this.part;
        const oldParts = this.parts || [];
        const oldKeys = this.keys || [];

        const newKeys = [];
        const newValues = [];
        const newParts = [];

        const keyFn = isFunction( key ) ? key
                                        : item => item[ key ];

        for( let index = 0, item; index < items.length; index++ ){
          item = items[ index ];
    
          newKeys[ index ] = keyFn( item, index, items );
          newValues[ index ] = template( item, index, items );
        }

        let newKeyToIndexMap;
        let oldKeyToIndexMap;
    
        let oldHead = 0;
        let oldTail = oldParts.length - 1;
        let newHead = 0;
        let newTail = newValues.length - 1;

        while( oldHead <= oldTail && newHead <= newTail ){
          if( oldParts[ oldHead ] === null ){
            oldHead++;
          }
          else if( oldParts[ oldTail ] === null ){
            oldTail--;
          }
          else if( oldKeys[ oldHead ] === newKeys[ newHead ] ){
            newParts[ newHead ] = updatePart( oldParts[ oldHead ], newValues[ newHead ] );
            oldHead++;
            newHead++;
          }
          else if( oldKeys[ oldTail ] === newKeys[ newTail ] ){
            newParts[ newTail ] = updatePart( oldParts[ oldTail ], newValues[ newTail ] );
            oldTail--;
            newTail--;
          }
          else if( oldKeys[ oldHead ] === newKeys[ newTail ] ){
            newParts[ newTail ] = updatePart( oldParts[ oldHead ], newValues[ newTail ] );
            insertPartBefore( containerPart, oldParts[ oldHead ], newParts[ newTail + 1 ] );
            oldHead++;
            newTail--;
          }
          else if( oldKeys[ oldTail ] === newKeys[ newHead ] ){
            newParts[ newHead ] = updatePart( oldParts[ oldTail ], newValues[ newHead ] );
            oldTail--;
            newHead++;
          }
          else{
            if( newKeyToIndexMap === void 0 ){
              newKeyToIndexMap = generateMap( newKeys, newHead, newTail );
              oldKeyToIndexMap = generateMap( oldKeys, oldHead, oldTail );
            }
            if( newKeyToIndexMap.has( oldKeys[ oldHead ] ) ){
              removePart( oldParts[ oldHead ] );
              oldHead++;
            }
            else if( !newKeyToIndexMap.has( oldKeys[oldTail] ) ){
              removePart( oldParts[ oldTail ] );
              oldTail--;
            }
            else{
              const oldIndex = oldKeyToIndexMap.get( newKeys[ newHead ] );
              const oldPart = oldIndex !== void 0 ? oldParts[ oldIndex ] : null;
    
              if( oldPart === null ){
                const newPart = createAndInsertPart( containerPart, oldParts[ oldHead ] );
    
                updatePart( newPart, newValues[ newHead ] );
                newParts[ newHead ] = newPart;
              }else{
                newParts[ newHead ] = updatePart( oldPart, newValues[ newHead ] );
                insertPartBefore( containerPart, oldPart, oldParts[ oldHead ] );
                oldParts[oldIndex] = null;
              }
    
              newHead++;
            }
          }
        }
    
        while( newHead <= newTail ){
          const newPart = createAndInsertPart( containerPart, newParts[ newTail + 1 ] );
          updatePart( newPart, newValues[ newHead ] );
          newParts[ newHead++ ] = newPart;
        }
    
        while( oldHead <= oldTail ){
          const oldPart = oldParts[ oldHead++ ];
          
          if ( oldPart !== null ){
            removePart( oldPart );
          }
        }

        this.parts = newParts;
        this.keys = newKeys;
      }
      destroy(){
        this.parts && this.parts.forEach( part => {
          return destroyPart( part );
        });
      }
    }

  );


  function updatePart( part, value ){
    commitPart( part, value );
    return part;
  }

  function insertPartBefore( containerPart, part, ref ){
    const container = containerPart.startNode.parentNode;
    const beforeNode = ref ? ref.startNode : containerPart.endNode;
    const endNode = part.endNode.nextSibling;

    if( endNode !== beforeNode ){
      moveChildNodes( container, part.startNode, endNode, beforeNode );
    }
  }

  function generateMap( list, start, end ){
    const map = new Map();
    for( let i = start; i <= end; i++ ){
      map.set( list[i], i );
    }
    return map;
  }

  function removePart( part ){
    removeNodes( part.startNode.parentNode, part.startNode, part.endNode.nextSibling );
  }

  function createAndInsertPart( containerPart, beforePart ){
    const container = containerPart.startNode.parentNode;
    const beforeNode = beforePart === void 0 ? containerPart.endNode : beforePart.startNode;
    const startNode = container.insertBefore( createMarker(), beforeNode );
    container.insertBefore( createMarker(), beforeNode );
    const newPart = new NodePart();
    newPart.insertAfterNode( startNode );
    return newPart;
  }

  var unsafeHTML = directiveFn(

    class unsafeHTML{
      constructor( part ){
        if( !( part instanceof NodePart ) ){
          throw new Error('Hu.html.unsafe 指令方法只能在文本区域中使用 !');
        }

        this.part = part;
      }
      commit( value ){
        // 这次设置的值和上次是一样的
        if( value === this.value ){
          return;
        }

        this.value = value;

        const template = document.createElement('template');
              template.innerHTML = value;

        const fragment = document.importNode( template.content, true );

        // 设置节点内容
        this.part.commit( fragment );
      }
    }

  );

  var bind = directiveFn(

    class bind{
      constructor( part ){
        this.part = part;
      }
      commit( proxy, name ){
        // 并非首次绑定且绑定的对象和上次不一样了
        // 那么对上次的绑定解绑
        if( this.unWatch && ( this.proxy !== proxy || this.name !== name ) ){
          this.unWatch();
        }

        this.proxy = proxy;
        this.name = name;
        this.unWatch = $watch(
          () => proxy[ name ],
          ( value ) => this.part.commit( value ),
          {
            immediate: true,
            deep: true
          }
        );
      }
      destroy(){
        this.unWatch();
      }
    }

  );

  function html( strings, ...values ){
    return new TemplateResult( strings, values, 'html' );
  }

  function svg( strings, ...values ){
    return new SVGTemplateResult( strings, values, 'svg' );
  }

  assign( html, {
    unsafe: unsafeHTML,
    repeat,
    bind,
    svg
  });

  var getRefs = root => {
    const refs = {};
    const elems = root.querySelectorAll('[ref]');

    if( elems.length ){
      slice.call( elems ).forEach( elem => {
        const name = elem.getAttribute('ref');
        refs[ name ] = refs[ name ] ? [].concat( refs[ name ], elem )
                                    : elem;
      });
    }

    return freeze( refs );
  };

  /**
   * 已经初始化过样式表的组件名称
   */
  const styleRendered = new Set();

  var prepareTemplateStyles = ( style, name ) => {
    // 已经初始化过样式表的组件不再第二次初始化
    if( styleRendered.has( name ) ){
      return;
    }

    styleRendered.add( name );

    const root = document.createElement('div');
    const content = document.createElement('div');

    root.content = content;
    content.appendChild( style );

    window.ShadyCSS.ScopingShim.prepareTemplateStyles( root, name );
  };

  /** 迫使 Hu 实例重新渲染 */
  var initForceUpdate = ( name, target, targetProxy ) => {
    /** 当前实例实例选项 */
    const options = optionsMap[ name ];
    /** 当前实例的渲染方法 */
    const userRender = options.render;
    /** 当前实例的样式 */
    const userStyles = options.styles && options.styles.cloneNode( true );
    /** 是否已经渲染过当前实例的样式 */
    let canRenderedStyles = !!userStyles;

    /** 当前实例渲染方法的 Watcher */
    const renderWatcher = new Watcher(() => {
      const el = target.$el;

      if( el ){
        // 执行用户渲染方法
        if( userRender ){
          render( userRender.call( targetProxy, html ), el );
        }
        // 添加自定义元素样式
        if( canRenderedStyles ){
          canRenderedStyles = false;

          if( hasShadyCss ) prepareTemplateStyles( userStyles, name );
          else el.appendChild( userStyles );
        }
        // 获取 refs 引用信息
        target.$refs = getRefs( el );
      }
    });

    // 缓存当前实例渲染方法的 Watcher
    renderWatcherCache.set( targetProxy, renderWatcher );
    // 返回收集依赖方法
    target.$forceUpdate = renderWatcher.get;
  };

  /**
   * 在下次 DOM 更新循环结束之后执行回调
   */
  function $nextTick( callback ){
    return nextTick( callback, this );
  }

  var callLifecycle = (
    targetProxy,
    lifecycle,
    options = optionsMap[ targetProxy.$info.name ],
    args = []
  ) => {
    const fns = options[ lifecycle ];

    if( fns ){
      for( let fn of fns ) apply( fn, targetProxy, args );
    }

    targetProxy.$emit( 'hook:' + lifecycle, ...args );
  };

  /**
   * 挂载实例
   * - 只在使用 new 创建的实例中可用
   */
  function $mount( selectors ){
    const $info = this.$info;
    const { isMounted, isCustomElement } = $info;

    // 是使用 new 创建的实例
    // 且实例未挂载
    if( !isCustomElement && !isMounted ){
      /** 当前实例挂载目标对象 */
      const el = selectors && (
        isString( selectors ) ? document.querySelector( selectors )
                              : selectors
      );
      
      // 不允许挂载到 body 和 html 下
      if( !el || el === document.body || el === document.documentElement ){
        return this;
      }else{
        // 将挂载对象保存到实例
        observeProxyMap.get( this ).target.$el = el;
        // 标识 $el 选项与实例的引用
        activeHu.set( el, this );
      }

      /** 当前实例的实例配置 */
      const options = optionsMap[ $info.name ];
      /** 当前实例 $info 原始对象 */
      const infoTarget = observeProxyMap.get( $info ).target;

      // 运行 beforeMount 生命周期方法
      callLifecycle( this, 'beforeMount', options );

      // 执行 render 方法, 进行渲染
      this.$forceUpdate();

      // 标记首次实例挂载已完成
      infoTarget.isMounted = infoTarget.isConnected = true;

      // 运行 mounted 生命周期方法
      callLifecycle( this, 'mounted', options );
    }

    return this;
  }

  const eventMap = new WeakMap();
  const onceMap = new WeakMap();

  function initEvents( targetProxy ){
    const events = create( null );
    eventMap.set( targetProxy, events );
  }


  function $on( type, fn ){
    if( isArray( type ) ){
      for( let event of type ) this.$on( event, fn );
    }else{
      const events = eventMap.get( this );
      const fns = events[ type ] || (
        events[ type ] = []
      );

      fns.push( fn );
    }
  }
  const $once = function( type, fn ){
    function once(){
      this.$off( type, once );
      apply( fn, this, arguments );
    }
    onceMap.set( once, fn );
    this.$on( type, once );
  };

  const $off = function( type, fn ){
    // 解绑所有事件
    if( !arguments.length ){
      return initEvents( this ), this;
    }
    // 解绑绑定了同一方法的多个事件
    if( isArray( type ) ){
      for( let _type of type ) this.$off( _type, fn );
      return this;
    }

    const events = eventMap.get( this );
    const fns = events[ type ];

    // 没有绑定的事件
    if( !fns || !fns.length ){
      return this;
    }

    // 解绑该事件名下的所有事件
    if( !fn ){
      fns.length = 0;
      return this;
    }

    let index = fns.length;
    while( index-- ){
      let cb = fns[ index ];

      if( cb === fn || onceMap.get( cb ) === fn ){
        fns.splice( index, 1 );
        break;
      }
    }

    return this;
  };

  const $emit = function( type ){
    const events = eventMap.get( this );
    const fns = events[ type ];

    if( fns && fns.length ){
      const cbs = fns.length > 1 ? slice.call( fns ) : fns;
      const [ , ...args ] = arguments;

      for( let cb of cbs ){
        apply( cb, this, args );
      }
    }

    return this;
  };

  var isEmptyObject = /**
   * 判断传入对象是否是一个空对象
   * @param {any} value 需要判断的对象
   */
  value => {
    for( let item in value ) return false;
    return true;
  };

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

  var injectionPrivateToInstance = /**
   * 在实例和自定义元素上建立内部对象的引用
   */
  ( isCustomElement, target, root, data ) => each( data, ( key, value ) => {

    // 实例上直接写入就好
    // 常规操作有观察者对象进行拦截
    target[ key ] = value;

    // 自定义元素上需要通过 defineProperty 进行转发
    if( isCustomElement ){
      defineProperty( root, key, {
        value
      });
    }

  });

  var isPrivate = /**
   * 判断字符串首字母是否为 _
   * @param {String} value
   */
  cached( value => {
    const charCode = ( value + '' ).charCodeAt(0);
    return charCode === 0x5F;
  });

  var injectionToInstance = /**
   * 在实例和自定义元素上建立对象的引用
   */
  ( isCustomElement, target, root, key, attributes ) => {

    /** 对象名称是否是字符串 */
    let keyIsString = isString( key );

    // 对象名称首字母如果为 $ 那么则不允许添加到实例中去
    if( keyIsString && isReserved( key ) ){
      return;
    }
    // 实例中有同名变量, 则删除
    has( target, key ) && delete target[ key ];
    // 在实例中对变量添加映射
    defineProperty$1( target, key, attributes );

    // 在自定义元素上建立对象的引用
    if( isCustomElement ){
      // 对象名称首字母如果为 _ 那么则不允许添加到自定义元素中去
      if( keyIsString && isPrivate( key ) ){
        return;
      }
      // 自定义元素中有同名变量, 则删除
      has( root, key ) && delete root[ key ];
      // 在自定义元素中对变量添加映射
      defineProperty$1( root, key, attributes );
    }
  };

  /**
   * 存放每个实例的 computed 相关数据
   */
  const computedMap = new WeakMap();
  /**
   * 空计算属性
   */
  let emptyComputed;


  function initComputed$1( isCustomElement, target, root, options, targetProxy ){

    const computed = options.computed;

    // 如果定义当前实例时未定义 computed 属性
    // 则当前实例的 $computed 就是个普通的观察者对象
    if( isEmptyObject( computed ) ){
      return injectionPrivateToInstance( isCustomElement, target, root, {
        $computed: emptyComputed || (
          emptyComputed = observe({}, observeReadonly)
        )
      });
    }

    const computedOptions = createComputed( targetProxy );
    const [ ,, appendComputed,, computedTargetProxyInterceptor ] = computedOptions;

    // 存储当前实例 computed 相关数据
    computedMap.set( targetProxy, computedOptions );

    // 将拦截器伪造成观察者对象
    observeProxyMap.set( computedTargetProxyInterceptor, {} );


    each( computed, ( name, computed ) => {
      appendComputed( name, computed );
      injectionToInstance( isCustomElement, target, root, name, {
        get: () => computedTargetProxyInterceptor[ name ],
        set: value => computedTargetProxyInterceptor[ name ] = value
      });
    });

    injectionPrivateToInstance( isCustomElement, target, root, {
      $computed: computedTargetProxyInterceptor
    });
  }

  /**
   * 清空 render 方法收集到的依赖
   */
  var removeRenderDeps = targetProxy => {
    const watcher = renderWatcherCache.get( targetProxy );

    if( watcher ){
      watcher.clean();
    }
  };

  var destroyRender = /**
   * 注销某个已渲染的节点
   * @param {Element} container 已渲染的根节点
   * @param {Boolean} onlyDirective 是否只注销指令
   */
  ( container, onlyDirective ) => {
    /** 获取在传入节点渲染时使用的 NodePart */
    const nodePart = renderParts.get( container );

    if( nodePart ){
      if( onlyDirective ){
        nodePart.destroyPart( onlyDirective );
      }else{
        nodePart.destroy();
      }
      renderParts.delete( container );
    }
  };

  function $destroy(){

    callLifecycle( this, 'beforeDestroy' );

    // 注销实例所有计算属性和 watch 数据
    removeComputed( computedMap, this );
    removeComputed( watcherMap, this );

    // 注销 render 时创建的指令及指令方法
    destroyRender( this.$el, true );

    // 清空 render 方法收集到的依赖
    removeRenderDeps( this );

    callLifecycle( this, 'destroyed' );

    // 删除所有自定义事件绑定
    this.$off();

  }

  function removeComputed( optionsMap, self ){
    const options = optionsMap.get( self );

    if( options ){
      const [ optionsMap, remove ] = options;

      optionsMap.forEach(( value, name ) => {
        return remove( name );
      });
    }
  }

  class HuConstructor{
    constructor( name, isCustomElement ){
      /** 当前实例观察者对象 */
      const targetProxy = observe( this, observeHu );

      // 初始化 $forceUpdate 方法
      initForceUpdate( name, this, targetProxy );
      // 初始化事件相关
      initEvents( targetProxy );
    }
  }

  assign( HuConstructor.prototype, {
    $watch,
    $mount,
    $nextTick,
    $on,
    $once,
    $off,
    $emit,
    $destroy
  });

  /**
   * 初始化当前组件 props 属性
   * @param {boolean} isCustomElement 是否是初始化自定义元素
   * @param {HTMLElement} root 
   * @param {{}} options 
   * @param {{}} target 
   * @param {{}} targetProxy 
   */
  function initProps$1( isCustomElement, target, root, props, targetProxy ){

    const propsTarget = create( null );
    const propsTargetProxy = observe( propsTarget );

    // 尝试从标签上获取 props 属性, 否则取默认值
    each( props, ( name, options ) => {
      let value = null;

      if( isCustomElement && options.attr ){
        value = root.getAttribute( options.attr );
      }

      // 定义了该属性
      if( value !== null ){
        propsTarget[ name ] = ( options.from || returnArg )( value );
      }
      // 使用默认值
      else{
        propsTarget[ name ] = isFunction( options.default )
                                ? options.default.call( targetProxy )
                                : options.default;
      }
    });


    each( props, ( name, options ) => {
      injectionToInstance( isCustomElement, target, root, name, {
        get: () => propsTargetProxy[ name ],
        set: value => propsTargetProxy[ name ] = value
      });
    });

    injectionPrivateToInstance( isCustomElement, target, root, {
      $props: propsTargetProxy
    });

  }

  /**
   * 初始化当前组件 methods 属性
   * @param {{}} options 
   * @param {{}} target 
   * @param {{}} targetProxy 
   */
  function initMethods$1( isCustomElement, target, root, methods, targetProxy ){
    /**
     * $methods 实例属性
     *  - 非响应式
     *  - 会在实例上添加方法的副本 ( 单独修改删除时, 另一个不受影响 )
     */
    const methodsTarget = create( null );


    each( methods, ( name, value ) => {
      const method = methodsTarget[ name ] = value.bind( targetProxy );

      injectionToInstance( isCustomElement, target, root, name, {
        writable: true,
        value: method
      });
    });

    injectionPrivateToInstance( isCustomElement, target, root, {
      $methods: methodsTarget
    });
  }

  /**
   * 初始化当前组件 data 属性
   * @param {{}} options
   * @param {{}} target
   * @param {{}} targetProxy
   */
  function initData$1( isCustomElement, target, root, options, targetProxy ){

    const dataList = options.dataList;
    let dataTarget;

    if( dataList && dataList.length ){
      for( let data of dataList ){
        if( isFunction( data ) ) data = data.call( targetProxy );
        if( !dataTarget ) dataTarget = data;

        each( data, ( name, value ) => {
          has( dataTarget, name ) || ( dataTarget[ name ] = value );
        });
      }
    }else{
      dataTarget = create( null );
    }


    const dataTargetProxy = observe( dataTarget );

    each( dataTarget, name => {
      injectionToInstance( isCustomElement, target, root, name, {
        get: () => dataTargetProxy[ name ],
        set: value => dataTargetProxy[ name ] = value
      });
    });

    injectionPrivateToInstance( isCustomElement, target, root, {
      $data: dataTargetProxy
    });

  }

  function initWatch$1( options, target, targetProxy ){
    // 添加监听方法
    each( options.watch, function createWatcher( expOrFn, options ){
      if( isArray( options ) ){
        for( let handler of options ){
          createWatcher( expOrFn, handler );
        }
      }else if( isPlainObject( options ) || isFunction( options ) ){
        targetProxy.$watch( expOrFn, options );
      }else if( isString( options ) ){
        targetProxy.$watch( expOrFn, function(){
          return apply( this[ options ], this, arguments );
        });
      }
    });
  }

  function initOptions$1( isCustomElement, target, root, name, userOptions ){

    /**
     * 实例的 UID
     *  - 可以保证每个实例的 UID 始终是唯一的
     */
    const uid = isCustomElement ? name + '-' + uid$1()
                                : name;

    // Hu 的初始化选项
    const $options = observe( userOptions, observeReadonly );
    // Hu 实例信息选项
    const $info = observe(
      {
        uid,
        name,
        isMounted: false,
        isCustomElement,
        isConnected: false
      },
      observeReadonly
    );

    injectionPrivateToInstance( isCustomElement, target, root, {
      $options,
      $info
    });
  }

  var initParent = ( isCustomElement, target, root, targetProxy ) => {
    let $root = targetProxy;
    let $parent;

    if( isCustomElement ){
      const length = renderStack.length;

      for( let index = length - 1; index >= 0; index-- ){
        const el = renderStack[ index ];
        const parentTargetProxy = activeHu.get( el ); 

        if( parentTargetProxy ){
          $parent = parentTargetProxy;
          $root = $parent.$root;
          $parent.$children.push( targetProxy );
          break;
        }
      }
    }

    injectionPrivateToInstance( isCustomElement, target, root, {
      $root,
      $parent,
      $children: []
    });
  };

  var moveHuPrototypeToCE = ( root, target, targetProxy ) => {
    const keys = {
      // $on: $on,
      // $off: $off,
      // addEventListener: $on,
      // removeEventListener: $off,
    };

    ownKeys( Hu.prototype ).filter( isReserved ).forEach( name => {
      keys[ name ] = name;
    });

    // 自定义元素实例上的事件处理相关方法
    keys.addEventListener = '$on';
    keys.removeEventListener = '$off';

    each( keys, ( to, from ) => {
      defineProperty( root, to, {
        value: target[ from ].bind( targetProxy )
      });
    });
  };

  /**
   * 初始化当前组件属性
   * @param {boolean} isCustomElement 是否是初始化自定义元素
   * @param {HTMLElement} root 自定义元素组件节点
   * @param {string} name 组件名称
   * @param {{}} options 组件配置
   * @param {{}} userOptions 用户组件配置
   */
  function init( isCustomElement, root, name, options, userOptions ){

    /** 当前实例对象 */
    const target = new HuConstructor( name, isCustomElement );
    /** 当前实例观察者对象 */
    const targetProxy = observeMap.get( target ).proxy;

    // 使用自定义元素创建的实例
    if( isCustomElement ){
      target.$el = root.attachShadow({ mode: 'open' });
      target.$customElement = root;

      // 标识当前自定义元素实例已激活, 保存自定义元素和实例的引用
      activeCustomElement.set( root, targetProxy );
      // 标识 $el 选项与实例的引用
      activeHu.set( target.$el, targetProxy );
      // 将实例方法添加到自定义元素上
      moveHuPrototypeToCE( root, target, targetProxy );
    }

    initParent( isCustomElement, target, root, targetProxy );
    initOptions$1( isCustomElement, target, root, name, userOptions );
    initProps$1( isCustomElement, target, root, options.props, targetProxy );
    initMethods$1( isCustomElement, target, root, options.methods, targetProxy );
    initData$1( isCustomElement, target, root, options, targetProxy );

    // 运行 beforeCreate 生命周期方法
    callLifecycle( targetProxy, 'beforeCreate', options );

    initComputed$1( isCustomElement, target, root, options, targetProxy );
    initWatch$1( options, target, targetProxy );

    // 运行 created 生命周期方法
    callLifecycle( targetProxy, 'created', options );

    // 使用 new 创建的实例可以在创建完成后立即进行挂载
    // 使用自定义元素创建的实例会在首次添加到文档流后进行挂载
    if( !isCustomElement && options.el ){
      targetProxy.$mount( options.el );
    }

    return targetProxy;
  }

  const Hu$1 = new Proxy( HuConstructor, {
    construct( HuConstructor, [ _userOptions ] ){
      const name = 'anonymous-' + uid$1();
      const [ userOptions, options ] = initOptions( false, name, _userOptions );
      const targetProxy = init( false, void 0, name, options, userOptions );

      return targetProxy;
    }
  });

  Hu$1.version = '1.0.0-bata.16';

  var initAttributeChangedCallback = propsMap => function( name, oldValue, value ){
    if( value === oldValue ) return;

    const { $props: propsTargetProxy } = activeCustomElement.get( this );
    const { target: propsTarget } = observeProxyMap.get( propsTargetProxy );
    const props = propsMap[ name ];

    for( let { name, from } of props ){
      const fromValue = from( value );

      isEqual( propsTarget[ name ], fromValue ) || (
        propsTargetProxy[ name ] = fromValue
      );
    }
  };

  var initDisconnectedCallback = options => function(){
    const $hu = activeCustomElement.get( this );
    const infoTarget = observeProxyMap.get( $hu.$info ).target;

    infoTarget.isConnected = false;

    destroyRender( $hu.$el );
    removeRenderDeps( $hu );

    callLifecycle( $hu, 'disconnected', options );
  };

  var initAdoptedCallback = options => function( oldDocument, newDocument ){
    callLifecycle( activeCustomElement.get( this ), 'adopted', options, [
      newDocument, oldDocument
    ]);
  };

  var initConnectedCallback = options => function(){
    const $hu = activeCustomElement.get( this );
    const $info = $hu.$info;
    const isMounted = $info.isMounted;
    const infoTarget = observeProxyMap.get( $info ).target;

    infoTarget.isConnected = true;

    // 是首次挂载
    if( !isMounted ){
      // 运行 beforeMount 生命周期方法
      callLifecycle( $hu, 'beforeMount', options );
    }

    // 执行 render 方法, 进行渲染
    $hu.$forceUpdate();

    // 如果是首次挂载, 需要运行 mounted 生命周期方法
    if( !isMounted ){
      // 标记首次实例挂载已完成
      infoTarget.isMounted = true;

      // 运行 mounted 生命周期方法
      callLifecycle( $hu, 'mounted', options );
    }

    callLifecycle( $hu, 'connected', options );
  };

  /**
   * 定义自定义元素
   * @param {string} name 标签名
   * @param {{}} _userOptions 组件配置
   */
  function define( name, _userOptions ){

    const [ userOptions, options ] = initOptions( true, name, _userOptions );

    class HuElement extends HTMLElement{
      constructor(){
        super();

        this.$hu = init( true, this, name, options, userOptions );
      }
    }

    // 定义需要监听的属性
    HuElement.observedAttributes = keys( options.propsMap );

    assign( HuElement.prototype, {
      // 自定义元素被添加到文档流
      connectedCallback: initConnectedCallback( options ),
      // 自定义元素被从文档流移除
      disconnectedCallback: initDisconnectedCallback( options ),
      // 自定义元素位置被移动
      adoptedCallback: initAdoptedCallback( options ),
      // 自定义元素属性被更改
      attributeChangedCallback: initAttributeChangedCallback( options.propsMap )
    });

    // 注册组件
    customElements.define( name, HuElement );
    // 标记组件已注册
    definedCustomElement.add( name );
  }

  function staticRender( result, container ){
    if( arguments.length > 1 ){
      return render( result, container );
    }

    container = result;

    return function(){
      const result = apply( html, null, arguments );
      return render( result, container );
    }
  }

  var util = create$1({
    /** 绑定事件 */
    addEvent: addEventListener$1,
    /** 移除事件 */
    removeEvent: removeEventListener$1,
    /** 对象遍历方法 */
    each,
    /** 创建一个干净的目标对象, 并把传入方法的对象全部浅拷贝到目标对象并返回目标对象 */
    create: create$1,
    /** 将值转为字符串形式 */
    toString: toString$1,
    /** 判断传入对象是否是纯粹的对象 */
    isPlainObject,
    /** 判断传入对象是否是一个空对象 */
    isEmptyObject,
    /** 判断传入对象是否是原始对象 */
    isPrimitive,
    /** 判断传入对象是否可迭代 */
    isIterable,
    /** 判断传入的两个值是否相等 */
    isEqual,
    /** 判断传入的两个值是否不相等 */
    isNotEqual,
    /** 判断传入对象是否是 String 类型 */
    isString,
    /** 判断传入对象是否是 Object 类型且不为 null */
    isObject,
    /** 判断传入对象是否是 Function 类型 */
    isFunction,
    /** 判断传入对象是否是 Symbol 类型 */
    isSymbol,
    /** 返回一个字符串 UID */
    uid: uid$1
  });

  function directive( name, directive ){
    
    // 获取已注册的指令
    if( !directive ){
      return userDirectives[ name ] || directives[ name ];
    }

    // 注册指令
    userDirectives[ name ] = directive;

  }

  // 指令提交更改方法
  directive.commit = commitPart;
  // 指令注销方法
  directive.destroy = destroyPart;

  const installed = new Set;
  const privateOptions = create$1({

    // 基础指令
    directiveBasic: {
      Node: NodePart,
      Attr: AttributeCommitter,
      AttrPart: AttributePart,
      Boolean: BasicBooleanDirective,
      Event: BasicEventDirective,
      Prop: BasicPropertyDirective
    },

    // 内置功能指令
    directive: create$1({
      Class: ClassDirective,
      Html: HtmlDirective,
      Model: ModelDirective,
      Show: ShowDirective,
      Style: StyleDirective,
      Text: TextDirective,
    })

  });

  function use( plugin, ...args ){
    if( installed.has( plugin ) ){
      return Hu$1;
    }

    args.unshift( Hu$1, privateOptions );

    if( isFunction( plugin.install ) ){
      apply( plugin.install, plugin, args );
    }
    else if( isFunction( plugin ) ){
      apply( plugin, null, args );
    }

    installed.add( plugin );

    return Hu$1;
  }

  assign( Hu$1, {
    define,
    render: staticRender,
    html,
    nextTick,
    observable,
    util,
    directive,
    directiveFn,
    use
  });

  return Hu$1;

}));
