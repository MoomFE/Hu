import initProps from "./initProps";


/**
 * 初始化当前组件属性
 * @param {HTMLElement} root 组件根节点
 * @param {{}} options 组件配置
 */
export default function init( root, options ){
  /** 当前组件对象 */
  const target = {};
  const targetProxy = new Proxy( target, {

  });

  initProps( root, options, target, targetProxy );

  return targetProxy
}