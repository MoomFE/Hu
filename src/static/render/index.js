import html from "../../html/html";
import render from "../../html/render";
import { apply } from "../../shared/global/Reflect/index";


export default function staticRender( result, container ){
  if( arguments.length > 1 ){
    return render( result, container );
  }

  container = result;

  return function(){
    const result = apply( html, null, arguments );
    return render( result, container );
  }
}