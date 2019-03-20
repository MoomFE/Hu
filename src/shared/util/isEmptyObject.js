export default
/**
 * 判断传入对象是否是一个空对象
 * @param {any} value 需要判断的对象
 */
value => {
  for( let item in value ) return false;
  return true;
}