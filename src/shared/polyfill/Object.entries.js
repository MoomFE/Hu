import { keys } from "../global/Object/index";

/**
 * 方法返回一个给定对象自身可枚举属性的键值对数组.
 * Object.entries polyfill
 * 
 * From @moomfe/zenjs
 */
export default function entries( obj ){

  let index, key;

  const ownKeys = keys( obj );
  const result = Array( index = ownKeys.length );

  while( index-- ){
    result[ index ] = [ ( key = ownKeys[ index ] ), obj[ key ] ];
  }

  return result;
}