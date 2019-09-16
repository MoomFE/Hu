import { defineProperty } from "../global/Reflect/index";


export default
/**
 * 在传入对象上定义可枚举可删除的一个新属性 ( set / get )
 * 
 * @param {any} 需要定义属性的对象
 * @param {string} key 需要定义的属性名称
 * @param {function} get 属性的 getter 方法
 * @param {function} set 属性的 setter 方法
 */
( obj, key, { get, set } ) => {
  defineProperty( obj, key, {
    enumerable: true,
    configurable: true,
    get,
    set
  });
}