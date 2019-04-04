import each from "../../../shared/util/each";
import isFunction from "../../../shared/util/isFunction";
import noop from "../../../shared/util/noop";
import isPlainObject from "../../../shared/util/isPlainObject";


export default function initState( isMixin, isCustomElement, userOptions, options ){

  const {
    methods,
    data,
    computed,
    watch
  } = userOptions;

  if( methods ){
    initMethods( methods, options );
  }
  if( data ){
    initData( isCustomElement, data, options );
  }
  if( computed ){
    initComputed( computed, options );
  }
  if( watch ){
    options.watch = watch;
  }
}


function initMethods( userMethods, options ){
  const methods = options.methods = {};

  each( userMethods, ( key, method ) => {
    isFunction( method ) && (
      methods[ key ] = method
    );
  });
}

function initData( isCustomElement, userData, options ){
  if( isFunction( userData ) || !isCustomElement && isPlainObject( userData ) ){
    options.data = userData;
  }
}

function initComputed( userComputed, options ){
  const computed = options.computed = {};

  each( userComputed, ( key, userComputed ) => {
    if( userComputed ){
      const isFn = isFunction( userComputed );
      const get = isFn ? userComputed : ( userComputed.get || noop );
      const set = isFn ? noop : ( userComputed.set || noop );

      computed[ key ] = {
        get,
        set
      };
    }
  });
}