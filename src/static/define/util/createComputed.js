import create from "../../../shared/global/Object/create";
import { observe } from "../../observable/util/observe";
import { dependentsMap, createCollectingDependents } from "../../observable/util/collectingDependents";
import each from "../../../shared/util/each";
import noop from "../../../shared/util/noop";


export default
/**
 * @param {{}} computed
 * @param {any} self 计算属性的 this 指向
 */
( computed, self ) => {

  /** 存放计算属性的参数声明 */
  const computedStateMap = {};
  /** 计算属性容器对象 */
  const computedTarget = create( null );
  /** 计算属性的观察者对象 */
  const computedTargetProxy = observe( computedTarget );
  /** 计算属性的获取与修改拦截器 */
  const computedTargetProxyInterceptor = new Proxy( computedTargetProxy, {
    get: computedTargetProxyInterceptorGet( computedStateMap ),
    set: computedTargetProxyInterceptorSet( computedStateMap )
  });

  const appendComputed = ( isWatch, name, computed ) => {
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
  };

  const removeComputed = name => {
    const computedOptions = computedStateMap[ name ];

    if( computedOptions ){
      const dependents = dependentsMap[ computedOptions.id ];

      if( dependents ){
        dependents.deps.forEach( fn => fn() );
      }
    }
  }

  computed && each( computed, ( name, computed ) => {
    appendComputed( false, name, computed );
  });

  return [
    computedTarget,
    computedTargetProxy,
    computedTargetProxyInterceptor,
    appendComputed,
    removeComputed
  ];
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