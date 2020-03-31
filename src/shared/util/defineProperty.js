import { defineProperty } from '../global/Reflect/index';
import { assign } from '../global/Object/index';


export default
/**
 * 在传入对象上定义可枚举可删除的一个新属性
 *
 * @param {any} 需要定义属性的对象
 * @param {string} key 需要定义的属性名称
 */
(obj, key, attributes) => {
  defineProperty(
    obj, key,
    assign(
      { enumerable: true, configurable: true },
      attributes
    )
  );
};
