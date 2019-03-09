import initProps from "./initProps";
import initMethods from "./initMethods";
import initData from "./initData";
import initComputed from "./initComputed";
import initWatch from "./initWatch";
import initRootTarget from "./initRootTarget";
import initPrototype from "./initPrototype";


/**
 * 初始化当前组件属性
 * @param {HTMLElement} root 自定义元素组件节点
 * @param {{}} options 组件配置
 */
export default function init( root, options ){
  
  const [
    target,
    targetProxy,
    targetProxyInterceptor
  ] = initRootTarget();

  target.$el = root.attachShadow({ mode: 'open' });
  target.$customElement = root;

  initPrototype( root, options, target, targetProxyInterceptor );
  initProps( root, options, target, targetProxyInterceptor );
  initMethods( root, options, target, targetProxyInterceptor );
  initData( root, options, target, targetProxyInterceptor );

  options.beforeCreate.call( targetProxyInterceptor );

  initComputed( root, options, target, targetProxyInterceptor );
  initWatch( root, options, target, targetProxyInterceptor );

  options.created.call( targetProxyInterceptor );

  return targetProxyInterceptor;
}