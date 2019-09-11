import { observe } from "../../observable/observe";
import observeReadonly from "../../../shared/const/observeReadonly";
import fnUid from "../../../shared/util/uid";
import injectionPrivateToInstance from "../util/injectionPrivateToInstance";


export default function initOptions( isCustomElement, target, root, name, userOptions ){

  /**
   * 实例的 UID
   *  - 可以保证每个实例的 UID 始终是唯一的
   */
  const uid = isCustomElement ? name + '-' + fnUid()
                              : name;

  // Hu 的初始化选项
  const $options = observe( userOptions, observeReadonly );
  // Hu 实例信息选项
  const $info = observe(
    {
      uid,
      name,
      isMounted: false,
      isCustomElement,
      isConnected: false
    },
    observeReadonly
  );

  injectionPrivateToInstance( isCustomElement, target, root, {
    $options,
    $info
  });
}