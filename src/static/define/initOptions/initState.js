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
  initData( isCustomElement, data, options );
  initComputed( computed, options );

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

function initData( isCustomElement, data, options ){
  if( isFunction( data ) || !isCustomElement && isPlainObject( data ) ){
    const dataList = options.dataList || ( options.dataList = [] );

    dataList.splice( 0, 0, data );
  }
}

function initComputed( userComputed, options ){
  if( userComputed ){
    const computed = options.computed || ( options.computed = {} );

    each( userComputed, ( key, userComputed ) => {
      if( !computed[ key ] && userComputed ){
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
}