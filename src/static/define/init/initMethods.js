import { create } from "../../../shared/global/Object/index";
import each from "../../../shared/util/each";
import injectionToHu from "../util/injectionToHu";
import isSymbolOrNotReserved from "../../../shared/util/isSymbolOrNotReserved";


/**
 * 初始化当前组件 methods 属性
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */
export default function initMethods(
  isCustomElement,
  root,
  {
    methods,
    globalMethods
  },
  target,
  targetProxy
){
  const methodsTarget = target.$methods = create( null );
  const globalMethodsTarget = target.$globalMethods = create( null );

  injectionMethods( methodsTarget, methods, target, targetProxy );
  injectionMethods( globalMethodsTarget, globalMethods, target, targetProxy, ( name, method ) => {
    isCustomElement && isSymbolOrNotReserved( name ) && (
      root[ name ] = method
    );
  });
}

function injectionMethods( methodsTarget, methods, target, targetProxy, callback ){
  each( methods, ( name, value ) => {
    const method = methodsTarget[ name ] = value.bind( targetProxy );

    injectionToHu( target, name, method );
    callback && callback( name, method );
  });
}