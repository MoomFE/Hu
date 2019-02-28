import { targetStack } from "./collectingDependents";
import isObject from "../../../shared/util/isObject";
import isEqual from "../../../shared/util/isEqual";
import isArray from "../../../shared/global/Array/isArray";


/**
 * 存放创建过的观察者
 */
export const observeMap = new WeakMap();

/**
 * 存放观察者对象的选项参数
 */
export const observeOptionsMap = new WeakMap();

/**
 * 为传入对象创建观察者
 */
export function observe( target ){
  // 如果创建过观察者
  // 则返回之前创建的观察者
  if( observeMap.has( target ) ) return observeMap.get( target );
  // 如果传入的就是观察者对象
  // 则直接返回
  if( observeOptionsMap.has( target ) ) return target;
  // 否则立即创建观察者进行返回
  return createObserver( target );
}

function createObserver( target ){
  /** 当前对象的被依赖数据 / 监听数据 */
  const watch = {};
  /** 当前对象的 Proxy 对象 */
  const proxy = new Proxy( target, {
    get: createObserverProxyGetter( watch ),
    set: createObserverProxySetter( watch )
  });

  // 存储观察者对象
  observeMap.set( target, proxy );
  // 存储观察者选项参数
  observeOptionsMap.set( proxy, {
    // 存储原始对象
    target,
    // 深度监听
    // deepWatch: []
  });

  return proxy;
}

/**
 * 创建依赖收集的响应方法
 */
const createObserverProxyGetter = watch => ( target, name, targetProxy ) => {
  // 获取当前在收集依赖的那个方法的参数
  const depsOptions = targetStack[ targetStack.length - 1 ];

  // 当前有正在收集依赖的方法
  if( depsOptions ){
    /** 当前参数的依赖数组 */
    const watches = watch[ name ] || ( watch[ name ] = [] );
    // 将正在收集依赖的方法参数进行存储
    // 后续移除旧依赖时或响应更新时需要用到
    watches.push( depsOptions );
    // 给 deps 对象传入一个方法, 用于移除依赖
    depsOptions.deps.push(() => {
      watches.splice( watches.indexOf( depsOptions ), 1 );
    });
    // 深度 watcher
    // if( depsOptions.isDeep ){
    //   const deepTarget = target[ name ];

    //   if( isObject( deepTarget ) && !isArray( deepTarget ) ){
    //     const deepTargetProxy = observe( deepTarget );
    //     const observeOptions = observeOptionsMap.get( deepTargetProxy );
    //     const deepWatch = observeOptions.deepWatch || ( observeOptions.deepWatch = [] );
  
    //     deepWatch.push( depsOptions );
    //     depsOptions.deps.push(() => {
    //       deepWatch.splice( deepWatch.indexOf( depsOptions ), 1 );
    //     });
      // }
    // }
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
const createObserverProxySetter = watch => ( target, name, value, targetProxy ) => {

  if( isEqual( target[ name ], value ) ){
    return true;
  }

  const watches = watch[ name ];
  // const deepWatch = observeOptionsMap.get( targetProxy ).deepWatch;

  // 改变值
  target[ name ] = value;

  // 如果有方法依赖于当前值, 则运行那个方法以达到更新的目的
  if( watches && watches.length ){
    for( const depsOptions of watches ){
      // 那个方法是没有被其它方法依赖的计算属性
      // 通知它在下次获取时更新值
      if( depsOptions.isCollected ){
        depsOptions.forceUpdate = true;
      }else{
        depsOptions.fn();
      }
    }
  }

  // 深度 Watcher
  // if( deepWatch && deepWatch.length ){
  //   for( const depsOptions of deepWatch ){
  //     depsOptions.fn();
  //   }
  // }

  return true;
};