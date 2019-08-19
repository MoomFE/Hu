export default
/**
 * 判断传入的两个值是否不相等
 * @param {any} value 需要判断的对象
 * @param {any} value2 需要判断的对象
 */
( value, value2 ) => {
  return value2 !== value && ( value2 === value2 || value === value );
}