import { isArray } from "../../Array/index";
import { create } from "../../Object/index";


const eventMap = new WeakMap();

export function initEvents( targetProxy ){
  const events = create( null );
  eventMap.set( targetProxy, events );
}

export default function $on( type, fn ){
  if( isArray( type ) ){
    for( const event of type ) this.$on( event, fn );
  }else{
    const events = eventMap.get( this );
    const fns = events[ type ] || (
      events[ type ] = []
    );

    fns.push( fn );
  }
  return this;
}