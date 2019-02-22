import { targetStack } from "./collectingDependents";
import each from "../../../shared/util/each";
import isObject from "../../../shared/util/isObject";


/**
 * 存放创建过的观察者
 */
export const observeMap = new WeakMap();

/**
 * 为传入对象创建观察者
 */
export function observe( target ){
  // 如果创建过观察者
  // 则返回之前创建的观察者
  if( observeMap.has( target ) ) return observeMap.get( target );
  // 否则立即创建观察者进行返回
  return createObserver( target );
}

function createObserver( target ){
  /** 当前对象的被依赖数据 / 监听数据 */
  const watch = new Proxy({}, {
    set: ( target, name, value ) => {
      return ( target[ name ] || ( target[ name ] = [] ) ).push( value ), true
    }
  });
  /** 当前对象的 Proxy 对象 */
  const proxy = new Proxy( target, {
    get: createObserverProxyGetter( watch ),
    set: createObserverProxySetter( watch )
  });

  // 存储观察者对象
  observeMap.set( target, proxy );

  // 递归创建观察者
  each( target, ( key, target ) => {
    if( isObject( target ) ){
      target[ key ] = createObserver( target );
    }
  });

  return proxy;
}


const createObserverProxyGetter = watch => ( target, name ) => {
  // 获取当前在收集依赖的那个方法的 deps 对象
  const deps = targetStack[ targetStack.length - 1 ];

  // 当前有正在收集依赖的方法
  if( deps ){
    // 将正在收集依赖的方法进行存储
    // 后续移除旧依赖时或响应更新时需要用到
    const fn = watch[ name ] = deps.fn;
    // 给 deps 对象传入一个方法, 用于移除依赖
    deps.push(() => {
      const watches = watch[ name ];
      watches.splice( watches.indexOf( fn ), 1 );
    });
  }

  return target[ name ];
};

const createObserverProxySetter = watch => ( target, name, value ) => {
  const watches = watch[ name ];

  // 改变值
  target[ name ] = value;

  // 如果有方法依赖于当前值, 则运行那个方法以达到更新的目的
  if( watches && watches.length ){
    for( const watcher of watches ) watcher();
  }

  return true;
};