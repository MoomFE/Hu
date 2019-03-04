import isSymbol from "./isSymbol";
import isReserved from "./isReserved";


export default
/**
 * 判断传入名称是否是 Symbol 类型或是首字母不为 $ 的字符串
 * @param { string | symbol } name 需要判断的名称
 */
( name ) => {
  return isSymbol( name ) || !isReserved( name );
}