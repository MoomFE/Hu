import { isArray } from "../global/Array/index";


/**
 * 判断传入对象是否可迭代
 */
export default value => {
  return isArray( value ) || !!(
    value && value[ Symbol.iterator ]
  );
}