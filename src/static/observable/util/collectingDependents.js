import uid from "../../../shared/util/uid";
import isObject from "../../../shared/util/isObject";
import { targetStack } from "./index";
import { observeProxyMap } from "./observe";
import define from "../../../shared/util/define";
import create from "../../../shared/global/Object/create";


/**
 * 依赖集合
 * - 存放所有已收集到的依赖
 * - { id: dependentsOptions, ... }
 */
export const dependentsMap = create( null );


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
    if( isComputed ){
      let shouldUpdate;

      this.isComputed = isComputed;
      this.observeOptions = observeOptions;
      this.name = name;
      // 判断当前计算属性是否没有依赖
      define( this, 'notBeingCollected', CollectingDependents.nbc.bind( this ) );
      // 依赖是否需要更新 ( 无依赖时可只在使用时进行更新 )
      define( this, 'shouldUpdate', () => shouldUpdate, value => {
        if( shouldUpdate = value ) this.ssu();
      });
    }
    if( isWatch ){
      this.isWatch = isWatch;
      this.isWatchDeep = isWatchDeep;
    }
  }
  /** 传入方法的依赖收集包装 */
  static get( result ){
    // 清空依赖
    this.cleanDeps();
    // 标记已初始化
    this.isInit = true;
    // 标记计算属性已无需更新
    if( this.isComputed ) this.shouldUpdate = false;

    // 开始收集依赖
    targetStack.push( this );

    // 执行方法
    // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps
    result = this.fn();

    // 需要进行深度监听
    if( this.isWatchDeep ) this.wd( result );

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
  /** 仅为监听方法时使用 -> 对依赖的最终返回值进行深度监听 ( watch deep ) */
  wd( result ){
    isObject( result ) && observeProxyMap.get( result ).deepWatches.add( this );
  }
  /** 仅为计算属性时使用 -> 遍历依赖于当前计算属性的依赖参数 ( each ) */
  ec( callback ){
    let { watches } = this.observeOptions;
    let watch;

    if( watches && ( watch = watches[ this.name ] ) && watch.size ){
      for( let cd of watch )
        if( callback( cd ) === false ) break;
    }
  }
  /** 仅为计算属性时使用 -> 递归设置当前计算属性的依赖计算属性需要更新 ( set should update ) */
  ssu(){
    this.ec( cd => {
      if( cd.isComputed && cd.notBeingCollected ){
        cd.shouldUpdate = true;
      }
    });
  }
  /** 仅为计算属性时使用 -> 判断当前计算属性是否没有依赖 ( not being collected ) */
  static nbc(){
    let notBeingCollected = true;

    this.ec( cd => {
      // 依赖是监听方法          依赖是 render 方法                       依赖是计算属性且有依赖
      if( cd.isWatch || ( !cd.isComputed && !cd.isWatch ) || ( cd.isComputed && !cd.notBeingCollected ) ){
        return notBeingCollected = false;
      }
    });

    return notBeingCollected;
  }
}