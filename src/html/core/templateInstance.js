import { isCEPolyfill } from "../../shared/const/env";
import templateProcessor from "./templateProcessor";
import NodePart from "./node";
import isDirectiveFn from "../../static/directiveFn/util/isDirectiveFn";
import { activeDirectiveFns } from "../../static/directiveFn/const/index";
import commitPart from "../util/commitPart";
import destroyPart from "../util/destroyPart";


export default class TemplateInstance{

  constructor( template ){
    this.parts = [];
    this.template = template;
  }

  /**
   * 更新模板片段中插值绑定中的值
   */
  update( values ){
    let index = 0;

    for( const part of this.parts ){
      part && commitPart(
        part,
        values[ index++ ]
      );
    }
  }

  /**
   * 初始化模板片段
   */
  init(){
    const template = this.template;
    const templateParts = template.parts;
    const templatePartsLength = templateParts.length;
    const templateContent = template.element.content;
    const fragment = isCEPolyfill ? templateContent.cloneNode( true ) : document.importNode( templateContent, true );
    const walker = document.createTreeWalker( fragment, 133, null, false );
    const templateStack = [];
    let partIndex = 0;
    let nodeIndex = 0;
    let node = walker.nextNode();

    // 遍历模板上的所有插值绑定
    while( partIndex < templatePartsLength ){
      /** 插值绑定参数 */
      let part = templateParts[ partIndex ];

      // 注释节点中的插值绑定将被忽略
      if( part.index === -1 ){
        this.parts.push( void 0 );
        partIndex++;
        continue;
      }

      // 如果插值绑定的目标节点 index 小于当前节点 index
      // 那么使用循环快速定位到目标节点
      while( nodeIndex < part.index ){
        nodeIndex++;

        // 当前解析的节点是 template 元素
        // 因为 TreeWalker 不会主动解析 template 元素的子节点
        // 所以将当前节点保存到堆栈, 然后手动将当前节点重定向至 template 的内容根节点, 开始解析 template 元素的子节点
        // 如果在当前 template 元素的子节点中又遇到了新的 template 元素, 那么重复上述两个操作
        // 如果 template 元素的子节点解析完成后, 会从堆栈中取出最后解析的 template 元素, 然后继续解析下面的内容
        if( node.nodeName === 'TEMPLATE' ){
          templateStack.push( node );
          walker.currentNode = node.content;
        }

        node = walker.nextNode();

        // 当前解析的节点是 template 元素的子节点
        // 如果 template 元素的子节点解析完成后, 会从堆栈中取出最后解析的 template 元素, 然后继续解析下面的内容
        if( node === null ){
          walker.currentNode = templateStack.pop();
          node = walker.nextNode();
        }
      }

      // 如果是文本区域的插值绑定
      // 创建 NodePart 对当前插值绑定进行管理
      if( part.type === 'node' ){
        const part = new NodePart();
              part.insertAfterNode( node.previousSibling );
        this.parts.push( part );
      }
      // 如果不是文本区域的插值绑定, 那么就是元素属性的插值绑定
      // 使用元素属性处理方法判断该如何处理当前插值绑定
      else{
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

  destroy(){
    for( const part of this.parts ){
      part && destroyPart( part );
    }
  }

}