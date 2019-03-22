import html, { render as litRender } from "../../html/index";


export default html;

export function render( result, container ){
  if( arguments.length > 1 ){
    return litRender( result, container );
  }

  container = result;

  return function(){
    const result = html.apply( null, arguments );
    return litRender( result, container );
  }
}