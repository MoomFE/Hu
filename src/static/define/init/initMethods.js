import create from "../../../shared/global/Object/create";
import each from "../../../shared/util/each";
import isReserved from "../../../shared/util/isReserved";
import canInjection from "../../../shared/util/canInjection";
import has from "../../../shared/global/Reflect/has";


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
    set( target, name, value ){
      if( name in target ){
        return (( target[ name ] = value ), true);
      }
      return false;
    }
  });

  options.methods && each( options.methods, ( key, method ) => {
    const $method = methodsTarget[ key ] = method.bind( targetProxy );

    if( !canInjection( key ) ) return;

    has( target, key ) && (
      delete target[ key ]
    );

    target[ key ] = $method;
  });

}