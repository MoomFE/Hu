import isDirectiveFn from "../../static/directiveFn/util/isDirectiveFn";
import { activeDirectiveFns } from "../../static/directiveFn/const/index";


export default
/**
 * 给指令提交更改所用方法
 * @param {{}} part 需要提交更改的指令
 * @param {any} value 提交更改的值
 */
( part, value ) => {
  /** 提交的值是否是指令方法 */
  const valueIsDirectiveFn = isDirectiveFn( value );

  // 如果值是指令方法, 那么需要将他们存起来
  // 指令注销时, 同时也要注销指令方法
  if( valueIsDirectiveFn ){
    activeDirectiveFns.set( part, value );
  }else{
    activeDirectiveFns.delete( part );
  }

  // 提交更改
  part.commit(
    value,
    valueIsDirectiveFn
  );
}