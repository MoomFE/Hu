import { observe } from "../../observable/util/observe";
import observeReadonly from "../../../shared/const/observeReadonly";


export default function initInfo( root, options, target, targetProxy, name ){
  target.$info = observe(
    {
      name
    },
    observeReadonly
  );
}