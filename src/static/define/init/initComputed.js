import create from "../../../shared/global/Object/create";
import { observe } from "../../observable/util/observe";
import each from "../../../shared/util/each";
import { createCollectingDependents } from "../../observable/util/collectingDependents";
import define from "../../../shared/util/define";
import injectionToLit from "../../../shared/util/injectionToLit";



export default function initComputed( root, options, target, targetProxy ){

  const computedTarget = create( null );
  const computedTargetProxy = observe( computedTarget );
  const computedTargetProxyInterceptor = target.$computed = new Proxy( computedTargetProxy, {
    get( target, name ){
      const computedOptions = computedStateMap[ name ];
      let result;

      if( computedOptions && !computedOptions.isInit ){
        result = target[ name ] = computedOptions.get();
      }else{
        result = target[ name ];
      }

      return result;
    }
  });

  const computedStateMap = {};

  options.computed && each( options.computed, ( name, computed ) => {
    const set = computed.set.bind( targetProxy );
    const get = createCollectingDependents(
      computed.get.bind( targetProxy )
    );

    computedTarget[ name ] = void 0;
    computedStateMap[ name ] = {
      get, set,
      isInit: false
    };

    injectionToLit(
      target, name, 0,
      () => computedTargetProxyInterceptor[ name ],
      value => computedTargetProxyInterceptor[ name ] = value
    );
  });

}