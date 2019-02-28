/**
 * 调用堆栈
 * - 存放当前正在计算依赖的方法的 dependentsOptions 依赖集合数组
 * - [ dependentsOptions, dependentsOptions, ... ]
 */
export const targetStack = [];