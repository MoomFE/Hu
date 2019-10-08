import { renderStack } from "../../../render/const";
import { activeHu } from "../const";
import injectionPrivateToInstance from "../util/injectionPrivateToInstance";


export default ( isCustomElement, target, root, targetProxy ) => {
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

  injectionPrivateToInstance( isCustomElement, target, root, {
    $root,
    $parent,
    $children: []
  });
}