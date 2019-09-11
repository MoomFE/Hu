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
export default function initMethods(
  isCustomElement,
  target,
  root,
  {
    methods,
    globalMethods
  },
  targetProxy
){
  /**
   * $methods 实例属性
   *  - 非响应式
   *  - 会在实例上添加方法的副本 ( 单独修改删除时, 另一个不受影响 )
   */
  const methodsTarget = create( null );

  // 添加方法到对象中和实例中
  injectionMethods( methodsTarget, methods, target, targetProxy );

  /**
   * $globalMethods 实例属性
   *  - 响应式
   *  - 会在实例上和自定义元素上添加方法的映射
   */
  const globalMethodsTarget = create( null );
  const globalMethodsTargetProxy = observe( globalMethodsTarget );

  // 添加方法到对象中
  // 实例和自定义元素上的映射通过回调方法手动添加
  injectionMethods( globalMethodsTarget, globalMethods, target, targetProxy, name => {
    const get = () => globalMethodsTargetProxy[ name ];
    const set = method => isFunction( method ) && (
      globalMethodsTargetProxy[ name ] = method
    );

    // 添加映射到实例中
    injectionToHu( target, name, 0, get, set );
    // 添加映射到自定义元素中
    isCustomElement && injectionToHu( root, name, 0, get, set );
  });

  injectionPrivateToInstance( isCustomElement, target, root, {
    $methods: methodsTarget,
    $globalMethods: globalMethodsTargetProxy
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