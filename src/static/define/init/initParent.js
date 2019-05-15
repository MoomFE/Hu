import { assign } from "../../../shared/global/Object/index";
import { renderStack } from "../../../render/const/index";
import { activeHu } from "../const";


export default ( isCustomElement, target, targetProxy ) => {
  let $root = targetProxy;
  let $parent;

  if( isCustomElement ){
    const length = renderStack.length;

    for( let index = length - 1; index >= 0; index-- ){
      const el = renderStack[ index ];
      const parentTargetProxy = activeHu.get( el ); 

      if( parentTargetProxy ){
        $parent = parentTargetProxy;
        $root = $parent.$root;
        $parent.$children.push( targetProxy );
        break;
      }
    }
  }

  assign( target, {
    $root,
    $parent,
    $children: []
  });
}