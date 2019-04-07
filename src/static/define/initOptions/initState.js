import each from "../../../shared/util/each";
import isFunction from "../../../shared/util/isFunction";
import noop from "../../../shared/util/noop";
import isPlainObject from "../../../shared/util/isPlainObject";


export default function initState( isCustomElement, userOptions, options, mixins, isMixin ){

  const {
    methods,
    data,
    computed,
    watch
  } = userOptions;

  initMethods( methods, options );

  if( data ){
    initData( isCustomElement, data, options );
  }
  if( computed ){
    initComputed( computed, options );
  }
  if( watch ){
    options.watch = watch;
  }

  if( !isMixin && mixins ){
    for( const mixin of mixins ){
      initState( isCustomElement, mixin, options, null, true );
    }
  }
}


function initMethods( userMethods, options ){
  if( userMethods ){
    const methods = options.methods || ( options.methods = {} );

    each( userMethods, ( key, method ) => {
      if( !methods[ key ] && isFunction( method ) ){
        methods[ key ] = method;
      }
    });
  }
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