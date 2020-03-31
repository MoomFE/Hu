import cached from './cached';
import rHyphenate from '../const/rHyphenate';


export default
/**
 * 将驼峰转为以连字符号连接的小写名称
 */
cached((name) => {
  return name.replace(rHyphenate, '-$1').toLowerCase();
});
