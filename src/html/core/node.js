import isNotEqual from "../../shared/util/isNotEqual";
import isPrimitive from "../../shared/util/isPrimitive";
import isIterable from "../../shared/util/isIterable";
import isString from "../../shared/util/isString";
import removeNodes from "../../shared/util/removeNodes";
import { isArray } from "../../shared/global/Array/index";
import createMarker from "../util/createMarker";
import templateFactory from "./templateFactory";
import TemplateInstance from "./templateInstance";
import TemplateResult from "./templateResult";


export default class NodePart{

  commit( value, isDirectiveFn ){
    let oldValue;

    // 用户传递的是指令方法
    // 交给指令方法处理
    if( isDirectiveFn ) return value( this );

    // 两次传入的值不同
    if( isNotEqual( value, oldValue = this.value ) ){
      // 存储当前值
      this.value = value;
      // 更新节点内容
      if( isPrimitive( value ) ){
        commitText( this, value );
      }else if( value instanceof TemplateResult ){
        commitTemplateResult( this, value );
      }else if( value instanceof Node ){
        commitNode( this, value );
      }else if( isIterable( value ) ){
        commitIterable( this, value, oldValue );
      }else{
        commitText( this, value );
      }
    }
  }

  destroy(){
    const instance = this.instance;

    // 注销之前的模板
    if( instance ) instance.destroy();
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

}


/**
 * @param {NodePart} nodePart 
 * @param {any} value 
 */
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

/**
 * @param {NodePart} nodePart 
 * @param {any} value 
 */
function commitNode( nodePart, value ){
  nodePart.clear();
  nodePart.insert( value );
}

/**
 * @param {NodePart} nodePart 
 * @param {any} value 
 */
function commitTemplateResult( nodePart, value ){
  const template = templateFactory( value );
  const instance = nodePart.instance;

  // 可以复用之前的模板
  if( instance instanceof TemplateInstance && instance.template === template ){
    instance.update( value.values );
  }else{
    // 注销之前的模板
    if( instance ) instance.destroy();

    const newInstance = nodePart.instance = new TemplateInstance( template );
    const fragment = newInstance.init();

    newInstance.update( value.values );
    commitNode( nodePart, fragment );
  }
}

/**
 * @param {NodePart} nodePart 
 * @param {any} value 
 * @param {any} oldValue 
 */
function commitIterable( nodePart, value, oldValue ){
  if( !isArray( oldValue ) ){
    oldValue = [];
    nodePart.clear();
  }

  const parts = oldValue;
  let partIndex = 0;
  let part;

  for( const item of value ){
    part = parts[ partIndex ];

    if( part === void 0 ){
      part = new NodePart();
      parts.push( part );

      if( partIndex === 0 ){
        part.appendIntoPart( nodePart );
      }else{
        part.insertAfterPart( parts[ partIndex - 1 ] );
      }
    }

    part.commit( item );
    partIndex++;
  }

  if( partIndex < parts.length ){
    // 弃用无用组件
    while( partIndex < parts.length ){
      const part = parts.splice( partIndex, 1 )[0];
      part.destroy && part.destroy();
    }
    nodePart.clear( part && part.endNode );
  }

  nodePart.value = parts;
}