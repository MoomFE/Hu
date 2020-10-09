import emptyObject from "src/shared/const/emptyObject";
import isPlainObject from "../shared/util/isPlainObject";

/**
 * 可以创建观察者对象的对象类型
 */
type ObserveTargetType = any[] | {};

/**
 * 观察者对象类型
 */
type ObserveProxyType<T extends ObserveTargetType> = {
  [K in keyof T]: T[K]
};

/**
 * 观察者对象选项参数
 */
interface ObserveOptions<T extends ObserveTargetType> {
  /** 观察者对象的原始对象 */
  target: T;
  /** 观察者对象 */
  proxy: ObserveProxyType<T>;
  /** 订阅了当前观察者子集对象更新的 watcher 集合 */
  subs: {};
  /** 订阅了当前观察者对象深度监听的 watcher 集合 */
  deepSubs: Set<any>;
  /** 上次访问及设置的值缓存 */
  lastValue: {};
  /** 是否是数组 */
  isArray: boolean;
};

/**
 * 存放原始对象和观察者对象及其选项参数的映射
 */
export const observeMap: WeakMap<any, any> = new WeakMap();

/**
 * 存放观察者对象和观察者对象选项参数的映射
 */
export const observeProxyMap: WeakMap<any, any> = new WeakMap();


/**
 * 传入任意对象, 把支持的对象转为观察者对象后返回, 不支持的对象会被直接返回
 * @param obj 需要创建观察者对象的原始对象
 */
export function observable<T>(obj: T): T extends ObserveTargetType ? ObserveProxyType<T> : T {
  // @ts-ignore
  return (isPlainObject(obj) || Array.isArray(obj)) ? observe(obj) : obj;
}

/**
 * 创建观察者对象时传递的参数
 */
interface CreateObserveOptions {
  /**
   * 定义观察者对象在收集依赖时的行为
   */
  get?: {
    /**
     * 观察者对象在收集依赖前执行的回调
     *  - 方法返回 0 时, 将不对当前操作收集依赖
     */
    before?<T extends ObserveTargetType, P extends ObserveProxyType<T>>(target: T, name: string | number | symbol, targetProxy: P): 0 | undefined;
  },
  /**
   * 定义观察者对象在写入值时的行为
   */
  set?: {
    before?<T extends ObserveTargetType, P extends ObserveProxyType<T>>(target: T, name: string | number | symbol, value: any, targetProxy: P): 0 | undefined;
  },
  /**
   * 
   */
  deleteProperty?: {

  }
}

/**
 * 传入对象, 返回该对象的观察者对象, 如果传入对象本身就是观察者对象, 将直接返回
 * @param target 需要创建观察者对象的原始对象
 * @param options 观察者对象选项参数
 */
export function observe<T>(target: T, options?: CreateObserveOptions): ObserveProxyType<T>{
  // 如果创建过观察者
  // 则返回之前创建的观察者
  if (observeMap.has(target)) return observeMap.get(target).proxy;
  // 如果传入的就是观察者对象
  // 则直接返回
  if (observeProxyMap.has(target)) return target;
  // 否则立即创建观察者进行返回
  return createObserver(target, options);
}

/**
 * 传入对象, 返回该对象的观察者对象
 * @param target 需要创建观察者对象的原始对象
 * @param options 观察者对象选项参数
 */
function createObserver<T extends ObserveTargetType>(target: T, options: CreateObserveOptions = emptyObject): ObserveProxyType<T> {
  // 创建观察者对象选项参数
  // @ts-ignore
  const observeOptions: ObserveOptions<T> = {
    target,
    subs: Object.create(null),
    deepSubs: new Set(),
    lastValue: Object.create(null),
    isArray: Array.isArray(target)
  };

  // 创建观察者对象
  const proxy: ObserveProxyType<T> = observeOptions.proxy = new Proxy(target, {
    get: createObserverProxyGetter(options.get),
    set: createObserverProxySetter(options.set),
    ownKeys: createObserverProxyOwnKeys(observeOptions)
  });

  // 存储观察者选项参数
  observeMap.set(target, observeOptions);
  observeProxyMap.set(proxy, observeOptions);

  return proxy;
}


/**
 * 创建依赖收集的响应方法
 */
function createObserverProxyGetter<I extends CreateObserveOptions['get']>(options: I) {
  const before = options?.before

  return function<T extends ObserveTargetType, P extends ObserveProxyType<T>>(target: T, name: string | number | symbol, targetProxy: P){
    const value = target[name];

    // 0: 不对当前操作收集依赖
    if (before && before(target, name, targetProxy) === 0) {
      return value;
    }

    // 获取的值是使用 Object.defineProperty 定义的属性
    if (Reflect.getOwnPropertyDescriptor(target, name)?.get){
      return value;
    }

    // 获取的是原型上的方法
    if (typeof value === 'function' && !Object.prototype.hasOwnProperty.call(target, name) && Reflect.has(target, name)) {
      return value;
    }

    return observable(value)
  }
}

/**
 * 创建响应更新方法
 */
function createObserverProxySetter<I extends CreateObserveOptions['set']>(options: I) {
  const before = options?.before
  
  return function<T extends ObserveTargetType, P extends ObserveProxyType<T>>(target: T, name: string | number | symbol, value: any, targetProxy: P){
    // 0: 阻止设置值
    if (before && before(target, name, value, targetProxy) === 0) {
      return false;
    }
    
    // 设置的值是使用 Object.defineProperty 定义的属性
    if (Reflect.getOwnPropertyDescriptor(target, name)?.get){
      target[name] = value;
      return true;
    }

    return true
  }
}

/**
 * 响应以下方式的依赖收集:
 *   - for ... in ( 低版本浏览器不支持, 请避免使用 )
 *   - Object.keys
 *   - Object.values
 *   - Object.entries
 *   - Object.getOwnPropertyNames
 *   - Object.getOwnPropertySymbols
 *   - Reflect.ownKeys
 */
function createObserverProxyOwnKeys<T extends ObserveTargetType, O extends ObserveOptions<T>>(observeOptions: O) {
  return function (target: T) {
    return Reflect.ownKeys(target)
  }
}

function createObserverProxyDeleteProperty<I extends CreateObserveOptions['deleteProperty']>(options: I) {

}