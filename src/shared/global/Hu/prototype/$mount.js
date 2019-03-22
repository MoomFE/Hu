import isString from "../../../util/isString";
import { observeProxyMap } from "../../../../static/observable/index";
import { optionsMap } from "../../../../static/define/initOptions/index";


/**
 * 挂载实例
 */
export default function( selectors ){
  const { $info } = this;

  // 首次挂载
  if( !$info.isMounted ){

    // 使用 new 创建的实例
    if( !$info.isCustomElement ){
      const el = selectors && (
        isString( selectors ) ? document.querySelector( selectors )
                              : selectors
      );

      if( !el || el === document.body || el === document.documentElement ){
        return this;
      }

      observeProxyMap.get( this ).target.$el = el;
    }

    /** 当前实例的实例配置 */
    const options = optionsMap[ $info.name ];
    /** 当前实例 $info 原始对象 */
    const infoTarget = observeProxyMap.get( $info ).target;

    // 运行 beforeMount 生命周期方法
    options.beforeMount.call( this );

    // 执行 render 方法, 进行渲染
    this.$forceUpdate();

    // 标记首次实例挂载已完成
    infoTarget.isMounted = true;

    // 运行 mounted 生命周期方法
    options.mounted.call( this );
  }

  return this;
}