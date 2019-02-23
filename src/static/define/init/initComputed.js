import create from "../../../shared/global/Object/create";
import { observe } from "../../observable/util/observe";
import each from "../../../shared/util/each";
import { createCollectingDependents } from "../../observable/util/collectingDependents";
import injectionToLit from "../../../shared/util/injectionToLit";



export default function initComputed( root, options, target, targetProxy ){

  const computedTarget = create( null );
  const computedTargetProxy = observe( computedTarget );
  const computedTargetProxyInterceptor = target.$computed = new Proxy( computedTargetProxy, {
    get( target, name ){
      const computedOptions = computedStateMap[ name ];
      let result;

      if( computedOptions && !computedOptions.isInit ){
        computedOptions.isInit = true;
        result = computedOptions.get();
      }else{
        result = target[ name ];
      }

      return result;
    },
    set( target, name, value ){
      const computedOptions = computedStateMap[ name ];

      if( computedOptions ){
        return computedOptions.set( value ), true;
      }
      return false;
    }
  });

  const computedStateMap = {};

  options.computed && each( options.computed, ( name, computed ) => {
    const set = computed.set.bind( targetProxy );
    const get = computed.get.bind( targetProxy );

    computedTarget[ name ] = void 0;
    computedStateMap[ name ] = {
      get: createCollectingDependents(() => {
        return computedTargetProxy[ name ] = get( targetProxy );
      }),
      set,
      isInit: false
    };

    injectionToLit(
      target, name, 0,
      () => computedTargetProxyInterceptor[ name ],
      value => computedTargetProxyInterceptor[ name ] = value
    );
  });

}