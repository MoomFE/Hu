import { targetStack } from "./const";
import isEqual from "../../shared/util/isEqual";
import { create } from "../../shared/global/Object/index";
import { getOwnPropertyDescriptor, deleteProperty, ownKeys, has, set } from "../../shared/global/Reflect/index";
import emptyObject from "../../shared/const/emptyObject";
import isFunction from "../../shared/util/isFunction";
import { hasOwnProperty } from "../../shared/global/Object/prototype";
import isPlainObject from "../../shared/util/isPlainObject";
import { isArray } from "../../shared/global/Array/index";
import each from "../../shared/util/each";


/**
 * 存放原始对象和观察者对象及其选项参数的映射
 */
export const observeMap = new WeakMap();

/**
 * 存放观察者对象和观察者对象选项参数的映射
 */
export const observeProxyMap = new WeakMap();

/**
 * 创建无参数观察对象
 */
export function observable( obj ){
  return isPlainObject( obj ) || isArray( obj ) ? observe( obj )
                                                : obj;
}

/**
 * 为传入对象创建观察者
 */
export function observe( target, options ){
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
    arrayLengthHook( targetProxy, value, oldValue );
  }

  // 触发更新
  triggerUpdate( subs, deepSubs, lastValue, set, name, value );

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
const createObserverProxyOwnKeys = ({ deepSubs }) => ( target ) => {

  // 获取当前正在收集依赖的 watcher
  const watcher = targetStack.target;

  // 当前有正在收集依赖的 watcher
  if( watcher ){
    // 标记深度监听订阅信息
    deepSubs.add( watcher );
  }

  return ownKeys( target );
}

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