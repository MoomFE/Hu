export default
/**
 * 判断是否使用的是单插值绑定
 * @param {stirngs[]} strings
 */
strings => {
  return strings.length === 2 && strings[0] === '' && strings[1] === '';
}