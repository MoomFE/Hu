import { optionsMap } from "../../../static/define/initOptions/index";
import { Watcher } from "../../../static/observable/collectingDependents";
import { renderWatcherCache } from "./const/index";
import render from "../../../render/index";
import html from "../../../html/html";
import getRefs from "./util/getRefs";


/** 迫使 Hu 实例重新渲染 */
export default ( name, target, targetProxy, isCustomElement ) => {
  /** 当前实例实例选项 */
  const options = optionsMap[ name ];
  /** 当前实例的渲染方法 */
  const userRender = options.render;
  /** 当前实例的样式 */
  const userStyles = isCustomElement && options.styles && options.styles.cloneNode( true );
  /** 是否已经渲染过当前实例的样式 */
  let canRenderedStyles = !!userStyles;

  /** 当前实例渲染方法的 Watcher */
  const renderWatcher = new Watcher(() => {
    const el = target.$el;

    if( el ){
      // 执行用户渲染方法
      if( userRender ){
        render( userRender.call( targetProxy, html ), el );
      }
      // 添加自定义元素样式
      if( canRenderedStyles ){
        canRenderedStyles = false;
        el.appendChild( userStyles );
      }
      // 获取 refs 引用信息
      target.$refs = getRefs( el );
    }
  });

  // 缓存当前实例渲染方法的 Watcher
  renderWatcherCache.set( targetProxy, renderWatcher );
  // 返回收集依赖方法
  target.$forceUpdate = renderWatcher.get;
}