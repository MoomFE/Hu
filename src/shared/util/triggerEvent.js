export default
/**
 * 触发事件
 * @param {Element} elem
 * @param {string} type
 */
( target, type ) => {
  const event = document.createEvent('HTMLEvents');
  event.initEvent( type, true, true );
  target.dispatchEvent( event );
}