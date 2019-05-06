import { create } from "../../../shared/global/Object/index";
import each from "../../../shared/util/each";
import injectionToHu from "../util/injectionToHu";


/**
 * 初始化当前组件 methods 属性
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */
export default function initMethods(
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
  injectionMethods( globalMethodsTarget, globalMethods, target, targetProxy );
}

function injectionMethods( methodsTarget, methods, target, targetProxy ){
  each( methods, ( name, value ) => {
    injectionToHu(
      target,
      name,
      methodsTarget[ name ] = value.bind( targetProxy )
    );
  });
}