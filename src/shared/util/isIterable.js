import isString from './isString';


/**
 * 判断传入对象是否可迭代
 */
export default (value) => {
  return isString(value) || !!(
    value && value[Symbol.iterator]
  );
};
