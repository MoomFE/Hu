import createComputed, { appendComputed } from "../util/createComputed";


let uid = 0;

export default function initWatch( root, options, target, targetProxy ){


  const watchStateMap = {};

  const [
    watchTarget,
    watchTargetProxy,
    watchTargetProxyInterceptor
  ] = createComputed(
    watchStateMap, null, targetProxy
  );


  target.$watch = ( fn, callback, options ) => {
    const name = uid++;
    const watchFn = fn.bind( targetProxy );
    const watchCallback = callback.bind( targetProxy );

    appendComputed( watchTarget, watchTargetProxy, watchStateMap, targetProxy, name, true, {
      get(){
        const oldValue = watchTarget[ name ];
        const value = watchFn();

        watchCallback( value, oldValue );

        return value;
      }
    });

    watchTargetProxyInterceptor[ name ];

    if( options.immediate ){
      watchCallback( watchTarget[ name ], void 0 );
    }

  }

}

