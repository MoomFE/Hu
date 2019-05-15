import { observe } from "../../observable/observe";
import observeReadonly from "../../../shared/const/observeReadonly";
import fnUid from "../../../shared/util/uid";


export default function initOptions( isCustomElement, name, target, userOptions ){

  // Hu 的初始化选项
  target.$options = observe( userOptions, observeReadonly );


  /**
   * 实例的 UID
   *  - 可以保证每个实例的 UID 始终是唯一的
   */
  const uid = isCustomElement ? name + '-' + fnUid()
                              : name;

  // Hu 实例信息选项
  target.$info = observe(
    {
      uid,
      name,
      isMounted: false,
      isCustomElement,
      isConnected: false
    },
    observeReadonly
  );

}