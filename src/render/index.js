import { renderStack, renderParts } from './const';
import NodePart from '../html/core/node';
import removeNodes from '../shared/util/removeNodes';
import commitPart from '../html/util/commitPart';
import destroyRender from './util/destroyRender';


function basicRender(result, container) {
  // 传入 null 或 undefined 可以注销某个已渲染的节点
  if (result == null) {
    destroyRender(container);
  }

  // 尝试获取上次创建的节点对象
  let part = renderParts.get(container);

  // 首次在该目标对象下进行渲染, 对节点对象进行创建
  if (!part) {
    // 移除需要渲染的目标对象下的所有内容
    removeNodes(container, container.firstChild);

    // 创建节点对象
    renderParts.set(
      container,
      part = new NodePart()
    );
    // 将节点对象添加至目标元素
    part.appendInto(container);
  }

  commitPart(part, result);
}


/**
 * 对外渲染方法
 */
export default function render(result, container) {
  renderStack.push(container);
  basicRender(result, container);
  renderStack.pop();
}
