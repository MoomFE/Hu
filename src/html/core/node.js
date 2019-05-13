import isDirective from "../util/isDirective";
import isEqual from "../../shared/util/isEqual";
import isPrimitive from "../../shared/util/isPrimitive";
import isString from "../../shared/util/isString";
import removeNodes from "../../shared/util/removeNodes";
import TemplateResult from "./templateResult";
import TemplateInstance from "./templateInstance";
import isIterable from "../../shared/util/isIterable";
import { isArray } from "../../shared/global/Array/index";
import templateFactory from "./templateFactory";
import createMarker from "../util/createMarker";


export default class NodePart{

  setValue( value ){
    if( isDirective( value ) ){
      return value( this );
    }

    this.oldValue = this.value;
    this.value = value;
  }

  commit(){
    const { value, oldValue } = this;

    if( isEqual( value, oldValue ) ){
      return;
    }

    if( isPrimitive( value ) ){
      commitText( this, value );
    }
    else if( value instanceof TemplateResult ){
      commitTemplateResult( this, value );
    }
    else if( value instanceof Node ){
      commitNode( this, value );
    }
    else if( isIterable( value ) ){
      commitIterable( this, value );
    }else{
      commitText( this, value );
    }
  }

  /**
   * 添加当前节点到父节点中
   * @param {NodePart} part 
   */
  appendIntoPart( part ){
    part.insert( this.startNode = createMarker() );
    part.insert( this.endNode = createMarker() );
  }
  /**
   * 添加当前节点到指定节点后
   * @param {NodePart} part 
   */
  insertAfterPart( part ){
    part.insert( this.startNode = createMarker() );
    this.endNode = part.endNode;
    part.endNode = this.startNode;
  }
  /**
   * 将当前节点到指定 DOM 节点中
   * @param {Element} container 
   */
  appendInto( container ){
    this.startNode = container.appendChild( createMarker() );
    this.endNode = container.appendChild( createMarker() );
  }
  /**
   * 添加当前节点到指定节点后
   * @param {NodePart} part 
   */
  insertAfterNode( part ){
    this.startNode = part;
    this.endNode = part.nextSibling;
  }
  /**
   * 插入 DOM 节点到当前节点中
   * @param {Node} node 
   */
  insert( node ){
    const endNode = this.endNode;
    endNode.parentNode.insertBefore( node, endNode );
  }
  /**
   * 清空当前节点的所有内容
   * @param {Node} startNode 
   */
  clear( startNode = this.startNode ){
    removeNodes( this.startNode.parentNode, startNode.nextSibling, this.endNode );
  }

};


function commitText( nodePart, value ){
  if( value == null ) value = '';

  const node = nodePart.startNode.nextSibling;
  const valueAsString = isString( value ) ? value : String( value );

  if( node === nodePart.endNode.previousSibling && node.nodeType === 3 ){
    node.data = valueAsString;
  }else{
    commitNode(
      nodePart,
      document.createTextNode( valueAsString )
    );
  }
}

function commitNode( nodePart, value ){
  nodePart.clear();
  nodePart.insert( value );
}

function commitTemplateResult( nodePart, value ){
  const oldValue = nodePart.oldValue;
  const template = templateFactory( value );

  if( oldValue instanceof TemplateInstance && oldValue.template === template ){
    nodePart.value = oldValue;
    oldValue.update( value.values );
  }else{
    const instance = nodePart.value = new TemplateInstance( template, value.processor );
    const fragment = instance.clone();

    instance.update( value.values );
    commitNode( nodePart, fragment );
  }
}

function commitIterable( nodePart, value ){
  if( !isArray( nodePart.oldValue ) ){
    nodePart.oldValue = [];
    nodePart.clear();
  }

  const itemParts = nodePart.oldValue;
  let partIndex = 0;
  let itemPart;

  for( const item of value ){
    itemPart = itemParts[ partIndex ];

    if( itemPart === undefined ){
      itemPart = new NodePart( nodePart.options );
      itemParts.push( itemPart );

      if( partIndex === 0 ){
        itemPart.appendIntoPart( nodePart );
      }else{
        itemPart.insertAfterPart( itemParts[ partIndex - 1 ] );
      }
    }

    itemPart.setValue( item );
    itemPart.commit();
    partIndex++;
  }

  if( partIndex < itemParts.length ){
    itemParts.length = partIndex;
    nodePart.clear( itemPart && itemPart.endNode );
  }

  nodePart.value = itemParts;
}