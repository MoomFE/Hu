import isPlainObject from "../../shared/util/isPlainObject";
import emptyObject from "../../shared/const/emptyObject";
import isString from "../../shared/util/isString";
import parsePath from "../../static/define/util/parsePath";
import isFunction from "../../shared/util/isFunction";
import Computed from "../../static/observable/computed";
import uid from "../../shared/util/uid";
import isNotEqual from "../../shared/util/isNotEqual";



export const watcherMap = new WeakMap();


export default function $watch( expOrFn, callback, options ){
  // 传入对象的写法
  if( isPlainObject( callback ) ){
    return $watch.call( this, expOrFn, callback.handler, callback );
  }

  const self = this || emptyObject;
  let computedInstance, computedInstanceTarget, computedInstanceTargetProxyInterceptor;
  let watchFn;
  if( !( watchFn = parseExpOrFn( expOrFn, self ) ) ){
    return;
  }

  if( watcherMap.has( self ) ){
    computedInstance = watcherMap.get( self );
  }else{
    watcherMap.set(
      self,
      computedInstance = new Computed( self, true )
    );
  }

  options = options || {};
  computedInstanceTarget = computedInstance.target;
  computedInstanceTargetProxyInterceptor = computedInstance.targetProxyInterceptor;

  const name = uid();
  const deep = !!options.deep;
  let immediate;
  let runCallback = immediate = !!options.immediate;

  computedInstance.add(
    name,
    {
      get(){
        const oldValue = computedInstanceTarget[ name ];
        const value = watchFn();

        if( runCallback ){
          if( immediate || isNotEqual( value, oldValue ) || deep ){
            callback.call( self, value, oldValue );
          }
        }

        return value;
      }
    },
    deep
  );

  computedInstanceTargetProxyInterceptor[ name ];

  runCallback = true;
  immediate = false;

  return () => {
    computedInstance.delete( name );
  };
}


function parseExpOrFn( expOrFn, self ){
  if( isString( expOrFn ) ){
    return parsePath( expOrFn ).bind( self );
  }
  else if( isFunction( expOrFn ) ){
    return expOrFn.bind( self );
  }
  return;
}