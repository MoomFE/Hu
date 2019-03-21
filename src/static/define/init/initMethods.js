import { create } from "../../../shared/global/Object/index";
import each from "../../../shared/util/each";
import injectionToLit from "../util/injectionToLit";


/**
 * 初始化当前组件 methods 属性
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */
export default function initMethods( options, target, targetProxy ){

  const methodsTarget = target.$methods = create( null );

  each( options.methods, ( name, value ) => {
    const method = methodsTarget[ name ] = value.bind( targetProxy );

    injectionToLit( target, name, method );
  });

}