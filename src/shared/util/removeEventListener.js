/**
 * 事件移除方法
 */
const removeEventListener = HTMLElement.prototype.removeEventListener;


export default
/**
 * 移除事件
 * @param {Element} elem
 * @param {string} type
 * @param {function} listener
 * @param {boolean|{}} options
 */
( elem, type, listener, options ) => {
  removeEventListener.call( elem, type, listener, options );
}