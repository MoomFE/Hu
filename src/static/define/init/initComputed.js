import create from "../../../shared/global/Object/create";
import { observe } from "../../observable/util/observe";
import each from "../../../shared/util/each";
import { createCollectingDependents, dependentsMap } from "../../observable/util/collectingDependents";
import injectionToLit from "../../../shared/util/injectionToLit";



export default function initComputed( root, options, target, targetProxy ){

  const computedTarget = create( null );
  const computedTargetProxy = observe( computedTarget );
  const computedTargetProxyInterceptor = target.$computed = new Proxy( computedTargetProxy, {
    get( target, name ){
      const computedOptions = computedStateMap[ name ];

      if( computedOptions ){
        const dependents = dependentsMap[ computedOptions.id ];

        if( !dependents || dependents.forceUpdate ){
          computedOptions.get();
        }
      }

      return target[ name ];
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
    const collectingDependentsGet = createCollectingDependents(
      () => {
        return computedTargetProxy[ name ] = get( targetProxy )
      },
      true
    );

    computedTarget[ name ] = null;
    computedStateMap[ name ] = {
      id: collectingDependentsGet.id,
      get: collectingDependentsGet,
      set
    };

    injectionToLit(
      target, name, 0,
      () => computedTargetProxyInterceptor[ name ],
      value => computedTargetProxyInterceptor[ name ] = value
    );
  });

}