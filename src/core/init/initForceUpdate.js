import { optionsMap } from "../../static/define/initOptions/index";
import { Watcher } from "../../static/observable/collectingDependents";
import html from "../../html/html";
import render from "../../render/index";
import { slice } from "../../shared/global/Array/prototype";


/**
 * 渲染函数的 Watcher 缓存
 */
const renderWatcherCache = new WeakMap();

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

/**
 * 清空 render 方法收集到的依赖
 */
export function removeRenderDeps( targetProxy ){
  const watcher = renderWatcherCache.get( targetProxy );

  if( watcher ){
    watcher.clean();
  }
}

function getRefs( root ){
  const refs = {};
  const elems = root.querySelectorAll('[ref]');

  if( elems.length ){
    slice.call( elems ).forEach( elem => {
      const name = elem.getAttribute('ref');
      refs[ name ] = refs[ name ] ? [].concat( refs[ name ], elem )
                                  : elem;
    });
  }

  return Object.freeze( refs );
}