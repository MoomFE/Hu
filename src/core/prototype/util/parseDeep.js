/**
 * 解析监听参数 deep
 */
export default deep => {
  deep = Number( deep );

  if( !deep ) deep = 0;
  else if( deep < 0 ) deep = deep === -1 ? Infinity : 0;

  return deep;
}