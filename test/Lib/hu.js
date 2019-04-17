/*!
 * Hu.js v1.0.0-bata.3
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

  var isEqual = /**
   * 判断传入的两个值是否相等
   * @param {any} value 需要判断的对象
   * @param {any} value2 需要判断的对象
   */
  ( value, value2 ) => {
    return !( value2 !== value && ( value2 === value2 || value === value ) );
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
    hasOwnProperty
  } = prototype;

  var isPlainObject = /**
   * 判断传入对象是否是纯粹的对象
   * @param {any} value 需要判断的对象
   */
  value => Object.prototype.toString.call( value ) === '[object Object]';

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

  var isSymbol = /**
   * 判断传入对象是否是 Symbol 类型
   * @param {any} value 需要判断的对象
   */
  value => typeof value === 'symbol';

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

  var isSymbolOrNotReserved = /**
   * 判断传入名称是否是 Symbol 类型或是首字母不为 $ 的字符串
   * @param { string | symbol } name 需要判断的名称
   */
  ( name ) => {
    return isSymbol( name ) || !isReserved( name );
  };

  var isString = /**
   * 判断传入对象是否是 String 类型
   * @param {any} value 需要判断的对象
   */
  value => typeof value === 'string';

  var observeHu = {
    set: {
      before: ( target, name ) => {
        return isSymbolOrNotReserved( name ) ? null : 0;
      }
    },
    get: {
      before: ( target, name ) => {
        return isString( name ) && isReserved( name ) ? 0 : null;
      }
    },
    deleteProperty: {
      before: ( target, name ) => {
        return isString( name ) && isReserved( name ) ? 0 : null;
      }
    }
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
  value => value !== null;

  var isObject = /**
   * 判断传入对象是否是 Object 类型且不为 null
   * @param {any} value 需要判断的对象
   */
  value => value !== null && typeof value === 'object';

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
      /** 实例初始化后被调用, 计算属性 computed 和数据监听 watch 还未初始化 */
      'beforeCreate',
      /** 实例创建完成后被调用, 但是挂载还未开始 */
      'created',
      /**
       * 首次挂载开始之前被调用
       * - 对于自定义元素, 会在首次被添加到文档流时调用
       */
      'beforeMount',
      /**
       * 首次挂载之后被调用
       * - 对于自定义元素, 会在首次被添加到文档流时调用
       */
      'mounted',
      /** 实例销毁之前调用. 在这一步, 实例仍然完全可用 */
      'beforeDestroy',
      /** 实例销毁后调用 */
      'destroyed',
      /**
       * 自定义元素被添加到文档流 ( 自定义元素独有 )
       * - 此时实例完全可用
       */
      'connected',
      /**
       * 自定义元素被移动到新文档时调用 ( 自定义元素独有 )
       * - 此时实例完全可用
       */
      'adopted',
      /**
       * 自定义元素被从文档流移除 ( 自定义元素独有 )
       * - 此时实例完全可用
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

    if( !isMixin && mixins ){
      for( let mixin of mixins ){
        initState( isCustomElement, mixin, options, null, true );
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

  function initOther( isCustomElement, userOptions, options, mixins, isMixin ){

    const { render } = userOptions;

    // 渲染方法
    options.render = isFunction( render ) ? render : null;

    if( inBrowser && !isCustomElement ){
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
    initOther( isCustomElement, userOptions, options, mixins );

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
   * @param {string} attribute 需要定义的属性名称
   * @param {function} get 属性的 getter 方法
   * @param {function} set 属性的 setter 方法
   */
  ( obj, attribute, get, set ) => {
    defineProperty( obj, attribute, {
      enumerable: true,
      configurable: true,
      get,
      set
    });
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
        defineProperty$1( this, 'shouldUpdate', () => shouldUpdate, value => {
          if( shouldUpdate = value ) this.ssu();
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
  const directive = (f) => ((...args) => {
      const d = f(...args);
      directives.set(d, true);
      return d;
  });
  const isDirective = (o) => {
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
  const isCEPolyfill = inBrowser && window.customElements !== undefined &&
      window.customElements.polyfillWrapFlushCallback !==
          undefined;
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
          const _prepareTemplate = (template) => {
              const content = template.content;
              // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
              // null
              const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
              // Keeps track of the last index associated with a part. We try to delete
              // unnecessary nodes, but we never want to associate two different parts
              // to the same index. They must have a constant node between.
              let lastPartIndex = 0;
              while (walker.nextNode()) {
                  index++;
                  const node = walker.currentNode;
                  if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                      if (node.hasAttributes()) {
                          const attributes = node.attributes;
                          // Per
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
                              const stringForPart = result.strings[partIndex];
                              // Find the attribute name
                              const name = lastAttributeNameRegex.exec(stringForPart)[2];
                              // Find the corresponding attribute
                              // All bound attributes have had a suffix added in
                              // TemplateResult#getHTML to opt out of special attribute
                              // handling. To look up the attribute value we also need to add
                              // the suffix.
                              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                              const attributeValue = node.getAttribute(attributeLookupName);
                              const strings = attributeValue.split(markerRegex);
                              this.parts.push({ type: 'attribute', index, name, strings });
                              node.removeAttribute(attributeLookupName);
                              partIndex += strings.length - 1;
                          }
                      }
                      if (node.tagName === 'TEMPLATE') {
                          _prepareTemplate(node);
                      }
                  }
                  else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                      const data = node.data;
                      if (data.indexOf(marker) >= 0) {
                          const parent = node.parentNode;
                          const strings = data.split(markerRegex);
                          const lastIndex = strings.length - 1;
                          // Generate a new text node for each literal section
                          // These nodes are also used as the markers for node parts
                          for (let i = 0; i < lastIndex; i++) {
                              parent.insertBefore((strings[i] === '') ? createMarker() :
                                  document.createTextNode(strings[i]), node);
                              this.parts.push({ type: 'node', index: ++index });
                          }
                          // If there's no text, we must insert a comment to mark our place.
                          // Else, we can trust it will stick around after cloning.
                          if (strings[lastIndex] === '') {
                              parent.insertBefore(createMarker(), node);
                              nodesToRemove.push(node);
                          }
                          else {
                              node.data = strings[lastIndex];
                          }
                          // We have a part for each match found
                          partIndex += lastIndex;
                      }
                  }
                  else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                      if (node.data === marker) {
                          const parent = node.parentNode;
                          // Add a new marker node to be the startNode of the Part if any of
                          // the following are true:
                          //  * We don't have a previousSibling
                          //  * The previousSibling is already the start of a previous part
                          if (node.previousSibling === null || index === lastPartIndex) {
                              index++;
                              parent.insertBefore(createMarker(), node);
                          }
                          lastPartIndex = index;
                          this.parts.push({ type: 'node', index });
                          // If we don't have a nextSibling, keep this node so we have an end.
                          // Else, we can remove it to save future costs.
                          if (node.nextSibling === null) {
                              node.data = '';
                          }
                          else {
                              nodesToRemove.push(node);
                              index--;
                          }
                          partIndex++;
                      }
                      else {
                          let i = -1;
                          while ((i = node.data.indexOf(marker, i + 1)) !==
                              -1) {
                              // Comment node has a binding marker inside, make an inactive part
                              // The binding won't work, but subsequent bindings will
                              // TODO (justinfagnani): consider whether it's even worth it to
                              // make bindings in comments work
                              this.parts.push({ type: 'node', index: -1 });
                          }
                      }
                  }
              }
          };
          _prepareTemplate(element);
          // Remove text binding nodes after the walk to not disturb the TreeWalker
          for( let n of nodesToRemove) {
              n.parentNode.removeChild(n);
          }
      }
  }
  const isTemplatePartActive = (part) => part.index !== -1;
  // Allows `document.createComment('')` to be renamed for a
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
          for( let part of this._parts) {
              if (part !== undefined) {
                  part.setValue(values[i]);
              }
              i++;
          }
          for( let part of this._parts) {
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
          const fragment = isCEPolyfill ?
              this.template.element.content.cloneNode(true) :
              document.importNode(this.template.element.content, true);
          const parts = this.template.parts;
          let partIndex = 0;
          let nodeIndex = 0;
          const _prepareInstance = (fragment) => {
              // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
              // null
              const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
              let node = walker.nextNode();
              // Loop through all the nodes and parts of a template
              while (partIndex < parts.length && node !== null) {
                  const part = parts[partIndex];
                  // Consecutive Parts may have the same node index, in the case of
                  // multiple bound attributes on an element. So each iteration we either
                  // increment the nodeIndex, if we aren't on a node with a part, or the
                  // partIndex if we are. By not incrementing the nodeIndex when we find a
                  // part, we allow for the next part to be associated with the current
                  // node if neccessasry.
                  if (!isTemplatePartActive(part)) {
                      this._parts.push(undefined);
                      partIndex++;
                  }
                  else if (nodeIndex === part.index) {
                      if (part.type === 'node') {
                          const part = this.processor.handleTextExpression(this.options);
                          part.insertAfterNode(node.previousSibling);
                          this._parts.push(part);
                      }
                      else {
                          this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
                      }
                      partIndex++;
                  }
                  else {
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
              const s = this.strings[i];
              // This exec() call does two things:
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
                  html += s.substr(0, match.index) + match[1] + match[2] +
                      boundAttributeSuffix + match[3] + marker;
              }
              else {
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
  const isPrimitive = (value) => {
      return (value === null ||
          !(typeof value === 'object' || typeof value === 'function'));
  };
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
              const directive = this._pendingValue;
              this._pendingValue = noChange;
              directive(this);
          }
          const value = this._pendingValue;
          if (value === noChange) {
              return;
          }
          if (isPrimitive(value)) {
              if (value !== this.value) {
                  this._commitText(value);
              }
          }
          else if (value instanceof TemplateResult) {
              this._commitTemplateResult(value);
          }
          else if (value instanceof Node) {
              this._commitNode(value);
          }
          else if (Array.isArray(value) ||
              // tslint:disable-next-line:no-any
              value[Symbol.iterator]) {
              this._commitIterable(value);
          }
          else if (value === nothing) {
              this.value = nothing;
              this.clear();
          }
          else {
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
          if (node === this.endNode.previousSibling &&
              node.nodeType === 3 /* Node.TEXT_NODE */) {
              // If we only have a single text node between the markers, we can just
              // set its value, rather than replacing it.
              // TODO(justinfagnani): Can we just check if this.value is primitive?
              node.data = value;
          }
          else {
              this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
          }
          this.value = value;
      }
      _commitTemplateResult(value) {
          const template = this.options.templateFactory(value);
          if (this.value instanceof TemplateInstance &&
              this.value.template === template) {
              this.value.update(value.values);
          }
          else {
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
          }
          // Lets us keep track of how many items we stamped so we can clear leftover
          // items from a previous render
          const itemParts = this.value;
          let partIndex = 0;
          let itemPart;
          for( let item of value) {
              // Try to reuse an existing part
              itemPart = itemParts[partIndex];
              // If no existing part, create a new one
              if (itemPart === undefined) {
                  itemPart = new NodePart(this.options);
                  itemParts.push(itemPart);
                  if (partIndex === 0) {
                      itemPart.appendIntoPart(this);
                  }
                  else {
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
  try {
      const options = {
          get capture() {
              return false;
          }
      };
      // tslint:disable-next-line:no-any
      window.addEventListener('test', options, options);
      // tslint:disable-next-line:no-any
      window.removeEventListener('test', options, options);
  }
  catch (_e) {
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
      }
      // If the TemplateStringsArray is new, generate a key from the strings
      // This key is shared between all templates with identical content
      const key = result.strings.join(marker);
      // Check if we already have a Template for this key
      template = templateCache.keyString.get(key);
      if (template === undefined) {
          // If we have not seen this key before, create a new Template
          template = new Template(result, result.getTemplateElement());
          // Cache the Template for this key
          templateCache.keyString.set(key, template);
      }
      // Cache all future queries for this TemplateStringsArray
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
          parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
          part.appendInto(container);
      }
      part.setValue(result);
      part.commit();
  };

  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time
  inBrowser && (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.0.0');

  class AttributeCommitter{

    constructor(){
      [
        this.elem,
        this.attr,
        this.strings
      ] = arguments;
      this.parts = this.createParts();
    }

    createParts(){
      return Array.apply( null, { length: this.strings.length - 1 } ).map(() => {
        return new AttributePart( this );
      });
    }

    getValue(){
      const { strings, parts } = this;
      const length = strings.length - 1;
      let result = '';

      for( let index = 0, part; index < length; index++ ){
        result += strings[ index ];

        if( part = parts[ index ] ){
          const value = part.value;

          if( value != null ){
            if( isArray( value ) || !isString( value ) && value[ Symbol.iterator ] ){
              for( let item of value ){
                result += isString( item ) ? item : String( item );
              }
              continue;
            }
          }
          result += isString( value ) ? value : String( value );
        }
      }

      return result + strings[ length ];
    }

    commit(){
      this.elem.setAttribute(
        this.attr,
        this.getValue()
      );
    }

  }


  class AttributePart{

    constructor( committer ){
      this.committer = committer;
    }

    setValue( value ){
      if( isDirective( value ) ){
        return value( this );
      }

      this.oldValue = this.value;
      this.value = value;
    }

    commit(){
      const { value, oldValue } = this;

      isEqual( value, oldValue ) || (
        this.committer.commit( this.value = value )
      );
    }

  }

  var removeEventListener = /**
   * 移除事件
   * @param {Element} elem
   * @param {string} type
   * @param {function} listener
   * @param {boolean|{}} options
   */
  ( elem, type, listener, options ) => {
    elem.removeEventListener( type, listener, options );
  };

  var addEventListener = /**
   * 绑定事件
   * @param {Element} elem
   * @param {string} type
   * @param {function} listener
   * @param {boolean|{}} options
   */
  ( elem, type, listener, options ) => {
    elem.addEventListener( type, listener, options );
  };

  class BasicEventDirective{

    constructor( element, type, modifierKeys ){
      this.elem = element;
      this.type = type;
      this.opts = initEventOptions( modifierKeys );
    }

    setValue( listener ){
      if( isDirective( listener ) ){
        throw new Error(`@${ this.type } 指令不支持传入指令方法进行使用 !`);
      }

      this.oldListener = this.listener;
      this.listener = isFunction( listener ) ? listener : null;
    }

    commit(){
      const { listener, oldListener } = this;

      // 新的事件绑定与旧的事件绑定不一致
      if( listener !== oldListener ){
        const { elem, type, opts } = this;
        const { options, modifiers, once, add = true } = opts;

        // 移除旧的事件绑定
        // once 修饰符绑定的事件只允许在首次运行回调后自行解绑
        if( oldListener && !once ){
          removeEventListener( elem, type, this.value, options );
        }
        // 添加新的事件绑定
        if( listener && add ){
          // once 修饰符绑定的事件不允许修改
          if( once ) opts.add = false;
          // 生成绑定的方法
          const value = this.value = function callback( event ){
            // 修饰符检测
            for( let modifier of modifiers ){
              if( modifier( elem, event, modifiers ) === false ) return;
            }
            // 只执行一次
            if( once ){
              removeEventListener( elem, type, callback, options );
            }
            // 修饰符全部检测通过, 执行用户传入方法
            apply( listener, this, arguments );
          };
          // 注册事件
          addEventListener( elem, type, value, options );
        }
      }
    }

  }

  function initEventOptions( modifierKeys ){
    const options = {};
    const modifiers = [];

    for( let name of modifierKeys ){
      if( eventOptions[ name ] ) options[ name ] = true;
      else if( eventModifiers[ name ] ) modifiers.push( eventModifiers[ name ] );
    }

    modifiers.keys = modifierKeys;

    const { once, passive, capture } = options;

    return {
      once,
      options: passive ? { passive, capture } : capture,
      modifiers
    };
  }

  /**
   * 事件可选参数
   */
  const eventOptions = {
    once: true,
    capture: true,
    passive: supportsPassive
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
   * 鼠标按钮
   */
  [ 'left', 'middle', 'right' ].forEach(( button, index ) => {
    eventModifiers[ button ] = ( elem, event ) => {
      return has( event, 'button' ) && event.button === index;
    };
  });

  /**
   * 系统修饰键
   */
  [ 'ctrl', 'alt', 'shift', 'meta' ].forEach( key => {
    eventModifiers[ key ] = ( elem, event ) => {
      return !!event[ key + 'Key' ];
    };
  });

  class BasicBooleanDirective{

    constructor( element, attr ){
      this.elem = element;
      this.attr = attr;
    }

    setValue( value ){
      if( isDirective( value ) ){
        return value( this );
      }

      this.oldValue = this.value;
      this.value = value;
    }

    commit(){
      const value = this.value = !!this.value;
      const oldValue = this.oldValue;

      if( value !== oldValue ){
        if( value ){
          this.elem.setAttribute( this.attr , '' );
        }else{
          this.elem.removeAttribute( this.attr );
        }
      }
    }

  }

  class BasicPropertyDirective extends BasicBooleanDirective{

    commit(){
      const { value, oldValue } = this;

      isEqual( value, oldValue ) || (
        this.elem[ this.attr ] = value
      );
    }

  }

  var rWhitespace = /\s+/;

  /**
   * 存放上次设置的 class 内容
   */
  const classesMap = new WeakMap();


  class ClassDirective{

    constructor( element ){
      this.elem = element;
    }

    setValue( value ){
      if( isDirective( value ) ){
        return value( this, true );
      }

      this.parse( this.value = {}, value );
    }

    commit(){
      const { value: classes, elem: { classList } } = this;

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
    parse( classes, value ){
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
              return this.parse( classes, name );
            });
          }else{
            each( value, ( name, truthy ) => {
              return truthy ? this.parse( classes, name )
                            : delete classes[ name ];
            });
          }
        }
      }
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


  class StyleDirective extends ClassDirective{

    commit(){
      const { value: styles, elem: { style } } = this;
      const oldStyles = styleMap.get( this );

      // 移除旧 style
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
    parse( styles, value ){
      switch( typeof value ){
        case 'string': {
          return this.parse(
            styles,
            parseStyleText( value )
          );
        }
        case 'object': {
          if( isArray( value ) ){
            value.forEach( value => {
              return this.parse( styles, value );
            });
          }else{
            each( value, ( name, value ) => {
              return styles[ hyphenate( name ) ] = value;
            });
          }
        }
      }
    }

  }

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
          for( let i = index + 1, len = queue.length; i < len; i++ ){
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

  var triggerEvent = /**
   * 触发事件
   * @param {Element} elem
   * @param {string} type
   */
  ( target, type ) => {
    const event = document.createEvent('HTMLEvents');
    event.initEvent( type, true, true );
    target.dispatchEvent( event );
  };

  /**
   * Render 渲染方法调用堆栈
   */
  const renderStack = [];

  /**
   * 存放渲染时收集到的属性监听的解绑方法
   * 用于下次渲染时的解绑
   */
  const bindDirectiveCacheMap = new WeakMap();

  /**
   * 存放渲染时收集到的双向数据绑定信息
   */
  const modelDirectiveCacheMap = new WeakMap();

  class ModelDirective{

    constructor( element ){
      const tag = element.nodeName.toLowerCase();
      const type = element.type;
      let handler;

      if( tag === 'select' ){
        handler = handlerSelect;
      }else if( tag === 'input' && type === 'checkbox' ){
        handler = handlerCheckbox;
      }else if( tag === 'input' && type === 'radio' ){
        handler = handlerRadio;
      }else if( tag === 'input' || tag === 'textarea' ){
        handler = handlerDefault;
      }

      this.elem = element;
      this.handler = handler;
    }

    setValue( options ){
      if( !( isArray( options ) && options.length > 1 ) ){
        throw new Error(':model 指令的参数出错, :model 指令不支持此种传参 !');
      }

      pushTarget();

      const optionsProxy = this.options || (
        this.options = observe([])
      );

      optionsProxy.splice( 0, 2, ...options );

      popTarget();

      // 当前渲染元素
      const rendering = renderStack[ renderStack.length - 1 ];
      // 当前渲染元素使用的双向数据绑定信息
      let modelParts = modelDirectiveCacheMap.get( rendering );

      if( !modelParts ){
        modelParts = [];
        modelDirectiveCacheMap.set( rendering, modelParts );
      }

      modelParts.push( this );
    }

    commit(){
      let init = this.init,
          options,
          set;

      if( init && ( options = this.options ).length && ( set = this.set ) ){
        pushTarget();
        set( options[0][ options[1] ] );
        popTarget();
      }
      if( init || !this.handler ) return;

      this.init = true;
      this.handler( this.elem, this.options );
    }

  }

  function watch( part, options, elem, prop ){
    const set = part.set = isFunction( prop ) ? prop : ( value ) => elem[ prop ] = value;

    apply( $watch, this, [
      () => {
        return options.length ? options[0][ options[1] ]
                              : emptyObject;
      },
      function( value ){
        value !== emptyObject && apply( set, this, arguments );
      },
      {
        immediate: true
      }
    ]);
  }

  function handlerSelect( elem, options ){
    // 监听绑定值改变
    watch( this, options, elem, 'value' );
    // 监听控件值改变
    addEventListener( elem, 'change', event => {
      const [ proxy, name ] = options;
      const value = filter.call( elem.options, option => option.selected )
                          .map( option => option.value );

      proxy[ name ] = elem.multiple ? value : value[0];
    });
  }

  function handlerCheckbox( elem, options ){
    // 监听绑定值改变
    watch( this, options, elem, 'checked' );
    // 监听控件值改变
    addEventListener( elem, 'change', event => {
      const [ proxy, name ] = this.options;
      proxy[ name ] = elem.checked;
    });
  }

  function handlerRadio( elem, options ){
    // 监听绑定值改变
    watch( this, options, elem, value => {
      elem.checked = value == ( getAttribute( elem, 'value' ) || null );
    });
    // 监听控件值改变
    addEventListener( elem, 'change', event => {
      const [ proxy, name ] = this.options;
      proxy[ name ] = getAttribute( elem, 'value' ) || null;
    });
  }

  function handlerDefault( elem, options ){
    // 监听绑定值改变
    watch( this, options, elem, 'value' );
    // 监听控件值改变
    addEventListener( elem, 'compositionstart', event => {
      elem.composing = true;
    });
    addEventListener( elem, 'compositionend', event => {
      if( !elem.composing ) return;

      elem.composing = false;
      triggerEvent( elem, 'input' );
    });
    addEventListener( elem, 'input', event => {
      if( elem.composing || !options.length ) return;

      const [ proxy, name ] = this.options;
      proxy[ name ] = elem.value;
    });
  }

  class TextDirective{

    constructor( element ){
      this.elem = element;
    }

    setValue( value ){
      if( isDirective( value ) ){
        return value( this, true );
      }

      this.oldValue = this.value;
      this.value = value;
    }

    commit(){
      const { value, oldValue } = this;

      isEqual( value, oldValue ) || (
        this.elem.innerText = value
      );
    }

  }

  class HtmlDirective extends TextDirective{

    commit(){
      const { value, oldValue } = this;

      isEqual( value, oldValue ) || (
        this.elem.innerHTML = value
      );
    }

  }

  class TemplateProcessor{
    handleAttributeExpressions( element, name, strings, options ){

      const prefix = name[0];

      // 用于绑定 DOM 属性 ( property )
      if( prefix === '.' ){
        const [ attr ] = name.slice(1).split('.');

        return [
          new BasicPropertyDirective( element, attr )
        ];
      }
      // 事件绑定
      else if( prefix === '@' ){
        const [ type, ...modifierKeys ] = name.slice(1).split('.');

        return [
          new BasicEventDirective( element, type, modifierKeys )
        ];
      }
      // 若属性值为 Truthy 则保留 DOM 属性
      // 否则移除 DOM 属性
      // - Truthy: https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy
      else if( prefix === '?' ){
        const [ attr ] = name.slice(1).split('.');

        return [
          new BasicBooleanDirective( element, attr )
        ];
      }
      // 功能指令
      else if( prefix === ':' ){
        const [ attr ] = name.slice(1).split('.');

        if( has( attrHandler, attr ) ){
          return [
            new attrHandler[ attr ]( element, attr )
          ];
        }
      }

      // 正常属性
      return ( new AttributeCommitter( element, name, strings ) ).parts;
    }
    handleTextExpression( options ){
      return new NodePart( options );
    }
  }

  var templateProcessor = new TemplateProcessor();


  /**
   * 存放指定属性的特殊处理
   */
  const attrHandler = {
    class: ClassDirective,
    style: StyleDirective,
    model: ModelDirective,
    text: TextDirective,
    html: HtmlDirective
  };

  /**
   * lit-html
   * directives/repeat
   * Licensed under the MIT License
   * http://polymer.github.io/LICENSE.txt
   *
   * modified by Wei Zhang (@Zhang-Wei-666)
   */

  const partListCache = new WeakMap();
  const keyListCache = new WeakMap();

  var repeat = directive(( items, key, template ) => {
    const keyFn = isFunction( key ) ? key : item => item[ key ];

    return containerPart => {
      if( !( containerPart instanceof NodePart ) ){
        throw new Error('Hu.html.repeat 指令方法只能在文本区域中使用 !');
      }

      const oldParts = partListCache.get( containerPart ) || [];
      const oldKeys = keyListCache.get( containerPart ) || [];

      const newKeys = [];
      const newValues = [];
      const newParts = [];

      for( let index = 0, item; index < items.length; index++ ){
        item = items[ index ];

        newKeys[ index ] = keyFn( item, index );
        newValues[ index ] = template( item, index );
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
          if( newKeyToIndexMap === undefined ){
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
            const oldPart = oldIndex !== undefined ? oldParts[oldIndex] : null;

            if( oldPart === null ){
              const newPart = createAndInsertPart( containerPart, oldParts[ oldHead ] );

              updatePart( newPart, newValues[ newHead ] );
              newParts[ newHead ] = newPart;
            }else{
              newParts[ newHead ] = updatePart( oldPart, newValues[ newHead ] );
              insertPartBefore(containerPart, oldPart, oldParts[oldHead]);
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

      partListCache.set(containerPart, newParts);
      keyListCache.set(containerPart, newKeys);
    };
  });


  function updatePart( part, value ){
    part.setValue( value );
    part.commit();
    return part;
  }

  function insertPartBefore( containerPart, part, ref ){
    const container = containerPart.startNode.parentNode;
    const beforeNode = ref ? ref.startNode : containerPart.endNode;
    const endNode = part.endNode.nextSibling;
    
    if( endNode !== beforeNode ){
      reparentNodes( container, part.startNode, endNode, beforeNode );
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
    const beforeNode = beforePart === undefined ? containerPart.endNode : beforePart.startNode;
    const startNode = container.insertBefore( createMarker(), beforeNode );
    container.insertBefore( createMarker(), beforeNode );
    const newPart = new NodePart( containerPart.options );
    newPart.insertAfterNode( startNode );
    return newPart;
  }

  /**
   * lit-html
   * directives/unsafeHTML
   * Licensed under the MIT License
   * http://polymer.github.io/LICENSE.txt
   *
   * modified by Wei Zhang (@Zhang-Wei-666)
   */

  const oldValueMap = new WeakMap();

  var unsafeHTML = directive( value => part => {
    if( !( part instanceof NodePart ) ){
      throw new Error('Hu.html.unsafe 指令方法只能在文本区域中使用 !');
    }

    const oldValue = oldValueMap.get( part );

    if( oldValue && isPrimitive( value ) && value === oldValue.value && part.value === oldValue.fragment ){
      return;
    }

    const template = document.createElement('template');
          template.innerHTML = value;

    const fragment = document.importNode( template.content, true );

    part.setValue( fragment );

    oldValueMap.set( part, {
      value,
      fragment
    });
  });

  var bind = directive(( proxy, name ) => {

    // 是否是观察者对象
    // 绑定的必须是观察者对象
    const isObserve = observeProxyMap.has( proxy );

    return ( part, deep = false ) => {
      if( part instanceof NodePart ){
        throw new Error('Hu.html.bind 指令方法只能在元素属性绑定中使用 !');
      }

      const setValue = ( value ) => {
        part.setValue( value );
        part.commit();
      };

      if( !isObserve ){
        const value = proxy[ name ];
        return setValue( value );
      }

      const unWatch = $watch(
        () => proxy[ name ],
        setValue,
        {
          immediate: true,
          deep
        }
      );
    
      // 当前渲染元素
      const rendering = renderStack[ renderStack.length - 1 ];
      // 当前渲染元素属性监听解绑方法集
      let bindWatches = bindDirectiveCacheMap.get( rendering );
    
      if( !bindWatches ){
        bindWatches = [];
        bindDirectiveCacheMap.set( rendering, bindWatches );
      }
    
      bindWatches.push( unWatch );
    };
  });

  function html( strings, ...values ){
    return new TemplateResult( strings, values, 'html', templateProcessor );
  }

  assign( html, {
    unsafe: unsafeHTML,
    repeat,
    bind
  });

  function litRender( result, container, options ){

    unWatchAllDirectiveCache( container );

    renderStack.push( container );

    render( result, container, options );

    renderStack.pop();
  }


  /**
   * 解绑上次渲染时收集到的属性监听和双向数据绑定信息
   */
  function unWatchAllDirectiveCache( container ){
    // 解绑上次渲染时收集到的属性监听
    unWatchDirectiveCache( bindDirectiveCacheMap, container, unWatch => {
      return unWatch();
    });
    // 解绑上次渲染时收集到的双向数据绑定信息
    unWatchDirectiveCache( modelDirectiveCacheMap, container, modelPart => {
      return modelPart.options.length = 0;
    });
  }

  function unWatchDirectiveCache( cache, container, fn ){
    const options = cache.get( container );

    if( options ){
      for( let option of options ){
        fn( option );
      }
      options.length = 0;
    }
  }

  /**
   * 渲染函数的 Watcher 缓存
   */
  const renderWatcherCache = new WeakMap();

  /** 迫使 Hu 实例重新渲染 */
  var initForceUpdate = ( name, target, targetProxy ) => {
    /** 当前实例的实例配置 */
    const userRender = optionsMap[ name ].render;

    if( userRender ){
      // 创建当前实例渲染方法的 Watcher
      const watcher = new Watcher(() => {
        const $el = target.$el;

        if( $el ){
          litRender( userRender.call( targetProxy, html ), $el );
          target.$refs = getRefs( $el );
        }
      });

      // 缓存当前实例渲染方法的 Watcher
      renderWatcherCache.set( targetProxy, watcher );

      target.$forceUpdate = watcher.get;
    }else{
      target.$forceUpdate = noop;
    }
  };

  /**
   * 清空 render 方法收集到的依赖
   */
  function removeRenderDeps( targetProxy ){
    const watcher = renderWatcherCache.get( targetProxy );

    if( watcher ){
      watcher.clean();
    }
  }

  function getRefs( root ){
    const refs = {};
    const elems = root.querySelectorAll('[ref]');

    if( elems.length ){
      Array.from( elems ).forEach( elem => {
        const name = elem.getAttribute('ref');
        refs[ name ] = refs[ name ] ? [].concat( refs[ name ], elem )
                                    : elem;
      });
    }

    return Object.freeze( refs );
  }

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
        observeProxyMap.get( this ).target.$el = el;
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
    return this;
  }

  function $once( type, fn ){
    function once(){
      this.$off( type, once );
      apply( fn, this, arguments );
    }
    onceMap.set( once, fn );
    this.$on( type, once );
    return this;
  }

  function $off( type, fn ){
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
  }

  function $emit( type ){
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
  }

  var injectionToLit = /**
   * 在 $hu 上建立对象的映射
   * 
   * @param {{}} litTarget $hu 实例
   * @param {string} key 对象名称
   * @param {any} value 对象值
   * @param {function} set 属性的 getter 方法, 若传值, 则视为使用 Object.defineProperty 对值进行定义
   * @param {function} get 属性的 setter 方法
   */
  ( litTarget, key, value, set, get ) => {

    // 首字母为 $ 则不允许映射到 $hu 实例中去
    if( !isSymbolOrNotReserved( key ) ) return;

    // 若在 $hu 下有同名变量, 则删除
    has( litTarget, key ) && delete litTarget[ key ];

    // 使用 Object.defineProperty 对值进行定义
    if( set ){
      defineProperty$1( litTarget, key, set, get );
    }
    // 直接写入到 $hu 上
    else{
      litTarget[ key ] = value;
    }

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

  /**
   * 存放每个实例的 computed 相关数据
   */
  const computedMap = new WeakMap();
  /**
   * 空计算属性
   */
  let emptyComputed;


  function initComputed$1( options, target, targetProxy ){

    const computed = options.computed;

    // 如果定义当前实例时未定义 computed 属性
    // 则当前实例的 $computed 就是个普通的观察者对象
    if( isEmptyObject( computed ) ){
      return target.$computed = emptyComputed || (
        emptyComputed = observe({}, observeReadonly)
      );
    }

    const computedOptions = createComputed( targetProxy );
    const [ ,, appendComputed,, computedTargetProxyInterceptor ] = computedOptions;

    // 存储当前实例 computed 相关数据
    computedMap.set( targetProxy, computedOptions );

    target.$computed = computedTargetProxyInterceptor;

    // 将拦截器伪造成观察者对象
    observeProxyMap.set( computedTargetProxyInterceptor, {} );

    each( computed, ( name, computed ) => {
      appendComputed( name, computed );
      injectionToLit(
        target, name, 0,
        () => computedTargetProxyInterceptor[ name ],
        value => computedTargetProxyInterceptor[ name ] = value
      );
    });
  }

  function $destroy(){

    callLifecycle( this, 'beforeDestroy' );

    // 注销实例所有计算属性和 watch 数据
    removeComputed( computedMap, this );
    removeComputed( watcherMap, this );

    // 解绑上次渲染时收集到的属性监听和双向数据绑定信息
    unWatchAllDirectiveCache( this.$el );

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
    constructor( name ){
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
  function initProps$1( isCustomElement, root, options, target, targetProxy ){

    const props = options.props;
    const propsTarget = create( null );
    const propsTargetProxy = target.$props = observe( propsTarget );

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

    // 将 $props 上的属性在 $hu 上建立引用
    each( props, ( name, options ) => {
      if( options.isSymbol || !isReserved( name ) ){
        defineProperty$1(
          target, name,
          () => propsTargetProxy[ name ],
          value => propsTargetProxy[ name ] = value
        );
      }
    });

  }

  /**
   * 初始化当前组件 methods 属性
   * @param {{}} options 
   * @param {{}} target 
   * @param {{}} targetProxy 
   */
  function initMethods$1( options, target, targetProxy ){

    const methodsTarget = target.$methods = create( null );

    each( options.methods, ( name, value ) => {
      const method = methodsTarget[ name ] = value.bind( targetProxy );

      injectionToLit( target, name, method );
    });

  }

  /**
   * 初始化当前组件 data 属性
   * @param {{}} options
   * @param {{}} target
   * @param {{}} targetProxy
   */
  function initData$1( options, target, targetProxy ){

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

    const dataTargetProxy = target.$data = observe( dataTarget );

    each( dataTarget, name => {
      injectionToLit(
        target, name, 0,
        () => dataTargetProxy[ name ],
        value => dataTargetProxy[ name ] = value
      );
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

  function initOptions$1( isCustomElement, name, target, userOptions ){

    // Hu 的初始化选项
    target.$options = observe( userOptions, observeReadonly );

    // Hu 实例信息选项
    target.$info = observe(
      {
        name,
        isMounted: false,
        isCustomElement,
        isConnected: false
      },
      observeReadonly
    );

  }

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
    const target = new HuConstructor( name );
    /** 当前实例观察者对象 */
    const targetProxy = observeMap.get( target ).proxy;

    // 
    if( isCustomElement ){
      target.$el = root.attachShadow({ mode: 'open' });
      target.$customElement = root;
    }

    initOptions$1( isCustomElement, name, target, userOptions );
    initProps$1( isCustomElement, root, options, target, targetProxy );
    initMethods$1( options, target, targetProxy );
    initData$1( options, target, targetProxy );

    // 运行 beforeCreate 生命周期方法
    callLifecycle( targetProxy, 'beforeCreate', options );

    initComputed$1( options, target, targetProxy );
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

  const Hu = new Proxy( HuConstructor, {
    construct( HuConstructor, [ _userOptions ] ){
      const name = 'anonymous-' + uid$1();
      const [ userOptions, options ] = initOptions( false, name, _userOptions );
      const targetProxy = init( false, void 0, name, options, userOptions );

      return targetProxy;
    }
  });

  Hu.version = '1.0.0-bata.3';

  var initAttributeChangedCallback = propsMap => function( name, oldValue, value ){
    if( value === oldValue ) return;

    const { $props: propsTargetProxy } = this.$hu;
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
    const $hu = this.$hu;
    const infoTarget = observeProxyMap.get( $hu.$info ).target;

    infoTarget.isConnected = false;

    unWatchAllDirectiveCache( $hu.$el );
    removeRenderDeps( $hu );

    callLifecycle( $hu, 'disconnected', options );
  };

  var initAdoptedCallback = options => function( oldDocument, newDocument ){
    callLifecycle( this.$hu, 'adopted', options, [
      newDocument, oldDocument
    ]);
  };

  var initConnectedCallback = options => function(){
    const $hu = this.$hu;
    const $info = $hu.$info;
    const isMounted = $info.isMounted;
    const infoTarget = observeProxyMap.get( $info ).target;

    infoTarget.isConnected = true;

    // 如果是首次挂载, 需要运行 beforeMount 生命周期方法
    if( !isMounted ){
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
  }

  function render$1( result, container ){
    if( arguments.length > 1 ){
      return litRender( result, container );
    }

    container = result;

    return function(){
      const result = apply( html, null, arguments );
      return litRender( result, container );
    }
  }

  const otherHu = inBrowser ? window.Hu
                            : undefined;

  Hu.noConflict = () => {
    if( inBrowser && window.Hu === Hu ) window.Hu = otherHu;
    return Hu;
  };

  if( inBrowser ){
    window.Hu = Hu;
  }

  assign( Hu, {
    define,
    render: render$1,
    html,
    nextTick,
    observable
  });

  return Hu;

}));
