export default
/**
 * 创建一个可以缓存方法返回值的方法
 */
( fn ) => {
  const cache = {};

  return str => {
    return cache[ str ] || ( cache[ str ] = fn( str ) );
  } 
}