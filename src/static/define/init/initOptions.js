import { observe } from '../../observable/observe';
import observeReadonly from '../../../shared/const/observeReadonly';
import fnUid from '../../../shared/util/uid';
import injectionPrivateToInstance from '../util/injectionPrivateToInstance';


export default function initOptions(isCustomElement, target, root, name, userOptions) {
  /**
   * 实例的 UID
   *  - 可以保证每个实例的 UID 始终是唯一的
   */
  const uid = isCustomElement ? `${name}-${fnUid()}`
    : name;

  // Hu 的初始化选项
  const $options = observe(userOptions, observeReadonly);
  // Hu 实例信息选项
  const $info = observe(
    {
      /** 当前实例的 UID - 在由 new 创建的实例中, uid 和 name 是相同的 */
      uid,
      /** 当前自定义元素的名称 - 在由 new 创建的实例中, name 是自动生成的名称 */
      name,
      /** 标识当前实例的首次挂载是否已完成 */
      isMounted: false,
      /** 标识当前实例是否是自定义元素 */
      isCustomElement,
      /** 标识当前自定义元素是否在文档流中 - 如果是使用 new 创建的实例, 则作用和 isMounted 一致 */
      isConnected: false,
      /** 标识当前实例的 prop 是否被赋值 - 使用 props 的 default 选项对 prop 初始化不算做赋值 */
      // props -> './initProps.js'
    },
    observeReadonly
  );

  injectionPrivateToInstance(isCustomElement, target, root, {
    $options,
    $info
  });
}
