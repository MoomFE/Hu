import create from "../global/Object/create";


export default
/**
 * 创建一个可以缓存方法返回值的方法
 */
( fn ) => {
  const cache = create( null );

  return str => {
    if( str in cache ) return cache[ name ];
    return cache[ str ] = fn( str );
  } 
}