import { optionsMap } from "../../static/define/initOptions/index";
import { Watcher } from "../../static/observable/collectingDependents";
import html from "../../html/html";
import render from "../../html/render";
import noop from "../../shared/util/noop";


/**
 * 渲染函数的 Watcher 缓存
 */
const renderWatcherCache = new WeakMap();

/** 迫使 Hu 实例重新渲染 */
export default ( name, target, targetProxy ) => {
  /** 当前实例的实例配置 */
  const userRender = optionsMap[ name ].render;

  if( userRender ){
    // 创建当前实例渲染方法的 Watcher
    const watcher = new Watcher(() => {
      const $el = target.$el;

      if( $el ){
        render( userRender.call( targetProxy, html ), $el );
        target.$refs = getRefs( $el );
      }
    });

    // 缓存当前实例渲染方法的 Watcher
    renderWatcherCache.set( targetProxy, watcher );

    target.$forceUpdate = watcher.get;
  }else{
    target.$forceUpdate = noop;
  }
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
    Array.from( elems ).forEach( elem => {
      const name = elem.getAttribute('ref');
      refs[ name ] = refs[ name ] ? [].concat( refs[ name ], elem )
                                  : elem;
    });
  }

  return Object.freeze( refs );
}