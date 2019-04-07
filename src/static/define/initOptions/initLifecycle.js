import isFunction from "../../../shared/util/isFunction";


export default function initLifecycle( userOptions, options, mixins, isMixin ){

  [
    /** 在实例初始化后立即调用, 但是 computed, watch 还未初始化 */
    'beforeCreate',
    /** 在实例创建完成后被立即调用, 但是挂载阶段还没开始 */
    'created',
    /** 在自定义元素挂载开始之前被调用 */
    'beforeMount',
    /** 在自定义元素挂载开始之后被调用, 组件 DOM 已挂载 */
    'mounted',
    /** 实例销毁之前调用, 在这一步, 实例仍然完全可用 */
    'beforeDestroy',
    /** 实例销毁后调用 */
    'destroyed',
    'connected',
    'adopted',
    'disconnected'
    // 'beforeUpdate', 'updated',
    // 'activated', 'deactivated',
    // 'errorCaptured'
  ].forEach( name => {
    const lifecycle = userOptions[ name ];

    if( isFunction( lifecycle ) ){
      const lifecycles = options[ name ] || ( options[ name ] = [] );

      lifecycles.splice( 0, 0, lifecycle );
    }
  });

  if( !isMixin && mixins ){
    for( const mixin of mixins ){
      initLifecycle( mixin, options, null, true );
    }
  }

}