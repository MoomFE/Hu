/**
 * 指令方法合集
 */
export const directiveFns = new WeakSet();

/**
 * 当前已经被指令激活的指令方法
 */
export const activeDirectiveFns = new WeakMap();