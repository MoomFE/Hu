import isPlainObject from '../../shared/util/isPlainObject';
import emptyObject from '../../shared/const/emptyObject';
import Computed from '../../static/observable/computed';
import uid from '../../shared/util/uid';
import isNotEqual from '../../shared/util/isNotEqual';
import { safety } from '../../static/observable/const';
import parseExpOrFn from './util/parseExpOrFn';
import parseDeep from './util/parseDeep';
import traverse from './util/traverse';


/**
 * 存放每个实例的 watch 数据
 */
export const watcherMap = new WeakMap();


/**
 * 监听 Hu 实例对象和观察者对象
 */
export default function $watch(expOrFn, callback, options) {
  // 传入对象的写法
  if (isPlainObject(callback)) {
    return $watch.call(this, expOrFn, callback.handler, callback);
  }

  const self = this || emptyObject;
  const watchFn = parseExpOrFn(expOrFn, self);
  let computedInstance;

  if (!watchFn) {
    return;
  }

  // 尝试读取当前实例 watch 相关数据
  if (watcherMap.has(self)) {
    computedInstance = watcherMap.get(self);
    // eslint-disable-next-line brace-style
  }
  // 存储当前实例 watch 相关数据
  else {
    watcherMap.set(
      self,
      computedInstance = new Computed(self, true)
    );
  }

  options = options || {};

  /** 当前 watch 的计算属性容器对象 */
  const computedInstanceTarget = computedInstance.target;
  /** 当前 watch 的计算属性容器的获取与修改拦截器 */
  const computedInstanceTargetProxyInterceptor = computedInstance.targetProxyInterceptor;
  /** 当前 watch 的存储名称 */
  const name = uid();
  /** 是否监听对象内部值的变化 */
  const deep = parseDeep(options.deep);
  /** 是否立即执行回调 */
  let immediate = !!options.immediate;
  /** 值改变是否执行回调 */
  let runCallback = immediate;

  // 添加监听
  computedInstance.add(
    name,
    {
      get() {
        const oldValue = computedInstanceTarget[name];
        const value = watchFn();

        // 深度监听
        if (deep) {
          traverse(value, deep);
        }

        // 运行回调
        if (runCallback) {
          //   首次运行             值不一样      值一样的话, 判断是否是深度监听
          if (immediate || isNotEqual(value, oldValue) || deep) {
            safety(() => {
              return callback.call(self, value, oldValue);
            });
          }
        }

        return value;
      }
    }
  );

  // 首次运行, 以收集依赖
  // eslint-disable-next-line no-unused-expressions
  computedInstanceTargetProxyInterceptor[name];
  // 下次值改变时运行回调
  runCallback = true;
  immediate = false;

  // 返回取消监听的方法
  return () => {
    computedInstance.delete(name);
  };
}
