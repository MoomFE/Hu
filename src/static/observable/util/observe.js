import { targetStack } from "./index";
import isObject from "../../../shared/util/isObject";
import isEqual from "../../../shared/util/isEqual";
import eachSet from "../../../shared/util/eachSet";
import getOwnPropertyDescriptor from "../../../shared/global/Object/getOwnPropertyDescriptor";


/**
 * 存放原始对象和观察者对象及其选项参数的映射
 */
export const observeMap = new WeakMap();

/**
 * 存放观察者对象和观察者对象选项参数的映射
 */
export const observeProxyMap = new WeakMap();

/**
 * 为传入对象创建观察者
 */
export function observe( target ){
  // 如果创建过观察者
  // 则返回之前创建的观察者
  if( observeMap.has( target ) ) return observeMap.get( target ).proxy;
  // 如果传入的就是观察者对象
  // 则直接返回
  if( observeProxyMap.has( target ) ) return target;
  // 否则立即创建观察者进行返回
  return createObserver( target );
}

function createObserver( target ){
  /** 当前对象的观察者对象 */
  const proxy = new Proxy( target, {
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
  };

  // 存储观察者选项参数
  observeMap.set( target, observeOptions );
  observeProxyMap.set( proxy, observeOptions );

  return proxy;
}

/**
 * 创建依赖收集的响应方法
 */
const createObserverProxyGetter = ( target, name, targetProxy ) => {

  // 需要获取的值是使用 Object.defineProperty 定义的属性
  if( ( getOwnPropertyDescriptor( target, name ) || {} ).get ){
    return target[ name ];
  }

  // 获取当前在收集依赖的那个方法的参数
  const dependentsOptions = targetStack[ targetStack.length - 1 ];

  // 当前有正在收集依赖的方法
  if( dependentsOptions ){
    const watches = observeMap.get( target ).watches;
    let watch = watches.get( name );

    // 当前参数没有被监听过, 初始化监听数组
    if( !watch ){
      watch = new Set();
      watches.set( name, watch );
    }

    // 添加依赖方法信息到 watch
    // 当前值被改变时, 会调用依赖方法
    watch.add( dependentsOptions );
    // 添加 watch 的信息到依赖收集去
    // 当依赖方法被重新调用, 会移除依赖
    dependentsOptions.deps.add( watch );
  }

  const value = target[ name ];

  // 如果获取的值是对象类型
  // 则返回它的观察者对象
  return isObject( value ) ? observe( value )
                           : value;
};

/**
 * 创建响应更新方法
 */
const createObserverProxySetter = ( target, name, value, targetProxy ) => {

  // 需要修改的值是使用 Object.defineProperty 定义的属性
  if( ( getOwnPropertyDescriptor( target, name ) || {} ).set ){
    target[ name ] = value;
    return true;
  }

  // 值完全相等, 不进行修改
  if( isEqual( target[ name ], value ) ){
    return true;
  }

  // 改变值
  target[ name ] = value;

  // 获取子级监听数据
  const { watches, deepWatches } = observeMap.get( target );
  // 获取当前参数的被监听数据
  let watch = watches.get( name );

  // 如果有方法依赖于当前值, 则运行那个方法以达到更新的目的
  if( watch && watch.size ){
    eachSet( watch, dependentsOptions => {
      // 那个方法是没有被其它方法依赖的计算属性
      // 通知它在下次获取时更新值
      if( dependentsOptions.notBeingCollected ){
        recursionSetShouldUpdate( dependentsOptions );
      }else{
        dependentsOptions.fn();
      }
    });
  }

  // 响应深度监听
  if( deepWatches.size ){
    eachSet( deepWatches, dependentsOptions => {
      dependentsOptions.fn();
    });
  }

  return true;
};


/**
 * 递归提醒
 */
function recursionSetShouldUpdate( dependentsOptions ){
  dependentsOptions.shouldUpdate = true;

  if( dependentsOptions.relier ){
    recursionSetShouldUpdate( dependentsOptions.relier );
  }
}