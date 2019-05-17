import { marker, markerRegex, lastAttributeNameRegex, boundAttributeSuffix } from "../const/index";
import createMarker from "../util/createMarker";


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
    const stack = [];
    let partIndex = 0;
    let lastPartIndex = 0;
    let index = -1;

    while( partIndex < length ){
      const node = walker.nextNode();
      const nodeType = node.nodeType;

      if( node === null ){
        walker.currentNode = stack.pop();
        continue;
      }

      // 暂时还不知道有什么用
      index++;

      // ElementNode
      if( nodeType === 1 ){
        if( node.hasAttributes() ){
          const attributes = node.attributes;
          const length = attributes.length;

          let count = 0;
          for( let index = 0; index < length; index++ ){
            endsWith( attributes[ index ].name, boundAttributeSuffix ) && (
              count++
            );
          }

          while( count-- > 0 ){
            const stringForPart = strings[ partIndex ];
            const name = lastAttributeNameRegex.exec( stringForPart )[2];
            const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
            const attributeValue = node.getAttribute( attributeLookupName );
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
        if( node.tagName === 'TEMPLATE' ){
          stack.push( node );
          walker.currentNode = node.content;
        }
      }
      // TextNode
      else if( nodeType === 3 ){
        const data = node.data;

        // 类似元素属性绑定的绑定
        if( data.indexOf( marker ) >= 0 ){
          const parent = node.parentNode;
          const strings = data.split( markerRegex );
          const lastIndex = strings.length - 1;

          for( let i = 0; i < lastIndex; i++ ){
            let insert;
            let string = strings[ i ];

            if( string === '' ){
              insert = createMarker();
            }else{
              const match = lastAttributeNameRegex.exec( string );

              if( match !== null && endsWith( match[2], boundAttributeSuffix ) ){
                string = string.slice( 0, match.index )
                       + match[ 1 ]
                       + match[ 2 ].slice( 0, -boundAttributeSuffix.length )
                       + match[ 3 ];
              }

              insert = document.createTextNode( string );
            }

            parent.insertBefore( insert, node );
            parts.push({
              type: 'node',
              index: ++index
            });
          }

          if( strings[ lastIndex ] === '' ){
            nodesToRemove.push( node );
            parent.insertBefore(
              createMarker(),
              node
            );
          }else{
            node.data = strings[ lastIndex ];
          }

          partIndex += lastIndex;
        }
      } 
      // CommentNode
      else if( nodeType === 8 ){
        // 当前注释是插值绑定生成的注释标记
        if( node.data === marker ){
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

          if( node.nextSibling === null ){
            node.data = '';
          }else{
            nodesToRemove.push( node );
            index--;
          }

          partIndex++;
        }
        // 正常注释
        else {
          let markerIndex = -1;

          while( ( markerIndex = node.data.indexOf( marker, markerIndex + 1 ) ) !== -1 ){
            partIndex++;
            parts.push({
              type: 'node',
              index: -1
            });
          }
        }
      }
    }

    for( const node of nodesToRemove ){
      node.parentNode.removeChild( node );
    }

  }
}


function endsWith( str, suffix ){
  const index = str.length - suffix.length;
  return index >= 0 && str.slice( index ) === suffix;
}