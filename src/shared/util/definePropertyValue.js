import { defineProperty } from "../global/Reflect/index";


export default
/**
 * 在传入对象上定义可枚举可删除的一个新属性 ( value )
 * 
 * @param {any} 需要定义属性的对象
 * @param {string} attribute 需要定义的属性名称
 * @param {function} value 属性值
 */
( obj, attribute, { value } ) => {
  defineProperty( obj, attribute, {
    enumerable: true,
    configurable: true,
    value
  });
}