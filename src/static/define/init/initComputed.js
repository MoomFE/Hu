import each from "../../../shared/util/each";
import injectionToLit from "../util/injectionToLit";
import createComputed from "../../observable/util/createComputed";
import { observeProxyMap, observe } from "../../observable/util/observe";
import isEmptyObject from "../../../shared/util/isEmptyObject";
import create from "../../../shared/global/Object/create";



export default function initComputed( options, target, targetProxy ){

  const computed = options.computed;

  // 如果定义当前实例时未定义 computed 属性
  // 则当前实例的 $computed 就是个普通的观察者对象
  if( isEmptyObject( computed ) ){
    return target.$computed = observe(
      create( null )
    );
  }

  const [
    computedTarget,
    computedTargetProxyInterceptor
  ] = createComputed(
    options.computed, targetProxy
  );

  target.$computed = computedTargetProxyInterceptor;

  // 将拦截器伪造成观察者对象
  observeProxyMap.set( computedTargetProxyInterceptor, {} );

  each( computed, ( name, computed ) => {
    injectionToLit(
      target, name, 0,
      () => computedTargetProxyInterceptor[ name ],
      value => computedTargetProxyInterceptor[ name ] = value
    );
  });
}