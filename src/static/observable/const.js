/**
 * 调用堆栈
 * - 存放当前正在计算依赖的方法的 watcher 依赖集合数组
 * - [ watcher, watcher, ... ]
 */
export const targetStack = [];

/**
 * 用于 Watcher 的依赖收集
 * @param {*} target
 * @param {*} fn
 */
export function targetCollection(target, fn) {
  targetStack.push(target);
  targetStack.target = target;

  const result = fn();

  targetStack.pop();
  targetStack.target = targetStack[targetStack.length - 1];

  return result;
}

/**
 * 用于防止方法执行时被依赖收集
 * @param {*} fn
 */
export function safety(fn) {
  return targetCollection(0, fn);
}
