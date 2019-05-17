import { lastAttributeNameRegex, boundAttributeSuffix, marker, nodeMarker, commentMarker } from "../const/index";
import moveChildNodes from "../../shared/util/moveChildNodes";


export default class TemplateResult{

  constructor( strings, values, type ){
    this.strings = strings;
    this.values = values;
    this.type = type;
  }

  getHTML(){
    const strings = this.strings;
    const length = strings.length - 1;
    let html = '';
    let isCommentBinding;

    for( let index = 0; index < length; index++ ){
      /** 当前解析的片段 */
      const string = strings[ index ];
      /** 是否在当前解析的片段中查找到了新的文档注释开始标记 */
      const commentOpen = string.lastIndexOf('<!--');
      /** 是否在当前解析的片段中查找到了元素属性绑定 */
      const attributeMatch = lastAttributeNameRegex.exec( string );

      // 当前解析的片段是否正处在文档注释中
      // 1. commentOpen > -1 && string.indexOf( '-->', commentOpen + 1 ) === -1
      //    从当前解析的片段末尾开始查找到了文档注释开始标记,
      //    从这个位置开始, 若找到了文档注释结束标记, 那么就算文档注释结束了,
      //    当前解析的片段就不是文档注释中的绑定了
      // 2. isCommentBinding && string.indexOf( '-->', commentOpen + 1 ) === -1
      //    如果之前解析的片段没有查找到文档注释结束标记, 那么现在就是处于文档注释中
      //    如果这时候在当前解析的片段中查找到了文档注释结束标记, 那么就算文档注释结束了,
      //    当前解析的片段就不是文档注释中的绑定了
      // 3. ( commentOpen > -1 || isCommentBinding ) && string.indexOf( '-->', commentOpen + 1 ) === -1;
      //    如果之前解析的片段没有查找到文档注释结束标记, 又从当前解析的片段末尾开始又查找到了文档注释开始标记,
      //    相当于是这样的结构: html`<!-- ${ something } <!-- -->`,
      //    那么之前解析的片段中的注释开始标记, 就会和现在的片段中的文档注释结束标记结合成为一个完整的文档注释,
      //    那么依旧算文档注释结束了, 当前解析的片段就不是文档注释中的绑定了
      isCommentBinding = ( commentOpen > -1 || isCommentBinding ) && string.indexOf( '-->', commentOpen + 1 ) === -1;

      // 将文本绑定和元素属性绑定转为指定格式
      // 1. 普通内容绑定
      //    示　例: html`123${ something }456`
      //    转换后: `123<!--{{hu-666}}-->456`
      // 2. 注释中的内容绑定
      //    示　例: html`<!--${ something }-->`
      //    转换后: `<!-- {{hu-666}} -->`
      //    提　示: 注释中的内容绑定会在标记左右各加一个空格,
      //　　        防止注释中的绑定在转换完后变成 `<!--{{hu-666}}-->`, 在最终解析的时候就会被解析成普通内容绑定
      // 3. 元素属性绑定
      //    示　例: html`<div class=${ something }></div>`
      //    转换后: `<div class$hu$={{hu-666}}></div>`
      // 3. 类元素属性绑定的绑定
      //    示　例: html`<div> class=${ something } </div>`
      //　　　      html`<!-- class=${ something } -->`
      //    转换后: `<div> class$hu$={{hu-666}} </div>`
      //　　　      `<!-- class$hu$={{hu-666}} -->`
      //    提　示: 文本节点中的类元素属性绑定最终会被解析为普通内容绑定
      //　　        注释节点中的类元素属性绑定最终不会被解析
      if( attributeMatch === null ){
        html += string + ( isCommentBinding ? commentMarker : nodeMarker );
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