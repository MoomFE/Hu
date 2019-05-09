/**
 * Render 渲染方法调用堆栈
 */
export const renderStack = [];

/**
 * 存放渲染时收集到的属性监听的解绑方法
 * 用于下次渲染时的解绑
 */
export const bindDirectiveCacheMap = new WeakMap();

/**
 * 存放渲染时收集到的双向数据绑定信息
 */
export const modelDirectiveCacheMap = new WeakMap();