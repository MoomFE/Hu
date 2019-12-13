(function (chai) {
  'use strict';

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

  /**
   * 用于 Watcher 的依赖收集
   * @param {*} target 
   * @param {*} fn 
   */
  function targetCollection( target, fn ){
    let result;

    targetStack.push( target);
    targetStack.target = target;

    result = fn();

    targetStack.pop();
    targetStack.target = targetStack[ targetStack.length - 1 ];

    return result;
  }

  /**
   * 用于防止方法执行时被依赖收集
   * @param {*} fn 
   */
  function safety( fn ){
    return targetCollection( 0, fn );
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
  const createObserverProxyGetter = ({ before } = emptyObject, { subs, deepSubs, lastValue }) => ( target, name, targetProxy ) => {

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
      // 如果 watcher 已经通过深度监听标记过依赖了, 那么无需再添加一次依赖
      deepSubs.has( watcher ) || watcher.add( subs, name );
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

    // 尝试写入值并触发更新
    observerProxySetValue(
      subs, deepSubs, lastValue, isArray,
      target, name, value, targetProxy
    );

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
   * 尝试向观察者对象写入值
   * 并在写入值后触发更新
   */
  function observerProxySetValue(
    subs, deepSubs, lastValue, isArray,
    target, name, value, targetProxy
  ){
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
  }

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
  // export const isFirefox = UA && UA.indexOf('firefox') > -1;


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

  // export const isCEPolyfill = inBrowser
  //                          && window.customElements !== void 0
  //                          && window.customElements.polyfillWrapFlushCallback !== void 0;

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
     * @param {*} fn 需要收集依赖的方法
     * @param {*} computedOptions 计算属性参数
     * @param {*} watchOptions 监听方法参数
     */
    constructor( fn, computedOptions, isWatch ){
      // 当前方法收集依赖的 ID, 用于从 dependentsMap ( 存储 / 读取 ) 依赖项
      this.id = uid$1();
      // 当前 watcher 在运行时收集的依赖集合
      this.deps = new Set();
      // 需要收集依赖的方法
      this.fn = fn;
      // 当订阅的依赖更新后, 会调用当前方法重新计算依赖
      this.get = Watcher.get.bind( this );

      // 存储其他参数
      if( computedOptions ) this.initComputed( computedOptions );
      else if( isWatch ) this.initWatch();
    }

    initComputed({ observeOptions, name }){
      this.isComputed = true;
      this.observeOptions = observeOptions;
      this.name = name;

      // 依赖是否需要更新 ( 无依赖时可只在使用时进行更新 )
      let shouldUpdate;
      defineProperty$1( this, 'shouldUpdate', {
        get: () => shouldUpdate,
        set: value => {
          if( shouldUpdate = value ) this.ssu();
        }
      });
    }

    initWatch(){
      this.isWatch = true;
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
      // 方法执行完成, 则依赖收集完成
      targetCollection( this, () => {
        // 执行方法
        // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps
        result = this.fn();
      });

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
        };
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
        };
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

  var returnFalse = /**
   * 返回 false
   */
  () => false;

  class Computed{

    constructor( self, isWatch ){

      /** 当前计算属性容器的子级的一些参数 */
      const optionsMap = this.optionsMap = new Map;
      /** 当前计算属性容器对象 */
      const target = this.target = create( null );
      /** 当前计算属性容器的观察者对象 */
      const targetProxy = this.targetProxy = observe( target );
      /** 当前计算属性容器的获取与修改拦截器 */
      this.targetProxyInterceptor = new Proxy( targetProxy, {
        get: computedTargetProxyInterceptorGet( optionsMap ),
        set: computedTargetProxyInterceptorSet( optionsMap ),
        deleteProperty: returnFalse
      });
      /** 保存相关参数 */
      this.self = self;
      this.isWatch = isWatch;
      this.observeOptions = !isWatch && observeMap.get( target );
      
    }

    /**
     * 添加计算属性
     * @param {*} name 计算属性存储的名称
     * @param {*} computed 计算属性 getter / setter 对象
     */
    add( name, computed ){
      const { self, isWatch, observeOptions, target, targetProxy, optionsMap } = this;

      /** 计算属性的 setter */
      const set = ( computed.set || noop ).bind( self );
      /** 计算属性的 getter */
      const get = computed.get.bind( self );
      /** 计算属性的 watcher */
      const watcher = new Watcher(
        () => {
          if( isWatch ) return target[ name ] = get();
          return targetProxy[ name ] = get( self );
        },
        !isWatch && { observeOptions, name },
         isWatch
      );

      // 添加占位符
      target[ name ] = void 0;
      // 存储计算属性参数
      optionsMap.set( name, {
        watcher,
        set
      });
    }

    /**
     * 移除计算属性
     * @param {*} name 需要移除的计算属性名称
     */
    delete( name ){
      // 获取计算属性的参数
      const optionsMap = this.optionsMap;
      const options = optionsMap.get( name );

      // 有这个计算属性
      if( options ){
        const watcher = options.watcher;

        // 清空依赖
        watcher.clean();
        // 删除计算属性
        optionsMap.delete( name );
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
    }

    /**
     * 清空计算属性
     */
    clean(){
      for( let [ name ] of this.optionsMap ){
        this.delete( name );
      }
    }

  }


  const computedTargetProxyInterceptorGet = optionsMap => ( target, name ) => {
    // 获取计算属性的参数
    const options = optionsMap.get( name );

    // 防止用户通过 $computed 获取不存在的计算属性
    if( options ){
      const watcher = options.watcher;

      // 计算属性未初始化或需要更新
      if( !watcher.isInit || watcher.shouldUpdate ){
        watcher.get();
      }
    }

    return target[ name ];
  };

  const computedTargetProxyInterceptorSet = optionsMap => ( target, name, value ) => {
    // 获取计算属性的参数
    const options = optionsMap.get( name );

    // 防止用户通过 $computed 设置不存在的计算属性
    if( options ){
      return options.set( value ), true;
    }
    return false;
  };

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


  /**
   * 解析 $watch 首个参数
   */
  var parseExpOrFn = ( expOrFn, self ) => {
    // 使用键路径表达式
    if( isString( expOrFn ) ){
      return parsePath( expOrFn ).bind( self );
    }
    // 使用函数
    else if( isFunction( expOrFn ) ){
      return expOrFn.bind( self );
    }
    // 不支持其他写法
    return;
  };

  /**
   * 解析监听参数 deep
   */
  var parseDeep = deep => {
    deep = Number( deep );

    if( !deep ) deep = 0;
    else if( deep < 0 ) deep = deep === -1 ? Infinity : 0;

    return deep;
  };

  const seen = new Set;

  var traverse = ( value, deep ) => {
    traverse$1( value, deep );
    seen.clear();
  };

  function traverse$1( value, deep ){
    // 监听对象的观察者对象选项参数
    const options = observeProxyMap.get( value );

    // 只有观察者对象才能响应深度监听
    if( options ){

      // 检查当前对象是否已经建立了监听, 防止监听无限引用的对象时的死循环
      if( seen.has( value ) ){
        return;
      }
      // 保存建立了监听的对象
      seen.add( value );

      // 标记监听订阅信息
      if( --deep ){
        if( options.isArray ){
          value.forEach( value => traverse$1( value, deep ) );
        }else{
          each( value, ( key, value ) => traverse$1( value, deep ) );
        }
      }else{
        options.deepSubs.add( targetStack.target );
      }
    }
  }

  /**
   * 存放每个实例的 watch 数据
   */
  const watcherMap = new WeakMap();


  /**
   * 监听 Hu 实例对象和观察者对象
   */
  function $watch( expOrFn, callback, options ){
    // 传入对象的写法
    if( isPlainObject( callback ) ){
      return $watch.call( this, expOrFn, callback.handler, callback );
    }

    const self = this || emptyObject;
    let computedInstance, computedInstanceTarget, computedInstanceTargetProxyInterceptor;
    let watchFn;

    if( !( watchFn = parseExpOrFn( expOrFn, self ) ) ){
      return;
    }

    // 尝试读取当前实例 watch 相关数据
    if( watcherMap.has( self ) ){
      computedInstance = watcherMap.get( self );
    }
    // 存储当前实例 watch 相关数据
    else{
      watcherMap.set(
        self,
        computedInstance = new Computed( self, true )
      );
    }

    options = options || {};
    computedInstanceTarget = computedInstance.target;
    computedInstanceTargetProxyInterceptor = computedInstance.targetProxyInterceptor;

    /** 当前 watch 的存储名称 */
    const name = uid$1();
    /** 是否监听对象内部值的变化 */
    const deep = parseDeep( options.deep );
    /** 是否立即执行回调 */
    let immediate;
    /** 值改变是否执行回调 */
    let runCallback = immediate = !!options.immediate;

    // 添加监听
    computedInstance.add(
      name,
      {
        get(){
          const oldValue = computedInstanceTarget[ name ];
          const value = watchFn();

          // 深度监听
          if( deep ){
            traverse( value, deep );
          }

          // 运行回调
          if( runCallback ){
            //   首次运行             值不一样      值一样的话, 判断是否是深度监听
            if( immediate || isNotEqual( value, oldValue ) || deep ){
              safety(() => {
                return callback.call( self, value, oldValue );
              });
            }
          }

          return value;
        }
      }
    );

    // 首次运行, 以收集依赖
    computedInstanceTargetProxyInterceptor[ name ];
    // 下次值改变时运行回调
    runCallback = true;
    immediate = false;

    // 返回取消监听的方法
    return () => {
      computedInstance.delete( name );
    };
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

  /**
   * 指令方法合集
   */
  const directiveFns = new WeakMap();

  /**
   * 当前已经被指令激活的指令方法
   */
  const activeDirectiveFns = new WeakMap();

  /**
   * 注册指令方法
   */
  function directiveFn( directive ){
    /** 当前指令方法的 ID */
    const id = uid$1();
    let isRun = false;

    /**
     * 指令创建步骤
     *  - 注册指令方法后
     *  - 返回方法等待用户调用并传参
     * @param  {...any} args 
     */
    return ( ...args ) => {
      /**
       * 指令使用步骤
       *  - 用户调用并传参后
       *  - 返回方法等待渲染时被调用
       * @param {*} part 
       */
      function using( part ){
        const options = activeDirectiveFns.get( part );

        // 指令方法调用的子指令方法
        if( isRun ){
          (options.child = new directive( part )).commit( ...args );
        }
        // 指令方法本身被调用
        else{
          const instance = options.ins || (
            options.ins = new directive( part )
          );

          isRun = true;
          instance.commit( ...options.args );
          isRun = false;
        }
      }

      // 最终的指令使用步骤方法
      let usingProxy = using;

      // 指令方法可能需要代理指令使用步骤
      if( isFunction( directive.proxy ) && !isFunction( usingProxy = directive.proxy( using, args ) ) ){
        usingProxy = using;
      }

      // 将指令方法相关的信息存储起来
      directiveFns.set( usingProxy, {
        id,
        args,
        directive
      });

      // 返回方法
      // 等待下一步调用
      return usingProxy;
    };
  };

  var isDirectiveFn = value => {
    return directiveFns.has( value );
  };

  class BindDirectiveFnClass{
    constructor( part ){
      this.part = part;
    }
    commit( obj, name ){
      // 并非首次绑定且绑定的对象和上次不一样了
      // 那么对上次的绑定解绑
      if( this.unWatch && ( this.obj !== obj || this.name !== name ) ){
        this.unWatch();
      }

      this.obj = obj;
      this.name = name;
      this.unWatch = $watch(
        () => obj[ name ],
        ( value ) => this.part.commit( value, isDirectiveFn( value ) ),
        {
          immediate: true,
          deep: true
        }
      );
    }
    destroy(){
      this.unWatch();
    }

    static proxy( using, args ){
      return new Proxy( using, {
        get( target, name ){
          if( args.length === 1 ) return bind( args[0], name );
          return safety(() => {
            return bind( args[0][ args[1] ], name );
          });
        }
      });
    }
  }


  const bind = directiveFn( BindDirectiveFnClass );

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
      let directiveFnInfo;

      // 支持传入 bind 进行绑定
      if( isDirectiveFn && ( directiveFnInfo = directiveFns.get( value ) ).directive === BindDirectiveFnClass ){
        value = directiveFnInfo.args;
      }else if( isDirectiveFn || !( isArray( value ) && value.length > 1 ) ){
        throw new Error(':model 指令的参数出错, 不支持此种传参 !');
      }

      let init;
      let handler;
      let options;

      // 有双向绑定处理函数
      // 说明在可处理的元素范围内
      if( handler = this.handler ){

        safety(() => {
          options = this.options || (
            this.options = observe([])
          );
    
          options.splice( 0, 2, ...value );
    
          if( init = this.init ){
            this.set( value[ 0 ][ value[ 1 ] ] );
          }
        });

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
          };

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
          };

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
          };

        }
      }

      // 将收集到的可移除的节点进行删除
      for( const node of nodesToRemove ){
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

      for( const { value } of parts ){
        result += strings[ index++ ];

        if( value != null && isIterable( value ) && !isString( value ) ){
          for( const item of value ){
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
          for( const modifier of modifiers ){
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

      // 将上一次提交的指令方法调用的子指令方法进行销毁
      activeDirectiveFns.child && activeDirectiveFns.child.destroy && activeDirectiveFns.child.destroy();
      // 将上一次提交的指令方法进行销毁
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

      return fragment;
    }

    /**
     * 注销模板片段
     */
    destroy(){
      this.parts.forEach( part => {
        if( part ){
          destroyPart( part );
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
     */
    destroyPart(){
      // 注销模板片段对象 ( 如果有 )
      if( this.instance ){
        this.instance.destroy();
        this.instance = void 0;
      }
      // 注销数组类型的写入值
      else if( isArray( this.value ) ){
        for( const part of this.value ){
          if( part ){
            destroyPart( part );
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
    for( const item of value ){
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
   * lit-html
   * directives/repeat
   * Licensed under the MIT License
   * http://polymer.github.io/LICENSE.txt
   *
   * modified by Wei Zhang (@Zhang-Wei-666)
   */


  var repeat = directiveFn(

    class RepeatDirectiveFnClass{
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

    class UnsafeHTMLDirectiveFnClass{
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
   * 内部修改只读对象后触发更新
   * @param {Object|Array} target 
   * @param {String} name 
   * @param {any} value 
   */
  function setValueByReadonly( target, name, value ){
    // 是只读观察者对象
    if( observeMap.has( target ) ){
      const { subs, deepSubs, lastValue, isArray, proxy: targetProxy } = observeMap.get( target );

      // 尝试写入值并触发更新
      observerProxySetValue(
        subs, deepSubs, lastValue, isArray,
        target, name, value, targetProxy
      );
    }
  }

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
      setValueByReadonly( infoTarget, 'isMounted', true );
      setValueByReadonly( infoTarget, 'isConnected', true );

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
  };

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

    const computedInstance = new Computed( targetProxy );
    const computedInstanceTargetProxyInterceptor = computedInstance.targetProxyInterceptor;

    // 存储当前实例 computed 相关数据
    computedMap.set( targetProxy, computedInstance );

    // 将拦截器伪造成观察者对象
    observeProxyMap.set( computedInstanceTargetProxyInterceptor, emptyObject );

    each( computed, ( name, computed ) => {
      computedInstance.add( name, computed );
      injectionToInstance( isCustomElement, target, root, name, {
        get: () => computedInstanceTargetProxyInterceptor[ name ],
        set: value => computedInstanceTargetProxyInterceptor[ name ] = value
      });
    });

    injectionPrivateToInstance( isCustomElement, target, root, {
      $computed: computedInstanceTargetProxyInterceptor
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
   */
  ( container ) => {
    /** 获取在传入节点渲染时使用的 NodePart */
    const nodePart = renderParts.get( container );

    if( nodePart ){
      nodePart.destroy();
      renderParts.delete( container );
    }
  };

  function $destroy(){

    callLifecycle( this, 'beforeDestroy' );

    // 注销实例所有计算属性和 watch 数据
    removeComputed( computedMap, this );
    removeComputed( watcherMap, this );

    // 注销 render 时创建的指令及指令方法
    destroyRender( this.$el );

    // 清空 render 方法收集到的依赖
    removeRenderDeps( this );

    callLifecycle( this, 'destroyed' );

    // 删除所有自定义事件绑定
    this.$off();

  }

  function removeComputed( optionsMap, self ){
    optionsMap.has( self ) && optionsMap.get( self ).clean();
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
    const propsState = create( null );

    // 尝试从标签上获取 props 属性, 否则取默认值
    each( props, ( name, options ) => {
      let value = null;

      if( isCustomElement && options.attr ){
        value = root.getAttribute( options.attr );
      }

      // 定义了该属性
      if( value !== null ){
        propsState[ name ] = true;
        propsTarget[ name ] = ( options.from || returnArg )( value );
      }
      // 使用默认值
      else{
        propsState[ name ] = false;
        propsTarget[ name ] = isFunction( options.default )
                                ? options.default.call( targetProxy )
                                : options.default;
      }
    });


    each( props, ( name, options ) => {
      injectionToInstance( isCustomElement, target, root, name, {
        get: () => propsTargetProxy[ name ],
        set: value => {
          setValueByReadonly( propsState, name, true );
          propsTargetProxy[ name ] = value;
        }
      });
    });

    injectionPrivateToInstance( isCustomElement, target, root, {
      $props: propsTargetProxy
    });

    observeProxyMap.get( target.$info ).target.props = observe( propsState, observeReadonly );
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
        /** 当前实例的 UID - 在由 new 创建的实例中, uid 和 name 是相同的 */
        uid,
        /** 当前自定义元素的名称 - 在由 new 创建的实例中, name 是自动生成的名称 */
        name,
        /** 标识当前实例的首次挂载是否已完成 */
        isMounted: false,
        /** 标识当前实例是否是自定义元素 */
        isCustomElement,
        /** 标识当前自定义元素是否在文档流中 - 如果是使用 new 创建的实例, 则作用和 isMounted 一致 */
        isConnected: false,
        /** 标识当前实例的 prop 是否被赋值 - 使用 props 的 default 选项对 prop 初始化不算做赋值 */
        // props -> './initProps.js'
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

    ownKeys( HuConstructor.prototype ).filter( isReserved ).forEach( name => {
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

  const Hu = new Proxy( HuConstructor, {
    construct( HuConstructor, [ _userOptions ] ){
      const name = 'anonymous-' + uid$1();
      const [ userOptions, options ] = initOptions( false, name, _userOptions );
      const targetProxy = init( false, void 0, name, options, userOptions );

      return targetProxy;
    }
  });

  Hu.version = '__VERSION__';

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

    setValueByReadonly( infoTarget, 'isConnected', false );

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

    setValueByReadonly( infoTarget, 'isConnected', true );

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
      setValueByReadonly( infoTarget, 'isMounted', true );

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
    uid: uid$1,
    /** 用于防止方法执行时被依赖收集 */
    safety
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
    directiveBasic: create$1({
      Node: NodePart,
      Attr: AttributeCommitter,
      AttrPart: AttributePart,
      Boolean: BasicBooleanDirective,
      Event: BasicEventDirective,
      Prop: BasicPropertyDirective
    }),

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
      return Hu;
    }

    args.unshift( Hu, privateOptions );

    if( isFunction( plugin.install ) ){
      apply( plugin.install, plugin, args );
    }
    else if( isFunction( plugin ) ){
      apply( plugin, null, args );
    }

    installed.add( plugin );

    return Hu;
  }

  assign( Hu, {
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

  // ------

  Reflect.defineProperty( window, 'customName', {
    get: () => `custom-element-${ ZenJS.guid }`
  });

  // ------

  window.triggerEvent = function( target, type, process ){
    /**
     * 创建事件对象
     */
    const event = document.createEvent('HTMLEvents');

    // 如果想设置 initEvent 方法的 bubbles, cancelable 参数
    // 可以将 type 替换为数组
    // 数组内依次是 type, bubbles, cancelable
    if( !Array.isArray( type ) ){
      type = [ type, true, true ];
    }

    // 初始化事件对象
    event.initEvent( ...type );

    // 可传入方法对事件对象做其它处理
    if( process ) process( event, target );

    // 触发事件
    target.dispatchEvent( event );
  };

  // ------

  window.stripExpressionMarkers = html => {
    return html.replace( /<!---->/g, '' );
  };

  // ------

  {
    const templateResult = Hu.html`<!--${ null }-->`;
    const template = templateResult.getTemplateElement();

    window.templateMarker = template.content.firstChild.data.trim();
  }

  // ------

  {
    const error = console.error;

    window.watchError = function( fn, msg ){
      const msgs = [];

      console.error = msg => {
        msgs.push( msg );
      };

      fn();

      console.error = error;

      if( Array.isArray( msg ) ){
        return expect( msgs ).is.deep.equals( msg );
      }else{
        return expect( msgs[0] ).is.equals( msg );
      }
    };
  }

  // ------

  {
    let supportsPassive = false;

    try{
      
      const options = {};

      Reflect.defineProperty( options, 'passive', {
        get: () => {
          return supportsPassive = true;
        }
      });

      window.addEventListener( 'test-passive', null, options );

    }catch( error ){
      
    }

    window.supportsPassive = supportsPassive;
  }

  // ------

  {
    let supportsForInTriggerProxyOwnKeys = false;

    const proxyObj = new Proxy({}, {
      ownKeys(){
        supportsForInTriggerProxyOwnKeys = true;
        return [];
      }
    });

    for( let item in proxyObj );

    window.supportsForInTriggerProxyOwnKeys = supportsForInTriggerProxyOwnKeys;
  }

  // ------

  describe( 'options.props', () => {

    it( '使用数组的方式定义 props', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: [ 'a', 'b' ]
      });

      const div = document.createElement('div').$html(`<${ customName } a="3"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );

      chai.expect( hu.a ).is.equals( '3' );
      chai.expect( hu.b ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( '3' );
      chai.expect( hu.$props.b ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: null,
          b: null
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="3"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );

      chai.expect( hu.a ).is.equals( '3' );
      chai.expect( hu.b ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( '3' );
      chai.expect( hu.$props.b ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为 String ( 写法一 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: String,
          b: String,
          c: String
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( '5' );
      chai.expect( hu.b ).is.equals( '' );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( '5' );
      chai.expect( hu.$props.b ).is.equals( '' );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为 String ( 写法二 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            type: String
          },
          b: {
            type: String
          },
          c: {
            type: String
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( '5' );
      chai.expect( hu.b ).is.equals( '' );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( '5' );
      chai.expect( hu.$props.b ).is.equals( '' );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为 String ( 写法三 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            type: {
              from: String
            }
          },
          b: {
            type: {
              from: String
            }
          },
          c: {
            type: {
              from: String
            }
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( '5' );
      chai.expect( hu.b ).is.equals( '' );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( '5' );
      chai.expect( hu.$props.b ).is.equals( '' );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为 Boolean ( 写法一 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: Boolean,
          b: Boolean,
          c: Boolean
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( true );
      chai.expect( hu.b ).is.equals( true );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( true );
      chai.expect( hu.$props.b ).is.equals( true );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为 Boolean ( 写法二 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            type: Boolean
          },
          b: {
            type: Boolean
          },
          c: {
            type: Boolean
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( true );
      chai.expect( hu.b ).is.equals( true );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( true );
      chai.expect( hu.$props.b ).is.equals( true );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为 Boolean ( 写法三 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            type: {
              from: Boolean
            }
          },
          b: {
            type: {
              from: Boolean
            }
          },
          c: {
            type: {
              from: Boolean
            }
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( true );
      chai.expect( hu.b ).is.equals( true );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( true );
      chai.expect( hu.$props.b ).is.equals( true );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为 Number ( 写法一 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: Number,
          b: Number,
          c: Number
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( 5 );
      chai.expect( hu.b ).is.equals( 0 );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( 5 );
      chai.expect( hu.$props.b ).is.equals( 0 );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为 Number ( 写法二 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            type: Number
          },
          b: {
            type: Number
          },
          c: {
            type: Number
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( 5 );
      chai.expect( hu.b ).is.equals( 0 );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( 5 );
      chai.expect( hu.$props.b ).is.equals( 0 );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为 Number ( 写法三 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            type: {
              from: Number
            }
          },
          b: {
            type: {
              from: Number
            }
          },
          c: {
            type: {
              from: Number
            }
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( 5 );
      chai.expect( hu.b ).is.equals( 0 );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( 5 );
      chai.expect( hu.$props.b ).is.equals( 0 );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为自定义的方法 ( 写法一 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: value => Number( value ) + 1,
          b: value => Number( value ) + 1,
          c: value => Number( value ) + 1
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( 6 );
      chai.expect( hu.b ).is.equals( 1 );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( 6 );
      chai.expect( hu.$props.b ).is.equals( 1 );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为自定义的方法 ( 写法二 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            type: value => Number( value ) + 1
          },
          b: {
            type: value => Number( value ) + 1
          },
          c: {
            type: value => Number( value ) + 1
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( 6 );
      chai.expect( hu.b ).is.equals( 1 );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( 6 );
      chai.expect( hu.$props.b ).is.equals( 1 );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为自定义的方法 ( 写法二 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            type: {
              from: value => Number( value ) + 1
            }
          },
          b: {
            type: {
              from: value => Number( value ) + 1
            }
          },
          c: {
            type: {
              from: value => Number( value ) + 1
            }
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="5" b></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu.a ).is.equals( 6 );
      chai.expect( hu.b ).is.equals( 1 );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.$props.a ).is.equals( 6 );
      chai.expect( hu.$props.b ).is.equals( 1 );
      chai.expect( hu.$props.c ).is.equals( undefined );
    });

    it( '使用对象的方式定义 props 且设置 prop 的默认值为非引用类型', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            default: 123
          },
          b: {
            default: '123'
          },
          c: {
            default: false
          },
          d: {
            default: true
          },
          e: {
            default: null
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu ).has.property( 'd' );
      chai.expect( hu ).has.property( 'e' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'd' );
      chai.expect( hu.$props ).has.property( 'e' );

      chai.expect( hu.a ).is.equals( 123 );
      chai.expect( hu.b ).is.equals( '123' );
      chai.expect( hu.c ).is.equals( false );
      chai.expect( hu.d ).is.equals( true );
      chai.expect( hu.e ).is.equals( null );
      chai.expect( hu.$props.a ).is.equals( 123 );
      chai.expect( hu.$props.b ).is.equals( '123' );
      chai.expect( hu.$props.c ).is.equals( false );
      chai.expect( hu.$props.d ).is.equals( true );
      chai.expect( hu.$props.e ).is.equals( null );
    });

    it( '使用对象的方式定义 props 且设置 prop 的默认值为引用类型', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            default: [ 1, 2, 3 ]
          },
          b: {
            default: { a: 1, b: 2, c: 3 }
          },
          c: {
            default: /RegExp/
          },
          d: {
            default: () => [ 1, 2, 3 ]
          },
          e: {
            default: () => ({ a: 1, b: 2, c: 3 })
          },
          f: {
            default: () => /RegExp/
          },
          g: {
            default: () => ZenJS.noop
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu ).has.property( 'd' );
      chai.expect( hu ).has.property( 'e' );
      chai.expect( hu ).has.property( 'f' );
      chai.expect( hu ).has.property( 'g' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'd' );
      chai.expect( hu.$props ).has.property( 'e' );
      chai.expect( hu.$props ).has.property( 'f' );
      chai.expect( hu.$props ).has.property( 'g' );

      chai.expect( hu.a ).is.equals( undefined );
      chai.expect( hu.b ).is.equals( undefined );
      chai.expect( hu.c ).is.equals( undefined );
      chai.expect( hu.d ).is.deep.equals( [ 1, 2, 3 ] );
      chai.expect( hu.e ).is.deep.equals( { a: 1, b: 2, c: 3 } );
      chai.expect( hu.f ).is.deep.equals( /RegExp/ );
      chai.expect( hu.g ).is.equals( ZenJS.noop );
      chai.expect( hu.$props.a ).is.equals( undefined );
      chai.expect( hu.$props.b ).is.equals( undefined );
      chai.expect( hu.$props.c ).is.equals( undefined );
      chai.expect( hu.$props.d ).is.deep.equals( [ 1, 2, 3 ] );
      chai.expect( hu.$props.e ).is.deep.equals( { a: 1, b: 2, c: 3 } );
      chai.expect( hu.$props.f ).is.deep.equals( /RegExp/ );
      chai.expect( hu.$props.g ).is.equals( ZenJS.noop );
    });

    it( '使用对象的方式定义 props 且设置 prop 的默认值, 在已传递了值时, 默认值不起效', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a1:  { default: 'a1', type: String },
          a2:  { default: 'a2', type: String },
          a3:  { default: 'a3', type: String },
          a4:  { default: 'a4', type: Boolean },
          a5:  { default: 'a5', type: Boolean },
          a6:  { default: 'a6', type: Boolean },
          a7:  { default: 'a7', type: Number },
          a8:  { default: 'a8', type: Number },
          a9:  { default: 'a9', type: Number },
          b1:  { default: 'c1', type: String },
          b2:  { default: 'c2', type: String },
          b3:  { default: 'c3', type: String },
          b4:  { default: 'c4', type: Boolean },
          b5:  { default: 'c5', type: Boolean },
          b6:  { default: 'c6', type: Boolean },
          b7:  { default: 'c7', type: Number },
          b8:  { default: 'c8', type: Number },
          b9:  { default: 'c9', type: Number }
        }
      });

      const div = document.createElement('div').$html(`
      <${ customName }
        a1 a2="" a3="b3"
        a4 a5="" a6="b5"
        a7 a8="" a9="9"
      >
      </${ customName }>
    `);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a1' );
      chai.expect( hu ).has.property( 'a2' );
      chai.expect( hu ).has.property( 'a3' );
      chai.expect( hu ).has.property( 'a4' );
      chai.expect( hu ).has.property( 'a5' );
      chai.expect( hu ).has.property( 'a6' );
      chai.expect( hu ).has.property( 'a7' );
      chai.expect( hu ).has.property( 'a8' );
      chai.expect( hu ).has.property( 'a9' );
      chai.expect( hu ).has.property( 'b1' );
      chai.expect( hu ).has.property( 'b2' );
      chai.expect( hu ).has.property( 'b3' );
      chai.expect( hu ).has.property( 'b4' );
      chai.expect( hu ).has.property( 'b5' );
      chai.expect( hu ).has.property( 'b6' );
      chai.expect( hu ).has.property( 'b7' );
      chai.expect( hu ).has.property( 'b8' );
      chai.expect( hu ).has.property( 'b9' );
      chai.expect( hu.$props ).has.property( 'a1' );
      chai.expect( hu.$props ).has.property( 'a2' );
      chai.expect( hu.$props ).has.property( 'a3' );
      chai.expect( hu.$props ).has.property( 'a4' );
      chai.expect( hu.$props ).has.property( 'a5' );
      chai.expect( hu.$props ).has.property( 'a6' );
      chai.expect( hu.$props ).has.property( 'a7' );
      chai.expect( hu.$props ).has.property( 'a8' );
      chai.expect( hu.$props ).has.property( 'a9' );
      chai.expect( hu.$props ).has.property( 'b1' );
      chai.expect( hu.$props ).has.property( 'b2' );
      chai.expect( hu.$props ).has.property( 'b3' );
      chai.expect( hu.$props ).has.property( 'b4' );
      chai.expect( hu.$props ).has.property( 'b5' );
      chai.expect( hu.$props ).has.property( 'b6' );
      chai.expect( hu.$props ).has.property( 'b7' );
      chai.expect( hu.$props ).has.property( 'b8' );
      chai.expect( hu.$props ).has.property( 'b9' );

      chai.expect( hu.a1 ).is.equals( '' );
      chai.expect( hu.a2 ).is.equals( '' );
      chai.expect( hu.a3 ).is.equals( 'b3' );
      chai.expect( hu.a4 ).is.equals( true );
      chai.expect( hu.a5 ).is.equals( true );
      chai.expect( hu.a6 ).is.equals( true );
      chai.expect( hu.a7 ).is.equals( 0 );
      chai.expect( hu.a8 ).is.equals( 0 );
      chai.expect( hu.a9 ).is.equals( 9 );
      chai.expect( hu.b1 ).is.equals( 'c1' );
      chai.expect( hu.b2 ).is.equals( 'c2' );
      chai.expect( hu.b3 ).is.equals( 'c3' );
      chai.expect( hu.b4 ).is.equals( 'c4' );
      chai.expect( hu.b5 ).is.equals( 'c5' );
      chai.expect( hu.b6 ).is.equals( 'c6' );
      chai.expect( hu.b7 ).is.equals( 'c7' );
      chai.expect( hu.b8 ).is.equals( 'c8' );
      chai.expect( hu.b9 ).is.equals( 'c9' );
      chai.expect( hu.$props.a1 ).is.equals( '' );
      chai.expect( hu.$props.a2 ).is.equals( '' );
      chai.expect( hu.$props.a3 ).is.equals( 'b3' );
      chai.expect( hu.$props.a4 ).is.equals( true );
      chai.expect( hu.$props.a5 ).is.equals( true );
      chai.expect( hu.$props.a6 ).is.equals( true );
      chai.expect( hu.$props.a7 ).is.equals( 0 );
      chai.expect( hu.$props.a8 ).is.equals( 0 );
      chai.expect( hu.$props.a9 ).is.equals( 9 );
      chai.expect( hu.$props.b1 ).is.equals( 'c1' );
      chai.expect( hu.$props.b2 ).is.equals( 'c2' );
      chai.expect( hu.$props.b3 ).is.equals( 'c3' );
      chai.expect( hu.$props.b4 ).is.equals( 'c4' );
      chai.expect( hu.$props.b5 ).is.equals( 'c5' );
      chai.expect( hu.$props.b6 ).is.equals( 'c6' );
      chai.expect( hu.$props.b7 ).is.equals( 'c7' );
      chai.expect( hu.$props.b8 ).is.equals( 'c8' );
      chai.expect( hu.$props.b9 ).is.equals( 'c9' );
    });

    it( '使用对象的方式定义 props 且设置 prop 的默认值时使用方法返回默认值时, 方法的 this 指向的是当前实例', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            default(){
              return this;
            }
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } b="3"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'a' );

      chai.expect( hu.a ).is.equals( hu );
      chai.expect( hu.$props.a ).is.equals( hu );
    });

    it( '使用对象的方式定义 props 且设置 prop 的来源属性时会从相应的 attribute 属性中取值', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: { attr: 'b' },
          b: { attr: 'a' },
          c: null,
          aA: { attr: 'a-B' },
          aB: { attr: 'a-a' },
          aC: null
        }
      });

      const div = document.createElement('div').$html(`
      <${ customName } a="1" b="2" c="3" a-a="4" a-b="5" a-c="6"></${ customName }>
    `);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu ).has.property( 'aA' );
      chai.expect( hu ).has.property( 'aB' );
      chai.expect( hu ).has.property( 'aC' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( 'aA' );
      chai.expect( hu.$props ).has.property( 'aB' );
      chai.expect( hu.$props ).has.property( 'aC' );

      chai.expect( hu.a ).is.equals( '2' );
      chai.expect( hu.b ).is.equals( '1' );
      chai.expect( hu.c ).is.equals( '3' );
      chai.expect( hu.aA ).is.equals( '5' );
      chai.expect( hu.aB ).is.equals( '4' );
      chai.expect( hu.aC ).is.equals( '6' );
      chai.expect( hu.$props.a ).is.equals( '2' );
      chai.expect( hu.$props.b ).is.equals( '1' );
      chai.expect( hu.$props.c ).is.equals( '3' );
      chai.expect( hu.$props.aA ).is.equals( '5' );
      chai.expect( hu.$props.aB ).is.equals( '4' );
      chai.expect( hu.$props.aC ).is.equals( '6' );
    });

    it( '使用数组的方式定义 props 且设置 prop 的来源属性时会将大写名称转为以连字符连接的小写名称', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: [ 'a', 'aB', 'a-c' ]
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" a-b="2" a-c="3"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'aB' );
      chai.expect( hu ).has.property( 'a-c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'aB' );
      chai.expect( hu.$props ).has.property( 'a-c' );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[ 'aB' ] ).is.equals( '2' );
      chai.expect( hu[ 'a-c' ] ).is.equals( '3' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[ 'aB' ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a-c' ] ).is.equals( '3' );
    });

    it( '使用对象的方式定义 props 且设置 prop 的来源属性时会将大写名称转为以连字符连接的小写名称', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: null,
          'aB': null,
          'a-c': null
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" a-b="2" a-c="3"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'aB' );
      chai.expect( hu ).has.property( 'a-c' );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'aB' );
      chai.expect( hu.$props ).has.property( 'a-c' );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[ 'aB' ] ).is.equals( '2' );
      chai.expect( hu[ 'a-c' ] ).is.equals( '3' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[ 'aB' ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a-c' ] ).is.equals( '3' );
    });

    it( '使用对象的方式定义 props 且 prop 是 Symbol 类型时可以设置默认值属性进行赋值', () => {
      const customName = window.customName;
      const a = Symbol('a');
      const b = Symbol('b');

      Hu.define( customName, {
        props: {
          [ a ]: { default: 'c' },
          [ b ]: { default: 'd' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( a );
      chai.expect( hu ).has.property( b );
      chai.expect( hu.$props ).has.property( a );
      chai.expect( hu.$props ).has.property( b );

      chai.expect( hu[ a ] ).is.equals( 'c' );
      chai.expect( hu[ b ] ).is.equals( 'd' );
      chai.expect( hu.$props[ a ] ).is.equals( 'c' );
      chai.expect( hu.$props[ b ] ).is.equals( 'd' );
    });

    it( '使用对象的方式定义 props 且 prop 是 Symbol 类型时可以设置来源属性从相应的 attribute 属性中取值', () => {
      const customName = window.customName;
      const a = Symbol('a');
      const b = Symbol('b');

      Hu.define( customName, {
        props: {
          [ a ]: { attr: 'c' },
          [ b ]: { attr: 'd' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } c="e" d="f"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( a );
      chai.expect( hu ).has.property( b );
      chai.expect( hu.$props ).has.property( a );
      chai.expect( hu.$props ).has.property( b );

      chai.expect( hu[ a ] ).is.equals( 'e' );
      chai.expect( hu[ b ] ).is.equals( 'f' );
      chai.expect( hu.$props[ a ] ).is.equals( 'e' );
      chai.expect( hu.$props[ b ] ).is.equals( 'f' );
    });

    it( '使用对象的方式定义 props 时可以使用来源属性将多个 prop 绑定到同一个 attribute 上', () => {
      const customName = window.customName;
      const a = Symbol('d');

      Hu.define( customName, {
        props: {
          [ a ]: { attr: 'a' },
          a: null,
          b: { attr: 'a' },
          c: { attr: 'a', type: Number }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( a );
      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu ).has.property( 'c' );
      chai.expect( hu.$props ).has.property( a );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'b' );
      chai.expect( hu.$props ).has.property( 'c' );

      chai.expect( hu[ a ] ).is.equals( '1' );
      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[ 'b' ] ).is.equals( '1' );
      chai.expect( hu[ 'c' ] ).is.equals( 1 );
      chai.expect( hu.$props[ a ] ).is.equals( '1' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[ 'b' ] ).is.equals( '1' );
      chai.expect( hu.$props[ 'c' ] ).is.equals( 1 );

      custom.setAttribute( 'a', '2' );
      chai.expect( hu[ a ] ).is.equals( '2' );
      chai.expect( hu[ 'a' ] ).is.equals( '2' );
      chai.expect( hu[ 'b' ] ).is.equals( '2' );
      chai.expect( hu[ 'c' ] ).is.equals( 2 );
      chai.expect( hu.$props[ a ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'b' ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'c' ] ).is.equals( 2 );
    });

    it( '实例的 prop 对应的 attribute 属性值被更改时, 会立即将改变同步到实例中', () => {
      const customName = window.customName;
      const aE = Symbol('aE');

      Hu.define( customName, {
        props: {
          a: null,
          aB: { attr: 'b' },
          aC: { attr: 'a-d' },
          aD: { attr: 'a-c' },
          [ aE ]: { attr: 'a-e' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2" a-c="4" a-d="3" a-e="5"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property( 'aB' );
      chai.expect( hu ).has.property( 'aC' );
      chai.expect( hu ).has.property( 'aD' );
      chai.expect( hu ).has.property( aE );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'aB' );
      chai.expect( hu.$props ).has.property( 'aC' );
      chai.expect( hu.$props ).has.property( 'aD' );
      chai.expect( hu.$props ).has.property( aE );

      chai.expect( hu.a ).is.equals( '1' );
      chai.expect( hu.aB ).is.equals( '2' );
      chai.expect( hu.aC ).is.equals( '3' );
      chai.expect( hu.aD ).is.equals( '4' );
      chai.expect( hu[ aE ] ).is.equals( '5' );
      chai.expect( hu.$props.a ).is.equals( '1' );
      chai.expect( hu.$props.aB ).is.equals( '2' );
      chai.expect( hu.$props.aC ).is.equals( '3' );
      chai.expect( hu.$props.aD ).is.equals( '4' );
      chai.expect( hu.$props[ aE ] ).is.equals( '5' );

      custom.setAttribute( 'a', '11' );
      chai.expect( hu.a ).is.equals( '11' );
      chai.expect( hu.aB ).is.equals( '2' );
      chai.expect( hu.aC ).is.equals( '3' );
      chai.expect( hu.aD ).is.equals( '4' );
      chai.expect( hu[ aE ] ).is.equals( '5' );
      chai.expect( hu.$props.a ).is.equals( '11' );
      chai.expect( hu.$props.aB ).is.equals( '2' );
      chai.expect( hu.$props.aC ).is.equals( '3' );
      chai.expect( hu.$props.aD ).is.equals( '4' );
      chai.expect( hu.$props[ aE ] ).is.equals( '5' );

      custom.setAttribute( 'b', '22' );
      chai.expect( hu.a ).is.equals( '11' );
      chai.expect( hu.aB ).is.equals( '22' );
      chai.expect( hu.aC ).is.equals( '3' );
      chai.expect( hu.aD ).is.equals( '4' );
      chai.expect( hu[ aE ] ).is.equals( '5' );
      chai.expect( hu.$props.a ).is.equals( '11' );
      chai.expect( hu.$props.aB ).is.equals( '22' );
      chai.expect( hu.$props.aC ).is.equals( '3' );
      chai.expect( hu.$props.aD ).is.equals( '4' );
      chai.expect( hu.$props[ aE ] ).is.equals( '5' );

      custom.setAttribute( 'a-c', '44' );
      chai.expect( hu.a ).is.equals( '11' );
      chai.expect( hu.aB ).is.equals( '22' );
      chai.expect( hu.aC ).is.equals( '3' );
      chai.expect( hu.aD ).is.equals( '44' );
      chai.expect( hu[ aE ] ).is.equals( '5' );
      chai.expect( hu.$props.a ).is.equals( '11' );
      chai.expect( hu.$props.aB ).is.equals( '22' );
      chai.expect( hu.$props.aC ).is.equals( '3' );
      chai.expect( hu.$props.aD ).is.equals( '44' );
      chai.expect( hu.$props[ aE ] ).is.equals( '5' );

      custom.setAttribute( 'a-d', '33' );
      chai.expect( hu.a ).is.equals( '11' );
      chai.expect( hu.aB ).is.equals( '22' );
      chai.expect( hu.aC ).is.equals( '33' );
      chai.expect( hu.aD ).is.equals( '44' );
      chai.expect( hu[ aE ] ).is.equals( '5' );
      chai.expect( hu.$props.a ).is.equals( '11' );
      chai.expect( hu.$props.aB ).is.equals( '22' );
      chai.expect( hu.$props.aC ).is.equals( '33' );
      chai.expect( hu.$props.aD ).is.equals( '44' );
      chai.expect( hu.$props[ aE ] ).is.equals( '5' );

      custom.setAttribute( 'a-e', '55' );
      chai.expect( hu.a ).is.equals( '11' );
      chai.expect( hu.aB ).is.equals( '22' );
      chai.expect( hu.aC ).is.equals( '33' );
      chai.expect( hu.aD ).is.equals( '44' );
      chai.expect( hu[ aE ] ).is.equals( '55' );
      chai.expect( hu.$props.a ).is.equals( '11' );
      chai.expect( hu.$props.aB ).is.equals( '22' );
      chai.expect( hu.$props.aC ).is.equals( '33' );
      chai.expect( hu.$props.aD ).is.equals( '44' );
      chai.expect( hu.$props[ aE ] ).is.equals( '55' );
    });

    it( '使用对象的方式定义 props 且设置 prop 的类型为 Boolean 且默认值为 true, 传入字符串 false 时实例应该解析为布尔值 false', () => {
      const customName = window.customName;

      Hu.define( customName, {
        props: {
          a: {
            type: {
              from: Boolean,
              default: true
            }
          }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="false"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu.$props ).has.property( 'a' );

      chai.expect( hu.a ).is.equals( false );
      chai.expect( hu.$props.a ).is.equals( false );

      // ------

      const div2 = document.createElement('div').$html(`<${ customName } a="true"></${ customName }>`);
      const custom2 = div2.firstElementChild;
      const hu2 = custom2.$hu;

      chai.expect( hu2 ).has.property( 'a' );
      chai.expect( hu2.$props ).has.property( 'a' );

      chai.expect( hu2.a ).is.equals( true );
      chai.expect( hu2.$props.a ).is.equals( true );
    });

    it('------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------');

    it( '实例化后所定义的 props 会全部添加到 $props 实例属性中', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        props: {
          a: null,
          [ b ]: { attr: 'b' },
          $c: { attr: 'c' },
          _d: { attr: 'd' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2" c="3" d="4"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property(  b  );
      chai.expect( hu.$props ).has.property( '$c' );
      chai.expect( hu.$props ).has.property( '_d' );

      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );
      chai.expect( hu.$props[ '$c' ] ).is.equals( '3' );
      chai.expect( hu.$props[ '_d' ] ).is.equals( '4' );
    });

    it( '实例化后会在实例本身添加 $props 下所有首字母不为 $ 的 prop 的映射', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        props: {
          a: null,
          [ b ]: { attr: 'b' },
          $c: { attr: 'c' },
          _d: { attr: 'd' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2" c="3" d="4"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu ).has.not.property(  '$c'  );
      chai.expect( hu ).has.property( '_d' );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu[ '_d' ] ).is.equals( '4' );
    });

    it( '实例化后会在自定义元素本身添加 $props 下所有首字母不为 $ 和 _ 的 prop 的映射', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        props: {
          a: null,
          [ b ]: { attr: 'b' },
          $c: { attr: 'c' },
          _d: { attr: 'd' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2" c="3" d="4"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom ).has.not.property(  '$c'  );
      chai.expect( custom ).has.not.property( '_d' );

      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
    });

    it( '实例化后若删除在实例本身添加的 prop 的映射, 不会影响到 $props 实例属性内的 prop 本体', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        props: {
          a: null,
          [ b ]: { attr: 'b' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );

      delete hu[ 'a' ];
      delete hu[  b  ];

      chai.expect( hu ).has.not.property( 'a' );
      chai.expect( hu ).has.not.property(  b  );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( undefined );
      chai.expect( hu[  b  ] ).is.equals( undefined );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );
    });

    it( '实例化后若删除在自定义元素本身添加的 prop 的映射, 不会影响到 $props 实例属性内的 prop 本体', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        props: {
          a: null,
          [ b ]: { attr: 'b' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );

      delete custom[ 'a' ];
      delete custom[  b  ];

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( custom ).has.not.property( 'a' );
      chai.expect( custom ).has.not.property(  b  );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( undefined );
      chai.expect( custom[  b  ] ).is.equals( undefined );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );
    });

    it( '实例化后可以通过实例本身对 prop 进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        props: {
          a: null,
          [ b ]: { attr: 'b' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );

      hu[ 'a' ] = 3;
      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );

      hu[  b  ] = 4;
      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( 4 );
      chai.expect( hu.$props[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$props[  b  ] ).is.equals( 4 );
    });

    it( '实例化后可以通过自定义元素本身对 prop 进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        props: {
          a: null,
          [ b ]: { attr: 'b' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );

      hu[ 'a' ] = 3;
      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( 3 );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );

      hu[  b  ] = 4;
      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( 4 );
      chai.expect( custom[ 'a' ] ).is.equals( 3 );
      chai.expect( custom[  b  ] ).is.equals( 4 );
      chai.expect( hu.$props[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$props[  b  ] ).is.equals( 4 );
    });

    it( '实例化后可以通过 $props 实例属性对 prop 进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        props: {
          a: null,
          [ b ]: { attr: 'b' }
        }
      });

      const div = document.createElement('div').$html(`<${ customName } a="1" b="2"></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( hu.$props ).has.property( 'a' );
      chai.expect( hu.$props ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );

      hu.$props[ 'a' ] = 3;
      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( 3 );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$props[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$props[  b  ] ).is.equals( '2' );

      hu.$props[  b  ] = 4;
      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( 4 );
      chai.expect( custom[ 'a' ] ).is.equals( 3 );
      chai.expect( custom[  b  ] ).is.equals( 4 );
      chai.expect( hu.$props[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$props[  b  ] ).is.equals( 4 );
    });

  });

  describe( 'options.data', () => {

    it( '定义自定义元素实例时, data 选项必须是 function 类型', () => {
      const customName = window.customName;

      Hu.define( customName, {
        data: () => ({
          a: 1
        })
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu.$data ).has.property( 'a' );

      chai.expect( hu.a ).is.equals( 1 );
      chai.expect( hu.$data.a ).is.equals( 1 );
    });

    it( '定义自定义元素实例时, data 选项若不是 function 类型将会被忽略', () => {
      const customName = window.customName;

      Hu.define( customName, {
        data: {
          a: 1
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.not.property( 'a' );
      chai.expect( hu.$data ).has.not.property( 'a' );
    });

    it( '使用 new 创建实例时, data 选项可以是 function 类型', () => {
      const hu = new Hu({
        data: () => ({
          a: 1
        })
      });

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu.$data ).has.property( 'a' );

      chai.expect( hu.a ).is.equals( 1 );
      chai.expect( hu.$data.a ).is.equals( 1 );
    });

    it( '使用 new 创建实例时, data 选项可以是 JSON', () => {
      const hu = new Hu({
        data: {
          a: 1
        }
      });

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu.$data ).has.property( 'a' );

      chai.expect( hu.a ).is.equals( 1 );
      chai.expect( hu.$data.a ).is.equals( 1 );
    });

    it( '定义 data 选项时若是 function 类型, 方法执行时的 this 指向是当前实例 ( 一 )', () => {
      const customName = window.customName;

      Hu.define( customName, {
        data: function(){
          return {
            self: this
          };
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'self' );
      chai.expect( hu.$data ).has.property( 'self' );

      chai.expect( hu.self ).is.equals( hu );
      chai.expect( hu.$data.self ).is.equals( hu );
    });

    it( '定义 data 选项时若是 function 类型, 方法执行时的 this 指向是当前实例 ( 二 )', () => {
      const hu = new Hu({
        data: function(){
          return {
            self: this
          };
        }
      });

      chai.expect( hu ).has.property( 'self' );
      chai.expect( hu.$data ).has.property( 'self' );

      chai.expect( hu.self ).is.equals( hu );
      chai.expect( hu.$data.self ).is.equals( hu );
    });

    it('------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------');

    it( '实例化后所定义的 data 会全部添加到 $data 实例属性中', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        data: () => ({
          a: '1',
          [ b ]: '2',
          $c: '3',
          _d: '4'
        })
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu.$data ).has.property( 'a' );
      chai.expect( hu.$data ).has.property(  b  );
      chai.expect( hu.$data ).has.property(  '$c'  );
      chai.expect( hu.$data ).has.property(  '_d'  );

      chai.expect( hu.$data[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$data[  b  ] ).is.equals( '2' );
      chai.expect( hu.$data[ '$c' ] ).is.equals( '3' );
      chai.expect( hu.$data[ '_d' ] ).is.equals( '4' );
    });

    it( '实例化后会在实例本身添加 $data 下所有首字母不为 $ 的属性的映射', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        data: () => ({
          a: '1',
          [ b ]: '2',
          $c: '3',
          _d: '4'
        })
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu ).has.not.property( '$c' );
      chai.expect( hu ).has.property( '_d' );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu[ '_d' ] ).is.equals( '4' );
    });

    it( '实例化后会在自定义元素本身添加 $data 下所有首字母不为 $ 和 _ 的属性的映射', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        data: () => ({
          a: '1',
          [ b ]: '2',
          $c: '3',
          _d: '4'
        })
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;

      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom ).has.not.property( '$c' );
      chai.expect( custom ).has.not.property( '_d' );

      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
    });

    it( '实例化后若删除在实例本身添加的 $data 的属性的映射, 不会影响到 $data 的属性本体', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        data: () => ({
          a: '1',
          [ b ]: '2'
        })
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu.$data ).has.property( 'a' );
      chai.expect( hu.$data ).has.property(  b  );

      delete hu[ 'a' ];
      delete hu[  b  ];

      chai.expect( hu[ 'a' ] ).is.equals( undefined );
      chai.expect( hu[  b  ] ).is.equals( undefined );
      chai.expect( hu.$data[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$data[  b  ] ).is.equals( '2' );
    });

    it( '实例化后若删除在自定义元素本身添加的 $data 的属性的映射, 不会影响到 $data 的属性本体', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        data: () => ({
          a: '1',
          [ b ]: '2'
        })
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( hu.$data ).has.property( 'a' );
      chai.expect( hu.$data ).has.property(  b  );

      delete custom[ 'a' ];
      delete custom[  b  ];

      chai.expect( custom[ 'a' ] ).is.equals( undefined );
      chai.expect( custom[  b  ] ).is.equals( undefined );
      chai.expect( hu.$data[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$data[  b  ] ).is.equals( '2' );
    });

    it( '实例化后可以通过实例本身对 $data 的属性进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        data: () => ({
          a: '1',
          [ b ]: '2'
        })
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$data[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$data[  b  ] ).is.equals( '2' );

      hu[ 'a' ] = 3;

      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$data[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$data[  b  ] ).is.equals( '2' );

      hu[ b ] = 4;

      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( 4 );
      chai.expect( hu.$data[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$data[  b  ] ).is.equals( 4 );
    });

    it( '实例化后可以通过自定义元素本身对 $data 的属性进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        data: () => ({
          a: '1',
          [ b ]: '2'
        })
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$data[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$data[  b  ] ).is.equals( '2' );

      hu[ 'a' ] = 3;

      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$data[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$data[  b  ] ).is.equals( '2' );

      hu[ b ] = 4;

      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( 4 );
      chai.expect( hu.$data[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$data[  b  ] ).is.equals( 4 );
    });

    it( '实例化后可以通过 $data 实例属性对 data 的属性进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        data: () => ({
          a: '1',
          [ b ]: '2'
        })
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu.$data ).has.property( 'a' );
      chai.expect( hu.$data ).has.property(  b  );

      chai.expect( hu.$data[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$data[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );

      hu.$data[ 'a' ] = 3;

      chai.expect( hu.$data[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$data[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( 3 );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( '2' );

      hu.$data[ b ] = 4;

      chai.expect( hu.$data[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$data[  b  ] ).is.equals( 4 );
      chai.expect( custom[ 'a' ] ).is.equals( 3 );
      chai.expect( custom[  b  ] ).is.equals( 4 );
      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( 4 );
    });

  });

  describe( 'options.computed', () => {

    it( '使用方法类型定义计算属性', () => {
      const hu = new Hu({
        computed: {
          a: () => 1
        }
      });

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu.$computed ).has.property( 'a' );

      chai.expect( hu.a ).is.equals( 1 );
      chai.expect( hu.$computed.a ).is.equals( 1 );
    });

    it( '使用方法类型定义计算属性 ( Vue )', () => {
      const vm = new Vue({
        computed: {
          a: () => 1
        }
      });

      chai.expect( vm ).has.property( 'a' );
      // expect( vm.$computed ).has.property( 'a' );

      chai.expect( vm.a ).is.equals( 1 );
      // expect( vm.$computed.a ).is.equals( 1 );
    });

    it( '使用对象类型定义计算属性的 getter 与 setter 方法', () => {
      const hu = new Hu({
        data: () => ({
          a: 1
        }),
        computed: {
          b: {
            set( value ){
              this.a = value;
            },
            get(){
              return this.a * 2;
            }
          }
        }
      });

      chai.expect( hu ).has.property( 'b' );
      chai.expect( hu.$computed ).has.property( 'b' );

      chai.expect( hu.a ).is.equals( 1 );
      chai.expect( hu.b ).is.equals( 2 );
      chai.expect( hu.$computed.b ).is.equals( 2 );

      hu.a = 2;
      chai.expect( hu.a ).is.equals( 2 );
      chai.expect( hu.b ).is.equals( 4 );
      chai.expect( hu.$computed.b ).is.equals( 4 );

      hu.a = 3;
      chai.expect( hu.a ).is.equals( 3 );
      chai.expect( hu.b ).is.equals( 6 );
      chai.expect( hu.$computed.b ).is.equals( 6 );

      hu.b = 4;
      chai.expect( hu.a ).is.equals( 4 );
      chai.expect( hu.b ).is.equals( 8 );
      chai.expect( hu.$computed.b ).is.equals( 8 );

      hu.b = 5;
      chai.expect( hu.a ).is.equals( 5 );
      chai.expect( hu.b ).is.equals( 10 );
      chai.expect( hu.$computed.b ).is.equals( 10 );
    });

    it( '使用对象类型定义计算属性的 getter 与 setter 方法 ( Vue )', () => {
      const vm = new Vue({
        data: () => ({
          a: 1
        }),
        computed: {
          b: {
            set( value ){
              this.a = value;
            },
            get(){
              return this.a * 2;
            }
          }
        }
      });

      chai.expect( vm ).has.property( 'b' );
      // expect( vm.$computed ).has.property( 'b' );

      chai.expect( vm.a ).is.equals( 1 );
      chai.expect( vm.b ).is.equals( 2 );
      // expect( vm.$computed.b ).is.equals( 2 );

      vm.a = 2;
      chai.expect( vm.a ).is.equals( 2 );
      chai.expect( vm.b ).is.equals( 4 );
      // expect( vm.$computed.b ).is.equals( 4 );

      vm.a = 3;
      chai.expect( vm.a ).is.equals( 3 );
      chai.expect( vm.b ).is.equals( 6 );
      // expect( vm.$computed.b ).is.equals( 6 );

      vm.b = 4;
      chai.expect( vm.a ).is.equals( 4 );
      chai.expect( vm.b ).is.equals( 8 );
      // expect( vm.$computed.b ).is.equals( 8 );

      vm.b = 5;
      chai.expect( vm.a ).is.equals( 5 );
      chai.expect( vm.b ).is.equals( 10 );
      // expect( vm.$computed.b ).is.equals( 10 );
    });

    it( '计算属性的首个参数会是当前实例对象', () => {
      const hu = new Hu({
        computed: {
          a: hu => hu
        }
      });

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu.$computed ).has.property( 'a' );

      chai.expect( hu.a ).is.equals( hu );
      chai.expect( hu.$computed.a ).is.equals( hu );
    });

    it( '计算属性的首个参数会是当前实例对象 ( Vue )', () => {
      const vm = new Vue({
        computed: {
          a: vm => vm
        }
      });

      chai.expect( vm ).has.property( 'a' );
      // expect( vm.$computed ).has.property( 'a' );

      chai.expect( vm.a ).is.equals( vm );
      // expect( vm.$computed.a ).is.equals( vm );
    });

    it( '计算属性未被访问时, 将不会自动运行', () => {
      let isComputedGet = false;
      const hu = new Hu({
        computed: {
          a: () => isComputedGet = true
        }
      });

      chai.expect( isComputedGet ).is.false;

      hu.a;

      chai.expect( isComputedGet ).is.true;
    });

    it( '计算属性未被访问时, 将不会自动运行 ( Vue )', () => {
      let isComputedGet = false;
      const vm = new Vue({
        computed: {
          a: () => isComputedGet = true
        }
      });

      chai.expect( isComputedGet ).is.false;

      vm.a;

      chai.expect( isComputedGet ).is.true;
    });

    it( '计算属性运行时会进行依赖收集并缓存值, 若依赖未更新, 那么再进行访问时会直接读取缓存', () => {
      let index = 0;
      const hu = new Hu({
        data: {
          a: 1,
          b: 2
        },
        computed: {
          c(){
            index++;
            return this.a + this.b;
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.c;
      chai.expect( index ).is.equals( 1 );

      hu.c;
      chai.expect( index ).is.equals( 1 );

      hu.c;
      chai.expect( index ).is.equals( 1 );
    });

    it( '计算属性运行时会进行依赖收集并缓存值, 若依赖未更新, 那么再进行访问时会直接读取缓存 ( Vue )', () => {
      let index = 0;
      const vm = new Vue({
        data: {
          a: 1,
          b: 2
        },
        computed: {
          c(){
            index++;
            return this.a + this.b;
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      vm.c;
      chai.expect( index ).is.equals( 1 );

      vm.c;
      chai.expect( index ).is.equals( 1 );

      vm.c;
      chai.expect( index ).is.equals( 1 );
    });

    it( '计算属性运行时会进行依赖收集并缓存值, 若依赖更新, 那么在下次访问时会重新运行计算方法', () => {
      let index = 0;
      const hu = new Hu({
        data: {
          a: 1,
          b: 2
        },
        computed: {
          c(){
            index++;
            return this.a + this.b;
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.c;
      chai.expect( index ).is.equals( 1 );

      hu.c;
      chai.expect( index ).is.equals( 1 );

      hu.c;
      chai.expect( index ).is.equals( 1 );

      hu.a = 2;
      chai.expect( index ).is.equals( 1 );
      hu.c;
      chai.expect( index ).is.equals( 2 );

      hu.a = 3;
      hu.b = 3;
      chai.expect( index ).is.equals( 2 );
      hu.c;
      chai.expect( index ).is.equals( 3 );
    });

    it( '计算属性运行时会进行依赖收集并缓存值, 若依赖更新, 那么在下次访问时会重新运行计算方法 ( Vue )', () => {
      let index = 0;
      const vm = new Vue({
        data: {
          a: 1,
          b: 2
        },
        computed: {
          c(){
            index++;
            return this.a + this.b;
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      vm.c;
      chai.expect( index ).is.equals( 1 );

      vm.c;
      chai.expect( index ).is.equals( 1 );

      vm.c;
      chai.expect( index ).is.equals( 1 );

      vm.a = 2;
      chai.expect( index ).is.equals( 1 );
      vm.c;
      chai.expect( index ).is.equals( 2 );

      vm.a = 3;
      vm.b = 3;
      chai.expect( index ).is.equals( 2 );
      vm.c;
      chai.expect( index ).is.equals( 3 );
    });

    it( '计算属性不会对非观察者对象收集依赖', () => {
      let index = 0;
      const hu = new Hu({
        data: {
          a: 1
        },
        computed: {
          b(){
            return index + this.a;
          }
        }
      });

      chai.expect( hu.b ).is.equals( 1 );

      hu.a++;
      chai.expect( hu.b ).is.equals( 2 );
      
      hu.a++;
      chai.expect( hu.b ).is.equals( 3 );

      index++;
      chai.expect( hu.b ).is.equals( 3 );

      index++;
      chai.expect( hu.b ).is.equals( 3 );

      hu.a++;
      chai.expect( hu.b ).is.equals( 6 );
    });

    it( '计算属性不会对非观察者对象收集依赖 ( Vue )', () => {
      let index = 0;
      const vm = new Vue({
        data: {
          a: 1
        },
        computed: {
          b(){
            return index + this.a;
          }
        }
      });

      chai.expect( vm.b ).is.equals( 1 );

      vm.a++;
      chai.expect( vm.b ).is.equals( 2 );
      
      vm.a++;
      chai.expect( vm.b ).is.equals( 3 );

      index++;
      chai.expect( vm.b ).is.equals( 3 );

      index++;
      chai.expect( vm.b ).is.equals( 3 );

      vm.a++;
      chai.expect( vm.b ).is.equals( 6 );
    });

    it( '计算属性每次运行时都会进行依赖收集, 只会响应最新的依赖', () => {
      let index = 0;
      const hu = new Hu({
        data: {
          a: 2,
          b: 4
        },
        computed: {
          c(){
            return index++ ? this.b : this.a;
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      // 目前依赖在 a
      chai.expect( hu.c ).is.equals( 2 );
      chai.expect( index ).is.equals( 1 );

      chai.expect( hu.c ).is.equals( 2 );
      chai.expect( index ).is.equals( 1 );

      hu.a = 3;
      chai.expect( index ).is.equals( 1 );
      // 依赖被改为 b
      chai.expect( hu.c ).is.equals( 4 );
      chai.expect( index ).is.equals( 2 );

      hu.a = 5;
      chai.expect( index ).is.equals( 2 );
      chai.expect( hu.c ).is.equals( 4 );
      chai.expect( index ).is.equals( 2 );

      hu.b = 6;
      chai.expect( index ).is.equals( 2 );
      chai.expect( hu.c ).is.equals( 6 );
      chai.expect( index ).is.equals( 3 );
    });

    it( '计算属性每次运行时都会进行依赖收集, 只会响应最新的依赖 ( Vue )', () => {
      let index = 0;
      const vm = new Vue({
        data: {
          a: 2,
          b: 4
        },
        computed: {
          c(){
            return index++ ? this.b : this.a;
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      // 目前依赖在 a
      chai.expect( vm.c ).is.equals( 2 );
      chai.expect( index ).is.equals( 1 );

      chai.expect( vm.c ).is.equals( 2 );
      chai.expect( index ).is.equals( 1 );

      vm.a = 3;
      chai.expect( index ).is.equals( 1 );
      // 依赖被改为 b
      chai.expect( vm.c ).is.equals( 4 );
      chai.expect( index ).is.equals( 2 );

      vm.a = 5;
      chai.expect( index ).is.equals( 2 );
      chai.expect( vm.c ).is.equals( 4 );
      chai.expect( index ).is.equals( 2 );

      vm.b = 6;
      chai.expect( index ).is.equals( 2 );
      chai.expect( vm.c ).is.equals( 6 );
      chai.expect( index ).is.equals( 3 );
    });

    it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新, 计算属性会重新运行计算方法', ( done ) => {
      let result;
      let index = 0;
      const hu = new Hu({
        data: {
          a: 1,
          b: 2
        },
        computed: {
          c(){
            index++;
            return this.a + this.b;
          }
        },
        watch: {
          c: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( index ).is.equals( 1 );
      chai.expect( result ).is.undefined;

      hu.a = 2;
      chai.expect( index ).is.equals( 1 );
      chai.expect( result ).is.undefined;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 2 );
        chai.expect( result ).is.deep.equals([ 4, 3 ]);

        hu.a = 3;
        hu.b = 4;
        chai.expect( index ).is.equals( 2 );
        chai.expect( result ).is.deep.equals([ 4, 3 ]);
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 3 );
          chai.expect( result ).is.deep.equals([ 7, 4 ]);

          done();
        });
      });
    });

    it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新, 计算属性会重新运行计算方法 ( Vue )', ( done ) => {
      let result;
      let index = 0;
      const vm = new Vue({
        data: {
          a: 1,
          b: 2
        },
        computed: {
          c(){
            index++;
            return this.a + this.b;
          }
        },
        watch: {
          c: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( index ).is.equals( 1 );
      chai.expect( result ).is.undefined;

      vm.a = 2;
      chai.expect( index ).is.equals( 1 );
      chai.expect( result ).is.undefined;
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 2 );
        chai.expect( result ).is.deep.equals([ 4, 3 ]);

        vm.a = 3;
        vm.b = 4;
        chai.expect( index ).is.equals( 2 );
        chai.expect( result ).is.deep.equals([ 4, 3 ]);
        vm.$nextTick(() => {
          chai.expect( index ).is.equals( 3 );
          chai.expect( result ).is.deep.equals([ 7, 4 ]);

          done();
        });
      });
    });

    it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新后又被读取, 那么在下一 tick 计算属性不会再运行', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: {
          a: 1,
          b: 2
        },
        computed: {
          c(){
            index++;
            return this.a + this.b;
          }
        },
        watch: {
          c: {
            immediate: true,
            handler: () => {}
          }
        }
      });

      // 计算属性被监听属性初始化
      chai.expect( index ).is.equals( 1 );

      // 再次访问计算属性是读取的缓存
      chai.expect( hu.c ).is.equals( 3 );
      chai.expect( index ).is.equals( 1 );

      // 更新计算属性的依赖
      // 此时计算属性还未更新
      hu.a = 2;
      chai.expect( index ).is.equals( 1 );

      // 读取计算属性, 计算属性已更新
      chai.expect( hu.c ).is.equals( 4 );
      chai.expect( index ).is.equals( 2 );
      hu.$nextTick(() => {
        chai.expect( hu.c ).is.equals( 4 );
        chai.expect( index ).is.equals( 2 );

        done();
      });
    });
    
    it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新后又被读取, 那么在下一 tick 计算属性不会再运行 ( Vue )', ( done ) => {
      let index = 0;
      const vm = new Vue({
        data: {
          a: 1,
          b: 2
        },
        computed: {
          c(){
            index++;
            return this.a + this.b;
          }
        },
        watch: {
          c: {
            immediate: true,
            handler: () => {}
          }
        }
      });

      // 计算属性被监听属性初始化
      chai.expect( index ).is.equals( 1 );

      // 再次访问计算属性是读取的缓存
      chai.expect( vm.c ).is.equals( 3 );
      chai.expect( index ).is.equals( 1 );

      // 更新计算属性的依赖
      // 此时计算属性还未更新
      vm.a = 2;
      chai.expect( index ).is.equals( 1 );

      // 读取计算属性, 计算属性已更新
      chai.expect( vm.c ).is.equals( 4 );
      chai.expect( index ).is.equals( 2 );
      vm.$nextTick(() => {
        chai.expect( vm.c ).is.equals( 4 );
        chai.expect( index ).is.equals( 2 );

        done();
      });
    });

    it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新, 计算属性会重新运行计算方法, 监听方法会异步调用', ( done ) => {
      let result;
      let index = 0;
      const hu = new Hu({
        data: {
          a: 1,
          b: 2
        },
        computed: {
          c(){
            index++;
            return this.a + this.b;
          }
        },
        watch: {
          c: {
            immediate: true,
            handler: ( value, oldValue ) => result = [ value, oldValue ]
          }
        }
      });

      // 计算属性被监听属性初始化
      chai.expect( index ).is.equals( 1 );
      chai.expect( result ).is.deep.equals([ 3, undefined ]);

      // 再次访问计算属性是读取的缓存
      chai.expect( hu.c ).is.equals( 3 );
      chai.expect( index ).is.equals( 1 );
      chai.expect( result ).is.deep.equals([ 3, undefined ]);

      // 更新计算属性的依赖
      // 此时计算属性还未更新
      hu.a = 2;
      chai.expect( index ).is.equals( 1 );
      chai.expect( result ).is.deep.equals([ 3, undefined ]);

      // 读取计算属性
      // 计算属性已更新, 但是监听属性还未触发
      chai.expect( hu.c ).is.equals( 4 );
      chai.expect( index ).is.equals( 2 );
      chai.expect( result ).is.deep.equals([ 3, undefined ]);

      // 在下一 tick, 监听属性被触发
      hu.$nextTick(() => {
        chai.expect( hu.c ).is.equals( 4 );
        chai.expect( index ).is.equals( 2 );
        chai.expect( result ).is.deep.equals([ 4, 3 ]);

        done();
      });
    });

    it( '计算属性被监听方法依赖时, 当计算属性的依赖被更新, 计算属性会重新运行计算方法, 监听方法会异步调用 ( Vue )', ( done ) => {
      let result;
      let index = 0;
      const vm = new Vue({
        data: {
          a: 1,
          b: 2
        },
        computed: {
          c(){
            index++;
            return this.a + this.b;
          }
        },
        watch: {
          c: {
            immediate: true,
            handler: ( value, oldValue ) => result = [ value, oldValue ]
          }
        }
      });

      // 计算属性被监听属性初始化
      chai.expect( index ).is.equals( 1 );
      chai.expect( result ).is.deep.equals([ 3, undefined ]);

      // 再次访问计算属性是读取的缓存
      chai.expect( vm.c ).is.equals( 3 );
      chai.expect( index ).is.equals( 1 );
      chai.expect( result ).is.deep.equals([ 3, undefined ]);

      // 更新计算属性的依赖
      // 此时计算属性还未更新
      vm.a = 2;
      chai.expect( index ).is.equals( 1 );
      chai.expect( result ).is.deep.equals([ 3, undefined ]);

      // 读取计算属性
      // 计算属性已更新, 但是监听属性还未触发
      chai.expect( vm.c ).is.equals( 4 );
      chai.expect( index ).is.equals( 2 );
      chai.expect( result ).is.deep.equals([ 3, undefined ]);

      // 在下一 tick, 监听属性被触发
      vm.$nextTick(() => {
        chai.expect( vm.c ).is.equals( 4 );
        chai.expect( index ).is.equals( 2 );
        chai.expect( result ).is.deep.equals([ 4, 3 ]);

        done();
      });
    });

    it( '计算属性的计算可以依赖于另一个计算属性', () => {
      const hu = new Hu({
        data: {
          a: 1
        },
        computed: {
          b(){ return this.a * 2 },
          c(){ return this.b * 2 },
          d(){ return this.c * 2 },
          e(){ return this.d * 2 },
          f(){ return this.e * 2 },
          g(){ return this.f * 2 }
        }
      });

      chai.expect( hu.g ).to.equals( 64 );
      chai.expect( hu.f ).to.equals( 32 );
      chai.expect( hu.e ).to.equals( 16 );
      chai.expect( hu.d ).to.equals( 8 );
      chai.expect( hu.c ).to.equals( 4 );
      chai.expect( hu.b ).to.equals( 2 );
      chai.expect( hu.a ).to.equals( 1 );

      hu.a = 2;

      chai.expect( hu.g ).to.equals( 128 );
      chai.expect( hu.f ).to.equals( 64 );
      chai.expect( hu.e ).to.equals( 32 );
      chai.expect( hu.d ).to.equals( 16 );
      chai.expect( hu.c ).to.equals( 8 );
      chai.expect( hu.b ).to.equals( 4 );
      chai.expect( hu.a ).to.equals( 2 );
    });

    it( '计算属性的计算可以依赖于另一个计算属性 ( Vue )', () => {
      const vm = new Vue({
        data: {
          a: 1
        },
        computed: {
          b(){ return this.a * 2 },
          c(){ return this.b * 2 },
          d(){ return this.c * 2 },
          e(){ return this.d * 2 },
          f(){ return this.e * 2 },
          g(){ return this.f * 2 }
        }
      });

      chai.expect( vm.g ).to.equals( 64 );
      chai.expect( vm.f ).to.equals( 32 );
      chai.expect( vm.e ).to.equals( 16 );
      chai.expect( vm.d ).to.equals( 8 );
      chai.expect( vm.c ).to.equals( 4 );
      chai.expect( vm.b ).to.equals( 2 );
      chai.expect( vm.a ).to.equals( 1 );

      vm.a = 2;

      chai.expect( vm.g ).to.equals( 128 );
      chai.expect( vm.f ).to.equals( 64 );
      chai.expect( vm.e ).to.equals( 32 );
      chai.expect( vm.d ).to.equals( 16 );
      chai.expect( vm.c ).to.equals( 8 );
      chai.expect( vm.b ).to.equals( 4 );
      chai.expect( vm.a ).to.equals( 2 );
    });

    it( '计算属性的计算可以依赖于另一个计算属性 ( 二 )', () => {
      let result;
      const hu = new Hu({
        data: {
          a: 1
        },
        computed: {
          b(){ return this.a * 2 },
          c(){ return this.b * 2 },
          d(){ return this.c * 2 },
          e(){ return this.d * 2 },
          f(){ return this.e * 2 },
          g(){ return this.f * 2 }
        },
        watch: {
          g: {
            immediate: true,
            handler: ( value, oldValue ) => result = [ value, oldValue ]
          }
        }
      });

      chai.expect( result ).is.deep.equals([ 64, undefined ]);

      hu.a = 2;
      chai.expect( result ).is.deep.equals([ 64, undefined ]);
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 128, 64 ]);
      });
    });

    it( '计算属性的计算可以依赖于另一个计算属性 ( 二 ) ( Vue )', () => {
      let result;
      const vm = new Vue({
        data: {
          a: 1
        },
        computed: {
          b(){ return this.a * 2 },
          c(){ return this.b * 2 },
          d(){ return this.c * 2 },
          e(){ return this.d * 2 },
          f(){ return this.e * 2 },
          g(){ return this.f * 2 }
        },
        watch: {
          g: {
            immediate: true,
            handler: ( value, oldValue ) => result = [ value, oldValue ]
          }
        }
      });

      chai.expect( result ).is.deep.equals([ 64, undefined ]);

      vm.a = 2;
      chai.expect( result ).is.deep.equals([ 64, undefined ]);
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 128, 64 ]);
      });
    });

    if( supportsForInTriggerProxyOwnKeys ){

      it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( for ... in )', () => {
        const hu = new Hu({
          data: {
            json: {}
          },
          computed: {
            a(){
              const json = {};
              for( let name in this.json ){
                json[ name ] = this.json[ name ];
              }
              return json;
            }
          },
          watch: {
            a(){}
          }
        });

        chai.expect( hu.a ).is.deep.equals({});

        hu.json.aaa = 1;
        hu.json.bbb = 2;

        chai.expect( hu.a ).is.deep.equals({
          aaa: 1,
          bbb: 2
        });

        const ccc = Symbol('ccc');

        hu.json[ ccc ] = 3;

        chai.expect( hu.a ).is.deep.equals({
          aaa: 1,
          bbb: 2,
          [ ccc ]: 3
        });
      });
      
    }

    it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Reflect.ownKeys )', () => {
      const hu = new Hu({
        data: {
          json: {}
        },
        computed: {
          a(){
            const json = {};
            for( let name of Reflect.ownKeys( this.json ) ){
              json[ name ] = this.json[ name ];
            }
            return json;
          }
        },
        watch: {
          a(){}
        }
      });

      chai.expect( hu.a ).is.deep.equals({});

      hu.json.aaa = 1;
      hu.json.bbb = 2;

      chai.expect( hu.a ).is.deep.equals({
        aaa: 1,
        bbb: 2
      });

      const ccc = Symbol('ccc');

      hu.json[ ccc ] = 3;

      chai.expect( hu.a ).is.deep.equals({
        aaa: 1,
        bbb: 2,
        [ ccc ]: 3
      });
    });

    it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Object.keys )', () => {
      const hu = new Hu({
        data: {
          json: {}
        },
        computed: {
          a(){
            const json = {};
            for( let name of Object.keys( this.json ) ){
              json[ name ] = this.json[ name ];
            }
            return json;
          }
        },
        watch: {
          a(){}
        }
      });

      chai.expect( hu.a ).is.deep.equals({});

      hu.json.aaa = 1;
      hu.json.bbb = 2;

      chai.expect( hu.a ).is.deep.equals({
        aaa: 1,
        bbb: 2
      });

      const ccc = Symbol('ccc');

      hu.json[ ccc ] = 3;

      chai.expect( hu.a ).is.deep.equals({
        aaa: 1,
        bbb: 2,
        [ ccc ]: 3
      });
    });

    if( Object.values ){

      it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Object.values )', () => {
        const hu = new Hu({
          data: {
            json: {}
          },
          computed: {
            a(){
              const arr = [];
              for( let value of Object.values( this.json ) ){
                arr.push( value );
              }
              return arr;
            }
          },
          watch: {
            a(){}
          }
        });

        chai.expect( hu.a ).is.deep.equals([]);

        hu.json.aaa = 1;
        hu.json.bbb = 2;

        chai.expect( hu.a ).is.deep.equals([ 1, 2 ]);

        const ccc = Symbol('ccc');

        hu.json[ ccc ] = 3;

        chai.expect( hu.a ).is.deep.equals([ 1, 2 ]);
      });

    }

    if( Object.entries ){

      it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Object.entries )', () => {
        const hu = new Hu({
          data: {
            json: {}
          },
          computed: {
            a(){
              const json = {};
              for( let [ name, value ] of Object.entries( this.json ) ){
                json[ name ] = value;
              }
              return json;
            }
          },
          watch: {
            a(){}
          }
        });

        chai.expect( hu.a ).is.deep.equals({});

        hu.json.aaa = 1;
        hu.json.bbb = 2;

        chai.expect( hu.a ).is.deep.equals({
          aaa: 1,
          bbb: 2
        });

        const ccc = Symbol('ccc');

        hu.json[ ccc ] = 3;

        chai.expect( hu.a ).is.deep.equals({
          aaa: 1,
          bbb: 2
        });
      });

    }

    it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Object.getOwnPropertyNames )', () => {
      const hu = new Hu({
        data: {
          json: {}
        },
        computed: {
          a(){
            const json = {};
            for( let name of Object.getOwnPropertyNames( this.json ) ){
              json[ name ] = this.json[ name ];
            }
            return json;
          }
        },
        watch: {
          a(){}
        }
      });

      chai.expect( hu.a ).is.deep.equals({});

      hu.json.aaa = 1;
      hu.json.bbb = 2;

      chai.expect( hu.a ).is.deep.equals({
        aaa: 1,
        bbb: 2
      });

      const ccc = Symbol('ccc');

      hu.json[ ccc ] = 3;

      chai.expect( hu.a ).is.deep.equals({
        aaa: 1,
        bbb: 2
      });
    });

    it( '计算属性在计算时需要遍历对象时, 若对象内部元素被更改, 计算属性也会触发 ( Object.getOwnPropertySymbols )', () => {
      const hu = new Hu({
        data: {
          json: {}
        },
        computed: {
          a(){
            const json = {};
            for( let name of Object.getOwnPropertySymbols( this.json ) ){
              json[ name ] = this.json[ name ];
            }
            return json;
          }
        },
        watch: {
          a(){}
        }
      });

      chai.expect( hu.a ).is.deep.equals({});

      hu.json.aaa = 1;
      hu.json.bbb = 2;

      chai.expect( hu.a ).is.deep.equals({});

      const ccc = Symbol('ccc');

      hu.json[ ccc ] = 3;

      chai.expect( hu.a ).is.deep.equals({
        [ ccc ]: 3
      });
    });

    if( supportsForInTriggerProxyOwnKeys ){

      it( '计算属性在计算时需要遍历数组时, 若数组内部元素被更改, 计算属性也会触发 ( for ... in )', () => {
        const hu = new Hu({
          data: {
            arr: []
          },
          computed: {
            a(){
              const arr = [];
              for( let index in this.arr ){
                arr.push(
                  this.arr[ index ]
                );
              }
              return arr;
            }
          }
        });

        chai.expect( hu.a ).is.deep.equals([]);

        hu.arr.push( 2 );

        chai.expect( hu.a ).is.deep.equals([ 2 ]);
        
        hu.arr.push( 3 );

        chai.expect( hu.a ).is.deep.equals([ 2, 3 ]);
      });

    }

    it( '计算属性在计算时需要遍历数组时, 若数组内部元素被更改, 计算属性也会触发 ( for ... of )', () => {
      const hu = new Hu({
        data: {
          arr: []
        },
        computed: {
          a(){
            const arr = [];
            for( let item of this.arr ){
              arr.push( item );
            }
            return arr;
          }
        }
      });

      chai.expect( hu.a ).is.deep.equals([]);

      hu.arr.push( 2 );

      chai.expect( hu.a ).is.deep.equals([ 2 ]);
      
      hu.arr.push( 3 );

      chai.expect( hu.a ).is.deep.equals([ 2, 3 ]);
    });

    it( '计算属性在计算时需要遍历数组时, 若数组内部元素被更改, 计算属性也会触发 ( Array.prototype.forEach )', () => {
      const hu = new Hu({
        data: {
          arr: []
        },
        computed: {
          a(){
            const arr = [];
            this.arr.forEach( item => {
              arr.push( item );
            });
            return arr;
          }
        }
      });

      chai.expect( hu.a ).is.deep.equals([]);

      hu.arr.push( 2 );

      chai.expect( hu.a ).is.deep.equals([ 2 ]);
      
      hu.arr.push( 3 );

      chai.expect( hu.a ).is.deep.equals([ 2, 3 ]);
    });

    it( '计算属性的返回值如果是支持的可转为观察者对象的格式类型, 那么会被转为观察者对象', ( done ) => {
      let index = 0;
      const hu = new Hu({
        computed: {
          a: () => ({ aaa: 1 })
        },
        watch: {
          a: {
            deep: true,
            handler(){ index++; }
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a.aaa = 2;
      chai.expect( index ).is.equals( 0 );
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        done();
      });
    });

    it( '计算属性的返回值如果是支持的可转为观察者对象的格式类型, 那么会被转为观察者对象 ( Vue ) ( 不一致 )', ( done ) => {
      let index = 0;
      const vm = new Vue({
        computed: {
          a: () => ({ aaa: 1 })
        },
        watch: {
          a: {
            deep: true,
            handler(){ index++; }
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      vm.a.aaa = 2;
      chai.expect( index ).is.equals( 0 );
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 0 );

        done();
      });
    });

    it( '计算属性的返回值如果是支持的可转为观察者对象的格式类型, 那么会被转为观察者对象 ( 二 )', ( done ) => {
      let index = 0;
      const hu = new Hu({
        computed: {
          a: () => [ 1 ]
        },
        watch: {
          a: {
            deep: true,
            handler(){ index++; }
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a[ 0 ] = 2;
      chai.expect( index ).is.equals( 0 );
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        done();
      });
    });

    it( '计算属性的返回值如果是支持的可转为观察者对象的格式类型, 那么会被转为观察者对象 ( 二 ) ( Vue ) ( 不一致 )', ( done ) => {
      let index = 0;
      const vm = new Vue({
        computed: {
          a: () => [ 1 ]
        },
        watch: {
          a: {
            deep: true,
            handler(){ index++; }
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      Vue.set( vm.a, 0, 2 );
      chai.expect( index ).is.equals( 0 );
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 0 );

        done();
      });
    });

    it( '计算属性在依赖了数组长度时, 若数组长度被字符串数字赋值后, 若值相同, 则不应该被调起', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: {
          arr: [ 1, 2, 3, 4, 5, 6 ]
        },
        computed: {
          a(){
            index++;
            this.arr.length;
          }
        },
        watch: {
          a(){}
        }
      });

      chai.expect( index ).is.equals( 1 );

      hu.arr.length = 5;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 2 );

        hu.arr.length = '5';
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          hu.arr.length = '4';
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            done();
          });
        });
      });
    });

    it( '计算属性在依赖了数组长度时, 若数组长度被字符串数字赋值后, 若值相同, 则不应该被调起 ( Vue ) ( 不支持 )', ( done ) => {
      let index = 0;
      const vm = new Vue({
        data: {
          arr: [ 1, 2, 3, 4, 5, 6 ]
        },
        computed: {
          a(){
            index++;
            this.arr.length;
          }
        },
        watch: {
          a(){}
        }
      });

      chai.expect( index ).is.equals( 1 );

      vm.$set( vm.arr, 'length', 5 );
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        vm.$set( vm.arr, 'length', '5' );
        vm.$nextTick(() => {
          chai.expect( index ).is.equals( 1 );

          vm.$set( vm.arr, 'length', '4' );
          vm.$nextTick(() => {
            chai.expect( index ).is.equals( 1 );

            done();
          });
        });
      });
    });

    it('------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------');

    it( '实例化后所定义的计算属性会全部添加到 $computed 实例属性中', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        computed: {
          a: () => '1',
          [ b ]: () => '2',
          $c: () => '3',
          _d: () => '4'
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu.$computed ).has.property( 'a' );
      chai.expect( hu.$computed ).has.property(  b  );
      chai.expect( hu.$computed ).has.property( '$c' );
      chai.expect( hu.$computed ).has.property( '_d' );

      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ '$c' ] ).is.equals( '3' );
      chai.expect( hu.$computed[ '_d' ] ).is.equals( '4' );
    });

    it( '实例化后会在实例本身添加 $computed 下所有首字母不为 $ 的计算属性的映射', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        computed: {
          a: () => '1',
          [ b ]: () => '2',
          $c: () => '3',
          _d: () => '4'
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu ).has.not.property(  '$c'  );
      chai.expect( hu ).has.property( '_d' );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu[ '_d' ] ).is.equals( '4' );
    });

    it( '实例化后会在自定义元素本身添加 $computed 下所有首字母不为 $ 和 _ 的计算属性的映射', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        computed: {
          a: () => '1',
          [ b ]: () => '2',
          $c: () => '3',
          _d: () => '4'
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom ).has.not.property(  '$c'  );
      chai.expect( custom ).has.not.property( '_d' );

      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
    });

    it( '实例化后若删除在实例本身添加的计算属性的映射, 不会影响到 $computed 实例属性内的计算属性本体', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        computed: {
          a: () => '1',
          [ b ]: () => '2'
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu.$computed ).has.property( 'a' );
      chai.expect( hu.$computed ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );

      delete hu[ 'a' ];
      delete hu[  b  ];

      chai.expect( hu ).has.not.property( 'a' );
      chai.expect( hu ).has.not.property(  b  );
      chai.expect( hu.$computed ).has.property( 'a' );
      chai.expect( hu.$computed ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( undefined );
      chai.expect( hu[  b  ] ).is.equals( undefined );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );
    });

    it( '实例化后若删除在自定义元素本身添加的计算属性的映射, 不会影响到 $computed 自定义元素属性内的计算属性本体', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        computed: {
          a: () => '1',
          [ b ]: () => '2'
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( hu.$computed ).has.property( 'a' );
      chai.expect( hu.$computed ).has.property(  b  );

      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );

      delete custom[ 'a' ];
      delete custom[  b  ];

      chai.expect( custom ).has.not.property( 'a' );
      chai.expect( custom ).has.not.property(  b  );
      chai.expect( hu.$computed ).has.property( 'a' );
      chai.expect( hu.$computed ).has.property(  b  );

      chai.expect( custom[ 'a' ] ).is.equals( undefined );
      chai.expect( custom[  b  ] ).is.equals( undefined );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );
    });

    it( '实例化后不可以通过实例本身对计算属性进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        computed: {
          a: () => '1',
          [ b ]: () => '2'
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu.$computed ).has.property( 'a' );
      chai.expect( hu.$computed ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );

      hu[ 'a' ] = 3;
      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );

      hu[  b  ] = 4;
      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );
    });

    it( '实例化后不可以通过自定义元素本身对计算属性进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        computed: {
          a: () => '1',
          [ b ]: () => '2'
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( hu.$computed ).has.property( 'a' );
      chai.expect( hu.$computed ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );

      custom[ 'a' ] = 3;
      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );

      custom[  b  ] = 4;
      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );
    });

    it( '实例化后不可以通过 $computed 实例属性对计算属性进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        computed: {
          a: () => '1',
          [ b ]: () => '2'
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( hu.$computed ).has.property( 'a' );
      chai.expect( hu.$computed ).has.property(  b  );

      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );

      hu.$computed[ 'a' ] = 3;
      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );

      hu.$computed[  b  ] = 4;
      chai.expect( hu[ 'a' ] ).is.equals( '1' );
      chai.expect( hu[  b  ] ).is.equals( '2' );
      chai.expect( custom[ 'a' ] ).is.equals( '1' );
      chai.expect( custom[  b  ] ).is.equals( '2' );
      chai.expect( hu.$computed[ 'a' ] ).is.equals( '1' );
      chai.expect( hu.$computed[  b  ] ).is.equals( '2' );
    });

  });

  describe( 'options.methods', () => {

    function fn1(){ return 1 }
    function fn2(){ return 2 }
    function fn3(){ return 3 }
    function fn4(){ return 4 }

    it( '定义方法时非 function 类型的将会被忽略', () => {
      const hu = new Hu({
        methods: {
          a: fn1,
          b: '',
          c: true,
          d: false,
          e: {},
          f: [],
          g: null,
          h: undefined,
          i: Symbol('i')
        }
      });

      chai.expect( hu ).has.property('a');
      chai.expect( hu ).not.has.property('b');
      chai.expect( hu ).not.has.property('c');
      chai.expect( hu ).not.has.property('d');
      chai.expect( hu ).not.has.property('e');
      chai.expect( hu ).not.has.property('f');
      chai.expect( hu ).not.has.property('g');
      chai.expect( hu ).not.has.property('h');
      chai.expect( hu ).not.has.property('i');

      chai.expect( hu.$methods ).has.property('a');
      chai.expect( hu.$methods ).not.has.property('b');
      chai.expect( hu.$methods ).not.has.property('c');
      chai.expect( hu.$methods ).not.has.property('d');
      chai.expect( hu.$methods ).not.has.property('e');
      chai.expect( hu.$methods ).not.has.property('f');
      chai.expect( hu.$methods ).not.has.property('g');
      chai.expect( hu.$methods ).not.has.property('h');
      chai.expect( hu.$methods ).not.has.property('i');

      chai.expect( hu.a() ).is.equals( 1 );
    });

    it( '定义的方法在执行时, this 的指向是当前实例', () => {
      const hu = new Hu({
        methods: {
          a: function(){
            return this;
          }
        }
      });

      chai.expect( hu.a() ).is.equals( hu );
    });

    it('------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------');

    it( '实例化后所定义的方法会全部添加到 $methods 实例属性中', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        methods: {
          a: fn1,
          [ b ]: fn2,
          $c: fn3,
          _d: fn4
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods ).has.property( '$c' );
      chai.expect( hu.$methods ).has.property( '_d' );

      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ '$c' ] ).is.a( 'function' );
      chai.expect( hu.$methods[ '_d' ] ).is.a( 'function' );

      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods[ '$c' ]() ).is.equals( 3 );
      chai.expect( hu.$methods[ '_d' ]() ).is.equals( 4 );
    });

    it( '实例化后会在实例本身添加 $methods 下所有首字母不为 $ 的方法的副本', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        methods: {
          a: fn1,
          [ b ]: fn2,
          $c: fn3,
          _d: fn4
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu ).has.not.property( '$c' );
      chai.expect( hu ).has.property( '_d' );

      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( hu[ '_d' ] ).is.a( 'function' );

      chai.expect( hu[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu[  b  ]() ).is.equals( 2 );
      chai.expect( hu[ '_d' ]() ).is.equals( 4 );
    });

    it( '实例化后会在自定义元素本身添加 $methods 下所有首字母不为 $ 和 _ 的方法的副本', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        methods: {
          a: fn1,
          [ b ]: fn2,
          $c: fn3,
          _d: fn4
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom ).has.not.property( '$c' );
      chai.expect( custom ).has.not.property( '_d' );

      chai.expect( custom[ 'a' ] ).is.a( 'function' );
      chai.expect( custom[  b  ] ).is.a( 'function' );

      chai.expect( custom[ 'a' ]() ).is.equals( 1 );
      chai.expect( custom[  b  ]() ).is.equals( 2 );
    });

    it( '实例化后若删除在实例本身添加的 $methods 的方法的副本, 不会影响到 $methods 的方法本体', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        methods: {
          a: fn1,
          [ b ]: fn2
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom[ 'a' ] ).is.a( 'function' );
      chai.expect( custom[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );

      delete hu[ 'a' ];
      delete hu[  b  ];

      chai.expect( hu[ 'a' ] ).is.equals( undefined );
      chai.expect( hu[  b  ] ).is.equals( undefined );
      chai.expect( custom[ 'a' ] ).is.a( 'function' );
      chai.expect( custom[  b  ] ).is.a( 'function' );
      chai.expect( custom[ 'a' ]() ).is.equals( 1 );
      chai.expect( custom[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );
    });

    it( '实例化后若删除在自定义元素本身添加的 $methods 的方法的副本, 不会影响到 $methods 的方法本体', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        methods: {
          a: fn1,
          [ b ]: fn2
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom[ 'a' ] ).is.a( 'function' );
      chai.expect( custom[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );

      delete custom[ 'a' ];
      delete custom[  b  ];

      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( hu[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu[  b  ]() ).is.equals( 2 );
      chai.expect( custom[ 'a' ] ).is.equals( undefined );
      chai.expect( custom[  b  ] ).is.equals( undefined );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );
    });

    it( '实例化后不可以通过改变实例本身的方法对 $methods 内的的方法进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        methods: {
          a: fn1,
          [ b ]: fn2
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( hu[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );

      hu[ 'a' ] = 3;

      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( hu[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );

      hu[ b ] = 4;

      chai.expect( hu[ 'a' ] ).is.equals( 3 );
      chai.expect( hu[  b  ] ).is.equals( 4 );
      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );
    });

    it( '实例化后不可以通过改变自定义元素本身的方法对 $methods 内的的方法进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        methods: {
          a: fn1,
          [ b ]: fn2
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( hu[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu[  b  ]() ).is.equals( 2 );
      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom[ 'a' ] ).is.a( 'function' );
      chai.expect( custom[  b  ] ).is.a( 'function' );
      chai.expect( custom[ 'a' ]() ).is.equals( 1 );
      chai.expect( custom[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );

      custom[ 'a' ] = 3;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( hu[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu[  b  ]() ).is.equals( 2 );
      chai.expect( custom[ 'a' ] ).is.equals( 3 );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom[  b  ] ).is.a( 'function' );
      chai.expect( custom[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );

      custom[ b ] = 4;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( hu[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu[  b  ]() ).is.equals( 2 );
      chai.expect( custom[ 'a' ] ).is.equals( 3 );
      chai.expect( custom[  b  ] ).is.equals( 4 );
      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );
    });

    it( '实例化后不可以通过改变 $methods 内的方法对当前实例上方法的映射进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        methods: {
          a: fn1,
          [ b ]: fn2
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( hu[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );

      hu.$methods[ 'a' ] = 3;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( hu[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );

      hu.$methods[ b ] = 4;

      chai.expect( hu ).has.property( 'a' );
      chai.expect( hu ).has.property(  b  );
      chai.expect( hu[ 'a' ] ).is.a( 'function' );
      chai.expect( hu[  b  ] ).is.a( 'function' );
      chai.expect( hu[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$methods[  b  ] ).is.equals( 4 );
    });

    it( '实例化后不可以通过改变 $methods 内的方法对当前自定义元素上方法的映射进行更改', () => {
      const customName = window.customName;
      const b = Symbol('b');

      Hu.define( customName, {
        methods: {
          a: fn1,
          [ b ]: fn2
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom[ 'a' ] ).is.a( 'function' );
      chai.expect( custom[  b  ] ).is.a( 'function' );
      chai.expect( custom[ 'a' ]() ).is.equals( 1 );
      chai.expect( custom[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods ).has.property( 'a' );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[ 'a' ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[ 'a' ]() ).is.equals( 1 );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );

      hu.$methods[ 'a' ] = 3;

      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom[ 'a' ] ).is.a( 'function' );
      chai.expect( custom[  b  ] ).is.a( 'function' );
      chai.expect( custom[ 'a' ]() ).is.equals( 1 );
      chai.expect( custom[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$methods ).has.property(  b  );
      chai.expect( hu.$methods[  b  ] ).is.a( 'function' );
      chai.expect( hu.$methods[  b  ]() ).is.equals( 2 );

      hu.$methods[ b ] = 4;

      chai.expect( custom ).has.property( 'a' );
      chai.expect( custom ).has.property(  b  );
      chai.expect( custom[ 'a' ] ).is.a( 'function' );
      chai.expect( custom[  b  ] ).is.a( 'function' );
      chai.expect( custom[ 'a' ]() ).is.equals( 1 );
      chai.expect( custom[  b  ]() ).is.equals( 2 );
      chai.expect( hu.$methods[ 'a' ] ).is.equals( 3 );
      chai.expect( hu.$methods[  b  ] ).is.equals( 4 );
    });

  });

  describe( 'options.watch', () => {

    it( '使用 watch 对实例内的属性进行监听', ( done ) => {
      let result;
      const hu = new Hu({
        data: () => ({
          a: 1
        }),
        watch: {
          a: ( value, oldValue ) => {
            result = [ value, oldValue ];
          }
        }
      });

      chai.expect( result ).is.undefined;

      hu.a = 2;
      chai.expect( result ).is.undefined;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        hu.a = 3;
        chai.expect( result ).is.deep.equals([ 2, 1 ]);
        hu.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 3, 2 ]);
          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听 ( Vue )', ( done ) => {
      let result;
      const vm = new Vue({
        data: () => ({
          a: 1
        }),
        watch: {
          a: ( value, oldValue ) => {
            result = [ value, oldValue ];
          }
        }
      });

      chai.expect( result ).is.undefined;

      vm.a = 2;
      chai.expect( result ).is.undefined;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        vm.a = 3;
        chai.expect( result ).is.deep.equals([ 2, 1 ]);
        vm.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 3, 2 ]);
          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 触发的回调函数的 this 指向的是当前实例', () => {
      let result;
      const hu = new Hu({
        watch: {
          $data: {
            immediate: true,
            handler(){
              result = this;
            }
          }
        }
      });

      // 确保 expect 一定执行过
      chai.expect( result ).is.deep.equals( hu );
    });

    it( '使用 watch 对实例内的属性进行监听, 触发的回调函数的 this 指向的是当前实例 ( Vue )', () => {
      let result;
      const vm = new Vue({
        watch: {
          $data: {
            immediate: true,
            handler(){
              result = this;
            }
          }
        }
      });

      // 确保 expect 一定执行过
      chai.expect( result ).is.deep.equals( vm );
    });

    it( '使用 watch 对实例内的属性进行监听, 使用字符串的键对一个对象内部属性进行监听', ( done ) => {
      let result;
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: {
            b: 2,
            c: 3
          }
        }),
        watch: {
          'a.b': ( value, oldValue ) => {
            index++;
            result = [ value, oldValue ];
          }
        }
      });

      hu.a.b = 3;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( result ).is.deep.equals([ 3, 2 ]);

        hu.a.b = 4;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );
          chai.expect( result ).is.deep.equals([ 4, 3 ]);

          hu.a.c = 5;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 2 );
            chai.expect( result ).is.deep.equals([ 4, 3 ]);

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用字符串的键对一个对象内部属性进行监听 ( Vue )', ( done ) => {
      let result;
      let index = 0;
      const vm = new Vue({
        data: () => ({
          a: {
            b: 2,
            c: 3
          }
        }),
        watch: {
          'a.b': ( value, oldValue ) => {
            index++;
            result = [ value, oldValue ];
          }
        }
      });

      vm.a.b = 3;
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( result ).is.deep.equals([ 3, 2 ]);

        vm.a.b = 4;
        vm.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );
          chai.expect( result ).is.deep.equals([ 4, 3 ]);

          vm.a.c = 5;
          vm.$nextTick(() => {
            chai.expect( index ).is.equals( 2 );
            chai.expect( result ).is.deep.equals([ 4, 3 ]);

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 值可以为一个字符串的方法名称', ( done ) => {
      let result;
      const hu = new Hu({
        data: {
          a: 1
        },
        methods: {
          watchA: ( value, oldValue ) => result = [ value, oldValue ]
        },
        watch: {
          a: 'watchA'
        }
      });

      hu.a = 2;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 值可以为一个字符串的方法名称 ( Vue )', ( done ) => {
      let result;
      const vm = new Vue({
        data: {
          a: 1
        },
        methods: {
          watchA: ( value, oldValue ) => result = [ value, oldValue ]
        },
        watch: {
          a: 'watchA'
        }
      });

      vm.a = 2;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 值可以为一个函数', ( done ) => {
      let result;
      const hu = new Hu({
        data: {
          a: 1
        },
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      hu.a = 2;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 值可以为一个函数 ( Vue )', ( done ) => {
      let result;
      const vm = new Vue({
        data: {
          a: 1
        },
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      vm.a = 2;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 值可以为一个数组', ( done ) => {
      let result, result2, result3;
      const hu = new Hu({
        data: {
          a: 1
        },
        methods: {
          watchA: ( value, oldValue ) => result = [ value, oldValue ]
        },
        watch: {
          a: [
            'watchA',
            ( value, oldValue ) => result2 = [ value, oldValue ],
            {
              handler: ( value, oldValue ) => result3 = [ value, oldValue ]
            }
          ]
        }
      });

      hu.a = 2;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);
        chai.expect( result2 ).is.deep.equals([ 2, 1 ]);
        chai.expect( result3 ).is.deep.equals([ 2, 1 ]);

        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 值可以为一个数组 ( Vue )', ( done ) => {
      let result, result2, result3;
      const vm = new Vue({
        data: {
          a: 1
        },
        methods: {
          watchA: ( value, oldValue ) => result = [ value, oldValue ]
        },
        watch: {
          a: [
            'watchA',
            ( value, oldValue ) => result2 = [ value, oldValue ],
            {
              handler: ( value, oldValue ) => result3 = [ value, oldValue ]
            }
          ]
        }
      });

      vm.a = 2;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);
        chai.expect( result2 ).is.deep.equals([ 2, 1 ]);
        chai.expect( result3 ).is.deep.equals([ 2, 1 ]);

        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对 String 类型进行监听', ( done ) => {
      let result;
      const hu = new Hu({
        data: () => ({
          a: 'a'
        }),
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( result ).is.undefined;

      hu.a = 'b';
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 'b', 'a' ]);

        hu.a = 'c';
        hu.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 'c', 'b' ]);

          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对 String 类型进行监听 ( Vue )', ( done ) => {
      let result;
      const vm = new Vue({
        data: () => ({
          a: 'a'
        }),
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( result ).is.undefined;

      vm.a = 'b';
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 'b', 'a' ]);

        vm.a = 'c';
        vm.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 'c', 'b' ]);

          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对 Number 类型进行监听', ( done ) => {
      let result;
      const hu = new Hu({
        data: () => ({
          a: 1
        }),
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( result ).is.undefined;

      hu.a = 2;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        hu.a = 3;
        hu.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 3, 2 ]);

          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对 Number 类型进行监听 ( Vue )', ( done ) => {
      let result;
      const vm = new Vue({
        data: () => ({
          a: 1
        }),
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( result ).is.undefined;

      vm.a = 2;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        vm.a = 3;
        vm.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 3, 2 ]);

          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对 Function 类型进行监听', ( done ) => {
      let result;
      const fn1 = () => {};
      const fn2 = () => {};
      const fn3 = () => {};
      const hu = new Hu({
        data: () => ({
          a: fn1
        }),
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( result ).is.undefined;

      hu.a = fn2;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ fn2, fn1 ]);

        hu.a = fn3;
        hu.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ fn3, fn2 ]);

          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对 Function 类型进行监听 ( Vue )', ( done ) => {
      let result;
      const fn1 = () => {};
      const fn2 = () => {};
      const fn3 = () => {};
      const vm = new Vue({
        data: () => ({
          a: fn1
        }),
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( result ).is.undefined;

      vm.a = fn2;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ fn2, fn1 ]);

        vm.a = fn3;
        vm.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ fn3, fn2 ]);

          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对 Object 类型进行监听', ( done ) => {
      let result;
      const obj1 = [];
      const obj2 = [];
      const obj3 = {};
      const obj4 = {};
      const hu = new Hu({
        data: () => ({
          a: obj1
        }),
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( result ).is.undefined;

      hu.a = obj2;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ obj2, obj1 ]);

        hu.a = obj3;
        hu.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ obj3, obj2 ]);

          hu.a = obj4;
          hu.$nextTick(() => {
            chai.expect( result ).is.deep.equals([ obj4, obj3 ]);

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对 Object 类型进行监听 ( Vue )', ( done ) => {
      let result;
      const obj1 = [];
      const obj2 = [];
      const obj3 = {};
      const obj4 = {};
      const vm = new Vue({
        data: () => ({
          a: obj1
        }),
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( result ).is.undefined;

      vm.a = obj2;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ obj2, obj1 ]);

        vm.a = obj3;
        vm.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ obj3, obj2 ]);

          vm.a = obj4;
          vm.$nextTick(() => {
            chai.expect( result ).is.deep.equals([ obj4, obj3 ]);

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对 Symbol 类型进行监听', ( done ) => {
      let result;
      const smb1 = Symbol('1');
      const smb2 = Symbol('2');
      const smb3 = Symbol('3');
      const hu = new Hu({
        data: () => ({
          a: smb1
        }),
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( result ).is.undefined;

      hu.a = smb2;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ smb2, smb1 ]);

        hu.a = smb3;
        hu.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ smb3, smb2 ]);

          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对 Symbol 类型进行监听 ( Vue )', ( done ) => {
      let result;
      const smb1 = Symbol('1');
      const smb2 = Symbol('2');
      const smb3 = Symbol('3');
      const vm = new Vue({
        data: () => ({
          a: smb1
        }),
        watch: {
          a: ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      chai.expect( result ).is.undefined;

      vm.a = smb2;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ smb2, smb1 ]);

        vm.a = smb3;
        vm.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ smb3, smb2 ]);

          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对各种类型的切换进行监听', ( done ) => {
      const types = [
        '', ' ', 'a',
        -1, 0, 1,
        () => {}, function(){},
        [], [ 1 ], [ 1 ],
        {}, { a: 1 }, { a: 1 },
        Symbol(''), Symbol('1'), Symbol('1'),
        undefined, null
      ];
      const promises = [];

      for( let index = 0, types1 = Array.$copy( types ); index < types1.length - 1; index++ ) promises.push(
        new Promise( resolve => {

          let result;
          const hu = new Hu({
            data: () => ({
              value: types1[ index ]
            }),
            watch: {
              value: ( value, oldValue ) => result = [ value, oldValue ]
            }
          });

          chai.expect( result ).is.undefined;

          hu.value = types1[ index + 1 ];
          hu.$nextTick(() => {
            chai.expect( result ).is.deep.equals([
              types1[ index + 1 ],
              types1[ index ]
            ]);

            resolve();
          });

        })
      );

      for( let index = 0, types2 = Array.$copy( types ).reverse(); index < types2.length - 1; index++ ) promises.push(
        new Promise( resolve => {

          let result;
          const hu = new Hu({
            data: () => ({
              value: types2[ index ]
            }),
            watch: {
              value: ( value, oldValue ) => result = [ value, oldValue ]
            }
          });

          chai.expect( result ).is.undefined;

          hu.value = types2[ index + 1 ];
          hu.$nextTick(() => {
            chai.expect( result ).is.deep.equals([
              types2[ index + 1 ],
              types2[ index ]
            ]);

            resolve();
          });

        })
      );

      Promise.all( promises ).then(() => {
        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对各种类型的切换进行监听 ( Vue )', ( done ) => {
      const types = [
        '', ' ', 'a',
        -1, 0, 1,
        () => {}, function(){},
        [], [ 1 ], [ 1 ],
        {}, { a: 1 }, { a: 1 },
        Symbol(''), Symbol('1'), Symbol('1'),
        undefined, null
      ];
      const promises = [];

      for( let index = 0, types1 = Array.$copy( types ); index < types1.length - 1; index++ ) promises.push(
        new Promise( resolve => {

          let result;
          const vm = new Vue({
            data: () => ({
              value: types1[ index ]
            }),
            watch: {
              value: ( value, oldValue ) => result = [ value, oldValue ]
            }
          });

          chai.expect( result ).is.undefined;

          vm.value = types1[ index + 1 ];
          vm.$nextTick(() => {
            chai.expect( result ).is.deep.equals([
              types1[ index + 1 ],
              types1[ index ]
            ]);

            resolve();
          });

        })
      );

      for( let index = 0, types2 = Array.$copy( types ).reverse(); index < types2.length - 1; index++ ) promises.push(
        new Promise( resolve => {

          let result;
          const vm = new Vue({
            data: () => ({
              value: types2[ index ]
            }),
            watch: {
              value: ( value, oldValue ) => result = [ value, oldValue ]
            }
          });

          chai.expect( result ).is.undefined;

          vm.value = types2[ index + 1 ];
          vm.$nextTick(() => {
            chai.expect( result ).is.deep.equals([
              types2[ index + 1 ],
              types2[ index ]
            ]);

            resolve();
          });

        })
      );

      Promise.all( promises ).then(() => {
        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 只有值被真正更改时, 回调才被触发', ( done ) => {
      let index = 0;
      let result;
      const hu = new Hu({
        data: () => ({
          a: 1
        }),
        watch: {
          a: ( value, oldValue ) => {
            index++;
            result = [ value, oldValue ];
          }
        }
      });

      chai.expect( result ).is.undefined;

      hu.a = 2;
      chai.expect( index ).is.equals( 0 );
      chai.expect( result ).is.undefined;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        hu.a = 2;
        chai.expect( index ).is.equals( 1 );
        chai.expect( result ).is.deep.equals([ 2, 1 ]);
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 1 );
          chai.expect( result ).is.deep.equals([ 2, 1 ]);

          hu.a = 3;
          chai.expect( index ).is.equals( 1 );
          chai.expect( result ).is.deep.equals([ 2, 1 ]);
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 2 );
            chai.expect( result ).is.deep.equals([ 3, 2 ]);
            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 只有值被真正更改时, 回调才被触发 ( Vue )', ( done ) => {
      let index = 0;
      let result;
      const vm = new Vue({
        data: () => ({
          a: 1
        }),
        watch: {
          a: ( value, oldValue ) => {
            index++;
            result = [ value, oldValue ];
          }
        }
      });

      chai.expect( result ).is.undefined;

      vm.a = 2;
      chai.expect( index ).is.equals( 0 );
      chai.expect( result ).is.undefined;
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        vm.a = 2;
        chai.expect( index ).is.equals( 1 );
        chai.expect( result ).is.deep.equals([ 2, 1 ]);
        vm.$nextTick(() => {
          chai.expect( index ).is.equals( 1 );
          chai.expect( result ).is.deep.equals([ 2, 1 ]);

          vm.a = 3;
          chai.expect( index ).is.equals( 1 );
          chai.expect( result ).is.deep.equals([ 2, 1 ]);
          vm.$nextTick(() => {
            chai.expect( index ).is.equals( 2 );
            chai.expect( result ).is.deep.equals([ 3, 2 ]);
            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 触发回调时, 值已经被更改', ( done ) => {
      let result;
      const hu = new Hu({
        data: () => ({
          a: 1
        }),
        watch: {
          a( value, oldValue ){
            result = [ this.a, value, oldValue ];
          }
        }
      });

      chai.expect( result ).is.undefined;

      hu.a = 2;
      chai.expect( result ).is.undefined;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 2, 1 ]);
        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 触发回调时, 值已经被更改 ( Vue )', ( done ) => {
      let result;
      const vm = new Vue({
        data: () => ({
          a: 1
        }),
        watch: {
          a( value, oldValue ){
            result = [ this.a, value, oldValue ];
          }
        }
      });

      chai.expect( result ).is.undefined;

      vm.a = 2;
      chai.expect( result ).is.undefined;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 2, 1 ]);
        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 handler 选项在使用对象形式时设定回调', ( done ) => {
      let result;
      const hu = new Hu({
        data: () => ({
          a: 1
        }),
        watch: {
          a: {
            handler: ( value, oldValue ) => {
              result = [ value, oldValue ];
            }
          }
        }
      });

      chai.expect( result ).is.undefined;

      hu.a = 2;
      chai.expect( result ).is.undefined;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        hu.a = 3;
        chai.expect( result ).is.deep.equals([ 2, 1 ]);
        hu.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 3, 2 ]);
          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 handler 选项在使用对象形式时设定回调 ( Vue )', ( done ) => {
      let result;
      const vm = new Vue({
        data: () => ({
          a: 1
        }),
        watch: {
          a: {
            handler: ( value, oldValue ) => {
              result = [ value, oldValue ];
            }
          }
        }
      });

      chai.expect( result ).is.undefined;

      vm.a = 2;
      chai.expect( result ).is.undefined;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        vm.a = 3;
        chai.expect( result ).is.deep.equals([ 2, 1 ]);
        vm.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 3, 2 ]);
          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 immediate 选项可以立即触发回调', ( done ) => {
      let result;
      const hu = new Hu({
        data: () => ({
          a: 1
        }),
        watch: {
          a: {
            immediate: true,
            handler: ( value, oldValue ) => {
              result = [ value, oldValue ];
            }
          }
        }
      });

      chai.expect( result ).is.deep.equals([ 1, undefined ]);

      hu.a = 2;
      chai.expect( result ).is.deep.equals([ 1, undefined ]);
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        hu.a = 3;
        chai.expect( result ).is.deep.equals([ 2, 1 ]);
        hu.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 3, 2 ]);
          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 immediate 选项可以立即触发回调 ( Vue )', ( done ) => {
      let result;
      const vm = new Vue({
        data: () => ({
          a: 1
        }),
        watch: {
          a: {
            immediate: true,
            handler: ( value, oldValue ) => {
              result = [ value, oldValue ];
            }
          }
        }
      });

      chai.expect( result ).is.deep.equals([ 1, undefined ]);

      vm.a = 2;
      chai.expect( result ).is.deep.equals([ 1, undefined ]);
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        vm.a = 3;
        chai.expect( result ).is.deep.equals([ 2, 1 ]);
        vm.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 3, 2 ]);
          done();
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项可以监听对象内部值的变化', ( done ) => {
      let index1 = 0;
      let index2 = 0;
      const hu = new Hu({
        data: () => ({
          a: { b: 1, c: 2 }
        }),
        watch: {
          a: [
            () => index1++,
            {
              deep: true,
              handler: () => index2++
            }
          ]
        }
      });

      chai.expect( index1 ).is.equals( 0 );
      chai.expect( index2 ).is.equals( 0 );

      hu.a.b = 2;
      hu.$nextTick(() => {
        chai.expect( index1 ).is.equals( 0 );
        chai.expect( index2 ).is.equals( 1 );

        hu.a.b = 3;
        hu.$nextTick(() => {
          chai.expect( index1 ).is.equals( 0 );
          chai.expect( index2 ).is.equals( 2 );

          hu.a.c = 3;
          hu.$nextTick(() => {
            chai.expect( index1 ).is.equals( 0 );
            chai.expect( index2 ).is.equals( 3 );

            hu.a = 1;
            hu.$nextTick(() => {
              chai.expect( index1 ).is.equals( 1 );
              chai.expect( index2 ).is.equals( 4 );

              done();
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项可以监听对象内部值的变化 ( Vue )', ( done ) => {
      let index1 = 0;
      let index2 = 0;
      const vm = new Vue({
        data: () => ({
          a: { b: 1, c: 2 }
        }),
        watch: {
          a: [
            () => index1++,
            {
              deep: true,
              handler: () => index2++
            }
          ]
        }
      });

      chai.expect( index1 ).is.equals( 0 );
      chai.expect( index2 ).is.equals( 0 );

      vm.a.b = 2;
      vm.$nextTick(() => {
        chai.expect( index1 ).is.equals( 0 );
        chai.expect( index2 ).is.equals( 1 );

        vm.a.b = 3;
        vm.$nextTick(() => {
          chai.expect( index1 ).is.equals( 0 );
          chai.expect( index2 ).is.equals( 2 );

          vm.a.c = 3;
          vm.$nextTick(() => {
            chai.expect( index1 ).is.equals( 0 );
            chai.expect( index2 ).is.equals( 3 );

            vm.a = 1;
            vm.$nextTick(() => {
              chai.expect( index1 ).is.equals( 1 );
              chai.expect( index2 ).is.equals( 4 );

              done();
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 上层兄弟节点改变时不会触发回调', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: {
            b: { c: 1 },
            d: 2
          }
        }),
        watch: {
          'a.b': {
            deep: true,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a.b.c = 2;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        hu.a.b.c = 3;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          hu.a.d = 3;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 2 );

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 上层兄弟节点改变时不会触发回调 ( Vue )', ( done ) => {
      let index = 0;
      const vm = new Vue({
        data: () => ({
          a: {
            b: { c: 1 },
            d: 2
          }
        }),
        watch: {
          'a.b': {
            deep: true,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      vm.a.b.c = 2;
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        vm.a.b.c = 3;
        vm.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          vm.a.d = 3;
          vm.$nextTick(() => {
            chai.expect( index ).is.equals( 2 );

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时且 deep 为 true 时, 子级 Object 对象节点内部改变时不会触发回调', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: {
            b: { c: 1 },
            d: 2
          }
        }),
        watch: {
          a: {
            deep: true,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a.d = 3;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        hu.a.b.c = 2;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 1 );

          hu.a.b.c = 3;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 1 );

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时且 deep 为大于子级层级的数字时, 子级 Object 对象节点内部改变时会触发回调', ( done ) => {
      let index = 0;
      const vm = new Hu({
        data: () => ({
          a: {
            b: { c: 1 },
            d: 2
          }
        }),
        watch: {
          a: {
            deep: -1,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      vm.a.d = 3;
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        vm.a.b.c = 2;
        vm.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          vm.a.b.c = 3;
          vm.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 子级 Object 对象节点内部改变时会触发回调 ( Vue ) ( 细节不一致 )', ( done ) => {
      let index = 0;
      const vm = new Vue({
        data: () => ({
          a: {
            b: { c: 1 },
            d: 2
          }
        }),
        watch: {
          a: {
            deep: true,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      vm.a.d = 3;
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        vm.a.b.c = 2;
        vm.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          vm.a.b.c = 3;
          vm.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时且 deep 为 true 时, 子级 Array 对象节点内部改变时不会触发回调', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: {
            b: [
              1
            ],
            d: 2
          }
        }),
        watch: {
          a: {
            deep: true,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a.d = 3;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        hu.a.b.splice( 0, 1, 2 );
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 1 );

          hu.a.b.splice( 0, 1, 3 );
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 1 );

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时且 deep 为大于子级层级的数字时, 子级 Array 对象节点内部改变时会触发回调', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: {
            b: [
              1
            ],
            d: 2
          }
        }),
        watch: {
          a: {
            deep: -1,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a.d = 3;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        hu.a.b.splice( 0, 1, 2 );
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          hu.a.b.splice( 0, 1, 3 );
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 子级 Array 对象节点内部改变时会触发回调 ( Vue ) ( 细节不一致 )', ( done ) => {
      let index = 0;
      const vm = new Vue({
        data: () => ({
          a: {
            b: [
              1
            ],
            d: 2
          }
        }),
        watch: {
          a: {
            deep: true,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      vm.a.d = 3;
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        vm.a.b.splice( 0, 1, 2 );
        vm.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          vm.a.b.splice( 0, 1, 3 );
          vm.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 将 deep 设置为数字可以设置深度监听几层对象', ( done ) => {
      let index1 = 0;
      let index2 = 0;
      const hu = new Hu({
        data: () => ({
          a: {
            b: { c: 1 },
            d: 2
          }
        }),
        watch: {
          a: [
            {
              deep: 2,
              handler: () => index2++
            },
            {
              deep: 1,
              handler: () => index1++
            }
          ]
        }
      });

      chai.expect( index2 ).is.equals( 0 );
      chai.expect( index1 ).is.equals( 0 );

      hu.a.d = 3;
      hu.$nextTick(() => {
        chai.expect( index2 ).is.equals( 1 );
        chai.expect( index1 ).is.equals( 1 );

        hu.a.b.c = 2;
        hu.$nextTick(() => {
          chai.expect( index2 ).is.equals( 2 );
          chai.expect( index1 ).is.equals( 1 );

          hu.a.b.c = 3;
          hu.$nextTick(() => {
            chai.expect( index2 ).is.equals( 3 );
            chai.expect( index1 ).is.equals( 1 );

            hu.a.d = 4;
            hu.$nextTick(() => {
              chai.expect( index2 ).is.equals( 4 );
              chai.expect( index1 ).is.equals( 2 );

              done();
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 将 deep 设置为数字可以设置深度监听几层对象 ( 数组 )', ( done ) => {
      let index1 = 0;
      let index2 = 0;
      const hu = new Hu({
        data: () => ({
          a: [
            [ 1 ],
            2
          ]
        }),
        watch: {
          a: [
            {
              deep: 2,
              handler: () => index2++
            },
            {
              deep: 1,
              handler: () => index1++
            }
          ]
        }
      });

      chai.expect( index2 ).is.equals( 0 );
      chai.expect( index1 ).is.equals( 0 );

      hu.a[ 1 ] = 3;
      hu.$nextTick(() => {
        chai.expect( index2 ).is.equals( 1 );
        chai.expect( index1 ).is.equals( 1 );

        hu.a[ 0 ][ 0 ] = 2;
        hu.$nextTick(() => {
          chai.expect( index2 ).is.equals( 2 );
          chai.expect( index1 ).is.equals( 1 );

          hu.a[ 0 ][ 0 ] = 3;
          hu.$nextTick(() => {
            chai.expect( index2 ).is.equals( 3 );
            chai.expect( index1 ).is.equals( 1 );

            hu.a[ 1 ] = 4;
            hu.$nextTick(() => {
              chai.expect( index2 ).is.equals( 4 );
              chai.expect( index1 ).is.equals( 2 );

              done();
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 将 deep 设置为数字可以设置深度监听几层对象 ( 数组及对象 )', ( done ) => {
      let index1 = 0;
      let index2 = 0;
      const hu = new Hu({
        data: () => ({
          a: [
            { b: 1 },
            2
          ]
        }),
        watch: {
          a: [
            {
              deep: 2,
              handler: () => index2++
            },
            {
              deep: 1,
              handler: () => index1++
            }
          ]
        }
      });

      chai.expect( index2 ).is.equals( 0 );
      chai.expect( index1 ).is.equals( 0 );

      hu.a[ 1 ] = 3;
      hu.$nextTick(() => {
        chai.expect( index2 ).is.equals( 1 );
        chai.expect( index1 ).is.equals( 1 );

        hu.a[ 0 ].b = 2;
        hu.$nextTick(() => {
          chai.expect( index2 ).is.equals( 2 );
          chai.expect( index1 ).is.equals( 1 );

          hu.a[ 0 ].b = 3;
          hu.$nextTick(() => {
            chai.expect( index2 ).is.equals( 3 );
            chai.expect( index1 ).is.equals( 1 );

            hu.a[ 1 ] = 4;
            hu.$nextTick(() => {
              chai.expect( index2 ).is.equals( 4 );
              chai.expect( index1 ).is.equals( 2 );

              done();
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 将 deep 设置为 Infinity 可以监听无限层级对象', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: {
            b1: 1,
            b2: {
              c1: 1,
              c2: {
                d1: 1,
                d2: {
                  e1: 1,
                  e2: {
                    f1: 1,
                    f2: { g: 1 }
                  }
                }
              }
            }
          }
        }),
        watch: {
          a: {
            deep: Infinity,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a.b1 = 2;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        hu.a.b2.c1 = 2;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          hu.a.b2.c2.d1 = 2;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            hu.a.b2.c2.d2.e1 = 2;
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 4 );

              hu.a.b2.c2.d2.e2.f1 = 2;
              hu.$nextTick(() => {
                chai.expect( index ).is.equals( 5 );

                hu.a.b2.c2.d2.e2.f2.g = 2;
                hu.$nextTick(() => {
                  chai.expect( index ).is.equals( 6 );

                  done();
                });
              });
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 将 deep 设置为 Infinity 可以监听无限层级对象 ( 数组 )', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: [
            1, [
              1, [
                1, [
                  1, [
                    1, [ 1 ]
                  ]
                ]
              ]
            ]
          ]
        }),
        watch: {
          a: {
            deep: Infinity,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a[ 0 ] = 2;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        hu.a[ 1 ][ 0 ] = 2;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          hu.a[ 1 ][ 1 ][ 0 ] = 2;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            hu.a[ 1 ][ 1 ][ 1 ][ 0 ] = 2;
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 4 );

              hu.a[ 1 ][ 1 ][ 1 ][ 1 ][ 0 ] = 2;
              hu.$nextTick(() => {
                chai.expect( index ).is.equals( 5 );

                hu.a[ 1 ][ 1 ][ 1 ][ 1 ][ 1 ][ 0 ] = 2;
                hu.$nextTick(() => {
                  chai.expect( index ).is.equals( 6 );

                  done();
                });
              });
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 将 deep 设置为 Infinity 可以监听无限层级对象 ( 数组及对象 )', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: [
            1, [
              1, [
                1, [
                  1, [
                    1, {
                      b: 1
                    }
                  ]
                ]
              ]
            ]
          ]
        }),
        watch: {
          a: {
            deep: Infinity,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a[ 0 ] = 2;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        hu.a[ 1 ][ 0 ] = 2;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          hu.a[ 1 ][ 1 ][ 0 ] = 2;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            hu.a[ 1 ][ 1 ][ 1 ][ 0 ] = 2;
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 4 );

              hu.a[ 1 ][ 1 ][ 1 ][ 1 ][ 0 ] = 2;
              hu.$nextTick(() => {
                chai.expect( index ).is.equals( 5 );

                hu.a[ 1 ][ 1 ][ 1 ][ 1 ][ 1 ].b = 2;
                hu.$nextTick(() => {
                  chai.expect( index ).is.equals( 6 );

                  done();
                });
              });
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 将 deep 设置为 -1 可以监听无限层级对象', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: {
            b1: 1,
            b2: {
              c1: 1,
              c2: {
                d1: 1,
                d2: {
                  e1: 1,
                  e2: {
                    f1: 1,
                    f2: { g: 1 }
                  }
                }
              }
            }
          }
        }),
        watch: {
          a: {
            deep: -1,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a.b1 = 2;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        hu.a.b2.c1 = 2;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          hu.a.b2.c2.d1 = 2;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            hu.a.b2.c2.d2.e1 = 2;
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 4 );

              hu.a.b2.c2.d2.e2.f1 = 2;
              hu.$nextTick(() => {
                chai.expect( index ).is.equals( 5 );

                hu.a.b2.c2.d2.e2.f2.g = 2;
                hu.$nextTick(() => {
                  chai.expect( index ).is.equals( 6 );

                  done();
                });
              });
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 将 deep 设置为 -1 可以监听无限层级对象 ( 数组 )', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: [
            1, [
              1, [
                1, [
                  1, [
                    1, [ 1 ]
                  ]
                ]
              ]
            ]
          ]
        }),
        watch: {
          a: {
            deep: -1,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a[ 0 ] = 2;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        hu.a[ 1 ][ 0 ] = 2;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          hu.a[ 1 ][ 1 ][ 0 ] = 2;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            hu.a[ 1 ][ 1 ][ 1 ][ 0 ] = 2;
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 4 );

              hu.a[ 1 ][ 1 ][ 1 ][ 1 ][ 0 ] = 2;
              hu.$nextTick(() => {
                chai.expect( index ).is.equals( 5 );

                hu.a[ 1 ][ 1 ][ 1 ][ 1 ][ 1 ][ 0 ] = 2;
                hu.$nextTick(() => {
                  chai.expect( index ).is.equals( 6 );

                  done();
                });
              });
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 将 deep 设置为 -1 可以监听无限层级对象 ( 数组及对象 )', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: [
            1, [
              1, [
                1, [
                  1, [
                    1, {
                      b: 1
                    }
                  ]
                ]
              ]
            ]
          ]
        }),
        watch: {
          a: {
            deep: -1,
            handler: () => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );

      hu.a[ 0 ] = 2;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );

        hu.a[ 1 ][ 0 ] = 2;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );

          hu.a[ 1 ][ 1 ][ 0 ] = 2;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );

            hu.a[ 1 ][ 1 ][ 1 ][ 0 ] = 2;
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 4 );

              hu.a[ 1 ][ 1 ][ 1 ][ 1 ][ 0 ] = 2;
              hu.$nextTick(() => {
                chai.expect( index ).is.equals( 5 );

                hu.a[ 1 ][ 1 ][ 1 ][ 1 ][ 1 ].b = 2;
                hu.$nextTick(() => {
                  chai.expect( index ).is.equals( 6 );

                  done();
                });
              });
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 使用 deep 选项监听对象时, 保证在监听无限引用的对象时是正常的', () => {
      const data1 = Hu.observable({ a: 1 });
      const data2 = Hu.observable({ b: 2 });

      data1.data2 = data2;
      data2.data1 = data1;

      new Hu({
        data: {
          data1,
          data2
        },
        watch: {
          data1: {
            deep: Infinity,
            handler: () => {}
          }
        }
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 值被删除时也会触发回调', ( done ) => {
      let result;
      const hu = new Hu({
        data: () => ({
          a: {
            b: 1
          }
        }),
        watch: {
          'a.b': ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      hu.a.b = 2;
      hu.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        hu.a.b = 3;
        hu.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 3, 2 ]);

          delete hu.a.b;
          hu.$nextTick(() => {
            chai.expect( result ).is.deep.equals([ undefined, 3 ]);
            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 值被删除时也会触发回调 ( Vue )', ( done ) => {
      let result;
      const vm = new Vue({
        data: () => ({
          a: {
            b: 1
          }
        }),
        watch: {
          'a.b': ( value, oldValue ) => result = [ value, oldValue ]
        }
      });

      vm.a.b = 2;
      vm.$nextTick(() => {
        chai.expect( result ).is.deep.equals([ 2, 1 ]);

        vm.a.b = 3;
        vm.$nextTick(() => {
          chai.expect( result ).is.deep.equals([ 3, 2 ]);

          Vue.delete( vm.a, 'b' );
          vm.$nextTick(() => {
            chai.expect( result ).is.deep.equals([ undefined, 3 ]);
            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对数组使用 length = num 的方式删除值后也会触发回调', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          arr: [ 1, 2, 3 ]
        }),
        watch: {
          arr: {
            deep: true,
            handler: ( value, oldValue ) => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );
      chai.expect( hu.arr ).is.deep.equals([ 1, 2, 3 ]);

      hu.arr.push( 4 );
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( hu.arr ).is.deep.equals([ 1, 2, 3, 4 ]);

        hu.arr.pop();
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );
          chai.expect( hu.arr ).is.deep.equals([ 1, 2, 3 ]);

          hu.arr.length = 1;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );
            chai.expect( hu.arr ).is.deep.equals([ 1 ]);

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对数组使用 length = num 的方式删除值后也会触发回调 ( Vue ) ( 不支持 )', ( done ) => {
      let index = 0;
      const vm = new Vue({
        data: () => ({
          arr: [ 1, 2, 3 ]
        }),
        watch: {
          arr: {
            deep: true,
            handler: ( value, oldValue ) => index++
          }
        }
      });

      chai.expect( index ).is.equals( 0 );
      chai.expect( vm.arr ).is.deep.equals([ 1, 2, 3 ]);

      vm.arr.push( 4 );
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( vm.arr ).is.deep.equals([ 1, 2, 3, 4 ]);

        vm.arr.pop();
        vm.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );
          chai.expect( vm.arr ).is.deep.equals([ 1, 2, 3 ]);

          Vue.set( vm.arr, 'length', 1 );
          vm.$nextTick(() => {
            chai.expect( index ).is.equals( 2 );
            chai.expect( vm.arr ).is.deep.equals([ 1 ]);

            done();
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对数组的 length 进行监听, 不管给 length 赋了什么类型的值, 触发回调时的应该是真实的 length', ( done ) => {
      let result;
      let index = 0;
      const hu = new Hu({
        data: () => ({
          arr: [ ]
        }),
        watch: {
          'arr.length': ( value , oldValue ) => {
            index++;
            result = [ value, oldValue ];
          }
        }
      });

      hu.arr.length = 1;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( result ).is.deep.equals([ 1, 0 ]);

        hu.arr.length = 3;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );
          chai.expect( result ).is.deep.equals([ 3, 1 ]);

          hu.arr.length = '4';
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );
            chai.expect( result ).is.deep.equals([ 4, 3 ]);

            hu.arr.length = '0';
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 4 );
              chai.expect( result ).is.deep.equals([ 0, 4 ]);

              done();
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对数组的 length 进行监听, 不管给 length 赋了什么类型的值, 触发回调时的应该是真实的 length ( Vue ) ( 不支持 )', ( done ) => {
      let result;
      let index = 0;
      const vm = new Vue({
        data: () => ({
          arr: [ ]
        }),
        watch: {
          'arr.length': ( value , oldValue ) => {
            index++;
            result = [ value, oldValue ];
          }
        }
      });

      vm.$set( vm.arr, 'length', 1 );
      vm.$nextTick(() => {
        chai.expect( index ).is.equals( 0 );
        chai.expect( result ).is.undefined;

        vm.$set( vm.arr, 'length', 3 );
        vm.$nextTick(() => {
          chai.expect( index ).is.equals( 0 );
          chai.expect( result ).is.undefined;

          vm.$set( vm.arr, 'length', '4' );
          vm.$nextTick(() => {
            chai.expect( index ).is.equals( 0 );
            chai.expect( result ).is.undefined;

            vm.$set( vm.arr, 'length', '0' );
            vm.$nextTick(() => {
              chai.expect( index ).is.equals( 0 );
              chai.expect( result ).is.undefined;

              done();
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 在触发的回调内修改监听的值会立即再触发回调', ( done ) => {
      const steps = [];
      const hu = new Hu({
        data: () => ({
          a: 1
        }),
        watch: {
          a: [
            value => {
              steps.push( 1 );
              hu.a = 3;
            },
            value => steps.push( 2 ),
            value => steps.push( 3 )
          ]
        }
      });

      hu.a = 2;
      hu.$nextTick(() => {
        chai.expect( steps ).is.deep.equals([ 1, 1, 2, 3 ]);

        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 在触发的回调内修改监听的值会立即再触发回调 ( Vue )', ( done ) => {
      const steps = [];
      const vm = new Vue({
        data: () => ({
          a: 1
        }),
        watch: {
          a: [
            value => {
              steps.push( 1 );
              vm.a = 3;
            },
            value => steps.push( 2 ),
            value => steps.push( 3 )
          ]
        }
      });

      vm.a = 2;
      vm.$nextTick(() => {
        chai.expect( steps ).is.deep.equals([ 1, 1, 2, 3 ]);

        done();
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对数组内置方法对数组内容进行修改时也会触发回调', ( done ) => {
      let index = 0;
      const hu = new Hu({
        data: () => ({
          a: [ 1, 2 ]
        }),
        watch: {
          a: {
            deep: true,
            immediate: true,
            handler: () => index++
          }
        }
      });

      chai.expect( hu.a ).is.deep.equals([ 1, 2 ]);
      chai.expect( index ).is.equals( 1 );

      hu.a.push( 3 );
      hu.$nextTick(() => {
        chai.expect( hu.a ).is.deep.equals([ 1, 2, 3 ]);
        chai.expect( index ).is.equals( 2 );

        hu.a.pop();
        hu.$nextTick(() => {
          chai.expect( hu.a ).is.deep.equals([ 1, 2 ]);
          chai.expect( index ).is.equals( 3 );

          hu.a.shift();
          hu.$nextTick(() => {
            chai.expect( hu.a ).is.deep.equals([ 2 ]);
            chai.expect( index ).is.equals( 4 );

            hu.a.unshift( 4 );
            hu.$nextTick(() => {
              chai.expect( hu.a ).is.deep.equals([ 4, 2 ]);
              chai.expect( index ).is.equals( 5 );

              hu.a.splice( 1, 0, 5 );
              hu.$nextTick(() => {
                chai.expect( hu.a ).is.deep.equals([ 4, 5, 2 ]);
                chai.expect( index ).is.equals( 6 );

                hu.a.sort();
                hu.$nextTick(() => {
                  chai.expect( hu.a ).is.deep.equals([ 2, 4, 5 ]);
                  chai.expect( index ).is.equals( 7 );

                  hu.a.reverse();
                  hu.$nextTick(() => {
                    chai.expect( hu.a ).is.deep.equals([ 5, 4, 2 ]);
                    chai.expect( index ).is.equals( 8 );

                    done();
                  });
                });
              });
            });
          });
        });
      });
    });

    it( '使用 watch 对实例内的属性进行监听, 对数组内置方法对数组内容进行修改时也会触发回调 ( Vue ) ( 不一致 )', ( done ) => {
      let index = 0;
      const vm = new Vue({
        data: () => ({
          a: [ 1, 2 ]
        }),
        watch: {
          a: {
            immediate: true,
            handler: () => index++
          }
        }
      });

      chai.expect( vm.a ).is.deep.equals([ 1, 2 ]);
      chai.expect( index ).is.equals( 1 );

      vm.a.push( 3 );
      vm.$nextTick(() => {
        chai.expect( vm.a ).is.deep.equals([ 1, 2, 3 ]);
        chai.expect( index ).is.equals( 2 );

        vm.a.pop();
        vm.$nextTick(() => {
          chai.expect( vm.a ).is.deep.equals([ 1, 2 ]);
          chai.expect( index ).is.equals( 3 );

          vm.a.shift();
          vm.$nextTick(() => {
            chai.expect( vm.a ).is.deep.equals([ 2 ]);
            chai.expect( index ).is.equals( 4 );

            vm.a.unshift( 4 );
            vm.$nextTick(() => {
              chai.expect( vm.a ).is.deep.equals([ 4, 2 ]);
              chai.expect( index ).is.equals( 5 );

              vm.a.splice( 1, 0, 5 );
              vm.$nextTick(() => {
                chai.expect( vm.a ).is.deep.equals([ 4, 5, 2 ]);
                chai.expect( index ).is.equals( 6 );

                vm.a.sort();
                vm.$nextTick(() => {
                  chai.expect( vm.a ).is.deep.equals([ 2, 4, 5 ]);
                  chai.expect( index ).is.equals( 7 );

                  vm.a.reverse();
                  vm.$nextTick(() => {
                    chai.expect( vm.a ).is.deep.equals([ 5, 4, 2 ]);
                    chai.expect( index ).is.equals( 8 );

                    done();
                  });
                });
              });
            });
          });
        });
      });
    });

  });

  describe( 'options.styles', () => {

    /** @type {string} */
    let customName;
    /** @type {Element} */
    let custom;
    /** @type {$hu} */
    let hu;

    beforeEach(() => {
      customName = window.customName;
    });

    afterEach(() => {
      custom && custom.$remove();
      hu && hu.$destroy();
    });

    // ------------------------------------

    it( '使用 styles 选项定义实例的样式 ( 一 )', () => {
      Hu.define( customName, {
        styles: `
        :host > div{
          position: fixed;
        }
      `,
        render( html ){
          return html`<div ref="div"></div>`;
        }
      });

      custom = document.createElement( customName ).$appendTo( document.body );
      hu = custom.$hu;

      chai.expect( getComputedStyle( hu.$refs.div ).position ).is.equals( 'fixed' );
    });

    it( '使用 styles 选项定义实例的样式 ( 二 )', () => {
      custom = document.createElement('div').$appendTo( document.body ).$prop( 'id', customName );
      hu = new Hu({
        el: custom,
        styles: `
        #${ customName } > div{
          position: fixed;
        }
      `,
        render( html ){
          return html`<div ref="div"></div>`;
        }
      });

      chai.expect( getComputedStyle( hu.$refs.div ).position ).is.equals( 'fixed' );
    });

    it( '使用 styles 选项定义实例的样式, 使用数组传参 ( 一 )', () => {
      Hu.define( customName, {
        styles: [
          `:host > div{ position: fixed }`,
          `:host > div{ top: 0 }`,
          `:host > div{ left: 0 }`
        ],
        render( html ){
          return html`<div ref="div"></div>`;
        }
      });

      custom = document.createElement( customName ).$appendTo( document.body );
      hu = custom.$hu;

      chai.expect( getComputedStyle( hu.$refs.div ).position ).is.equals( 'fixed' );
      chai.expect( getComputedStyle( hu.$refs.div ).top ).is.equals( '0px' );
      chai.expect( getComputedStyle( hu.$refs.div ).left ).is.equals( '0px' );
    });

    it( '使用 styles 选项定义实例的样式, 使用数组传参 ( 二 )', () => {
      custom = document.createElement('div').$appendTo( document.body ).$prop( 'id', customName );
      hu = new Hu({
        el: custom,
        styles: [
          `#${ customName } > div{ position: fixed }`,
          `#${ customName } > div{ top: 0 }`,
          `#${ customName } > div{ left: 0 }`
        ],
        render( html ){
          return html`<div ref="div"></div>`;
        }
      });

      chai.expect( getComputedStyle( hu.$refs.div ).position ).is.equals( 'fixed' );
      chai.expect( getComputedStyle( hu.$refs.div ).top ).is.equals( '0px' );
      chai.expect( getComputedStyle( hu.$refs.div ).left ).is.equals( '0px' );
    });

    it( '使用 styles 选项传入自定义元素的样式 ( 通配选择器 )', () => {
      Hu.define( customName, {
        styles: `
        *{ position: fixed }
      `,
        render( html ){
          return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <div ref="div4"></div>
          </div>
        `;
        }
      });

      custom = document.createElement( customName ).$appendTo( document.body );
      hu = custom.$hu;

      chai.expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('fixed');
    });

    it( '使用 styles 选项传入自定义元素的样式 ( 标签选择器 )', () => {
      Hu.define( customName, {
        styles: `
        div{ position: fixed }
      `,
        render( html ){
          return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <span ref="div4"></span>
          </div>
        `;
        }
      });

      custom = document.createElement( customName ).$appendTo( document.body );
      hu = custom.$hu;

      chai.expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('static');
    });

    it( '使用 styles 选项传入自定义元素的样式 ( 类选择器 )', () => {
      Hu.define( customName, {
        styles: `
        .test{ position: fixed }
      `,
        render( html ){
          return html`
          <div class="test" ref="div1">
            <div class="test" ref="div2">
              <div class="test" ref="div3"></div>
            </div>
            <div ref="div4"></div>
          </div>
        `;
        }
      });

      custom = document.createElement( customName ).$appendTo( document.body );
      hu = custom.$hu;

      chai.expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('static');
    });

    it( '使用 styles 选项传入自定义元素的样式 ( id 选择器 )', () => {
      Hu.define( customName, {
        styles: `
        #test{ position: fixed }
      `,
        render( html ){
          return html`
          <div ref="div1">
            <div ref="div2">
              <div id="test" ref="div3"></div>
            </div>
            <div ref="div4"></div>
          </div>
        `;
        }
      });

      custom = document.createElement( customName ).$appendTo( document.body );
      hu = custom.$hu;

      chai.expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('static');
      chai.expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('static');
      chai.expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('static');
    });

    it( '使用 styles 选项传入自定义元素的样式 ( 后代选择器 )', () => {
      Hu.define( customName, {
        styles: `
        div div{ position: fixed }
      `,
        render( html ){
          return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <div ref="div4"></div>
          </div>
        `;
        }
      });

      custom = document.createElement( customName ).$appendTo( document.body );
      hu = custom.$hu;

      chai.expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('static');
      chai.expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('fixed');
    });

    it( '使用 styles 选项传入自定义元素的样式 ( 子选择器 )', () => {
      Hu.define( customName, {
        styles: `
        div > div{ position: fixed }
      `,
        render( html ){
          return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <div ref="div4"></div>
          </div>
        `;
        }
      });

      custom = document.createElement( customName ).$appendTo( document.body );
      hu = custom.$hu;

      chai.expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('static');
      chai.expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('fixed');
    });

    it( '使用 styles 选项传入自定义元素的样式 ( 相邻兄弟选择器 )', () => {
      Hu.define( customName, {
        styles: `
        div + div{ position: fixed }
      `,
        render( html ){
          return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <div ref="div4"></div>
            <span></span>
            <div ref="div5"></div>
          </div>
        `;
        }
      });

      custom = document.createElement( customName ).$appendTo( document.body );
      hu = custom.$hu;

      chai.expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('static');
      chai.expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('static');
      chai.expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('static');
      chai.expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div5 ).position ).is.equals('static');
    });

    it( '使用 styles 选项传入自定义元素的样式 ( 匹配选择器 )', () => {
      Hu.define( customName, {
        styles: `
        div ~ div{ position: fixed }
      `,
        render( html ){
          return html`
          <div ref="div1">
            <div ref="div2">
              <div ref="div3"></div>
            </div>
            <div ref="div4"></div>
            <span></span>
            <div ref="div5"></div>
          </div>
        `;
        }
      });

      custom = document.createElement( customName ).$appendTo( document.body );
      hu = custom.$hu;

      chai.expect( getComputedStyle( hu.$refs.div1 ).position ).is.equals('static');
      chai.expect( getComputedStyle( hu.$refs.div2 ).position ).is.equals('static');
      chai.expect( getComputedStyle( hu.$refs.div3 ).position ).is.equals('static');
      chai.expect( getComputedStyle( hu.$refs.div4 ).position ).is.equals('fixed');
      chai.expect( getComputedStyle( hu.$refs.div5 ).position ).is.equals('fixed');
    });

  });

  describe( 'options.render', () => {

    it( '使用 html 创建的模板进行渲染', () => {
      const div = document.createElement('div');

      new Hu({
        el: div,
        render( html ){
          return html`<span>123</span>`;
        }
      });

      chai.expect( div.$first().nodeName ).is.equals('SPAN');
      chai.expect( div.$first().innerHTML ).is.equals('123');
      chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<span>123</span>`);
    });

    it( '使用 html 创建的模板组成的数组进行渲染', () => {
      const div = document.createElement('div');

      new Hu({
        el: div,
        render( html ){
          return [
            html`<span>1</span>`,
            html`<span>2</span>`,
            html`<span>3</span>`
          ];
        }
      });

      chai.expect( div.$child().length ).is.equals( 3 );
      chai.expect( div.$child('span').length ).is.equals( 3 );
      chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<span>1</span><span>2</span><span>3</span>`);
    });

    it( '使用字符串进行渲染', () => {
      const div = document.createElement('div');

      new Hu({
        el: div,
        render(){
          return '<span>123</span>';
        }
      });

      chai.expect( div.$first() ).is.null;
      chai.expect( div.innerText ).is.equals('<span>123</span>');
    });

    it( '使用 element 元素进行渲染', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');

      new Hu({
        el: div,
        render(){
          span.innerHTML = 1234;
          return span;
        }
      });

      chai.expect( div.$first() ).is.equals( span );
      chai.expect( div.$first().innerHTML ).is.equals('1234');
      chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`<span>1234</span>`);
    });

    it( '使用不支持的对象时会尽可能的进行转码进行渲染', () => {
      const div = document.createElement('div');

      new Hu({
        el: div,
        render(){
          return {
            a: 1,
            b: 2,
            c: [ 3 ]
          };
        }
      });

      chai.expect( div.$first() ).is.null;
      chai.expect( div.innerText ).is.equals('{\n  "a": 1,\n  "b": 2,\n  "c": [\n    3\n  ]\n}');
    });

    it( '使用 new 创建的实例会在绑定 el 时立即运行 render 方法进行渲染', () => {
      let isRender = false;
      let index = 0;

      new Hu({
        el: document.createElement('div'),
        render(){
          isRender = true;
          index++;
        }
      });

      chai.expect( isRender ).is.true;
      chai.expect( index ).is.equals( 1 );
    });

    it( '使用 new 创建的实例会在绑定 el 时立即运行 render 方法进行渲染 ( use $mount )', () => {
      let isRender = false;
      let index = 0;

      const hu = new Hu({
        render(){
          isRender = true;
          index++;
        }
      });

      chai.expect( isRender ).is.false;
      chai.expect( index ).is.equals( 0 );

      hu.$mount( document.createElement('div') );

      chai.expect( isRender ).is.true;
      chai.expect( index ).is.equals( 1 );
    });

    it( '使用自定义元素创建的实例会在被添加到 DOM 中时立即运行 render 方法进行渲染', () => {
      const customName = window.customName;
      let isRender = false;

      Hu.define( customName, {
        render(){
          isRender = true;
        }
      });

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`);

      chai.expect( isRender ).is.false;

      div.$appendTo( document.body );

      chai.expect( isRender ).is.true;

      div.$remove();
    });

    it( '执行 render 方法时会进行依赖收集', ( done ) => {
      let index = 0;
      const div = document.createElement('div');
      const data = {
        a: 1
      };
      const dataProxy = Hu.observable({
        b: 2
      });

      const hu = new Hu({
        data: () => ({
          c: 3
        }),
        render(){
          index++;
          return `a: ${ data.a }; b: ${ dataProxy.b }; c: ${ this.c };`;
        }
      });

      chai.expect( index ).is.equals( 0 );
      chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(``);

      hu.$mount( div );

      chai.expect( index ).is.equals( 1 );
      chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);

      data.a = 2;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);

        dataProxy.b = 3;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );
          chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 3;`);

          hu.c = 4;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );
            chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);

            data.a = 5;
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 3 );
              chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);

              dataProxy.b = 6;
              hu.$nextTick(() => {
                chai.expect( index ).is.equals( 4 );
                chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 5; b: 6; c: 4;`);

                hu.c = 7;
                hu.$nextTick(() => {
                  chai.expect( index ).is.equals( 5 );
                  chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 5; b: 6; c: 7;`);

                  done();
                });
              });
            });
          });
        });
      });
    });

    it( '执行 render 方法时会进行依赖收集 ( 二 )', ( done ) => {
      let index = 0;
      const customName = window.customName;
      const data = {
        a: 1
      };
      const dataProxy = Hu.observable({
        b: 2
      });

      Hu.define( customName, {
        data: () => ({
          c: 3
        }),
        render(){
          index++;
          return `a: ${ data.a }; b: ${ dataProxy.b }; c: ${ this.c };`;
        }
      });

      chai.expect( index ).is.equals( 0 );

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( index ).is.equals( 1 );
      chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);

      data.a = 2;
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);

        dataProxy.b = 3;
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );
          chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 3;`);

          hu.c = 4;
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );
            chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);

            data.a = 5;
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 3 );
              chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);

              dataProxy.b = 6;
              hu.$nextTick(() => {
                chai.expect( index ).is.equals( 4 );
                chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 5; b: 6; c: 4;`);

                hu.c = 7;
                hu.$nextTick(() => {
                  chai.expect( index ).is.equals( 5 );
                  chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 5; b: 6; c: 7;`);

                  div.$delete();

                  done();
                });
              });
            });
          });
        });
      });
    });

    it( '当 render 方法的依赖更新后, 将会在下一个 tick 触发 render 方法重新渲染', ( done ) => {
      let index = 0;
      const div = document.createElement('div');
      const data = {
        a: 1
      };
      const dataProxy = Hu.observable({
        b: 2
      });

      const hu = new Hu({
        data: () => ({
          c: 3
        }),
        render(){
          index++;
          return `a: ${ data.a }; b: ${ dataProxy.b }; c: ${ this.c };`;
        }
      });

      chai.expect( index ).is.equals( 0 );
      chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(``);

      hu.$mount( div );

      chai.expect( index ).is.equals( 1 );
      chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);

      data.a = 2;
      chai.expect( index ).is.equals( 1 );
      chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);

        dataProxy.b = 3;
        chai.expect( index ).is.equals( 1 );
        chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 1; b: 2; c: 3;`);
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );
          chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 3;`);

          hu.c = 4;
          chai.expect( index ).is.equals( 2 );
          chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 3;`);
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );
            chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);

            data.a = 5;
            chai.expect( index ).is.equals( 3 );
            chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 3 );
              chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);

              dataProxy.b = 6;
              chai.expect( index ).is.equals( 3 );
              chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 2; b: 3; c: 4;`);
              hu.$nextTick(() => {
                chai.expect( index ).is.equals( 4 );
                chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 5; b: 6; c: 4;`);

                hu.c = 7;
                chai.expect( index ).is.equals( 4 );
                chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 5; b: 6; c: 4;`);
                hu.$nextTick(() => {
                  chai.expect( index ).is.equals( 5 );
                  chai.expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`a: 5; b: 6; c: 7;`);

                  done();
                });
              });
            });
          });
        });
      });
    });

    it( '当 render 方法的依赖更新后, 将会在下一个 tick 触发 render 方法重新渲染 ( 二 )', ( done ) => {
      let index = 0;
      const customName = window.customName;
      const data = {
        a: 1
      };
      const dataProxy = Hu.observable({
        b: 2
      });

      Hu.define( customName, {
        data: () => ({
          c: 3
        }),
        render(){
          index++;
          return `a: ${ data.a }; b: ${ dataProxy.b }; c: ${ this.c };`;
        }
      });

      chai.expect( index ).is.equals( 0 );

      const div = document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body );
      const custom = div.firstElementChild;
      const hu = custom.$hu;

      chai.expect( index ).is.equals( 1 );
      chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);

      data.a = 2;
      chai.expect( index ).is.equals( 1 );
      chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);
      hu.$nextTick(() => {
        chai.expect( index ).is.equals( 1 );
        chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);

        dataProxy.b = 3;
        chai.expect( index ).is.equals( 1 );
        chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 1; b: 2; c: 3;`);
        hu.$nextTick(() => {
          chai.expect( index ).is.equals( 2 );
          chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 3;`);

          hu.c = 4;
          chai.expect( index ).is.equals( 2 );
          chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 3;`);
          hu.$nextTick(() => {
            chai.expect( index ).is.equals( 3 );
            chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);

            data.a = 5;
            chai.expect( index ).is.equals( 3 );
            chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);
            hu.$nextTick(() => {
              chai.expect( index ).is.equals( 3 );
              chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);

              dataProxy.b = 6;
              chai.expect( index ).is.equals( 3 );
              chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 2; b: 3; c: 4;`);
              hu.$nextTick(() => {
                chai.expect( index ).is.equals( 4 );
                chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 5; b: 6; c: 4;`);

                hu.c = 7;
                chai.expect( index ).is.equals( 4 );
                chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 5; b: 6; c: 4;`);
                hu.$nextTick(() => {
                  chai.expect( index ).is.equals( 5 );
                  chai.expect( stripExpressionMarkers( hu.$el.textContent ) ).is.equals(`a: 5; b: 6; c: 7;`);

                  div.$delete();

                  done();
                });
              });
            });
          });
        });
      });
    });

  });

}(chai));
