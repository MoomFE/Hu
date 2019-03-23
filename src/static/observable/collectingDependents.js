import uid from "../../shared/util/uid";
import isObject from "../../shared/util/isObject";
import { targetStack } from "./const";
import { observeProxyMap } from "./index";
import define from "../../shared/util/define";
import { queueUpdate } from "./scheduler";


export class Watcher{
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
    this.get = Watcher.get.bind( this );
    // 存储其他参数
    if( isComputed ){
      let shouldUpdate;

      this.isComputed = isComputed;
      this.observeOptions = observeOptions;
      this.name = name;
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
  /** 依赖的重新收集 */
  update(){
    if( this.isComputed ){
      // 下次被访问时就要立即更新哟
      this.shouldUpdate = true;
      // 没有依赖
      // 无需加入更新队列
      if( this.lazy ) return;
    }

    queueUpdate( this );
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
    isObject( result ) && observeProxyMap.get( result ).deepWatchers.add( this );
  }
  /** 仅为计算属性时使用 -> 遍历依赖于当前计算属性的依赖参数 ( each ) */
  ec( callback ){
    let { watchers } = this.observeOptions;
    let watch;

    if( watchers && ( watch = watchers[ this.name ] ) && watch.size ){
      for( let cd of watch )
        if( callback( cd ) === false ) break;
    }
  }
  /** 仅为计算属性时使用 -> 递归设置当前计算属性的依赖计算属性需要更新 ( set should update ) */
  ssu(){
    this.ec( cd => {
      if( cd.isComputed && cd.lazy ){
        cd.shouldUpdate = true;
      }
    });
  }
  /** 仅为计算属性时使用 -> 判断当前计算属性是否没有依赖 */
  get lazy(){
    let lazy = true;

    this.ec( cd => {
      // 依赖是监听方法          依赖是 render 方法                依赖是计算属性且有依赖
      if( cd.isWatch || ( !cd.isComputed && !cd.isWatch ) || ( cd.isComputed && !cd.lazy ) ){
        return lazy = false;
      }
    });

    return lazy;
  }
}