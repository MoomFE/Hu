import { isArray } from "../global/Array/index";
import isPlainObject from "./isPlainObject";
import { toString } from "../global/Object/prototype";
import isString from "./isString";


export default
/**
 * 将值转为字符串形式
 * @param {any} value
 */
value => {
  // null -> ''
  // undefined -> ''
  if( value == null ) return '';
  // '' -> ''
  if( isString( value ) ) return value;
  // [] -> '[]'
  // {} -> '{}'
  if( isArray( value ) || ( isPlainObject( value ) && value.toString === toString ) ){
    return JSON.stringify( value, null, 2 );
  }
  // true -> 'true'
  // false -> 'false'
  // 123 -> '123'
  // ...
  return String( value );
}