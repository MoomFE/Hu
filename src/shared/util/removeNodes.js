export default
/**
 * 移除某个元素下的所有子元素
 * @param {Element} container
 * @param {Node} startNode
 * @param {Node} endNode
 */
(container, startNode, endNode = null) => {
  let node = startNode;

  // eslint-disable-next-line eqeqeq
  while (node != endNode) {
    const next = node.nextSibling;

    container.removeChild(node);
    node = next;
  }
};
