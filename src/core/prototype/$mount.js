import isString from "../../shared/util/isString";
import { observeProxyMap } from "../../static/observable/observe";
import { optionsMap } from "../../static/define/initOptions/index";
import callLifecycle from "../../static/define/util/callLifecycle";
import { activeHu } from "../../static/define/const";


/**
 * 挂载实例
 * - 只在使用 new 创建的实例中可用
 */
export default function( selectors ){
  const $info = this.$info;
  const { isMounted, isCustomElement } = $info;

  // 是使用 new 创建的实例
  // 且实例未挂载
  if( !isCustomElement && !isMounted ){
    /** 当前实例挂载目标对象 */
    const el = selectors && (
      isString( selectors ) ? document.querySelector( selectors )
                            : selectors
    );
    
    // 不允许挂载到 body 和 html 下
    if( !el || el === document.body || el === document.documentElement ){
      return this;
    }else{
      // 将挂载对象保存到实例
      observeProxyMap.get( this ).target.$el = el;
      // 标识 $el 选项与实例的引用
      activeHu.set( el, this );
    }

    /** 当前实例的实例配置 */
    const options = optionsMap[ $info.name ];
    /** 当前实例 $info 原始对象 */
    const infoTarget = observeProxyMap.get( $info ).target;

    // 运行 beforeMount 生命周期方法
    callLifecycle( this, 'beforeMount', options );

    // 执行 render 方法, 进行渲染
    this.$forceUpdate();

    // 标记首次实例挂载已完成
    infoTarget.isMounted = infoTarget.isConnected = true;

    // 运行 mounted 生命周期方法
    callLifecycle( this, 'mounted', options );
  }

  return this;
}