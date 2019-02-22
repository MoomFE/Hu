import create from "../../../shared/global/Object/create";
import each from "../../../shared/util/each";
import injectionToLit from "../../../shared/util/injectionToLit";
import { observe } from "../../observable/util/observe";


/**
 * 初始化当前组件 data 属性
 * @param {HTMLElement} root 
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */
export default function initData( root, options, target, targetProxy ){

  const dataTarget = create( null );

  const dataTargetProxy = target.$data = observe( dataTarget );

  if( options.data ){
    const data = options.data.call( targetProxy );

    data && each( data, ( name, value ) => {
      dataTarget[ name ] = value;

      injectionToLit(
        target, name, value,
        () => dataTargetProxy[ name ],
        value => dataTargetProxy[ name ] = value
      );
    });
  }
  
}