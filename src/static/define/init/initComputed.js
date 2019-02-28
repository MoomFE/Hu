import each from "../../../shared/util/each";
import injectionToLit from "../util/injectionToLit";
import createComputed from "../../observable/util/createComputed";



export default function initComputed( root, options, target, targetProxy ){

  const [
    computedTarget,
    computedTargetProxy,
    computedTargetProxyInterceptor
  ] = createComputed(
    options.computed, targetProxy
  );

  target.$computed = computedTargetProxyInterceptor;

  options.computed && each( options.computed, ( name, computed ) => {
    injectionToLit(
      target, name, 0,
      () => computedTargetProxyInterceptor[ name ],
      value => computedTargetProxyInterceptor[ name ] = value
    );
  });

}