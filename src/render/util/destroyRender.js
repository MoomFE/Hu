import { renderParts } from "../const";


export default
/**
 * 注销某个已渲染的节点
 * @param {Element} container 已渲染的根节点
 * @param {Boolean} onlyDirective 是否只注销指令
 */
( container, onlyDirective ) => {
  /** 获取在传入节点渲染时使用的 NodePart */
  const nodePart = renderParts.get( container );

  if( nodePart ){
    if( onlyDirective ){
      nodePart.destroyPart( onlyDirective );
    }else{
      nodePart.destroy();
    }
    renderParts.delete( container );
  }
}