import isFunction from "../../../shared/util/isFunction";


export default function initLifecycle( userOptions, options ){

  [
    /** 在实例初始化之后 */
    'beforeCreate',
    /** 在实例创建完成后被立即调用, 挂载阶段还没开始 */
    'created',
    /** 在挂载开始之前被调用, 首次调用 render 函数 */
    'beforeMount',
    /** 组件 DOM 已挂载 */
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

    isFunction( lifecycle ) && (
      options[ name ] = lifecycle
    );
  });

}