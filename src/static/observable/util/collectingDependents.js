import uid from "../../../shared/util/uid";
import isObject from "../../../shared/util/isObject";
import { targetStack } from "./index";
import { observeProxyMap } from "./observe";
import assign from "../../../shared/global/Object/assign";


/**
 * 依赖集合
 * - 存放所有已收集到的依赖
 * - { id: dependentsOptions, ... }
 */
export const dependentsMap = {};


/**
 * 返回一个方法为传入方法收集依赖
 */
export function createCollectingDependents(){
  const cd = new CollectingDependents( ...arguments );
  const { get, id } = cd;

  // 存储当前方法的依赖
  // 可以在下次收集依赖的时候对这次收集的依赖进行清空
  dependentsMap[ id ] = cd;

  // 存储当前收集依赖的 ID 到方法
  // - 未被其它方法依赖的计算属性可以用它来获取依赖参数判断是否被更新
  get.id = id;

  return get;
}

class CollectingDependents{
  /**
   * @param {function} fn 需要收集依赖的方法
   * @param {boolean} isComputed 是否是计算属性
   * @param {boolean} isWatch 是否是用于创建监听方法
   * @param {boolean} isWatchDeep 是否是用于创建深度监听
   */
  constructor(
    fn,
    isComputed,
    isWatch, isWatchDeep,
    observeOptions, name
  ){
    // 当前方法收集依赖的 ID, 用于从 dependentsMap ( 存储 / 读取 ) 依赖项
    this.id = uid();
    // 当前方法的依赖存储数组
    this.deps = new Set();
    // 需要收集依赖的方法
    this.fn = fn;
    // 当其中一个依赖更新后, 会调用当前方法重新计算依赖
    this.get = CollectingDependents.get.bind( this );
    // 存储其他参数
    this.isComputed = isComputed;
    this.isWatch = isWatch;
    this.isWatchDeep = isWatchDeep;
    
    if( isComputed ){
      this.observeOptions = observeOptions;
      this.name = name;
    }
  }
  /** 传入方法的依赖收集包装 */
  static get( result ){
    // 清空依赖
    this.cleanDeps();
    // 已初始化
    this.isInit = true;

    // 开始收集依赖
    targetStack.push( this );

    // 执行方法
    // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps
    result = this.fn();

    // 需要进行深度监听
    if( this.isWatchDeep ){
      this.watchDeep( result );
    }

    // 方法执行完成, 则依赖收集完成
    targetStack.pop( this );

    return result;
  }
  /** 清空之前收集的依赖 */
  cleanDeps(){
    // 对之前收集的依赖进行清空
    for( let watch of this.deps ) watch.delete( this );
    // 清空依赖
    this.deps.clear();
  }
  /** 对依赖的最终返回值进行深度监听 */
  watchDeep( result ){
    isObject( result ) && observeProxyMap.get( result ).deepWatches.add( this );
  }
}