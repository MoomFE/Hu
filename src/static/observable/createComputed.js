import { create } from "../../shared/global/Object/index";
import { observe, observeMap } from "./observe";
import Watcher from "./collectingDependents";
import noop from "../../shared/util/noop";
import returnFalse from "../../shared/util/returnFalse";
import { queueMap, queue, index } from "./scheduler";


/**
 * @param {any} self 计算属性的 this 指向
 * @param {boolean} isWatch 当前是否用于创建监听
 */
export default ( self, isWatch ) => {

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
}


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
}

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
}