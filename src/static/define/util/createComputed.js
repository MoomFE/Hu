import create from "../../../shared/global/Object/create";
import { observe } from "../../observable/util/observe";
import { dependentsMap, createCollectingDependents } from "../../observable/util/collectingDependents";
import each from "../../../shared/util/each";
import noop from "../../../shared/util/noop";


export default
/**
 * @param {{}} computedStateMap 存放计算属性的参数声明
 * @param {{}} computed
 * @param {any} self 计算属性的 this 指向
 */
( computedStateMap, computed, self ) => {

  /** 计算属性容器对象 */
  const computedTarget = create( null );
  /** 计算属性的观察者对象 */
  const computedTargetProxy = observe( computedTarget );
  /** 计算属性的获取与修改拦截器 */
  const computedTargetProxyInterceptor = new Proxy( computedTargetProxy, {
    get: computedTargetProxyInterceptorGet( computedStateMap ),
    set: computedTargetProxyInterceptorSet( computedStateMap )
  });

  computed && each( computed, ( name, computed ) => {
    appendComputed( computedTarget, computedTargetProxy, computedStateMap, self, name, false, computed );
  });

  return [
    computedTarget,
    computedTargetProxy,
    computedTargetProxyInterceptor
  ];
}

export function appendComputed(
  computedTarget, computedTargetProxy,
  computedStateMap,
  self,
  name, isWatch, computed
){
  const set = computed.set ? computed.set.bind( self ) : noop;
  const get = computed.get.bind( self );
  const collectingDependentsGet = createCollectingDependents(
    () => {
      return computedTargetProxy[ name ] = get();
    },
    !isWatch
  );

  computedTarget[ name ] = void 0;
  computedStateMap[ name ] = {
    id: collectingDependentsGet.id,
    get: collectingDependentsGet,
    set
  };
}


const computedTargetProxyInterceptorGet = computedStateMap => ( target, name ) => {
  const computedOptions = computedStateMap[ name ];

  if( computedOptions ){
    const dependents = dependentsMap[ computedOptions.id ];

    if( !dependents || dependents.forceUpdate ){
      computedOptions.get();
    }
  }

  return target[ name ];
}

const computedTargetProxyInterceptorSet = computedStateMap => ( target, name, value ) => {
  const computedOptions = computedStateMap[ name ];

  if( computedOptions ){
    return computedOptions.set( value ), true;
  }
  return false;
}