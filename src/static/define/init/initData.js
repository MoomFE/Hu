import create from "../../../shared/global/Object/create";
import each from "../../../shared/util/each";
import injectionToLit from "../util/injectionToLit";
import { observe } from "../../observable/util/observe";


/**
 * 初始化当前组件 data 属性
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */
export default function initData( options, target, targetProxy ){

  const dataTarget = create( null );

  const dataTargetProxy = target.$data = observe( dataTarget );

  if( options.data ){
    const data = options.data.call( targetProxy );

    each( data, ( name, value ) => {
      dataTarget[ name ] = value;

      injectionToLit(
        target, name, 0,
        () => dataTargetProxy[ name ],
        value => dataTargetProxy[ name ] = value
      );
    });
  }
  
}