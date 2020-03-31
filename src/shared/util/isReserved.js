import cached from './cached';


export default
/**
 * 判断字符串首字母是否为 $
 * @param {String} value
 */
cached((value) => {
  const charCode = `${value}`.charCodeAt(0);
  return charCode === 0x24;
});
