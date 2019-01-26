export default
/**
 * 判断字符串首字母是否为 $
 * @param {String} value
 */
value => {
  const charCode = ( value + '' ).charCodeAt(0);
  return charCode === 0x24;
}