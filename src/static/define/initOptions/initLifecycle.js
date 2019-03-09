import isFunction from "../../../shared/util/isFunction";
import noop from "../../../shared/util/noop";


export default function initLifecycle( userOptions, options ){

  [
    /** 在实例初始化后立即调用, 但是 computed, watch 还未初始化 */
    'beforeCreate',
    /** 在实例创建完成后被立即调用, 但是挂载阶段还没开始 */
    'created',
    /** 在自定义元素挂载开始之前被调用 */
    'beforeMount',
    /** 在自定义元素挂载开始之后被调用, 组件 DOM 已挂载 */
    'mounted',
    /** 数据更新时调用, 还未更新组件 DOM */
    'beforeUpdate',
    /** 数据更新时调用, 已更新组件 DOM */
    'updated',
    /** 实例销毁之前调用。在这一步，实例仍然完全可用 */
    'beforeDestroy',
    /** 实例销毁后调用 */
    'destroyed',
    // 'activated', 'deactivated',
    // 'errorCaptured'
  ].forEach( name => {
    const lifecycle = userOptions[ name ];

    options[ name ] = isFunction( lifecycle ) ? lifecycle
                                              : noop;
  });

}