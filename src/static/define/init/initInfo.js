import { observe } from "../../observable/util/observe";
import observeReadonly from "../../../shared/const/observeReadonly";


export default function initInfo( target, name ){
  target.$info = observe(
    {
      name
    },
    observeReadonly
  );
}