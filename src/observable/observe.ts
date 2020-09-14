import isPlainObject from "../shared/isPlainObject";

/**
 * 可以创建观察者对象的对象类型
 */
type ObserveTargetType = any[] | {};

/**
 * 观察者对象选项参数
 */
interface ObserveOptions {
  /** 观察者对象的原始对象 */
  target: ObserveTargetType;
  /** 观察者对象 */
  proxy: ObserveTargetType;
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
export const observeMap: WeakMap<ObserveTargetType, ObserveOptions> = new WeakMap();

/**
 * 存放观察者对象和观察者对象选项参数的映射
 */
export const observeProxyMap: WeakMap<ObserveTargetType, ObserveOptions> = new WeakMap();


/**
 * 传入对象, 返回该对象的观察者对象
 * @param obj 需要创建观察者对象的原始对象
 */
export function observable<T = any>(obj: T): T {
  return isPlainObject(obj) || Array.isArray(obj) ? observe(obj) : obj;
}

/**
 * ( Private ) 传入对象, 返回该对象的观察者对象
 * @param target 需要创建观察者对象的原始对象
 * @param options 观察者对象选项参数
 */
export function observe<T extends ObserveTargetType>(target: T, options?: {}): T {
  // 创建观察者对象选项参数
  // @ts-ignore
  const observeOptions: ObserveOptions = {
    target,
    subs: Object.create(null),
    deepSubs: new Set(),
    lastValue: Object.create(null),
    isArray: Array.isArray(target)
  };

  // 创建观察者对象
  const proxy = observeOptions.proxy = new Proxy(target, {

  });

  // 存储观察者选项参数
  observeMap.set(target, observeOptions);
  observeProxyMap.set(proxy, observeOptions);

  return proxy;
}