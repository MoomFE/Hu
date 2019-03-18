import { observe } from "../../observable/util/observe";
import observeReadonly from "../../../shared/const/observeReadonly";
import uid from "../../../shared/util/uid";


export default function initInfo( isCustomElement, target, name ){
  target.$info = observe(
    {
      name: name || `anonymous-${ uid() }`,
      isMounted: false,
      isCustomElement
    },
    observeReadonly
  );
}