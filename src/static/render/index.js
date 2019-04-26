import html from "../../html/html";
import litRender from "../../html/render";
import { apply } from "../../shared/global/Reflect/index";


export default function render( result, container ){
  if( arguments.length > 1 ){
    return litRender( result, container );
  }

  container = result;

  return function(){
    const result = apply( html, null, arguments );
    return litRender( result, container );
  }
}