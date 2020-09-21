import isPlainObject from "../shared/isPlainObject";

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

interface observeOptions {
  [propName: string]: {
    before: (target: ObserveTargetType, name: string, targetProxy: ObserveTargetType) => boolean | undefined
  }
}

/**
 * 传入对象, 返回该对象的观察者对象, 如果传入对象本身就是观察者对象, 将直接返回
 * @param target 需要创建观察者对象的原始对象
 * @param options 观察者对象选项参数
 */
export function observe<T>(target: T, options?: observeOptions): ObserveProxyType<T>{
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
function createObserver<T extends ObserveTargetType>(target: T, options?: observeOptions): ObserveProxyType<T> {
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

  });

  // 存储观察者选项参数
  observeMap.set(target, observeOptions);
  observeProxyMap.set(proxy, observeOptions);

  return proxy;
}


/**
 * 创建依赖收集的响应方法
 */
function createObserverProxyGetter() {

}