import each from "../../../shared/util/each";
import isFunction from "../../../shared/util/isFunction";
import noop from "../../../shared/util/noop";
import isArray from "../../../shared/global/Array/isArray";
import isPlainObject from "../../../shared/util/isPlainObject";


export default function initState( userOptions, options ){

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
    initData( data, options );
  }
  if( computed ){
    initComputed( computed, options );
  }
  if( watch ){
    initWatch( watch, options );
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

function initData( userData, options ){
  isFunction( userData ) && (
    options.data = userData
  );
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

function initWatch( userWatch, options ){
  const watch = options.watch = {};

  each( userWatch, ( key, handler ) => {

    if( isArray( handler ) ){
      for( const handler of handler ){
        createWatcher( key, handler, watch );
      }
    }else{
      createWatcher( key, handler, watch );
    }
  });
}

function createWatcher( key, handler, watch ){
  watch[ key ] = isPlainObject( handler ) ? handler : {
    handler
  };
}