/**
 * 包含了使用 Hu 注册的组件合集
 */
export const definedCustomElement = new Set();

/**
 * 当前正在运行的自定义元素和对应实例的引用
 *  - 使用自定义元素获取对应实例时使用, 避免有可能 root.$hu 被删除的问题
 */
export const activeCustomElement = new WeakMap();

/**
 * 当前正在运行的实例的 $el 选项与实例本身的引用
 */
export const activeHu = new WeakMap();