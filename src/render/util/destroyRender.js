import { renderParts } from "../const";


export default
/**
 * 注销某个已渲染的节点
 * @param {Element} container 已渲染的根节点
 */
( container ) => {
  /** 获取在传入节点渲染时使用的 NodePart */
  const nodePart = renderParts.get( container );

  if( nodePart ){
    nodePart.destroy();
    renderParts.delete( container );
  }
}