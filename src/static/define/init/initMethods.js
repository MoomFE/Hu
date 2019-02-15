import create from "../../../shared/global/Object/create";
import each from "../../../shared/util/each";
import canInjection from "../../../shared/util/canInjection";
import has from "../../../shared/global/Reflect/has";
import Set_Defined from "../../../shared/proxy/Set_Defined";
import injectionToLit from "../../../shared/util/injectionToLit";


/**
 * 初始化当前组件 methods 属性
 * @param {HTMLElement} root 
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */
export default function initMethods( root, options, target, targetProxy ){

  const methodsTarget = create( null );

  target.$methods = new Proxy( methodsTarget, {
    set: Set_Defined
  });

  options.methods && each( options.methods, ( key, value ) => {
    const method = methodsTarget[ key ] = value.bind( targetProxy );

    injectionToLit( target, key, method );
  });

}