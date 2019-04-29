import { isArray } from "../../shared/global/Array/index";
import { create } from "../../shared/global/Object/index";
import { apply } from "../../shared/global/Reflect/index";
import { slice } from "../../shared/global/Array/prototype";
import HuConstructor from "../hu";


const eventMap = new WeakMap();
const onceMap = new WeakMap();

function processing( handler ){
  return function(){
    let hu;

    if( ( hu = this ) instanceof HuConstructor || ( hu = hu.$hu ) instanceof HuConstructor ){
      apply( handler, hu, arguments );
    }

    return this;
  };
}

export function initEvents( targetProxy ){
  const events = create( null );
  eventMap.set( targetProxy, events );
}


export default processing(function( type, fn ){
  if( isArray( type ) ){
    for( let event of type ) this.$on( event, fn );
  }else{
    const events = eventMap.get( this );
    const fns = events[ type ] || (
      events[ type ] = []
    );

    fns.push( fn );
  }
});

export const $once = processing(function( type, fn ){
  function once(){
    this.$off( type, once );
    apply( fn, this, arguments );
  }
  onceMap.set( once, fn );
  this.$on( type, once );
});

export const $off = processing(function( type, fn ){
  // 解绑所有事件
  if( !arguments.length ){
    return initEvents( this ), this;
  }
  // 解绑绑定了同一方法的多个事件
  if( isArray( type ) ){
    for( let _type of type ) this.$off( _type, fn );
    return this;
  }

  const events = eventMap.get( this );
  const fns = events[ type ];

  // 没有绑定的事件
  if( !fns || !fns.length ){
    return this;
  }

  // 解绑该事件名下的所有事件
  if( !fn ){
    fns.length = 0;
    return this;
  }

  let index = fns.length;
  while( index-- ){
    let cb = fns[ index ];

    if( cb === fn || onceMap.get( cb ) === fn ){
      fns.splice( index, 1 );
      break;
    }
  }

  return this;
});

export const $emit = processing(function( type ){
  const events = eventMap.get( this );
  const fns = events[ type ];

  if( fns && fns.length ){
    const cbs = fns.length > 1 ? slice.call( fns ) : fns;
    const [ , ...args ] = arguments;

    for( let cb of cbs ){
      apply( cb, this, args );
    }
  }

  return this;
});