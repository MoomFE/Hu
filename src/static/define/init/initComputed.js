import each from "../../../shared/util/each";
import Computed from "../../observable/computed";
import { observeProxyMap, observe } from "../../observable/observe";
import isEmptyObject from "../../../shared/util/isEmptyObject";
import observeReadonly from "../../../shared/const/observeReadonly";
import injectionPrivateToInstance from "../util/injectionPrivateToInstance";
import injectionToInstance from "../util/injectionToInstance";
import emptyObject from "../../../shared/const/emptyObject";


/**
 * 存放每个实例的 computed 相关数据
 */
export const computedMap = new WeakMap();
/**
 * 空计算属性
 */
let emptyComputed;


export default function initComputed( isCustomElement, target, root, options, targetProxy ){

  const computed = options.computed;

  // 如果定义当前实例时未定义 computed 属性
  // 则当前实例的 $computed 就是个普通的观察者对象
  if( isEmptyObject( computed ) ){
    return injectionPrivateToInstance( isCustomElement, target, root, {
      $computed: emptyComputed || (
        emptyComputed = observe({}, observeReadonly)
      )
    });
  }

  const computedInstance = new Computed( targetProxy );
  const computedInstanceTargetProxyInterceptor = computedInstance.targetProxyInterceptor;

  // 存储当前实例 computed 相关数据
  computedMap.set( targetProxy, computedInstance );

  // 将拦截器伪造成观察者对象
  observeProxyMap.set( computedInstanceTargetProxyInterceptor, emptyObject );

  each( computed, ( name, computed ) => {
    computedInstance.add( name, computed );
    injectionToInstance( isCustomElement, target, root, name, {
      get: () => computedInstanceTargetProxyInterceptor[ name ],
      set: value => computedInstanceTargetProxyInterceptor[ name ] = value
    });
  });

  injectionPrivateToInstance( isCustomElement, target, root, {
    $computed: computedInstanceTargetProxyInterceptor
  });
}