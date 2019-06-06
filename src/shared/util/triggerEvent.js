import { isArray } from "../global/Array/index";

export default
/**
 * 触发事件
 * @param {Element} elem 触发事件的元素对象
 * @param {string} type 事件名称
 * @param {Function} process 其它处理
 */
( target, type, process ) => {
  /**
   * 创建事件对象
   */
  const event = document.createEvent('HTMLEvents');

  // 如果想设置 initEvent 方法的 bubbles, cancelable 参数
  // 可以将 type 替换为数组
  // 数组内依次是 type, bubbles, cancelable
  if( !isArray( type ) ){
    type = [ type, true, true ];
  }

  // 初始化事件对象
  event.initEvent( ...type );

  // 可传入方法对事件对象做其它处理
  if( process ) process( event, target );

  // 触发事件
  target.dispatchEvent( event );
}