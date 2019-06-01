import isFunction from "../../../shared/util/isFunction";
import { directiveFns } from "../const/index";


/**
 * 判断传入参数是否是指令方法
 */
export default obj => {
  return isFunction( obj ) && directiveFns.has( obj );
}