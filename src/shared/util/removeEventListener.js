export default
/**
 * 移除事件
 * @param {Element} elem
 * @param {string} type
 * @param {function} listener
 * @param {boolean|{}} options
 */
( elem, type, listener, options ) => {
  elem.removeEventListener( type, listener, options );
}