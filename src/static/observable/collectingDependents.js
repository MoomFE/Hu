import uid from "../../shared/util/uid";
import { targetCollection } from "./const";
import { observeProxyMap } from "./observe";
import defineProperty from "../../shared/util/defineProperty";
import { queueUpdate } from "./scheduler";


export class Watcher{
  /**
   * 
   * @param {function} fn 需要收集依赖的方法
   * @param {boolean} isComputed true:  计算属性
   *                             false: 监听方法
   * @param {boolean} isWatchDeep 是否是用于创建深度监听
   * @param {*} observeOptions 计算属性的观察者对象选项参数
   * @param {*} name 计算属性的名称
   */
  constructor( fn, isComputed, isWatchDeep, observeOptions, name ){
    // 当前方法收集依赖的 ID, 用于从 dependentsMap ( 存储 / 读取 ) 依赖项
    this.id = uid();
    // 当前 watcher 在运行时收集的依赖集合
    this.deps = new Set();
    // 需要收集依赖的方法
    this.fn = fn;
    // 当订阅的依赖更新后, 会调用当前方法重新计算依赖
    this.get = Watcher.get.bind( this );
    // 存储其他参数
    if( isComputed ){
      let shouldUpdate;

      this.isComputed = isComputed;
      this.observeOptions = observeOptions;
      this.name = name;
      // 依赖是否需要更新 ( 无依赖时可只在使用时进行更新 )
      defineProperty( this, 'shouldUpdate', {
        get: () => shouldUpdate,
        set: value => {
          if( shouldUpdate = value ) this.ssu();
        }
      });
    }else if( isComputed === false ){
      this.isWatch = true;
      this.isWatchDeep = isWatchDeep;
    }
  }
  /** 传入方法的依赖收集包装 */
  static get( result ){
    // 清空依赖
    this.clean();
    // 标记已初始化
    this.isInit = true;
    // 标记计算属性已无需更新
    if( this.isComputed ) this.shouldUpdate = false;

    // 开始收集依赖
    // 方法执行完成, 则依赖收集完成
    targetCollection( this, () => {
      // 执行方法
      // 方法执行的过程中触发响应对象的 getter 而将依赖存储进 deps
      result = this.fn();

      // 需要进行深度监听
      if( this.isWatchDeep ) this.wd( result );
    });

    return result;
  }
  /** 标记订阅信息 */
  add( subs, name ){
    let sub = subs[ name ] || (
      subs[ name ] = new Set
    );

    // 添加当前 watcher 信息到 sub
    // 当前值被改变时, 会调用 update 方法进入更新队列
    sub.add( this );
    // 添加 sub 的信息到当前 watcher 去
    // 当依赖方法被重新调用, 会移除订阅的依赖
    this.deps.add( sub );
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
  clean(){
    // 对之前收集的依赖进行清空
    for( let watch of this.deps ) watch.delete( this );
    // 清空依赖
    this.deps.clear();
  }
  /** 仅为监听方法时使用 -> 对依赖的最终返回值进行深度监听 ( watch deep ) */
  wd( result ){
    const observeOptions = observeProxyMap.get( result );

    if( observeOptions ){
      observeOptions.deepSubs.add( this );
    }
  }
  /** 仅为计算属性时使用 -> 遍历依赖于当前计算属性的依赖参数 ( each ) */
  ec( callback ){
    let { subs } = this.observeOptions;
    let sub;

    if( subs && ( sub = subs[ this.name ] ) && sub.size ){
      for( let cd of sub )
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