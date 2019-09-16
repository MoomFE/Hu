import { create } from "../../../shared/global/Object/index";
import each from "../../../shared/util/each";
import injectionToHu from "../util/injectionToHu";
import { observe } from "../../observable/observe";
import isFunction from "../../../shared/util/isFunction";
import injectionPrivateToInstance from "../util/injectionPrivateToInstance";


/**
 * 初始化当前组件 methods 属性
 * @param {{}} options 
 * @param {{}} target 
 * @param {{}} targetProxy 
 */
export default function initMethods( isCustomElement, target, root, methods, targetProxy ){
  /**
   * $methods 实例属性
   *  - 非响应式
   *  - 会在实例上添加方法的副本 ( 单独修改删除时, 另一个不受影响 )
   */
  const methodsTarget = create( null );

  // 添加方法到对象中和实例中
  injectionMethods( methodsTarget, methods, target, targetProxy );

  injectionPrivateToInstance( isCustomElement, target, root, {
    $methods: methodsTarget
  });
}

function injectionMethods( methodsTarget, methods, target, targetProxy, callback ){
  each( methods, ( name, value ) => {
    const method = methodsTarget[ name ] = value.bind( targetProxy );

    if( callback ){
      callback( name );
    }else{
      injectionToHu( target, name, method );
    }
  });
}