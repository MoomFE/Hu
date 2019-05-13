import { lastAttributeNameRegex, boundAttributeSuffix, marker, nodeMarker } from "../const/index";
import moveChildNodes from "../../shared/util/moveChildNodes";


export default class TemplateResult{

  constructor( strings, values, type, processor ){
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }

  getHTML(){
    const strings = this.strings;
    const length = strings.length - 1;
    let html = '';
    let isCommentBinding;

    for( let index = 0; index < length; index++ ){
      const string = strings[ index ];
      const commentOpen = string.lastIndexOf('<!--');
      const attributeMatch = lastAttributeNameRegex.exec( string );

      isCommentBinding = ( commentOpen > -1 || isCommentBinding ) && string.indexOf( '-->', commentOpen + 1 ) === -1;

      if( attributeMatch === null ){
        html += string + ( isCommentBinding ? marker : nodeMarker );
      }else{
        html += string.substr( 0, attributeMatch.index )
              + attributeMatch[ 1 ]
              + attributeMatch[ 2 ]
              + boundAttributeSuffix
              + attributeMatch[ 3 ]
              + marker;
      }
    }

    return html + strings[ length ];
  }

  getTemplateElement(){
    const template = document.createElement('template');
          template.innerHTML = this.getHTML();

    return template;
  }

}

export class SVGTemplateResult extends TemplateResult{

  getHTML(){
    return `<svg>${ super.getHTML() }</svg>`;
  }

  getTemplateElement(){
    const template = super.getTemplateElement();
    const content = template.content;
    const elem = content.firstChild;

    content.removeChild( elem );
    moveChildNodes( content, elem.firstChild );

    return template;
  }

}