import { boundAttributeSuffix, markerRegex, marker, createMarker } from "../../../node_modules/lit-html/lib/template";
import { lastAttributeNameRegex } from "../const/index";


export default class Template{

  constructor( result, element ){
    this.parts = [];
    this.element = element;

    const nodesToRemove = [];
    const stack = [];
    const walker = document.createTreeWalker( element.content, 133, null, false );
    const { strings, values: { length } } = result;
    let lastPartIndex = 0;
    let index = -1;
    let partIndex = 0;

    while( partIndex < length ){
      const node = walker.nextNode();

      if( node === null ){
        walker.currentNode = stack.pop();
        continue;
      }

      index++;

      /**
       * ElementNode
       */
      if( node.nodeType === 1 ){
        if( node.hasAttributes() ){
          const attributes = node.attributes;
          const { length } = attributes;
      
          let count = 0;
          for( let i = 0; i < length; i++ ){
            if( endsWith( attributes[ i ].name, boundAttributeSuffix ) ){
              count++;
            }
          }
      
          while( count-- > 0 ){
            const stringForPart = strings[ partIndex ];
            const name = lastAttributeNameRegex.exec( stringForPart )[2];
            const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
            const attributeValue = node.getAttribute( attributeLookupName );
            const statics = attributeValue.split( markerRegex );

            node.removeAttribute( attributeLookupName );
            partIndex += statics.length - 1;
            this.parts.push({
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
      /**
       * TextNode
       */
      else if( node.nodeType === 3 ){
        const data = node.data;

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
              const match = lastAttributeNameRegex.exec( s );

              if( match !== null && endsWith( match[2], boundAttributeSuffix ) ){
                string = string.slice( 0, match.index )
                       + match[ 1 ]
                       + match[ 2 ].slice( 0, -boundAttributeSuffix.length )
                       + match[ 3 ];
              }

              insert = document.createTextNode( string );
            }

            parent.insertBefore( insert, node );
            this.parts.push({
              type: 'node',
              index: ++index
            });
          }

          if( strings[ lastIndex ] === '' ){
            parent.insertBefore( createMarker(), node );
            nodesToRemove.push( node );
          }else{
            node.data = strings[ lastIndex ];
          }

          partIndex += lastIndex;
        }
      }
      /**
       * CommentNode
       */
      else if( node.nodeType === 8 ){
        if( node.data === marker ){
          const parent = node.parentNode;

          if( node.previousSibling === null || index === lastPartIndex ){
            index++;
            parent.insertBefore( createMarker(), node );
          }

          lastPartIndex = index;
          this.parts.push({
            type: 'node',
            index
          });

          if( node.nextSibling === null ){
            node.data = '';
          }else{
            nodesToRemove.push( node );
            index--
          }

          partIndex++;
        }else{
          let i = -1;

          while( ( i = node.data.indexOf( marker, i + 1 ) ) !== -1 ){
            partIndex++;
            this.parts.push({
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