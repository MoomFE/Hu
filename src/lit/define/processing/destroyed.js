import get from "../../../shared/util/get";


export default function destroyed( options ){
  const destroyedFns = [];

  if( options.destroyed ){
    destroyedFns.push(
      get( options, 'destroyed' )
    );
  }

  if( options.mixins && options.mixins.length ){
    destroyedFns.$concatTo(
      0,
      options.mixins.map( mixins => mixins.destroyed )
    );
  }

  destroyedFns.$deleteValue( void 0 );

  if( destroyedFns.length ){
    options.disconnectedCallback.push( ...destroyedFns );
  }
}