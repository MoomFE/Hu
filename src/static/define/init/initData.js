import { create } from "../../../shared/global/Object/index";
import each from "../../../shared/util/each";
import injectionToLit from "../util/injectionToLit";
import { observe } from "../../observable/util/observe";
import isFunction from "../../../shared/util/isFunction";


/**
 * 初始化当前组件 data 属性
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */
export default function initData( options, target, targetProxy ){

  const dataTarget = create( null );

  const dataTargetProxy = target.$data = observe( dataTarget );

  const { data } = options;

  if( data ){
    const dataObj = isFunction( data ) ? data.call( targetProxy ) : data;

    each( dataObj, ( name, value ) => {
      dataTarget[ name ] = value;

      injectionToLit(
        target, name, 0,
        () => dataTargetProxy[ name ],
        value => dataTargetProxy[ name ] = value
      );
    });
  }
  
}