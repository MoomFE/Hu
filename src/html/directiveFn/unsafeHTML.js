import directiveFn from "../../static/directiveFn/index";
import NodePart from "../core/node";


export default directiveFn(

  class UnsafeHTMLDirectiveFnClass{
    constructor( part ){
      if( !( part instanceof NodePart ) ){
        throw new Error('Hu.html.unsafe 指令方法只能在文本区域中使用 !');
      }

      this.part = part;
    }
    commit( value ){
      // 这次设置的值和上次是一样的
      if( value === this.value ){
        return;
      }

      this.value = value;

      const template = document.createElement('template');
            template.innerHTML = value;

      const fragment = document.importNode( template.content, true );

      // 设置节点内容
      this.part.commit( fragment );
    }
  }

);