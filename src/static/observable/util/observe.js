import { targetStack } from "./collectingDependents";
import each from "../../../shared/util/each";
import isObject from "../../../shared/util/isObject";
import has from "../../../shared/global/Reflect/has";


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

function createObserver( target ){
  /** 当前对象的被依赖数据 / 监听数据 */
  const watch = new Proxy({}, {
    set: ( target, name, value ) => {
      return ( target[ name ] || ( target[ name ] = [] ) ).push( value ), true
    }
  });
  /** 当前对象的 Proxy 对象 */
  const proxy = new Proxy( target, {
    get( target, name ){
      // 获取最新的依赖存储
      const deps = targetStack[ targetStack.length - 1 ];

      if( deps ){
        // 将当前存储依赖
        const fn = watch[ name ] = deps.fn;
        // 将当前调用链放进依赖存储中
        deps.push(() => {
          const watches = watch[ name ];
          watches.splice( watches.indexOf( fn ), 1 );
        });
      }

      return target[ name ];
    },
    set( target, name, value ){
      const watches = watch[ name ];

      target[ name ] = value;

      if( watches && watches.length ){
        for( const watcher of watches ) watcher();
      }

      return true;
    }
  });
  /** 存放当前对象的 Proxy 对象 / 被依赖数据 / 监听数据 */
  const targetParameter = {
    watch,
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