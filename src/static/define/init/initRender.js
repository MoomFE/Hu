import { html, TemplateResult, render } from "../../../html/index";
import { collectingDependents } from "../../observable/util/collectingDependents";


export default function initRender( root, options, target, targetProxy ){

  const userRender = options.render.bind( targetProxy );
  const { $el } = target;

  /**
   * 迫使 Lit 实例重新渲染
   */
  target.$forceUpdate = collectingDependents(() => {
    const templateResult = userRender( html );

    if( templateResult instanceof TemplateResult ){
      render( templateResult, $el, {
        scopeName: root.localName,
        eventContext: root
      });
    }
  });

}