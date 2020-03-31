import isObject from './isObject';
import isFunction from './isFunction';


/**
 * 判断传入对象是否是原始对象
 */
export default (value) => {
  return value === null || !(
    isObject(value) || isFunction(value)
  );
};
