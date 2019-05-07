import { optionsMap } from "../../../static/define/initOptions/index";
import { Watcher } from "../../../static/observable/collectingDependents";
import { renderWatcherCache } from "./const/index";
import render from "../../../render/index";
import html from "../../../html/html";
import getRefs from "./util/getRefs";


/** 迫使 Hu 实例重新渲染 */
export default ( name, target, targetProxy ) => {
  /** 当前实例的渲染方法 */
  const { render: userRender } = optionsMap[ name ];
  /** 当前实例渲染方法的 Watcher */
  const renderWatcher = new Watcher(() => {
    let el;

    if( userRender && ( el = target.$el ) ){
      // 执行用户渲染方法
      render(
        userRender.call( targetProxy, html ),
        el
      );
      // 获取 refs 引用信息
      target.$refs = getRefs( el );
    }
  });

  // 缓存当前实例渲染方法的 Watcher
  renderWatcherCache.set( targetProxy, renderWatcher );
  // 返回收集依赖方法
  target.$forceUpdate = renderWatcher.get;
}