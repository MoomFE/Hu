import { create, assign } from "../../shared/global/Object/index";
import addEventListener from "../../shared/util/addEventListener";
import removeEventListener from "../../shared/util/removeEventListener";
import each from "../../shared/util/each";
import toString from "../../shared/util/toString";
import isPlainObject from "../../shared/util/isPlainObject";
import isEmptyObject from "../../shared/util/isEmptyObject";
import isPrimitive from "../../shared/util/isPrimitive";
import isIterable from "../../shared/util/isIterable";
import isEqual from "../../shared/util/isEqual";
import isNotEqual from "../../shared/util/isNotEqual";
import isString from "../../shared/util/isString";
import isObject from "../../shared/util/isObject";
import isFunction from "../../shared/util/isFunction";
import isSymbol from "../../shared/util/isSymbol";
import uid from "../../shared/util/uid";


const util = create( null );

assign( util, {
  /** 绑定事件 */
  addEvent: addEventListener,
  /** 移除事件 */
  removeEvent: removeEventListener,
  /** 对象遍历方法 */
  each,
  /** 将值转为字符串形式 */
  toString,
  /** 判断传入对象是否是纯粹的对象 */
  isPlainObject,
  /** 判断传入对象是否是一个空对象 */
  isEmptyObject,
  /** 判断传入对象是否是原始对象 */
  isPrimitive,
  /** 判断传入对象是否可迭代 */
  isIterable,
  /** 判断传入的两个值是否相等 */
  isEqual,
  /** 判断传入的两个值是否不相等 */
  isNotEqual,
  /** 判断传入对象是否是 String 类型 */
  isString,
  /** 判断传入对象是否是 Object 类型且不为 null */
  isObject,
  /** 判断传入对象是否是 Function 类型 */
  isFunction,
  /** 判断传入对象是否是 Symbol 类型 */
  isSymbol,
  /** 返回一个字符串 UID */
  uid
});

export default util;