import directiveFn from "../../static/directiveFn/index";
import NodePart from "../core/node";
import isPrimitive from "../../shared/util/isPrimitive";
import commitPart from "../util/commitPart";


/**
 * lit-html
 * directives/unsafeHTML
 * Licensed under the MIT License
 * http://polymer.github.io/LICENSE.txt
 *
 * modified by Wei Zhang (@Zhang-Wei-666)
 */

/**
 * 存储节点上次设置的值及其选项
 */
const optionsMap = new WeakMap();


export default directiveFn( value => part => {
  if( !( part instanceof NodePart ) ){
    throw new Error('Hu.html.unsafe 指令方法只能在文本区域中使用 !');
  }

  /**
   * 上次设置的值及其选项
   */
  const options = optionsMap.get( part );

  // 1. 非首次渲染
  // 2. 传入值是原始对象
  if( options && isPrimitive( value ) ){
    // 3. 这次设置的值和上次是一样的
    // 4. 节点的内容是和上次是一样的
    if( value === options.value && part.value === options.fragment ){
      return;
    }
  }

  const template = document.createElement('template');
        template.innerHTML = value;

  const fragment = document.importNode( template.content, true );

  // 设置节点内容
  commitPart( part, fragment, true );

  // 保存本次设置的值及其选项
  optionsMap.set( part, {
    value,
    fragment
  });
});