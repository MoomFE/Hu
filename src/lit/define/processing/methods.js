import entries from "../../../shared/global/ZenJS/entries";
import defineProperty from "../../../shared/global/Object/defineProperty";
import get from "../../../shared/util/get";



export default function methods( options ){
  const methods = get( options, 'methods' );

  if( !methods ) return;

  const keyValues = entries( methods );

  if( !keyValues.length ) return;

  options.connectedCallback.push(function(){
    keyValues.forEach( keyValue => {
      const [ name, value ] = keyValue;

      defineProperty( this, name, {
        value,
        configurable: false,
        enumerable: true,
        writable: false
      });
    });
  });
}