import { optionsMap } from "../../static/define/initOptions/index";
import { Watcher } from "../../static/observable/collectingDependents";
import html from "../../html/html";
import render from "../../html/render";
import noop from "../../shared/util/noop";


/** 迫使 Hu 实例重新渲染 */
export default ( name, target, targetProxy ) => {
  /** 当前实例的实例配置 */
  const userRender = optionsMap[ name ].render;

  if( userRender ){
    const { get } = new Watcher(() => {
      const $el = target.$el;

      if( $el ){
        render( userRender.call( targetProxy, html ), $el );
        target.$refs = getRefs( $el );
      }
    });

    target.$forceUpdate = get;
  }else{
    target.$forceUpdate = noop;
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