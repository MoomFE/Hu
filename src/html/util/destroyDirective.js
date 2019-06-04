import { renderParts } from "../../render/const/index";


export default
/**
 * 注销某个已渲染的节点中所有的指令及指令方法
 * 但是不影响已渲染的 DOM
 * @param {Element} container 上次渲染的根节点
 * @param {boolean} destroyAll 是否移除已渲染的 DOM
 */
( container, destroyAll ) => {
  /** 获取在传入节点渲染时使用的 NodePart */
  const nodePart = renderParts.get( container );

  if( nodePart ){
    nodePart.destroyPart( true );
    renderParts.delete( container );
  }
}