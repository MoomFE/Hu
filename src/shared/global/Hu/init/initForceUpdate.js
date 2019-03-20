import { optionsMap } from "../../../../static/define/initOptions/index";
import { createCollectingDependents } from "../../../../static/observable/util/collectingDependents";
import html, { render } from "../../../../html/index";
import noop from "../../../util/noop";


/** 迫使 Hu 实例重新渲染 */
export default ( name, target, targetProxy ) => {
  /** 当前实例的实例配置 */
  const userRender = optionsMap[ name ].render;

  if( userRender ){
    target.$forceUpdate = createCollectingDependents(() => {
      const $el = target.$el;

      if( $el ){
        const result = userRender.call( targetProxy, html );
        render( result, $el );
      }
    });
  }else{
    target.$forceUpdate = noop;
  }
}