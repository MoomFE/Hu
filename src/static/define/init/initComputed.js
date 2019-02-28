import each from "../../../shared/util/each";
import injectionToLit from "../util/injectionToLit";
import createComputed from "../../observable/util/createComputed";
import { observeProxyMap } from "../../observable/util/observe";



export default function initComputed( root, options, target, targetProxy ){

  const [
    computedTarget,
    computedTargetProxy,
    computedTargetProxyInterceptor
  ] = createComputed(
    options.computed, targetProxy
  );

  target.$computed = computedTargetProxyInterceptor;

  // 将拦截器伪造成观察者对象
  observeProxyMap.set( computedTargetProxyInterceptor, {} );

  each( options.computed, ( name, computed ) => {
    injectionToLit(
      target, name, 0,
      () => computedTargetProxyInterceptor[ name ],
      value => computedTargetProxyInterceptor[ name ] = value
    );
  });

}