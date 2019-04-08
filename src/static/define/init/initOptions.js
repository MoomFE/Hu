import { observe } from "../../observable/observe";
import observeReadonly from "../../../shared/const/observeReadonly";


export default function initOptions( isCustomElement, name, target, userOptions ){

  // Hu 的初始化选项
  target.$options = observe( userOptions, observeReadonly );

  // Hu 实例信息选项
  target.$info = observe(
    {
      name,
      isMounted: false,
      isCustomElement,
      isConnected: false
    },
    observeReadonly
  );

}