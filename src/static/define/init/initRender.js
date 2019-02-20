import { html, TemplateResult } from "../../../html/index";


export default function initRender( root, options, target, targetProxy ){

  const render = options.render.bind( targetProxy );
  const { $el } = target;

  /**
   * 迫使 Lit 实例重新渲染
   */
  target.$forceUpdate = () => {
    const templateResult = render( html );

    if( templateResult instanceof TemplateResult ){
      render( templateResult, $el, {
        scopeName: root.localName,
        eventContext: root
      });
    }
  }

}