/**
 * 事件绑定方法
 */
const addEventListener = HTMLElement.prototype.addEventListener;


export default
/**
 * 绑定事件
 * @param {Element} elem
 * @param {string} type
 * @param {function} listener
 * @param {boolean|{}} options
 */
(elem, type, listener, options) => {
  addEventListener.call(elem, type, listener, options);
};
