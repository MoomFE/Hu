import { observe } from "../../observable/util/observe";
import observeReadonly from "../../../shared/const/observeReadonly";
import uid from "../../../shared/util/uid";


export default function initInfo( target, name ){
  target.$info = observe(
    {
      name: name || `anonymous-${ uid() }`
    },
    observeReadonly
  );
}