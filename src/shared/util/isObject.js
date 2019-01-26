export default
/**
 * 判断传入对象是否是 Object 类型且不为 null
 * @param {any} value 需要判断的对象
 */
value => value !== null && typeof value === 'object';