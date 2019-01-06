import isFunction from "../../../shared/global/ZenJS/isFunction";
import get from "../../../shared/util/get";
import $each from "../../../shared/global/Object/$each";


export default function data( options, custom, customProto ){
  const dataFn = get( options, 'data' );

  if( !isFunction( dataFn ) ) return;
  
  options.connectedCallback.push(function(){
    const data = dataFn.call( this );

    $each( data, ( name, value ) => {
      custom.createProperty( name, { attribute: false } );
      this[ name ] = value;
    });
  });
}