export default
/**
 * 只允许修改已定义过的变量
 */
( target, name, value ) => {
  if( name in target ){
    return (( target[ name ] = value ), true);
  }
  return false;
}