import { create } from '../../shared/global/Object/index';
import { observe, observeMap } from './observe';
import returnTrue from '../../shared/util/returnTrue';
import noop from '../../shared/util/noop';
import Watcher from './collectingDependents';
import { queueMap, queue, index } from './scheduler';


export default class Computed {
  constructor(self, isWatch) {
    /** 当前计算属性容器的子级的一些参数 */
    const optionsMap = this.optionsMap = new Map();
    /** 当前计算属性容器对象 */
    const target = this.target = create(null);
    /** 当前计算属性容器的观察者对象 */
    const targetProxy = this.targetProxy = observe(target);
    /** 当前计算属性容器的获取与修改拦截器 */
    this.targetProxyInterceptor = new Proxy(targetProxy, {
      get: computedTargetProxyInterceptorGet(optionsMap),
      set: computedTargetProxyInterceptorSet(optionsMap),
      deleteProperty: returnTrue
    });
    /** 保存相关参数 */
    this.self = self;
    this.isWatch = isWatch;
    this.observeOptions = !isWatch && observeMap.get(target);
  }

  /**
   * 添加计算属性
   * @param {*} name 计算属性存储的名称
   * @param {*} computed 计算属性 getter / setter 对象
   */
  add(name, computed) {
    const {
      self, isWatch, observeOptions, target, targetProxy, optionsMap
    } = this;

    /** 计算属性的 setter */
    const set = (computed.set || noop).bind(self);
    /** 计算属性的 getter */
    const get = computed.get.bind(self);
    /** 计算属性的 watcher */
    const watcher = new Watcher(
      () => {
        if (isWatch) return (target[name] = get());
        return (targetProxy[name] = get(self));
      },
      !isWatch && { observeOptions, name },
      isWatch
    );

    // 添加占位符
    target[name] = undefined;
    // 存储计算属性参数
    optionsMap.set(name, {
      watcher,
      set
    });
  }

  /**
   * 移除计算属性
   * @param {*} name 需要移除的计算属性名称
   */
  delete(name) {
    // 获取计算属性的参数
    const optionsMap = this.optionsMap;
    const options = optionsMap.get(name);

    // 有这个计算属性
    if (options) {
      const watcher = options.watcher;

      // 清空依赖
      watcher.clean();
      // 删除计算属性
      optionsMap.delete(name);
      // 如果当前 ( 计算属性 / watch ) 在异步更新队列中, 则进行删除
      if (queueMap.has(watcher)) {
        // 从异步更新队列标记中删除
        queueMap.delete(watcher);
        // 从异步更新队列中删除
        for (let i = index, len = queue.length; i < len; i++) {
          if (queue[i] === watcher) {
            queue.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  /**
   * 清空计算属性
   */
  clean() {
    for (const [name] of this.optionsMap) {
      this.delete(name);
    }
  }
}


function computedTargetProxyInterceptorGet(optionsMap) {
  return (target, name) => {
    // 获取计算属性的参数
    const options = optionsMap.get(name);

    // 防止用户通过 $computed 获取不存在的计算属性
    if (options) {
      const watcher = options.watcher;

      // 计算属性未初始化或需要更新
      if (!watcher.isInit || watcher.shouldUpdate) {
        watcher.get();
      }
    }

    return target[name];
  };
}

function computedTargetProxyInterceptorSet(optionsMap) {
  return (target, name, value) => {
    // 获取计算属性的参数
    const options = optionsMap.get(name);

    // 防止用户通过 $computed 设置不存在的计算属性
    if (options) {
      options.set(value);
      return true;
    }
    return true;
  };
}
