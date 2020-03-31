import isFunction from '../../../shared/util/isFunction';


export default function initLifecycle(userOptions, options, mixins, isMixin) {
  [
    /**
     * 实例初始化后被调用
     *  - 计算属性 computed 和数据监听 watch 还未初始化
     */
    'beforeCreate',
    /**
     * 实例创建完成后被调用
     *  - 但是挂载还未开始
     */
    'created',
    /**
     * 首次挂载开始之前被调用
     *  - 对于自定义元素, 会在被添加到文档流时调用
     *  - 对于自定义元素, 会在 mounted 及 connected 钩子之前执行
     */
    'beforeMount',
    /**
     * 首次挂载之后被调用
     *  - 对于自定义元素, 会在被添加到文档流时调用
     *  - 对于自定义元素, 会在 connected 钩子之前执行
     */
    'mounted',
    /**
     * 实例销毁之前调用
     *  - 此时实例完全可用
     */
    'beforeDestroy',
    /**
     * 实例销毁后调用
     */
    'destroyed',
    /**
     * 自定义元素被添加到文档流 ( 自定义元素独有 )
     *  - 此时实例完全可用
     */
    'connected',
    /**
     * 自定义元素被移动到新文档时调用 ( 自定义元素独有 )
     *  - 只在无需 polyfill 的环境下可用
     *  - 此时实例完全可用
     */
    'adopted',
    /**
     * 自定义元素被从文档流移除 ( 自定义元素独有 )
     *  - 此时实例完全可用
     */
    'disconnected'
  ].forEach((name) => {
    const lifecycle = userOptions[name];

    if (isFunction(lifecycle)) {
      const lifecycles = options[name] || (options[name] = []);

      lifecycles.splice(0, 0, lifecycle);
    }
  });

  if (!isMixin && mixins) {
    for (const mixin of mixins) {
      initLifecycle(mixin, options, null, true);
    }
  }
}

// 'beforeUpdate', 'updated',
// 'activated', 'deactivated',
// 'errorCaptured'
