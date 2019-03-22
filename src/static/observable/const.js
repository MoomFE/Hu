/**
 * 调用堆栈
 * - 存放当前正在计算依赖的方法的 watcher 依赖集合数组
 * - [ watcher, watcher, ... ]
 */
export const targetStack = [];