import isNotEqual from "../../shared/util/isNotEqual";
import isPrimitive from "../../shared/util/isPrimitive";
import isIterable from "../../shared/util/isIterable";
import removeNodes from "../../shared/util/removeNodes";
import { isArray } from "../../shared/global/Array/index";
import createMarker from "../util/createMarker";
import templateFactory from "./templateFactory";
import TemplateInstance from "./templateInstance";
import TemplateResult from "./templateResult";
import toString from "../../shared/util/toString";
import commitPart from "../util/commitPart";
import destroyPart from "../util/destroyPart";


/**
 * 文本区域的插值绑定节点管理对象
 */
export default class NodePart{

  commit( value, isDirectiveFn ){
    let oldValue;

    // 用户传递的是指令方法
    // 交给指令方法处理
    if( isDirectiveFn ) return value( this );

    // 两次传入的值不同
    // 更新节点内容
    if( isNotEqual( value, oldValue = this.value ) ){
      // 传入的是原始类型
      if( isPrimitive( value ) ){
        commitText( this, value );
      }
      // 传入的是新的模板
      else if( value instanceof TemplateResult ){
        // console.log( value.strings, value.values )
        commitTemplateResult( this, value );
      }
      // 传入的是元素节点
      else if( value instanceof Node ){
        commitNode( this, value );
        // 存储新值
        this.value = value;
      }
      // 传入的是类数组对象
      else if( isIterable( value ) ){
        commitIterable( this, value, oldValue );
      }
      // 其它类型
      else{
        commitText( this, value );
      }
    }
  }

  /** 销毁当前插值绑定内的所有内容 */
  destroy(){
    this.clear();
  }
  /**
   * 销毁当前插值绑定内的所有指令及 NodePart
   * @param {boolean} onlyDirective 是否只注销指令
   */
  destroyPart( onlyDirective ){
    // 注销模板片段对象 ( 如果有 )
    if( this.instance ){
      this.instance.destroy( onlyDirective );
      this.instance = void 0;
    }
    // 注销数组类型的写入值
    else if( isArray( this.value ) ){
      for( const part of this.value ){
        if( part ){
          if( onlyDirective && part instanceof NodePart ) part.destroyPart( onlyDirective );
          else destroyPart( part );
        }
      }
    }
  }
  /**
   * 清空当前插值绑定内的所有内容
   * @param {Node} startNode 
   */
  clear( ...args ){
    const hasStartNode = args.length > 0;
    const startNode = hasStartNode ? args[0] : this.startNode;

    // 若未指定起始位置, 那么需要清除 parts 指令片段
    // 若指定了起始位置, 那么 parts 的回收必须手动完成
    if( !hasStartNode ){
      this.destroyPart();
    }

    // 清除节点
    removeNodes( this.startNode.parentNode, startNode.nextSibling, this.endNode );
  }

  /**
   * 将当前插值绑定节点添加开始结尾标记并且将开始结尾标记添加到父节点
   * @param {NodePart} part 
   */
  appendIntoPart( part ){
    part.insert( this.startNode = createMarker() );
    part.insert( this.endNode = createMarker() );
  }
  /**
   * 将当前插值绑定节点添加到另一个插值绑定节点后
   * @param {NodePart} part 
   */
  insertAfterPart( part ){
    part.insert( this.startNode = createMarker() );
    this.endNode = part.endNode;
    part.endNode = this.startNode;
  }
  /**
   * 将当前插值绑定节点添加到指定节点中
   * @param {Element} container 
   */
  appendInto( container ){
    this.startNode = container.appendChild( createMarker() );
    this.endNode = container.appendChild( createMarker() );
  }
  /**
   * 将当前插值绑定节点添加到指定节点后
   * @param {NodePart} part 
   */
  insertAfterNode( part ){
    this.startNode = part;
    this.endNode = part.nextSibling;
  }
  /**
   * 插入节点到当前插值绑定节点末尾
   * @param {Node} node 
   */
  insert( node ){
    const endNode = this.endNode;
    endNode.parentNode.insertBefore( node, endNode );
  }

}

/**
 * 向插值绑定的位置插入文本节点
 * @param {NodePart} nodePart 
 * @param {any} value 
 */
function commitText( nodePart, value ){
  const node = nodePart.startNode.nextSibling;
  const valueAsString = toString( value );

  // 如果当前插值绑定内仅有一个节点并且是文本节点
  // 那么直接写入值到文本节点中
  if( node === nodePart.endNode.previousSibling && node.nodeType === 3 ){
    node.data = valueAsString;
  }
  // 否则需要将原插值绑定内的所有东西进行清除
  // 插入创建的文本节点
  else{
    commitNode(
      nodePart,
      document.createTextNode( valueAsString )
    );
  }

  // 存储新值
  nodePart.value = value;
}

/**
 * 向插值绑定的位置插入元素节点
 * @param {NodePart} nodePart 
 * @param {any} value 
 */
function commitNode( nodePart, value ){
  // 清除原插值绑定中的内容
  nodePart.clear();
  // 插入元素节点到插值绑定中
  nodePart.insert( value );
}

/**
 * 向插值绑定的位置插入模板片段对象
 * @param {NodePart} nodePart 
 * @param {any} value 
 */
function commitTemplateResult( nodePart, value ){
  const template = templateFactory( value );
  const instance = nodePart.instance;

  // 新模板和旧模板一致, 可以复用之前的模板
  if( instance instanceof TemplateInstance && instance.template === template ){
    instance.update( value.values );
  }
  // 新模板和旧模板不一致
  else{
    // 删除插值绑定之前的内容
    nodePart.clear();

    // 创建新的模板实例
    const newInstance = nodePart.instance = new TemplateInstance( template );
    // 初始化元素节点
    const fragment = newInstance.init();

    // 给模板片段写入值
    newInstance.update( value.values );
    // 插入元素节点到插值绑定中
    nodePart.insert( fragment );
    // 存储新值
    nodePart.value = value;
  }
}

/**
 * 向插值绑定的位置插入数组对象
 * @param {NodePart} nodePart 
 * @param {any} value 
 * @param {any} oldValue 
 */
function commitIterable( nodePart, value, oldValue ){
  // 旧值不是数组类型, 需要清除原插值绑定中的内容
  if( !isArray( oldValue ) ){
    oldValue = [];
    nodePart.clear();
  }

  const parts = oldValue;
  let partIndex = 0;
  let part;

  // 遍历数组内容
  // 数组的每个元素都使用一个新的 NodePart 管理起来
  for( const item of value ){
    // 获取到旧的 NodePart
    part = parts[ partIndex ];

    // 旧的当前元素位置没有创建 NodePart
    if( part === void 0 ){
      // 创建新的 NodePart 管理当前元素
      parts.push(
        part = new NodePart()
      );

      // 将新创建的 NodePart 添加到父级去
      if( partIndex === 0 ){
        part.appendIntoPart( nodePart );
      }else{
        part.insertAfterPart( parts[ partIndex - 1 ] );
      }
    }

    // 给 NodePart 设置值
    commitPart( part, item );
    partIndex++;
  }

  // 如果旧数组的的组件数量大于当前数组的组件数量
  if( partIndex < parts.length ){
    // 弃用旧数组多余出来的部分
    while( partIndex < parts.length ){
      const part = parts.splice( partIndex, 1 )[0];
      part.destroy && part.destroy();
    }
    // 弃用无用节点
    nodePart.clear( part && part.endNode );
  }

  nodePart.value = parts;
}