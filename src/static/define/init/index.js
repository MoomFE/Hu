import initProps from "./initProps";
import initMethods from "./initMethods";
import initData from "./initData";
import initComputed from "./initComputed";
import initWatch from "./initWatch";
import initRootTarget from "./initRootTarget";
import initPrototype from "./initPrototype";
import initOptions from "./initOptions";
import initInfo from "./initInfo";


/**
 * 初始化当前组件属性
 * @param {HTMLElement} root 自定义元素组件节点
 * @param {{}} options 组件配置
 * @param {string} name 组件名称
 * @param {{}} userOptions 用户组件配置
 */
export default function init( root, options, name, userOptions ){

  const [
    target,
    targetProxy
  ] = initRootTarget();

  target.$el = root.attachShadow({ mode: 'open' });
  target.$customElement = root;

  initOptions( target, userOptions );
  initInfo( target, name );
  initPrototype( root, options, target, targetProxy );

  initProps( root, options, target, targetProxy );
  initMethods( options, target, targetProxy );
  initData( options, target, targetProxy );

  options.beforeCreate.call( targetProxy );

  initComputed( options, target, targetProxy );
  initWatch( options, target, targetProxy );

  options.created.call( targetProxy );

  return targetProxy;
}