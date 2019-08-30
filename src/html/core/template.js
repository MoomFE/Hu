import { marker, markerRegex, lastAttributeNameRegex, boundAttributeSuffix, boundAttributeSuffixLength, commentMarkerRegex, boundAttributeSuffixRegex } from "../const/index";
import createMarker from "../util/createMarker";
import getAttribute from "../../shared/util/getAttribute";


export default class Template{

  constructor( result, element ){
    this.element = element;
    this.parts = [];

    if( result.values.length ){
      // 最后一个参数那样传值没有别的原因, 就是满足下自己的强迫症而已
      // 啥强迫症 ?
      // 看 init 方法接收值的地方
      this.init( result, element, this );
    }
  }

  init(
    { strings, values: { length } },
    { content },
    { parts }
  ){
    const walker = document.createTreeWalker( content, 133, null, false );
    const nodesToRemove = [];
    const templateStack = [];
    let partIndex = 0;
    let lastPartIndex = 0;
    let index = -1;

    while( partIndex < length ){
      const node = walker.nextNode();

      // 当前解析的节点是 template 元素的子节点
      // 如果 template 元素的子节点解析完成后, 会从堆栈中取出最后解析的 template 元素, 然后继续解析下面的内容
      if( node === null ){
        walker.currentNode = templateStack.pop();
        continue;
      }

      index++;

      switch( node.nodeType ){

        // ElementNode
        case 1: {
          if( node.hasAttributes() ){
            const attributes = node.attributes;
            const length = attributes.length;
  
            // 遍历当前元素节点的所有属性 ( attribute )
            // 得到当前元素节点的所有属性绑定总和
            let count = 0;
            for( let index = 0; index < length; index++ ){
              endsWith( attributes[ index ].name, boundAttributeSuffix ) && (
                count++
              );
            }

            // 将当前元素节点上所有以插值绑定写入的属性按照顺序取出
            while( count-- > 0 ){
              /** 当前属性插值绑定片段 */
              const stringForPart = strings[ partIndex ];
              /** 属性名称 */
              const name = lastAttributeNameRegex.exec( stringForPart )[2];
              /** 实际属性名称 */
              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
              /** 属性值 */
              const attributeValue = getAttribute( node, attributeLookupName );
              /** 属性值的静态内容合集 */
              const statics = attributeValue.split( markerRegex );

              node.removeAttribute( attributeLookupName );
              partIndex += statics.length - 1;
              parts.push({
                type: 'attribute',
                index,
                name,
                strings: statics
              });
            }
          }
          // 当前解析的节点是 template 元素
          // 因为 TreeWalker 不会主动解析 template 元素的子节点
          // 所以将当前节点保存到堆栈, 然后手动将当前节点重定向至 template 的内容根节点, 开始解析 template 元素的子节点
          // 如果在当前 template 元素的子节点中又遇到了新的 template 元素, 那么重复上述两个操作
          // 如果 template 元素的子节点解析完成后, 会从堆栈中取出最后解析的 template 元素, 然后继续解析下面的内容
          if( node.tagName === 'TEMPLATE' ){
            templateStack.push( node );
            walker.currentNode = node.content;
          }
          break;
        };

        // TextNode
        case 3: {
          const data = node.data;

          // 解析类似元素属性绑定的绑定
          if( data.indexOf( marker ) >= 0 ){
            const parent = node.parentNode;
            const strings = data.split( markerRegex );
            const lastIndex = strings.length - 1;

            // 解析当前文本节点中所有的类似元素属性绑定的绑定
            // 将单个文本节点根据插值绑定分割成多个文本节点
            for( let i = 0; i < lastIndex; i++ ){
              let string = strings[ i ];
              const match = lastAttributeNameRegex.exec( string );

              if( match !== null && endsWith( match[2], boundAttributeSuffix ) ){
                string = string.slice( 0, match.index )
                       + match[ 1 ]
                       + match[ 2 ].slice( 0, -boundAttributeSuffixLength )
                       + match[ 3 ];
              }

              parent.insertBefore(
                document.createTextNode( string ),
                node
              );
              parts.push({
                type: 'node',
                index: ++index
              });
            }

            // 如果当前节点末尾除了插值绑定还有其他内容
            // 那么可以将当前文本节点作为结束标记
            if( strings[ lastIndex ] !== '' ) node.data = strings[ lastIndex ];
            // 如果当前节点不可作为结束标记
            // 那么需要添加一个空注释节点作为结束标记
            else{
              nodesToRemove.push( node );
              parent.insertBefore(
                createMarker(),
                node
              );
            }

            partIndex += lastIndex;
          }
          break;
        };

        // CommentNode
        case 8: {
          // 当前注释是插值绑定生成的注释标记
          if( node.data === marker ){
            // 如果没有可以作为开始标记的节点
            // 或者上一个节点已经被上一个插值绑定作为开始节点了
            // 那么需要添加一个空注释节点作为开始标记
            if( node.previousSibling === null || index === lastPartIndex ){
              index++;
              node.parentNode.insertBefore(
                createMarker(),
                node
              );
            }

            lastPartIndex = index;
            parts.push({
              type: 'node',
              index
            });

            // 如果没有可以作为结束标记的节点
            // 那么将当前注释本身清空作为结束标记
            if( node.nextSibling === null ) node.data = '';
            // 如果有可以作为结束标记的节点
            // 那么可以删除掉当前注释节点
            else{
              nodesToRemove.push( node );
              index--;
            }

            partIndex++;
          }
          // 正常注释
          else{
            const data = node.data = node.data.replace( commentMarkerRegex, marker ).replace( boundAttributeSuffixRegex, '' );
            let markerIndex = -1;

            // 查找注释中所有插值绑定
            while( ( markerIndex = data.indexOf( marker, markerIndex + 1 ) ) !== -1 ){
              partIndex++;
              parts.push({
                type: 'node',
                index: -1
              });
            }
          }
          break;
        };

      }
    }

    // 将收集到的可移除的节点进行删除
    for( const node of nodesToRemove ){
      node.parentNode.removeChild( node );
    }
  }
}


function endsWith( str, suffix ){
  const index = str.length - suffix.length;
  return index >= 0 && str.slice( index ) === suffix;
}