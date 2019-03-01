import uid from "../../../shared/util/uid";
import isObject from "../../../shared/util/isObject";
import isArray from "../../../shared/global/Array/isArray";
import { targetStack } from "./index";
import { observeProxyMap } from "./observe";


/**
 * 依赖集合
 * - 存放所有已收集到的依赖
 * - { id: dependentsOptions, ... }
 */
export const dependentsMap = {};

/**
 * 为传入方法收集依赖
 * @param {function} fn 需要收集依赖的方法
 * @param {boolean} isComputed ↓
 *   - 是否是计算属性, 计算属性如果如果未被其它方法依赖, 则无需立即更新
 *   - 否则是用于创建监听方法
 * @param {boolean} isWatchDeep 当前计算属性是否是用于创建深度监听
 */
export function createCollectingDependents( fn, isComputed, isWatchDeep ){
  // 当前方法收集依赖的 ID, 用于从 watcherMap ( 存储 / 读取 ) 依赖项
  const id = uid();
  // 当前收集依赖的方法的一些参数
  const dependentsOptions = {
    // 当前方法的依赖存储数组
    deps: new Set(),
    // 对之前收集的依赖进行清空
    cleanDeps,
    // 当其中一个依赖更新后, 会调用当前方法重新计算依赖
    fn: collectingDependentsGet,
    // 是否初始化
    // isInit: false
    // 判断当前计算属性是否被没有被其它方法收集了依赖 ( 当 isComputed 为 true 时可用 )
    // notBeingCollected: false,
    // 依赖于当前计算属性的那个计算属性 ( 当 isComputed 为 true 时可用 )
    // relier: null,
    // 依赖是否需要更新 ( 当 notBeingCollected 为 true 时可用 )
    // shouldUpdate: false
  };

  // 需要进行深度监听
  if( isWatchDeep ){
    dependentsOptions.watchDeep = watchDeep;
  }

  // 存储当前收集依赖的 ID 到方法
  // - 未被其它方法依赖的计算属性可以用它来获取依赖参数判断是否被更新
  collectingDependentsGet.id = id;

  // 存储当前方法的依赖
  // 可以在下次收集依赖的时候对这次收集的依赖进行清空
  dependentsMap[ id ] = dependentsOptions;

  /**
   * 方法的依赖收集包装
   */
  function collectingDependentsGet(){
    // 清空依赖
    dependentsOptions.cleanDeps();
    // 已初始化
    dependentsOptions.isInit = true;
    // 是否被收集依赖
    if( isComputed ){
      const targetStackLength = targetStack.length;
      let relier;

      // 判断是否被收集依赖
      // 被无依赖的计算属性收集依赖也算没有被收集依赖
      dependentsOptions.notBeingCollected =
        // 调用堆栈为空, 说明完全无依赖
        !targetStackLength ||
        // 收集依赖的是无依赖的计算属性
        ( relier = targetStack[ targetStackLength - 1 ] ).notBeingCollected;

      // 保存依赖者
      dependentsOptions.relier = targetStackLength && relier;
    }

    // 开始收集依赖
    targetStack.push( dependentsOptions );

    // 执行方法
    // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps
    const result = fn();

    // 需要进行深度监听
    if( isWatchDeep ){
      dependentsOptions.watchDeep( result );
    }

    // 方法执行完成, 则依赖收集完成
    targetStack.pop();

    return result;
  };

  return collectingDependentsGet;
}

/**
 * 清空收集的依赖
 */
function cleanDeps(){
  // 对之前收集的依赖进行清空
  for( const watch of this.deps ) watch.delete( this );
  // 清空依赖
  this.deps.clear();
}

/**
 * 对依赖的最终返回值进行深度监听
 */
function watchDeep( result ){
  if( isObject( result ) && !isArray( result ) ){
    observeProxyMap.get( result ).deepWatches.add( this );
  }
}