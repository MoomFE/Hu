import entries from "../../../shared/global/ZenJS/entries";
import defineProperty from "../../../shared/global/Object/defineProperty";
import get from "../../../shared/util/get";



export default function methods( options ){
  let methods = get( options, 'methods' ) || {};

  // Mixins
  if( options.mixins && options.mixins.length ){
    methods = $assign.apply( null, [].concat(
      options.mixins.map( mixins => mixins.methods ),
      methods
    ));
  }

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