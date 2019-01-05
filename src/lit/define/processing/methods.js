import entries from "../../../shared/global/ZenJS/entries";
import defineProperty from "../../../shared/global/Object/defineProperty";



export default function methods( options ){
  if( options.methods ){
    const keyValues = entries( options.methods );

    if( keyValues.length ){

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
  }
}