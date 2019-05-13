import { lastAttributeNameRegex } from "../const/index";
import { marker, nodeMarker, boundAttributeSuffix } from "../../../node_modules/lit-html/lib/template";


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