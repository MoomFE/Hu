import { isCEPolyfill } from "../../shared/const/env";
import templateProcessor from "./templateProcessor";
import NodePart from "./node";


export default class TemplateInstance{

  constructor( template ){
    this.parts = [];
    this.template = template;
  }

  update( values ){
    const parts = this.parts;
    let index = 0;

    for( const part of parts ){
      if( part !== void 0 ) part.setValue( values[ index ] );
      index++;
    }
    for( const part of parts ){
      if( part !== void 0 ) part.commit();
    }
  }

  clone(){
    const { template } = this;
    const { parts, element: { content }, parts: { length: partsLength } } = template;
    const fragment = isCEPolyfill ? content.cloneNode( true ) : document.importNode( content, true );
    const stack = [];
    const walker = document.createTreeWalker( fragment, 133, null, false );
    let partIndex = 0;
    let nodeIndex = 0;
    let part;
    let node = walker.nextNode();

    while( partIndex < partsLength ){
      part = parts[ partIndex ];

      if( !isTemplatePartActive( part ) ){
        this.parts.push( void 0 );
        partIndex++;
        continue;
      }

      while( nodeIndex < part.index ){
        nodeIndex++;

        if( node.nodeName === 'TEMPLATE' ){
          stack.push( node );
          walker.currentNode = node.content;
        }

        node = walker.nextNode();

        if( node === null ){
          walker.currentNode = stack.pop();
          node = walker.nextNode();
        }
      }

      if( part.type === 'node' ){
        const part = new NodePart();
              part.insertAfterNode( node.previousSibling );
        this.parts.push( part );
      }else{
        this.parts.push(
          ...templateProcessor.attr( node, part.name, part.strings )
        );
      }

      partIndex++;
    }

    if( isCEPolyfill ){
      document.adoptNode( fragment );
      customElements.upgrade( fragment );
    }

    return fragment;
  }

}


function isTemplatePartActive( part ){
  return part.index !== -1;
}