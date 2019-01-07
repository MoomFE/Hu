import isFunction from "../../../shared/global/ZenJS/isFunction";
import get from "../../../shared/util/get";
import $assign from "../../../shared/global/Object/$assign";
import $each from "../../../shared/global/Object/$each";


export default function data( options, custom, customProto ){
  let dataFns = [];

  if( isFunction( options.data ) ){
    dataFns.push(
      get( options, 'data' )
    );
  }

  if( options.mixins && options.mixins.length ){
    dataFns.$concatTo(
      0,
      options.mixins.map( mixins => mixins.data )
    );
  }

  if( !dataFns.length ) return;

  options.connectedCallback.push(function(){
    const data = $assign.apply(
      null,
      dataFns.map( fn => fn.call( this ) )
    );

    $each( data, ( name, value ) => {
      custom.createProperty( name, { attribute: false } );
      this[ name ] = value;
    });
  });
}