import initProps from "./initProps";


/**
 * 初始化当前组件属性
 * @param {HTMLElement} root 组件根节点
 * @param {{}} options 组件配置
 */
export default function init( root, options ){
  /** 当前组件对象 */
  const target = {};
  /** 当前组件代理对象 */
  const targetProxy = new Proxy( target, {
    
  });

  target.$el = this.attachShadow({ mode: 'open' });
  target.$root = this;

  initProps( root, options, target, targetProxy );

  return targetProxy
}