import { targetStack } from "./index";
import isObject from "../../../shared/util/isObject";
import isEqual from "../../../shared/util/isEqual";
import getOwnPropertyDescriptor from "../../../shared/global/Object/getOwnPropertyDescriptor";
import ownKeys from "../../../shared/global/Reflect/ownKeys";
import create from "../../../shared/global/Object/create";
import deleteProperty from "../../../shared/global/Reflect/deleteProperty";


/**
 * 存放原始对象和观察者对象及其选项参数的映射
 */
export const observeMap = new WeakMap();

/**
 * 存放观察者对象和观察者对象选项参数的映射
 */
export const observeProxyMap = new WeakMap();

/**
 * 为传入对象创建观察者
 */
export function observe( target, options ){
  // 如果创建过观察者
  // 则返回之前创建的观察者
  if( observeMap.has( target ) ) return observeMap.get( target ).proxy;
  // 如果传入的就是观察者对象
  // 则直接返回
  if( observeProxyMap.has( target ) ) return target;
  // 否则立即创建观察者进行返回
  return createObserver( target, options );
}

function createObserver(
  target,
  options = {}
){
  /** 当前对象的观察者对象 */
  const proxy = new Proxy( target, {
    get: createObserverProxyGetter( options.get ),
    set: createObserverProxySetter( options.set ),
    ownKeys: observerProxyOwnKeys,
    deleteProperty: createObserverProxyDeleteProperty( options.deleteProperty )
  });

  /** 观察者对象选项参数 */
  const observeOptions = {
    // 可以使用观察者对象来获取原始对象
    target,
    // 可以使用原始对象来获取观察者对象
    proxy,
    // 当前对象的子级的被监听数据
    watches: create( null ),
    // 当前对象的被深度监听数据
    deepWatches: new Set(),
    // 上次的值
    lastValue: create( null )
  };

  // 存储观察者选项参数
  observeMap.set( target, observeOptions );
  observeProxyMap.set( proxy, observeOptions );

  return proxy;
}

/**
 * 创建依赖收集的响应方法
 */
const createObserverProxyGetter = ({ before } = {}) => ( target, name, targetProxy ) => {

  // @return 0: 从原始对象放行
  if( before ){
    const beforeResult = before( target, name, targetProxy );

    if( beforeResult === 0 ){
      return target[ name ];
    }
  }

  // 需要获取的值是使用 Object.defineProperty 定义的属性
  if( ( getOwnPropertyDescriptor( target, name ) || {} ).get ){
    return target[ name ];
  }

  // 获取当前在收集依赖的那个方法的参数
  const dependentsOptions = targetStack[ targetStack.length - 1 ];

  // 观察者选项参数
  const observeOptions = observeMap.get( target );

  // 当前有正在收集依赖的方法
  if( dependentsOptions ){
    const { watches } = observeOptions;
    let watch = watches[ name ];

    // 当前参数没有被监听过, 初始化监听数组
    if( !watch ){
      watch = new Set();
      watches[ name ] = watch;
    }

    // 添加依赖方法信息到 watch
    // 当前值被改变时, 会调用依赖方法
    watch.add( dependentsOptions );
    // 添加 watch 的信息到依赖收集去
    // 当依赖方法被重新调用, 会移除依赖
    dependentsOptions.deps.add( watch );
  }

  // 存储本次值
  const value = observeOptions.lastValue[ name ] = target[ name ];

  // 如果获取的值是对象类型
  // 则返回它的观察者对象
  return isObject( value ) ? observe( value )
                           : value;
};

/**
 * 创建响应更新方法
 */
const createObserverProxySetter = ({ before } = {}) => ( target, name, value, targetProxy ) => {

  // @return 0: 阻止设置值
  if( before ){
    const beforeResult = before( target, name, value, targetProxy );

    if( beforeResult === 0 ){
      return false;
    }
  }

  // 需要修改的值是使用 Object.defineProperty 定义的属性
  if( ( getOwnPropertyDescriptor( target, name ) || {} ).set ){
    target[ name ] = value;
    return true;
  }

  // 观察者选项参数
  const observeOptions = observeMap.get( target );
  // 旧值
  const oldValue = name in observeOptions.lastValue ? observeOptions.lastValue[ name ]
                                                    : target[ name ];

  // 值完全相等, 不进行修改
  if( isEqual( oldValue, value ) ){
    return true;
  }

  // 改变值
  target[ name ] = value;

  // 获取子级监听数据
  const { watches, deepWatches } = observeMap.get( target );
  // 获取当前参数的被监听数据
  let watch = watches[ name ];

  // 如果有方法依赖于当前值, 则运行那个方法以达到更新的目的
  if( watch && watch.size ){
    let executes = [];

    for( let dependentsOptions of watch ){
      // 通知所有依赖于此值的计算属性, 下次被访问时要更新值
      if( dependentsOptions.isComputed ){
        dependentsOptions.shouldUpdate = true;

        // 需要更新有依赖的计算属性
        if( !dependentsOptions.lazy ){
          executes.push( dependentsOptions );
        }
      }
      // 其它需要更新的依赖
      else{
        executes.push( dependentsOptions );
      }
    }

    for( let dependentsOptions of executes ){
      //             当前方法依旧是当前值的依赖且不是计算属性                          需要更新计算属性
      if( watch.has( dependentsOptions ) && !dependentsOptions.isComputed || dependentsOptions.shouldUpdate ){
        dependentsOptions.update();
      }
    }
  }

  // 响应深度监听
  if( deepWatches.size ){
    for( let dependentsOptions of deepWatches ){
      dependentsOptions.update();
    }
  }

  return true;
};

/**
 * 响应以下方式的依赖收集:
 *   - for ... in
 *   - Object.keys
 *   - Object.values
 *   - Object.entries
 *   - Object.getOwnPropertyNames
 *   - Object.getOwnPropertySymbols
 *   - Reflect.ownKeys
 */
const observerProxyOwnKeys = ( target ) => {

  // 获取当前在收集依赖的那个方法的参数
  const dependentsOptions = targetStack[ targetStack.length - 1 ];

  // 当前有正在收集依赖的方法
  if( dependentsOptions ){
    // 深度监听数据
    const { deepWatches } = observeMap.get( target );
    // 标识深度监听
    deepWatches.add( dependentsOptions );
  }

  return ownKeys( target );
}

const createObserverProxyDeleteProperty = ({ before } = {}) => ( target, name ) =>{

  // @return 0: 禁止删除
  if( before ){
    const beforeResult = before( target, name );

    if( beforeResult === 0 ){
      return false;
    }
  }

  return deleteProperty( target, name );
}