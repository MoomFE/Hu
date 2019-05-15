import { assign } from "../../../shared/global/Object/index";
import { renderStack } from "../../../render/const/index";
import { activeHu } from "../const";


export default ( isCustomElement, target, targetProxy ) => {
  let $parent;

  if( isCustomElement ){
    const length = renderStack.length;

    for( let index = length - 1; index >= 0; index-- ){
      const el = renderStack[ index ];
      const targetProxy = activeHu.get( el ); 

      if( targetProxy ){
        $parent = targetProxy;
        break;
      }
    }
  }

  assign( target, {
    $parent
  });
}