export default
/**
 * 判断传入对象是否是纯粹的对象
 * @param {any} value 需要判断的对象
 */
value => Object.prototype.toString.call( value ) === '[object Object]';