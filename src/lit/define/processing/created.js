import get from "../../../shared/util/get";
import isFunction from "../../../shared/global/ZenJS/isFunction";


/**
 * 生命周期 -> 组件创建完成
 */
export default function created( options ){
  const createdFn = get( options, 'created' );

  if( isFunction( createdFn ) ){
    options.connectedCallback.push( createdFn );
  }
}