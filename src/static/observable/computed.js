import { create } from "../../shared/global/Object/index";
import { observe, observeMap } from "./observe";
import returnFalse from "../../shared/util/returnFalse";
import noop from "../../shared/util/noop";
import Watcher from "./collectingDependents";
import { queueMap, queue, index } from "./scheduler";



export default class Computed{

  constructor( self, isWatch ){
    const optionsMap = this.optionsMap = new Map;
    const target = this.target = create( null );
    const targetProxy = this.targetProxy = observe( target );

    this.self = self;
    this.isComputed = !isWatch;
    this.observeOptions = !isWatch && observeMap.get( target );
    this.targetProxyInterceptor = new Proxy( targetProxy, {
      get: computedTargetProxyInterceptorGet( optionsMap ),
      set: computedTargetProxyInterceptorSet( optionsMap ),
      deleteProperty: returnFalse
    });
  }

  add( name, computed, isWatchDeep ){
    const { self, isComputed, observeOptions, target, targetProxy, optionsMap } = this;

    const set = ( computed.set || noop ).bind( self );
    const get = computed.get.bind( self );
    const watcher = new Watcher(
      () => {
        if( isComputed ) return targetProxy[ name ] = get( self );
        return target[ name ] = get();
      },
      isComputed,
      isWatchDeep,
      observeOptions,
      name
    );

    target[ name ] = void 0;
    optionsMap.set( name, {
      watcher,
      set
    });
  }

  delete( name ){
    const optionsMap = this.optionsMap;
    const options = optionsMap.get( name );

    if( options ){
      const watcher = options.watcher;

      watcher.clean();
      optionsMap.delete( name );

      if( queueMap.has( watcher ) ){
        queueMap.delete( watcher );

        for( let i = index, len = queue.length; i < len; i++ ){
          if( queue[ i ] === watcher ){
            queue.splice( i, 1 );
            break;
          }
        }
      }
    }
  }

  clean(){
    for( let [ name ] of this.optionsMap ){
      this.delete( name );
    }
  }

}


const computedTargetProxyInterceptorGet = optionsMap => ( target, name ) => {
  const options = optionsMap.get( name );

  if( options ){
    const watcher = options.watcher;

    if( !watcher.isInit || watcher.shouldUpdate ){
      watcher.get();
    }
  }

  return target[ name ];
};

const computedTargetProxyInterceptorSet = optionsMap => ( target, name, value ) => {
  const options = optionsMap.get( name );

  if( options ){
    return options.set( value ), true;
  }
  return false;
};