import { ownKeys } from "../global/Reflect/index";


export default
/**
 * 对象遍历方法
 * @param {{}} obj 需要遍历的对象
 * @param {( key:string, value: any ) => {}} cb 遍历对象的方法
 */
( obj, cb ) => {
  if( obj ){
    const keys = ownKeys( obj );

    for( let key of keys ){
      cb( key, obj[ key ] );
    }
  }
}