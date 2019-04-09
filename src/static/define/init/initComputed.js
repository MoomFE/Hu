import each from "../../../shared/util/each";
import injectionToLit from "../util/injectionToLit";
import createComputed from "../../observable/createComputed";
import { observeProxyMap, observe } from "../../observable/observe";
import isEmptyObject from "../../../shared/util/isEmptyObject";
import observeReadonly from "../../../shared/const/observeReadonly";


/**
 * 存放每个实例的 computed 相关数据
 */
export const computedMap = new WeakMap();
/**
 * 空计算属性
 */
let emptyComputed;


export default function initComputed( options, target, targetProxy ){

  const computed = options.computed;

  // 如果定义当前实例时未定义 computed 属性
  // 则当前实例的 $computed 就是个普通的观察者对象
  if( isEmptyObject( computed ) ){
    return target.$computed = emptyComputed || (
      emptyComputed = observe({}, observeReadonly)
    );
  }

  const computedOptions = createComputed( targetProxy );
  const [ ,, appendComputed,, computedTargetProxyInterceptor ] = computedOptions;

  // 存储当前实例 computed 相关数据
  computedMap.set( targetProxy, computedOptions );

  target.$computed = computedTargetProxyInterceptor;

  // 将拦截器伪造成观察者对象
  observeProxyMap.set( computedTargetProxyInterceptor, {} );

  each( computed, ( name, computed ) => {
    appendComputed( name, computed );
    injectionToLit(
      target, name, 0,
      () => computedTargetProxyInterceptor[ name ],
      value => computedTargetProxyInterceptor[ name ] = value
    );
  });
}