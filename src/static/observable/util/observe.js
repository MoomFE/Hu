import each from "../../../shared/util/each";
import isObject from "../../../shared/util/isObject";

/**
 * 调用堆栈
 */
export const targetStack = [];

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
  if( observeMap.has( target ) ) return observeMap.get( target ).proxy;
  // 否则立即创建观察者进行返回
  return createObserver( target );
}

/**
 * 为传入方法收集依赖
 */
export function collectingDeps( fn ){
  return () => {

  };
}

function createObserver( target ){
  /** 当前对象的 Proxy 对象 */
  const proxy = new Proxy( target, {
    get( target, name ){
      const lastTarget = targetStack[ targetStack.length - 1 ];

      return target[ name ];
    }
  });
  /** 存放当前对象的 Proxy 对象 / 被依赖数据 / 监听数据 */
  const targetParameter = {
    watch: [],
    proxy
  };

  observeMap.set( target, targetParameter );

  // 递归创建观察者
  each( target, ( key, target ) => {
    if( isObject( target ) ){
      target[ key ] = createObserver( target );
    }
  });

  return proxy;
}