import create from "../../../shared/global/Object/create";
import each from "../../../shared/util/each";
import Set_Defined from "../../../shared/proxy/Set_Defined";
import injectionToLit from "../util/injectionToLit";


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

  options.methods && each( options.methods, ( name, value ) => {
    const method = methodsTarget[ name ] = value.bind( targetProxy );

    injectionToLit( target, name, method );
  });

}