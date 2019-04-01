export default
/**
 * 绑定事件
 * @param {Element} elem
 * @param {string} type
 * @param {function} listener
 * @param {boolean|{}} options
 */
( elem, type, listener, options ) => {
  elem.addEventListener( type, listener, options );
}